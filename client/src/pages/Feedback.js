import React, { useState, useEffect } from 'react';
import '../styles/Feedback.css';
import axios from 'axios';

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/admin/feedback');
      setFeedback(response.data);
    } catch (err) {
      setError('Failed to fetch feedback.');
      console.error('Error fetching feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (feedbackId) => {
    console.log('Replying to feedback:', feedbackId);
    // Here you would implement reply functionality
  };

  const handleArchive = (feedbackId) => {
    console.log('Archiving feedback:', feedbackId);
    // Here you would implement archive functionality
  };

  const handleDelete = (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      setFeedback(feedback.filter(item => item.id !== feedbackId));
    }
  };

  const filteredFeedback = feedback.filter(item =>
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <header data-bs-theme="dark">
        <nav className="navbar">
          <div className="container-fluid">
            <div className="navbar-brand">
              <img src={require('../images/logo.png')} alt="DeepFakeAudio Logo" className="logo" />
              Feedback Management
            </div>
            <div className="toolbar-icons">
              <a href="/admin">🏠</a>
              <a href="/login">🚪</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Floating decorations */}
      <div className="feedback-decorations">
        <div className="floating-feedback-icon" style={{left: '5%', top: '15%', animationDelay: '0s'}}>💬</div>
        <div className="floating-feedback-icon" style={{left: '90%', top: '25%', animationDelay: '2s'}}>📝</div>
        <div className="floating-feedback-icon" style={{left: '10%', top: '65%', animationDelay: '4s'}}>⭐</div>
        <div className="floating-feedback-icon" style={{left: '85%', top: '75%', animationDelay: '1s'}}>💭</div>
        <div className="floating-feedback-icon" style={{left: '50%', top: '10%', animationDelay: '3s'}}>📋</div>
      </div>

      <div className="feedback-container">
        <div className="feedback-header">
          <h1 className="feedback-title">💬 Feedback Management</h1>
          <p className="feedback-subtitle">Review and manage user feedback</p>
        </div>

        {/* Controls */}
        <div className="feedback-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Search feedback by email or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="feedback-stats">
            <div className="stat-item">
              <span className="stat-number">{feedback.length}</span>
              <span className="stat-label">Total Feedback</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{filteredFeedback.length}</span>
              <span className="stat-label">Filtered Results</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {loading && (
          <div className="loading-message">
            ⏳ Loading feedback...
          </div>
        )}

        {/* Feedback Grid */}
        <div className="feedback-grid">
          {filteredFeedback.length > 0 ? (
            filteredFeedback.map((item) => (
              <div key={item.id} className="feedback-card">
                <div className="feedback-header-card">
                  <div className="user-info">
                    <div className="user-avatar">👤</div>
                    <div className="user-details">
                      <div className="user-email">{item.email}</div>
                      <div className="user-name">{item.username}</div>
                    </div>
                  </div>
                  <div className="feedback-date">
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </div>

                <div className="feedback-content">
                  <div className="feedback-icon">💬</div>
                  <p className="feedback-message">{item.message}</p>
                </div>

                <div className="feedback-actions">
                  <button 
                    className="reply-button"
                    onClick={() => handleReply(item.id)}
                  >
                    ↩️ Reply
                  </button>
                  <button 
                    className="archive-button"
                    onClick={() => handleArchive(item.id)}
                  >
                    📁 Archive
                  </button>
                  <button 
                    className="delete-feedback-button"
                    onClick={() => handleDelete(item.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-feedback">
              <div className="no-feedback-icon">💬</div>
              <h3>No feedback found</h3>
              <p>{searchTerm ? 'No feedback matches your search criteria.' : 'No feedback has been submitted yet.'}</p>
            </div>
          )}
        </div>

        {/* Back to Admin Button */}
        <div className="back-container">
          <a href="/admin" className="back-button">
            ← Back to Admin Dashboard
          </a>
        </div>
      </div>
    </>
  );
};

export default Feedback;