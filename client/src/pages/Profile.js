import React, { useEffect, useState } from 'react';
import '../styles/Level1.css';
import logo from '../images/logo.png';

const Profile = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    feedback: '',
    is_institution: 0,
  });
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      fetch(`http://localhost:5001/api/profile/${storedUserId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('PROFILE FROM SERVER:', data);
          setUser(data);
        })
        .catch((err) => console.error('Error fetching profile:', err));
    }
  }, []);

  const currentLevel = localStorage.getItem('unlockedLevel') || '1';
  const totalCoins = localStorage.getItem('totalCoins') || '0';

  const handlePasswordChange = () => {
    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      return;
    }
    setMessage('Password updated successfully.');
    setNewPassword('');
  };

  return (
    <>
      <header data-bs-theme="dark">
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <div className="container-fluid">
            <div className="navbar-brand">
              <img src={logo} alt="DeepFakeAudio Logo" className="logo" />
              DeepFakeAudio
            </div>
            <div className="toolbar-icons">
              <a href="/upload" title="Home">🏠</a>
              <a href="/game" title="Game">🎮</a>
            </div>
          </div>
        </nav>
      </header>

      <div className="level-container">
        <h2>User Profile 👤</h2>

        <div className="completion-block">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Current Game Level:</strong> {currentLevel}</p>
          <p><strong>Total Coins:</strong> {totalCoins}</p>
          <p><strong>Institution:</strong> {user.is_institution === 1 ? 'Yes' : 'No'}</p>
          {user.feedback && <p><strong>Feedback:</strong> {user.feedback}</p>}

          <div style={{ marginTop: '2rem' }}>
            <h4>Change Password 🔐</h4>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '8px', width: '60%' }}
            />
            <br /><br />
            <button className="btn btn-success" onClick={handlePasswordChange}>Update Password</button>
            {message && <p style={{ marginTop: '1rem', color: '#90caf9' }}>{message}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;