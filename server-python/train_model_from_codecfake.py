import os
import numpy as np
import librosa
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import random

# ---------------------- Config ----------------------
LABEL_FILE = '../Codecfake/label/train.txt'
AUDIO_FOLDER = '../Codecfake/train'
AUDIO_FOLDER_2 = '../Codecfake/train-1'  # Additional folder for more files
MODEL_SAVE_PATH = './models/model.h5'
SCALER_SAVE_PATH = './scaler.save'
SAMPLES_PER_CLASS = 50000  # Increase to use more available data

# ---------------------- Load Labels ----------------------
def load_labels(label_path):
    real_files, fake_files = [], []
    with open(label_path, 'r') as f:
        for line in f:
            parts = line.strip().split()
            if len(parts) >= 2:
                filename = parts[0].strip()
                label_str = parts[1].strip()
                label = 0 if label_str == 'real' else 1
                if label == 0:
                    real_files.append((filename, label))
                else:
                    fake_files.append((filename, label))
    return real_files, fake_files

# ---------------------- Feature Extraction ----------------------
def extract_features(file_path):
    try:
        y, sr = librosa.load(file_path, sr=16000)  # קביעת קצב דגימה קבוע
        
        # MFCC features
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
        mfcc_mean = np.mean(mfcc, axis=1)
        mfcc_std = np.std(mfcc, axis=1)
        
        # Spectral features
        spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]  # Take first dimension
        spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)[0]    # Take first dimension
        spectral_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
        
        # Calculate statistics for each feature
        features = np.concatenate([
            mfcc_mean,                              # 20 features
            mfcc_std,                               # 20 features
            [np.mean(spectral_centroid)],           # 1 feature
            [np.std(spectral_centroid)],            # 1 feature
            [np.mean(spectral_rolloff)],            # 1 feature
            [np.std(spectral_rolloff)],             # 1 feature
            np.mean(spectral_contrast, axis=1),     # 7 features
            np.std(spectral_contrast, axis=1)       # 7 features
        ])
        
        return features
    except Exception as e:
        print(f"❌ Error with: {file_path}: {e}")
        return None

# ---------------------- Find File in Multiple Directories ----------------------
def find_file(filename, folders):
    """Search for a file in multiple directories"""
    for folder in folders:
        full_path = os.path.join(folder, filename)
        if os.path.exists(full_path):
            return full_path
    return None

# ---------------------- Load Data ----------------------
real_files, fake_files = load_labels(LABEL_FILE)
print("👀 Real:", len(real_files), "| Fake:", len(fake_files))

# Balanced sampling
SAMPLES_PER_CLASS = min(SAMPLES_PER_CLASS, len(real_files), len(fake_files))
print("📉 Using", SAMPLES_PER_CLASS, "samples per class.")

random.shuffle(real_files)
random.shuffle(fake_files)

real_sample = real_files[:SAMPLES_PER_CLASS]
fake_sample = fake_files[:SAMPLES_PER_CLASS]
all_samples = real_sample + fake_sample
random.shuffle(all_samples)

x_data, y_data = [], []
print(f"🔍 Loading {len(all_samples)} samples...")

audio_folders = [AUDIO_FOLDER, AUDIO_FOLDER_2]

for fname, label in all_samples:
    full_path = find_file(fname, audio_folders)
    print(f"🔍 Trying to process: {fname}")
    
    if full_path:
        print(f"✅ File found at: {full_path}")
        features = extract_features(full_path)
        if features is not None:
            x_data.append(features)
            y_data.append(label)
            print(f"✅ Successfully processed {fname}")
        else:
            print(f"❌ Failed to extract features from {fname}")
    else:
        print(f"❌ File not found in any directory: {fname}")

x_data = np.array(x_data)
y_data = np.array(y_data)

print("✅ Final loaded samples:", len(x_data))
print("📊 Real:", sum(1 for y in y_data if y == 0))
print("📊 Fake:", sum(1 for y in y_data if y == 1))

# ---------------------- Normalize ----------------------
scaler = StandardScaler()
x_data = scaler.fit_transform(x_data)
joblib.dump(scaler, SCALER_SAVE_PATH)
print(f"💾 Scaler saved to: {SCALER_SAVE_PATH}")

# ---------------------- Split ----------------------
x_train, x_test, y_train, y_test = train_test_split(x_data, y_data, test_size=0.2, random_state=42, stratify=y_data)

# ---------------------- Model ----------------------
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(x_data.shape[1],)),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dense(256, activation='relu'),
    tf.keras.layers.Dropout(0.4),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss='binary_crossentropy',
    metrics=['accuracy', tf.keras.metrics.AUC()]
)

# ---------------------- Train ----------------------
print("🚀 Starting training...")
early_stopping = tf.keras.callbacks.EarlyStopping(
    monitor='val_loss',
    patience=5,
    restore_best_weights=True
)

history = model.fit(
    x_train, y_train,
    epochs=50,
    batch_size=32,
    validation_split=0.2,
    callbacks=[early_stopping]
)

# ---------------------- Evaluate & Save ----------------------
loss, acc, auc = model.evaluate(x_test, y_test)
print(f"\n🎯 Test Accuracy: {acc*100:.2f}%")
print(f"📈 AUC Score: {auc:.4f}")

model.save(MODEL_SAVE_PATH)
print(f"💾 Model saved to: {MODEL_SAVE_PATH}")