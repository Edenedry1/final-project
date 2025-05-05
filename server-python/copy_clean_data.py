import os
import shutil

# קריאת רשימות
with open('valid_fake.txt', 'r') as f:
    fake = [line.strip() for line in f]
with open('valid_real.txt', 'r') as f:
    real = [line.strip() for line in f]

target_dir = 'clean_dataset'
os.makedirs(target_dir, exist_ok=True)

src_folder = '../CodecFake/train_split_small'

for file in fake + real:
    src = os.path.join(src_folder, file)
    dst = os.path.join(target_dir, file)
    shutil.copyfile(src, dst)

print(f"הועתקו {len(real)} קבצים אמיתיים ו-{len(fake)} קבצי פייק לתיקייה: {target_dir}")
