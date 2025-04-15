import { User } from './User';

export interface BackendPost {
    _id: string;
    authorID: string;
    profilePicPath: string;
    imagePath: string;
    description?: string;
    likes: number;
    createdAt: string;
    updatedAt: string;
}

export interface DisplayPost extends Omit<BackendPost, 'authorID'> {
    author: User; // this will be populated with the user data from the backend
}

export interface Comment {
    _id: number;
    commentText: string;
    authorID: string;
    postID: string;
}

export interface AddCommentPayload {
    authorID: string;
    postID: string;
    commentText: string;
}