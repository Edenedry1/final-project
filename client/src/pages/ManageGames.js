import React, { useState, useEffect } from 'react';
import '../styles/ManageGames.css';
import axios from 'axios';

const ManageGames = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/admin/games');
      setGames(response.data);
    } catch (err) {
      setError('Failed to fetch games.');
      console.error('Error fetching games:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditGame = (gameId) => {
    console.log('Editing game:', gameId);
    // Here you would implement edit functionality
  };

  const handleDeleteGame = (gameId) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      setGames(games.filter(game => game.id !== gameId));
    }
  };

  const handleAddGame = () => {
    console.log('Adding new game...');
    // Here you would implement add game functionality
  };

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalGames = games.length;
  const activeGames = games.filter(game => game.status === 'active').length;

  return (
    <>
      {/* Header */}
      <header data-bs-theme="dark">
        <nav className="navbar">
          <div className="container-fluid">
            <div className="navbar-brand">
              <img src={require('../images/logo.png')} alt="DeepFakeAudio Logo" className="logo" />
              Game Management
            </div>
            <div className="toolbar-icons">
              <a href="/admin">🏠</a>
              <a href="/login">🚪</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Floating decorations */}
      <div className="games-decorations">
        <div className="floating-games-icon" style={{left: '5%', top: '15%', animationDelay: '0s'}}>🎮</div>
        <div className="floating-games-icon" style={{left: '90%', top: '25%', animationDelay: '2s'}}>🎯</div>
        <div className="floating-games-icon" style={{left: '10%', top: '65%', animationDelay: '4s'}}>🏆</div>
        <div className="floating-games-icon" style={{left: '85%', top: '75%', animationDelay: '1s'}}>⚡</div>
        <div className="floating-games-icon" style={{left: '50%', top: '10%', animationDelay: '3s'}}>🎲</div>
      </div>

      <div className="games-container">
        <div className="games-header">
          <h1 className="games-title">🎮 Game Management</h1>
          <p className="games-subtitle">Configure and manage game levels and content</p>
        </div>

        {/* Controls */}
        <div className="games-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Search games by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="games-stats">
            <div className="stat-item">
              <span className="stat-number">{totalGames}</span>
              <span className="stat-label">Total Games</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{activeGames}</span>
              <span className="stat-label">Active Games</span>
            </div>
          </div>
          <button onClick={handleAddGame} className="add-game-button">
            ➕ Add New Game
          </button>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {loading && (
          <div className="loading-message">
            ⏳ Loading games...
          </div>
        )}

        {/* Games Grid */}
        <div className="games-grid">
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <div key={game.id} className="game-card">
                <div className="game-header">
                  <div className="game-icon">🎮</div>
                  <div className="game-status">
                    <span className={`status-badge ${game.status}`}>
                      {game.status === 'active' ? '✅ Active' : '❌ Inactive'}
                    </span>
                  </div>
                </div>

                <div className="game-content">
                  <h3 className="game-name">{game.name}</h3>
                  <div className="game-stats-row">
                    <div className="game-stat">
                      <span className="stat-icon">🎯</span>
                      <span>{game.levels} Levels</span>
                    </div>
                    <div className="game-stat">
                      <span className="stat-icon">👥</span>
                      <span>{game.players} Players</span>
                    </div>
                  </div>
                </div>

                <div className="game-actions">
                  <button 
                    className="edit-game-button"
                    onClick={() => handleEditGame(game.id)}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="delete-game-button"
                    onClick={() => handleDeleteGame(game.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-games">
              <div className="no-games-icon">🎮</div>
              <h3>No games found</h3>
              <p>{searchTerm ? 'No games match your search criteria.' : 'No games have been created yet.'}</p>
              {!searchTerm && (
                <button onClick={handleAddGame} className="add-first-game-button">
                  ➕ Create Your First Game
                </button>
              )}
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

export default ManageGames;
