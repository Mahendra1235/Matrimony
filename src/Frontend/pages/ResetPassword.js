import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { token } = useParams(); 
  console.log("Token from URL:", token);
  const navigate = useNavigate(); // Use useNavigate for navigation

  // Regex to validate password strength (example: min 8 characters, 1 uppercase, 1 digit)
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
  
    // Basic password validation
    if (!newPassword || !confirmPassword) {
      setError('Both fields are required.');
      setLoading(false);
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
  
    if (!passwordRegex.test(newPassword)) {
      setError('Password must be at least 8 characters long, contain 1 uppercase letter and 1 digit.');
      setLoading(false);
      return;
    }
  
    try {
      const username = 'Mahe'; // Replace this with the actual username from logged-in user's context
      const response = await axios.post('http://localhost:8081/reset-password', {
        username,
        newPassword,
      });
  
      setSuccessMessage('Your password has been reset successfully!');
      setLoading(false);
      setTimeout(() => navigate('/login'), 2000); // Redirect after success
    } catch (err) {
      console.error("Error details:", err.response);  
      setError(err.response ? err.response.data.message : 'An error occurred while resetting the password.');
      setLoading(false);
    }
  };
  

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>

      <form onSubmit={handleResetPassword}>
        <div className="input-field">
          <label><strong>New Password</strong></label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>

        <div className="input-field">
          <label><strong>Confirm Password</strong></label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <button type="submit" className="reset-btn" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
