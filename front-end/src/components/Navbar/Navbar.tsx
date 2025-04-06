import './Navbar.css';
import GoogleLoginButton from '../GoogleLoginButton/GoogleLoginButton'; // Adjust path
import { CredentialResponse } from '@react-oauth/google';
import { GoogleIdTokenPayload } from '../../models/GoogleIdTokenPayload';
import { User } from '../../models/User';

interface NavbarProps {
  user: User | null;
  authLoading: boolean;
  onLoginSuccess: (decodedToken: GoogleIdTokenPayload, credentialResponse: CredentialResponse) => void;
  onLoginError: () => void;
  onLogout: () => void;
  onToggleCreatePostForm: () => void;
}

export default function Navbar({
  user,
  authLoading,
  onLoginSuccess,
  onLoginError,
  onLogout,
  onToggleCreatePostForm,
}: NavbarProps 
) {
  return (
  <nav className="navbar">
      <div className="navbar-logo">
        <img 
          src="/insta.png" 
          alt="RetroInsta logo" 
          style={{ height: '40px', marginRight: '8px', verticalAlign: 'middle' }} 
        />
        RetroInsta
      </div>
      <ul className="navbar-links">
        { user ? (
          // ---- Logged In State ----
          <> {/* Use React Fragment */}
            <li className="navbar-item">
              <span className="user-greeting">{user?.username}</span>
            </li>
            <li className="navbar-item">
              <button
                onClick={onToggleCreatePostForm}
                className="navbar-button make-post-button"
              >
                Make a Post
              </button>
            </li>
            <li className="navbar-item">
              <button
                onClick={onLogout}
                className="navbar-button logout-button"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          // ---- Logged Out State ----
          <li className="navbar-item">
            <GoogleLoginButton
              onLoginSuccess={onLoginSuccess}
              onLoginError={onLoginError}
            />
          </li>
        )}
      </ul>
    </nav>
  );
};