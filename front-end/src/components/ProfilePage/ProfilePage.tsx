import React from 'react';
import PostFeed from '../PostFeed/PostFeed';
import { Post } from '../../models/Post';
import './ProfilePage.css';

interface ProfilePageProps {
  user: {
    username: string;
    profilePicPath?: string;
  };
  posts: Post[];
  onLogout: () => void;
  onToggleCreatePostForm: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, posts}) => {
  const userPosts = posts.filter(post => post.username === user.username);

  return (
    <div className="profile-page ">
      
      <div className="profile-main-content" style={{ marginLeft: '10px', padding: '10px' }}>

        <div className="profile-header">
          <img
            src={user.profilePicPath || '/default-avatar.png'}
            alt="Profile"
            className="profile-avatar"
          />
          <h2>{user.username}</h2>
        </div>
        <h3 className="posts-title">Posts</h3>
        <PostFeed posts={userPosts} />
      </div>
    </div>
  );
};

export default ProfilePage;
