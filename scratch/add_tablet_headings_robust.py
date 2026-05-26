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

rule = """
    /* Tablet view heading line-height fix */
    @media (min-width: 768px) and (max-width: 1023px) {
      h2 {
        line-height: 1.3 !important;
      }
    }
"""

style_block = f"""  <style>{rule}  </style>
"""

for fpath in files:
    full_path = os.path.join(root_dir, fpath)
    if not os.path.exists(full_path):
        print(f"File not found: {fpath}")
        continue
    
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check if the rule is already added (e.g. from previous run)
    if "Tablet view heading line-height fix" in content:
        print(f"Rule already exists in {fpath}")
        continue
        
    parts = content.split("</style>")
    if len(parts) > 1:
        parts[0] = parts[0] + rule
        new_content = "</style>".join(parts)
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Successfully added rule to existing style block of {fpath}")
    else:
        # No style tag, find </head> and insert before it
        head_parts = content.split("</head>")
        if len(head_parts) > 1:
            head_parts[0] = head_parts[0] + style_block
            new_content = "</head>".join(head_parts)
            with open(full_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Successfully created style block before </head> in {fpath}")
        else:
            print(f"No </head> tag found in {fpath}")
