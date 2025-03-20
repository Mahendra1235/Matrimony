import React from "react";
import '../App.css';

const About = () => {
    return (
        <div className="about-container">
            <h2>About Elite Matrimony</h2>
            <p className="intro">
                Welcome to <strong>Elite Matrimony</strong> – a premier matrimony website dedicated to helping individuals find their perfect life partner. We believe that love, companionship, and respect are the foundations of a happy marriage.
            </p>

            <div className="section">
                <h3>Our Mission</h3>
                <p>
                    At Elite Matrimony, our mission is simple: to provide a trusted and reliable platform where people can connect with potential life partners who share similar values, interests, and goals. Our goal is to make the matchmaking process transparent, respectful, and personalized for everyone.
                </p>
            </div>

            <div className="section">
                <h3>Why Choose Us?</h3>
                <ul>
                    <li><strong>Personalized Matches:</strong> We consider your preferences, interests, and values to suggest ideal matches.</li>
                    <li><strong>Secure and Private:</strong> Your data and privacy are our top priority. We provide a safe environment for users.</li>
                    <li><strong>Verified Profiles:</strong> All profiles are verified to ensure genuine and trustworthy connections.</li>
                    <li><strong>Global Reach:</strong> We bring together individuals from different parts of the world with shared values.</li>
                </ul>
            </div>

            <div className="section">
                <h3>Our Values</h3>
                <p>
                    We value honesty, respect, and integrity. We believe that a strong relationship is built on mutual understanding and trust. We strive to provide a platform where people can feel confident, safe, and respected while seeking a life partner.
                </p>
            </div>

            <div className="section">
                <h3>Our Story</h3>
                <p>
                    Founded in [2020], Elite Matrimony was born out of a desire to create a modern, technology-driven platform that respects traditional values while offering users a seamless, enjoyable experience. We have helped thousands of individuals find their perfect match and start their journey to a happy marriage.
                </p>
            </div>
        </div>
    );
};

export default About;
