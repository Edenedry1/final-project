import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DeepFakeHome from './pages/DeepFakeHome';
import AdminDashboard from './pages/AdminDashboard';
import UserList from './pages/UserList';
import Feedback from './pages/Feedback';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import UploadAudio from './pages/UploadAudio';
import Game from './pages/Game'; 
import Level1 from './pages/Level1';
import Level2 from './pages/Level2';
import Level3 from './pages/Level3';
import Level4 from './pages/Level4';
import Level5 from './pages/Level5';
import Level6 from './pages/Level6';
import Level7 from './pages/Level7';
import Level8 from './pages/Level8';
import Level9 from './pages/Level9';
import Level10 from './pages/Level10';
import ManageGames from './pages/ManageGames';
import AdminReports from './pages/AdminReports';
import ManageUploads from './pages/ManageUploads';
import Profile from './pages/Profile';









const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<DeepFakeHome />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/upload" element={<UploadAudio />} />
                <Route path="/Game" element={<Game />} />
                <Route path="/level/1" element={<Level1 />} />
                <Route path="/level/2" element={<Level2 />} />
                <Route path="/level/3" element={<Level3 />} />
                <Route path="/level/4" element={<Level4 />} />
                <Route path="/level/5" element={<Level5 />} />
                <Route path="/level/6" element={<Level6 />} />
                <Route path="/level/7" element={<Level7 />} />
                <Route path="/level/8" element={<Level8 />} />
                <Route path="/level/9" element={<Level9 />} />
                <Route path="/level/10" element={<Level10 />} />
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
