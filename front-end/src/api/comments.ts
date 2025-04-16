import { AddCommentPayload, Comment } from '../models/Post';
import { BACKEND_URL } from './config';
/**
 * Fetches all comments from the backend based on the selected post.
 * @returns A promise that resolves to an array of Comment objects.
 */
export const getCommentsByPostId = async (postID: any): Promise<Comment[]> => {
    const targetUrl = `${BACKEND_URL}/api/comments`;
    console.log(`[API] Fetching comments from: ${targetUrl}`);

    try {
        const response = await fetch(`${targetUrl}?postID=${encodeURIComponent(postID)}`);
        console.log(`[API] Fetch comments response status: ${response.status}`);

        if (!response.ok) {
            // Try to get more specific error from response body if possible
            let errorData = { error: `Backend fetch comments failed with status ${response.status}` };
            try {
                errorData = await response.json();
            } catch (e) { /* Ignore parsing error if response wasn't JSON */ }
            throw new Error(errorData.error || `Backend fetch comments failed with status ${response.status}`);
        }

        const data = await response.json();
        
        console.log("[API] Comments fetched successfully:", data.length);
        
        return data as Comment[];
    } catch (error) {
        console.error(`[API] Network or parsing error fetching comments:`, error);
        if (error instanceof Error) throw error;
        throw new Error("An unknown error occurred while fetching comments.");
    }
};

/**
 * Adds a new comment to backend.
 * @param payload - The data for the new post including authorID and comment text.
 * @returns A promise that resolves to the newly created Comment object.
 */
export const addComment = async (payload: AddCommentPayload): Promise<Comment> => {
    const targetUrl = `${BACKEND_URL}/api/comments`;
    console.log(`[API] Adding comment at: ${targetUrl}`, payload);

    if (!payload.authorID || !payload.postID) { 
        throw new Error(
            "Missing required fields: authorID or postID in comment payload."
        );
    }
    
    try {
        const response = await fetch(targetUrl, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log(`[API] Add post response status: ${response.status}`);

        const responseData = await response.json();

        if (!response.ok) {
            const errorMessage = await `Backend add post failed with status ${response.status}`;
            console.error(`[API] Add post error response:`, errorMessage);
            throw new Error(errorMessage)
        }

        return responseData as Comment;
    } catch (error) {
        console.error(`[API] Network or parsing error adding comment:`, error);
        if (error instanceof Error) throw error;
        throw new Error("An unknown error occurred while adding the comment.");
    }
};