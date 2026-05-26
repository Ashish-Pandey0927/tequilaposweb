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

button_styles = """
      /* Slider Navigation Custom Arrows */
      #prev-button,
      #next-button {
        background-color: #ffffff !important;
        border: 1px solid #e5e7eb !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        transition: all 0.2s ease !important;
      }
      #prev-button:hover,
      #next-button:hover {
        background-color: #f3f4f6 !important;
      }
      html.dark #prev-button,
      html.dark #next-button {
        background-color: #373737 !important;
        border: 1px solid #4b5563 !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.18) !important;
      }
      html.dark #prev-button:hover,
      html.dark #next-button:hover {
        background-color: #4b5563 !important;
      }
"""

for fpath in files:
    full_path = os.path.join(root_dir, fpath)
    if not os.path.exists(full_path):
        print(f"Skipping {fpath} (does not exist)")
        continue
    
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 1. Modify the hero section immediately following <!-- hero section -->
    parts = re.split(r"(<!--\s*hero\s+section\s*-->)", content, flags=re.IGNORECASE)
    if len(parts) > 2:
        prefix = parts[0] + parts[1]
        hero_and_rest = parts[2]
        
        # Split hero_and_rest at the first </section> to isolate the hero section
        section_parts = re.split(r"(</section>)", hero_and_rest, maxsplit=1, flags=re.IGNORECASE)
        if len(section_parts) > 2:
            hero_section = section_parts[0] + section_parts[1]
            rest = section_parts[2]
            
            orig_hero = hero_section
            
            # Ensure text container has md:w-1/2
            hero_section = hero_section.replace('class="w-full lg:w-[750px] text-left"', 'class="w-full md:w-1/2 lg:w-[750px] text-left"')
            hero_section = hero_section.replace('class="w-full lg:w-[900px] text-left"', 'class="w-full md:w-1/2 lg:w-[900px] text-left"')
            
            # Replace md:w-[611px] with lg:w-[611px] so it is w-full on tablet/mobile and fixed width on desktop
            hero_section = re.sub(r'md:w-\[611px\]', 'lg:w-[611px]', hero_section)
            
            # Replace md:text-5xl, md:text-4xl, md:text-[64px], md:text-[36px] with md:text-3xl
            hero_section = re.sub(r'md:text-5xl', 'md:text-3xl', hero_section)
            hero_section = re.sub(r'md:text-4xl', 'md:text-3xl', hero_section)
            hero_section = re.sub(r'md:text-\[64px\]', 'md:text-3xl', hero_section)
            hero_section = re.sub(r'md:text-\[36px\]', 'md:text-3xl', hero_section)
            
            # Replace md:text-[20px] in paragraphs with md:text-base
            hero_section = re.sub(r'md:text-\[20px\]', 'md:text-base', hero_section)
            
            if hero_section != orig_hero:
                print(f"Modified hero section in {fpath}")
                content = prefix + hero_section + rest
            else:
                print(f"No changes in hero section of {fpath}")
        else:
            print(f"Could not split by </section> in {fpath}")
    else:
        print(f"Could not find hero section comment in {fpath}")
        
    # 2. Add custom styles for testimonial arrows in blog-two.html and dark/blog-two.html
    if "blog-two.html" in fpath:
        # We need to make sure we don't add the styles twice
        if "/* Slider Navigation Custom Arrows */" not in content:
            style_parts = content.split("</style>", 1)
            if len(style_parts) == 2:
                print(f"Adding button styles to {fpath}")
                content = style_parts[0] + button_styles + "\n</style>" + style_parts[1]
                
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Fixes completed successfully!")
