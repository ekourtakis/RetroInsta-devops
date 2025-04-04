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


export default function Navbar() {
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
        <li>
          {userInfo ? (
            <div>
              <span>{userInfo.given_name}</span>
              <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
            </div>
          ) : (
            <GoogleLoginButton
              onLoginSuccess={handleLoginSuccess}
              onLoginError={handleLoginError}
            />
          )}
        </li>
      </ul>
    </nav>
  );
};