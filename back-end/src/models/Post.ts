import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { POSTS_COLLECTION } from '../config/index.js';

export interface IPost extends Document {
  _id: Types.ObjectId; // MongoDB ID

  authorID: string; // mongo ID of the user who authored the post
  
  imagePath?: string;
  description?: string;
  likes?: number;
  
  createdAt?: Date;
  updatedAt?: Date;
}

const postSchema: Schema<IPost> = new Schema({
  authorID: { type: String, required: true, index: true },
  imagePath: { type: String, required: true },
  description: { type: String, required: false },
  likes: { type: Number, default: 0 },
}, {
  timestamps: true, // creates createdAt and updatedAt fields
  collection: POSTS_COLLECTION
});

// mongoose model
const Post: Model<IPost> = mongoose.model<IPost>('Post', postSchema);

export default Post;