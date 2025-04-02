import './App.css';
import Navbar from "./components/Navbar/Navbar";
import PostFeed from "./components/PostFeed/PostFeed";
import { Post } from "./models/Post";
import { useEffect, useState } from "react";

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  return (
    <div className="App">
      <Navbar />
      <div className="Posts">
        {loading ? <p>Loading posts...</p> : <PostFeed posts={posts} />}
      </div>
    </div>
  );
}

export default App;
