import React from 'react';
import CreatePostForm from '../CreatePostForm/CreatePostForm';
import { CreatePostData } from '../CreatePostForm/CreatePostForm';
import './AddPostPopup.css';

interface AddPostPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onPostSubmit: (postData: CreatePostData) => void;
}

const AddPostPopup: React.FC<AddPostPopupProps> = ({ isOpen, onClose, onPostSubmit }) => {
    if (!isOpen) return null;

    const handlePostSubmit = (postData: CreatePostData) => {
        onPostSubmit(postData);
        onClose();
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Create New Post</h2>
                <CreatePostForm onPostSubmit={handlePostSubmit} />
                <button className="cancel-button" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default AddPostPopup; 