import React from 'react';
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
  onPostSubmit,
}) => {
  return (
    <div className="create-post-page">
  
      <div className="main-content" style={{ marginLeft: '20px', padding: '20px' }}>
      
        <CreatePostForm onPostSubmit={onPostSubmit} />
      </div>
    </div>
  );
};

export default CreatePostPage;
