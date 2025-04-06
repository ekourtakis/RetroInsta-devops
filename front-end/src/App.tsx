import './App.css';
import Navbar from "./components/Navbar/Navbar";
import PostFeed from "./components/PostFeed/PostFeed";
import { useEffect, useState } from "react";
import { Post } from "./models/Post"
import CreatePostForm from './components/CreatePostForm/CreatePostForm'
import { CreatePostData } from './components/CreatePostForm/CreatePostForm';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleIdTokenPayload } from './models/GoogleIdTokenPayload';
import { User } from './models/User';

const backendUrl = "http://localhost:7005" // TODO: move to env variable
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
if (!googleClientId) {
  console.error("Error. VITE_GOOGLE_CLIENT_ID env variable not set.")
}

function App() {
  // post feed
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const fetchPosts = () => {
    setPostsLoading(true)
    fetch("http://localhost:7005/api/posts") // Fetches from API endpoint declared in server
    .then((response) => response.json())
    .then((data) => {
      setPosts(data);
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
    });

    setPostsLoading(false);
  }

  // create a post
  const [isCreatePostFormVisible, setIsCreatePostFormVisible] = useState(false);
  
  const toggleCreatePostForm = () => {
    setIsCreatePostFormVisible(currentVisibility => !currentVisibility);
  };

  const handleCreatePostSubmit = (postData: CreatePostData) => {
    fetch("http://localhost:7005/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      fetchPosts(); // Refresh posts after the new post is successfully created
      toggleCreatePostForm(); // Hide the form
    })
    .catch((error) => {
      console.error("Error adding post:", error);
    });
  };
      
  // login state
  const [appUser, setAppUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(false)
  
  const handleLoginSuccess = async (decodedToken: GoogleIdTokenPayload) => {
    setAuthLoading(true)

    const googleId = decodedToken.sub
    const email = decodedToken.email
    const profilePicPath = decodedToken.picture

    if (!googleId || !email) {
      console.error("Error: Missing googleId or email in decoded token")
      return
    }

    const googleApiEndPoint = `${backendUrl}/api/auth/google/login`
    try {
      const response = await fetch(googleApiEndPoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          googleId: googleId, 
          email: email, 
          profilePicPath: profilePicPath
        }),
      });

      const fetchedUser: User = await response.json();

      if (!response.ok) {
        console.error("Error logging in user:", fetchedUser)
        handleLoginError()
        return
      }

      console.log("User fetched:", fetchedUser)
      setAppUser(fetchedUser)
    } catch (error) {
      console.error("Error logging in user:", error)
      handleLoginError()
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLoginError = () => {
    console.error("login failed!")
    setAppUser(null)
    // TODO: handle any cleanup, unloaded data, etc
  }

  const handleLogout = () => {
    console.log("User logged out")
    setAppUser(null)
    // TODO: same as login error, clear data, etc
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="App">
        <Navbar 
          user={appUser}
          authLoading={authLoading}
          onLoginSuccess={handleLoginSuccess}
          onLoginError={handleLoginError}
          onLogout={handleLogout}
          onToggleCreatePostForm={toggleCreatePostForm}
        />
        {isCreatePostFormVisible && (
          <CreatePostForm onPostSubmit={handleCreatePostSubmit} />
        )}
        <div className="Posts">
          {postsLoading ? <p>Loading posts...</p> : <PostFeed posts={posts} />}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
