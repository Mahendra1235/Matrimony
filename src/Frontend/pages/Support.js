import React from 'react';
import { FaPhone, FaEnvelope, FaQuestionCircle } from 'react-icons/fa';
import '../App.css';

const Support = () => {
  return (
    <div className="support-container">
      <h2>Support</h2>
      <p>We are here to help you with any issues or questions you may have.</p>

      <div className="support-section">
        <h3><FaPhone /> Phone Support</h3>
        <p>If you need assistance, feel free to call our support team:</p>
        <p><strong>Phone Number:</strong> +1-123-123-4567</p>
      </div>

      <div className="support-section">
        <h3><FaEnvelope /> Email Support</h3>
        <p>If you prefer email, you can reach us at:</p>
        <p><strong>Email:</strong> support@elitematrimony.com</p>
      </div>

      <div className="support-section">
        <h3><FaQuestionCircle /> Frequently Asked Questions</h3>
        <ul>
          <li><a href="/faq/create-profile">How do I create a profile?</a></li>
          <li><a href="/faq/contact-match">How do I contact a match?</a></li>
          <li><a href="/faq/technical-issues">What should I do if I face any technical issues?</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Support;
