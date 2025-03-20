import React, { useState } from 'react';
import { HiMiniCheckBadge } from 'react-icons/hi2';
import VerifiedIcon from '@mui/icons-material/Verified';

import '../App.css'

function VerifyProfile() {
  const [idFile, setIdFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [salaryFile, setSalaryFile] = useState(null);

  const handleIdFileChange = (e) => {
    setIdFile(e.target.files[0]);
  };

  const handlePhotoFileChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleSalaryFileChange = (e) => {
    setSalaryFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="verify-profile">
      <h1><strong>Verify Your Profile</strong>
      <VerifiedIcon sx={{ color: '#4caf50', fontSize: 30 }} />
      </h1>

      <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor="id-upload">
            Upload ID Document: 
            <input
              type="file"
              id="id-upload"
              onChange={handleIdFileChange}
              accept="image/*,application/pdf"
            />
          </label>
          {idFile && <p>File: {idFile.name}</p>}
        </div>

        <div>
          <label htmlFor="photo-upload">
            Upload Photo:
            <input
              type="file"
              id="photo-upload"
              onChange={handlePhotoFileChange}
              accept="image/*"
            />
          </label>
          {photoFile && <p>File: {photoFile.name}</p>}
        </div>

        <div>
          <label htmlFor="salary-upload">
            Upload Salary Document
            <input
              type="file"
              id="salary-upload"
              onChange={handleSalaryFileChange}
              accept="image/*,application/pdf"
            />
          </label>
          {salaryFile && <p>File: {salaryFile.name}</p>}
        </div>

        <button type="submit">Submit Verification</button>
        

      </form>
    </div>
  );
}

export default VerifyProfile;
