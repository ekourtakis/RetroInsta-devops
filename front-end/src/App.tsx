import './App.css';
import Navbar from "./components/Navbar/Navbar";
import PostFeed from "./components/PostFeed/PostFeed";
import { Post } from "./models/Post";
import { useEffect, useState } from "react";

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ username: "", description: "", imagePath: null, profilePicPath: "" });

  const fetchPosts = () => {
    fetch("http://localhost:7005/api/data") // Fetches from API endpoint declared in server
    .then((response) => response.json())
    .then((data) => {
      setPosts(data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
      setLoading(false);
    });
  }

  const handleFileChange = (e) => {
    setNewPost({
      ...newPost,
      imagePath: e.target.files[0],  // e.target.files is an array-like object of files selected by the user
    });
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!newPost.imagePath) {
      console.error("Image file is required.");
      return;
    }
  
    // Step 1: Request a pre-signed URL from the backend
    try {
      // Fetch the pre-signed URL for the image file
      const presignedUrlResponse = await fetch("http://localhost:7005/api/generate-presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: newPost.imagePath.name,  // Use the file name from the selected file
          fileType: newPost.imagePath.type,  // Use the file type
        }),
      });
  
      const { presignedUrl } = await presignedUrlResponse.json();
  
      if (!presignedUrl) {
        console.error("Failed to get pre-signed URL");
        return;
      }
  
      // Step 2: Upload the image to MinIO using the pre-signed URL
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": newPost.imagePath.type },
        body: newPost.imagePath, // The actual image file
      });
  
      if (!uploadResponse.ok) {
        console.error("Failed to upload the image");
        return;
      }
  
      console.log("Image uploaded successfully");
  
      // Step 3: Submit the rest of the post data (excluding the image file)
      const postData = {
        ...newPost, // The rest of the post data (username, description, etc.)
        imageUrl: presignedUrl.split("?")[0], // Store the public URL of the uploaded image
      };
  
      // Send the post data to the backend to save the post
      const postResponse = await fetch("http://localhost:7005/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
  
      const postDataResponse = await postResponse.json();
      setPosts([...posts, postDataResponse]); // Add the new post to state
      fetchPosts();
      setNewPost({ username: "", description: "", imagePath: null, profilePicPath: "" }); // Reset create post form
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="App">
      <Navbar />
      <div className="post-form">
        <h2>Create a Post</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" value={newPost.username} onChange={handleInputChange} required />
          <input type="text" name="profilePicPath" placeholder="Profile Pic URL" value={newPost.profilePicPath} onChange={handleInputChange} />
          <input type="file" name="imagePath" placeholder="Post Image URL" onChange={handleFileChange} accept="image/*" required/>
          <textarea name="description" placeholder="Write something..." value={newPost.description} onChange={handleInputChange} required />
          <button type="submit">Post</button>
        </form>
      </div>
      <div className="Posts">
        {loading ? <p>Loading posts...</p> : <PostFeed posts={posts} />}
      </div>
    </div>
  );
}

export default App;
