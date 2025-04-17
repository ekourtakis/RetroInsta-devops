import React from "react";
import "./PostFeed.css";
import { DisplayPost } from '../../models/Post';
import PostComponent from '../PostComponent/PostComponent';
import { User } from "../../models/User";

interface PostFeedProps {
  posts: DisplayPost[];
  appUser: User | null;
}

const Feed: React.FC<PostFeedProps> = ({ posts, appUser }) => {
  return (
    <div className="feed">
      {posts.map((post) => (
        <PostComponent 
          key={post._id} 
          post={post} 
          appUser={appUser} 
        />
      ))}
    </div>
  );
};

export default Feed;
