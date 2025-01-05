import axios from 'axios';

// עדכון הכתובת לשרת Flask
const API = axios.create({ baseURL: 'http://127.0.0.1:5001' });

// פונקציה להעלאת קובץ שמע
export const uploadAudio = (audioFile) => {
    const formData = new FormData();
    formData.append('audio', audioFile);

    return API.post('/api/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
