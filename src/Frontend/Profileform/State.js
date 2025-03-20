import react from "react";

const State = ({value, onChange}) => {
    return(
        <div className="form-group">
            <label>State</label>
      <select
        name="state"
        value={value}
        onChange={onChange}
        required
      >
        <option value="">Select...</option>
        <option value="tamilnadu">Tamil Nadu</option>
        <option value="andhra">Andhra Pradesh</option>
        <option value="kerala">Kerala</option>
        <option value="karnataka">Karnataka</option>
      </select>
    </div>
  );
};

export default State;