import './CreatePostForm.css'
import react, {useState, ChangeEvent, FormEvent } from 'react'
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
    if (!formData.description || !formData.imagePath) {
        alert("Please fill in username, image URL, and description.");
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

        <input
            type="text"
            name="profilePicPath"
            placeholder="Profile Pic URL/file path (Optional)"
            value={formData.profilePicPath || ''} // Handle potential undefined value
            onChange={handleInputChange}
        />
        <input
            type="file"
            name="imagePath"
            accept="image/*"
            onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setFormData(prev => ({ ...prev, imagePath: file }));
            }}
            required
        />
        {formData.imagePath && (
            <p style={{ fontStyle: 'italic', color: 'black' }}>
                Selected file: {formData.imagePath.name}
            </p>
        )}
        <textarea
            name="description"
            placeholder="Write a description of your photo..."
            value={formData.description}
            onChange={handleInputChange}
            required
        />
        <button type="submit">Post</button>
        </form>
    </div>
    );
}