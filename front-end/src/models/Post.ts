export interface Post {
    id: number;
    username: string;
    profilePicPath: string;
    imagePath: string;
    description: string;
    likes: number;
    comments: Comment[];
}

export interface Comment {
    id: number;
    text: string;
    author: string;
  }
  