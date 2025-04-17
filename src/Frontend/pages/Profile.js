import React, { useState } from 'react';
import axios from 'axios';
import VerifyProfile from './VerifyProfile';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    } else {
      setEditedData({ ...editedData, [name]: value });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put('http://localhost:8081/api/profile', {
        ...editedData, 
        username,
        password,
      });
  
      if (response.data && response.data.message === 'Profile updated successfully') {
        setProfileData(editedData);
        setIsEditing(false);
        setErrorMessage('');
      } else {
        setErrorMessage('Error saving profile data');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Error saving profile data');
    }
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

  const fetchProfileData = async () => {
    if (username && password) {
      try {
        const response = await axios.post('http://localhost:8081/api/profile', {
          username,
          password
        });

        if (response.data) {
          setProfileData(response.data);
          setEditedData(response.data);
          setErrorMessage('');
        }
      } catch (error) {
        setErrorMessage('User not found or incorrect password');
        console.error('Error fetching profile data:', error);
      }
    } else {
      setErrorMessage('Please enter both username and password');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchProfileData();
  };

  if (!profileData) {
    return (
      <div>
        <h2>Login to view profile</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
            />
          </div>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-details">
        <div className="profile-image">
          <img
            src={newProfilePicture || profileData.profile_picture}
            alt="Profile"
          />
          <button
            type="button"
            className="edit-profile-picture-btn"
            onClick={handleProfilePictureEdit}
          >
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
                  name="username"
                  value={editedData.username}
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
                <label>State:</label>
                <input
                  type="text"
                  name="State"
                  value={editedData.state}
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
                <button type="button" className="save-btn" onClick={handleSave}>
                  Save
                </button>
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h3>{profileData.username}</h3>
              <p>Age: {profileData.age}</p>
              <p>Gender: {profileData.gender}</p>
              <p>Caste: {profileData.caste}</p>
              <p>Religion: {profileData.religion}</p>
              <p>Email: {profileData.email}</p>
              <p>State: {profileData.state}</p>
              <p>Interests: {profileData.interests}</p>
              <p>About Me: {profileData.about_me}</p>
              <button className="edit-btn" onClick={handleEdit}>
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
      <hr />
      <VerifyProfile />
    </div>
  );
};

export default Profile;
