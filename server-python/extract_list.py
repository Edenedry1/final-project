train_file = '../CodecFake/label/train_subset.txt'
output_file = 'files_to_extract.txt'

try:
    with open(train_file, 'r') as f:
        lines = f.readlines()
except FileNotFoundError:
    print(f"❌ הקובץ לא נמצא: {train_file}")
    exit()

if not lines:
    print("❌ הקובץ train_subset.txt ריק.")
    exit()

filenames = set()
for line in lines:
    parts = line.strip().split()
    if parts:
        filenames.add(parts[0])

if not filenames:
    print("❌ לא נמצאו שמות קבצים בשורות.")
    exit()

with open(output_file, 'w') as out:
    for name in filenames:
        out.write(f"train/{name}\n")

print(f"✅ נוצרו {len(filenames)} קבצים בתוך {output_file}")
