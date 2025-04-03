import './App.css';
import Navbar from "./components/Navbar/Navbar";
import PostFeed from "./components/PostFeed/PostFeed";
import { Post } from "./models/Post"
import { GoogleOAuthProvider } from '@react-oauth/google';

const posts: Post[] = [
  {
    id: 1,
    username: "first_name",
    profilePicPath: "/testimage/avatar.jpeg",
    imagePath: "/testimage/mountain.jpeg",
    description: "description 1!",
  },
  {
    id: 2,
    username: "second284",
    profilePicPath: "/testimage/man.jpeg",
    imagePath: "/testimage/bridge.jpeg",
    description: "this sentence is a test",
  },
]

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
if (!googleClientId) {
  console.error("Error. VITE_GOOGLE_CLIENT_ID env variable not set.")
}

function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="App">
        <Navbar />
        <div className="Posts">
          <PostFeed posts={posts} />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
