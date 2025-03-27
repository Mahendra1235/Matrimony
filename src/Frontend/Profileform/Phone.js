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
        maxLength={10}
        pattern="[0-9]*"
        placeholder="Enter 10-digit phone number"
        required
      />
    </div>
  );
};

export default Phone;
