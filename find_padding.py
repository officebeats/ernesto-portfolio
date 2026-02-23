css_path = r'c:\Users\admin-beats\OneDrive\xo Vibe Coding xo\beats-pm-antigravity-brain\2. Products\Portfolio_Website\code\styles.css'
with open(css_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find .section padding
for i, line in enumerate(lines):
    if '.section {' in line and 'section-' not in line:
        # Print surrounding lines to find padding
        for j in range(i, min(i+8, len(lines))):
            print(f'{j}: {lines[j].rstrip()}')
        break
