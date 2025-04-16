import React, { useEffect, useRef, useState } from "react";
import "./PostComponent.css";
import { DisplayPost, AddCommentPayload, Comment } from "../../models/Post";
import { addComment, getCommentsByPostId } from "../../api/comments";
import { getUserById } from "../../api/users";
import { User } from "../../models/User";

interface PostComponentProps {
  post: DisplayPost;
  appUser: User | null;
}

const PostComponent: React.FC<PostComponentProps> = ({ post, appUser }) => {
  const { author, imagePath, description, likes: initialLikes = 0, createdAt } = post;
  const username = author?.username || "Unknown User";
  const profilePicPath = author?.profilePicPath;
  const currentUser = appUser;

  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentUsernames, setCommentUsernames] = useState<{ [commentId: string]: string }>({});
  const [comment, setComment] = useState("");
  const [showCommentsPopup, setShowCommentsPopup] = useState(false);

  const usernameCache = useRef<{ [userId: string]: string }>({});

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

  const handleCommentSubmit = async () => {
    try {
      // create a new comment object
      const payload: AddCommentPayload = {
        commentText: comment,
        authorID: currentUser._id, // TODO: set this to the logged-in user's ID!!
        postID: post._id, 
      };

      addComment(payload); // Call the API to add the comment
      setComments(await getCommentsByPostId(post._id));
      setComment("");
    }
    catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post.");
    }
  };

  const getUsername = async (authorID: string) => {
    if (usernameCache.current[authorID]) {
      return usernameCache.current[authorID];
    }
  
    try {
      const user = await getUserById(authorID);
      const username = user.username || "Unknown User";
      usernameCache.current[authorID] = username;
      return username;
    } catch (err) {
      console.error("Failed to fetch username:", err);
      return "Unknown User";
    }
  };
  
  // Fetch comments and usernames when the component mounts or when post._id changes
  useEffect(() => {
    const fetchCommentsAndUsernames = async () => {
      try {
        const fetchedComments = await getCommentsByPostId(post._id);
        setComments(fetchedComments);

        const newUsernames: { [commentId: string]: string } = {};
        for (const c of fetchedComments) {
          const username = await getUsername(c.authorID);
          newUsernames[c._id] = username;
        }
        setCommentUsernames(newUsernames);
      } catch (error) {
        console.error("Error loading comments or usernames:", error);
      }
    };

    fetchCommentsAndUsernames();
  }, [post._id]);

  return (
    <div className="post">
      <div className="post-header">
        {profilePicPath ? (
            <img className="avatar" src={profilePicPath} alt={`${username}'s avatar`} />
          ) : (
            <div className="avatar-placeholder">👤</div> // Placeholder if no pic
          )}
          <span className="username">{username}</span>
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
                    comments.map((comment, index) => {
                      const username = commentUsernames[comment._id] || "Loading...";
                      return (
                      <div key={index} className="comment">
                        <span className="comment-author">{username}: </span>
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
