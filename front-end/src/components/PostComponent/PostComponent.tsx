import React, { useEffect, useRef, useState } from "react";
import "./PostComponent.css";
import { DisplayPost, AddCommentPayload, Comment } from "../../models/Post";
import { addComment, getCommentsByPostId } from "../../api/comments";
import { getUserById } from "../../api/users";
import { followUser } from '../../api/users';
import { User } from "../../models/User";
import CommentModal from "../CommentModal/CommentModal";

interface PostComponentProps {
  post: DisplayPost;
  appUser: User | null;
}

const PostComponent: React.FC<PostComponentProps> = ({ post, appUser }) => {
  const { author, imagePath, description, likes: initialLikes = 0, createdAt } = post;
  const username = author?.username || "Unknown User";
  const profilePicPath = author?.profilePicPath;
  const currentUser = appUser;
  const currentUserId = appUser?._id || "notLoggedIn";

  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentUsernames, setCommentUsernames] = useState<{ [commentId: string]: string }>({});
  const [comment, setComment] = useState("");
  const [showCommentsPopup, setShowCommentsPopup] = useState(false);

  const usernameCache = useRef<{ [userId: string]: string }>({});

  const timestamp = createdAt
    ? new Date(createdAt).toLocaleString()
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
      const payload: AddCommentPayload = {
        commentText: comment,
        authorID: currentUser._id,
        postID: post._id,
      };
      await addComment(payload);
      setComment("");
      await fetchCommentsAndUsernames();
    } catch (error) {
      console.error("Error creating comment:", error);
      alert("Failed to create comment.");
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

  const handleFollowClick = async () => {
    try {
      await followUser(currentUserId, author._id);
      console.log(`Followed ${author._id}`);
      setIsFollowing(true);
    } catch (error) {
      console.error("Follow action failed:", error);
    }
  };

  useEffect(() => {
    fetchCommentsAndUsernames();
    if (currentUser && currentUser.followingUserIDs?.includes(author._id)) {
      setIsFollowing(true);
    }
  }, [post._id, currentUser, author._id]);

  return (
    <div className="post">
      <div className="post-header">
        {profilePicPath ? (
          <img className="avatar" src={profilePicPath} alt={`${username}'s avatar`} />
        ) : (
          <div className="avatar-placeholder">👤</div>
        )}
        <span className="username">{username}</span>
        <button
          onClick={handleFollowClick}
          disabled={isFollowing}
          style={{
            marginLeft: "auto",
            backgroundColor: isFollowing ? "gray" : "black",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            cursor: isFollowing ? "default" : "pointer",
            fontSize: "1rem",
          }}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>

      {imagePath ? (
        <img className="post-image" src={imagePath} alt={`Post by ${username}`} />
      ) : (
        <div className="image-placeholder">📷 No Image</div>
      )}

      <div className="post-content">
        <p className="post-description">{description || ''}</p>
        <div className="post-actions">
          <div className="like-section">
            <button
              onClick={handleLike}
              aria-label="Like post"
              style={{
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              {isLiked ? "❤️" : "🤍"}
            </button>

            <span className="like-count">{likes}</span>
          </div>

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
          <CommentModal
            imagePath={imagePath}
            username={username}
            comments={comments}
            commentUsernames={commentUsernames}
            comment={comment}
            onCommentChange={handleCommentChange}
            onCommentSubmit={handleCommentSubmit}
            onClose={() => setShowCommentsPopup(false)}
          />
        )}

        <div className="timestamp">{timestamp}</div>
      </div>
    </div>
  );
};

export default PostComponent;
