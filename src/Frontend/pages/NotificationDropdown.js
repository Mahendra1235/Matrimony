import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBell } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import '../App.css';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const username = useSelector((state) => state.auth.username);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || !username) return;
  
    const interval = setInterval(() => {
      axios
        .get(`http://localhost:8081/api/notifications/${username}`)
        .then((res) => {
          setNotifications(Array.isArray(res.data) ? res.data : []);
        })
        .catch(() => {
          setNotifications([]);
        });
    }, 5000);
  
    return () => clearInterval(interval);
  }, [isAuthenticated, username]);
  
  
  
  const unreadCount = notifications.length;

  const handleResponse = (id, action, requestedUser) => {
    axios.post(`http://localhost:8081/api/notifications/${action}`, {
      id,
      username: requestedUser,
    })
    .then(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    })
    .catch(err => {
      console.error(`Failed to ${action}:`, err);
    });
  };
  

  return (
    <div className="notification-container">
      <button
        onClick={() => {
          setShowDropdown(!showDropdown);
        }}
        className="notif-button"
      >
        <FaBell />
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          {notifications.length === 0 ? (
            <p className="no-notif">No notifications</p>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li key={n.id} className="notification-item">
                  <p>{n.message}</p>
                  <small>{new Date(n.created_at).toLocaleString()}</small>
                  {n.message.includes('has requested to view your profile') && (
               <div className="notif-actions">
                    <button className="btn-accept" onClick={() => handleResponse(n.id, 'accept', username)}>Accept</button>
                   <button className="btn-decline" onClick={() => handleResponse(n.id, 'decline', username)}>Decline</button>
               </div>
             )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
