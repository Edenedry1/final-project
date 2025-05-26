import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await axios.delete(`http://localhost:5001/api/delete_user/${userId}`);
        if (response.status === 200) {
          alert('User deleted successfully.');
          fetchUsers();
        }
      } catch (err) {
        alert(`Failed to delete user: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <header data-bs-theme="dark">
        <nav className="navbar">
          <div className="container-fluid">
            <div className="navbar-brand">
              <img src={require('../images/logo.png')} alt="DeepFakeAudio Logo" className="logo" />
              User Management
            </div>
            <div className="toolbar-icons">
              <a href="/admin">🏠</a>
              <a href="/login">🚪</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Floating decorations */}
      <div className="user-decorations">
        <div className="floating-user-icon" style={{left: '5%', top: '15%', animationDelay: '0s'}}>👥</div>
        <div className="floating-user-icon" style={{left: '90%', top: '25%', animationDelay: '2s'}}>👤</div>
        <div className="floating-user-icon" style={{left: '10%', top: '65%', animationDelay: '4s'}}>🔧</div>
        <div className="floating-user-icon" style={{left: '85%', top: '75%', animationDelay: '1s'}}>⚙️</div>
        <div className="floating-user-icon" style={{left: '50%', top: '10%', animationDelay: '3s'}}>📊</div>
      </div>

      <div className="user-list-container">
        <div className="user-header">
          <h1 className="user-title">👥 User Management</h1>
          <p className="user-subtitle">Manage registered users and their accounts</p>
        </div>

        {/* Search and Stats */}
        <div className="user-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-number">{users.length}</span>
              <span className="stat-label">Total Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{filteredUsers.length}</span>
              <span className="stat-label">Filtered Results</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {/* Users Table */}
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>👤 Username</th>
                <th>📧 Email</th>
                <th>🎓 Institution</th>
                <th>📅 Joined</th>
                <th>⚡ Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>
                      <div className="user-info">
                        <span className="user-avatar">👤</span>
                        <span className="username">{user.username}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      {user.is_institution ? (
                        <span className="institution-badge">🎓 Yes</span>
                      ) : (
                        <span className="regular-badge">👤 No</span>
                      )}
                    </td>
                    <td>{new Date().toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-button" title="Edit User">
                          ✏️
                        </button>
                        <button 
                          className="delete-button" 
                          onClick={() => deleteUser(user.id)}
                          title="Delete User"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-users">
                    {searchTerm ? '🔍 No users found matching your search.' : '👥 No users found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

export default UserList; 