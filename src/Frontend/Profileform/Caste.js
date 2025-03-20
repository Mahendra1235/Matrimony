import React from "react";

const Caste = ({ value, onChange }) => {
  return (
    <div className="form-group">
      <label>Caste</label>
      <select
        name="caste"
        value={value}
        onChange={onChange}
        required
      >
        <option value="">Select...</option>
        <option value="OC">OC</option>
        <option value="BC">BC</option>
        <option value="SC">SC</option>
        <option value="Others">Others</option>
      </select>
    </div>
  );
};

export default Caste;
