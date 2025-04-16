import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { COMMENTS_COLLECTION, POSTS_COLLECTION } from '../config/config.js';

export interface IComment extends Document {
  _id: Types.ObjectId; // MongoDB ID

  authorID: string; // mongo ID of the user who authored the comment
  postID: string; // mongo ID of the post where comment is placed

  commentText: string;
  
  createdAt?: Date;
  updatedAt?: Date;
}

const commentSchema: Schema<IComment> = new Schema({
  authorID: { type: String, required: true, index: true },
  postID: { type: String, required: true, index: true },
  commentText: { type: String, required: true },
}, {
  timestamps: true, // creates createdAt and updatedAt fields
  collection: COMMENTS_COLLECTION
});

// mongoose model
const Comment: Model<IComment> = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;