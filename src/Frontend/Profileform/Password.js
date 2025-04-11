import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons from React Icons

const Password = ({ password, onChange, passwordError }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prevState => !prevState);
  };

  return (
    <div className="form-group">
      <label>Password*</label>
      <div className="password-input-container">
        <input
          type={isPasswordVisible ? 'text' : 'password'}
          name="password"
          value={password}
          onChange={onChange}
          required
        />
        <button
          type="button"
          className="password-toggle-button"
          onClick={togglePasswordVisibility}
        >
          {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {passwordError && <p className="error">{passwordError}</p>}
    </div>
  );
};

export default Password;
