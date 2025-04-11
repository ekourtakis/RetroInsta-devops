import express, { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User.js';

const router: Router = express.Router();

// POST /api/auth/google/login
router.post('/google/login', async (req: Request, res: Response) => {
  try {
    const { googleId, email, profilePicPath } = req.body;

    if (!googleId || !email) {
      return res.status(400).json({ error: "Missing required fields (googleId, email)" });
    }

    let user = await User.findOne({ googleId: googleId });

    if (user) {
      console.log(`User found: ${user.username}`);
      return res.status(200).json(user); // Return existing user
    }

    // If user doesn't exist, create a new one
    let username = email.split('@')[0]; // everything before the '@'
  
    const newUser_Data = {
      googleId: googleId,
      email: email,
      username: username,
      profilePicPath: profilePicPath
    };

    // Create user with only required fields, let mongoose handle defaults/timestamps
    const createdUser = await User.create(newUser_Data);

    console.log(`New user created: ${createdUser.username}`);
    res.status(201).json(createdUser); // 201 Created status
  } catch (error: any) {
    if (error instanceof mongoose.Error.ValidationError) {
      console.error("Validation Error:", error.message);
      return res.status(400).json({ error: error.message });
    }
    // Handle potential duplicate key errors during create
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];
      console.error(`Duplicate key error for field: ${field} with value: ${value}`);
      // Attempt to find the conflicting user to return it, simulating login
      if (field === 'googleId' || field === 'email') {
        const conflictingUser = await User.findOne({ [field]: value });
        if (conflictingUser) {
          console.warn(`Conflict resolved: Returning existing user with ${field}=${value}`);
          return res.status(200).json(conflictingUser);
        }
      }
      // If not resolved or duplicate is username, return conflict error
      return res.status(409).json({ error: `User creation failed: ${field} must be unique.` });
    }

    console.error("Error during Google login/user creation:", error);
    res.status(500).json({ error: "Internal server error during login process" });
  }
});

export default router; // Export the router