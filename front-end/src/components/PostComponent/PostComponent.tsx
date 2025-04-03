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

  // State for comment input and count
  const [comment, setComment] = useState("");
  const [commentCount, setCommentCount] = useState(3);  // Initialize with 3 hardcoded comments
  const [comments, setComments] = useState<string[]>([
    "Great post! Love the picture.", 
  ]);  // Hardcoded comments

  const handleLike = () => {
    setLikes((prevLikes) => (isLiked ? prevLikes - 1 : prevLikes + 1));
    setIsLiked(!isLiked);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      setComments([...comments, comment]);  // Add new comment to the list
      setCommentCount((prevCount) => prevCount + 1);  // Increment comment count
      setComment("");  // Clear the input field
    }
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
          
          {/* Comment section */}
          <div className="comment-section">
            <span className="comment-icon" role="button" aria-label="Comment on post">💬</span>
            <span className="comment-count">{commentCount}</span> {/* Display comment count */}
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

        {/* Display hardcoded comments */}
        <div className="comments-list">
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              <span className="comment-author">User {index + 1}: </span>
              <span className="comment-text">{comment}</span>
            </div>
          ))}
        </div>

        <p className="post-description">{description}</p>
      </div>
    </div>
  );
};

export default PostComponent;
