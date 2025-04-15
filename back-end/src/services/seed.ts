// src/scripts/seed.ts
import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import FormData from 'form-data';

// Configuration - Adjust path as needed
import {
    POSTS_COLLECTION,
    USERS_COLLECTION,
    SERVER_HOST,
    SERVER_PORT
} from '../config/config.js';

// Models - Adjust paths as needed
import Post, { IPost } from '../models/Post.js';
import User, { IUser } from '../models/User.js';

// --- Path Setup ---
// Get the directory name of the current module (src/scripts/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Calculate path to seed images relative to *this* file's location
// If seed-images is in the project root, it's two levels up from src/scripts/
const SEED_IMAGES_DIR = path.resolve(__dirname, '../../seed-images');

// --- Helper Function to Upload Seed Image via HTTP Route ---
// (Copied from the previous database.js version)
const uploadSeedImageViaRoute = async (filename: string): Promise<string> => {
    const filePath = path.join(SEED_IMAGES_DIR, filename);
    const targetUrl = `http://${SERVER_HOST}:${SERVER_PORT}/upload-with-presigned-url`;
    console.log(`[Seed Route Upload] Processing image: ${filename} -> PUT ${targetUrl}`);

    try {
        await fs.access(filePath); // Check existence
        const fileBuffer = await fs.readFile(filePath);
        const fileType = path.extname(filename).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';

        const formData = new FormData();
        formData.append('filename', filename);
        formData.append('fileType', fileType);
        formData.append('file', fileBuffer, { filename: filename, contentType: fileType });

        console.log(`[Seed Route Upload] Sending PUT request to ${targetUrl} for ${filename}`);
        const response = await axios.put(targetUrl, formData, {
            headers: { ...formData.getHeaders() },
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });
        console.log(`[Seed Route Upload] Response status for ${filename}: ${response.status}`);

        if (response.status === 200 && response.data?.viewUrl) {
            console.log(`[Seed Route Upload] Successfully uploaded ${filename}, URL: ${response.data.viewUrl}`);
            return response.data.viewUrl;
        } else {
            console.error(`[Seed Route Upload] Upload for ${filename} succeeded (status ${response.status}) but response data is unexpected:`, response.data);
            throw new Error(`Upload for ${filename} succeeded but response data is missing 'viewUrl'.`);
        }
    } catch (error: any) {
        console.error(`[Seed Route Upload] Error processing seed image ${filename} via route ${targetUrl}:`);
        if (axios.isAxiosError(error)) {
            console.error("Axios Error Status:", error.response?.status);
            console.error("Axios Error Data:", error.response?.data);
        } else {
             console.error("Error Type:", error.constructor.name);
             console.error("Error Message:", error.message);
             console.error("Error Stack:", error.stack);
        }
        throw new Error(`Failed to upload seed image ${filename} via route: ${error.message}`);
    }
};

// --- Main Seeding Function ---
/**
 * Checks if collections are empty and populates them with initial data,
 * uploading images via the application's upload route.
 * Assumes a database connection is already established.
 */
export const initializeData = async (): Promise<void> => {
    console.log("--- Starting Data Seeding Process ---");
    try {
        // --- Check Seed Image Directory ---
        try {
            await fs.access(SEED_IMAGES_DIR);
            console.log(`[Seed] Found seed image directory: ${SEED_IMAGES_DIR}`);
        } catch (err) {
            console.error(`❌ Error: Seed image directory not found at ${SEED_IMAGES_DIR}`);
            console.error(`Please create it and add the required image files.`);
            throw new Error(`Seed image directory missing: ${SEED_IMAGES_DIR}`);
        }

        // List of base filenames
        const availableImageFiles = [
            "avatar.jpeg", "bonsai.jpeg", "bridge.jpeg", "man.jpeg", "mountain.jpeg",
            "eye.jpeg", "camera.jpeg", "elephant.jpeg", "hooter.jpeg", "error.png",
            "crash.jpeg", "zion.jpeg", "joshua.jpeg", "goggles.jpeg", "puppy.jpeg",
            "jpeg.jpeg", "temple.jpeg", "spirit.jpeg", "12th-street.jpeg",
            "learning.jpeg", "stale.jpeg"
        ];

        // --- User Initialization ---
        const userCount = await User.countDocuments();
        let insertedUsers: (IUser & { _id: mongoose.Types.ObjectId })[] = [];

        if (userCount > 0) {
            console.log(`[Seed] Collection '${USERS_COLLECTION}' already populated. Skipping user seeding, fetching existing users.`);
            insertedUsers = await User.find().lean();
        } else {
            console.log(`[Seed] Seeding initial users for '${USERS_COLLECTION}'...`);
            const initialUserDefs = [
                { googleId: "abby123", username: "abby123", bio: "I love hiking and nature!" },
                { googleId: "benny_2000", username: "benny_2000", bio: "Tech enthusiast and software developer." },
                { googleId: "char1ieIsC00L", username: "char1ieIsC00L", bio: "Just a cool guy who loves coding." },
                { googleId: "danny_dev", username: "danny_dev", bio: "A developer who loves to create amazing things." },
                { googleId: "emma_writes", username: "emma_writes", bio: "Book lover and aspiring writer." },
                { googleId: "frankie_fox", username: "frankie_fox", bio: "Nature photographer and adventurer." },
                { googleId: "graceful_gal", username: "graceful_gal", bio: "Dancer and art lover." },
                { googleId: "harry_hiker", username: "harry_hiker", bio: "Exploring the world one trail at a time." },
                { googleId: "ivy_illustrator", username: "ivy_illustrator", bio: "Digital artist and coffee enthusiast." },
                { googleId: "jackson_jazz", username: "jackson_jazz", bio: "Musician and vinyl collector." },
                { googleId: "karen_knits", username: "karen_knits", bio: "Knitting my way through life." },
                { googleId: "leo_lens", username: "leo_lens", bio: "Capturing moments through my camera." },
                { googleId: "mia_muse", username: "mia_muse", bio: "Writer and dreamer." },
                { googleId: "nate_nomad", username: "nate_nomad", bio: "Traveling the world, one city at a time." },
                { googleId: "olivia_ocean", username: "olivia_ocean", bio: "Beach lover and marine biologist." },
                { googleId: "peter_painter", username: "peter_painter", bio: "Painting the world in vibrant colors." },
                { googleId: "quincy_quill", username: "quincy_quill", bio: "Poet and storyteller." },
                { googleId: "ruby_runner", username: "ruby_runner", bio: "Marathoner and fitness enthusiast." },
                { googleId: "sam_sculptor", username: "sam_sculptor", bio: "Sculpting life one piece at a time." },
                { googleId: "tina_traveler", username: "tina_traveler", bio: "Wanderlust and cultural explorer." },
                { googleId: "ulysses_uplift", username: "ulysses_uplift", bio: "Motivational speaker and life coach." },
                { googleId: "violet_vision", username: "violet_vision", bio: "Fashion designer and trendsetter." },
                { googleId: "will_writer", username: "will_writer", bio: "Author and creative thinker." },
                { googleId: "xena_xplorer", username: "xena_xplorer", bio: "Explorer of the unknown." },
                { googleId: "yara_yogi", username: "yara_yogi", bio: "Yoga instructor and wellness advocate." },
                { googleId: "zane_zenith", username: "zane_zenith", bio: "Tech innovator and entrepreneur." }
            ];

            const usersToInsertPromises = initialUserDefs.map(async (userDef) => {
                const randomImageFile = availableImageFiles[Math.floor(Math.random() * availableImageFiles.length)];
                const profilePicUrl = await uploadSeedImageViaRoute(randomImageFile);
                return {
                    ...userDef,
                    profilePicPath: profilePicUrl
                };
            });

            const usersToInsert = await Promise.all(usersToInsertPromises);

            console.log('[Seed] Inserting initial user data into MongoDB...');
            insertedUsers = await User.insertMany(usersToInsert);
            console.log(`[Seed] ${insertedUsers.length} initial users added.`);
        }

        // --- Post Initialization ---
        const postCount = await Post.countDocuments();
        if (postCount > 0) {
            console.log(`[Seed] Collection '${POSTS_COLLECTION}' already populated. Skipping post seeding.`);
        } else {
             if (insertedUsers.length === 0) {
                console.warn("[Seed] No users available (either skipped or failed). Cannot seed posts.");
             } else {
                console.log(`[Seed] Seeding initial posts for '${POSTS_COLLECTION}'...`);
                const totalPostsToCreate = 100;
                const postDataPromises = Array.from({ length: totalPostsToCreate }).map(async (_, i) => {
                    const randomUser = insertedUsers[Math.floor(Math.random() * insertedUsers.length)];
                    const randomImageFile = availableImageFiles[Math.floor(Math.random() * availableImageFiles.length)];
                    const postImageUrl = await uploadSeedImageViaRoute(randomImageFile);
                    return {
                        authorID: randomUser._id.toString(),
                        imagePath: postImageUrl,
                        description: `Post #${i + 1} by ${randomUser.username}. Seeded via route.`,
                        likes: Math.floor(Math.random() * 100),
                    };
                });

                const postsToInsert = await Promise.all(postDataPromises);
                console.log(`[Seed] All ${totalPostsToCreate} post images processed via route.`);

                console.log('[Seed] Inserting initial post data into MongoDB...');
                await Post.insertMany(postsToInsert);
                console.log(`[Seed] ${totalPostsToCreate} initial posts added.`);
             }
        }
        console.log("--- Data Seeding Process Completed Successfully ---");

    } catch (error) {
        console.error("--- Error During Data Seeding Process ---");
        console.error(error);
        // Re-throw the error so the calling function (startServer) knows it failed
        throw error;
    }
};