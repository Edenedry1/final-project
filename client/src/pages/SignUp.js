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
    <nav className="navbar">
      <div className="container-fluid">
        <div className="navbar-brand">
          <img src={require('../images/logo.png')} alt="DeepFakeAudio Logo" className="logo" />
          DeepFakeAudio
        </div>
        <div className="toolbar-icons">
          <a href="/">🏠</a>
          <a href="/login">🔑</a>
        </div>
      </div>
    </nav>
  </header>

  <div className="login-container">
    {/* Floating decorations */}
    <div className="signup-decorations">
      <div className="floating-audio-signup" style={{left: '8%', top: '12%', animationDelay: '0s'}}>🎧</div>
      <div className="floating-audio-signup" style={{left: '88%', top: '20%', animationDelay: '1.8s'}}>🎵</div>
      <div className="floating-audio-signup" style={{left: '12%', top: '75%', animationDelay: '3.2s'}}>🔊</div>
      <div className="floating-audio-signup" style={{left: '85%', top: '85%', animationDelay: '1.2s'}}>🎤</div>
      <div className="floating-audio-signup" style={{left: '45%', top: '8%', animationDelay: '2.5s'}}>📻</div>
      <div className="floating-audio-signup" style={{left: '25%', top: '45%', animationDelay: '0.7s'}}>🎶</div>
    </div>

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
            🎓 Educational Institution (Get access to hint features)
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