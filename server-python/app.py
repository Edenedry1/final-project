from flask import Flask, request, jsonify
from flask_cors import CORS
import librosa
import numpy as np
import tensorflow as tf
import os
import sqlite3
import bcrypt

app = Flask(__name__)
CORS(app)

db_path = './users.db'
if not os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    conn.execute('''CREATE TABLE users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT NOT NULL,
                        email TEXT NOT NULL UNIQUE,
                        password TEXT NOT NULL,
                        is_institution INTEGER DEFAULT 0,
                        feedback TEXT DEFAULT ''
                    )''')
    conn.commit()
    conn.close()
    print("Database and tables created successfully.")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(users)")
    columns = [column[1] for column in cursor.fetchall()]
    if "feedback" not in columns:
        cursor.execute("ALTER TABLE users ADD COLUMN feedback TEXT DEFAULT ''")
        conn.commit()
        print("Column 'feedback' added successfully.")
    conn.close()

model_path = './models/model.h5'
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found at {model_path}")

try:
    model = tf.keras.models.load_model(model_path)
    print("Model loaded successfully.")
except Exception as e:
    raise RuntimeError(f"Failed to load model: {str(e)}")

# --------------------------- רישום ---------------------------
@app.route('/api/SignUp', methods=['POST'])
def sign_up():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    is_institution = data.get('is_institution', 0)

    if not username or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (username, email, password, is_institution) VALUES (?, ?, ?, ?)",
                   (username, email, hashed_password, is_institution))
    conn.commit()
    conn.close()

    return jsonify({'message': 'User registered successfully!'}), 201

# --------------------------- התחברות ---------------------------
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
        cursor.execute("SELECT id, username, password FROM users WHERE email = ?", (email,))
        row = cursor.fetchone()
        conn.close()

        if row and bcrypt.checkpw(password.encode('utf-8'), row[2].encode('utf-8')):
            user = {'id': row[0], 'username': row[1], 'email': email}
            return jsonify({'message': 'Login successful', 'user': user}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --------------------------- נתיב משתמשים ---------------------------
@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT id, username, email, is_institution, feedback FROM users")
        users = cursor.fetchall()
        conn.close()

        users_list = [{'id': row[0], 'username': row[1], 'email': row[2], 'is_institution': row[3], 'feedback': row[4]} for row in users]
        return jsonify(users_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/delete_user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
        conn.commit()
        conn.close()

        if cursor.rowcount == 0:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/feedback', methods=['POST'])
def add_feedback():
    try:
        data = request.json
        username = data.get('username')
        message = data.get('message')
        usability_rating = data.get('questionRatings', {}).get('usability', 0)
        design_rating = data.get('questionRatings', {}).get('design', 0)
        performance_rating = data.get('questionRatings', {}).get('performance', 0)

        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute(
            """
            UPDATE users 
            SET feedback = ?, 
                usability_rating = ?, 
                design_rating = ?, 
                performance_rating = ? 
            WHERE username = ?
            """,
            (message, usability_rating, design_rating, performance_rating, username),
        )
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
        cursor.execute("SELECT id, username, password FROM users WHERE email = ?", (email,))
        row = cursor.fetchone()
        conn.close()

        if row and check_password_hash(row[2], password):
            user = {'id': row[0], 'username': row[1], 'email': email}
            return jsonify({'message': 'Login successful', 'user': user}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload', methods=['POST'])
def upload_audio():
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

# --------------------------- פרופיל משתמש ---------------------------
@app.route('/api/profile/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT username, email, is_institution, feedback
            FROM users
            WHERE id = ?
        """, (user_id,))
        row = cursor.fetchone()
        conn.close()

        if row:
            return jsonify({
                'username': row[0],
                'email': row[1],
                'is_institution': row[2],
                'feedback': row[3]
            }), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --------------------------- הרצת השרת ---------------------------

if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=5001, debug=True)
    except Exception as e:
        print(f"Failed to start the server: {str(e)}")