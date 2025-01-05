from flask import Flask, request, jsonify
from flask_cors import CORS
import librosa
import numpy as np
import tensorflow as tf
import os
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)  # מאפשר בקשות מ-Frontend

# התחברות למסד הנתונים
db_path = './users.db'
if not os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    conn.execute('''CREATE TABLE users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT NOT NULL,
                        email TEXT NOT NULL UNIQUE,
                        password TEXT NOT NULL,
                        is_institution INTEGER DEFAULT 0
                    )''')
    conn.execute('''CREATE TABLE feedback (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT NOT NULL,
                        message TEXT NOT NULL
                    )''')
    conn.commit()
    conn.close()
    print("Database and tables created successfully.")
else:
    # בדיקה אם העמודה is_institution קיימת
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(users)")
    columns = [column[1] for column in cursor.fetchall()]
    if "is_institution" not in columns:
        cursor.execute("ALTER TABLE users ADD COLUMN is_institution INTEGER DEFAULT 0")
        conn.commit()
        print("Column 'is_institution' added successfully.")
    conn.close()

# בדיקת קיום קובץ המודל
model_path = './models/model.h5'
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found at {model_path}")

# טען מודל מאומן
try:
    model = tf.keras.models.load_model(model_path)
    print("Model loaded successfully.")
except Exception as e:
    raise RuntimeError(f"Failed to load model: {str(e)}")

@app.route('/api/SignUp', methods=['POST'])
def sign_up():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    is_institution = data.get('is_institution', 0)  # ברירת מחדל היא 0 אם לא נשלח ערך

    if not username or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    hashed_password = generate_password_hash(password)  # הצפנת סיסמה

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (username, email, password, is_institution) VALUES (?, ?, ?, ?)",
                   (username, email, hashed_password, is_institution))
    conn.commit()
    conn.close()

    return jsonify({'message': 'User registered successfully!'}), 201
    
@app.route('/api/users', methods=['GET'])
def get_users():
    """
    נתיב להחזרת רשימת המשתמשים הרשומים במערכת.
    """
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT id, username, email, is_institution FROM users")
        users = cursor.fetchall()
        conn.close()

        users_list = [{'id': row[0], 'username': row[1], 'email': row[2], 'is_institution': row[3]} for row in users]
        return jsonify(users_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/feedback', methods=['GET'])
def get_feedback():
    """
    נתיב להחזרת רשימת הפידבקים.
    """
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT id, username, message FROM feedback")
        feedbacks = cursor.fetchall()
        conn.close()

        feedback_list = [{'id': row[0], 'username': row[1], 'message': row[2]} for row in feedbacks]
        return jsonify(feedback_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/feedback', methods=['POST'])
def add_feedback():
    """
    נתיב להוספת פידבק חדש.
    """
    try:
        data = request.json
        username = data.get('username', 'Anonymous')
        message = data.get('message')

        if not message:
            return jsonify({'error': 'Message is required'}), 400

        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO feedback (username, message) VALUES (?, ?)", (username, message))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Feedback submitted successfully!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT password FROM users WHERE email = ?", (email,))
        row = cursor.fetchone()
        conn.close()

        if row and check_password_hash(row[0], password):
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload', methods=['POST'])
def upload_audio():
    """
    נתיב להעלאת קובץ אודיו וניתוחו באמצעות המודל.
    """
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file uploaded'}), 400

    file = request.files['audio']

    try:
        y, sr = librosa.load(file, sr=16000)

        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        mfcc_scaled = np.mean(mfcc.T, axis=0)

        input_data = np.expand_dims(mfcc_scaled, axis=0)

        prediction = model.predict(input_data)
        result = 'Fake' if prediction[0][0] > 0.5 else 'Real'

        return jsonify({'result': result}), 200
    except librosa.util.exceptions.ParameterError as librosa_error:
        return jsonify({'error': f"Librosa processing error: {str(librosa_error)}"}), 500
    except Exception as e:
        return jsonify({'error': f"Failed to process audio file: {str(e)}"}), 500

if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=5001, debug=True)
    except Exception as e:
        print(f"Failed to start the server: {str(e)}")
