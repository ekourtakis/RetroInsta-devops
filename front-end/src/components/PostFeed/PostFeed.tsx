import React from "react";
import "./PostFeed.css";
import { Post } from '../../models/Post';
import PostComponent from '../PostComponent/PostComponent';

interface PostFeedProps {
  posts: Post[]
}

const Feed: React.FC<PostFeedProps> = ({ posts }) => {
  return (
    <div className="feed">
      {posts.map((post) => (
        <PostComponent key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;