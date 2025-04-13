import mongoose from 'mongoose';
import { MONGO_URI, POSTS_COLLECTION, USERS_COLLECTION } from '../config/index.js';
import Post, { IPost } from '../models/Post.js';
import User, { IUser } from '../models/User.js';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Successfully connected to MongoDB.");

    // Set up Mongoose connection event listeners
    mongoose.connection.on("error", (error: Error) => {
      console.error("Mongoose connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected.");
    });

  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit if cannot connect
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed successfully.');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
};

export const initializeData = async (): Promise<void> => {
  try {
    const userCount = await User.countDocuments();
    if (userCount != 0) {
      console.log(`Collection '${USERS_COLLECTION}' already has ${userCount} documents. No data added.`);
      return;
    }

    console.log(`Collection '${USERS_COLLECTION}' is empty, adding initial data...`);

    const imagePaths = [
      "avatar.jpeg",
      "bonsai.jpeg",
      "bridge.jpeg",
      "man.jpeg",
      "mountain.jpeg",
      "eye.jpeg",
      "camera.jpeg",
      "elephant.jpeg",
      "hooter.jpeg",
      "error.png",
      "crash.jpeg",
      "zion.jpeg",
      "joshua.jpeg",
      "goggles.jpeg",
      "puppy.jpeg",
      "jpeg.jpeg",
      "temple.jpeg",
      "spirit.jpeg",
      "12th-street.jpeg",
      "learning.jpeg",
      "stale.jpeg"
    ]

    const initialUsers: Partial<IUser>[] = [
      {
      googleId: "abby123",
      username: "abby123",
      profilePicPath: `testimage/${imagePaths[Math.floor(Math.random() * imagePaths.length)]}`,
      bio: "I love hiking and nature!",
      },
      {
      googleId: "benny_2000",
      username: "benny_2000",
      profilePicPath: `/${imagePaths[Math.floor(Math.random() * imagePaths.length)]}`,
      bio: "Tech enthusiast and software developer.",
      },
      {
      googleId: "char1ieIsC00L",
      username: "char1ieIsC00L",
      profilePicPath: `/${imagePaths[Math.floor(Math.random() * imagePaths.length)]}`,
      bio: "Just a cool guy who loves coding.",
      },
      {
      googleId: "danny_dev",
      username: "danny_dev",
      profilePicPath: `/${imagePaths[Math.floor(Math.random() * imagePaths.length)]}`,
      bio: "A developer who loves to create amazing things.",
      },
      {
      googleId: "emma_writes",
      username: "emma_writes",
      profilePicPath: `/${imagePaths[Math.floor(Math.random() * imagePaths.length)]}`,
      bio: "Book lover and aspiring writer.",
      },
      {
      googleId: "frankie_fox",
      username: "frankie_fox",
      profilePicPath: `/${imagePaths[Math.floor(Math.random() * imagePaths.length)]}`,
      bio: "Nature photographer and adventurer.",
      },
      {
      googleId: "graceful_gal",
      username: "graceful_gal",
      profilePicPath: `/${imagePaths[Math.floor(Math.random() * imagePaths.length)]}`,
      bio: "Dancer and art lover.",
      },
      {
      googleId: "harry_hiker",
      username: "harry_hiker",
      profilePicPath: `/${imagePaths[Math.floor(Math.random() * imagePaths.length)]}`,
      bio: "Exploring the world one trail at a time.",
      },
      {
      googleId: "ivy_illustrator",
        username: "ivy_illustrator",
        profilePicPath: "/testimage/avatar.jpeg",
        bio: "Digital artist and coffee enthusiast.",
      },
      {
        googleId: "jackson_jazz",
        username: "jackson_jazz",
        profilePicPath: "/testimage/man.jpeg",
        bio: "Musician and vinyl collector.",
      },
      {
        googleId: "karen_knits",
        username: "karen_knits",
        profilePicPath: "/testimage/avatar.jpeg",
        bio: "Knitting my way through life.",
      },
      {
        googleId: "leo_lens",
        username: "leo_lens",
        profilePicPath: "/testimage/man.jpeg",
        bio: "Capturing moments through my camera.",
      },
      {
        googleId: "mia_muse",
        username: "mia_muse",
        profilePicPath: "/testimage/avatar.jpeg",
        bio: "Writer and dreamer.",
      },
      {
        googleId: "nate_nomad",
        username: "nate_nomad",
        profilePicPath: "/testimage/man.jpeg",
        bio: "Traveling the world, one city at a time.",
      },
      {
        googleId: "olivia_ocean",
        username: "olivia_ocean",
        profilePicPath: "/testimage/avatar.jpeg",
        bio: "Beach lover and marine biologist.",
      },
      {
        googleId: "peter_painter",
        username: "peter_painter",
        profilePicPath: "/testimage/man.jpeg",
        bio: "Painting the world in vibrant colors.",
      },
      {
        googleId: "quincy_quill",
        username: "quincy_quill",
        profilePicPath: "/testimage/avatar.jpeg",
        bio: "Poet and storyteller.",
      },
      {
        googleId: "ruby_runner",
        username: "ruby_runner",
        profilePicPath: "/testimage/avatar.jpeg",
        bio: "Marathoner and fitness enthusiast.",
      },
      {
        googleId: "sam_sculptor",
        username: "sam_sculptor",
        profilePicPath: "/testimage/man.jpeg",
        bio: "Sculpting life one piece at a time.",
      },
      {
        googleId: "tina_traveler",
        username: "tina_traveler",
        profilePicPath: "/testimage/avatar.jpeg",
        bio: "Wanderlust and cultural explorer.",
      },
      {
        googleId: "ulysses_uplift",
        username: "ulysses_uplift",
        profilePicPath: "/testimage/man.jpeg",
        bio: "Motivational speaker and life coach.",
      },
      {
        googleId: "violet_vision",
        username: "violet_vision",
        profilePicPath: "/testimage/avatar.jpeg",
        bio: "Fashion designer and trendsetter.",
      },
      {
        googleId: "will_writer",
        username: "will_writer",
        profilePicPath: "/testimage/man.jpeg",
        bio: "Author and creative thinker.",
      },
      {
        googleId: "xena_xplorer",
        username: "xena_xplorer",
        profilePicPath: "/testimage/avatar.jpeg",
        bio: "Explorer of the unknown.",
      },
      {
        googleId: "yara_yogi",
        username: "yara_yogi",
        profilePicPath: "/testimage/avatar.jpeg",
        bio: "Yoga instructor and wellness advocate.",
      },
      {
        googleId: "zane_zenith",
        username: "zane_zenith",
        profilePicPath: "/testimage/man.jpeg",
        bio: "Tech innovator and entrepreneur.",
      }
    ];

    // Insert initial users and retrieve their IDs
    const insertedUsers = await User.insertMany(initialUsers);
    console.log('Initial user data added.');

    const postCount = await Post.countDocuments();
    if (postCount != 0) {
      console.log(`Collection '${POSTS_COLLECTION}' already has ${postCount} documents. No data added.`);
      return;
    }

    console.log(`Collection '${POSTS_COLLECTION}' is empty, adding initial data...`);

    // Dynamically generate 100 posts with random users
    const initialPosts: Partial<IPost>[] = Array.from({ length: 100 }, () => {
      const randomUser = insertedUsers[Math.floor(Math.random() * insertedUsers.length)];
      return {
      authorID: randomUser._id as string, // Explicitly cast _id to string
      imagePath: `testimage/${imagePaths[Math.floor(Math.random() * imagePaths.length)]}`, // Example: Generate unique image paths
      description: `This is a post by ${randomUser.username}.`, // Example: Generate descriptions
      likes: Math.floor(Math.random() * 100), // Random number of likes
      };
    });

    await Post.insertMany(initialPosts);
    console.log('Initial posts added.');
  } catch (error) {
    console.error("Error initializing data:", error);
    throw error;
  }
};