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
                        feedback TEXT DEFAULT ''
                    )''')
    conn.commit()
    conn.close()
    print("✅ Database created.")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(users)")
    if "feedback" not in [c[1] for c in cursor.fetchall()]:
        cursor.execute("ALTER TABLE users ADD COLUMN feedback TEXT DEFAULT ''")
        conn.commit()
        print("✅ Column feedback added.")
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
        cursor.execute("SELECT id, username, email, is_institution, feedback FROM users")
        users = cursor.fetchall()
        conn.close()

        users_list = [{'id': row[0], 'username': row[1], 'email': row[2],
                       'is_institution': row[3], 'feedback': row[4]} for row in users]
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

# ------------------ פרופיל ------------------
@app.route('/api/profile/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT username, email, is_institution, feedback FROM users WHERE id = ?", (user_id,))
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

# ------------------ הרצת שרת ------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

