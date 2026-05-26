import os
import re

root_dir = r"e:\tequilaposweb-main (1)\tequilaposweb-main"
fpath = "blog-one.html"

with open(os.path.join(root_dir, fpath), "r", encoding="utf-8") as f:
    content = f.read()

# Find occurrences of hidden/visible toggles, grids, flex rows
lines = content.splitlines()
for i, line in enumerate(lines):
    if any(keyword in line for keyword in ["hidden", "lg:flex", "lg:hidden", "md:flex", "md:hidden", "md:grid", "lg:grid"]):
        if "<div" in line or "<section" in line or "<nav" in line:
            print(f"Line {i+1}: {line.strip()}")
