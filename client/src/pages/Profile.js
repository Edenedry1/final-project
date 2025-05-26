import React, { useEffect, useState } from 'react';
import '../styles/Level1.css';
import logo from '../images/logo.png';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (storedUser && storedUser.id) {
      fetch(`http://localhost:5001/api/profile/${storedUser.id}`)
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            setError(data.error);
          } else {
            setProfile(data);
          }
        })
        .catch(err => setError('Failed to fetch profile data.'));
    } else {
      setError('User not logged in.');
    }
  }, []);

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
              <a href="/upload">🏠</a>
              <a href="/game">🎮</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Floating decorations */}
      <div className="profile-decorations">
        <div className="floating-audio-profile" style={{left: '5%', top: '15%', animationDelay: '0s'}}>🎧</div>
        <div className="floating-audio-profile" style={{left: '90%', top: '25%', animationDelay: '2.5s'}}>🎵</div>
        <div className="floating-audio-profile" style={{left: '10%', top: '65%', animationDelay: '5s'}}>🔊</div>
        <div className="floating-audio-profile" style={{left: '85%', top: '75%', animationDelay: '1.5s'}}>🎤</div>
        <div className="floating-audio-profile" style={{left: '50%', top: '10%', animationDelay: '3.5s'}}>📻</div>
        <div className="floating-audio-profile" style={{left: '25%', top: '40%', animationDelay: '4.5s'}}>🎶</div>
      </div>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              👤
            </div>
            <h1 className="profile-name">{profile?.username}</h1>
            <p className="profile-email">{profile?.email}</p>
            {profile?.is_institution && (
              <div className="institution-badge">
                🎓 Educational Institution
              </div>
            )}
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <span className="stat-icon">🏆</span>
              <div className="stat-value">{profile?.completedLevels || 0}</div>
              <div className="stat-label">Levels Completed</div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🪙</span>
              <div className="stat-value">{profile?.totalCoins || 0}</div>
              <div className="stat-label">Total Coins</div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📊</span>
              <div className="stat-value">{Math.round((profile?.completedLevels / 10) * 100)}%</div>
              <div className="stat-label">Progress</div>
            </div>
          </div>

          <div className="progress-section">
            <h3>🎮 Level Progress</h3>
            <div className="level-progress">
              {Array.from({ length: 10 }, (_, i) => {
                const level = i + 1;
                const isCompleted = level < profile?.unlockedLevel;
                const isUnlocked = level <= profile?.unlockedLevel;
                
                return (
                  <div
                    key={level}
                    className={`level-badge ${
                      isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked'
                    }`}
                  >
                    {isCompleted ? '✓' : level}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="profile-actions">
            <a href="/game" className="action-btn">
              🎮 Continue Game
            </a>
            <a href="/upload" className="action-btn">
              🎧 Analyze Audio
            </a>
            <button onClick={() => {
              localStorage.removeItem('loggedInUser');
              setProfile(null);
              setError('User logged out.');
            }} className="action-btn logout">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
