import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css'; // קובץ CSS מותאם

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <>
            {/* Header */}
            <header data-bs-theme="dark">
                <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                    <div className="container-fluid">
                        <div className="navbar-brand" href="#">
                            <img src={require('../images/logo.png')} alt="DeepFakeAudio Logo" className="logo" />
                            DeepFakeAudio
                        </div>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarCollapse"
                            aria-controls="navbarCollapse"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarCollapse">
                            <ul className="navbar-nav me-auto mb-2 mb-md-0">
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="/">
                                        Logout
                                    </a>
                                </li>
                            </ul>
                            <form className="d-flex" role="search">
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                />
                                <button className="btn btn-outline-success" type="submit">
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="container mt-5 text-center">
                <h1 className="mb-4 featurette-heading">Admin Dashboard</h1>
                <div className="admin-buttons-container">
                    <button className="btn admin-button" onClick={() => navigate('/users')}>
                        View Users
                    </button>
                    <button className="btn admin-button" onClick={() => navigate('/feedback')}>
                        View Feedback
                    </button>
                </div>
            </main>
        </>
    );
};

export default AdminDashboard;