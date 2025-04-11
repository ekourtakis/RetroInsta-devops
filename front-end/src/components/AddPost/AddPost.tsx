import React from 'react';
import Navbar from '../Navbar/Navbar';
import SideBar from '../SideBar/SideBar';
import CreatePostForm from '../CreatePostForm/CreatePostForm';
import { CredentialResponse } from '@react-oauth/google';
import { GoogleIdTokenPayload } from '../../models/GoogleIdTokenPayload';
import { User } from '../../models/User';
import './AddPost.css'; 

interface CreatePostPageProps {
  user: User | null;
  authLoading: boolean;
  onLoginSuccess: (decodedToken: GoogleIdTokenPayload, credentialResponse: CredentialResponse) => void;
  onLoginError: () => void;
  onLogout: () => void;
  onPostSubmit: (formData: any) => void;
}

const CreatePostPage: React.FC<CreatePostPageProps> = ({
  user,
  authLoading,
  onLoginSuccess,
  onLoginError,
  onLogout,
  onPostSubmit,
}) => {
  return (
    <div className="create-post-page">
      <SideBar />
      <div className="main-content" style={{ marginLeft: '220px', padding: '20px' }}>
        <Navbar
          user={user}
          authLoading={authLoading}
          onLoginSuccess={onLoginSuccess}
          onLoginError={onLoginError}
          onLogout={onLogout}
          onToggleCreatePostForm={() => {}}
        />
        <CreatePostForm onPostSubmit={onPostSubmit} />
      </div>
    </div>
  );
};

export default CreatePostPage;
