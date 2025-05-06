import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaUserPlus, FaUser, FaPhone, FaMarsDouble, FaSignOutAlt } from 'react-icons/fa';
import { FaMoon, FaSun } from 'react-icons/fa';
import '../App.css';
import { logout } from '../Redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import NotificationDropdown from '../pages/NotificationDropdown';

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleLogout = () =>{
    dispatch(logout());
    navigate('/');
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <header>
      <div className="container">
        <ul className="nav-links">
          <li><Link to="/"><FaHome /> Home</Link></li>
          <li><Link to="/about"><FaInfoCircle /> About Us</Link></li>
          <li><Link to="/register"><FaUserPlus /> Register</Link></li>
          <li><Link to="/Support"><FaPhone /> Support</Link></li>
          <li><Link to="/profile"><FaUser /> Profile</Link></li>
          {isAuthenticated && (
            <>
              <li><Link to="/matches"><FaMarsDouble /> My Matches</Link></li>
                <NotificationDropdown/>
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            </>
            
          )}
        </ul>
        
        <div className="theme-toggle">
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
