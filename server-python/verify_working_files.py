import os
import librosa

LABEL_FILE = '../CodecFake/label/train_subset.txt'
AUDIO_FOLDER = '../CodecFake/train_split_small'

labels = {}
with open(LABEL_FILE, 'r') as f:
    for line in f:
        parts = line.strip().split()
        if len(parts) >= 2:
            file = parts[0]
            label = parts[1]
            name = file.split('_')[-1]
            labels[name] = label

real_ok = []
fake_ok = []
unreadable = []

for file in os.listdir(AUDIO_FOLDER):
    if file.endswith('.wav'):
        try:
            path = os.path.join(AUDIO_FOLDER, file)
            y, sr = librosa.load(path, sr=None)
            name = file.split('_')[-1]
            if name in labels:
                if labels[name] == 'real':
                    real_ok.append(file)
                elif labels[name] == 'fake':
                    fake_ok.append(file)
        except Exception:
            unreadable.append(file)

print(f"✅ קבצים אמיתיים תקינים: {len(real_ok)}")
print(f"✅ קבצי פייק תקינים: {len(fake_ok)}")
print(f"❌ קבצים לא ניתנים לקריאה: {len(unreadable)}")

with open('valid_real.txt', 'w') as f:
    f.writelines([f"{x}\n" for x in real_ok])
with open('valid_fake.txt', 'w') as f:
    f.writelines([f"{x}\n" for x in fake_ok])
