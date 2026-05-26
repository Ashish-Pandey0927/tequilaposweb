import os
import re

files = [
    "elys-workstation.html",
    "a35-android.html",
    "a920.html",
    "magtek.html"
]

root_dir = r"e:\tequilaposweb-main (1)\tequilaposweb-main"

for fpath in files:
    full_path = os.path.join(root_dir, fpath)
    if not os.path.exists(full_path):
        continue
    print(f"=== {fpath} ===")
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()
    # Find all media queries in style blocks
    matches = re.findall(r'@media\s+([^{]+)\{([^}]+)\}', content, re.DOTALL)
    for query, block in matches:
        if "768" in query or "1024" in query or "780" in query:
            print(f"  Query: {query.strip()}")
            # Print lines containing header tags or styling
            for line in block.strip().split("\n"):
                if any(x in line for x in ["font-size", "line-height", "heading", "h2", "h1", "leading"]):
                    print(f"    {line.strip()}")
