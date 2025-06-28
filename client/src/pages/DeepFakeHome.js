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

            </div>
          </div>
        </nav>
      </header>

      {/* Video Background */}
      <div className="video-background">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="bg-video"
          onError={(e) => console.log('Video error:', e)}
          onLoadStart={() => console.log('Video loading started')}
          onLoadedData={() => console.log('Video loaded successfully')}
        >
          <source src="/sound-waves-bg.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
        </video>
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
                    src={require('../images/audio-detector-logo.png')}
                    alt="DeepFakeAudio Detector"
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

      {/* Footer */}
      <footer className="footer-section">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="footer-about">
                <h5>About DeepFakeAudio</h5>
                <p>
                  In recent years, Deepfake Audio has become a growing threat, blurring the line between real and fake speech. While detection in video and image domains has evolved, identifying fake audio remains difficult. Our goal is to raise awareness and improve detection capabilities using an AI-powered interactive platform that combines education with game-based learning.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="footer-creators">
                <h5>Created By</h5>
                <div className="creator-info">
                                     <div className="creator-card">
                     <div className="creator-image-placeholder">
                       <img src={require('../images/noa-rofe.jpeg')} alt="Noa Rofe" className="creator-img" />
                     </div>
                     <div className="creator-details">
                       <h6>Noa Rofe</h6>
                       <p>Software Engineering Student</p>
                     </div>
                   </div>
                   <div className="creator-card">
                     <div className="creator-image-placeholder">
                       <img src={require('../images/eden-edry.jpeg')} alt="Eden Edry" className="creator-img" />
                     </div>
                     <div className="creator-details">
                       <h6>Eden Edry</h6>
                       <p>Software Engineering Student</p>
                     </div>
                   </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="footer-college">
                <h5>Academic Institution</h5>
                <p>
                  <strong>Sami Shamoon College of Engineering</strong><br/>
                  Be'er Sheva, Israel<br/>
                  Fourth Year – Software Engineering
                </p>
                <div className="project-year">
                  <p><strong>Final Project 2025</strong></p>
                </div>
              </div>
            </div>
          </div>
          <hr className="footer-divider" />
          <div className="row">
            <div className="col-12 text-center">
              <p className="footer-copyright">
                © 2025 DeepFakeAudio Detection System. 
                Developed as a final project by Software Engineering students.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default DeepFakeHome;
