import express, { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import Post, { IPost } from '../models/Post.js';

const router: Router = express.Router();

// GET /api/posts
router.get('/', async (req: Request, res: Response) => {
  try {
    const posts: IPost[] = await Post.find({}).sort({ createdAt: -1 }); // Fetch newest first
    res.json(posts);
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error fetching posts" });
  }
});

// POST /api/posts
router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate incoming data
    const { username, description, imagePath, profilePicPath } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Missing required field: username" });
    }

    const newPostData: Partial<IPost> = {
        username,
        description,
        imagePath,
        profilePicPath,
    };

    const createdPost = await Post.create(newPostData);
    res.status(201).json(createdPost); // 201 Created status
  } catch (error: any) {
    if (error instanceof mongoose.Error.ValidationError) {
      console.error("Post Validation Error:", error.message);
      return res.status(400).json({ error: error.message });
    }
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Failed to add post" });
  }
});

// TODO: add get, put routes for posts

export default router;