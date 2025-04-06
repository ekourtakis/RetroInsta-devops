// sets up MongoDB server
import mongoose, { mongo } from 'mongoose'
import express from 'express';
import cors from 'cors';

const DATABASE_DB = process.env.MONGO_INITDB_DATABASE;
const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_PORT = process.env.DATABASE_PORT;
const DATABASE_COLLECTION = process.env.DATABASE_COLLECTION;

const SERVER_HOST = process.env.SERVER_HOST;
const SERVER_PORT = process.env.SERVER_PORT;

const URI = `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_DB}`;

const postSchema = new mongoose.Schema({
  username: { type: String, required: true },
  profilePicPath: String,
  imagePath: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
})

const Post = mongoose.model('Post', postSchema, DATABASE_COLLECTION)

const app = express();
app.use(cors()); // Enable CORS to allow requests from frontend
app.use(express.json()); // Middleware to parse JSON request bodies

async function startServer() {
  try {
    await mongoose.connect(URI)
    console.log("Connected to mongodb through mongoose")
    
    await initializeData()

    app.get("/api/data", async (request, response) =>{
      try {
        const data = await Post.find({})
        response.json(data)
      } catch (error) {
        console.error("Error fetching data:", error)
        response.status(500).json({ error: "Internal server error" })
      }
    });

    app.post("/api/data", async(request, response) => {
      try {
        const newPostData = request.body

        const createdPost = await Post.create(newPostData)
        response.status(201).json(createdPost)
      } catch  (error) {
        if (error.name == "ValidationError") {
          return res.status(400).json({ error: error.message} )
        }
        
        console.error("error adding post:", error)
        response.status(500).json({ error: "failed to add post" })
      }
    });

    app.listen(SERVER_PORT, () => {
      console.log("server runnong on http://${SERVER_HOST):${SERVER_PORT}")
    })
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
          await Post.insertMany([
              { username: "abby123", profilePicPath: "/testimage/avatar.jpeg", imagePath: "/testimage/mountain.jpeg", description: "Check out this beautiful photo!" },
              { username: "benny_2000", profilePicPath: "/testimage/man.jpeg", imagePath: "/testimage/bridge.jpeg", description: "This is a description! Cool beans." },
              { username: "char1ieIsC00L", profilePicPath: "/testimage/avatar.jpeg", imagePath: "/testimage/man.jpeg", description: "hi benny :)" }
          ]);
          console.log('Dummy data added.');
      } else {
           console.log(`Collection '${DATABASE_COLLECTION}' already has ${count} documents.`);
      }
  } catch (error) {
      console.error("Error initializing data:", error);
  }
}

startServer()

mongoose.connection.on("error", error => {
  console.error("Mongoose connection error:", error)
})

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected")
})