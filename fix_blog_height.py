import glob
files = glob.glob('blog-*.html') + glob.glob('dark/blog-*.html')
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    old_c1 = 'flex flex-col md:flex-row items-start justify-between gap-12'
    new_c1 = 'flex flex-col md:flex-row items-start md:items-stretch justify-between gap-12'
    
    old_c2 = 'class="w-full h-auto max-h-[500px] object-cover shadow-xl"'
    new_c2 = 'class="w-full h-auto max-h-[500px] md:max-h-none md:h-full object-cover shadow-xl"'
    
    old_c3 = 'class="w-full h-auto max-h-[500px] object-cover rounded-[32px] shadow-xl"'
    new_c3 = 'class="w-full h-auto max-h-[500px] md:max-h-none md:h-full object-cover rounded-[32px] shadow-xl"'
    
    old_c4 = 'class="w-full h-auto rounded-[32px] object-cover max-h-[500px] shadow-xl"'
    new_c4 = 'class="w-full h-auto rounded-[32px] object-cover max-h-[500px] md:max-h-none md:h-full shadow-xl"'
    
    content = content.replace(old_c1, new_c1)
    content = content.replace(old_c2, new_c2)
    content = content.replace(old_c3, new_c3)
    content = content.replace(old_c4, new_c4)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
print('Done!')
