import React, { useState, useEffect } from 'react';
import '../styles/ManageUploads.css';
import axios from 'axios';

const ManageUploads = () => {
  const [uploads, setUploads] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/admin/uploads');
      setUploads(response.data);
    } catch (err) {
      setError('Failed to fetch uploads.');
      console.error('Error fetching uploads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUpload = async (uploadId) => {
    if (window.confirm('Are you sure you want to delete this upload?')) {
      try {
        await axios.delete(`http://localhost:5001/api/admin/delete_upload/${uploadId}`);
        setUploads(uploads.filter(upload => upload.id !== uploadId));
      } catch (err) {
        setError('Failed to delete upload.');
        console.error('Error deleting upload:', err);
      }
    }
  };

  const handleReprocessUpload = (uploadId) => {
    console.log('Reprocessing upload:', uploadId);
    // Here you would implement reprocessing logic
  };

  const handleDownloadUpload = (uploadId) => {
    console.log('Downloading upload:', uploadId);
    // Here you would implement download logic
  };

  const filteredUploads = uploads.filter(upload => {
    const matchesSearch = 
      upload.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      upload.user.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterType === 'all' || 
      upload.result.toLowerCase() === filterType.toLowerCase() ||
      upload.status.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processed': return '✅';
      case 'processing': return '⏳';
      case 'failed': return '❌';
      default: return '❓';
    }
  };

  const getResultIcon = (result) => {
    return result === 'Real' ? '✅' : '⚠️';
  };

  return (
    <>
      {/* Header */}
      <header data-bs-theme="dark">
        <nav className="navbar">
          <div className="container-fluid">
            <div className="navbar-brand">
              <img src={require('../images/logo.png')} alt="DeepFakeAudio Logo" className="logo" />
              Upload Management
            </div>
            <div className="toolbar-icons">
              <a href="/admin">🏠</a>
              <a href="/login">🚪</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Floating decorations */}
      <div className="uploads-decorations">
        <div className="floating-uploads-icon" style={{left: '5%', top: '15%', animationDelay: '0s'}}>📤</div>
        <div className="floating-uploads-icon" style={{left: '90%', top: '25%', animationDelay: '2s'}}>🎵</div>
        <div className="floating-uploads-icon" style={{left: '10%', top: '65%', animationDelay: '4s'}}>📁</div>
        <div className="floating-uploads-icon" style={{left: '85%', top: '75%', animationDelay: '1s'}}>🔍</div>
        <div className="floating-uploads-icon" style={{left: '50%', top: '10%', animationDelay: '3s'}}>📊</div>
      </div>

      <div className="uploads-container">
        <div className="uploads-header">
          <h1 className="uploads-title">📤 Upload Management</h1>
          <p className="uploads-subtitle">Monitor and manage audio file uploads</p>
        </div>

        {/* Controls */}
        <div className="uploads-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Search by filename or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <label>🔽 Filter:</label>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Files</option>
              <option value="real">Real Audio</option>
              <option value="deepfake">Deepfake Audio</option>
              <option value="processed">Processed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div className="uploads-stats">
            <div className="stat-item">
              <span className="stat-number">{uploads.length}</span>
              <span className="stat-label">Total Uploads</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{filteredUploads.length}</span>
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
            ⏳ Loading uploads...
          </div>
        )}

        {/* Uploads Grid */}
        <div className="uploads-grid">
          {filteredUploads.length > 0 ? (
            filteredUploads.map((upload) => (
              <div key={upload.id} className="upload-card">
                <div className="upload-header">
                  <div className="upload-info">
                    <div className="upload-icon">🎵</div>
                    <div className="upload-details">
                      <h3 className="upload-filename">{upload.filename}</h3>
                      <p className="upload-user">👤 {upload.user}</p>
                    </div>
                  </div>
                  <div className="upload-status">
                    <span className={`status-badge ${upload.status.toLowerCase()}`}>
                      {getStatusIcon(upload.status)} {upload.status}
                    </span>
                  </div>
                </div>

                <div className="upload-content">
                  <div className="upload-metrics">
                    <div className="metric-row">
                      <div className="metric">
                        <span className="metric-icon">📅</span>
                        <span className="metric-label">Upload Date</span>
                        <span className="metric-value">{new Date(upload.uploadDate).toLocaleDateString()}</span>
                      </div>
                      <div className="metric">
                        <span className="metric-icon">💾</span>
                        <span className="metric-label">File Size</span>
                        <span className="metric-value">{upload.fileSize}</span>
                      </div>
                    </div>
                    <div className="metric-row">
                      <div className="metric">
                        <span className="metric-icon">⏱️</span>
                        <span className="metric-label">Duration</span>
                        <span className="metric-value">{upload.duration}</span>
                      </div>
                      <div className="metric">
                        <span className="metric-icon">{getResultIcon(upload.result)}</span>
                        <span className="metric-label">Result</span>
                        <span className={`metric-value ${upload.result.toLowerCase()}`}>
                          {upload.result}
                        </span>
                      </div>
                    </div>
                  </div>

                  {upload.status === 'processed' && upload.confidence && (
                    <div className="confidence-meter">
                      <div className="confidence-label">
                        🎯 Confidence: {upload.confidence}%
                      </div>
                      <div className="confidence-bar">
                        <div 
                          className="confidence-fill" 
                          style={{width: `${upload.confidence}%`}}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="upload-actions">
                  <button 
                    className="download-btn"
                    onClick={() => handleDownloadUpload(upload.id)}
                    title="Download File"
                  >
                    📥 Download
                  </button>
                  {upload.status === 'failed' && (
                    <button 
                      className="reprocess-btn"
                      onClick={() => handleReprocessUpload(upload.id)}
                      title="Reprocess File"
                    >
                      🔄 Reprocess
                    </button>
                  )}
                  <button 
                    className="delete-upload-btn"
                    onClick={() => handleDeleteUpload(upload.id)}
                    title="Delete Upload"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-uploads">
              <div className="no-uploads-icon">📤</div>
              <h3>No uploads found</h3>
              <p>{searchTerm || filterType !== 'all' ? 'No uploads match your search criteria.' : 'No files have been uploaded yet.'}</p>
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

export default ManageUploads;
