import re

with open("hardware.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "class=" in line and ("border" in line or "rounded" in line or "card" in line):
        print(f"Line {i+1}: {line.strip()}")
