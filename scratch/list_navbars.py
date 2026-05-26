import os
import re

root_dir = r"e:\tequilaposweb-main (1)\tequilaposweb-main"

navbar_re = re.compile(r'<nav\s+[^>]*class="[^"]*navbar[^"]*"[^>]*>', re.IGNORECASE)

for dirpath, dirnames, filenames in os.walk(root_dir):
    # Skip node_modules and .git
    if "node_modules" in dirpath or ".git" in dirpath:
        continue
    for filename in filenames:
        if filename.endswith(".html"):
            filepath = os.path.join(dirpath, filename)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                matches = navbar_re.findall(content)
                if matches:
                    rel_path = os.path.relpath(filepath, root_dir)
                    print(f"{rel_path}:")
                    for match in matches:
                        print(f"  {match.strip()}")
            except Exception as e:
                print(f"Error reading {filepath}: {e}")
