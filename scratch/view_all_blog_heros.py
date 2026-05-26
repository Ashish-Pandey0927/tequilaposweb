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
    
    print(f"==================================================")
    print(f"=== FILE: {fpath} ===")
    print(f"==================================================")
    
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # We find the section immediately following <!-- hero section -->
    # search for hero section comment
    parts = re.split(r"<!--\s*hero section\s*-->", content, flags=re.IGNORECASE)
    if len(parts) > 1:
        hero_part = parts[1]
        # Find the first <section> ... </section> block in hero_part
        # We can extract up to </section>
        section_match = re.search(r"(<section.*?</section>)", hero_part, re.DOTALL)
        if section_match:
            hero_code = section_match.group(1)
            # Print first 20 lines and key elements
            print("\n".join(hero_code.splitlines()[:40]))
        else:
            print("No <section> block found after hero comment.")
    else:
        print("Hero section comment not found.")
