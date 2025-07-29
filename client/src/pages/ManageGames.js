import React, { useState, useEffect } from 'react';
import '../styles/ManageGames.css';
import axios from 'axios';

const ManageGames = () => {
  const [levels, setLevels] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLevel, setNewLevel] = useState({
    levelNumber: '',
    difficulty: 'Easy',
    description: '',
    requiredAccuracy: 70
  });

  // Initialize with default levels 1-10
  const defaultLevels = [
    { id: 1, levelNumber: 1, difficulty: 'Easy', description: 'Introduction to audio detection', totalPlayers: 245, successfulPlayers: 196, requiredAccuracy: 60 },
    { id: 2, levelNumber: 2, difficulty: 'Easy', description: 'Basic fake audio identification', totalPlayers: 198, successfulPlayers: 158, requiredAccuracy: 65 },
    { id: 3, levelNumber: 3, difficulty: 'Medium', description: 'Mixed audio challenges', totalPlayers: 167, successfulPlayers: 125, requiredAccuracy: 70 },
    { id: 4, levelNumber: 4, difficulty: 'Medium', description: 'Advanced real audio detection', totalPlayers: 142, successfulPlayers: 99, requiredAccuracy: 75 },
    { id: 5, levelNumber: 5, difficulty: 'Medium', description: 'Sophisticated fake audio', totalPlayers: 123, successfulPlayers: 80, requiredAccuracy: 75 },
    { id: 6, levelNumber: 6, difficulty: 'Hard', description: 'Complex mixed scenarios', totalPlayers: 98, successfulPlayers: 59, requiredAccuracy: 80 },
    { id: 7, levelNumber: 7, difficulty: 'Hard', description: 'High-quality fake detection', totalPlayers: 76, successfulPlayers: 42, requiredAccuracy: 85 },
    { id: 8, levelNumber: 8, difficulty: 'Expert', description: 'Professional level challenges', totalPlayers: 54, successfulPlayers: 27, requiredAccuracy: 85 },
    { id: 9, levelNumber: 9, difficulty: 'Expert', description: 'Master-level detection', totalPlayers: 32, successfulPlayers: 13, requiredAccuracy: 90 },
    { id: 10, levelNumber: 10, difficulty: 'Master', description: 'Ultimate challenge', totalPlayers: 18, successfulPlayers: 5, requiredAccuracy: 95 }
  ];

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      // For now, use default levels. In the future, this could fetch from API
      setLevels(defaultLevels);
    } catch (err) {
      setError('Failed to fetch levels.');
      console.error('Error fetching levels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditLevel = (levelId) => {
    console.log('Editing level:', levelId);
    // Here you would implement edit functionality
  };

  const handleDeleteLevel = (levelId, levelNumber) => {
    if (window.confirm(`Are you sure you want to delete Level ${levelNumber}? This action cannot be undone.`)) {
      setLevels(levels.filter(level => level.id !== levelId));
    }
  };

  const handleAddLevel = () => {
    setShowAddForm(true);
  };

  const handleSubmitNewLevel = () => {
    if (!newLevel.levelNumber || !newLevel.description) {
      setError('Please fill in all required fields.');
      return;
    }

    const levelExists = levels.find(level => level.levelNumber === parseInt(newLevel.levelNumber));
    if (levelExists) {
      setError('A level with this number already exists.');
      return;
    }

    const newLevelData = {
      id: Math.max(...levels.map(l => l.id), 0) + 1,
      levelNumber: parseInt(newLevel.levelNumber),
      difficulty: newLevel.difficulty,
      description: newLevel.description,
      totalPlayers: 0,
      successfulPlayers: 0,
      requiredAccuracy: parseInt(newLevel.requiredAccuracy)
    };

    setLevels([...levels, newLevelData].sort((a, b) => a.levelNumber - b.levelNumber));
    setNewLevel({
      levelNumber: '',
      difficulty: 'Easy',
      description: '',
      requiredAccuracy: 70
    });
    setShowAddForm(false);
    setError('');
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewLevel({
      levelNumber: '',
      difficulty: 'Easy',
      description: '',
      requiredAccuracy: 70
    });
    setError('');
  };

  const filteredLevels = levels.filter(level =>
    level.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    level.difficulty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    level.levelNumber.toString().includes(searchTerm)
  );

  const totalLevels = levels.length;
  const totalPlayers = levels.reduce((sum, level) => sum + level.totalPlayers, 0);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      case 'Expert': return '#8b5cf6';
      case 'Master': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getSuccessRate = (successful, total) => {
    if (total === 0) return 0;
    return Math.round((successful / total) * 100);
  };

  return (
    <>
      {/* Header */}
      <header data-bs-theme="dark">
        <nav className="navbar">
          <div className="container-fluid">
            <div className="navbar-brand">
              <img src={require('../images/audio-detector-logo.png')} alt="DeepFakeAudio Logo" className="logo" />
              Level Management
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
        <div className="floating-games-icon" style={{left: '5%', top: '15%', animationDelay: '0s'}}>🎵</div>
        <div className="floating-games-icon" style={{left: '90%', top: '25%', animationDelay: '2s'}}>🎯</div>
        <div className="floating-games-icon" style={{left: '10%', top: '65%', animationDelay: '4s'}}>🏆</div>
        <div className="floating-games-icon" style={{left: '85%', top: '75%', animationDelay: '1s'}}>🎧</div>
        <div className="floating-games-icon" style={{left: '50%', top: '10%', animationDelay: '3s'}}>🔊</div>
        <div className="floating-games-icon" style={{left: '20%', top: '40%', animationDelay: '5s'}}>🎤</div>
        <div className="floating-games-icon" style={{left: '75%', top: '50%', animationDelay: '2.5s'}}>📻</div>
      </div>

      <div className="games-container">
        <div className="games-header">
          <h1 className="games-title">🎯 Level Management</h1>
          <p className="games-subtitle">Configure and manage Deepfake Audio Detection game levels</p>
        </div>

        {/* Controls */}
        <div className="games-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Search levels by description, difficulty or number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="games-stats">
            <div className="stat-item">
              <span className="stat-number">{totalLevels}</span>
              <span className="stat-label">Total Levels</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{totalPlayers}</span>
              <span className="stat-label">Total Players</span>
            </div>
          </div>
          <button onClick={handleAddLevel} className="add-game-button">
            ➕ Add New Level
          </button>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {loading && (
          <div className="loading-message">
            ⏳ Loading levels...
          </div>
        )}

        {/* Games Grid */}
        <div className="games-grid">
          {filteredLevels.length > 0 ? (
            filteredLevels.map((level) => (
                             <div key={level.id} className="game-card">
                 <div className="game-header">
                   <div className="game-icon">
                     <span className="level-number-badge">Level {level.levelNumber}</span>
                   </div>
                 </div>

                                  <div className="game-content">
                   <h3 className="game-name">{level.description}</h3>
                   
                   <div className="level-difficulty">
                     <span className="difficulty-label">Difficulty:</span>
                     <span className="difficulty-value" style={{color: getDifficultyColor(level.difficulty)}}>
                       {level.difficulty}
                     </span>
                   </div>
                   
                   <div className="level-stats">
                     <div className="stat-row">
                       <span className="stat-label">👥 Players:</span>
                       <span className="stat-value">{level.totalPlayers}</span>
                     </div>
                     <div className="stat-row">
                       <span className="stat-label">✅ Succeeded:</span>
                       <span className="stat-value success-rate">
                         {level.successfulPlayers} ({getSuccessRate(level.successfulPlayers, level.totalPlayers)}%)
                       </span>
                     </div>
                   </div>
                 </div>

                 <div className="game-actions">
                   <button 
                     className="delete-game-button"
                     onClick={() => handleDeleteLevel(level.id, level.levelNumber)}
                   >
                     🗑️ Delete Level
                   </button>
                 </div>
              </div>
            ))
                     ) : (
             <div className="no-games">
               <div className="no-games-icon">🎯</div>
               <h3>No Levels Found</h3>
               <p>{searchTerm ? 'No levels found that match your search.' : 'No levels have been created yet.'}</p>
               {!searchTerm && (
                 <button onClick={handleAddLevel} className="add-first-game-button">
                   ➕ Create Your First Level
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

             {/* Add Level Form */}
       {showAddForm && (
         <div className="add-level-form">
           <h2>Add New Level</h2>
           <input
             type="number"
             placeholder="Level Number"
             value={newLevel.levelNumber}
             onChange={(e) => setNewLevel({ ...newLevel, levelNumber: e.target.value })}
             className="level-input"
           />
           <input
             type="text"
             placeholder="Level Description"
             value={newLevel.description}
             onChange={(e) => setNewLevel({ ...newLevel, description: e.target.value })}
             className="level-input"
           />
           <select
             value={newLevel.difficulty}
             onChange={(e) => setNewLevel({ ...newLevel, difficulty: e.target.value })}
             className="level-input"
           >
             <option value="Easy">Easy</option>
             <option value="Medium">Medium</option>
             <option value="Hard">Hard</option>
             <option value="Expert">Expert</option>
             <option value="Master">Master</option>
           </select>
           <input
             type="number"
             placeholder="Required Accuracy (%)"
             value={newLevel.requiredAccuracy}
             onChange={(e) => setNewLevel({ ...newLevel, requiredAccuracy: e.target.value })}
             className="level-input"
             min="0"
             max="100"
           />
           <div className="button-container">
             <button onClick={handleSubmitNewLevel} className="submit-button">
               ➕ Add Level
             </button>
             <button onClick={handleCancelAdd} className="cancel-button">
               ➖ Cancel
             </button>
           </div>
         </div>
       )}
    </>
  );
};

export default ManageGames;
