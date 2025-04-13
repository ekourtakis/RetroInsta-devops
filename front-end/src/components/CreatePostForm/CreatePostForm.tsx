import './CreatePostForm.css'
import {useState, ChangeEvent, FormEvent } from 'react'
import { PostFormData } from '../../models/CreatePostData'

interface CreatePostFormProps {
    onPostSubmit: (formData: PostFormData) => void
}

export default function CreatePostForm({ onPostSubmit }: CreatePostFormProps) {
    // just for holding data within this component
    const [formData, setFormData] = useState<PostFormData>({
        imageFile: null,
        description: '',
    });

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, imageFile: file }));
    }


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default browser form submission
        // Basic validation
        if (!formData.imageFile) {
            alert("Please select an image to upload.");
            return;
        }
        
        onPostSubmit(formData);


        // clear form
        setFormData({
            imageFile: null,
            description: '',
        });

        const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
         if (fileInput) fileInput.value = '';
    };

    return (
        <div className="create-post-form-container">
            <h2>Create a Post</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="imageInput" className="file-input-label">Choose Image</label>
                <input
                    id="imageInput" // Link label and input
                    type="file"
                    name="imageFile" // Name matches state key conceptually
                    accept="image/*"
                    // *** FIX HERE: Use the correct handler ***
                    onChange={handleFileChange}
                    required
                    style={{ display: 'none' }} // Hide default input
                />
                {formData.imageFile && (
                    <p style={{ fontStyle: 'italic', color: 'black' }}>
                        Selected file: {formData.imageFile.name}
                    </p>
                )}
                <textarea
                    name="description"
                    placeholder="Write a description of your photo (optional)..."
                    value={formData.description}
                    // *** FIX HERE: Use the correct handler ***
                    onChange={handleInputChange}
                />
                <button type="submit">Post</button>
            </form>
        </div>
    );
}