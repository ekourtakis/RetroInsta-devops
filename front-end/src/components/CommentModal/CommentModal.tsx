import React from "react";
import { Comment } from "../../models/Post";
import "./CommentModal.css";

interface CommentModalProps {
  imagePath: string;
  username: string;
  comments: Comment[];
  commentUsernames: { [commentId: string]: string };
  comment: string;
  onCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCommentSubmit: () => void;
  onClose: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  imagePath,
  username,
  comments,
  commentUsernames,
  comment,
  onCommentChange,
  onCommentSubmit,
  onClose,
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        
        {/* ⬇️ Image container added for spacing */}
        <div className="modal-image-container">
          <img className="modal-full-image" src={imagePath} alt={`Post by ${username}`} />
        </div>

        <div className="modal-comments-overlay">
          <div className="modal-comments-scroll">
            <h3>Comments</h3>
            {comments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              comments.map((comment, index) => {
                const uname = commentUsernames[comment._id] || "Loading...";
                return (
                  <div key={index} className="comment">
                    <span className="comment-author">{uname}: </span>
                    <span className="comment-text">{comment.commentText}</span>
                  </div>
                );
              })
            )}
          </div>
          <div className="modal-comment-input-row">
            <input
              type="text"
              className="comment-input"
              placeholder="Write a comment..."
              value={comment}
              onChange={onCommentChange}
            />
            <button
              className="comment-submit"
              onClick={onCommentSubmit}
              aria-label="Submit comment"
              disabled={!comment.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
