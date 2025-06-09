import React, { useState } from 'react';
import '../styles/UploadAudio.css';
import { useNavigate } from 'react-router-dom';
import { FaGamepad, FaComments } from 'react-icons/fa';
import Toolbar from '../components/Toolbar';

const UploadAudio = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [ratings, setRatings] = useState({
    usability: 0,
    design: 0,
    performance: 0
  });
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
    navigate('/game');
  };

  const handleRatingChange = (question, rating) => {
    setRatings(prev => ({
      ...prev,
      [question]: rating
    }));
  };

  const handleFeedbackSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: feedback,
          questionRatings: ratings
        }),
      });

      if (response.ok) {
        alert('Thank you for your feedback!');
        setShowFeedback(false);
        setFeedback('');
        setRatings({ usability: 0, design: 0, performance: 0 });
      } else {
        alert('Error submitting feedback');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <>
      <Toolbar />
      <div className="upload-container">
        <h1>Audio Deepfake Detector</h1>
        
        <form onSubmit={handleUpload}>
          <input
            type="file"
            onChange={handleFileSelect}
            accept="audio/*"
          />
          <div>
            <button type="submit" disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze Audio'}
            </button>
            <button type="button" onClick={handleStartGame}>
              <FaGamepad /> Start Game
            </button>
          </div>
        </form>

        {result && (
          <div className="result-box">
            <h3 className={result.result.toLowerCase()}>
              {result.result}
            </h3>
            <p>Confidence: {result.confidence}%</p>
          </div>
        )}

        <button className="feedback-button" onClick={() => setShowFeedback(!showFeedback)}>
          <FaComments />
        </button>

        {showFeedback && (
          <div className="feedback-form">
            <h3>Your Feedback</h3>
            
            <div className="feedback-question">
              <label>Usability</label>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= ratings.usability ? 'active' : ''}
                    onClick={() => handleRatingChange('usability', star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="feedback-question">
              <label>Design</label>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= ratings.design ? 'active' : ''}
                    onClick={() => handleRatingChange('design', star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="feedback-question">
              <label>Performance</label>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= ratings.performance ? 'active' : ''}
                    onClick={() => handleRatingChange('performance', star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts..."
            />
            <button onClick={handleFeedbackSubmit}>Submit Feedback</button>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadAudio;
