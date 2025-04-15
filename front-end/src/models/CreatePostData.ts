export interface CreatePostPayload {
    authorID: string; // unique mongo ID
    imageFile: File; // image to be uploaded
    description?: string; // optional description
}
    
export interface PostFormData {
    imageFile: File | null;
    description: string;
}
