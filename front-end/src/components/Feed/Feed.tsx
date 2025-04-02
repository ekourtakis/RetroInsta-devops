import React from "react";
import "./Feed.css"; // Import the CSS file
import { Post } from '../../models/Post.ts'

const posts: Post[] = [
  {
    id: 1,
    username: "first_name",
    avatar: "testimage/avatar.jpeg",
    image: "testimage/mountain.jpeg",
    description: "description 1!",
  },
  {
    id: 2,
    username: "second284",
    avatar: "testimage/man.jpeg",
    image: "testimage/bridge.jpeg",
    description: "this sentence is a test",
  },
];

interface PostProps {
  username: string;
  avatar: string;
  image: string;
  description: string;
}

const PostComponent: React.FC<PostProps> = ({ username, avatar, image, description }) => {
  return (
    <div className="post">
      <div className="post-header">
        <img className="avatar" src={avatar} alt={username} />
        <span className="username">{username}</span>
      </div>
      <img className="post-image" src={image} alt="Post" />
      <div className="post-content">
        <div className="post-actions">
          <span className="like">❤️</span>
          <span className="comment">💬</span>
        </div>
        <p>
          <strong>{username}</strong> {description}
        </p>
      </div>
    </div>
  );
};

const Feed: React.FC = () => {
  return (
    <div className="feed">
      {posts.map((post) => (
        <PostComponent key={post.id} {...post} />
      ))}
    </div>
  );
};

export default Feed;
