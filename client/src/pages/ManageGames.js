import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const ManageGames = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/games');
      setGames(response.data);
    } catch (err) {
      setError('Failed to fetch games.');
    }
  };

  const handleAddGame = () => {
    // פונקציה שתעביר לדף הוספת משחק חדש
    console.log('Navigate to add new game');
  };

  return (
    <div className="admin-manage-games-container">
      <h1 className="admin-title">🎮 Manage Games</h1>
      <button className="admin-add-button" onClick={handleAddGame}>+ Add New Game</button>
      {error && <p className="error-message">{error}</p>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Game Name</th>
            <th>Levels</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {games.length === 0 ? (
            <tr>
              <td colSpan="4">No games found.</td>
            </tr>
          ) : (
            games.map((game) => (
              <tr key={game.id}>
                <td>{game.id}</td>
                <td>{game.name}</td>
                <td>{game.levels}</td>
                <td>
                  <button className="admin-action-button">Edit</button>
                  <button className="admin-action-button">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageGames;
