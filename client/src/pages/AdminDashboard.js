import React, { useState, useEffect } from 'react';
import '../styles/AdminDashboard.css';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    regular_users: 0,
    institution_users: 0,
    total_games: 0,
    total_coins: 0,
    avg_success_rate: 0,
    avg_usability_rating: 0,
    avg_design_rating: 0,
    avg_performance_rating: 0,
    top_performers: [],
    recent_activity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/admin/stats');
      setStats(response.data);
    } catch (err) {
      setError('Failed to fetch statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">⏳ Loading Admin Dashboard...</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header data-bs-theme="dark">
        <nav className="navbar">
          <div className="container-fluid">
            <div className="navbar-brand">
              <img src={require('../images/logo.png')} alt="DeepFakeAudio Logo" className="logo" />
              Admin Dashboard
            </div>
            <div className="toolbar-icons">
              <a href="/home">🏠</a>
              <a href="/login">🚪</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Floating decorations */}
      <div className="admin-decorations">
        <div className="floating-admin-icon" style={{left: '5%', top: '15%', animationDelay: '0s'}}>📊</div>
        <div className="floating-admin-icon" style={{left: '90%', top: '25%', animationDelay: '2s'}}>⚙️</div>
        <div className="floating-admin-icon" style={{left: '10%', top: '65%', animationDelay: '4s'}}>👥</div>
        <div className="floating-admin-icon" style={{left: '85%', top: '75%', animationDelay: '1s'}}>🔧</div>
        <div className="floating-admin-icon" style={{left: '50%', top: '10%', animationDelay: '3s'}}>📈</div>
      </div>

      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">🔧 Admin Dashboard</h1>
          <p className="admin-subtitle">DeepFake Audio Detection System Management</p>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {/* Main Statistics Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">{stats.total_users}</div>
              <div className="stat-label">Total Users</div>
              <div className="stat-sublabel">{stats.regular_users} Regular + {stats.institution_users} Institutions</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-content">
              <div className="stat-number">{stats.total_games}</div>
              <div className="stat-label">Games Played</div>
              <div className="stat-sublabel">Total game sessions</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-number">{stats.total_coins}</div>
              <div className="stat-label">Coins Earned</div>
              <div className="stat-sublabel">Total by all players</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-number">{stats.avg_success_rate}%</div>
              <div className="stat-label">Success Rate</div>
              <div className="stat-sublabel">Average across all users</div>
            </div>
          </div>
        </div>

        {/* Rating Statistics */}
        <div className="rating-stats">
          <h2 className="section-title">⭐ User Satisfaction Ratings</h2>
          <div className="rating-grid">
            <div className="rating-card">
              <div className="rating-icon">🎨</div>
              <div className="rating-content">
                <div className="rating-number">{stats.avg_usability_rating}/5</div>
                <div className="rating-label">Usability</div>
              </div>
            </div>
            <div className="rating-card">
              <div className="rating-icon">🎭</div>
              <div className="rating-content">
                <div className="rating-number">{stats.avg_design_rating}/5</div>
                <div className="rating-label">Design</div>
              </div>
            </div>
            <div className="rating-card">
              <div className="rating-icon">⚡</div>
              <div className="rating-content">
                <div className="rating-number">{stats.avg_performance_rating}/5</div>
                <div className="rating-label">Performance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="top-performers">
          <h2 className="section-title">🏆 Top Performers</h2>
          <div className="performers-list">
            {stats.top_performers.map((performer, index) => (
              <div key={index} className="performer-card">
                <div className="performer-rank">#{index + 1}</div>
                <div className="performer-info">
                  <div className="performer-name">{performer.username}</div>
                  <div className="performer-stats">
                    Level {performer.level_completed} • {performer.total_coins} coins • {performer.success_rate}% accuracy
                  </div>
                </div>
                <div className="performer-badge">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h2 className="section-title">📅 Recent Activity</h2>
          <div className="activity-list">
            {stats.recent_activity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">🎮</div>
                <div className="activity-info">
                  <div className="activity-user">{activity.username}</div>
                  <div className="activity-details">
                    Last played: {activity.last_played} • Level {activity.level_completed} • {activity.total_coins} coins
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Actions */}
        <div className="admin-actions">
          <h2 className="section-title">🛠️ Management Tools</h2>
          <div className="actions-grid">
            <a href="/admin/users" className="action-card">
              <div className="action-icon">👥</div>
              <div className="action-content">
                <h3>User Management</h3>
                <p>View detailed user profiles, game progress, and account management</p>
              </div>
              <div className="action-arrow">→</div>
            </a>

            <a href="/admin/reports" className="action-card">
              <div className="action-icon">📊</div>
              <div className="action-content">
                <h3>Analytics & Reports</h3>
                <p>Detailed game analytics, user feedback analysis, and performance reports</p>
              </div>
              <div className="action-arrow">→</div>
            </a>

            <a href="/admin/games" className="action-card">
              <div className="action-icon">🎮</div>
              <div className="action-content">
                <h3>Game Management</h3>
                <p>Configure game levels, difficulty settings, and coin rewards</p>
              </div>
              <div className="action-arrow">→</div>
            </a>

            <a href="/admin/uploads" className="action-card">
              <div className="action-icon">📤</div>
              <div className="action-content">
                <h3>Upload Management</h3>
                <p>Monitor audio uploads, AI model performance, and detection accuracy</p>
              </div>
              <div className="action-arrow">→</div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
