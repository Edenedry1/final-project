import React from 'react';
import ReactDOM from 'react-dom/client'; // שים לב לשימוש ב-react-dom/client
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root')); // יצירת root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
