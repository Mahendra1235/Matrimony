import React from "react";

const Gender = ({value, onChange}) => {
    return(
        <div className="form-group">
          <label>Gender*</label>
          <select
            name="gender"
            value={value}
            onChange={onChange}
            required
          >
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
    );
};

export default Gender