import React, { useState, useEffect } from 'react';
import '../styles/AdminDashboard.css';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalUploads: 0,
    totalFeedback: 0,
    activeGames: 0
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
          <h1 className="admin-title">⏳ Loading...</h1>
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
          <p className="admin-subtitle">Manage your deepfake detection system</p>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {/* Statistics Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📤</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalUploads}</div>
              <div className="stat-label">Audio Uploads</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💬</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalFeedback}</div>
              <div className="stat-label">User Feedback</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-content">
              <div className="stat-number">{stats.activeGames}</div>
              <div className="stat-label">Active Games</div>
            </div>
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
                <p>View, edit, and manage user accounts and permissions</p>
              </div>
              <div className="action-arrow">→</div>
            </a>

            <a href="/admin/feedback" className="action-card">
              <div className="action-icon">💬</div>
              <div className="action-content">
                <h3>Feedback Management</h3>
                <p>Review and respond to user feedback and suggestions</p>
              </div>
              <div className="action-arrow">→</div>
            </a>

            <a href="/admin/games" className="action-card">
              <div className="action-icon">🎮</div>
              <div className="action-content">
                <h3>Game Management</h3>
                <p>Configure game levels, difficulty, and content</p>
              </div>
              <div className="action-arrow">→</div>
            </a>

            <a href="/admin/uploads" className="action-card">
              <div className="action-icon">📤</div>
              <div className="action-content">
                <h3>Upload Management</h3>
                <p>Monitor and manage audio file uploads and processing</p>
              </div>
              <div className="action-arrow">→</div>
            </a>

            <a href="/admin/reports" className="action-card">
              <div className="action-icon">📊</div>
              <div className="action-content">
                <h3>Analytics & Reports</h3>
                <p>View detailed analytics and generate system reports</p>
              </div>
              <div className="action-arrow">→</div>
            </a>

            <div className="action-card">
              <div className="action-icon">⚙️</div>
              <div className="action-content">
                <h3>System Settings</h3>
                <p>Configure system parameters and security settings</p>
              </div>
              <div className="action-arrow">→</div>
            </div>

            <div className="action-card">
              <div className="action-icon">🔒</div>
              <div className="action-content">
                <h3>Security Center</h3>
                <p>Monitor security events and manage access controls</p>
              </div>
              <div className="action-arrow">→</div>
            </div>

            <div className="action-card">
              <div className="action-icon">📈</div>
              <div className="action-content">
                <h3>Performance Monitor</h3>
                <p>Track system performance and resource usage</p>
              </div>
              <div className="action-arrow">→</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
