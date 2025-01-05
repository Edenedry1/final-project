const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 5000;

// Middleware
app.use(express.json());

// התחברות למסד נתונים
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to SQLite:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// דוגמה לנתיב: קריאת נתונים
app.get('/api/data', (req, res) => {
    const sql = 'SELECT * FROM table_name';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

// הרצת השרת
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
