import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { USERS_COLLECTION } from '../config/index.js';

export interface IUser extends Document {
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
  username: { type: String, required: true, unique: true, index: true },
  profilePicPath: { type: String, required: true },
  bio: { type: String, required: false },
  postIDs: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
}, {
  timestamps: true,
  collection: USERS_COLLECTION
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;