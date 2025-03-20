import React from 'react';

const Email = ({ email, onChange, emailError }) => {
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
    </div>
  );
};

export default Email;
