import './Navbar.css';
import GoogleLoginButton from '../GoogleLoginButton/GoogleLoginButton'; // Adjust path
import { CredentialResponse } from '@react-oauth/google';
import { JwtPayload } from 'jwt-decode'; // Assuming GoogleIdTokenPayload is also exported or redefined here if needed
import React, { useState } from 'react'; // Import useState

// Define the same payload interface or import it
interface GoogleIdTokenPayload extends JwtPayload {
    email?: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
}

interface NavbarProps {
  onToggleCreatePostForm: () => void
}

export default function Navbar( {onToggleCreatePostForm}: NavbarProps ) {
  const [userInfo, setUserInfo] = useState<GoogleIdTokenPayload | null>(null);

  const handleLoginSuccess = (decodedToken: GoogleIdTokenPayload, credentialResponse: CredentialResponse) => {
    setUserInfo(decodedToken);
    alert(`Login Successful! Welcome ${decodedToken.name || 'User'}`);
    console.log("Email:", decodedToken.email);
    console.log("User ID (sub):", decodedToken.sub);
  };

  const handleLoginError = () => {
    setUserInfo(null);
    console.error("login error!")
  };

  const handleLogout = () => {
     setUserInfo(null);
     console.log("User logged out");
  }

  return (
  <nav className="navbar">
      <div className="navbar-logo">
        RetroInsta
      </div>
      <ul className="navbar-links">
        {userInfo ? (
          // ---- Logged In State ----
          <> {/* Use React Fragment */}
            {/* Make username a list item */}
            <li className="navbar-item">
              {/* Add specific class for potential styling */}
              <span className="user-greeting">{userInfo.given_name}</span>
            </li>
            <li className="navbar-item"> {/* Item for Make Post button */}
              <button
                onClick={onToggleCreatePostForm}
                className="navbar-button make-post-button"
              >
                Make a Post
              </button>
            </li>
            {/* Remove the extra div around the logout button */}
            <li className="navbar-item"> {/* Item for Logout button */}
              <button
                onClick={handleLogout}
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
              onLoginSuccess={handleLoginSuccess}
              onLoginError={handleLoginError}
            />
          </li>
        )}
      </ul>
    </nav>
  );
};