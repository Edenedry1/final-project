import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/carousel.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const DeepFakeHome = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // React Router hook לניווט

  const handleLogin = () => {
    navigate('/login'); // מעבר לעמוד ה-Login
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

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
                  <a className="nav-link active" aria-current="page" href="/Signup">
                    SignUp
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

      {/* Floating decorations */}
      <div className="home-decorations">
        <div className="floating-audio-home" style={{left: '5%', top: '15%', animationDelay: '0s'}}>🎧</div>
        <div className="floating-audio-home" style={{left: '90%', top: '20%', animationDelay: '2s'}}>🎵</div>
        <div className="floating-audio-home" style={{left: '10%', top: '60%', animationDelay: '4s'}}>🔊</div>
        <div className="floating-audio-home" style={{left: '85%', top: '70%', animationDelay: '1s'}}>🎤</div>
        <div className="floating-audio-home" style={{left: '50%', top: '8%', animationDelay: '3s'}}>📻</div>
        <div className="floating-audio-home" style={{left: '20%', top: '35%', animationDelay: '1.5s'}}>🎶</div>
        <div className="floating-audio-home" style={{left: '75%', top: '45%', animationDelay: '2.5s'}}>🎵</div>
      </div>

      {/* Content */}
      <main>
        {!isLoggedIn ? (
          <div className="container mt-5 text-center">
            <h1 className="mb-4 featurette-heading">Welcome to DeepFakeAudio</h1>
            <p className="mb-4 custom-paragraph">
                Join the revolution in audio analysis! 
                Uncover hidden truths, challenge your skills, and have fun!
            </p>
                <div className="text-center">
                <img
                    src={require('../images/logo.png')}
                    alt="DeepFakeAudio Logo"
                    className="logo-image"
                />
                </div>
            <div className="row">
            <div className="row feature-text">
            <div className="col-md-6 feature-text h3 ">
                <h3>Advanced Technology</h3>
                <p>Use cutting-edge algorithms to detect fake audio with precision.</p>
            </div>
            <div className="col-md-6 feature-text p ">
                <h3>Interactive Challenges</h3>
                <p>Test your skills in an engaging and competitive environment.</p>
            </div>
            </div>
            </div>
            <button className="btn btn-primary btn-lg mt-4" onClick={handleLogin}>
              Start Now
            </button>

          </div>
        ) : (
          <div>
            {/* Carousel */}
            <div
              id="myCarousel"
              className="carousel slide mb-6"
              data-bs-ride="carousel"
            >
              <div className="carousel-indicators">
                <button
                  type="button"
                  data-bs-target="#myCarousel"
                  data-bs-slide-to="0"
                  className="active"
                  aria-current="true"
                  aria-label="Slide 1"
                ></button>
                <button
                  type="button"
                  data-bs-target="#myCarousel"
                  data-bs-slide-to="1"
                  aria-label="Slide 2"
                ></button>
                <button
                  type="button"
                  data-bs-target="#myCarousel"
                  data-bs-slide-to="2"
                  aria-label="Slide 3"
                ></button>
              </div>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <div className="container">
                    <div className="carousel-caption text-start">
                      <h1>Welcome to DeepFakeAudio</h1>
                      <p>
                        Analyze and detect fake audio files using advanced technologies.
                      </p>
                      <p>
                        <a className="btn btn-lg btn-primary" href="#">
                          Get Started
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="container">
                    <div className="carousel-caption">
                      <h1>Challenge Your Skills</h1>
                      <p>
                        Compete with others and see how good you are at spotting fake audio.
                      </p>
                      <p>
                        <a className="btn btn-lg btn-primary" href="#">
                          Learn More
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default DeepFakeHome;
