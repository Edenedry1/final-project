import React, { useState } from 'react';
import '../styles/SignUp.css';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';


const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isInstitution, setIsInstitution] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5001/api/SignUp', {
        username: name,
        email,
        password,
        is_institution: isInstitution,
      });
      setMessage(response.data.message);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsInstitution(false);
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <>
    {/* Header */}
    <header data-bs-theme="dark">
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div className="container-fluid">
          <div className="navbar-brand">
            <img src={require('../images/audio-detector-logo.png')} alt="DeepFakeAudio Logo" className="logo" />
            DeepFakeAudio
          </div>
          <div className="toolbar-icons">
            <a href="/">🏠</a>
            <a href="/login">🔑</a>
          </div>
        </div>
      </nav>
    </header>

    {/* Video Background */}
    <div className="video-background">
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="bg-video"
      >
        <source src="/sound-waves-bg.mp4" type="video/mp4" />
      </video>
    </div>

    <div className="signup-container">

    <div className="signup-form-container">
      <div className="logo">
        <img src={require('../images/userlogo.png')} alt="DeepFakeAudio Logo" className="logo" />
      </div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <div className="institution-highlight">
          <label>
            <input
              type="checkbox"
              checked={isInstitution}
              onChange={(e) => setIsInstitution(e.target.checked)}
            />
            Educational Institution🎓 
          </label>
        </div>
        <button type="submit">Sign Up</button>
        <div className="switch-form">
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  </div>
    </>
  );
};

export default SignUp;