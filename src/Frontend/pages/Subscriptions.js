import React from "react";
import GooglePayComponent from "./GooglePayComponent";

const Subscriptions = ({ selectedPlan, setSelectedPlan, isPaymentDone,setIsPaymentDone }) => {
  const membershipPlans = [
    { name: 'Basic', price: '₹0/month', description: 'Free access to limited features.' },
    { name: 'Premium', price: '₹499/month', description: 'Access to chat and email.' },
    { name: 'Elite', price: '₹999/month', description: 'Full access including phone number.' },
  ];

  return (
    <div className="membership-section">
      <h3>Choose Your Membership Package to connect with our members</h3>
      <div className="membership-options">
        {membershipPlans.map((plan) => (
          <div
            key={plan.name}
            className={`membership-card ${selectedPlan === plan.name ? 'selected' : ''}`}
          >
            <h4>{plan.name} Plan</h4>
            <p><strong>{plan.price}</strong></p>
            <p>{plan.description}</p>
            <button onClick={() => {
              setSelectedPlan(plan.name);
              setIsPaymentDone(false);
            }}>
              {selectedPlan === plan.name ? 'Selected' : 'Choose'}
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="selected-package-info">
          <p>You have selected the <strong>{selectedPlan}</strong> package.</p>

          {selectedPlan !== 'Basic' && (
            <div style={{ marginTop: '20px' }}>
              <GooglePayComponent
                price={selectedPlan === 'Premium' ? '499.00' : selectedPlan === 'Elite' ? '999.00' : '0.00'}
                onPaymentSuccess={() => {
                  setIsPaymentDone(true);
                  alert(`Payment successful for the ${selectedPlan} plan!`);
                }}
              />
            </div>
          )}

          {(selectedPlan === 'Basic' || isPaymentDone) && (
            <p className="payment-success-message">
              🎉 You are now subscribed to the <strong>{selectedPlan}</strong> plan! 🎉
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
