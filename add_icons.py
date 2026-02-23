import re

html_path = r'C:\Users\admin-beats\OneDrive\xo Vibe Coding xo\ernesto-portfolio\index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# The expand icon SVG in BCG Green
icon_svg = '<span class="cert-icon" title="View Certificate"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#009270" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></span>'

# Insert icon inside each cred-item that has openLightbox, right before the closing </div>
# Pattern: find cred-items with openLightbox and add icon after the <p> tag
html = re.sub(
    r'(class="cred-item"[^>]*onclick="openLightbox\([^)]+\)"[^>]*>)',
    r'\1\n              ' + icon_svg,
    html
)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

# Now add CSS for the icon
css_path = r'c:\Users\admin-beats\OneDrive\xo Vibe Coding xo\beats-pm-antigravity-brain\2. Products\Portfolio_Website\code\styles.css'

with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

if '.cert-icon' not in css:
    cert_icon_css = """

/* Certificate view icon */
.cred-item[onclick] {
  position: relative;
}

.cert-icon {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  opacity: 0.6;
  transition: opacity 0.2s, transform 0.2s;
}

.cred-item[onclick]:hover .cert-icon {
  opacity: 1;
  transform: scale(1.15);
}
"""
    # Add before footer section
    footer_marker = '/* ═══════════ Footer'
    if footer_marker in css:
        css = css.replace(footer_marker, cert_icon_css + '\n' + footer_marker)
    else:
        css += cert_icon_css

    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css)
    print('CSS updated')

print('Icons and CSS added successfully')
