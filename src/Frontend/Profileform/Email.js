import React from "react";

const Email = ({ email, onChange, emailError, onTabPress, isEmailConfirmed, setIsEmailConfirmed }) => {
  
  const handleClick = (e) => {
    console.log('Button clicked');
    onTabPress(email); 
  };

  // console.log("verified:", isEmailConfirmed);

  // Button style object
  const buttonStyle = {
    backgroundColor: '#4CAF50', 
    color: 'white', 
    padding: '10px 20px', 
    border: 'none', 
    borderRadius: '25px', 
    cursor: 'pointer', 
    fontSize: '16px', 
    transition: 'background-color 0.3s ease',
    width: '130px',
    float: 'right'
  };

  // Hover effect for button
  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: 'green',
  };

  return (
    <div className="form-group">
      <label>Email*</label>
      <input
        type="email"
        name="email"
        value={email}
        onChange={onChange}
        required
      />
      <button
        onClick={handleClick}
        style={buttonStyle}
        onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
      >
        Verify Email
      </button>
      {emailError && <p className="error">{emailError}</p>}
      {isEmailConfirmed && <span style={{ color: 'green', marginLeft: '10px' }}>Email successfully confirmed!</span>}
    </div>
  );
};

export default Email;
