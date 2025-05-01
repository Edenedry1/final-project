import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';


const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Admin Dashboard</h1>
      <div className="admin-buttons">
        <button onClick={() => navigate('/admin/users')}>👥 Manage Users</button>
        <button onClick={() => navigate('/admin/feedback')}>📝 View Feedback</button>
        <button onClick={() => navigate('/admin/games')}>🎮 Manage Games</button>
        <button onClick={() => navigate('/admin/reports')}>📊 Activity Reports</button>
        <button onClick={() => navigate('/admin/uploads')}>📤 Manage Uploads</button>
        <button onClick={() => navigate('/admin/messages')}>✉️ Send System Messages</button>
        <button onClick={() => navigate('/admin/education')}>📚 Manage Educational Content</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
