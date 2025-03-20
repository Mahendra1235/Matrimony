import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [contactMethod, setContactMethod] = useState('email'); 
  const [contactInfo, setContactInfo] = useState(''); 
  const [error, setError] = useState(''); 
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message

  const emailDomainRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;
  const phoneNumberRegex = /^[789]\d{9}$/; 

  const handleResetPassword = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (contactMethod === 'email') {
      if (!emailDomainRegex.test(contactInfo)) {
        setError('Please enter a valid email with @gmail.com or @yahoo.com');
        return;
      }
    }

    if (contactMethod === 'phone') {
      if (!phoneNumberRegex.test(contactInfo)) {
        setError('Please enter a valid phone number (e.g., 9572456123)');
        return; 
      }
    }

    const requestPayload = contactMethod === 'email'
      ? { email: contactInfo }
      : { phoneNumber: contactInfo };

    // Send request to backend
    axios.post('http://localhost:8081/forgot-password', requestPayload)
      .then(response => {
        setSuccessMessage('Password reset instructions have been sent to your ' + contactMethod + '.');
      })
      .catch(error => {
        setError(error.response.data.message || 'An error occurred');
      });
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleResetPassword}>
        <div className="input-field">
          <label><strong>Choose recovery method:</strong> </label>
          <div>
            <label>
              <input
                type="radio"
                name="contactMethod"
                value="email"
                checked={contactMethod === 'email'}
                onChange={() => setContactMethod('email')}
              />
              Email
            </label>
            <label>
              <input
                type="radio"
                name="contactMethod"
                value="phone"
                checked={contactMethod === 'phone'}
                onChange={() => setContactMethod('phone')}
              />
              Phone Number
            </label>
          </div>
        </div>

        <div className="input-field">
          <label><strong>{contactMethod === 'email' ? 'Email:' : 'Phone Number:'}</strong> </label>
          <input
            type={contactMethod === 'email' ? 'email' : 'text'}
            name={contactMethod}
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            placeholder={contactMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
          />
          {error && <div className="error-message">{error}</div>} {/* Display error message */}
          {successMessage && <div className="success-message">{successMessage}</div>} {/* Display success message */}
        </div>

        <button type="submit" className="reset-btn">Reset Password</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
