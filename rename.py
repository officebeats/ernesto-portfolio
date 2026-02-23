html_path = r'C:\Users\admin-beats\OneDrive\xo Vibe Coding xo\ernesto-portfolio\index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('Antigravity Brain', 'Antigravity Kit')
html = html.replace('Google Antigravity', 'Google Antigravity')  # keep this as-is

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print('Renamed to Antigravity Kit')
