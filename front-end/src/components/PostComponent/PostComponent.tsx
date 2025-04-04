import React, { useState } from "react";
import "./PostComponent.css";
import { Post as PostModel } from "../../models/Post";

interface PostComponentProps {
  post: PostModel;
}

const PostComponent: React.FC<PostComponentProps> = ({ post }) => {
  const { username, profilePicPath: avatar, imagePath: image, description } = post;
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [comment, setComment] = useState("");

  /* hardcoded timestamp will be changed */
  const timestamp = "April 3, 2025 2:00 PM";


  const handleLike = () => {
    setLikes((prevLikes) => (isLiked ? prevLikes - 1 : prevLikes + 1));
    setIsLiked(!isLiked);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      setComments((prevComments) => [...prevComments, comment]); 
      setComment("");  
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        {avatar ? (
          <img className="avatar" src={avatar} alt={`${username}'s avatar`} />
        ) : (
          <div className="avatar-placeholder">👤</div>
        )}
        <span className="username">{username}</span>
      </div>

      {image ? (
        <img className="post-image" src={image} alt={`Post by ${username}`} />
      ) : (
        <div className="image-placeholder">📷 No Image</div>
      )}

      <div className="post-content">
        <p className="post-description">{description}</p>

        {/* Like & Comment Bar */}
        <div className="post-actions">
          <div className="like-section">
            <button 
              className={`like-button ${isLiked ? "liked" : ""}`} 
              onClick={handleLike}
              aria-label="Like post"
            >
              ❤️
            </button>
            <span className="like-count">{likes}</span>
          </div>

          {/* Comment section */}
          <div className="comment-section">
            <span className="comment-icon" role="button" aria-label="Comment on post">💬</span>
            <span className="comment-count">{comments.length}</span>
            <input 
              type="text" 
              className="comment-input"
              placeholder="Write a comment..."  
              value={comment}
              onChange={handleCommentChange}
            />
            <button 
              className="comment-submit"
              onClick={handleCommentSubmit}
              aria-label="Submit comment"
            >
              Post
            </button>
          </div>
        </div>

        {/* Display Comments */}
        <div className="comments-list">
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              <span className="comment-author">User {index + 1}: </span>
              <span className="comment-text">{comment}</span>
            </div>
          ))}
        </div>

        <div className="timestamp">{timestamp}</div>
      </div>
    </div>
  );
};

export default PostComponent;
