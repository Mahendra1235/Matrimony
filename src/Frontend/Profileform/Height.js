
import react from "react";

const Height = ({value, onChange}) => {
    return (
        <div className="form-group">
          <label>Height (in feet/inches)</label>
          <select
            name="height"
            value={value}
            onChange={onChange}
            required
          >
        <option value="">Select...</option>
        <option value="4'5" >4'5"</option>
        <option value="4'6" >4'6"</option>
        <option value="4'7" >4'7"</option>
        <option value="4'8" >4'8"</option>
        <option value="4'9" >4'9"</option>
        <option value="4'10" >4'10"</option>
        <option value="4'11" >4'11"</option>
        <option value="5'0" >5'0"</option>
        <option value="5'1" >5'1"</option>
        <option value="5'2" >5'2"</option>
        <option value="5'3" >5'3"</option>
        <option value="5'4" >5'4"</option>
        <option value="5'5" >5'5"</option>
        <option value="5'6" >5'6"</option>
        <option value="5'7" >5'7"</option>
        <option value="5'8" >5'8"</option>
        <option value="5'9" >5'9"</option>
        <option value="5'10" >5'10"</option>
        <option value="5'11" >5'11"</option>
        <option value="6'0" >6'0"</option>
        <option value="6'1" >6'1"</option>
        <option value="6'2" >6'2"</option>
        <option value="6'3" >6'3"</option>
        <option value="6'4" >6'4"</option>
        <option value="6'5" >6'5"</option>
        <option value="6'6" >6'6"</option>
        <option value="6'7" >6'7"</option>
        <option value="6'8" >6'8"</option>
        <option value="6'9" >6'9"</option>
        <option value="6'10" >6'10"</option>
        <option value="6'11" >6'11"</option>
        <option value="7'0" >7'0"</option>
        <option value="7'1" >7'1"</option>
        <option value="7'2" >7'2"</option>
        <option value="7'3" >7'3"</option>
        <option value="7'4" >7'4"</option>
        <option value="7'5" >7'5"</option>
        <option value="7'6" >7'6"</option>
        <option value="7'7" >7'7"</option>
        <option value="7'8" >7'8"</option>
        <option value="7'9" >7'9"</option>
        <option value="7'10" >7'10"</option>
        <option value="7'11" >7'11"</option>
          </select>
        </div>
    );
};

export default Height
        