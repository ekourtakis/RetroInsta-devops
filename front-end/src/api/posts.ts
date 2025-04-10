import { Post } from '../models/Post'; // Adjust path as necessary
import { CreatePostData } from '../models/CreatePostData'
import { CreateMinioPost } from '../models/CreateMinioPost'

/**
 * Fetches all posts from the backend.
 * @param apiUrl - The base URL of the backend API.
 * @returns A promise that resolves to an array of Post objects.
 */
export const getAllPosts = async (apiUrl: string): Promise<Post[]> => {
    if (!apiUrl) throw new Error("Backend API URL is not configured.");

    const targetUrl = `${apiUrl}/api/posts`;
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
 * @param apiUrl - The base URL of the backend API.
 * @param postData - The data for the new post (should include username).
 * @returns A promise that resolves to the newly created Post object.
 */
export const createPost = async (apiUrl: string, postData: CreatePostData & { username: string }): Promise<Post> => {
    if (!apiUrl) throw new Error("Backend API URL is not configured.");

    const minioUrl = `${apiUrl}/upload-with-presigned-url`;
    const targetUrl = `${apiUrl}/api/posts`;
    console.log(`[API] Creating post at: ${targetUrl}`, postData);

    const file = postData.imagePath;
    const fileName = postData.imagePath.name;
    const fileType = postData.imagePath.type;

    if (postData.imagePath instanceof File) {
        console.log("File details:");
        console.log("Name:", fileName);
        console.log("Type:", fileType); // type (e.g., image/jpeg)
    } else {
        console.log("imagePath is not a valid File object.");
    }

    const imageData = new FormData();
    imageData.append('file', file!);
    imageData.append('filename', fileName);
    imageData.append('fileType', fileType);
    let minioImagePath: string;

    try {
        // Request to generate the presigned URL
        const uploadResponse = await fetch(minioUrl, {
            method: "PUT",
            body: imageData,
        });

        // Check if the response is ok (status 200-299)
        if (!uploadResponse.ok) {
            const imageResponseData = await uploadResponse.json();
            console.error("Error uploading file:", imageResponseData);
            throw new Error("Error uploading file.");
        }

        // If the response is successful, parse the response as JSON and log the presigned URL
        const imageResponseData = await uploadResponse.json();
        console.log("view url: ", imageResponseData.viewUrl);
        minioImagePath = imageResponseData.viewUrl
    } catch (error) {
        console.error("[API] Error during file upload process:", error);
        throw error;  // Propagate error to be handled by the calling code
    }
    
    try {

        const newPostData : CreateMinioPost = {
            username: postData.username,
            profilePicPath: postData.profilePicPath,
            imagePath: minioImagePath,
            description: postData.description
        }
        
    const response = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(newPostData),
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