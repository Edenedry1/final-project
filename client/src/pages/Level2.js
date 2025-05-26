import React, { useState } from 'react';
import '../styles/Level1.css';
import logo from '../images/logo.png';

const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));

const questions = [
    {
      id: 1,
      real: "/audio/SSB19560475 (1).wav",
      fake: "/audio/F01_p225_002 (2).wav"
    },
    {
      id: 2,
      real: "/audio/SSB19560476 (1).wav",
      fake: "/audio/F01_p225_003.wav"
    },
    {
      id: 3,
      real: "/audio/SSB19560477 (1).wav",
      fake: "/audio/F01_p225_005.wav"
    },
    {
      id: 4,
      real: "/audio/SSB19560479.wav",
      fake: "/audio/F01_p225_006.wav"
    },
    {
      id: 5,
      real: "/audio/SSB19560480.wav",
      fake: "/audio/F01_p225_007 (1).wav"
    }
  ];

const Level2 = () => {
  const [current, setCurrent] = useState(0);
  const [coins, setCoins] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(false);

  const hints = [
    "💡 Hint: Listen for breathing - fake audio often lacks natural breathing patterns.",
    "💡 Hint: Pay attention to word connections - do they sound smooth and natural?",
    "💡 Hint: Check emphasis patterns - fake files may lack emotion or have unnatural stress.",
    "💡 Hint: Listen to background noise - is it consistent throughout the recording?",
    "💡 Hint: Pay attention to voice tone at sentence endings - does it sound natural?"
  ];

  const handleChoice = (choice) => {
    const correct = 'fake';
    if (choice === correct) {
      setCoins(coins + 10);
      setFeedback('✔️ Correct! You earned 10 coins');
    } else {
      setFeedback('❌ Incorrect. The fake file was the second one.');
    }

    setTimeout(() => {
      setFeedback('');
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
      } else {
        setCompleted(true);
        localStorage.setItem('unlockedLevel', '3');
      }
    }, 2000);
  };

  const question = questions[current];

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
              <a href="/profile" title="Profile">👤</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Floating decorations */}
      <div className="level-decorations">
        <div className="floating-audio-level" style={{left: '8%', top: '18%', animationDelay: '0.5s'}}>🎶</div>
        <div className="floating-audio-level" style={{left: '88%', top: '22%', animationDelay: '2.5s'}}>🎧</div>
        <div className="floating-audio-level" style={{left: '12%', top: '65%', animationDelay: '4.5s'}}>🔊</div>
        <div className="floating-audio-level" style={{left: '82%', top: '75%', animationDelay: '1.5s'}}>🎵</div>
        <div className="floating-audio-level" style={{left: '45%', top: '12%', animationDelay: '3.5s'}}>🎤</div>
      </div>

      <div className="level-container">
        <h2>Level 2 – Question {current + 1} of {questions.length} 🔊</h2>

        {!completed ? (
          <div className="question-block">
            <div className="audio-group">
              <div className="audio-box">
                <p>Audio File 1</p>
                <audio controls src={question.real} />
                <button onClick={() => handleChoice('real')}>This one is fake</button>
              </div>
              <div className="audio-box">
                <p>Audio File 2</p>
                <audio controls src={question.fake} />
                <button onClick={() => handleChoice('fake')}>This one is fake</button>
              </div>
            </div>
            {feedback && (
              <div className={`feedback-message ${feedback.includes('✔️') ? 'success' : 'error'}`}>
                {feedback}
              </div>
            )}
            {storedUser?.is_institution ? (
              <button 
                className="hint-button"
                onClick={() => alert(hints[current])}
              >
                💡 Get Hint
              </button>
            ) : (
              <p style={{color: '#90caf9', fontSize: '0.9rem', marginTop: '1rem', fontStyle: 'italic'}}>
                💡 Hint feature is available for educational institutions only
              </p>
            )}
          </div>
        ) : (
          <div className="completion-block">
            <h3>You've completed the level! 🎉</h3>
            <p>Total coins earned: {coins} 💰</p>
            <a href="/game" className="btn btn-success">Back to level map</a>
          </div>
        )}
      </div>
    </>
  );
};

export default Level2;
