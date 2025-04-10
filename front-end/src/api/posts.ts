import { Post } from '../models/Post'; // Adjust path as necessary
import { CreatePostData } from '../components/CreatePostForm/CreatePostForm'; // Adjust path
import { BACK_END_URL } from './config';

if (!BACK_END_URL) throw new Error("Backend API URL is not configured.");

/**
 * Fetches all posts from the backend.
 * @returns A promise that resolves to an array of Post objects.
 */
export const getAllPosts = async (): Promise<Post[]> => {
    const targetUrl = `${BACK_END_URL}/api/posts`;
    console.log(`[API] Fetching posts from: ${targetUrl}`);

    try {
        const response = await fetch(targetUrl);
        console.log(`[API] Fetch posts response status: ${response.status}`);

        if (!response.ok) {
            // Try to get more specific error from response body if possible
            let errorData = { error: `Backend fetch posts failed with status ${response.status}` };
            try {
                errorData = await response.json();
            } catch (e) { /* Ignore parsing error if response wasn't JSON */ }
            throw new Error(errorData.error || `Backend fetch posts failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log("[API] Posts fetched successfully:", data.length);
        return data as Post[];

    } catch (error) {
        console.error(`[API] Network or parsing error fetching posts:`, error);
        if (error instanceof Error) throw error;
        throw new Error("An unknown error occurred while fetching posts.");
    }
};

/**
 * Creates a new post on the backend.
 * @param postData - The data for the new post (should include username).
 * @returns A promise that resolves to the newly created Post object.
 */
export const createPost = async (postData: CreatePostData & { username: string }): Promise<Post> => {
     const targetUrl = `${BACK_END_URL}/api/posts`;
     console.log(`[API] Creating post at: ${targetUrl}`, postData);

     try {
        const response = await fetch(targetUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(postData),
        });
        console.log(`[API] Create post response status: ${response.status}`);

        const responseData = await response.json(); // Parse JSON response

        if (!response.ok) {
            const errorMessage = responseData?.error || `Backend create post failed with status ${response.status}`;
            console.error(`[API] Error creating post: ${errorMessage}`, responseData);
            throw new Error(errorMessage);
        }

        console.log("[API] Post created successfully:", responseData);
        return responseData as Post; // Assume response matches Post structure

     } catch (error) {
        console.error(`[API] Network or parsing error creating post:`, error);
        if (error instanceof Error) throw error;
        throw new Error("An unknown error occurred while creating the post.");
     }
};