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

for fpath in files:
    full_path = os.path.join(root_dir, fpath)
    if not os.path.exists(full_path):
        print(f"File not found: {fpath}")
        continue
    
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Let's find the first </style> in the file. Or the last one in the head.
    # We can split the content by "</style>" and insert the rule before the first "</style>" or last </style>
    parts = content.split("</style>")
    if len(parts) > 1:
        # We can append the rule to the first style block to keep it inside the style block
        parts[0] = parts[0] + rule
        new_content = "</style>".join(parts)
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Successfully added rule to {fpath}")
    else:
        print(f"No </style> tag found in {fpath}")
