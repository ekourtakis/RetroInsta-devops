import mongoose from 'mongoose';
import { MONGO_URI, POSTS_COLLECTION } from '../config/index.js';
import Post, { IPost } from '../models/Post.js';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Successfully connected to MongoDB.");

    // Set up Mongoose connection event listeners
    mongoose.connection.on("error", (error: Error) => {
      console.error("Mongoose connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected.");
    });

  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit if cannot connect
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed successfully.');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
};

export const initializeData = async (): Promise<void> => {
  try {
    const count = await Post.countDocuments();
    if (count !- 0) {
      console.log(`Collection '${POSTS_COLLECTION}' already has ${count} documents. No data added.`);
      return;
    }

    console.log(`Collection '${POSTS_COLLECTION}' is empty, adding initial data...`);

    // Use Partial<IPost> because _id, createdAt, updatedAt are generated
    const initialPosts: Partial<IPost>[] = [
      { 
        username: "abby123", 
        profilePicPath: "/testimage/avatar.jpeg", 
        imagePath: "/testimage/mountain.jpeg", 
        description: "Check out this beautiful photo!" 
      },
      { 
        username: "benny_2000", 
        profilePicPath: "/testimage/man.jpeg", 
        imagePath: "/testimage/bridge.jpeg", 
        description: "This is a description! Cool beans." 
      },
      { 
        username: "char1ieIsC00L", 
        profilePicPath: "/testimage/avatar.jpeg", 
        imagePath: "/testimage/man.jpeg", 
        description: "hi benny :)" 
      },
      { 
        username: "danny_dev", 
        profilePicPath: "/testimage/dev.jpeg", 
        imagePath: "/testimage/code.jpeg", 
        description: "Coding is life!" 
      },
      { 
        username: "emma_writes", 
        profilePicPath: "/testimage/writer.jpeg", 
        imagePath: "/testimage/book.jpeg", 
        description: "Books are a uniquely portable magic." 
      }
    ];

    await Post.insertMany(initialPosts);

    console.log('Initial data added.');
  } catch (error) {
    console.error("Error initializing data:", error);
    throw error;
  }
};