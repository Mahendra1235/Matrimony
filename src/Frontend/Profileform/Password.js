import React from 'react';

const Password = ({ password, onChange, passwordError }) => {
  return (
    <div className="form-group">
      <label>Password*</label>
      <input
        type="password"
        name="password"
        value={password}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default Password;
