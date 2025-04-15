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