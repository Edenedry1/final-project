import React, { useEffect, useState } from 'react';
import '../styles/Profile.css';
import audioDetectorLogo from '../images/audio-detector-logo.png';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalCoins, setTotalCoins] = useState(0);

  const fetchProfile = async () => {
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (storedUser && storedUser.id) {
      try {
        const response = await fetch(`http://localhost:5001/api/profile/${storedUser.id}`);
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setProfile(data);
          
          // Get coins from localStorage and use the higher value
          const localCoins = parseInt(localStorage.getItem('totalCoins') || '0');
          const serverCoins = data.total_coins || 0;
          const maxCoins = Math.max(localCoins, serverCoins);
          
          setTotalCoins(maxCoins);
          
          // If localStorage has more coins, sync with server
          if (localCoins > serverCoins) {
            console.log(`Local coins (${localCoins}) > server coins (${serverCoins}), syncing...`);
            // Optional: send update to server here
          }
        }
      } catch (err) {
        setError('Failed to fetch profile data.');
        // Fallback to localStorage if server fails
        const localCoins = parseInt(localStorage.getItem('totalCoins') || '0');
        setTotalCoins(localCoins);
      }
    } else {
      setError('User not logged in.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
    
    // Auto-refresh when user returns to the page
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchProfile();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Remove totalCoins dependency to prevent infinite loop
  
  // Initial coin loading
  useEffect(() => {
    const localCoins = parseInt(localStorage.getItem('totalCoins') || '0');
    setTotalCoins(localCoins);
  }, []);
  
  // Separate useEffect for localStorage monitoring
  useEffect(() => {
    // Listen for localStorage changes (when coins are updated in games)
    const handleStorageChange = () => {
      const localCoins = parseInt(localStorage.getItem('totalCoins') || '0');
      setTotalCoins(localCoins);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Check localStorage periodically but less frequently to avoid constant updates
    const interval = setInterval(() => {
      const localCoins = parseInt(localStorage.getItem('totalCoins') || '0');
      if (localCoins !== totalCoins) {
        setTotalCoins(localCoins);
      }
    }, 3000); // Changed from 1000ms to 3000ms to reduce frequency
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [totalCoins]);

  return (
    <>
      {/* Header */}
      <header data-bs-theme="dark">
        <nav className="navbar">
          <div className="container-fluid">
            <div className="navbar-brand">
              <img src={audioDetectorLogo} alt="Audio Detector Logo" className="logo" />
              DeepFakeAudio
            </div>
            <div className="toolbar-icons">
              <a href="/upload">🏠</a>
              <a href="/game">🎮</a>
            </div>
          </div>
        </nav>
      </header>

      <div className="profile-container">
        {loading ? (
          <div className="loading-container">
            <h2>Loading Profile...</h2>
            <div className="loading-spinner">⏳</div>
          </div>
        ) : error ? (
          <div className="error-container">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={fetchProfile} className="action-btn">
              🔄 Retry
            </button>
          </div>
        ) : (
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
                <div className="stat-value">{profile?.level_completed || 0}</div>
                <div className="stat-label">Levels Completed</div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🪙</span>
                <div className="stat-value">{totalCoins}</div>
                <div className="stat-label">Total Coins</div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📊</span>
                <div className="stat-value">
                  {Math.round(((profile?.level_completed || 0) / 10) * 100)}%
                </div>
                <div className="stat-label">Progress</div>
              </div>
            </div>

            <div className="progress-section">
              <h3>Level Progress</h3>
              <div className="level-progress">
                {Array.from({ length: 10 }, (_, i) => {
                  const level = i + 1;
                  const isCompleted = level <= (profile?.level_completed || 0);
                  const isUnlocked = level <= (profile?.level_completed || 0) + 1;
                  
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
                localStorage.removeItem('totalCoins');
                localStorage.removeItem('unlockedLevel');
                window.location.href = '/';
              }} className="action-btn logout">
                🚪 Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
