import './App.css';
import Navbar from "./components/Navbar";
import Feed from "./components/Feed";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="cameraicon">
        <img 
          src={`/testimage/cameraicon.webp`} 
          alt="Camera" 
          className="camera-icon" 
        />
      </div>
      <h1>RetroInstagram</h1>
      <div className="Posts">
        <Feed />
      </div>
    </div>
  );
}

export default App;
