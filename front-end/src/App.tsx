import './App.css';
import Navbar from "./components/Navbar/Navbar";
import PostFeed from "./components/PostFeed/PostFeed";
import CreatePostForm from "./components/CreatePostForm/CreatePostForm";
import { useEffect, useState } from "react";
import { Post } from "./models/Post"
import { CreatePostData } from './components/CreatePostForm/CreatePostForm';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleIdTokenPayload } from './models/GoogleIdTokenPayload';
import { User } from './models/User';
import { createPost, getAllPosts } from './api/posts';
import { loginWithGoogleApi } from './api/auth';
import { getUserDataByIdApi as getUserDataById } from './api/users';

const LOCAL_STORAGE_USER_ID_KEY = 'user_id'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
if (!googleClientId) {
  console.error("Error. VITE_GOOGLE_CLIENT_ID env variable not set.")
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    finally {
      setPostsLoading(false);
    }
  }

  // create a post
  const [isCreatePostFormVisible, setIsCreatePostFormVisible] = useState(false);
  
  const toggleCreatePostForm = () => {
    setIsCreatePostFormVisible(currentVisibility => !currentVisibility);
  };

  const handleCreatePostSubmit = async (postData: CreatePostData) => {
    if (!appUser) {
      console.error("Error: User not logged in. Cannot create post.");
      return;
    }

    setAuthLoading(true);

    try {
      const dataToSend = { ...postData, username: appUser.username };
      await createPost(dataToSend);
      await fetchPosts(); // Refresh posts after creating a new one
      setIsCreatePostFormVisible(false); // Hide the form after submission
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setAuthLoading(false);
    }
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
      console.error("Error: Google ID or email not found in token.")
      setAuthLoading(false)
      return
    }

    try {
      const fetchedUser = await loginWithGoogleApi({
        googleId,
        email,
        profilePicPath
      })
      console.log("User logged in successfully:", fetchedUser)
      localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, fetchedUser._id) // store id for restotreUserSession
      setAppUser(fetchedUser)
    } catch (error) {
      console.error("Error logging in:", error)
      setAppUser(null)
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
    localStorage.removeItem(LOCAL_STORAGE_USER_ID_KEY) // clear user ID from local storage
    // TODO: same as login error, clear data, etc
  }

  // get user from local storage so we can persist login state on refresh
  const restoreUserSession = async () => {
    const userId = localStorage.getItem(LOCAL_STORAGE_USER_ID_KEY);
    if (!userId) {
      console.log("No user ID found in local storage.");
      return;
    }
    
    setAuthLoading(true);
    try {
      const user = await getUserDataById(userId);
      setAppUser(user);
    } catch (error) {
      console.error("Error restoring user session:", error);
      localStorage.removeItem(LOCAL_STORAGE_USER_ID_KEY); // Clear bad/invalid ID
      setAppUser(null);
    }
    setAuthLoading(false);
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
