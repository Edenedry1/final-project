import React, { useState, useEffect } from 'react';
import '../styles/Level1.css';
import logo from '../images/logo.png';

const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));

const Level6 = () => {
  const [current, setCurrent] = useState(0);
  const [coins, setCoins] = useState(() => {
    const savedCoins = localStorage.getItem('totalCoins');
    return savedCoins ? parseInt(savedCoins) : 0;
  });
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);

  const hints = [
    "💡 Hint: Analyze temporal envelope consistency across phonemes.",
    "💡 Hint: Check for unnatural prosodic stress patterns.",
    "💡 Hint: Listen for micro-timing variations in syllable boundaries.",
    "💡 Hint: Notice spectral energy distribution anomalies.",
    "💡 Hint: Pay attention to fundamental frequency tracking irregularities."
  ];

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setQuestionsLoading(true);
        const questionsList = [];
        
        for (let i = 0; i < 5; i++) {
          const response = await fetch('http://localhost:5001/api/get_game_audio');
          if (response.ok) {
            const data = await response.json();
            
            const randomValue = Math.random();
            const fakeOnLeft = randomValue < 0.5;
            
            console.log(`Level 6 - Question ${i + 1}: Random value = ${randomValue}, Fake on left = ${fakeOnLeft}`);
            
            questionsList.push({
              id: i + 1,
              leftFile: fakeOnLeft ? `http://localhost:5001${data.fake_path}` : `http://localhost:5001${data.real_path}`,
              rightFile: fakeOnLeft ? `http://localhost:5001${data.real_path}` : `http://localhost:5001${data.fake_path}`,
              leftFileName: fakeOnLeft ? data.fake_file : data.real_file,
              rightFileName: fakeOnLeft ? data.real_file : data.fake_file,
              fakeOnLeft: fakeOnLeft,
              leftIsReal: !fakeOnLeft,
              rightIsReal: fakeOnLeft
            });
          } else {
            console.error('Failed to load audio for question', i + 1);
          }
        }
        
        console.log('Level 6 - Final questions list:', questionsList);
        setQuestions(questionsList);
        setQuestionsLoading(false);
      } catch (error) {
        console.error('Error loading questions:', error);
        setQuestionsLoading(false);
        setFeedback('❌ Error loading game questions. Please refresh the page.');
      }
    };
    
    loadQuestions();
  }, []);

  const handleChoice = async (side) => {
    setLoading(true);
    setShowHint(false);
    try {
      const question = questions[current];
      
      console.log(`Level 6 - User chose: ${side}, Fake is on: ${question.fakeOnLeft ? 'left' : 'right'}`);
      
      const checkFile = async (filePath, fileName) => {
        try {
          const fileResponse = await fetch(filePath);
          const blob = await fileResponse.blob();
          const formData = new FormData();
          formData.append('audio', blob, fileName);
          
          const response = await fetch('http://localhost:5001/api/upload', {
            method: 'POST',
            body: formData
          });
          
          return await response.json();
        } catch (error) {
          console.error(`Error checking ${fileName}:`, error);
          return { error: error.message };
        }
      };

      const [leftData, rightData] = await Promise.all([
        checkFile(question.leftFile, question.leftFileName),
        checkFile(question.rightFile, question.rightFileName)
      ]);
      
      if (leftData.error || rightData.error) {
        setFeedback('❌ Error checking audio. Please try again.');
        return;
      }

      const realData = question.fakeOnLeft ? rightData : leftData;
      const fakeData = question.fakeOnLeft ? leftData : rightData;
      const chosenFake = (side === 'left' && question.fakeOnLeft) || (side === 'right' && !question.fakeOnLeft);

      console.log(`Level 6 - Chosen fake: ${chosenFake}`);

      if (chosenFake) {
        const newCoins = coins + 35;
        setCoins(newCoins);
        localStorage.setItem('totalCoins', newCoins.toString());
        setFeedback(`✔️ Correct! You identified the fake audio! Model detected: Real (${realData.confidence.toFixed(1)}% confidence) vs Fake (${fakeData.confidence.toFixed(1)}% confidence)`);
      } else {
        setFeedback(`❌ Incorrect. You chose the real audio. Model detected: Real (${realData.confidence.toFixed(1)}% confidence) vs Fake (${fakeData.confidence.toFixed(1)}% confidence)`);
      }

      setTimeout(() => {
        setFeedback('');
        if (current + 1 < questions.length) {
          setCurrent(current + 1);
          setShowHint(false);
        } else {
          setCompleted(true);
          localStorage.setItem('unlockedLevel', '7');
        }
      }, 3000);

    } catch (error) {
      setFeedback('❌ Error checking audio. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
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
              <a href="/profile" title="Profile">👤</a>
            </div>
          </div>
        </nav>
      </header>

      <div className="level-decorations">
        <div className="floating-audio-level" style={{left: '11%', top: '26%', animationDelay: '2.5s'}}>🎛️</div>
        <div className="floating-audio-level" style={{left: '83%', top: '10%', animationDelay: '4.5s'}}>🎧</div>
        <div className="floating-audio-level" style={{left: '22%', top: '85%', animationDelay: '6.5s'}}>🔊</div>
        <div className="floating-audio-level" style={{left: '74%', top: '95%', animationDelay: '3.5s'}}>🎵</div>
        <div className="floating-audio-level" style={{left: '25%', top: '0%', animationDelay: '5.5s'}}>🎤</div>
      </div>

      <div className="level-container">
        {questionsLoading ? (
          <div className="loading-container">
            <h2>Loading Level 6...</h2>
            <p>🎛️ Preparing specialist audio challenges from Codecfake dataset...</p>
            <div className="loading-spinner">⏳</div>
          </div>
        ) : questions.length === 0 ? (
          <div className="error-container">
            <h2>Error Loading Level</h2>
            <p>❌ Could not load audio files from Codecfake dataset.</p>
            <button onClick={() => window.location.reload()}>🔄 Retry</button>
          </div>
        ) : (
          <>
            <h2>Level 6 – Question {current + 1} of {questions.length} 🔊</h2>
            <p style={{color: '#3f51b5', fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 'bold'}}>
              🔵 Level 6: Specialist - Near-perfect fake audio, specialist knowledge required!
            </p>
            <p className="codecfake-info">
              🎯 Audio files randomly selected from Codecfake dataset
            </p>

            {!completed ? (
              <div className="question-block">
                <div className="audio-group">
                  <div className="audio-box">
                    <p>Audio File 1</p>
                    <audio controls src={questions[current]?.leftFile} />
                    <button 
                      onClick={() => handleChoice('left')} 
                      disabled={loading}
                    >
                      {loading ? 'Checking...' : 'This one is fake'}
                    </button>
                  </div>
                  <div className="audio-box">
                    <p>Audio File 2</p>
                    <audio controls src={questions[current]?.rightFile} />
                    <button 
                      onClick={() => handleChoice('right')}
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
                
                {storedUser?.is_institution && (
                  <div style={{marginTop: '1.5rem'}}>
                    {!showHint ? (
                      <button 
                        className="hint-button"
                        onClick={() => setShowHint(true)}
                      >
                        💡 Get Hint
                      </button>
                    ) : (
                      <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        border: '2px solid rgba(255, 152, 0, 0.3)',
                        borderRadius: '10px',
                        color: '#ff9800',
                        fontSize: '1.1rem'
                      }}>
                        {hints[current]}
                        <button 
                          style={{
                            marginLeft: '1rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(255, 152, 0, 0.2)',
                            border: '1px solid #ff9800',
                            borderRadius: '5px',
                            color: '#ff9800',
                            cursor: 'pointer'
                          }}
                          onClick={() => setShowHint(false)}
                        >
                          Hide Hint
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {!storedUser?.is_institution && (
                  <p style={{color: '#90caf9', fontSize: '0.9rem', marginTop: '1rem', fontStyle: 'italic'}}>
                    💡 Hint feature is available for educational institutions only
                  </p>
                )}
              </div>
            ) : (
              <div className="completion-block">
                <h3>You've completed Level 6! 🎉</h3>
                <p>Total coins earned: {coins} 💰</p>
                <a href="/game" className="btn btn-success">Back to level map</a>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Level6; 