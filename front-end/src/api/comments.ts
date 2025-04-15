import { AddCommentPayload } from '../models/Post';
import { BACKEND_URL } from './config';

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