import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <button onClick={() => navigate('/users')}>View Users</button>
            <button onClick={() => navigate('/feedback')}>View Feedback</button>
        </div>
    );
};

export default AdminDashboard;
