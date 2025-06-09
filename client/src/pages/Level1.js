import React, { useState } from 'react';
import '../styles/Level1.css';
import logo from '../images/logo.png';

const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));

const questions = [
    {
      id: 1,
      real: "/audio/SSB19560473.wav",
      fake: "/audio/F01_p225_007.wav"
    },
    {
      id: 2,
      real: "/audio/SSB19560474.wav",
      fake: "/audio/F01_SSB13850361.wav"
    },
    {
      id: 3,
      real: "/audio/SSB19560475.wav",
      fake: "/audio/F01_SSB11250419.wav"
    },
    {
      id: 4,
      real: "/audio/SSB19560476.wav",
      fake: "/audio/F02_SSB10240329.wav"
    }
];

const Level1 = () => {
  const [current, setCurrent] = useState(0);
  const [coins, setCoins] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const hints = [
    "💡 Hint: Listen for naturalness - fake audio often sounds metallic or robotic.",
    "💡 Hint: Pay attention to speech rhythm - is it consistent throughout the recording?",
    "💡 Hint: Check audio quality - fake files may be less sharp or have background noise.",
    "💡 Hint: Listen to voice tone - does it sound natural and human?"
  ];

  const handleChoice = async (choice, audioPath) => {
    setLoading(true);
    try {
      // Check both files
      const [realResponse, fakeResponse] = await Promise.all([
        fetch('http://localhost:5001/api/check_audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            file_path: question.real
          })
        }),
        fetch('http://localhost:5001/api/check_audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            file_path: question.fake
          })
        })
      ]);

      const [realData, fakeData] = await Promise.all([
        realResponse.json(),
        fakeResponse.json()
      ]);
      
      if (realData.error || fakeData.error) {
        setFeedback('❌ Error checking audio. Please try again.');
        return;
      }

      // Check if the chosen file is the fake one
      const chosenFile = choice === 'real' ? question.real : question.fake;
      const isCorrect = chosenFile === question.fake;

      if (isCorrect) {
        setCoins(coins + 10);
        setFeedback(`✔️ Correct! The model detected: Real (${realData.confidence.toFixed(1)}% confidence) vs Fake (${fakeData.confidence.toFixed(1)}% confidence)`);
      } else {
        setFeedback(`❌ Incorrect. The model detected: Real (${realData.confidence.toFixed(1)}% confidence) vs Fake (${fakeData.confidence.toFixed(1)}% confidence)`);
      }

      setTimeout(() => {
        setFeedback('');
        if (current + 1 < questions.length) {
          setCurrent(current + 1);
        } else {
          setCompleted(true);
          localStorage.setItem('unlockedLevel', '2');
        }
      }, 3000);

    } catch (error) {
      setFeedback('❌ Error checking audio. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
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
        <div className="floating-audio-level" style={{left: '5%', top: '15%', animationDelay: '0s'}}>🎧</div>
        <div className="floating-audio-level" style={{left: '90%', top: '25%', animationDelay: '2s'}}>🎵</div>
        <div className="floating-audio-level" style={{left: '10%', top: '60%', animationDelay: '4s'}}>🔊</div>
        <div className="floating-audio-level" style={{left: '85%', top: '70%', animationDelay: '1s'}}>🎤</div>
        <div className="floating-audio-level" style={{left: '50%', top: '10%', animationDelay: '3s'}}>📻</div>
      </div>

      <div className="level-container">
        <h2>Level 1 – Question {current + 1} of {questions.length} 🔊</h2>

        {!completed ? (
          <div className="question-block">
            <div className="audio-group">
              <div className="audio-box">
                <p>Audio File 1</p>
                <audio controls src={question.real} />
                <button 
                  onClick={() => handleChoice('real', question.real)} 
                  disabled={loading}
                >
                  {loading ? 'Checking...' : 'This one is fake'}
                </button>
              </div>
              <div className="audio-box">
                <p>Audio File 2</p>
                <audio controls src={question.fake} />
                <button 
                  onClick={() => handleChoice('fake', question.fake)}
                  disabled={loading}
                >
                  {loading ? 'Checking...' : 'This one is fake'}
                </button>
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

export default Level1;