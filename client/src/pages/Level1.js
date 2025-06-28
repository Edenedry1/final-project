import React, { useState, useEffect } from 'react';
import '../styles/Level1.css';
import logo from '../images/logo.png';

const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));

const Level1 = () => {
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
    "💡 Hint: Listen for naturalness - fake audio often sounds metallic or robotic.",
    "💡 Hint: Pay attention to speech rhythm - is it consistent throughout the recording?",
    "💡 Hint: Check audio quality - fake files may be less sharp or have background noise.",
    "💡 Hint: Listen to voice tone - does it sound natural and human?",
    "💡 Hint: Notice any sudden changes in voice quality or unnatural pauses."
  ];

  // Load questions from server when component mounts
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setQuestionsLoading(true);
        const questionsList = [];
        
        // Load 5 questions
        for (let i = 0; i < 5; i++) {
          const response = await fetch('http://localhost:5001/api/get_game_audio');
          if (response.ok) {
            const data = await response.json();
            
            // Force randomization with better approach
            const randomValue = Math.random();
            const fakeOnLeft = randomValue < 0.5;
            
            console.log(`Question ${i + 1}: Random value = ${randomValue}, Fake on left = ${fakeOnLeft}`);
            
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
        
        console.log('Final questions list:', questionsList);
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
      
      console.log(`User chose: ${side}, Fake is on: ${question.fakeOnLeft ? 'left' : 'right'}`);
      
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

      console.log(`Chosen fake: ${chosenFake}`);

      if (chosenFake) {
        const newCoins = coins + 10;
        setCoins(newCoins);
        localStorage.setItem('totalCoins', newCoins.toString());
        setFeedback(`✔️ Correct! You identified the fake audio! Model detected: Real (${realData.confidence.toFixed(1)}% confidence) vs Fake (${fakeData.confidence.toFixed(1)}% confidence)`);
      } else {
        setFeedback(`❌ Incorrect. You chose the real audio. Model detected: Real (${realData.confidence.toFixed(1)}% confidence) vs Fake (${fakeData.confidence.toFixed(1)}% confidence)`);
      }

      // Update progress in server
      if (chosenFake && storedUser?.id) {
        try {
          await fetch('http://localhost:5001/api/update_progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: storedUser.id,
              level_completed: current + 1 >= questions.length ? 1 : null, // Complete level only if all questions done
              coins_earned: 10,
              correct_answer: true
            })
          });
        } catch (error) {
          console.error('Error updating progress:', error);
        }
      } else if (!chosenFake && storedUser?.id) {
        // Update for incorrect answer (no coins, but still track the attempt)
        try {
          await fetch('http://localhost:5001/api/update_progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: storedUser.id,
              level_completed: null,
              coins_earned: 0,
              correct_answer: false
            })
          });
        } catch (error) {
          console.error('Error updating progress:', error);
        }
      }

      setTimeout(() => {
        setFeedback('');
        if (current + 1 < questions.length) {
          setCurrent(current + 1);
          setShowHint(false); // Reset hint for next question
        } else {
          setCompleted(true);
          localStorage.setItem('unlockedLevel', '2');
          
          // Update level completion in server
          if (storedUser?.id) {
            fetch('http://localhost:5001/api/update_progress', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: storedUser.id,
                level_completed: 1,
                coins_earned: 0,
                correct_answer: false // Just marking level complete
              })
            }).catch(error => console.error('Error updating level completion:', error));
          }
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
        <div className="floating-audio-level" style={{left: '5%', top: '15%', animationDelay: '0s'}}>🎧</div>
        <div className="floating-audio-level" style={{left: '90%', top: '25%', animationDelay: '2s'}}>🎵</div>
        <div className="floating-audio-level" style={{left: '10%', top: '60%', animationDelay: '4s'}}>🔊</div>
        <div className="floating-audio-level" style={{left: '85%', top: '70%', animationDelay: '1s'}}>🎤</div>
        <div className="floating-audio-level" style={{left: '50%', top: '10%', animationDelay: '3s'}}>📻</div>
      </div>

      <div className="level-container">
        {questionsLoading ? (
          <div className="loading-container">
            <h2>Loading Level 1...</h2>
            <p>🎵 Preparing audio challenges from Codecfake dataset...</p>
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
            <h2>Level 1 – Question {current + 1} of {questions.length} 🔊</h2>
            <p style={{color: '#4caf50', fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 'bold'}}>
              🟢 Level 1: Beginner - Easy fake audio with obvious AI artifacts!
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
                <h3>You've completed the level! 🎉</h3>
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

export default Level1;