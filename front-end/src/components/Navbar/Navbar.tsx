import './Navbar.css';
import GoogleLoginButton from '../GoogleLoginButton/GoogleLoginButton'; // Adjust path
import { CredentialResponse } from '@react-oauth/google';
import { GoogleIdTokenPayload } from '../../models/GoogleIdTokenPayload';

interface NavbarProps {
  onToggleCreatePostForm: () => void;
  loggedInUser: GoogleIdTokenPayload | null;
  onLoginSuccess: (decodedToken: GoogleIdTokenPayload, credentialResponse: CredentialResponse) => void;
  onLoginError: () => void;
  onLogout: () => void;
}

export default function Navbar({
  onToggleCreatePostForm,
  loggedInUser,
  onLoginSuccess,
  onLoginError,
  onLogout
}: NavbarProps 
) {
  return (
  <nav className="navbar">
      <div className="navbar-logo">
        RetroInsta
      </div>
      <ul className="navbar-links">
        { loggedInUser ? (
          // ---- Logged In State ----
          <> {/* Use React Fragment */}
            <li className="navbar-item">
              <span className="user-greeting">{loggedInUser?.given_name}</span>
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