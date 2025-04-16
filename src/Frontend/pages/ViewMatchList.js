import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { faEnvelope, faComment, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../App.css';
import Subscriptions from './Subscriptions';

const Profile = () => {
  const location = useLocation();
  const selectedMatch = location.state.match;
  const [showPhone, setShowPhone] = useState(false);
  const [showChat, setShowChat] = useState(false); 
  const [message, setMessage] = useState('');  
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [isPaymentDone, setIsPaymentDone] = useState(false);

  const handleShowPhoneNumber = () => {
    setShowPhone(!showPhone);
  };

  const handleChat = () => {
    setShowChat(!showChat);
  };

  const handleEmail = () => {
    window.location.href = `mailto:${selectedMatch.email}?subject=Interested in connecting!&body=Hi ${selectedMatch.name}, I would love to connect!`;
  };

  const handleSendMessage = () => {
    if (message.trim()) { 
      setChatMessages([...chatMessages, { text: message, sender: 'You' }]); 
      setMessage(''); 
    }
  };


  return (
    <div className="profile">
      <h2>{selectedMatch.name}'s Profile</h2>
      <img src={selectedMatch.profilepicture} alt="Profile" />
      <p>Age: {selectedMatch.age}</p>
      <p>Height: {selectedMatch.height}</p>
      <p>Weight: {selectedMatch.weight}</p>
      <p>Caste: {selectedMatch.caste}</p>
      <p>State: {selectedMatch.state}</p>
      <p>Interests: {selectedMatch.interests}</p>
      <h3>Interested? Connect now</h3>

<div className="contact-options">

  {(isPaymentDone && (selectedPlan === 'Premium' || selectedPlan === 'Elite')) && (
    <button onClick={handleChat} className="contact-btn">
      <FontAwesomeIcon icon={faComment} /> Chat
    </button>
  )}

  {(isPaymentDone && (selectedPlan === 'Premium' || selectedPlan === 'Elite')) && (
    <button onClick={handleEmail} className="contact-btn">
      <FontAwesomeIcon icon={faEnvelope} /> Email
    </button>
  )}

  {(isPaymentDone && selectedPlan === 'Elite') && (
    <button onClick={handleShowPhoneNumber} className="contact-btn">
      <FontAwesomeIcon icon={faPhoneAlt} /> {showPhone ? 'Hide Phone Number' : 'Show Phone Number'}
    </button>
  )}

  {(isPaymentDone && selectedPlan === 'Elite') && showPhone && (
    selectedMatch?.phone_number ? (
      <p>Phone Number: {selectedMatch.phone_number}</p>
    ) : (
      <p>Phone number is unavailable</p>
    )
  )}
</div>


      {showChat && (
        <div className="chatbox">
          <div className="chatbox-header">
            <h4>Chat with {selectedMatch.name}</h4>
            <button onClick={handleChat} className="close-chat-btn">X</button>
          </div>
          
          <div className="chatbox-messages">
            {chatMessages.length === 0 ? (
              <p>Start your conversation here...</p>
            ) : (
              chatMessages.map((msg, index) => (
                <div key={index} className="chat-message">
                  <strong>{msg.sender}:</strong> {msg.text}
                </div>
              ))
            )}
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
          />
          <button onClick={handleSendMessage} className="send-btn">Send</button>
        </div>

      )}
  <Subscriptions 
    selectedPlan={selectedPlan}
    setSelectedPlan={setSelectedPlan}
    setIsPaymentDone={setIsPaymentDone}
    isPaymentDone={isPaymentDone}
  />
    </div>
  );
};

export default Profile;
