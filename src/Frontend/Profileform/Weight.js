import react from "react";

const Weight = ({value, onChange}) => {
    return (
        <div className="form-group">
          <label>Weight (in Kg)</label>
          <select
            name="weight"
            value={value}
            onChange={onChange}
            required
          >
            <option value="">Select...</option>
            <option value="50-55">50-55</option>
            <option value="55-60">55-60</option>
            <option value="60-65">60-65</option>
            <option value="65-70">65-70</option>
            <option value="70-75">70-75</option>
            <option value="75-80">75-80</option>
            <option value="80-85">80-85</option>
            <option value="85-90">85-90</option>
            <option value="90-95">90-95</option>
            <option value="95-100">95-100</option>
          </select>
        </div>
    );
};

export default Weight