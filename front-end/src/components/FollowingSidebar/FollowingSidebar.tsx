import { useEffect, useState } from "react";
import { User } from "../../models/User";
import { getUserById } from "../../api/users";
import "./FollowingSidebar.css";

interface FollowingSidebarProps {
  followingUserIDs: string[];
}

const FollowingSidebar: React.FC<FollowingSidebarProps> = ({ followingUserIDs }) => {
  const [followingUsers, setFollowingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await Promise.all(followingUserIDs.map((id) => getUserById(id)));
        setFollowingUsers(users);
      } catch (error) {
        console.error("Failed to load following users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (followingUserIDs.length > 0) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [followingUserIDs]);

  return (
    <div className="following-sidebar">
      <h3>Following</h3>
      {loading ? (
        <p>Loading...</p>
      ) : followingUsers.length === 0 ? (
        <p>You're not following anyone yet.</p>
      ) : (
        <ul className="following-list">
          {followingUsers.map((user) => (
            <li key={user._id} className="following-item">
              {user.profilePicPath ? (
                <img
                  src={user.profilePicPath}
                  alt={`${user.username}'s profile`}
                  className="following-avatar"
                />
              ) : (
                <div className="avatar-placeholder">👤</div>
              )}
              <span className="following-username">{user.username}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FollowingSidebar;