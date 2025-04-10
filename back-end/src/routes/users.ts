import express, { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User.js';

const router: Router = express.Router();

// GET /api/users
router.get('/', async (req: Request, res: Response) => {
  try {
    const users: IUser[] = await User.find({});
    res.json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error fetching users" });
  }
});

// GET /api/users/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Optionally populate referenced posts: .populate('postIDs')
    const user: IUser | null = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error: any) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: "Internal server error fetching user" });
  }
});

// POST /api/users
router.post('/', async (req: Request, res: Response) => {
  try {
    const { googleId, email, username, profilePicPath, bio, postIDs } = req.body;

    // Robust validation
    if (!googleId || !email || !username || !profilePicPath) {
      return res.status(400).json({ error: "Missing required user fields (googleId, email, username, profilePicPath)" });
    }

    const newUser_Data: Partial<IUser> = {
      googleId,
      email,
      username,
      profilePicPath,
      bio: bio || '',
      postIDs: postIDs || [],
    };

    const createdUser = await User.create(newUser_Data);
    res.status(201).json(createdUser);

  } catch (error: any) {
    if (error instanceof mongoose.Error.ValidationError) {
      console.error("User Validation Error:", error.message);
      return res.status(400).json({ error: `Validation failed: ${error.message}` });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      console.error(`Duplicate key error on POST: ${field}`);
      return res.status(409).json({ error: `User creation failed: ${field} must be unique.` });
    }
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// PUT /api/users/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: Partial<IUser> = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Prevent updating immutable or sensitive fields from the request body
    delete updateData.googleId;
    delete updateData.email; // Usually email shouldn't be changed easily
    delete (updateData as any).createdAt;
    delete (updateData as any).updatedAt;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on update
      context: 'query' // Necessary for some validators on update
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found for update" });
    }

    res.json(updatedUser);
  } catch (error: any) {
    if (error instanceof mongoose.Error.ValidationError) {
      console.error("User Update Validation Error:", error.message);
      return res.status(400).json({ error: `Validation failed: ${error.message}` });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
        console.error(`Duplicate key error on PUT: ${field}`);
      return res.status(409).json({ error: `User update failed: ${field} must be unique.` });
    }
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});


export default router;