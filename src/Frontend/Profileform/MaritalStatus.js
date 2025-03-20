import React from 'react'

const MaritalStatus = ({value, onChange}) => {
    return(
        <div className="form-group">
          <label>Marital Status</label>
          <select
            name="maritalStatus"
            value={value}
            onChange={onChange}
            required
          >
            <option value="">Select...</option>
            <option value="single">Single</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>
    );
};

export default MaritalStatus