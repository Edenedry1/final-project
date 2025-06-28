from flask import Flask, request, jsonify
from flask_cors import CORS
import librosa
import numpy as np
import tensorflow as tf
import os
import sqlite3
import bcrypt
import joblib

app = Flask(__name__)
CORS(app)

# ------------------ יצירת DB ------------------
db_path = './users.db'
if not os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    conn.execute('''CREATE TABLE users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT NOT NULL,
                        email TEXT NOT NULL UNIQUE,
                        password TEXT NOT NULL,
                        is_institution INTEGER DEFAULT 0,
                        feedback TEXT DEFAULT '',
                        level_completed INTEGER DEFAULT 1,
                        total_coins INTEGER DEFAULT 0,
                        games_played INTEGER DEFAULT 0,
                        correct_answers INTEGER DEFAULT 0,
                        total_answers INTEGER DEFAULT 0,
                        last_played TEXT DEFAULT '',
                        usability_rating INTEGER DEFAULT 0,
                        design_rating INTEGER DEFAULT 0,
                        performance_rating INTEGER DEFAULT 0
                    )''')
    conn.commit()
    conn.close()
    print("✅ Database created.")
else:
    # Check and add missing columns
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(users)")
    existing_columns = [c[1] for c in cursor.fetchall()]
    
    # Add missing columns
    new_columns = [
        ('feedback', 'TEXT DEFAULT ""'),
        ('level_completed', 'INTEGER DEFAULT 1'),
        ('total_coins', 'INTEGER DEFAULT 0'),
        ('games_played', 'INTEGER DEFAULT 0'),
        ('correct_answers', 'INTEGER DEFAULT 0'),
        ('total_answers', 'INTEGER DEFAULT 0'),
        ('last_played', 'TEXT DEFAULT ""'),
        ('usability_rating', 'INTEGER DEFAULT 0'),
        ('design_rating', 'INTEGER DEFAULT 0'),
        ('performance_rating', 'INTEGER DEFAULT 0')
    ]
    
    for column_name, column_def in new_columns:
        if column_name not in existing_columns:
            cursor.execute(f"ALTER TABLE users ADD COLUMN {column_name} {column_def}")
            print(f"✅ Column {column_name} added.")
    
    conn.commit()
    conn.close()

# Add sample users with realistic game data if database is new/empty
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute("SELECT COUNT(*) FROM users")
user_count = cursor.fetchone()[0]

if user_count < 5:  # Add sample users if less than 5 exist
    print("🎮 Adding sample users with game data...")
    
    # Sample users with realistic data
    sample_users = [
        # Regular users
        {
            'username': 'alex_gamer',
            'email': 'alex@gmail.com',
            'password': bcrypt.hashpw('password123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            'is_institution': 0,
            'level_completed': 7,
            'total_coins': 890,
            'games_played': 45,
            'correct_answers': 28,
            'total_answers': 45,
            'last_played': '2024-01-15',
            'feedback': 'Amazing game! Really helps me understand deepfake detection.',
            'usability_rating': 5,
            'design_rating': 4,
            'performance_rating': 5
        },
        {
            'username': 'sarah_detective',
            'email': 'sarah.jones@hotmail.com',
            'password': bcrypt.hashpw('mypassword'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            'is_institution': 0,
            'level_completed': 4,
            'total_coins': 425,
            'games_played': 28,
            'correct_answers': 18,
            'total_answers': 28,
            'last_played': '2024-01-18',
            'feedback': 'Great learning tool, but some levels are really challenging!',
            'usability_rating': 4,
            'design_rating': 5,
            'performance_rating': 4
        },
        {
            'username': 'mike_audio_pro',
            'email': 'mike.anderson@audiotech.com',
            'password': bcrypt.hashpw('professional2024'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            'is_institution': 0,
            'level_completed': 10,
            'total_coins': 1650,
            'games_played': 75,
            'correct_answers': 68,
            'total_answers': 75,
            'last_played': '2024-01-20',
            'feedback': 'Excellent tool for audio professionals. The AI detection is very accurate.',
            'usability_rating': 5,
            'design_rating': 5,
            'performance_rating': 5
        },
        {
            'username': 'student_jenny',
            'email': 'jenny.kim@student.university.edu',
            'password': bcrypt.hashpw('student123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            'is_institution': 0,
            'level_completed': 3,
            'total_coins': 180,
            'games_played': 15,
            'correct_answers': 9,
            'total_answers': 15,
            'last_played': '2024-01-17',
            'feedback': 'This is helping me with my cybersecurity course project!',
            'usability_rating': 4,
            'design_rating': 4,
            'performance_rating': 3
        },
        {
            'username': 'curious_learner',
            'email': 'learner2024@yahoo.com',
            'password': bcrypt.hashpw('learning123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            'is_institution': 0,
            'level_completed': 6,
            'total_coins': 720,
            'games_played': 38,
            'correct_answers': 24,
            'total_answers': 38,
            'last_played': '2024-01-19',
            'feedback': 'Love the progressive difficulty! Each level teaches something new.',
            'usability_rating': 5,
            'design_rating': 4,
            'performance_rating': 4
        },
        # Educational institutions
        {
            'username': 'MIT_AI_Lab',
            'email': 'ai.research@mit.edu',
            'password': bcrypt.hashpw('mitresearch2024'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            'is_institution': 1,
            'level_completed': 10,
            'total_coins': 1980,
            'games_played': 120,
            'correct_answers': 105,
            'total_answers': 120,
            'last_played': '2024-01-20',
            'feedback': 'Excellent educational tool for our AI detection research. Using it in our curriculum.',
            'usability_rating': 5,
            'design_rating': 5,
            'performance_rating': 5
        },
        {
            'username': 'Stanford_CS_Dept',
            'email': 'cs.education@stanford.edu',
            'password': bcrypt.hashpw('stanford2024'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            'is_institution': 1,
            'level_completed': 8,
            'total_coins': 1340,
            'games_played': 85,
            'correct_answers': 72,
            'total_answers': 85,
            'last_played': '2024-01-18',
            'feedback': 'Perfect for teaching students about deepfake detection. The hint system is very helpful.',
            'usability_rating': 5,
            'design_rating': 4,
            'performance_rating': 5
        },
        {
            'username': 'TechHigh_School',
            'email': 'tech.education@techhigh.edu',
            'password': bcrypt.hashpw('education123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            'is_institution': 1,
            'level_completed': 5,
            'total_coins': 625,
            'games_played': 40,
            'correct_answers': 28,
            'total_answers': 40,
            'last_played': '2024-01-16',
            'feedback': 'Our students love this! Great way to teach media literacy and AI awareness.',
            'usability_rating': 4,
            'design_rating': 5,
            'performance_rating': 4
        },
        {
            'username': 'UCLA_Media_Studies',
            'email': 'media.lab@ucla.edu',
            'password': bcrypt.hashpw('ucla2024media'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            'is_institution': 1,
            'level_completed': 9,
            'total_coins': 1545,
            'games_played': 95,
            'correct_answers': 81,
            'total_answers': 95,
            'last_played': '2024-01-19',
            'feedback': 'Integrating this into our digital media literacy curriculum. Students find it engaging and educational.',
            'usability_rating': 5,
            'design_rating': 5,
            'performance_rating': 4
        },
        {
            'username': 'CyberSec_Academy',
            'email': 'training@cybersecacademy.org',
            'password': bcrypt.hashpw('cybersec2024'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            'is_institution': 1,
            'level_completed': 10,
            'total_coins': 1890,
            'games_played': 110,
            'correct_answers': 98,
            'total_answers': 110,
            'last_played': '2024-01-20',
            'feedback': 'Essential training tool for cybersecurity professionals. The progressive difficulty is perfect for skill building.',
            'usability_rating': 5,
            'design_rating': 4,
            'performance_rating': 5
        }
    ]
    
    for user in sample_users:
        try:
            cursor.execute("""
                INSERT INTO users (username, email, password, is_institution, level_completed, 
                                 total_coins, games_played, correct_answers, total_answers, 
                                 last_played, feedback, usability_rating, design_rating, performance_rating)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                user['username'], user['email'], user['password'], user['is_institution'],
                user['level_completed'], user['total_coins'], user['games_played'],
                user['correct_answers'], user['total_answers'], user['last_played'],
                user['feedback'], user['usability_rating'], user['design_rating'], user['performance_rating']
            ))
            print(f"✅ Added user: {user['username']}")
        except sqlite3.IntegrityError:
            print(f"⚠️ User {user['username']} already exists, skipping...")
            
    conn.commit()
    print("🎉 Sample users with game data added successfully!")

conn.close()

# ------------------ טעינת מודל וסקלר ------------------
model_path = './models/model.h5'
scaler_path = './scaler.save'

if not os.path.exists(model_path):
    raise FileNotFoundError(f"❌ Model file not found at {model_path}")
if not os.path.exists(scaler_path):
    raise FileNotFoundError(f"❌ Scaler file not found at {scaler_path}")

model = tf.keras.models.load_model(model_path)
scaler = joblib.load(scaler_path)
print("✅ Model and scaler loaded.")

# ------------------ יצירת תיקיית העלאות ------------------
os.makedirs("uploads", exist_ok=True)

# ------------------ רישום ------------------
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

# ------------------ התחברות ------------------
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
        cursor.execute("SELECT id, username, password, is_institution FROM users WHERE email = ?", (email,))
        row = cursor.fetchone()
        conn.close()

        if not row:
            return jsonify({'error': 'Invalid email or password'}), 401

        stored_password = row[2]
        try:
            # Check if the password needs to be encoded
            if not isinstance(stored_password, bytes):
                stored_password = stored_password.encode('utf-8')
            if not isinstance(password, bytes):
                password = password.encode('utf-8')

            if bcrypt.checkpw(password, stored_password):
                user = {
                    'id': row[0],
                    'username': row[1],
                    'email': email,
                    'is_institution': row[3]
                }
                return jsonify({'message': 'Login successful', 'user': user}), 200
            else:
                return jsonify({'error': 'Invalid email or password'}), 401
        except Exception as e:
            print(f"Error checking password: {str(e)}")
            return jsonify({'error': 'Error checking password'}), 500

    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# ------------------ משוב ------------------
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
        cursor.execute("""
            UPDATE users 
            SET feedback = ?, 
                usability_rating = ?, 
                design_rating = ?, 
                performance_rating = ? 
            WHERE username = ?
        """, (message, usability_rating, design_rating, performance_rating, username))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Feedback submitted successfully!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ------------------ העלאת קובץ שמע ------------------
@app.route('/api/upload', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file uploaded'}), 400

    file = request.files['audio']
    filename = file.filename
    save_path = os.path.join("uploads", filename)

    try:
        # Save the uploaded file
        file.save(save_path)
        print(f"✅ Saved file to: {save_path}")
        print(f"📁 File size: {os.path.getsize(save_path)} bytes")

        print(f"🔍 Attempting to load audio...")
        try:
            y, sr = librosa.load(save_path, sr=16000)
            print(f"📈 Audio loaded: duration={len(y)/sr:.2f}s, sr={sr}, shape={y.shape}")
        except Exception as e:
            print(f"❌ Error loading audio with librosa: {str(e)}")
            return jsonify({'error': f'Error loading audio: {str(e)}'}), 500

        try:
            # Extract features
            mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
            print(f"✅ MFCC extracted: shape={mfcc.shape}")
            mfcc_mean = np.mean(mfcc, axis=1)
            mfcc_std = np.std(mfcc, axis=1)
            
            # Spectral features
            spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
            spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)[0]
            spectral_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
            print(f"✅ Spectral features extracted")
            
            # Combine all features
            features = np.concatenate([
                mfcc_mean,                              # 20 features
                mfcc_std,                               # 20 features
                [np.mean(spectral_centroid)],           # 1 feature
                [np.std(spectral_centroid)],            # 1 feature
                [np.mean(spectral_rolloff)],            # 1 feature
                [np.std(spectral_rolloff)],             # 1 feature
                np.mean(spectral_contrast, axis=1),     # 7 features
                np.std(spectral_contrast, axis=1)       # 7 features
            ]).reshape(1, -1)
            print(f"✅ Features combined: shape={features.shape}")

            # Scale features
            features_scaled = scaler.transform(features)
            print(f"✅ Features scaled")

            # Make prediction
            prediction = model.predict(features_scaled)
            confidence = float(prediction[0][0])
            print(f"✅ Raw prediction value: {confidence}")
            
            # Adjust threshold based on validation results
            threshold = 0.5
            result = 'Fake' if confidence > threshold else 'Real'
            
            # Calculate confidence percentage
            confidence_percent = confidence * 100 if confidence > threshold else (1 - confidence) * 100
            # Make sure confidence is between 0 and 100
            confidence_percent = min(100, max(0, confidence_percent))

            print(f"🧠 Raw prediction: {confidence:.4f}")
            print(f"🎯 Threshold: {threshold}")
            print(f"📊 Classified as: {result} with {confidence_percent:.2f}% confidence")

            return jsonify({
                'result': result,
                'confidence': round(confidence_percent, 2)  # רק 2 ספרות אחרי הנקודה
            }), 200

        except Exception as e:
            print(f"❌ Error during feature extraction or prediction: {str(e)}")
            return jsonify({'error': f'Error processing audio: {str(e)}'}), 500

    except Exception as e:
        print(f"❌ Error analyzing audio: {str(e)}")
        return jsonify({'error': str(e)}), 500

# ------------------ הצגת משתמשים ------------------
@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, username, email, is_institution, feedback, level_completed, 
                   total_coins, games_played, correct_answers, total_answers, 
                   last_played, usability_rating, design_rating, performance_rating
            FROM users
        """)
        users = cursor.fetchall()
        conn.close()

        users_list = []
        for row in users:
            # Calculate success rate
            success_rate = (row[8] / row[9] * 100) if row[9] > 0 else 0  # correct_answers / total_answers * 100
            
            users_list.append({
                'id': row[0],
                'username': row[1],
                'email': row[2],
                'is_institution': row[3],
                'feedback': row[4],
                'level_completed': row[5],
                'total_coins': row[6],
                'games_played': row[7],
                'correct_answers': row[8],
                'total_answers': row[9],
                'success_rate': round(success_rate, 1),
                'last_played': row[10],
                'usability_rating': row[11],
                'design_rating': row[12],
                'performance_rating': row[13]
            })
        return jsonify(users_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ------------------ מחיקת משתמש ------------------
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

# ------------------ סטטיסטיקות כלליות ------------------
@app.route('/api/admin/stats', methods=['GET'])
def get_admin_stats():
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Total users
        cursor.execute("SELECT COUNT(*) FROM users")
        total_users = cursor.fetchone()[0]
        
        # Regular vs Institution users
        cursor.execute("SELECT COUNT(*) FROM users WHERE is_institution = 0")
        regular_users = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM users WHERE is_institution = 1")
        institution_users = cursor.fetchone()[0]
        
        # Total games played
        cursor.execute("SELECT SUM(games_played) FROM users")
        total_games = cursor.fetchone()[0] or 0
        
        # Total coins earned
        cursor.execute("SELECT SUM(total_coins) FROM users")
        total_coins = cursor.fetchone()[0] or 0
        
        # Average success rate
        cursor.execute("SELECT AVG(CASE WHEN total_answers > 0 THEN correct_answers * 100.0 / total_answers ELSE 0 END) FROM users")
        avg_success_rate = cursor.fetchone()[0] or 0
        
        # Top performers
        cursor.execute("""
            SELECT username, level_completed, total_coins, 
                   CASE WHEN total_answers > 0 THEN correct_answers * 100.0 / total_answers ELSE 0 END as success_rate
            FROM users 
            WHERE total_answers > 0
            ORDER BY level_completed DESC, total_coins DESC 
            LIMIT 5
        """)
        top_performers = cursor.fetchall()
        
        # Recent activity
        cursor.execute("""
            SELECT username, last_played, level_completed, total_coins
            FROM users 
            WHERE last_played != ''
            ORDER BY last_played DESC 
            LIMIT 10
        """)
        recent_activity = cursor.fetchall()
        
        # Feedback stats
        cursor.execute("SELECT AVG(usability_rating), AVG(design_rating), AVG(performance_rating) FROM users WHERE usability_rating > 0")
        avg_ratings = cursor.fetchone()
        
        conn.close()
        
        return jsonify({
            'total_users': total_users,
            'regular_users': regular_users,
            'institution_users': institution_users,
            'total_games': total_games,
            'total_coins': total_coins,
            'avg_success_rate': round(avg_success_rate, 1),
            'avg_usability_rating': round(avg_ratings[0] or 0, 1),
            'avg_design_rating': round(avg_ratings[1] or 0, 1),
            'avg_performance_rating': round(avg_ratings[2] or 0, 1),
            'top_performers': [
                {
                    'username': row[0],
                    'level_completed': row[1],
                    'total_coins': row[2],
                    'success_rate': round(row[3], 1)
                } for row in top_performers
            ],
            'recent_activity': [
                {
                    'username': row[0],
                    'last_played': row[1],
                    'level_completed': row[2],
                    'total_coins': row[3]
                } for row in recent_activity
            ]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ------------------ עדכון התקדמות משתמש ------------------
@app.route('/api/update_progress', methods=['POST'])
def update_progress():
    try:
        data = request.json
        user_id = data.get('user_id')
        level_completed = data.get('level_completed')
        coins_earned = data.get('coins_earned', 0)
        correct_answer = data.get('correct_answer', False)
        
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400
        
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get current user data
        cursor.execute("""
            SELECT level_completed, total_coins, games_played, correct_answers, total_answers
            FROM users WHERE id = ?
        """, (user_id,))
        row = cursor.fetchone()
        
        if not row:
            conn.close()
            return jsonify({'error': 'User not found'}), 404
        
        current_level = row[0] or 1
        current_coins = row[1] or 0
        current_games = row[2] or 0
        current_correct = row[3] or 0
        current_total = row[4] or 0
        
        # Update progress
        new_level = max(current_level, level_completed or current_level)
        new_coins = current_coins + coins_earned
        new_games = current_games + 1
        new_correct = current_correct + (1 if correct_answer else 0)
        new_total = current_total + 1
        
        # Update database
        cursor.execute("""
            UPDATE users 
            SET level_completed = ?, 
                total_coins = ?, 
                games_played = ?,
                correct_answers = ?,
                total_answers = ?,
                last_played = date('now')
            WHERE id = ?
        """, (new_level, new_coins, new_games, new_correct, new_total, user_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'Progress updated successfully',
            'level_completed': new_level,
            'total_coins': new_coins,
            'games_played': new_games,
            'correct_answers': new_correct,
            'total_answers': new_total
        }), 200
        
    except Exception as e:
        print(f"Error updating progress: {str(e)}")
        return jsonify({'error': str(e)}), 500

# ------------------ פרופיל ------------------
@app.route('/api/profile/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT username, email, is_institution, feedback, level_completed, 
                   total_coins, games_played, correct_answers, total_answers, last_played
            FROM users WHERE id = ?
        """, (user_id,))
        row = cursor.fetchone()
        conn.close()

        if row:
            success_rate = (row[7] / row[8] * 100) if row[8] > 0 else 0
            return jsonify({
                'username': row[0],
                'email': row[1],
                'is_institution': row[2],
                'feedback': row[3],
                'level_completed': row[4],
                'total_coins': row[5],
                'games_played': row[6],
                'correct_answers': row[7],
                'total_answers': row[8],
                'success_rate': round(success_rate, 1),
                'last_played': row[9]
            }), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ------------------ בדיקת קובץ שמע במשחק ------------------
@app.route('/api/check_audio', methods=['POST'])
def check_audio():
    try:
        data = request.json
        file_path = data.get('file_path')
        
        if not file_path:
            return jsonify({'error': 'No file path provided'}), 400

        # Convert relative path to absolute path
        if file_path.startswith('/'):
            file_path = file_path[1:]  # Remove leading slash
        absolute_path = os.path.join(os.path.dirname(__file__), '..', 'client', 'public', file_path)
        
        if not os.path.exists(absolute_path):
            return jsonify({'error': f'File not found: {file_path}'}), 404

        # Load and process the audio file
        try:
            y, sr = librosa.load(absolute_path, sr=16000)
        except Exception as e:
            return jsonify({'error': f'Error loading audio: {str(e)}'}), 500

        # Extract features
        try:
            # Extract features
            mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
            mfcc_mean = np.mean(mfcc, axis=1)
            mfcc_std = np.std(mfcc, axis=1)
            
            # Spectral features
            spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
            spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)[0]
            spectral_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
            
            # Combine all features
            features = np.concatenate([
                mfcc_mean,                              # 20 features
                mfcc_std,                               # 20 features
                [np.mean(spectral_centroid)],           # 1 feature
                [np.std(spectral_centroid)],            # 1 feature
                [np.mean(spectral_rolloff)],            # 1 feature
                [np.std(spectral_rolloff)],             # 1 feature
                np.mean(spectral_contrast, axis=1),     # 7 features
                np.std(spectral_contrast, axis=1)       # 7 features
            ]).reshape(1, -1)

            # Scale features
            features_scaled = scaler.transform(features)

            # Make prediction
            prediction = model.predict(features_scaled)
            confidence = float(prediction[0][0])
            
            # Adjust threshold based on validation results
            threshold = 0.5
            result = 'Fake' if confidence > threshold else 'Real'
            
            # Calculate confidence percentage
            confidence_percent = confidence * 100 if confidence > threshold else (1 - confidence) * 100
            confidence_percent = min(100, max(0, confidence_percent))

            print(f"Processed file: {file_path}")
            print(f"Prediction: {result} with {confidence_percent:.2f}% confidence")

            return jsonify({
                'prediction': result,
                'confidence': confidence_percent
            }), 200

        except Exception as e:
            print(f"Error processing audio: {str(e)}")
            return jsonify({'error': f'Error processing audio: {str(e)}'}), 500

    except Exception as e:
        print(f"Error in check_audio: {str(e)}")
        return jsonify({'error': str(e)}), 500

# ------------------ בחירת קבצי אודיו למשחק ------------------
@app.route('/api/get_game_audio', methods=['GET'])
def get_game_audio():
    try:
        import random
        import glob
        
        # Define the paths to Codecfake directories
        codecfake_dir = os.path.join(os.path.dirname(__file__), '..', 'Codecfake')
        train_dir = os.path.join(codecfake_dir, 'train')
        train1_dir = os.path.join(codecfake_dir, 'train-1')
        
        # Get fake files (files starting with F01-F06)
        fake_files = []
        for directory in [train_dir, train1_dir]:
            if os.path.exists(directory):
                fake_files.extend(glob.glob(os.path.join(directory, 'F0*.wav')))
        
        # Get real files (files starting with SSB, p225, etc but not F0*)
        real_files = []
        for directory in [train_dir, train1_dir]:
            if os.path.exists(directory):
                all_files = glob.glob(os.path.join(directory, '*.wav'))
                real_files.extend([f for f in all_files if not os.path.basename(f).startswith('F0')])
        
        print(f"Found {len(fake_files)} fake files and {len(real_files)} real files")
        
        if len(fake_files) < 1 or len(real_files) < 1:
            return jsonify({'error': 'Not enough audio files found in Codecfake directory'}), 400
        
        # Select random files
        selected_real = random.choice(real_files)
        selected_fake = random.choice(fake_files)
        
        # Copy files to uploads directory so they can be served
        import shutil
        uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads')
        os.makedirs(uploads_dir, exist_ok=True)
        
        real_filename = f"game_real_{random.randint(1000, 9999)}.wav"
        fake_filename = f"game_fake_{random.randint(1000, 9999)}.wav"
        
        real_dest = os.path.join(uploads_dir, real_filename)
        fake_dest = os.path.join(uploads_dir, fake_filename)
        
        shutil.copy2(selected_real, real_dest)
        shutil.copy2(selected_fake, fake_dest)
        
        print(f"Copied files: {real_filename}, {fake_filename}")
        
        return jsonify({
            'real_file': real_filename,
            'fake_file': fake_filename,
            'real_path': f'/uploads/{real_filename}',
            'fake_path': f'/uploads/{fake_filename}'
        }), 200
        
    except Exception as e:
        print(f"Error in get_game_audio: {str(e)}")
        return jsonify({'error': str(e)}), 500

# ------------------ הגשת קבצי אודיו סטטיים ------------------
@app.route('/uploads/<filename>')
def serve_uploaded_file(filename):
    try:
        uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads')
        file_path = os.path.join(uploads_dir, filename)
        
        if not os.path.exists(file_path):
            return jsonify({'error': 'File not found'}), 404
            
        from flask import send_file
        return send_file(file_path)
        
    except Exception as e:
        print(f"Error serving file: {str(e)}")
        return jsonify({'error': str(e)}), 500

# ------------------ ניהול משחקים ------------------
@app.route('/api/admin/games', methods=['GET'])
def get_admin_games():
    try:
        # זהו נתונים דמי למשחקים - אפשר להחליף בנתונים אמיתיים מה-DB
        games_data = [
            {
                'id': 1,
                'name': 'Audio Detection Challenge',
                'levels': 10,
                'players': 150,
                'status': 'active',
                'difficulty': 'Progressive',
                'category': 'Detection Game'
            },
            {
                'id': 2,
                'name': 'Quick Detection Mode',
                'levels': 5,
                'players': 89,
                'status': 'active',
                'difficulty': 'Easy',
                'category': 'Speed Game'
            },
            {
                'id': 3,
                'name': 'Expert Challenge',
                'levels': 15,
                'players': 45,
                'status': 'inactive',
                'difficulty': 'Hard',
                'category': 'Expert Mode'
            }
        ]
        
        return jsonify(games_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ------------------ ניהול העלאות ------------------
@app.route('/api/admin/uploads', methods=['GET'])
def get_admin_uploads():
    try:
        import os
        import random
        from datetime import datetime, timedelta
        
        uploads_data = []
        uploads_dir = './uploads'
        
        # יצירת נתונים דמי אם אין קבצים
        if not os.path.exists(uploads_dir) or len(os.listdir(uploads_dir)) == 0:
            sample_uploads = [
                {
                    'id': 1,
                    'filename': 'sample_voice_1.wav',
                    'user': 'alex_gamer',
                    'uploadDate': '2024-01-20T10:30:00Z',
                    'fileSize': '2.3 MB',
                    'duration': '00:35',
                    'result': 'Real',
                    'confidence': 94.5,
                    'status': 'processed'
                },
                {
                    'id': 2,
                    'filename': 'test_audio_2.mp3',
                    'user': 'sarah_detective',
                    'uploadDate': '2024-01-20T14:15:00Z',
                    'fileSize': '1.8 MB',
                    'duration': '00:28',
                    'result': 'Fake',
                    'confidence': 87.2,
                    'status': 'processed'
                },
                {
                    'id': 3,
                    'filename': 'voice_sample_3.wav',
                    'user': 'mike_audio_pro',
                    'uploadDate': '2024-01-20T16:45:00Z',
                    'fileSize': '3.1 MB',
                    'duration': '00:52',
                    'result': 'Real',
                    'confidence': 96.8,
                    'status': 'processed'
                },
                {
                    'id': 4,
                    'filename': 'analyzing_file.wav',
                    'user': 'student_jenny',
                    'uploadDate': '2024-01-20T18:20:00Z',
                    'fileSize': '2.7 MB',
                    'duration': '00:41',
                    'result': None,
                    'confidence': None,
                    'status': 'processing'
                }
            ]
            return jsonify(sample_uploads), 200
        
        # קריאת קבצים אמיתיים מתיקיית uploads
        file_id = 1
        for filename in os.listdir(uploads_dir):
            if filename.endswith(('.wav', '.mp3', '.ogg')):
                file_path = os.path.join(uploads_dir, filename)
                file_size = os.path.getsize(file_path)
                
                # המרת גודל קובץ לפורמט קריא
                if file_size > 1024 * 1024:
                    size_str = f"{file_size / (1024 * 1024):.1f} MB"
                elif file_size > 1024:
                    size_str = f"{file_size / 1024:.1f} KB"
                else:
                    size_str = f"{file_size} B"
                
                # נתונים רנדומליים לדוגמה
                results = ['Real', 'Fake']
                statuses = ['processed', 'processing']
                users = ['user1', 'user2', 'user3', 'system', 'admin']
                
                upload_info = {
                    'id': file_id,
                    'filename': filename,
                    'user': random.choice(users),
                    'uploadDate': (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat() + 'Z',
                    'fileSize': size_str,
                    'duration': f"00:{random.randint(15, 90):02d}",
                    'result': random.choice(results),
                    'confidence': round(random.uniform(75, 99), 1),
                    'status': random.choice(statuses)
                }
                
                uploads_data.append(upload_info)
                file_id += 1
        
        return jsonify(uploads_data), 200
        
    except Exception as e:
        print(f"Error getting admin uploads: {str(e)}")
        return jsonify({'error': str(e)}), 500

# ------------------ מחיקת העלאה ------------------
@app.route('/api/admin/delete_upload/<int:upload_id>', methods=['DELETE'])
def delete_upload(upload_id):
    try:
        # זהו endpoint דמי - במציאות היה צריך למחוק את הקובץ מהדיסק
        print(f"Deleting upload with ID: {upload_id}")
        return jsonify({'message': 'Upload deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ------------------ הרצת שרת ------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

