import React from 'react';
import './SideBar.css';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home'; 
import TravelExploreIcon from '@mui/icons-material/TravelExplore'; 
import PersonIcon from '@mui/icons-material/Person'; 
import AddBoxIcon from '@mui/icons-material/AddBox';

const SideBar: React.FC = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <Link to="/" className="sidebar-link">
          <HomeIcon className="sidebar-icon" /> 
              Home
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/" className="sidebar-link">
          <TravelExploreIcon className="sidebar-icon" />
            Explore
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/profile" className="sidebar-link">
          <PersonIcon className="sidebar-icon" />
           Profile
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/addPost" className="sidebar-link">
          <AddBoxIcon className="sidebar-icon" />
            Add Post
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;