import React, { useState } from 'react';
import '../styles/UploadAudio.css';

const UploadAudio = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await fetch('http://127.0.0.1:5001/api/upload', { // כתובת השרת Flask
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Result: ${data.result}`);
      } else {
        alert('Error analyzing audio.');
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading file.');
    }
  };

  const handleLogout = () => {
    // לוגיקה להתנתקות
    console.log('Logged out');
    window.location.href = '/login'; // לדוגמה, ניווט לדף התחברות
  };

  return (
    <div className="upload-container">
      {/* כפתור התנתקות קטן בצד ימין למעלה */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      {/* תוכן העמוד */}
      <h1>Upload Audio for Analysis</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*" onChange={handleFileChange} required />
        <button type="submit">Upload and Analyze</button>
      </form>
    </div>
  );
};

export default UploadAudio;
