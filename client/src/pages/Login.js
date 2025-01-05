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
      setMessage(response.data.message);
      setEmail('');
      setPassword('');
      navigate('/upload'); // הפניה לעמוד upload לאחר התחברות מוצלחת
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <img src="https://via.placeholder.com/100" alt="Deepfake Audio Logo" />
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
  );
};

export default Login;
