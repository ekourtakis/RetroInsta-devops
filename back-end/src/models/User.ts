import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { USERS_COLLECTION } from '../config/index.js';

export interface IUser extends Document {
  googleId: string;
  username: string;
  profilePicPath: string;
  bio?: string;
  
  authoredPostIDs: Types.ObjectId[];
  likedPostIDs: Types.ObjectId[];
  followingUserIDs: Types.ObjectId[];

  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema: Schema<IUser> = new Schema({
  googleId: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true
  },
  
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },

  profilePicPath: { 
    type: String, 
    required: true 
  },

  bio: { 
    type: String, 
    required: false 
  },
  
  authoredPostIDs: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Post', 
    required: false, 
    default: [] 
  }],

  likedPostIDs: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Post', 
    default: [] 
  }],
  
  followingUserIDs: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    default: [] 
  }],
}, {
  timestamps: true, // creates createdAt and updatedAt fields
  collection: USERS_COLLECTION
});

// mongoose model
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;