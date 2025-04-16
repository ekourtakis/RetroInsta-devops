import express, { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import Comment, { IComment } from '../models/Comment.js';

const router: Router = express.Router();

// GET /api/comments?postID={postID}
router.get('/', async (req: Request, res: Response) => {
  try {
    const postID = req.query.postID as string;
    if (!postID) {
      return res.status(400).json({ error: "postID query parameter is required" });
    }
    console.log("Fetching comments for postID:", postID);
    const comments: IComment[] = await Comment.find({postID: postID}).sort({ createdAt: -1 }); // Fetch newest first
    res.json(comments);
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Internal server error fetching comments" });
  }
});


// POST /api/comments
router.post('/', async (req: Request, res: Response) => {
  try {
    // Extract comment data from the request body
    let newCommentData: Partial<IComment> = req.body;
    
    // Create the comment in the database
    const createdComment = await Comment.create(newCommentData);

    res.status(201).json(createdComment); // 201 Created status
  } catch (error: any) {
    if (error instanceof mongoose.Error.ValidationError) {
      console.error("Comment Validation Error:", error.message);
      return res.status(400).json({ error: error.message });
    }
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

export default router;