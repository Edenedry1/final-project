import os
import numpy as np
import librosa
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from imblearn.under_sampling import RandomUnderSampler
import joblib

# נתיבים
LABEL_FILE = '../CodecFake/label/train_subset.txt'
AUDIO_FOLDER = '../CodecFake/train_split_small'
MODEL_SAVE_PATH = './models/model.h5'
SCALER_SAVE_PATH = './scaler.save'

# קריאת תוויות
def load_labels(label_path):
    labels = {}
    with open(label_path, 'r') as f:
        for line in f:
            parts = line.strip().split()
            if len(parts) >= 2:
                filename = parts[0].strip()
                label = 0 if parts[1].strip() == 'real' else 1
                labels[filename] = label
    return labels

# --------------------------- חילוץ מאפיינים ---------------------------

def extract_features(file_path, n_mfcc=13):
    try:
        y, sr = librosa.load(file_path, sr=None)
        print(f"🎧 Loading file: {file_path}, sr={sr}, duration={len(y)/sr:.2f}s")

        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
        mfcc_mean = np.mean(mfcc, axis=1)
        mfcc_std = np.std(mfcc, axis=1)

        features = np.concatenate((mfcc_mean, mfcc_std))
        print(f"📊 Extracted features shape: {features.shape}")  # אמור להיות (26,)

        return features

    except Exception as e:
        print(f"❌ שגיאה בקריאת {file_path}: {e}")
        return None


# קריאת נתונים
labels_dict = load_labels(LABEL_FILE)
x_data, y_data = [], []

print("\n🔍 טוען קבצים מתוך train_split_small...")
for file in os.listdir(AUDIO_FOLDER):
    if file.endswith('.wav') and file in labels_dict:
        path = os.path.join(AUDIO_FOLDER, file)
        features = extract_features(path)
        if features is not None:
            x_data.append(features)
            y_data.append(labels_dict[file])

x_data = np.array(x_data)
y_data = np.array(y_data)

if len(x_data) == 0:
    print("❌ לא נטענו דגימות.")
    exit()
print(f"\n✅ נטענו {len(x_data)} דגימות.")

# נרמול ושמירת scaler
scaler = StandardScaler()
x_data = scaler.fit_transform(x_data)
joblib.dump(scaler, SCALER_SAVE_PATH)
print(f"\n💾 scaler נשמר ל: {SCALER_SAVE_PATH}")

# איזון מחלקות
rus = RandomUnderSampler(random_state=42)
x_data, y_data = rus.fit_resample(x_data, y_data)

# חלוקה
x_train, x_test, y_train, y_test = train_test_split(x_data, y_data, test_size=0.2, random_state=42)

# מודל
model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation='relu', input_shape=(26,)),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# אימון
print("\n🚀 מאמן את המודל...")
model.fit(x_train, y_train, epochs=10, batch_size=32, validation_split=0.1)
# הערכה
loss, acc = model.evaluate(x_test, y_test)
print(f"\n🎯 דיוק: {acc*100:.2f}%, הפסד (loss): {loss:.4f}")


# הערכה
loss, acc = model.evaluate(x_test, y_test)
print(f"\n🎯 דיוק: {acc*100:.2f}%")

# שמירה
model.save(MODEL_SAVE_PATH)
print(f"\n💾 המודל נשמר ל: {MODEL_SAVE_PATH}")


print("\n🚀 האימון הסתיים בהצלחה!")
print(f"📊 סך כל הדגימות לאחר איזון: {len(x_data)}")
print(f"✅ דיוק על סט הבדיקה: {acc*100:.2f}%")
print(f"💾 קבצי המודל והסקיילר נשמרו ב: {MODEL_SAVE_PATH}, {SCALER_SAVE_PATH}")
