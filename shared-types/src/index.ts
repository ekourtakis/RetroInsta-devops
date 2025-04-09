// Define ObjectIdString as a type alias for string
export type ObjectIdString = string;

export interface IUser {
    _id?: ObjectIdString; // Often useful to include the ID
    googleId: string;
    email: string;
    username: string;
    profilePicPath: string;
    bio?: string;
    // Represent array of ObjectIds as an array of strings
    postIDs: ObjectIdString[];
    createdAt?: Date | string; // Use string for JSON serialization consistency
    updatedAt?: Date | string; // Use string for JSON serialization consistency
}

export interface IComment {
    _id?: ObjectIdString; // Often useful to include the ID
    postID: ObjectIdString; // Reference to the post
    authorID: ObjectIdString; // Reference to the author
    createdAt?: Date | string; // Use string for JSON serialization consistency
    updatedAt?: Date | string; // Use string for JSON serialization consistency
    content: string; // Content of the comment
}

export interface IPost {
    _id?: ObjectIdString; // Often useful to include the ID
    username: string;
    profilePicPath?: string;
    imagePath?: string;
    description?: string;
    createdAt?: Date | string; // Use string for JSON serialization consistency
    updatedAt?: Date | string; // Use string for JSON serialization consistency
}