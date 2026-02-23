css_path = r'c:\Users\admin-beats\OneDrive\xo Vibe Coding xo\beats-pm-antigravity-brain\2. Products\Portfolio_Website\code\styles.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Find and reduce --section-pad
import re
match = re.search(r'--section-pad:\s*([^;]+);', css)
if match:
    old_val = match.group(1)
    print(f'Current --section-pad: {old_val}')
    # Reduce it - typically it's something like 6rem or 8rem, cut it roughly in half
    css = css.replace(f'--section-pad: {old_val};', '--section-pad: 3rem;')
    print('Set to 3rem')

# Also reduce any explicit section gaps/margins
# Reduce credentials-grid and about-grid gaps
css = css.replace('gap: 6rem', 'gap: 3rem')
css = css.replace('gap: 5rem', 'gap: 2.5rem')
css = css.replace('gap: 4rem', 'gap: 2rem')

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)
print('Sections compacted')
