import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; // וודא שזה הנתיב הנכון לקובץ העיצוב שלך

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Deepfake Audio Detector</h1>
        <p>Discover the power of identifying deepfake audio through interactive tools.</p>
      </header>
      <div className="home-buttons">
        <Link to="/login" className="btn">Login</Link>
        <Link to="/signup" className="btn">Sign Up</Link>
      </div>
    </div>
  );
};

export default Home;
