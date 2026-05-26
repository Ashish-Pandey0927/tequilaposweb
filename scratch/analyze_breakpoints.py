import os
import re

root_dir = r"e:\tequilaposweb-main (1)\tequilaposweb-main"

navbar_re = re.compile(r'(<nav\s+[^>]*class="[^"]*navbar[^"]*"[^>]*>)', re.IGNORECASE)

for dirpath, dirnames, filenames in os.walk(root_dir):
    if "node_modules" in dirpath or ".git" in dirpath:
        continue
    for filename in filenames:
        if filename.endswith(".html"):
            filepath = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(filepath, root_dir)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                matches = navbar_re.findall(content)
                if matches:
                    print(f"=== {rel_path} ===")
                    for m in matches:
                        print("  ", m.strip())
            except Exception as e:
                print(f"Error {rel_path}: {e}")
