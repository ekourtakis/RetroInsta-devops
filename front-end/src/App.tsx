import './App.css';
import Navbar from "./components/Navbar/Navbar";
import PostFeed from "./components/PostFeed/PostFeed";
import{ Post } from "./models/Post"

const posts: Post[] = [
  {
    id: 1,
    username: "first_name",
    avatar: "/testimage/avatar.jpeg",
    image: "/testimage/mountain.jpeg",
    description: "description 1!",
  },
  {
    id: 2,
    username: "second284",
    avatar: "/testimage/man.jpeg",
    image: "/testimage/bridge.jpeg",
    description: "this sentence is a test",
  },
]

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="Posts">
        <PostFeed posts={posts} />
      </div>
    </div>
  );
}

export default App;
