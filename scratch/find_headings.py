import os
import re

files = [
    "elys-workstation.html",
    "a35-android.html",
    "a920.html",
    "magtek.html",
    "dark/Elys-workstation.html",
    "dark/a35-android.html",
    "dark/a920.html",
    "dark/magtek.html"
]

heading_re = re.compile(r'<(h1|h2|h3)\b[^>]*>', re.IGNORECASE)

root_dir = r"e:\tequilaposweb-main (1)\tequilaposweb-main"

for fpath in files:
    full_path = os.path.join(root_dir, fpath)
    if not os.path.exists(full_path):
        print(f"File not found: {fpath}")
        continue
    print(f"=== {fpath} ===")
    with open(full_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    for i, line in enumerate(lines):
        if heading_re.search(line):
            print(f"  Line {i+1}: {line.strip()}")
