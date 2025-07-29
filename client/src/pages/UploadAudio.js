import React, { useState, useEffect } from 'react';
import '../styles/UploadAudio.css';
import { useNavigate } from 'react-router-dom';

const UploadAudio = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInstitution, setIsInstitution] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is from an educational institution
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setIsInstitution(user.is_institution === 1); // SQLite stores boolean as 1/0
    }
  }, []);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
    setResult(null);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('audio', selectedFile);

    try {
      const response = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Error uploading file: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = () => {
    navigate('/Game');
  };

  return (
    <>
      {/* Header */}
      <header data-bs-theme="dark">
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <div className="container-fluid">
            <div className="navbar-brand">
              <img src={require('../images/audio-detector-logo.png')} alt="DeepFakeAudio Logo" className="logo" />
              DeepFakeAudio
            </div>
            <div className="toolbar-icons">
              <a href="/Game">🎮</a>
              <a href="/profile">👤</a>
            </div>
          </div>
        </nav>
      </header>

      <div className="upload-container">
        {/* Main Title */}
        <div className="main-title">
          <h1>🎧 Audio Deepfake Detection Platform</h1>
          <p>Choose your path to explore deepfake audio technology</p>
        </div>

        {/* Section 1: Audio Analysis */}
        <div className="section-container analysis-section">
          <div className="section-header">
            <h2>🔍 Audio Analysis</h2>
            <p>Upload an audio file to detect if it's real or AI-generated</p>
          </div>
          
          <form onSubmit={handleUpload}>
            <div className="file-input-container">
              <input
                type="file"
                id="audioFile"
                accept="audio/*"
                onChange={handleFileSelect}
                required
              />
              <label 
                htmlFor="audioFile" 
                className={`file-input-label ${selectedFile ? 'has-file' : ''}`}
              >
                {selectedFile ? (
                  <>
                    <div className="upload-icon wave-icon">🎵</div>
                    <div className="upload-text">File Selected: {selectedFile.name}</div>
                    <div className="upload-subtext">Click to change file</div>
                  </>
                ) : (
                  <>
                    <div className="upload-icon wave-icon">🎵</div>
                    <div className="upload-text">Drag & Drop or Click to Upload</div>
                    <div className="upload-subtext">Supported formats: MP3, WAV, M4A</div>
                  </>
                )}
              </label>
            </div>
            
            <button type="submit" disabled={!selectedFile || loading} className="analyze-button">
              {loading ? 'Analyzing...' : 'Analyze Audio'}
            </button>
          </form>

          {loading && (
            <div className="loading">
              🔍 Analyzing your audio file...
            </div>
          )}

          {result && (
            <div className={`result-container ${result.result.toLowerCase()}`}>
              <h3>
                {result.result === 'Real' ? 'Real Audio ✅ ' : 'Deepfake Detected ⚠️'}
              </h3>
              <p>Confidence: {result.confidence}%</p>
              <p>
                {result.result === 'Real' 
                  ? 'This audio appears to be authentic human speech.'
                  : 'This audio shows signs of artificial generation or manipulation.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Section 2: Game Mode */}
        <div className="section-container game-section">
          <div className="section-header">
            <h2>🎮 Interactive Game</h2>
            <p>Test your skills with our deepfake detection challenge</p>
          </div>
          
          <div className="section-content">
            <div className="feature-list">
              <div className="feature-item">🎯 Multiple difficulty levels</div>
              <div className="feature-item">🏆 Score tracking and achievements</div>
              <div className="feature-item">📊 Real-time feedback</div>
            </div>
            
            <button onClick={handleStartGame} className="game-button">
              <div className="game-text">Start the Game</div>
            </button>
          </div>
        </div>

        {/* Section 3: Educational Mode - Only for institutions */}
        {isInstitution && (
          <div className="section-container educational-section">
            <div className="section-header">
              <h2>🎓 Educational Mode</h2>
              <p>Comprehensive learning module for institutions</p>
            </div>
            
            <div className="section-content">
                          <div className="feature-list">
              <div className="feature-item">📚 Step-by-step learning process</div>
              <div className="feature-item">🔬 Scientific research and data</div>
              <div className="feature-item">💡 Interactive demonstrations</div>
            </div>
            
            <button 
              onClick={() => navigate('/educational')} 
              className="educational-button"
            >
              <div className="educational-icon">🎓</div>
              <div className="educational-text">Audio Deepfake Detection Tutorial</div>
            </button>
            </div>
          </div>
        )}

        <div className="nav-links">
          <a href="/profile">Profile 👤</a>
        </div>
      </div>
    </>
  );
};

export default UploadAudio;
