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

root_dir = r"e:\tequilaposweb-main (1)\tequilaposweb-main"

for fpath in files:
    full_path = os.path.join(root_dir, fpath)
    if not os.path.exists(full_path):
        continue
    print(f"=== {fpath} ===")
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check for lg: vs md: layout differences
    for i, line in enumerate(content.splitlines()):
        if "lg:hidden" in line or "lg:flex" in line or "lg:block" in line or "lg:grid" in line:
            print(f"  Line {i+1}: {line.strip()[:120]}")
