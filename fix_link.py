html_path = r'C:\Users\admin-beats\OneDrive\xo Vibe Coding xo\ernesto-portfolio\index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

old_link = 'href="https://x.com/officebeats" target="_blank" rel="noopener" class="link-arrow">Follow the research &rarr;</a>'
new_link = 'href="https://github.com/officebeats/beats-pm-antigravity-brain/blob/main/README.md#-beats-pm-antigravity-kit" target="_blank" rel="noopener" class="link-arrow">Try It Yourself, it\'s Open Source &rarr;</a>'

html = html.replace(old_link, new_link)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print('Done')
