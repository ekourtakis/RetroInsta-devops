import React, { useState } from "react";
import "./PostComponent.css";
import { Post as PostModel } from "../../models/Post";

interface PostComponentProps {
  post: PostModel;
}

const PostComponent: React.FC<PostComponentProps> = ({ post }) => {
  const { username, profilePicPath: avatar, imagePath: image, description } = post;
  
  // State for likes
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <div className="post">
      <div className="post-header">
        <img className="avatar" src={avatar} alt={`${username}'s avatar`} />
        <span className="username">{username}</span>
      </div>
      <img className="post-image" src={image} alt={`Post by ${username}`} />
      <div className="post-content">
        <div className="post-actions">
          <button 
            className={`like-button ${isLiked ? "liked" : ""}`} 
            onClick={handleLike}
            aria-label="Like post"
          >
            ❤️ {likes}
          </button>
          <span className="comment" role="button" aria-label="Comment on post">💬</span>
        </div>
        <p className="post-description">{description}</p>
      </div>
    </div>
  );
};

export default PostComponent;
