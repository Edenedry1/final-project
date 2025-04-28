import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Feedback.css'; // CSS file for styling

const Feedback = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        // Fetch user data with feedback fields
        const response = await axios.get('http://localhost:5001/api/users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch feedback.');
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <>
      {/* Header */}
      <header data-bs-theme="dark">
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <div className="container-fluid">
            <div className="navbar-brand">
              <img
                src={require('../images/logo.png')}
                alt="DeepFakeAudio Logo"
                className="logo"
              />
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

      {/* Feedback Table */}
      <div className="feedback-container">
        <h1 className="featurette-heading">User Feedback</h1>
        {error && <p className="error">{error}</p>}
        {users.length === 0 ? (
          <p>No feedback available.</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>User Email</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email}>
                  <td>{user.email}</td>
            
                  <td>{user.feedback || 'No message provided'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Feedback;