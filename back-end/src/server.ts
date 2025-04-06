import mongoose, { Document, Schema, Model, MongooseError, Types } from 'mongoose'
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const MONGO_DB = process.env.MONGO_DB;
const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = process.env.MONGO_PORT;
const USERS_COLLECTION = process.env.USERS_COLLECTION;
const POSTS_COLLECTION = process.env.POSTS_COLLECTION;

const SERVER_HOST = process.env.SERVER_HOST;
const SERVER_PORT = process.env.SERVER_PORT;

if (!MONGO_DB || !MONGO_HOST || !MONGO_PORT || !POSTS_COLLECTION 
  || !USERS_COLLECTION || !SERVER_PORT
) {
  console.error("Error: Missing required database environment variables!");
  process.exit(1);
}

const URI = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

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

    app.get("/api/posts", async (request, response) =>{
      try {
        const data: IPost[] = await Post.find({})
        response.json(data)
      } catch (error: any) {
        console.error("Error fetching data:", error)
        response.status(500).json({ error: "Internal server error" })
      }
    });

    app.post("/api/posts", async(request, response) => {
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

    app.listen(SERVER_PORT, () => {
      console.log("server runnong on http://${SERVER_HOST):${SERVER_PORT}")
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

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing MongoDB connection');
  await mongoose.connection.close();
  console.log('MongoDB connection closed. Exiting.');
  process.exit(0);
});
