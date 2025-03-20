import React from 'react';

const Phone = ({ phone, onChange, phoneError }) => {
  return (
    <div className="form-group">
      <label>Phone Number*</label>
      <input
        type="tel"
        name="phone"
        value={phone}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default Phone;
