import React , {useState} from 'react';
import './SideBar.css';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home'; 
import TravelExploreIcon from '@mui/icons-material/TravelExplore'; 
import PersonIcon from '@mui/icons-material/Person'; 
import AddBoxIcon from '@mui/icons-material/AddBox';
import AddPostPopup from '../AddPost/AddPostPopup';
import { CreatePostData } from '../CreatePostForm/CreatePostForm';

interface SideBarProps {
  onPostSubmit: (postData: CreatePostData) => void;
}

const SideBar: React.FC <SideBarProps> = ({ onPostSubmit }) => {
  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <Link to="/" className="sidebar-link">
          <HomeIcon className="sidebar-icon" /> 
              <span>Home</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/" className="sidebar-link">
          <TravelExploreIcon className="sidebar-icon" />
          <span>Explore</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/profile" className="sidebar-link">
          <PersonIcon className="sidebar-icon" />
          <span>Profile</span> 
          </Link>
        </li>
        <li className="sidebar-item" onClick={() => setIsAddPostOpen(true)}>
          <div className="sidebar-link">
          <AddBoxIcon className="sidebar-icon" />
          <span>Add Post</span>
          </div>
        </li>
      </ul>
      <AddPostPopup 
        isOpen={isAddPostOpen}
        onClose={() => setIsAddPostOpen(false)}
        onPostSubmit={onPostSubmit}
      />
    </div>
  );
};

export default SideBar;