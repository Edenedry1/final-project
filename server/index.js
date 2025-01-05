const express = require('express');
const cors = require('cors');
const connectDB = require('./db'); // ייבוא קובץ החיבור ל-SQLite

const app = express();
const db = connectDB(); // התחברות ל-SQLite

app.use(cors());
app.use(express.json());

// נתיב לרישום משתמש חדש
app.post('/api/users/signup', (req, res) => {
    const { name, email, password } = req.body;

    const query = INSERT INTO users (name, email, password) VALUES (?, ?, ?);
    db.run(query, [name, email, password], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                res.status(400).json({ message: 'Email already exists.' });
            } else {
                res.status(500).json({ message: 'Error creating user.' });
            }
        } else {
            res.status(201).json({ message: 'User created successfully!', id: this.lastID });
        }
    });
});

// נתיב לקבלת כל המשתמשים
app.get('/api/users', (req, res) => {
    db.all(SELECT id, name, email FROM users, [], (err, rows) => {
        if (err) {
            res.status(500).json({ message: 'Error fetching users.' });
        } else {
            res.status(200).json(rows);
        }
    });
});

// הפעלת השרת
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});