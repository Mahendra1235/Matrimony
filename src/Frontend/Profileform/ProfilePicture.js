import React from 'react';
import { FaEdit } from 'react-icons/fa';

const ProfilePicture = ({ profilePicture, onFileChange, isEditing, onEditClick }) => {
  return (
      <div className="profile-picture-container">
        <div className="profile-picture">
          <img
            src={profilePicture ? URL.createObjectURL(profilePicture) : "https://png.pngtree.com/png-vector/20190307/ourmid/pngtree-vector-edit-profile-icon-png-image_758006.jpg"}
            alt="Profile"
          />
          <FaEdit className="edit-icon" onClick={onEditClick} />
          <h4>Profile picture</h4>
        </div>
        {isEditing && (
          <input
            type="file"
            name="profilePicture"
            onChange={onFileChange}
            accept="image/*"
            className="file-input"
          />
        )}
      </div>
  );
};

export default ProfilePicture;
