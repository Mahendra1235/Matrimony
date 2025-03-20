import React from 'react';

const Age = ({ age, onChange, ageError }) => {
  return (
    <div className="form-group">
      <label>Age</label>
      <input
        type="number"
        name="age"
        value={age}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default Age;