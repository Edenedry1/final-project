const express = require('express');
const router = express.Router();
const db = require('../db');

// רישום משתמש חדש
router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    const query = INSERT INTO users (name, email, password) VALUES (?, ?, ?);
    const params = [name, email, password];

    db.run(query, params, function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ message: 'Email already exists.' });
            }
            return res.status(500).json({ message: 'Error saving user.' });
        }
        res.status(201).json({ message: 'User created successfully!', userId: this.lastID });
    });
});

module.exports = router;