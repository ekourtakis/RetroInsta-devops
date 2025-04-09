import React from 'react';
import './SideBar.css';
import { Link } from 'react-router-dom';

const SideBar: React.FC = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <Link to="/" className="sidebar-link">
              Home
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/explore" className="sidebar-link">
            Explore
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/profile" className="sidebar-link">
           Profile
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/addPost" className="sidebar-link">
            Add Post
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;