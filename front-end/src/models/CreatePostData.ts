export interface CreatePostData {
    username: string,
    profilePicPath?: string,
    imagePath: File | null,
    description: string
}