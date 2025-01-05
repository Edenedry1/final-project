import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Feedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        // קריאה לשרת לקבלת הפידבקים
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/feedback');
                setFeedbacks(response.data);
            } catch (error) {
                console.error('Error fetching feedback:', error);
            }
        };

        fetchFeedbacks();
    }, []);

    return (
        <div className="feedback-container">
            <h1>User Feedback</h1>
            {feedbacks.length === 0 ? (
                <p>No feedback available.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Feedback</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map((feedback) => (
                            <tr key={feedback.id}>
                                <td>{feedback.id}</td>
                                <td>{feedback.username || 'Anonymous'}</td>
                                <td>{feedback.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Feedback;
