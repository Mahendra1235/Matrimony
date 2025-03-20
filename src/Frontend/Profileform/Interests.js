import React from 'react';
import Select from 'react-select';

const Interests = ({ value, onChange }) => {
  const options = [
    { value: "Reading", label: "Reading" },
    { value: "Yoga", label: "Yoga" },
    { value: "Sports", label: "Sports" },
    { value: "Travelling", label: "Travelling" },
    { value: "Gym", label: "Gym" },
    { value: "Cooking", label: "Cooking" },
    { value: "Photography", label: "Photography" },
    { value: "Gaming", label: "Gaming" },
  ];

  return (
    <div className="form-group">
      <label>Interests</label>
      <Select
        options={options}
        value={value}
        onChange={onChange}
        isMulti
        placeholder="Select your Interests"
      />
    </div>
  );
};

export default Interests;
