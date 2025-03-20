import React, { useState } from 'react';
import '../App.css';
import VerifyProfile from './VerifyProfile';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: 'Mahendra',
    age: 26,
    gender: 'Male',
    caste: 'OC',
    religion: 'Hindu',
    Occupation: 'IT profession',
    interests: 'Music, Traveling, Photography',
    email: 'Mahe@example.com',
    location: 'Chennai,TN',
    aboutMe: 'I am a passionate traveler who loves exploring new places and cultures. Looking for a life partner who shares similar interests.'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(profileData);
  const [newProfilePicture, setNewProfilePicture] = useState(null);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData(editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setIsEditing(false);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureEdit = () => {
    document.getElementById('profilePictureInput').click();
  };

  return (
    <div className="profile-container">
      <div className="profile-details">
        <div className="profile-image">
        <img src={newProfilePicture || profileData.profilePicture} alt="Profile" />
          <button type="button" className="edit-profile-picture-btn" onClick={handleProfilePictureEdit}>
            Edit
          </button>
          <input
            type="file"
            id="profilePictureInput"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleProfilePictureChange}
          />
        </div>

        <div className="profile-info">
          {isEditing ? (
            <form>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editedData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Age:</label>
                <input
                  type="number"
                  name="age"
                  value={editedData.age}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Gender:</label>
                <select
                  name="gender"
                  value={editedData.gender}
                  onChange={handleChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="form-group">
                <label>Caste:</label>
                <input
                  type="text"
                  name="caste"
                  value={editedData.caste}
                  onChange={handleChange}
                />
                </div>
                <div className="form-group">
                <label>Religion:</label>
                <input
                  type="text"
                  name="religion"
                  value={editedData.religion}
                  onChange={handleChange}
                />
                </div>
                <div className="form-group">
                <label>Occupation:</label>
                <input
                  type="text"
                  name="Occupation"
                  value={editedData.Occupation}
                  onChange={handleChange}
                />
                </div>
              <div className="form-group">
                <label>Interests:</label>
                <input
                  type="text"
                  name="interests"
                  value={editedData.interests}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editedData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Location:</label>
                <input
                  type="text"
                  name="location"
                  value={editedData.location}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>About Me:</label>
                <textarea
                  name="aboutMe"
                  value={editedData.aboutMe}
                  onChange={handleChange}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="save-btn" onClick={handleSave}>Save</button>
                <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <h3>{profileData.name}</h3>
              <p>Age: {profileData.age}</p>
              <p>Gender: {profileData.gender}</p>
              <p>Caste: {profileData.caste} </p>
              <p>Religion: {profileData.religion} </p>
              <p>Occupation: {profileData.Occupation} </p>
              <p>Email: {profileData.email}</p>
              <p>Location: {profileData.location}</p>
              <p>Interests: {profileData.interests}</p>
              <p>About Me: {profileData.aboutMe}</p>
              <button className="edit-btn" onClick={handleEdit}>Edit Profile</button>
            </>
          )}
        </div>
      </div>
      <hr/>
      <VerifyProfile/>
    </div>
  );
};

export default Profile;
