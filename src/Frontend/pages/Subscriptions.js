import React, { useState } from "react";

const Subscriptions = () => {
  const [selectedPackage, setSelectedPackage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const membershipPlans = [
    {
      name: 'Basic',
      price: '₹0/month',
      description: 'Free access to limited features.',
      view:'Can only view profiles',
      
    },
    {
      name: 'Premium',
      price: '₹499/month',
      description: 'Access to chat and email.',
    },
    {
      name: 'Elite',
      price: '₹999/month',
      description: 'Full access including phone number.',
    },
  ];

  const handlePayment = () => {
    setTimeout(() => {
      setPaymentSuccess(true);
      alert(`Payment successful for the ${selectedPackage} plan!`);
    }, 1000);
  };

  return (
    <div className="membership-section">
      <h3>Choose Your Membership Package to connect with our members</h3>
      <div className="membership-options">
        {membershipPlans.map((plan) => (
          <div
            key={plan.name}
            className={`membership-card ${selectedPackage === plan.name ? 'selected' : ''}`}
          >
            <h4>{plan.name} Plan</h4>
            <p><strong>{plan.price}</strong></p>
            <p>{plan.description}</p>
            <button onClick={() => {
              setSelectedPackage(plan.name);
              setPaymentSuccess(false);
            }}>
              {selectedPackage === plan.name ? 'Selected' : 'Choose'}
            </button>
          </div>
        ))}
      </div>

      {selectedPackage && (
        <div className="selected-package-info">
          <p>
            You have selected the <strong>{selectedPackage}</strong> package.
          </p>
          {!paymentSuccess && selectedPackage !== 'Basic' && (
            <button className="pay-button" onClick={handlePayment}>
              Proceed to Payment
            </button>
          )}
          {paymentSuccess && (
            <p className="payment-success-message">
              🎉 Payment successful! You are now subscribed to the <strong>{selectedPackage}</strong> plan🎉.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
