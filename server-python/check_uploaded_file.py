import os
import librosa 

# נתיב לתיקייה שבה הקובץ נמצא
file_path = 'uploads/Kings_Of_Leon_-_Pyro.wav'

try:
    # טוען את הקובץ
    y, sr = librosa.load(file_path, sr=None)
    print(f"✅ File loaded successfully! Sample rate: {sr}, Duration: {len(y) / sr} seconds.")
except Exception as e:
    print(f"❌ Error loading file: {e}")
