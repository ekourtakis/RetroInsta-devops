import './App.css';
import Navbar from "./components/Navbar/Navbar";
import PostFeed from "./components/PostFeed/PostFeed";
import { useEffect, useState } from "react";
import { Post } from "./models/Post"
import CreatePostForm from './components/CreatePostForm/CreatePostForm'
import { CreatePostData } from './components/CreatePostForm/CreatePostForm';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleIdTokenPayload } from './models/GoogleIdTokenPayload';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
if (!googleClientId) {
  console.error("Error. VITE_GOOGLE_CLIENT_ID env variable not set.")
}

function App() {
  // post feed
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    setLoading(true)
    fetch("http://localhost:7005/api/data") // Fetches from API endpoint declared in server
    .then((response) => response.json())
    .then((data) => {
      setPosts(data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
    });
      setLoading(false);
  }

  // create a post
  const [isCreatePostFormVisible, setIsCreatePostFormVisible] = useState(false);
  
  const toggleCreatePostForm = () => {
    setIsCreatePostFormVisible(currentVisibility => !currentVisibility);
  };

  const handleCreatePostSubmit = (postData: CreatePostData) => {
    fetch("http://localhost:7005/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error("Error adding post:", error);
    });
    
    fetchPosts()
  };
  
  // login
  const [loggedInUser, setLoggedInUser] = useState<GoogleIdTokenPayload | null>(null)
  
  const handleLoginSuccess = (decodedToken: GoogleIdTokenPayload) => {
    setLoggedInUser(decodedToken)
    // TODO: look up google id in DB, add user or load existing data
  }

  const handleLoginError = () => {
    console.error("login failed!")
    setLoggedInUser(null)
    // TODO: handle any cleanup, unloaded data, etc
  }

  const handleLogout = () => {
    console.log("User logged out")
    setLoggedInUser(null)
    // TODO: same as login error, clear data, etc
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="App">
        <Navbar 
          loggedInUser={loggedInUser}
          onLoginSuccess={handleLoginSuccess}
          onLoginError={handleLoginError}
          onLogout={handleLogout}
          onToggleCreatePostForm={toggleCreatePostForm}
        />
        {isCreatePostFormVisible && (
          <CreatePostForm onPostSubmit={handleCreatePostSubmit} />
        )}
        <div className="Posts">
          {loading ? <p>Loading posts...</p> : <PostFeed posts={posts} />}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
