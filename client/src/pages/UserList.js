import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('username');
  const [filterType, setFilterType] = useState('all'); // all, regular, institution

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

  const sortUsers = (users, sortBy) => {
    return [...users].sort((a, b) => {
      switch (sortBy) {
        case 'level':
          return (b.level_completed || 0) - (a.level_completed || 0);
        case 'coins':
          return (b.total_coins || 0) - (a.total_coins || 0);
        case 'games':
          return (b.games_played || 0) - (a.games_played || 0);
        case 'success_rate':
          return (b.success_rate || 0) - (a.success_rate || 0);
        case 'last_played':
          return new Date(b.last_played || 0) - new Date(a.last_played || 0);
        default:
          return a.username.localeCompare(b.username);
      }
    });
  };

  let filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'institution' && user.is_institution) ||
                         (filterType === 'regular' && !user.is_institution);
    return matchesSearch && matchesFilter;
  });

  filteredUsers = sortUsers(filteredUsers, sortBy);

  const regularUsers = users.filter(u => !u.is_institution).length;
  const institutionUsers = users.filter(u => u.is_institution).length;
  const totalCoins = users.reduce((sum, user) => sum + (user.total_coins || 0), 0);
  const totalGames = users.reduce((sum, user) => sum + (user.games_played || 0), 0);

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
          <p className="user-subtitle">Manage registered users and their game progress</p>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="quick-stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">{users.length}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>
          <div className="quick-stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-content">
              <div className="stat-number">{regularUsers}</div>
              <div className="stat-label">Regular Users</div>
            </div>
          </div>
          <div className="quick-stat-card">
            <div className="stat-icon">🎓</div>
            <div className="stat-content">
              <div className="stat-number">{institutionUsers}</div>
              <div className="stat-label">Institutions</div>
            </div>
          </div>
          <div className="quick-stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-number">{totalCoins}</div>
              <div className="stat-label">Total Coins</div>
            </div>
          </div>
          <div className="quick-stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-content">
              <div className="stat-number">{totalGames}</div>
              <div className="stat-label">Games Played</div>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
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
          
          <div className="filter-controls">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Users</option>
              <option value="regular">Regular Users</option>
              <option value="institution">Institutions</option>
            </select>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="username">Sort by Name</option>
              <option value="level">Sort by Level</option>
              <option value="coins">Sort by Coins</option>
              <option value="games">Sort by Games</option>
              <option value="success_rate">Sort by Success Rate</option>
              <option value="last_played">Sort by Last Played</option>
            </select>
          </div>
          
          <div className="results-count">
            <span className="count-number">{filteredUsers.length}</span>
            <span className="count-label">results</span>
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
                <th>👤 User</th>
                <th>📧 Email</th>
                <th>🎓 Type</th>
                <th>🎮 Level</th>
                <th>💰 Coins</th>
                <th>🎯 Games</th>
                <th>📊 Success</th>
                <th>📅 Last Played</th>
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
                        <span className="user-avatar">
                          {user.is_institution ? '🎓' : '👤'}
                        </span>
                        <span className="username">{user.username}</span>
                      </div>
                    </td>
                    <td className="email-cell">{user.email}</td>
                    <td>
                      {user.is_institution ? (
                        <span className="institution-badge">🎓 Institution</span>
                      ) : (
                        <span className="regular-badge">👤 Regular</span>
                      )}
                    </td>
                    <td>
                      <div className="level-info">
                        <span className="level-number">{user.level_completed || 1}</span>
                        <span className="level-label">/10</span>
                      </div>
                    </td>
                    <td>
                      <div className="coins-info">
                        <span className="coins-icon">💰</span>
                        <span className="coins-number">{user.total_coins || 0}</span>
                      </div>
                    </td>
                    <td>
                      <div className="games-info">
                        <span className="games-number">{user.games_played || 0}</span>
                        <div className="games-details">
                          {user.correct_answers || 0}/{user.total_answers || 0}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="success-rate">
                        <span className={`rate-number ${(user.success_rate || 0) >= 70 ? 'high' : (user.success_rate || 0) >= 50 ? 'medium' : 'low'}`}>
                          {user.success_rate || 0}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="last-played">
                        {user.last_played || 'Never'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="view-button" title="View Details">
                          👁️
                        </button>
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
                  <td colSpan="10" className="no-users">
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