import React, { useState, useEffect } from 'react';
import '../styles/Level1.css';
import logo from '../images/logo.png';

const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));

const Level10 = () => {
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
    "💡 Hint: Trust your deepest intuition combined with analytical precision.",
    "💡 Hint: Channel all your accumulated knowledge and detection expertise.",
    "💡 Hint: Listen beyond the physical realm to detect the subtlest AI signatures.",
    "💡 Hint: Use every technique you've learned - this is the ultimate challenge.",
    "💡 Hint: Remember: even the most perfect fakes have microscopic tells."
  ];

  // Load questions from server when component mounts
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setQuestionsLoading(true);
        const questionsList = [];
        
        // Load 5 questions for Level 10
        for (let i = 0; i < 5; i++) {
          const response = await fetch('http://localhost:5001/api/get_game_audio');
          if (response.ok) {
            const data = await response.json();
            
            // Force randomization with better approach
            const randomValue = Math.random();
            const fakeOnLeft = randomValue < 0.5;
            
            console.log(`Level 10 - Question ${i + 1}: Random value = ${randomValue}, Fake on left = ${fakeOnLeft}`);
            
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
        
        console.log('Level 10 - Final questions list:', questionsList);
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
    setShowHint(false); // Hide hint when making choice
    try {
      const question = questions[current];
      
      console.log(`Level 10 - User chose: ${side}, Fake is on: ${question.fakeOnLeft ? 'left' : 'right'}`);
      
      // Upload and check both files using the upload endpoint
      const checkFile = async (filePath, fileName) => {
        try {
          // Fetch the file as blob
          const fileResponse = await fetch(filePath);
          const blob = await fileResponse.blob();
          
          // Create form data
          const formData = new FormData();
          formData.append('audio', blob, fileName);
          
          // Upload and analyze
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

      // Check both files
      const [leftData, rightData] = await Promise.all([
        checkFile(question.leftFile, question.leftFileName),
        checkFile(question.rightFile, question.rightFileName)
      ]);
      
      if (leftData.error || rightData.error) {
        setFeedback('❌ Error checking audio. Please try again.');
        return;
      }

      // Determine which file is fake based on the question setup
      const realData = question.fakeOnLeft ? rightData : leftData;
      const fakeData = question.fakeOnLeft ? leftData : rightData;

      // Check if the chosen side has the fake file
      const chosenFake = (side === 'left' && question.fakeOnLeft) || (side === 'right' && !question.fakeOnLeft);

      console.log(`Level 10 - Chosen fake: ${chosenFake}`);

      if (chosenFake) {
        const newCoins = coins + 100;
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
          setShowHint(false); // Reset hint for next question
        } else {
          setCompleted(true);
          localStorage.setItem('gameCompleted', 'true');
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

      {/* Floating decorations */}
      <div className="level-decorations">
        <div className="floating-audio-level" style={{left: '17%', top: '32%', animationDelay: '4s'}}>👑</div>
        <div className="floating-audio-level" style={{left: '77%', top: '4%', animationDelay: '6s'}}>🎧</div>
        <div className="floating-audio-level" style={{left: '28%', top: '100%', animationDelay: '8s'}}>🔊</div>
        <div className="floating-audio-level" style={{left: '68%', top: '110%', animationDelay: '5s'}}>🎵</div>
        <div className="floating-audio-level" style={{left: '10%', top: '-6%', animationDelay: '7s'}}>🎤</div>
      </div>

      <div className="level-container">
        {questionsLoading ? (
          <div className="loading-container">
            <h2>Loading Level 10...</h2>
            <p>👑 Preparing omniscient audio challenges from Codecfake dataset...</p>
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
            <h2>Level 10 – Question {current + 1} of {questions.length} 🔊</h2>
            <p style={{color: '#ffd700', fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 'bold'}}>
              👑 Level 10: Omniscient - Absolutely perfect synthetic audio, requires divine intuition!
            </p>
            <p style={{color: '#90caf9', fontSize: '0.9rem', marginBottom: '1rem', fontStyle: 'italic'}}>
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
                
                {/* Hint section for educational institutions */}
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
                
                {/* Message for regular users */}
                {!storedUser?.is_institution && (
                  <p style={{color: '#90caf9', fontSize: '0.9rem', marginTop: '1rem', fontStyle: 'italic'}}>
                    💡 Hint feature is available for educational institutions only
                  </p>
                )}
              </div>
            ) : (
              <div className="completion-block">
                <h3>🎉 CONGRATULATIONS! You've completed ALL LEVELS! 🎉</h3>
                <p>🏆 Total coins earned: {coins} 💰</p>
                <p style={{color: '#ffd700', fontSize: '1.2rem', marginTop: '1rem', fontWeight: 'bold'}}>
                  👑 You are now a DEEPFAKE DETECTION MASTER! 👑
                </p>
                <a href="/game" className="btn btn-success">Back to level map</a>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Level10; 