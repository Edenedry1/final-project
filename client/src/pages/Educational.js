import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Educational.css';
import audioDetectorLogo from '../images/audio-detector-logo.png';

const Educational = () => {
  const navigate = useNavigate();
  const [demoResult, setDemoResult] = useState(null);

  const handleSignUpAsInstitution = () => {
    // Navigate to signup with institution flag
    navigate('/signup?institution=true');
  };

  return (
    <>
      {/* Header */}
      <header data-bs-theme="dark">
        <nav className="navbar">
          <div className="container-fluid">
            <div className="navbar-brand">
              <img src={audioDetectorLogo} alt="Audio Detector Logo" className="logo" />
              DeepFakeAudio - Educational
            </div>
            <div className="toolbar-icons">
              <a href="/">🏠</a>
              <a href="/login">🚪</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Video Background */}
      <div className="video-background">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="bg-video"
        >
          <source src="/sound-waves-bg.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="educational-container">
        <div className="educational-header">
          <h1 className="educational-title">🎓 Educational Mode</h1>
          <p className="educational-subtitle">
            Advanced learning tools for schools, universities, and educational institutions
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Interactive Hints System</h3>
            <p>
              Each game level includes helpful hints that teach students how to identify 
              deepfake audio patterns, breathing irregularities, and AI-generated artifacts.
            </p>
            <ul>
              <li>Context-aware hints for each level</li>
              <li>Progressive difficulty explanations</li>
              <li>Technical insights into AI detection</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Detailed Analytics</h3>
            <p>
              Track student progress with comprehensive reports showing detection accuracy, 
              learning curves, and areas for improvement.
            </p>
            <ul>
              <li>Individual student progress tracking</li>
              <li>Class-wide performance analytics</li>
              <li>Detailed accuracy reports</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Curriculum Integration</h3>
            <p>
              Perfect for cybersecurity courses, digital literacy programs, and AI education. 
              Includes educational content about deepfake technology.
            </p>
            <ul>
              <li>Cybersecurity curriculum alignment</li>
              <li>Digital media literacy</li>
              <li>AI ethics and awareness</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Multi-User Management</h3>
            <p>
              Manage multiple student accounts, create classes, and monitor collective 
              learning progress with institutional admin tools.
            </p>
            <ul>
              <li>Bulk student account creation</li>
              <li>Class organization tools</li>
              <li>Teacher dashboard access</li>
            </ul>
          </div>
        </div>

        <div className="learning-module">
          <h2>🎓 Interactive Learning Module: Audio Deepfake Detection</h2>
          <p className="module-intro">Learn how to detect audio deepfakes in five structured steps</p>

          <div className="learning-steps">
            
            {/* Step 1 */}
            <div className="learning-step">
              <div className="step-header">
                <div className="step-number"></div>
                <div className="step-title">
                  <span className="step-label">Step 1</span>
                  <h3>What is Audio Deepfake?</h3>
                </div>
              </div>
              
              <div className="step-content">
                <div className="video-container">
                  <iframe 
                    width="100%" 
                    height="315" 
                    src="https://www.youtube.com/embed/gLoI9hAX9dw"
                    title="What is Audio Deepfake?"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                  </iframe>
                </div>
                
                <div className="step-info">
                  <h4>What We Learned:</h4>
                  <ul>
                    <li><strong>Definition:</strong> Audio deepfake is artificial voice created by artificial intelligence</li>
                    <li><strong>Applications:</strong> Can be used to mimic celebrities or private individuals</li>
                    <li><strong>Dangers:</strong> Deception, fraud, manipulation, and fake news</li>
                    <li><strong>Technology:</strong> Uses Deep Neural Networks</li>
                  </ul>
                  
                  <div className="quiz-section">
                    <h4>❓ Question for Thought:</h4>
                    <p><strong>How can audio deepfakes impact our society?</strong></p>
                    <details>
                      <summary>Click for answer</summary>
                      <p>Deepfakes can create distrust in media, be used for financial fraud, 
                      damage the reputation of innocent people, and make it difficult to identify reliable information.</p>
                    </details>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="learning-step">
              <div className="step-header">
                <div className="step-number"></div>
                <div className="step-title">
                  <span className="step-label">Step 2</span>
                  <h3>How to Detect Audio Deepfakes?</h3>
                </div>
              </div>
              
              <div className="step-content">
                <div className="info-bubbles">
                  <div className="info-bubble">
                    <div className="bubble-icon">🔬</div>
                    <h4>Scientific Research Shows</h4>
                    <p>Studies indicate that human listeners can detect deepfake audio with only 73% accuracy, while AI systems achieve over 95% detection rates.</p>
                    <span className="source">Source: IEEE Research 2023</span>
                  </div>
                  
                  <div className="info-bubble">
                    <div className="bubble-icon">👂</div>
                    <h4>Human Ear Limitations</h4>
                    <p>The human auditory system can miss subtle artifacts like micro-glitches, unnatural pauses, and frequency inconsistencies that AI detectors easily identify.</p>
                    <span className="source">Source: Nature Communications</span>
                  </div>
                  
                  <div className="info-bubble">
                    <div className="bubble-icon">⚡</div>
                    <h4>Real-time Detection</h4>
                    <p>Modern deepfake detection systems can analyze audio streams in real-time, processing up to 16kHz audio with less than 100ms latency.</p>
                    <span className="source">Source: ACM Computing Surveys</span>
                  </div>
                  
                  <div className="info-bubble">
                    <div className="bubble-icon">🎯</div>
                    <h4>Key Detection Features</h4>
                    <p>Most effective detection focuses on: spectral inconsistencies, temporal artifacts, prosodic anomalies, and breathing pattern irregularities.</p>
                    <span className="source">Source: Journal of AI Security</span>
                  </div>
                </div>
                
                <div className="step-info">
                  <h4>Signs for Deepfake Detection:</h4>
                  <ul>
                    <li><strong>Unnatural Breathing:</strong> Lack of breathing sounds or breathing in strange places</li>
                    <li><strong>Voice Tone:</strong> Sudden changes in tone or pitch</li>
                    <li><strong>Inconsistent Accent:</strong> Changes in accent or pronunciation</li>
                    <li><strong>Background Noise:</strong> Strange or inconsistent background noise</li>
                    <li><strong>Speech Rate:</strong> Mechanical or unnatural speech pace</li>
                    <li><strong>Audio Quality:</strong> Inconsistent audio quality</li>
                  </ul>
                  
                  <div className="quiz-section">
                    <h4>🎯 Practical Exercise:</h4>
                    <p><strong>Listen to the following clip and look for the signs you've learned:</strong></p>
                    <audio controls style={{width: '100%', margin: '10px 0'}}>
                      <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" type="audio/wav"/>
                      Your browser does not support the audio tag.
                    </audio>
                    <details>
                      <summary>Detection Hints</summary>
                      <p>Pay attention to breathing patterns, tone consistency, and overall audio quality.</p>
                    </details>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="learning-step">
              <div className="step-header">
                <div className="step-number"></div>
                <div className="step-title">
                  <span className="step-label">Step 3</span>
                  <h3>Detection Tools & Technologies</h3>
                </div>
              </div>
              
              <div className="step-content">
                <div className="video-container">
                  <iframe 
                    width="100%" 
                    height="315" 
                    src="https://www.youtube.com/embed/AmUC4m6w1wo"
                    title="AI Detection Tools"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                  </iframe>
                </div>
                
                <div className="step-info">
                  <h4>Advanced Detection Tools:</h4>
                  <ul>
                    <li><strong>Spectral Analysis:</strong> Examining audio frequencies and detecting anomalies</li>
                    <li><strong>Machine Learning:</strong> Algorithms that learn to identify deepfake patterns</li>
                    <li><strong>Prosody Analysis:</strong> Examining unique speech characteristics of individuals</li>
                    <li><strong>Neural Networks:</strong> Advanced technology for automatic detection</li>
                  </ul>
                  
                  <div className="tech-showcase">
                    <h4>🔬 Our Technology:</h4>
                    <p>Our system uses:</p>
                    <ul>
                      <li>Neural network based on MFCC (Mel-Frequency Cepstral Coefficients)</li>
                      <li>Random Forest algorithm for classification</li>
                      <li>Codecfake dataset with over 700,000 audio files</li>
                      <li>97.31% accuracy in deepfake detection</li>
                    </ul>
                  </div>
                  
                  <div className="quiz-section">
                    <h4>💡 Comprehension Question:</h4>
                    <p><strong>Why is it important to use a large dataset to train the model?</strong></p>
                    <details>
                      <summary>Click for answer</summary>
                      <p>A large dataset allows the model to learn from a wider variety of deepfake patterns, 
                      which improves its ability to detect even new and advanced deepfakes it hasn't seen before.</p>
                    </details>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="learning-step">
              <div className="step-header">
                <div className="step-number"></div>
                <div className="step-title">
                  <span className="step-label">Step 4</span>
                  <h3>Practical Training & Gamification</h3>
                </div>
              </div>
              
              <div className="step-content">
                <div className="video-container">
                  <iframe 
                    width="100%" 
                    height="315" 
                    src="https://www.youtube.com/embed/DWK_iYBl8cA"
                    title="Gamification in Learning"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                  </iframe>
                </div>
                
                <div className="step-info">
                  <h4>Learning Through Gaming:</h4>
                  <ul>
                    <li><strong>10 Progressive Game Levels:</strong> From easy to hard with increasing difficulty</li>
                    <li><strong>Smart Hints:</strong> Customized help for each level</li>
                    <li><strong>Progress Tracking:</strong> Personal statistics and performance improvement</li>
                    <li><strong>Competition:</strong> Compare with other students</li>
                    <li><strong>Complete Learning Path:</strong> Combines all 5 learning steps in practice</li>
                  </ul>
                  
                  <div className="practice-challenge">
                    <h4>🎮 Final Challenge:</h4>
                    <p><strong>Ready to test yourself?</strong></p>
                    <p>Now that you've completed our 5-step learning module, put your knowledge to the test in our interactive game. Try to reach at least level 5!</p>
                    <button 
                      className="btn btn-success btn-lg"
                      onClick={() => navigate('/Game')}
                    >
                      🚀 Start the Game Now
                    </button>
                  </div>
                  
                  <div className="quiz-section">
                    <h4>📝 Summary & Questions:</h4>
                    <div className="final-quiz">
                      <p><strong>1. What is the technical name for the audio features our system uses?</strong></p>
                      <details>
                        <summary>Answer</summary>
                        <p>MFCC - Mel-Frequency Cepstral Coefficients</p>
                      </details>
                      
                      <p><strong>2. Name three main signs for detecting audio deepfakes:</strong></p>
                      <details>
                        <summary>Answer</summary>
                        <p>1. Unnatural breathing<br/>2. Voice tone changes<br/>3. Mechanical speech pace</p>
                      </details>
                      
                      <p><strong>3. What is the accuracy of our deepfake detection system?</strong></p>
                      <details>
                        <summary>Answer</summary>
                        <p>97.31% - Very high accuracy!</p>
                      </details>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="learning-step">
              <div className="step-header">
                <div className="step-number"></div>
                <div className="step-title">
                  <span className="step-label">Step 5</span>
                  <h3>How Does Our Technology Work?</h3>
                </div>
              </div>
              
              <div className="step-content">
                <div className="tech-workflow">
                  <div className="workflow-step">
                    <div className="workflow-number">1</div>
                    <div className="workflow-content">
                      <h4>Data Collection</h4>
                      <p>The system needs samples of both real and fake audio - our Codecfake dataset contains over 700,000 samples for comprehensive training.</p>
                    </div>
                  </div>
                  
                  <div className="workflow-step">
                    <div className="workflow-number">2</div>
                    <div className="workflow-content">
                      <h4>Feature Extraction</h4>
                      <p>MFCC features are extracted from each audio sample, capturing the essential characteristics that distinguish real from synthetic speech.</p>
                    </div>
                  </div>
                  
                  <div className="workflow-step">
                    <div className="workflow-number">3</div>
                    <div className="workflow-content">
                      <h4>Model Training</h4>
                      <p>Machine learning algorithm learns the unique patterns and signatures that differentiate authentic human speech from AI-generated audio.</p>
                    </div>
                  </div>
                  
                  <div className="workflow-step">
                    <div className="workflow-number">4</div>
                    <div className="workflow-content">
                      <h4>Detection & Analysis</h4>
                      <p>New audio files are analyzed using the trained model, providing confidence scores and detailed detection results.</p>
                    </div>
                  </div>
                </div>
                
                <div className="interactive-demo">
                  <h4>🎤 Interactive Example</h4>
                  <p>Choose an audio type to see how our detection system works:</p>
                  
                  <div className="demo-buttons">
                    <button className="demo-btn real-audio" onClick={() => setDemoResult('real')}>
                      🎙️ Human Speech
                    </button>
                    <button className="demo-btn fake-audio" onClick={() => setDemoResult('fake')}>
                      🤖 AI Generated
                    </button>
                    <button className="demo-btn mixed-audio" onClick={() => setDemoResult('mixed')}>
                      🔀 Mixed Sample
                    </button>
                  </div>
                  
                  {demoResult && (
                    <div className={`demo-result ${demoResult}`}>
                      {demoResult === 'real' && (
                        <>
                          <div className="result-icon">✅</div>
                          <h5>Real Audio Detected</h5>
                          <p><strong>Confidence: 99.2%</strong></p>
                          <p>Natural breathing patterns, consistent vocal characteristics, authentic background noise.</p>
                        </>
                      )}
                      {demoResult === 'fake' && (
                        <>
                          <div className="result-icon">⚠️</div>
                          <h5>Deepfake Detected</h5>
                          <p><strong>Confidence: 97.8%</strong></p>
                          <p>Irregular spectral patterns, unnatural prosody, missing micro-expressions in speech.</p>
                        </>
                      )}
                      {demoResult === 'mixed' && (
                        <>
                          <div className="result-icon">🔍</div>
                          <h5>Partially Synthetic</h5>
                          <p><strong>Confidence: 89.4%</strong></p>
                          <p>Some segments appear synthetic while others seem authentic. Requires further analysis.</p>
                        </>
                      )}
                    </div>
                  )}
                  
                  <div className="detection-tip">
                    <p><strong>💡 Pro Tip:</strong> Pay attention to unnaturalness in tone, rhythm, and accent consistency - these are key indicators our AI uses for detection.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
          <div className="module-conclusion">
            <h3>🎓 Learning Module Summary</h3>
            <p>
              Now you know how to detect audio deepfakes! You've learned what deepfakes are, how to identify them through 
              scientific research insights, the advanced technology behind detection systems, practical gaming approaches, 
              and our complete detection workflow. The knowledge you've gained will help you become a more informed 
              information consumer and protect yourself from deception. Continue practicing with our game and improve your detection skills.
            </p>
            
            <div className="next-steps">
              <h4>Next Steps:</h4>
              <div className="action-buttons">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate('/Game')}
                >
                  🎯 Practice with Game
                </button>
                <button 
                  className="btn btn-secondary btn-lg"
                  onClick={() => navigate('/upload')}
                >
                  🔍 Analyze Audio File
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="back-container">
          <a href="/" className="back-button">
            ← Back to Home
          </a>
        </div>
      </div>
    </>
  );
};

export default Educational; 