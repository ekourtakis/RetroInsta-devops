import mongoose, { Document, Schema, Model } from 'mongoose';
import { POSTS_COLLECTION } from '../config/index.js';

export interface IPost extends Document {
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
  description: { type: String, required: false },
}, {
  timestamps: true, // creates createdAt and updatedAt fields
  collection: POSTS_COLLECTION
});

// mongoose model
const Post: Model<IPost> = mongoose.model<IPost>('Post', postSchema);

export default Post;