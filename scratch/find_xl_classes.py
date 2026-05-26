import os
import re

root_dir = r"e:\tequilaposweb-main (1)\tequilaposweb-main"

xl_class_re = re.compile(r'\bxl:[a-zA-Z0-9_-]+')

results = {}

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
                matches = xl_class_re.findall(content)
                if matches:
                    results[rel_path] = sorted(list(set(matches)))
            except Exception as e:
                pass

for path, xls in results.items():
    print(f"{path}: {xls}")
