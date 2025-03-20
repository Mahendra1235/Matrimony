import React from 'react';
import '../App.css'


const FAQCreateProfile = () => {
  return (
    <div className='Create-profile'>
      <h1>How do I create a profile?</h1>
      <p>Creating a profile on our platform is simple! Follow these steps:</p>
      <ol>
        <li><strong>Step 1:</strong> Visit our <a href="/">home page</a> and click on the "Sign Up" button.</li>
        <li><strong>Step 2:</strong> Fill in your personal details such as name, age, gender, and location.</li>
        <li><strong>Step 3:</strong> Choose a username and password for your account.</li>
        <li><strong>Step 4:</strong> Add a profile picture. This helps other users identify you!</li>
        <li><strong>Step 5:</strong> Fill in your interests, hobbies, and what you're looking for in a match.</li>
        <li><strong>Step 6:</strong> Click "Save" and complete the registration process!</li>
      </ol>
      <p>Once you've completed these steps, your profile will be active, and you'll be ready to start connecting with others!</p>
      <p>If you face any issues, please reach out to our support team via phone or email.</p>
    </div>
  );
};

export default FAQCreateProfile;
