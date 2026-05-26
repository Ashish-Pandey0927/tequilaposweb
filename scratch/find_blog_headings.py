import os
import re

files = [
    "blog-one.html",
    "blog-two.html",
    "blog-three.html",
    "blog-four.html",
    "blog-five.html",
    "blog-six.html",
    "dark/blog-one.html",
    "dark/blog-two.html",
    "dark/blog-three.html",
    "dark/blog-four.html",
    "dark/blog-five.html",
    "dark/blog-six.html"
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
