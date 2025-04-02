import React from "react";
import "./PostComponent.css";
import { Post as PostModel } from '../../models/Post';

interface PostComponentProps {
  post: PostModel;
}

const PostComponent: React.FC<PostComponentProps> = ({ post }) => {
  const { username, profilePicPath: avatar, imagePath: image, description } = post;

  return (
    <div className="post">
      <div className="post-header">
        <img className="avatar" src={avatar} alt={`${username}'s avatar`} />
        <span className="username">{username}</span>
      </div>
      <img className="post-image" src={image} alt={`Post by ${username}`} />
      <div className="post-content">
        <div className="post-actions">
          <span className="like" role="button" aria-label="Like post">❤️</span>
          <span className="comment" role="button" aria-label="Comment on post">💬</span>
        </div>
        <p className="post-description">
          {description}
        </p>
      </div>
    </div>
  );
};

export default PostComponent;