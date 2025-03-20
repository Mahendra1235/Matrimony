import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; 
import '../App.css'

const Profile = () => {
  const { id } = useParams();
  const matches = [
    { name: 'Harish', age: 30, interests: 'Music, Travel', Occupation: 'Civil Engineer', profilepicture: 'https://randomuser.me/api/portraits/men/58.jpg', height: '5.5ft', },
    { name: 'Priyanka', age: 28, interests: 'Reading, Yoga', Occupation: 'Architect', profilepicture: 'https://randomuser.me/api/portraits/women/84.jpg', height: '5.2ft', },
    { name: 'Naveen', age: 28, interests: 'Gym', Occupation: 'Software Engineer.', profilepicture: 'https://randomuser.me/api/portraits/men/65.jpg', height: '5.7ft', },
    { name: 'Tariq', age: 30, interests: 'Photography', Occupation: 'Photographer', profilepicture: 'https://randomuser.me/api/portraits/men/50.jpg', height: '6.0ft', },
    { name: 'Manasa', age: 35, interests: 'Cooking', Occupation: 'Freelancer', profilepicture: 'https://randomuser.me/api/portraits/women/15.jpg', height: '5.5ft', },
    { name: 'Karthik', age: 35, interests: 'Movies', Occupation: 'Movie Director', profilepicture: 'https://randomuser.me/api/portraits/men/69.jpg', height: '6.5ft', },
  ];

  const selectedMatch = matches[id];

  const [isInterested, setIsInterested] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleShowInterest = () => {
    setIsInterested(true);
    setShowPopup(true);   
  };

  const handleDontShowInterest = () => {
    setIsInterested(false);
  };

  return (
    <div className="profile">
    <img src={selectedMatch.profilepicture} alt="Profile" />
      <h2>{selectedMatch.name}'s Profile</h2>
      <p>Age: {selectedMatch.age}</p>
      <p>Height: {selectedMatch.height}</p>
      <p>Interests: {selectedMatch.interests}</p>
      <p>Occupation: {selectedMatch.Occupation}</p>
      <h3>Intrested? Connect now</h3>

      {showPopup && <div className="popup-message">Your interest has been sent!</div>}

      {!isInterested ? (
        <>
          <button onClick={handleShowInterest}> <strong>Show Interest</strong></button>
        </>
      ) : (
        <>
          <button onClick={handleDontShowInterest}>Don't Show Interest</button>
        </>
      )}

      {/* <div className="bottom-buttons">
        <button onClick={handleDontShowInterest}>x Don't Show</button>
      </div> */}
    </div>
  );
};

export default Profile;
