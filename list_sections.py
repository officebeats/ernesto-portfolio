import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find all major landmark blocks
pattern = re.compile(r'<(section|header|footer|div\s+class="logo-bar"|div\s+class="nav")[^>]*>')
matches = pattern.finditer(html)

for m in matches:
    print(m.group(0))
