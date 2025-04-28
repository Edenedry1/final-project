import React, { useState } from 'react';
import '../styles/Level1.css';
import logo from '../images/logo.png';

const questions = [
  {
    id: 1,
    real: '/audio/level1/q1_real.mp3',
    fake: '/audio/level1/q1_fake.mp3',
  },
  {
    id: 2,
    real: '/audio/level1/q2_real.mp3',
    fake: '/audio/level1/q2_fake.mp3',
  },
  {
    id: 3,
    real: '/audio/level1/q3_real.mp3',
    fake: '/audio/level1/q3_fake.mp3',
  },
  {
    id: 4,
    real: '/audio/level1/q4_real.mp3',
    fake: '/audio/level1/q4_fake.mp3',
  },
  {
    id: 5,
    real: '/audio/level1/q5_real.mp3',
    fake: '/audio/level1/q5_fake.mp3',
  },
];

const Level1 = () => {
  const [current, setCurrent] = useState(0);
  const [coins, setCoins] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(false);

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
        localStorage.setItem('unlockedLevel', '2');
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

      <div className="level-container">
        <h2>Level 1 – Question {current + 1} of {questions.length} 🔊</h2>

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

export default Level1;
