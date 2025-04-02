import React from "react";
import "./Feed.css"; // Import the CSS file

// we need this for now, but later we'll move this model to a dedicated folder 
interface Post {
  id: number;
  username: string;
  avatar: string;
  image: string;
  description: string;
}

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

const Post: React.FC<PostProps> = ({ username, avatar, image, description }) => {
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
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
};

export default Feed;
