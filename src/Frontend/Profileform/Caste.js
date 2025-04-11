const Caste = ({ value, onChange, options }) => {
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
        {options && options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default Caste;
