css_path = r'c:\Users\admin-beats\OneDrive\xo Vibe Coding xo\beats-pm-antigravity-brain\2. Products\Portfolio_Website\code\styles.css'
with open(css_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find foundation and experience related CSS
keywords = ['foundation', 'experience', 'about-grid', 'section-heading', 'section-label']
for i, line in enumerate(lines):
    low = line.lower()
    if any(k in low for k in keywords) and ('{' in line or 'padding' in low or 'margin' in low or 'gap' in low):
        print(f'{i}: {line.rstrip()}')
