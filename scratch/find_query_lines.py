with open("a35-android.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "1023px" in line or "768px" in line or "1.85rem" in line:
        print(f"Line {i+1}: {line.strip()}")
