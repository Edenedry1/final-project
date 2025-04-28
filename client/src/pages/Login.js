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
    <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <div className="container-fluid">
        <div className="navbar-brand" href="#">
          <img src={require('../images/logo.png')} alt="DeepFakeAudio Logo" className="logo" />
          DeepFakeAudio
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">

              <a className="nav-link active" aria-current="page" href="/">
                Home
              </a>
            </li>
          </ul>
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  </header>
    <div className="login-container">
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
    </>
  );
};

export default Login;
