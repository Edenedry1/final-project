import os
import wave

# הנתיב לתיקיית קבצי השמע שחולצו
directory = '../CodecFake/train_split_small'

# עובר על כל הקבצים בתיקייה
for file in os.listdir(directory):
    if file.endswith(".wav"):
        path = os.path.join(directory, file)
        try:
            with wave.open(path, 'rb') as wav_file:
                wav_file.getparams()  # ניסיון לקרוא פרמטרים
            print(f"{file} ✅ תקין")
        except Exception as e:
            print(f"{file} ❌ תקול: {e}")
