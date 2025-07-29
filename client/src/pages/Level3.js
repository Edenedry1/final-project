import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Level1.css';
import logo from '../images/logo.png';

const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));

const Level3 = () => {
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
  const [questionChanging, setQuestionChanging] = useState(false);

  const hints = [
    "💡 Hint: Listen for micro-stutters or glitches that AI voices sometimes produce.",
    "💡 Hint: Pay attention to pronunciation - fake voices may mispronounce uncommon words.",
    "💡 Hint: Check for emotional consistency - does the emotion match throughout?",
    "💡 Hint: Listen for unnatural pauses between words or sentences.",
    "💡 Hint: Notice if the voice sounds too perfect or lacks human imperfections."
  ];

  // Load questions from server when component mounts
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setQuestionsLoading(true);
        const questionsList = [];
        
        // Load 5 questions for Level 3
        for (let i = 0; i < 5; i++) {
          const response = await fetch('http://localhost:5001/api/get_game_audio');
          if (response.ok) {
            const data = await response.json();
            
            // Force randomization with better approach
            const randomValue = Math.random();
            const fakeOnLeft = randomValue < 0.5;
            
            console.log(`Level 3 - Question ${i + 1}: Random value = ${randomValue}, Fake on left = ${fakeOnLeft}`);
            
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
        
        console.log('Level 3 - Final questions list:', questionsList);
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
      
      console.log(`Level 3 - User chose: ${side}, Fake is on: ${question.fakeOnLeft ? 'left' : 'right'}`);
      
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

      console.log(`Level 3 - Chosen fake: ${chosenFake}`);

      if (chosenFake) {
        const newCoins = coins + 20;
        setCoins(newCoins);
        localStorage.setItem('totalCoins', newCoins.toString());
        setFeedback(`✔️ Correct! You identified the fake audio! Model detected: Real (${realData.confidence.toFixed(1)}% confidence) vs Fake (${fakeData.confidence.toFixed(1)}% confidence)`);
      } else {
        setFeedback(`❌ Incorrect. You chose the real audio. Model detected: Real (${realData.confidence.toFixed(1)}% confidence) vs Fake (${fakeData.confidence.toFixed(1)}% confidence)`);
      }

      setTimeout(() => {
        setFeedback('');
        if (current + 1 < questions.length) {
          setQuestionChanging(true);
          setTimeout(() => {
            setCurrent(current + 1);
            setShowHint(false); // Reset hint for next question
            setQuestionChanging(false);
          }, 1000);
        } else {
          setCompleted(true);
          localStorage.setItem('unlockedLevel', '4');
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
        <div className="floating-audio-level" style={{left: '6%', top: '20%', animationDelay: '1s'}}>🎼</div>
        <div className="floating-audio-level" style={{left: '85%', top: '18%', animationDelay: '3s'}}>🎧</div>
        <div className="floating-audio-level" style={{left: '15%', top: '70%', animationDelay: '5s'}}>🔊</div>
        <div className="floating-audio-level" style={{left: '80%', top: '80%', animationDelay: '2s'}}>🎵</div>
        <div className="floating-audio-level" style={{left: '40%', top: '8%', animationDelay: '4s'}}>🎤</div>
      </div>

      <div className="level-container">
        {questionsLoading ? (
          <div className="loading-container">
            <h2>Loading Level 3...</h2>
            <p>🎼 Preparing advanced audio challenges from Codecfake dataset...</p>
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
            <h2>Level 3 – Question {current + 1} of {questions.length} 🔊</h2>
            <p style={{color: '#ff9800', fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 'bold'}}>
              🟠 Level 3: Advanced - Moderate fake audio requiring careful listening!
            </p>
            <p className="codecfake-info">
              🎯 Audio files randomly selected from Codecfake dataset
            </p>
            
            {questionChanging && (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                background: 'rgba(0, 240, 255, 0.1)',
                border: '2px solid rgba(0, 240, 255, 0.4)',
                borderRadius: '15px',
                margin: '2rem 0',
                animation: 'pulse 1s infinite'
              }}>
                <h3 style={{color: 'black', marginBottom: '1rem'}}>🔄 Loading Next Question...</h3>
                <p style={{color: 'black', fontSize: '1.1rem'}}>
                  🎵 Fetching new audio files from Codecfake dataset...
                </p>
                <div style={{fontSize: '2rem', animation: 'spin 1s linear infinite'}}>⏳</div>
              </div>
            )}

            {!completed ? (
              <div className="question-block">
                <div className="audio-group">
                  <div className="audio-box">
                    <p>Audio File 1</p>
                    <audio controls src={questions[current]?.leftFile} key={`left-${current}`} />
                    <button 
                      onClick={() => handleChoice('left')} 
                      disabled={loading || questionChanging}
                    >
                      {loading ? 'Checking...' : 'This one is fake'}
                    </button>
                  </div>
                  <div className="audio-box">
                    <p>Audio File 2</p>
                    <audio controls src={questions[current]?.rightFile} key={`right-${current}`} />
                    <button 
                      onClick={() => handleChoice('right')}
                      disabled={loading || questionChanging}
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
                <h3>You've completed Level 3! 🎉</h3>
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

export default Level3;
