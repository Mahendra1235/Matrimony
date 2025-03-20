import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="home">
      <section className="Top-section">
        <div className="Top-content">
          <h1>Welcome to Elite Matrimony</h1>
          <p>Your journey to finding a soulmate starts here.</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-button">Sign Up / Register</Link>
            <Link to="/login" className="cta-button">Login</Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Personalized Matches</h3>
            <p>Our advanced algorithm helps you find matches based on your preferences and interests.</p>
          </div>
          <div className="feature-card">
            <h3>Verified Profiles</h3>
            <p>We ensure that every profile is verified for authenticity, giving you peace of mind.</p>
          </div>
          <div className="feature-card">
            <h3>Privacy & Security</h3>
            <p>Your data is safe with us. We prioritize privacy and ensure your information stays secure.</p>
          </div>
        </div>
      </section>

      <section className="Users-section">
        <h2>What Our Users Say</h2>
        <div className="Users-cards">
          <div className="Users-card">
            <p>"Elite Matrimony helped me find my soulmate! I am now happily married, and I couldn't be more thankful."</p>
            <h4>- Raj & Priya</h4>
          </div>
          <div className="Users-card">
            <p>"The platform is easy to use and very secure. I found a partner who shares similar values and interests."</p>
            <h4>- Ravi & Meera</h4>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default Home;
