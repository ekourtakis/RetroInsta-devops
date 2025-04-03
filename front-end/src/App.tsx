import './App.css';
import Navbar from "./components/Navbar/Navbar";
import PostFeed from "./components/PostFeed/PostFeed";
import { Post } from "./models/Post";
import { useEffect, useState } from "react";

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ username: "", description: "", imagePath: "", profilePicPath: "" });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetch("http://localhost:7005/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts([...posts, data]); // Add the new post to state
        fetchPosts();
        setNewPost({ username: "", description: "", imagePath: "", profilePicPath: "" }); // Reset create post form
      })
      .catch((error) => console.error("Error adding post:", error));
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
          <input type="text" name="imagePath" placeholder="Post Image URL" value={newPost.imagePath} onChange={handleInputChange} />
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
