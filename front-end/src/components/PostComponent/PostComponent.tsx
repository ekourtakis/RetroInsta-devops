import React, { useState } from "react";
import "./PostComponent.css";
import { DisplayPost } from "../../models/Post";

interface PostComponentProps {
  post: DisplayPost;
}

const PostComponent: React.FC<PostComponentProps> = ({ post }) => {
  const { author, imagePath, description, likes: initialLikes = 0, createdAt } = post;
  const username = author?.username || "Unknown User";
  const profilePicPath = author?.profilePicPath;


  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const [comments, setComments] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [showCommentsPopup, setShowCommentsPopup] = useState(false);

  // Format the timestamp
  const timestamp = createdAt
      ? new Date(createdAt).toLocaleString() // Simple formatting
      : 'Timestamp unavailable';

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
        {profilePicPath ? (
            <img className="avatar" src={profilePicPath} alt={`${username}'s avatar`} />
          ) : (
            <div className="avatar-placeholder">👤</div> // Placeholder if no pic
          )}
          <span className="username">{username}</span>

          <button
            onClick={() => console.log("Author:", author._id)}
            style={{
              marginLeft: "auto",
              backgroundColor: "black",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Follow
          </button>
      </div>

      {imagePath ? (
        <img className="post-image" src={imagePath} alt={`Post by ${username}`} />
      ) : (
        <div className="image-placeholder">📷 No Image</div>
      )}

      <div className="post-content">
        <p className="post-description">{description || ''}</p>

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
            <span
              className="comment-icon"
              role="button"
              aria-label="Comment on post"
              onClick={() => setShowCommentsPopup(true)}
            >
              💬
            </span>
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
              disabled={!comment.trim()}
            >
              Post
            </button>
          </div>
        </div>

        {showCommentsPopup && (
          <div className="modal-overlay" onClick={() => setShowCommentsPopup(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <img className="modal-full-image" src={imagePath} alt={`Post by ${username}`} />

              <div className="modal-comments-overlay">
                <div className="modal-comments-scroll">
                  <h3>Comments</h3>
                  {comments.length === 0 ? (
                    <p>No comments yet.</p>
                  ) : (
                    comments.map((comment, index) => (
                      <div key={index} className="comment">
                        <span className="comment-author">User {index + 1}:</span>
                        <span className="comment-text">{comment}</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="modal-comment-input-row">
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
                    disabled={!comment.trim()}
                  >
                    Post
                  </button>
                </div>
                <button className="close-button" onClick={() => setShowCommentsPopup(false)}>
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="timestamp">{timestamp}</div>
      </div>
    </div>
  );
};

export default PostComponent;
