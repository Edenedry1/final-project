import React, { useEffect, useState } from 'react';
import '../styles/ManageUploads.css';

const ManageUploads = () => {
  const [uploads, setUploads] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // כאן אפשר בעתיד למשוך מהשרת קבצים אמיתיים
    const sampleUploads = [
      { id: 1, fileName: 'audio1.wav', uploadDate: '27/04/2025', status: 'Active' },
      { id: 2, fileName: 'voice_sample.mp3', uploadDate: '28/04/2025', status: 'Pending Review' },
    ];
    setUploads(sampleUploads);
  }, []);

  const handleDelete = (id) => {
    const updatedUploads = uploads.filter(upload => upload.id !== id);
    setUploads(updatedUploads);
  };

  return (

    <div className="uploads-container">
      <h1 className="uploads-title">🗂️ Manage Uploaded Files</h1>
      {error && <p className="error-message">{error}</p>}

      {uploads.length === 0 ? (
        <p className="no-uploads">No uploaded files found.</p>
      ) : (
        <table className="uploads-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>File Name</th>
              <th>Upload Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map(upload => (
              <tr key={upload.id}>
                <td>{upload.id}</td>
                <td>{upload.fileName}</td>
                <td>{upload.uploadDate}</td>
                <td>{upload.status}</td>
                <td>
                  <button className="delete-button" onClick={() => handleDelete(upload.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUploads;
