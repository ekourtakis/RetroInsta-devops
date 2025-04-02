import './App.css';
import Navbar from "./components/Navbar/Navbar";
import Feed from "./components/Feed/Feed";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="Posts">
        <Feed />
      </div>
    </div>
  );
}

export default App;
