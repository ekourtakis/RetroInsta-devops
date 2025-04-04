import './CreatePostForm.css'
import react, {useState, ChangeEvent, FormEvent } from 'react'

export interface CreatePostData {
    username: string,
    profilePicPath?: string,
    imagePath: string,
    description: string
}

interface CreatePostFormProps {
    onPostSubmit: (postData: CreatePostData) => void
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostSubmit }) => {
    // just for holding data within this component
    const [formData, setFormData] = useState<CreatePostData>({
        username: '',
        profilePicPath: '',
        imagePath: '',
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
    if (!formData.username || !formData.description || !formData.imagePath) {
        alert("Please fill in username, image URL, and description.");
        return;
    }
    onPostSubmit(formData);

    setFormData({
        username: '',
        profilePicPath: '',
        imagePath: '',
        description: '',
    });
    };

    return (
    <div className="create-post-form-container">
        <h2>Create a Post</h2>
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
        />
        <input
            type="text"
            name="profilePicPath"
            placeholder="Profile Pic URL/file path (Optional)"
            value={formData.profilePicPath || ''} // Handle potential undefined value
            onChange={handleInputChange}
        />
        <input
            type="text"
            name="imagePath"
            placeholder="Post Image URL/file path"
            value={formData.imagePath}
            onChange={handleInputChange}
            required
        />
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

export default CreatePostForm