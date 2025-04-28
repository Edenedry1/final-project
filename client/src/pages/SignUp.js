
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
    </>

  );
};

export default SignUp;