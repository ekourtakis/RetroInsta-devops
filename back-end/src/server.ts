import mongoose, { Document, Schema, Model, MongooseError, Types } from 'mongoose'
import express, { Request, Response, NextFunction, response } from 'express';
import { Client as MinioClient } from "minio";
import axios from "axios";
import multer, { Multer } from "multer";
import cors from 'cors';

const MONGO_DB = process.env.MONGO_DB;
const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = process.env.MONGO_PORT;
const USERS_COLLECTION = process.env.USERS_COLLECTION;
const POSTS_COLLECTION = process.env.POSTS_COLLECTION;

const SERVER_HOST = process.env.SERVER_HOST;
const SERVER_PORT = process.env.SERVER_PORT;

if ( 
  !MONGO_DB || !MONGO_HOST || !MONGO_PORT || 
  !POSTS_COLLECTION || !USERS_COLLECTION || !SERVER_PORT
) {
  console.error("Error: Missing required database environment variables!");
  process.exit(1);
}

const URI = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;
const USERS_ENDPOINT = `/api/${USERS_COLLECTION}`;
const POSTS_ENDPOINT = `/api/${POSTS_COLLECTION}`;

// Minio Environment variables
const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT!;
const MINIO_PORT = parseInt(process.env.MINIO_PORT!);
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY!;
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY!;
const MINIO_BUCKET = process.env.MINIO_BUCKET!;

if (!MINIO_ENDPOINT || !MINIO_ACCESS_KEY || !MINIO_SECRET_KEY || !MINIO_BUCKET) {
  throw new Error("Missing required Minio environment variables");
}

// MinIO client
const minioClient = new MinioClient({
  endPoint: MINIO_ENDPOINT,
  port: MINIO_PORT,
  useSSL: false,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
});

const upload: Multer = multer({ storage: multer.memoryStorage() });

interface IPost {
  username: string
  profilePicPath?: string
  imagePath?: string
  description?: string
  createdAt?: Date
}

const postSchema: Schema<IPost> = new Schema({
  username: { type: String, required: true },
  profilePicPath: String,
  imagePath: String,
  description: String,
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
})

const Post: Model<IPost> = mongoose.model<IPost>('Post', postSchema, POSTS_COLLECTION)

interface IUser {
  googleId: string;
  email: string;
  username: string;
  profilePicPath: string;
  bio?: string;
  postIDs: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema: Schema<IUser> = new Schema({
  googleId: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true, unique: true, index: true }, // Ensure unique usernames
  profilePicPath: { type: String, required: true }, // Assuming path is required
  bio: { type: String, required: false },
  // Array of ObjectIds referencing the 'Post' model. Mongoose handles the link.
  postIDs: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
})

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema, USERS_COLLECTION)

const app = express();
app.use(cors()); // Enable CORS to allow requests from frontend
app.use(express.json()); // Middleware to parse JSON request bodies

async function startServer() {
  try {
    await mongoose.connect(URI)
    console.log("Connected to mongodb through mongoose")
    
    await initializeData()

    // google login endpoint
    app.post(`/api/auth/google/login`, async (request, response) => {
      try {
        const { googleId, email, username, profilePicPath } = request.body;

        if (!googleId || !email) {
          return response.status(400).json({ error: "Missing required fields (googleId, email)" });
        }

        let user = await User.findOne({ googleId: googleId });

        if (user) {
          console.log(`user found: ${user.username}`);
          return response.status(200).json(user); // return existing user
        }

        // If user doesn't exist, create a new one
        let newUserName = email.split('@')[0];
        

        const newUser_Data: Omit<IUser, 'createdAt' | 'updatedAt'> = { // Use Omit to exclude auto-generated fields
          googleId: googleId,
          email: email,
          username: newUserName, // Use the generated unique username
          profilePicPath: profilePicPath, // Use Google picture or a default
          postIDs: [], // Initialize with empty posts
          bio: '', // Initialize with empty bio
        };

        const createdUser = await User.create(newUser_Data);
        console.log(`New user created: ${createdUser.username}`);
        response.status(201).json(createdUser); // 201 Created status
      } catch (error: any) {
        if (error instanceof mongoose.Error.ValidationError) {
          console.error("Validation Error:", error.message);
          return response.status(400).json({ error: error.message });
        }
        // Handle potential duplicate key errors during create
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            console.error(`Duplicate key error for field: ${field}`);
            // You might want to fetch the user that caused the conflict here if needed
            return response.status(409).json({ error: `User creation failed: ${field} must be unique.` });
        }

        // General catch-all for other errors
        console.error("Error during Google login/user creation:", error);
        response.status(500).json({ error: "Internal server error during login process" });
      }
    });

    // get all posts endpoint
    app.get(POSTS_ENDPOINT, async (request, response) =>{
      try {
        const data: IPost[] = await Post.find({})
        response.json(data)
      } catch (error: any) {
        console.error("Error fetching data:", error)
        response.status(500).json({ error: "Internal server error" })
      }
    });

    app.post(POSTS_ENDPOINT, async(request, response) => {
      try {
        const newPostData: Partial<IPost> = request.body

        const createdPost = await Post.create(newPostData)
        response.status(201).json(createdPost)
      } catch  (error: any) {
        if (error instanceof mongoose.Error.ValidationError) {
          response.status(400).json({ error: error.message} )
          return
        }
        
        console.error("error adding post:", error)
        response.status(500).json({ error: "failed to add post" })
      }
    });

    // GET all users
    app.get(USERS_ENDPOINT, async (request, response) => {
      try {
        const users: IUser[] = await User.find({});
        response.json(users);
      } catch (error: any) {
        console.error("Error fetching users:", error);
        response.status(500).json({ error: "Internal server error fetching users" });
      }
    });

    // GET a single user by ID
    app.get(`${USERS_ENDPOINT}/:id`, async (request, response) => {
      try {
        const { id } = request.params;

        // Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return response.status(400).json({ error: "Invalid user ID format" });
        }

        const user: IUser | null = await User.findById(id); //.populate('postIDs'); // Optionally populate posts

        if (!user) {
          return response.status(404).json({ error: "User not found" });
        }

        response.json(user);
      } catch (error: any) {
        console.error("Error fetching user by ID:", error);
        response.status(500).json({ error: "Internal server error fetching user" });
      }
    });

    // POST (Create) a new user
    app.post(USERS_ENDPOINT, async (request, response) => {
      try {
        const newUser_Data: Partial<IUser> = request.body;

        // Basic validation (you might add more robust validation)
        if (!newUser_Data.googleId || !newUser_Data.email || !newUser_Data.username || !newUser_Data.profilePicPath) {
          return response.status(400).json({ error: "Missing required user fields (googleId, email, username, profilePicPath)" });
        }

        // Ensure postIDs is an empty array if not provided
        if (!newUser_Data.postIDs) {
            newUser_Data.postIDs = [];
        }

        const createdUser = await User.create(newUser_Data);
        response.status(201).json(createdUser); // 201 Created status

      } catch (error: any) {
        if (error instanceof mongoose.Error.ValidationError) {
          return response.status(400).json({ error: `Validation failed: ${error.message}` });
        }
        // Handle duplicate key errors (e.g., unique email, username, googleId)
        if (error.code === 11000) {
          // Extract the field that caused the error if possible
          const field = Object.keys(error.keyPattern)[0];
          return response.status(409).json({ error: `User creation failed: ${field} must be unique.` }); // 409 Conflict
        }
        console.error("Error creating user:", error);
        response.status(500).json({ error: "Failed to create user" });
      }
    });

    // PUT (Update) a user by ID
    app.put(`${USERS_ENDPOINT}/:id`, async (request, response) => {
      try {
        const { id } = request.params;
        const updateData: Partial<IUser> = request.body;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return response.status(400).json({ error: "Invalid user ID format" });
        }

        // Prevent updating immutable fields like googleId or _id from request body
        delete updateData.googleId;
        // delete (updateData as any)._id; // Ensure _id is not in the update payload

        const updatedUser = await User.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        });

        if (!updatedUser) {
          return response.status(404).json({ error: "User not found for update" });
        }

        response.json(updatedUser);
      } catch (error: any) {
        if (error instanceof mongoose.Error.ValidationError) {
          return response.status(400).json({ error: `Validation failed: ${error.message}` });
        }
        // Handle potential duplicate key errors on update (e.g., changing username to an existing one)
        if (error.code === 11000) {
          const field = Object.keys(error.keyPattern)[0];
          return response.status(409).json({ error: `User update failed: ${field} must be unique.` });
        }
        console.error("Error updating user:", error);
        response.status(500).json({ error: "Failed to update user" });
      }
    });

    app.put("/upload-with-presigned-url", upload.single('file'), async (req: Request, res: Response) => {
      try {
        const { filename, fileType } = req.body;
        const fileBuffer = req.file?.buffer;
    
        if (!filename || !fileType || !fileBuffer) {
          return res.status(400).json({ error: "Missing filename, fileType, or fileBuffer" });
        }
    
        // Generate the presigned URL using the provided details (if needed)
        const presignedUrlResponse = await axios.post("http://localhost:7005/api/generate-presigned-url", {
          filename,
          fileType,
        });
    
        const presignedUrl = presignedUrlResponse.data.presignedUrl;
        const viewUrl = presignedUrlResponse.data.publicUrl;
    
        // Upload the file to MinIO using the presigned URL
        await axios.put(presignedUrl, fileBuffer, {
          headers: {
            "Content-Type": fileType,
          },
        });
    
        res.status(200).json({
          message: "File uploaded successfully!",
          viewUrl,
        });
      } catch (error) {
        console.error("Error uploading file with presigned URL:", error);
        res.status(500).json({ error: "Error uploading file with presigned URL" });
      }
    });

    app.post("/api/generate-presigned-url", async (req: Request, res: Response) => {
      try {
        const { filename, fileType } = req.body;

        // Log the received values for debugging
        console.log(`Received filename: ${filename}`);
        console.log(`Received fileType: ${fileType}`);
    
        if (!filename || !fileType) {
          return res.status(400).json({ error: "Missing filename or fileType" });
        }
    
        // Generate a pre-signed URL that expires in 24 hours
        const presignedUrl = await minioClient.presignedPutObject(
          MINIO_BUCKET,
          filename,
          24 * 60 * 60 // 24 hours
        );

        console.log(`Generated presigned URL: ${presignedUrl}`);

        const publicHost = 'localhost:9000'; // or your custom domain
        const publicUrl = `http://${publicHost}/${MINIO_BUCKET}/${filename}`;
    
        res.status(200).json({
          presignedUrl,
          publicUrl,
        });
      } catch (error) {
        console.error("Error generating pre-signed URL:", error);
        res.status(500).json({ error: "Failed to generate pre-signed URL" });
      }
    });

    app.listen(SERVER_PORT, () => {
      console.log("server running on http://${SERVER_HOST):${SERVER_PORT}")
    });
  } catch (error) {
    console.error("Failed to connect to mongo or start server:", error)
    process.exit(1)
  }
}

async function initializeData() {
  try {
      const count = await Post.countDocuments();
      if (count === 0) {
          console.log('Collection is empty, adding dummy data...');

          const initialPosts: IPost[] = [
            { username: "abby123", profilePicPath: "/testimage/avatar.jpeg", imagePath: "/testimage/mountain.jpeg", description: "Check out this beautiful photo!" },
            { username: "benny_2000", profilePicPath: "/testimage/man.jpeg", imagePath: "/testimage/bridge.jpeg", description: "This is a description! Cool beans." },
            { username: "char1ieIsC00L", profilePicPath: "/testimage/avatar.jpeg", imagePath: "/testimage/man.jpeg", description: "hi benny :)" }
          ];

          await Post.insertMany(initialPosts);

          console.log('Dummy data added.');
      } else {
           console.log(`Collection '${POSTS_COLLECTION}' already has ${count} documents.`);
      }
  } catch (error) {
      console.error("Error initializing data:", error);
  }
}

startServer()

mongoose.connection.on("error", (error: Error) => {
  console.error("Mongoose connection error:", error)
})

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected")
})

// process.on('SIGINT', async () => {
//   console.log('SIGINT signal received: closing MongoDB connection');
//   await mongoose.connection.close();
//   console.log('MongoDB connection closed. Exiting.');
//   process.exit(0);
// });
