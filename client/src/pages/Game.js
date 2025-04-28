import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Game.css';
import logo from '../images/logo.png';
import soundwave from '../images/sound-waves.png';
import padlock from '../images/padlock.png';

const Game = () => {
  const navigate = useNavigate();
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);
  const unlockedLevel = parseInt(localStorage.getItem('unlockedLevel') || '1');

  const handleLevelClick = (level) => {
    if (level <= unlockedLevel) {
      navigate(`/level/${level}`);
    }
  };

  return (
    <div className="neon-map-container">
      <header className="neon-navbar">
        <img src={logo} alt="Logo" className="neon-logo enlarged-logo" />
        <div className="toolbar-icons">
          <a href="/upload" title="Upload">🏠</a>
          <a href="/profile" title="Profile">👤</a>
        </div>
      </header>

      <h1 className="neon-title">🎧 Audio Deepfake Quest</h1>
      <p className="neon-sub">Tap a glowing node to begin your journey!</p>

      <div className="level-path">
        {levels.map((level, index) => (
          <div
            key={level}
            className={`level-circle ${level <= unlockedLevel ? 'unlocked' : 'locked'}`}
            style={{
              left: `${10 + index * 8}%`,
              top: `${40 + Math.sin(index) * 20}%`,
              backgroundImage: `url(${level <= unlockedLevel ? soundwave : padlock})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: '55px 55px',
              filter: 'drop-shadow(0 0 10px #00f0ff)',
            }}
            onClick={() => handleLevelClick(level)}
          >
            <span className="level-number">{level}</span>
          </div>
        ))}
      </div>

      <div className="neon-wave"></div>
    </div>
  );
};

export default Game;
