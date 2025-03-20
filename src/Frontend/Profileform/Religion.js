import react from "react";

const Religion = ({value, onChange}) => {
    return (
        <div className="form-group">
          <label>Religion</label>
          <select
            name="religion"
            value={value}
            onChange={onChange}
            required
          >
            <option value="">Select...</option>
            <option value="hindu">Hindu</option>
            <option value="christian">Christian</option>
            <option value="muslim">Muslim</option>
          </select>
        </div>
    );
};

export default Religion