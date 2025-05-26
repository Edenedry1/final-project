import React, { useState, useEffect } from 'react';
import '../styles/AdminReports.css';
import axios from 'axios';

const AdminReports = () => {
  const [reports, setReports] = useState({
    userActivity: [],
    gameStats: [],
    uploadStats: [],
    systemHealth: {}
  });
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, [selectedPeriod]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/api/admin/reports');
      setReports(response.data);
    } catch (err) {
      setError('Failed to fetch reports');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (type) => {
    console.log(`Exporting ${type} report...`);
    // Here you would implement actual export functionality
  };

  return (
    <>
      {/* Header */}
      <header data-bs-theme="dark">
        <nav className="navbar">
          <div className="container-fluid">
            <div className="navbar-brand">
              <img src={require('../images/logo.png')} alt="DeepFakeAudio Logo" className="logo" />
              Activity Reports
            </div>
            <div className="toolbar-icons">
              <a href="/admin">🏠</a>
              <a href="/login">🚪</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Floating decorations */}
      <div className="reports-decorations">
        <div className="floating-reports-icon" style={{left: '5%', top: '15%', animationDelay: '0s'}}>📊</div>
        <div className="floating-reports-icon" style={{left: '90%', top: '25%', animationDelay: '2s'}}>📈</div>
        <div className="floating-reports-icon" style={{left: '10%', top: '65%', animationDelay: '4s'}}>📉</div>
        <div className="floating-reports-icon" style={{left: '85%', top: '75%', animationDelay: '1s'}}>💹</div>
        <div className="floating-reports-icon" style={{left: '50%', top: '10%', animationDelay: '3s'}}>📋</div>
      </div>

      <div className="reports-container">
        <div className="reports-header">
          <h1 className="reports-title">📊 Activity Reports</h1>
          <p className="reports-subtitle">Monitor system performance and user analytics</p>
        </div>

        {/* Controls */}
        <div className="reports-controls">
          <div className="period-selector">
            <label>📅 Time Period:</label>
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="period-select"
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <div className="export-buttons">
            <button onClick={() => exportReport('pdf')} className="export-btn">
              📄 Export PDF
            </button>
            <button onClick={() => exportReport('excel')} className="export-btn">
              📊 Export Excel
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {loading && (
          <div className="loading-message">
            ⏳ Loading reports...
          </div>
        )}

        {/* System Health Overview */}
        <div className="health-overview">
          <h2 className="section-title">🏥 System Health</h2>
          <div className="health-grid">
            <div className="health-card">
              <div className="health-icon">⚡</div>
              <div className="health-content">
                <div className="health-value">{reports.systemHealth.uptime}</div>
                <div className="health-label">Uptime</div>
              </div>
            </div>
            <div className="health-card">
              <div className="health-icon">🚀</div>
              <div className="health-content">
                <div className="health-value">{reports.systemHealth.responseTime}</div>
                <div className="health-label">Response Time</div>
              </div>
            </div>
            <div className="health-card">
              <div className="health-icon">🛡️</div>
              <div className="health-content">
                <div className="health-value">{reports.systemHealth.errorRate}</div>
                <div className="health-label">Error Rate</div>
              </div>
            </div>
            <div className="health-card">
              <div className="health-icon">👥</div>
              <div className="health-content">
                <div className="health-value">{reports.systemHealth.activeConnections}</div>
                <div className="health-label">Active Users</div>
              </div>
            </div>
          </div>
        </div>

        {/* User Activity Report */}
        <div className="report-section">
          <h2 className="section-title">👥 User Activity</h2>
          <div className="activity-table-container">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>📅 Date</th>
                  <th>🆕 New Users</th>
                  <th>🔥 Active Users</th>
                  <th>🔑 Total Logins</th>
                </tr>
              </thead>
              <tbody>
                {reports.userActivity.map((day, index) => (
                  <tr key={index}>
                    <td>{new Date(day.date).toLocaleDateString()}</td>
                    <td>
                      <span className="metric-value new-users">{day.newUsers}</span>
                    </td>
                    <td>
                      <span className="metric-value active-users">{day.activeUsers}</span>
                    </td>
                    <td>
                      <span className="metric-value logins">{day.logins}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Game Statistics */}
        <div className="report-section">
          <h2 className="section-title">🎮 Game Performance</h2>
          <div className="games-stats-grid">
            {reports.gameStats.map((game, index) => (
              <div key={index} className="game-stat-card">
                <div className="game-stat-header">
                  <div className="game-stat-icon">🎯</div>
                  <h3>{game.level}</h3>
                </div>
                <div className="game-stat-metrics">
                  <div className="metric">
                    <span className="metric-label">Completions</span>
                    <span className="metric-value">{game.completions}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Avg Time</span>
                    <span className="metric-value">{game.averageTime}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Success Rate</span>
                    <span className="metric-value success-rate">{game.successRate}%</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${game.successRate}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Statistics */}
        <div className="report-section">
          <h2 className="section-title">📤 Upload Analytics</h2>
          <div className="upload-stats-grid">
            {reports.uploadStats.map((upload, index) => (
              <div key={index} className="upload-stat-card">
                <div className="upload-stat-header">
                  <div className="upload-stat-icon">
                    {upload.type.includes('Real') ? '✅' : 
                     upload.type.includes('Deepfake') ? '⚠️' : '🤖'}
                  </div>
                  <h3>{upload.type}</h3>
                </div>
                <div className="upload-stat-content">
                  <div className="upload-count">
                    <span className="count-number">{upload.count}</span>
                    <span className="count-label">Files Processed</span>
                  </div>
                  <div className="accuracy-meter">
                    <div className="accuracy-label">Detection Accuracy</div>
                    <div className="accuracy-bar">
                      <div 
                        className="accuracy-fill" 
                        style={{width: `${upload.accuracy}%`}}
                      ></div>
                    </div>
                    <div className="accuracy-value">{upload.accuracy}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

export default AdminReports;