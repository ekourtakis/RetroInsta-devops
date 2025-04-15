import React from "react";
import "./PostFeed.css";
import { DisplayPost } from '../../models/Post';
import PostComponent from '../PostComponent/PostComponent';

interface PostFeedProps {
  posts: DisplayPost[]
}

const Feed: React.FC<PostFeedProps> = ({ posts }) => {
  return (
    <div className="feed">
      {posts.map((post) => (
        <PostComponent key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
