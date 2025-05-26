  return (
    <>
      {/* Header */}
      <header data-bs-theme="dark">
        <nav className="navbar">
          <div className="container-fluid">
            <div className="navbar-brand">
              <img src={require('../images/logo.png')} alt="DeepFakeAudio Logo" className="logo" />
              DeepFakeAudio
            </div>
            <div className="toolbar-icons">
              <a href="/game">🎮</a>
              <a href="/profile">👤</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Floating decorations */}
      <div className="upload-decorations">
        <div className="floating-audio-upload" style={{left: '8%', top: '15%', animationDelay: '0s'}}>🎧</div>
        <div className="floating-audio-upload" style={{left: '88%', top: '25%', animationDelay: '2s'}}>🎵</div>
        <div className="floating-audio-upload" style={{left: '12%', top: '70%', animationDelay: '4s'}}>🔊</div>
        <div className="floating-audio-upload" style={{left: '85%', top: '80%', animationDelay: '1s'}}>🎤</div>
        <div className="floating-audio-upload" style={{left: '45%', top: '10%', animationDelay: '3s'}}>📻</div>
        <div className="floating-audio-upload" style={{left: '25%', top: '45%', animationDelay: '1.5s'}}>🎶</div>
      </div>

      <div className="upload-container">
        <div className="upload-form-container">
          <h1>🎧 Audio Deepfake Detection</h1>
          <form onSubmit={handleSubmit}>
            <div className="file-input-container">
              <input
                type="file"
                id="audioFile"
                accept="audio/*"
                onChange={handleFileChange}
                required
              />
              <label 
                htmlFor="audioFile" 
                className={`file-input-label ${file ? 'has-file' : ''}`}
              >
                {file ? (
                  <>
                    <div className="upload-icon">✅</div>
                    <div className="upload-text">File Selected: {file.name}</div>
                    <div className="upload-subtext">Click to change file</div>
                  </>
                ) : (
                  <>
                    <div className="upload-icon">📁</div>
                    <div className="upload-text">Drag & Drop or Click to Upload</div>
                    <div className="upload-subtext">Supported formats: MP3, WAV, M4A, FLAC</div>
                  </>
                )}
              </label>
            </div>
            
            <button type="submit" disabled={!file || loading}>
              {loading ? 'Analyzing...' : 'Analyze Audio'}
            </button>
          </form>

          {loading && (
            <div className="loading">
              Analyzing your audio file...
            </div>
          )}

          {result && (
            <div className={`result-container ${result.prediction === 'Real' ? 'real' : 'fake'}`}>
              <h3>
                {result.prediction === 'Real' ? '✅ Real Audio' : '⚠️ Deepfake Detected'}
              </h3>
              <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
              <p>
                {result.prediction === 'Real' 
                  ? 'This audio appears to be authentic human speech.'
                  : 'This audio shows signs of artificial generation or manipulation.'
                }
              </p>
            </div>
          )}

          <div className="nav-links">
            <a href="/game">🎮 Play Game</a>
            <a href="/profile">👤 Profile</a>
          </div>
        </div>
      </div>
    </>
  ); 