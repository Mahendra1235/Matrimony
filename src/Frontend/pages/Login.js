import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess, setAuthError } from '../Redux/authSlice';
import '../App.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8081/login', { username, password })
      .then(response => {
        dispatch(loginSuccess({
          username: response.data.username,
          role: response.data.role,
          userId: response.data.userId
        }));
        alert('User logged in');
        if (response.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/matches');
        }
      })
      .catch(error => {
        dispatch(setAuthError(error.response.data.message || 'An error occurred'));
        alert(error.response.data.message || 'An error occurred');
      });
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-title">
          <h2>User Login</h2>
        </div>
        <form onSubmit={handleLogin}>
          <div className="input-field">
            <label><strong>Username:</strong> </label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label><strong>Password:</strong> </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <div className="forgot-password">
          <button onClick={handleForgotPassword} className="forgot-password-btn">
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
