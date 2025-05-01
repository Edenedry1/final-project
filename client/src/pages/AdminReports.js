import React, { useEffect, useState } from 'react';
import '../styles/AdminReports.css';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import axios from 'axios';

const AdminReports = () => {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [gameCount, setGameCount] = useState(0);
  const [completedLevels, setCompletedLevels] = useState(0);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      // כאן את יכולה לשדרג מאוחר יותר לקריאות אמיתיות ל-API
      const usersResponse = await axios.get('http://localhost:5001/api/users');
      setUserCount(usersResponse.data.length);

      // כרגע, מספר המשחקים והשלבים דמיוני
      setGameCount(1); 
      setCompletedLevels(23); 
    } catch (err) {
      console.error('Error fetching reports', err);
    }
  };

  return (
    <div className="admin-reports-container">
      <header className="neon-navbar">
        <img src={logo} alt="Logo" className="neon-logo enlarged-logo" onClick={() => navigate('/admin')} />
      </header>

      <h1 className="reports-title">📊 System Activity Reports</h1>

      <div className="reports-grid">
        <div className="report-card">
          <h2>🧑‍💻 Users</h2>
          <p>{userCount}</p>
        </div>

        <div className="report-card">
          <h2>🕹️ Games</h2>
          <p>{gameCount}</p>
        </div>

        <div className="report-card">
          <h2>🎯 Completed Levels</h2>
          <p>{completedLevels}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;