import React, { useState, useEffect } from 'react';
import '../styles/AdminReports.css';
import axios from 'axios';

const AdminReports = () => {
  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    setLoading(true);
    try {
      // Sample data for user statistics
      const sampleData = [
        { date: '2024-01-01', newUsers: 12, activeUsers: 45, logins: 78 },
        { date: '2024-01-02', newUsers: 8, activeUsers: 52, logins: 89 },
        { date: '2024-01-03', newUsers: 15, activeUsers: 48, logins: 92 },
        { date: '2024-01-04', newUsers: 20, activeUsers: 65, logins: 105 },
        { date: '2024-01-05', newUsers: 18, activeUsers: 72, logins: 115 },
        { date: '2024-01-06', newUsers: 25, activeUsers: 68, logins: 120 },
        { date: '2024-01-07', newUsers: 22, activeUsers: 75, logins: 135 }
      ];
      setUserStats(sampleData);
    } catch (err) {
      setError('Failed to fetch user statistics');
      console.error('Error fetching user stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const maxValue = Math.max(...userStats.flatMap(day => [day.newUsers, day.activeUsers, day.logins]));

  return (
    <>
      {/* Header */}
      <header data-bs-theme="dark">
        <nav className="navbar">
          <div className="container-fluid">
            <div className="navbar-brand">
              <img src={require('../images/logo.png')} alt="DeepFakeAudio Logo" className="logo" />
              User Statistics
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
        <div className="floating-reports-icon" style={{left: '10%', top: '65%', animationDelay: '4s'}}>👥</div>
        <div className="floating-reports-icon" style={{left: '85%', top: '75%', animationDelay: '1s'}}>💹</div>
        <div className="floating-reports-icon" style={{left: '50%', top: '10%', animationDelay: '3s'}}>📋</div>
      </div>

      <div className="reports-container">
        <div className="reports-header">
          <h1 className="reports-title">📊 User Statistics</h1>
          <p className="reports-subtitle">Monitor user activity and engagement</p>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {loading && (
          <div className="loading-message">
            ⏳ Loading user statistics...
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Quick Stats */}
            <div className="quick-stats">
              <div className="quick-stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <div className="stat-number">31</div>
                  <div className="stat-label">TOTAL USERS</div>
                </div>
              </div>
              <div className="quick-stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <div className="stat-number">15</div>
                  <div className="stat-label">ACTIVE USERS</div>
                </div>
              </div>
              <div className="quick-stat-card">
                <div className="stat-icon">🎮</div>
                <div className="stat-content">
                  <div className="stat-number">2180</div>
                  <div className="stat-label">GAMES PLAYED</div>
                </div>
              </div>
              <div className="quick-stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-content">
                  <div className="stat-number">89%</div>
                  <div className="stat-label">SUCCESS RATE</div>
                </div>
              </div>
            </div>

            <div className="chart-section">
              <div className="chart-container">
                <div className="chart-header">
                  <h2 className="chart-title">👥 User Activity Over Time</h2>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="legend-color new-users"></div>
                      <span>New Users</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color active-users"></div>
                      <span>Active Users</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color logins"></div>
                      <span>Total Logins</span>
                    </div>
                  </div>
                </div>
                
                <div className="chart-body">
                  <div className="chart-y-axis">
                    {[maxValue, Math.floor(maxValue * 0.75), Math.floor(maxValue * 0.5), Math.floor(maxValue * 0.25), 0].map((value, index) => (
                      <div key={index} className="y-axis-label">{value}</div>
                    ))}
                  </div>
                  
                  <div className="chart-area">
                    <div className="chart-grid">
                      {[0, 1, 2, 3, 4].map(i => (
                        <div key={i} className="grid-line"></div>
                      ))}
                    </div>
                    
                    <div className="chart-bars">
                      {userStats.map((day, index) => (
                        <div key={index} className="bar-group">
                          <div className="bar-container">
                            <div 
                              className="bar new-users" 
                              style={{height: `${(day.newUsers / maxValue) * 100}%`}}
                              title={`New Users: ${day.newUsers}`}
                            ></div>
                            <div 
                              className="bar active-users" 
                              style={{height: `${(day.activeUsers / maxValue) * 100}%`}}
                              title={`Active Users: ${day.activeUsers}`}
                            ></div>
                            <div 
                              className="bar logins" 
                              style={{height: `${(day.logins / maxValue) * 100}%`}}
                              title={`Logins: ${day.logins}`}
                            ></div>
                          </div>
                          <div className="x-axis-label">
                            {new Date(day.date).toLocaleDateString('he-IL', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

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