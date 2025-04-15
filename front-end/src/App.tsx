import './App.css';
import Navbar from "./components/Navbar/Navbar";
import PostFeed from "./components/PostFeed/PostFeed";
import CreatePostForm from "./components/CreatePostForm/CreatePostForm";
import SideBar from "./components/SideBar/SideBar";
import { useCallback, useEffect, useState } from "react";
import { DisplayPost, BackendPost } from "./models/Post"
import { CreatePostPayload, PostFormData } from './models/CreatePostData';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleIdTokenPayload } from './models/GoogleIdTokenPayload';
import { User } from './models/User';
import { createPost, getAllPosts } from './api/posts';
import { loginWithGoogleApi as loginWithGoogle } from './api/auth';
import { getUserById, getUserById as getUserDataById } from './api/users';

const LOCAL_STORAGE_USER_ID_KEY = 'user_id'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
if (!googleClientId) {
  console.error("Error. VITE_GOOGLE_CLIENT_ID env variable not set.")
}

function App() {
  const [posts, setPosts] = useState<DisplayPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [appUser, setAppUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [isCreatePostFormVisible, setIsCreatePostFormVisible] = useState(false);

  const fetchAndProcessPosts = useCallback(async () => {
    console.log("Fetching posts...");
    setPostsLoading(true);

    try {
      const backendPosts: BackendPost[] = await getAllPosts();
      console.log(`Fetched ${backendPosts.length} raw posts from backend.`);

      if (backendPosts.length === 0) {
        console.log("No posts found.");
        setPosts([]);
        return;
      }

      const authorIDs = [
        ...new Set(backendPosts
          .map(post => post.authorID)
          .filter(id => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)) // Pre-filter valid IDs
        )
      ];

      if (authorIDs.length === 0) {
        console.warn("No valid author IDs found.");
        setPosts([]);
        return;
      }

      // fetch all users concurently 
      const userPromises = authorIDs.map(id =>
        getUserById(id).catch(error => {
          // Handle individual user fetch errors gracefully
          console.warn(`Failed to fetch user ${id}:`, error.message);
          return null; // Return null if a user fetch fails
        })
      );

      const usersOrNulls = await Promise.all(userPromises);

      const usersMap: Record<string, User> = {};
      usersOrNulls.forEach(user => {
        if (user) {
          usersMap[user._id] = user;
        }
      });
      console.log(`Successfully fetched ${Object.keys(usersMap).length} users.`);
      
      const processedPosts: DisplayPost[] = backendPosts
        .map(post => {
          const author = usersMap[post.authorID];
          if (!author) {
            return null; // skip this post if author not found
          }
          const { authorID, ...restOfPost } = post;
          return { ...restOfPost, author };
        })
        .filter((p): p is DisplayPost => p !== null); // filter out nulls

      console.log(`Processed ${processedPosts.length} posts to display.`);

      setPosts(processedPosts);      
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  },[]);
  
  // login state
  const handleLogout = useCallback(() => {
    console.log("User logged out")
    setAppUser(null)
    localStorage.removeItem(LOCAL_STORAGE_USER_ID_KEY) // clear user ID from local storagefetchAndProcessPosts
    fetchAndProcessPosts()
  }, []);
  
  const handleLoginError = useCallback(async() => {
    console.log("Logging user out.");
    setAppUser(null);
    setPosts([]);
  }, []);
  
  const handleLoginSuccess = useCallback(async (decodedToken: GoogleIdTokenPayload) => {
    console.log("Attempting Google login...");
    setAuthLoading(true);
    const googleId = decodedToken.sub;
    const email = decodedToken.email;
    const profilePicPath = decodedToken.picture;


    console.log("Token Data:", { googleID: googleId, email, profilePicPath: profilePicPath?.substring(0, 30) + "..." });

    if (!googleId || !email) {
      setAuthLoading(false);
      alert("Big fucking error!");
      return;
    }

    try {
      const loginPayload = { googleId, email, profilePicPath }
      const fetchedUser = await loginWithGoogle(loginPayload);

      if (!fetchedUser?._id) {
        console.error("Login Error: Invalid user data received from backend.");
        throw new Error("Invalid user data received after login.");
      }

      localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, fetchedUser._id);
      setAppUser(fetchedUser);
      console.log(`User logged in: ${fetchedUser.username}`);

      await fetchAndProcessPosts(); // feed might be different based on following list
    } catch (error) {
      console.error("Login failed:", error);
      handleLoginError();
    } finally {
      setAuthLoading(false);
    }
  }, [handleLoginError, fetchAndProcessPosts])

  // get user from local storage so we can persist login state on refresh
  const restoreUserSession = useCallback(async () => {
    const userId = localStorage.getItem(LOCAL_STORAGE_USER_ID_KEY);
    if (!userId) {
      console.log("No user ID found in local storage.");
      fetchAndProcessPosts();
      return;
    }
    
    console.log(`Restoring user session for ID: ${userId}`);
    setAuthLoading(true);
    try {
      const user = await getUserDataById(userId);
      setAppUser(user);
    } catch (error) {
      console.error("Error restoring user session:", error);
      localStorage.removeItem(LOCAL_STORAGE_USER_ID_KEY); // Clear bad/invalid ID
      setAppUser(null);
    } finally {
      setAuthLoading(false);
      fetchAndProcessPosts();
    }
  }, [fetchAndProcessPosts]);

  
  // create a post
  const toggleCreatePostForm = () => {
    setIsCreatePostFormVisible(currentVisibility => !currentVisibility);
  };
  
  const handleCreatePostSubmit = useCallback(async (formData: PostFormData) => {
    if (!appUser) {
      console.error("User not logged in. Cannot create post.");
      alert("You must be logged in to create a post.");
      return;
    }
    
    if (!formData.imageFile) {
      console.error("No image file provided.");
      alert("Please select an image to upload.");
      return;
    }
    
    const payload: CreatePostPayload = {
      authorID: appUser._id,
      imageFile: formData.imageFile,
      description: formData.description || "",
    };
    
    setPostsLoading(true);
    
    try {
      const createdPost = await createPost(payload);
      
      await fetchAndProcessPosts(); // refresh posts after creating a new one
      console.log("Post created successfully:", createdPost);
      setIsCreatePostFormVisible(false); // Hide the form after submission
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post.");
    } finally {
      setPostsLoading(false);
    }
  }, [appUser, fetchAndProcessPosts]);

  useEffect(() => {
    console.log("App Mounted. Restoring session and fetching posts...");
    restoreUserSession();
  }, [restoreUserSession]); // Run only when restoreUserSession identity changes
  
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="App">
      <SideBar />
        {/* Main content is wrapped in a container with left margin to avoid overlap with the fixed sidebar */}
        <div className="main-content" style={{ marginLeft: '220px', padding: '20px' }}>
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
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
