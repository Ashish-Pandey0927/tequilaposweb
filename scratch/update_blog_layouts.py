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

rule = """
    /* Tablet view heading line-height fix */
    @media (min-width: 768px) and (max-width: 1023px) {
      h1, h2, h3 {
        line-height: 1.4 !important;
      }
    }
"""

style_block = f"""  <style>{rule}  </style>
"""

# Generic replacements for flex layout columns to display side-by-side on tablet (mixture)
generic_replacements = [
    ("flex-col lg:flex-row", "flex-col md:flex-row"),
    ("lg:flex-row", "md:flex-row"),
    ("lg:w-1/2", "md:w-1/2"),
    ("lg:w-2/3", "md:w-2/3"),
    ("lg:w-1/3", "md:w-1/3"),
    ("lg:text-left", "md:text-left lg:text-left"),
    ("lg:w-[900px]", "md:w-2/3 lg:w-[900px]"),
    ("lg:grid-cols-3", "md:grid-cols-2 lg:grid-cols-3"), # make grid 2 columns on tablet instead of 1
]

for fpath in files:
    full_path = os.path.join(root_dir, fpath)
    if not os.path.exists(full_path):
        print(f"File not found: {fpath}")
        continue
    
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 1. Stylesheet Injection
    style_added = False
    if "Tablet view heading line-height fix" not in content:
        parts = content.split("</style>")
        if len(parts) > 1:
            parts[0] = parts[0] + rule
            content = "</style>".join(parts)
            style_added = True
        else:
            head_parts = content.split("</head>")
            if len(head_parts) > 1:
                head_parts[0] = head_parts[0] + style_block
                content = "</head>".join(head_parts)
                style_added = True
    
    # 2. Specific replacements for blog-one.html hero section
    if "blog-one.html" in fpath:
        # Show desktop hero on tablet, hide mobile hero on tablet
        content = content.replace(
            'hidden lg:flex flex-row items-center justify-between gap-12',
            'hidden md:flex flex-row items-center justify-between gap-6 lg:gap-12'
        )
        content = content.replace(
            'container mx-auto px-4 lg:hidden',
            'container mx-auto px-4 md:hidden'
        )
        content = content.replace(
            '<h1 class="text-7xl font-bold mb-8">',
            '<h1 class="text-[32px] md:text-5xl lg:text-7xl font-bold mb-4 md:mb-8">'
        )
        content = content.replace(
            '<p class="w-[611px] page-sub text-[20px] font-semibold leading-[25.20px] mb-8">',
            '<p class="w-full md:w-[611px] page-sub text-sm md:text-[20px] font-semibold md:leading-[25.20px] mb-4 md:mb-8">'
        )
        
    # 3. Apply generic layout replacements
    replacements_applied = 0
    for target, rep in generic_replacements:
        if target in content:
            # Let's count how many times it gets replaced
            count = content.count(target)
            content = content.replace(target, rep)
            replacements_applied += count
            
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    print(f"Updated {fpath}: Style Added={style_added}, Layout Replacements Applied={replacements_applied}")
