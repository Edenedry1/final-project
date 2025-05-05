import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DeepFakeHome from './pages/DeepFakeHome';
import UserList from './pages/UserList';
import Feedback from './pages/Feedback';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import UploadAudio from './pages/UploadAudio';
import Game from './pages/Game'; 
import Level1 from './pages/Level1';
import Level2 from './pages/Level2';
import ManageGames from './pages/ManageGames';
import AdminReports from './pages/AdminReports';
import ManageUploads from './pages/ManageUploads';
import Profile from './pages/Profile';









const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<DeepFakeHome />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/upload" element={<UploadAudio />} />
                <Route path="/Game" element={<Game />} />
                <Route path="/level/1" element={<Level1 />} />
                <Route path="/level/2" element={<Level2 />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin/users" element={<UserList />} />
                <Route path="/admin/feedback" element={<Feedback />} />
                <Route path="/admin/games" element={<ManageGames />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/uploads" element={<ManageUploads />} />









            </Routes>
        </Router>
    );
};

export default App;
