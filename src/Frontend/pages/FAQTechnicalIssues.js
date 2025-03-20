import React from 'react';
import '../App.css'

const FAQTechnicalIssues = () => {
  return (
    <div className='technical-issues-container'>
      <h1>What should I do if I face any technical issues?</h1>
      <p>If you're experiencing any issues with the site or app, here are some troubleshooting steps:</p>
      
      <h2>1. Login Issues</h2>
      <p>If you're having trouble logging in:</p>
      <ul>
        <li>Check if your email/username and password are entered correctly.</li>
        <li>If you've forgotten your password, use the "Forgot Password" option to reset it.</li>
        <li>Ensure that your internet connection is stable.</li>
        <li>If you still can't log in, try clearing your browser's cache and cookies or using a different browser.</li>
      </ul>
      
      <h2>2. Error Messages</h2>
      <p>If you're seeing error messages when using the site:</p>
      <ul>
        <li>Refresh the page to see if the issue resolves itself.</li>
        <li>Check if there are any known outages or maintenance notifications on the website.</li>
        <li>If the error persists, try accessing the site on a different device.</li>
      </ul>
      
      <h2>3. Site Not Loading</h2>
      <p>If the website isn't loading correctly:</p>
      <ul>
        <li>Ensure your internet connection is active.</li>
        <li>Try restarting your router or switching to a different Wi-Fi network.</li>
        <li>If the problem continues, contact our support team with details about the issue.</li>
      </ul>
      
      <h2>4. Profile Issues</h2>
      <p>If you're unable to update your profile or any of its details:</p>
      <ul>
        <li>Ensure that all required fields are filled out correctly.</li>
        <li>Check if you're uploading an image that meets our platform's size or format requirements.</li>
        <li>If the issue persists, try logging out and logging back in or refreshing the page.</li>
      </ul>
      
      <p>If you're still facing issues after following these steps, please contact our support team by email at <strong>support@elitematrimony.com</strong> or call us at <strong>+1-123-123-4567</strong>.</p>
    </div>
  );
};

export default FAQTechnicalIssues;
