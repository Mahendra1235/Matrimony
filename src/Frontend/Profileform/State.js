import React from "react";

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
        <option value="Andhra">Andhra Pradesh</option>
        <option value="Arnachal Pradesh">Arunachal Pradesh</option>
        <option value="Bihar"> Bihar</option>
        <option value="Chattisgarh">Chattisgarh</option>
        <option value="Goa">Goa</option>
        <option value="Gujarat">Gujarat</option>
        <option value="Haryana">Haryana</option>
        <option value="Himachal Pradesh">Himachal Pradesh</option>
        <option value="Jharkhand"> Jharkhand</option>
        <option value="Karnataka">Karnataka</option>
        <option value="Kerala">Kerala</option>
        <option value="Madhya Pradesh">Madhya Pradesh</option>
        <option value="Maharastra">Maharastra</option>
        <option value="Manipur">Manipur</option>
        <option value="Meghalaya">Meghalaya</option>
        <option value="Mizoram">Mizoram</option>
        <option value="Nagaland">Nagaland</option>
        <option value="Odisha">Odisha</option>
        <option value="Punjab">Punjab</option>
        <option value="Rajasthan">Rajasthan</option>
        <option value="Sikkim">Sikkim</option>
        <option value="Tamil Nadu">Tamil Nadu</option>
        <option value="Telangana">Telangana</option>
        <option value="Tripura">Tripura</option>
        <option value="Uttarpradesh">Uttar Pradesh</option>
        <option value="Uttarakhand">Uttarakhand</option>
        <option value="West bengal">West Bengal</option>
        
      </select>
    </div>
  );
};

export default State;