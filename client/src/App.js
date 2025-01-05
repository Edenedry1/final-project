import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import UserList from './pages/UserList';
import Feedback from './pages/Feedback';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import UploadAudio from './pages/UploadAudio';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/upload" element={<UploadAudio />} />

            </Routes>
        </Router>
    );
};

export default App;
