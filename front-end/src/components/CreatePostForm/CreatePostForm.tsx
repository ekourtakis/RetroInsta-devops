import './CreatePostForm.css'
import {useState, ChangeEvent, FormEvent } from 'react'
import { CreatePostData } from '../../models/CreatePostData'

interface CreatePostFormProps {
    onPostSubmit: (postData: CreatePostData) => void
}

export default function CreatePostForm({ onPostSubmit }: CreatePostFormProps) {
    // just for holding data within this component
    const [formData, setFormData] = useState<CreatePostData>({
        username: '',
        profilePicPath: '',
        imagePath: null,
        description: ''
    })

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default browser form submission
    // Basic validation (optional, add more robust validation as needed)
    if (!formData.imagePath) {
        alert("Please upload image.");
        return;
    }
    onPostSubmit(formData);

    setFormData({
        username: '',
        profilePicPath: '',
        imagePath: null,
        description: '',
    });
    };

    return (
    <div className="create-post-form-container">
        <h2>Create a Post</h2>
        <form onSubmit={handleSubmit}>
            <label htmlFor="file-input" className="custom-file-button">
                Upload Image
            </label>
            <input
                id="file-input"
                className="file-input"
                type="file"
                name="imagePath"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setFormData(prev => ({ ...prev, imagePath: file }));
                }}
                required
                style={{ display: 'none' }}
            />
            {formData.imagePath && (
                <p style={{ fontStyle: 'italic', color: 'black' }}>
                    Selected file: {formData.imagePath.name}
                </p>
            )}
            <textarea
                name="description"
                placeholder="Write an optional description of your photo..."
                value={formData.description}
                onChange={handleInputChange}
            />
            <button type="submit">Post</button>
        </form>
    </div>
    );
}