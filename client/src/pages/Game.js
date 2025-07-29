import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Game.css';
import padlock from '../images/padlock.png';

const Game = () => {
  const navigate = useNavigate();
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);
  const unlockedLevel = parseInt(localStorage.getItem('unlockedLevel') || '1');
  const completedLevels = unlockedLevel - 1;
  const [totalCoins, setTotalCoins] = useState(() => {
    const savedCoins = localStorage.getItem('totalCoins');
    return savedCoins ? parseInt(savedCoins) : 0;
  });

  const resetGame = () => {
    if (window.confirm('Are you sure you want to reset all progress? This will delete all coins and unlock status.')) {
      localStorage.removeItem('totalCoins');
      localStorage.removeItem('unlockedLevel');
      setTotalCoins(0);
      window.location.reload(); // Refresh to show updated state
    }
  };

  const handleLevelClick = (level) => {
    if (level <= unlockedLevel) {
      navigate(`/level/${level}`);
    }
  };

  const positions = [
    { left: 10, top: 70 },   // Level 1 - Start bottom left
    { left: 20, top: 55 },   // Level 2 - Diagonal up-right
    { left: 25, top: 40 },   // Level 3 - Steep ascent
    { left: 35, top: 45 },   // Level 4 - Small curve down
    { left: 45, top: 25 },   // Level 5 - Steep rise again
    { left: 55, top: 35 },   // Level 6 - Small dip
    { left: 65, top: 20 },   // Level 7 - Continue ascending
    { left: 75, top: 15 },   // Level 8 - Near peak
    { left: 85, top: 25 },   // Level 9 - Final curve
    { left: 90, top: 10 }    // Level 10 - Epic finale at peak
  ];

  return (
    <div className="neon-map-container">
      {/* Background video */}
      <video autoPlay muted loop className="background-video">
        <source src="/sound-waves-bg.mp4" type="video/mp4" />
      </video>
      
      <header className="candy-navbar">
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <div className="container-fluid">
            <div className="navbar-brand">
              <img src={require('../images/audio-detector-logo.png')} alt="DeepFakeAudio Logo" className="logo" />
              DeepFakeAudio
            </div>
            <div className="toolbar-icons">
              <a href="/upload" title="Upload">🏠</a>
              <a href="/profile" title="Profile">👤</a>
            </div>
          </div>
        </nav>
      </header>

      <h1 className="deepfake-quest-title">
        <span className="main-word">DEEPFAKE</span>
        <span className="hunter-word">QUEST</span>
        <span className="audio-subtitle">AUDIO</span>
      </h1>
      
      <p className="neon-sub">Begin your adventure to spot voices created by artificial intelligence</p>

      {/* Progress indicator */}
      <div className="progress-indicator">
        <div className="progress-text">
          Progress: {completedLevels}/{levels.length} Levels Completed
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{width: `${(completedLevels / levels.length) * 100}%`}}
          ></div>
        </div>
        
        {/* Coins display */}
        <div className="coins-display">
          <span className="coins-text">💰 Total Coins: {totalCoins}</span>
          <button 
            className="reset-game-btn" 
            onClick={resetGame}
            title="Reset all progress and coins"
          >
            🔄 Reset Game
          </button>
        </div>
        
        {completedLevels === levels.length && (
          <div className="completion-message">
            🎉 All levels completed! Total Coins Earned: {totalCoins} 🎉
          </div>
        )}
      </div>

      {/* Twinkling Stars */}
      <div className="twinkling-stars">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="twinkling-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="level-path styled-path">
        {/* SVG for connecting lines */}
        <svg className="path-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
          {levels.slice(1).map((level, index) => {
            const from = positions[index];
            const to = positions[index + 1];
            const isPathUnlocked = level <= unlockedLevel;
            
            // Create smooth curved path using quadratic bezier
            const midX = (from.left + to.left) / 2;
            const midY = (from.top + to.top) / 2;
            // Consistent curve offset for smooth path
            const controlX = midX;
            const controlY = midY - 4; // Consistent upward curve
            
            return (
              <path
                key={`path-${level}`}
                d={`M ${from.left} ${from.top} Q ${controlX} ${controlY} ${to.left} ${to.top}`}
                className={`svg-connector ${isPathUnlocked ? 'unlocked-path' : 'locked-path'}`}
                fill="none"
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {/* Level circles */}
        {levels.map((level, index) => {
          const pos = positions[index];
          const isUnlocked = level <= unlockedLevel;
          const isCompleted = level < unlockedLevel;

          return (
            <div
              key={level}
              className={`level-circle ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''}`}
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
              onClick={() => handleLevelClick(level)}
              title={isUnlocked ? `Level ${level} - Click to start` : `Level ${level} - Locked`}
            >
              <span className="level-number">
                {isCompleted ? '✓' : level}
              </span>
              <div className="level-icon">
                {isCompleted ? '🏆' : isUnlocked ? '🎵' : '🔒'}
              </div>
              {isUnlocked && !isCompleted && (
                <div className="level-glow"></div>
              )}
            </div>
          );
        })}
      </div>

      <div className="neon-wave"></div>
    </div>
  );
};

export default Game;