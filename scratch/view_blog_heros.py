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
    
    # Find hero section (which follows navbar and is first section)
    lines = content.splitlines()
    found_hero = False
    hero_lines = []
    for i, line in enumerate(lines):
        if "hero section" in line.lower() or found_hero:
            found_hero = True
            hero_lines.append((i+1, line))
            if "</section>" in line:
                break
    
    for lno, ltxt in hero_lines[:30]: # print up to 30 lines
        print(f"  Line {lno}: {ltxt}")
