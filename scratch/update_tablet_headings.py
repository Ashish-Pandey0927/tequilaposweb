import os

files = [
    "elys-workstation.html",
    "a35-android.html",
    "a920.html",
    "magtek.html",
    "dark/Elys-workstation.html",
    "dark/a35-android.html",
    "dark/a920.html",
    "dark/magtek.html"
]

root_dir = r"e:\tequilaposweb-main (1)\tequilaposweb-main"

# Target block to replace
target_block = """    /* Tablet view heading line-height fix */
    @media (min-width: 768px) and (max-width: 1023px) {
      h2 {
        line-height: 1.3 !important;
      }
    }"""

# New replacement block (applying 1.4 to both h1 and h2 for perfect heading line heights in tablet mode)
replacement_block = """    /* Tablet view heading line-height fix */
    @media (min-width: 768px) and (max-width: 1023px) {
      h1, h2 {
        line-height: 1.4 !important;
      }
    }"""

for fpath in files:
    full_path = os.path.join(root_dir, fpath)
    if not os.path.exists(full_path):
        print(f"File not found: {fpath}")
        continue
    
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Try direct block replacement first
    if target_block in content:
        new_content = content.replace(target_block, replacement_block)
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Successfully updated block in {fpath}")
    else:
        # If whitespace differs, let's do a more robust find/replace for the media query and h2
        # Let's check if the comment is present
        if "/* Tablet view heading line-height fix */" in content:
            # Replace whatever is inside that block or write a simple regex
            import re
            pattern = r"/\*\s*Tablet view heading line-height fix\s*\*/\s*@media\s*\(min-width:\s*768px\)\s*and\s*\(max-width:\s*1023px\)\s*\{\s*h2\s*\{\s*line-height:\s*1\.3\s*!important;\s*\}\s*\}"
            if re.search(pattern, content):
                new_content = re.sub(pattern, replacement_block, content)
                with open(full_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Successfully updated block via regex in {fpath}")
            else:
                print(f"Comment found but structure didn't match pattern in {fpath}")
        else:
            print(f"No existing tablet line-height block found in {fpath}")
