import React, { useState } from 'react';
import '../styles/UploadAudio.css';
import { useNavigate } from 'react-router-dom';

const UploadAudio = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        <div className="upload-form-container">
          <h1>🎧 Audio Deepfake Detection</h1>
          
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
            
            <button type="submit" disabled={!selectedFile || loading}>
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

          {/* Game Button */}
          <div className="game-button-container">
            <button onClick={handleStartGame} className="game-button">
              <div className="game-text">start the game</div>
            </button>
          </div>

          <div className="nav-links">
            <a href="/profile">Profile 👤</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadAudio;
