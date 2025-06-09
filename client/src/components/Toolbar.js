import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Toolbar.css';

const Toolbar = () => {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  return (
    <header data-bs-theme="dark">
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div className="container-fluid">
          <div 
            className="navbar-brand" 
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <img 
              src={require('../images/logo.png')} 
              alt="DeepFakeAudio Logo" 
              className="logo" 
            />
            DeepFakeAudio
          </div>
          <div className="navbar-nav ms-auto">
            {loggedInUser ? (
              <>
                <span className="nav-link">Welcome, {loggedInUser.username}!</span>
                <button className="btn btn-outline-light" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn btn-outline-light me-2" 
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
                <button 
                  className="btn btn-light" 
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Toolbar; 