import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UploadAudio.css';

const UploadAudio = () => {
  const [analysisResult, setAnalysisResult] = useState('');
  const [confidence, setConfidence] = useState(null);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [questionRatings, setQuestionRatings] = useState({
    usability: 0,
    design: 0,
    performance: 0,
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await fetch('http://127.0.0.1:5001/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setAnalysisResult(data.result);
        setConfidence(data.confidence.toFixed(2));
      } else {
        alert('Error analyzing audio.');
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading file.');
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      if (!loggedInUser || !loggedInUser.username) {
        alert('User is not logged in.');
        return;
      }

      const response = await fetch('http://localhost:5001/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loggedInUser.username,
          message: feedback,
          questionRatings,
        }),
      });

      if (response.ok) {
        alert('Feedback submitted successfully!');
        setFeedback('');
        setRating(0);
        setQuestionRatings({ usability: 0, design: 0, performance: 0 });
        setShowFeedbackForm(false);
      } else {
        const errorData = await response.json();
        alert(`Failed to submit feedback: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting feedback.');
    }
  };

  return (
    <>
      <header data-bs-theme="dark">
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <div className="container-fluid">
            <div className="navbar-brand" href="#">
              <img src={require('../images/logo.png')} alt="DeepFakeAudio Logo" className="logo" />
              DeepFakeAudio
            </div>
          </div>
        </nav>
      </header>

      <div className="upload-container">
        <h1>Upload Audio for Analysis</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" accept="audio/*" onChange={handleFileChange} required />
          <button type="submit">Upload and Analyze</button>
          <button
            type="button"
            className="btn btn-outline-light btn-lg mt-3"
            onClick={() => navigate('/game')}
          >
            🎮 Start Game
          </button>
        </form>

        {analysisResult && (
          <div className="result-box">
            <h3>Result: {analysisResult}</h3>
            <p>Confidence: {confidence}%</p>
          </div>
        )}

        <button className="feedback-button" onClick={() => setShowFeedbackForm(!showFeedbackForm)}>
          <i>📝</i>
        </button>

        {showFeedbackForm && (
          <div className="feedback-form">
            <h3>Submit Your Feedback</h3>

            <div className="feedback-question">
              <label>Usability:</label>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={i < questionRatings.usability ? 'active' : ''}
                    onClick={() => setQuestionRatings({ ...questionRatings, usability: i + 1 })}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="feedback-question">
              <label>Design:</label>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={i < questionRatings.design ? 'active' : ''}
                    onClick={() => setQuestionRatings({ ...questionRatings, design: i + 1 })}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="feedback-question">
              <label>Performance:</label>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={i < questionRatings.performance ? 'active' : ''}
                    onClick={() => setQuestionRatings({ ...questionRatings, performance: i + 1 })}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Additional comments..."
            ></textarea>
            <button onClick={handleFeedbackSubmit}>Submit</button>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadAudio;
