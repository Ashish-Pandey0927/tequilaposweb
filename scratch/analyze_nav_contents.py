import os
import re

root_dir = r"e:\tequilaposweb-main (1)\tequilaposweb-main"

# Regex to find <nav> elements and extract their contents
nav_block_re = re.compile(r'(<nav\s+[^>]*class="[^"]*navbar[^"]*"[^>]*>.*?</nav>)', re.DOTALL | re.IGNORECASE)
breakpoint_re = re.compile(r'\b(?:md|lg|xl):[a-zA-Z0-9_-]+')

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
                matches = nav_block_re.findall(content)
                if matches:
                    bp_classes = set()
                    for match in matches:
                        classes = breakpoint_re.findall(match)
                        bp_classes.update(classes)
                    if bp_classes:
                        results[rel_path] = sorted(list(bp_classes))
            except Exception as e:
                pass

for path, bps in results.items():
    print(f"{path}: {bps}")
