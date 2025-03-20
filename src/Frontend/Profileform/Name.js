import React from 'react';

const Name = ({ name, onChange, nameError }) => {
  return (
    <div className="form-group">
      <label>Name*</label>
      <input
        type="text"
        name="name"
        value={name}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default Name;
