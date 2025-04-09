import mongoose, { Document, Schema, Model } from 'mongoose';
import { POSTS_COLLECTION } from '../config/index.js'; // Import collection name

export interface IPost extends Document { // Extend Document for Mongoose methods
  username: string;
  profilePicPath?: string;
  imagePath?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const postSchema: Schema<IPost> = new Schema({
  username: { type: String, required: true, index: true },
  profilePicPath: { type: String, required: false },
  imagePath: { type: String, required: true },
  description: { type: String, required: false },   // Mark as optional if needed
}, {
  timestamps: true,
  collection: POSTS_COLLECTION
});

// Mongoose Model for Posts
const Post: Model<IPost> = mongoose.model<IPost>('Post', postSchema);

export default Post; // Export the model as default