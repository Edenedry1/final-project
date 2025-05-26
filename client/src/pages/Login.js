import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // לשימוש בהפניה
import '../styles/Login.css';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // hook להפניה

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/login', {
        email,
        password,
      });

      const { message, user } = response.data; // משיכת המידע על המשתמש המחובר
      setMessage(message);
      setEmail('');
      setPassword('');

      // שמירת פרטי המשתמש המחובר ב-localStorage
      localStorage.setItem('loggedInUser', JSON.stringify(user));

      // הפניה לעמוד upload לאחר התחברות מוצלחת
      navigate('/upload');
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
          <a href="/signup">📝</a>
        </div>
      </div>
    </nav>
  </header>

  <div className="login-container">
    {/* Floating decorations */}
    <div className="login-decorations">
      <div className="floating-audio-login" style={{left: '10%', top: '15%', animationDelay: '0s'}}>🎧</div>
      <div className="floating-audio-login" style={{left: '85%', top: '25%', animationDelay: '1.5s'}}>🎵</div>
      <div className="floating-audio-login" style={{left: '15%', top: '70%', animationDelay: '2.8s'}}>🔊</div>
      <div className="floating-audio-login" style={{left: '80%', top: '80%', animationDelay: '0.8s'}}>🎤</div>
      <div className="floating-audio-login" style={{left: '50%', top: '10%', animationDelay: '2.2s'}}>📻</div>
    </div>

    <div className="login-form-container">
      <div className="logo">
        <img src={require('../images/userlogo.png')} alt="DeepFakeAudio Logo" className="logo" />
      </div>
      <h1>Welcome Back</h1>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
        <div className="forgot-password">
          <a href="#">Forgot your password?</a>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  </div>
    </>
  );
};

export default Login;
