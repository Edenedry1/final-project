
import React, { useState } from 'react';
import '../styles/SignUp.css';
import axios from 'axios';

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
    <div className="login-container">
      <div className="logo">
        <img src="https://via.placeholder.com/100" alt="Deepfake Audio Logo" />
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
        <label>
          <input
            type="checkbox"
            checked={isInstitution}
            onChange={(e) => setIsInstitution(e.target.checked)}
          />
          Educational Institution
        </label>
        <button type="submit">Sign Up</button>
        <div className="switch-form">
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignUp;