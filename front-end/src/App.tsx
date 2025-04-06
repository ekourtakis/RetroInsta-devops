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
const LOCAL_STORAGE_USER_ID_KEY = 'user_id'

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

      localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, fetchedUser._id); // Store user ID in local storage for persistence
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

  // get user from mongo _id
// src/api/users.ts (Example: Create a new file for API calls)
// Or you can place this helper function inside App.tsx but outside the component function

const getUserDataById = async (userId: string, apiUrl: string): Promise<User> => {
  if (!apiUrl) {
      throw new Error("Backend API URL is not configured.");
  }
  if (!userId) {
      throw new Error("User ID is required to fetch user data.");
  }

  const targetUrl = `${apiUrl}/api/users/${userId}`;
  console.log(`[API] Fetching user data from: ${targetUrl}`);

  try {
      const response = await fetch(targetUrl);
      console.log(`[API] Fetch user by ID response status: ${response.status}`);

      // Try to parse JSON regardless of status for potential error messages
      const responseData = await response.json();

      if (!response.ok) {
          const errorMessage = responseData?.error || `Backend fetch user failed with status ${response.status}`;
          console.error(`[API] Error fetching user data: ${errorMessage}`, responseData);
          throw new Error(errorMessage);
      }

      // Basic validation of the received data structure
      if (!responseData?._id || !responseData?.email || !responseData?.username) {
          console.error("[API] Received invalid user data structure:", responseData);
          throw new Error("Received invalid user data structure from backend.");
      }

      console.log("[API] User data fetched successfully:", responseData);
      return responseData as User; // Assume responseData matches User interface after validation

  } catch (error) {
      console.error(`[API] Network or parsing error fetching user ${userId}:`, error);
      // Re-throw the error so the caller can handle it
      // If it was already an Error object, re-throw it, otherwise wrap it
      if (error instanceof Error) {
          throw error;
      } else {
          throw new Error("An unknown error occurred while fetching user data.");
      }
  }
};

  // get user from local storage so we can persist login state on refresh
  const restoreUserSession = async () => {
    const userId = localStorage.getItem(LOCAL_STORAGE_USER_ID_KEY);
    if (!userId) {
      console.log("No user ID found in local storage.");
      return;
    }
    
    try {
      const user = await getUserDataById(userId, backendUrl);
      setAppUser(user);
    } catch (error) {
      console.error("Error restoring user session:", error);
    }
  }

  useEffect(() => {
    fetchPosts();
    restoreUserSession();
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
