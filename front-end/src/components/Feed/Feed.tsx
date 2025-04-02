import React from "react";
import "./Feed.css";
import { Post } from '../../models/Post';
import PostComponent from '../PostComponent/PostComonent';

const posts: Post[] = [
  {
    id: 1,
    username: "first_name",
    avatar: "/testimage/avatar.jpeg",
    image: "/testimage/mountain.jpeg",
    description: "description 1!",
  },
  {
    id: 2,
    username: "second284",
    avatar: "/testimage/man.jpeg",
    image: "/testimage/bridge.jpeg",
    description: "this sentence is a test",
  },
];

const Feed: React.FC = () => {
  return (
    <div className="feed">
      {posts.map((post) => (
        <PostComponent key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;