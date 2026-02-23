import re

html_path = r'C:\Users\admin-beats\OneDrive\xo Vibe Coding xo\ernesto-portfolio\index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add video element to lightbox
old_lightbox = '<img id="lightbox-img" src="" alt="Certificate" />'
new_lightbox = """<img id="lightbox-img" src="" alt="Certificate" />
        <video id="lightbox-video" src="" controls style="display:none; max-height:90vh; max-width:90vw; border-radius:12px; z-index:1001; position:relative;" onclick="event.stopPropagation()"></video>"""
html = html.replace(old_lightbox, new_lightbox)

# 2. Update the script at the bottom
old_script = """      function openLightbox(src) {
        var lb = document.getElementById('img-lightbox');
        var img = document.getElementById('lightbox-img');
        img.src = src;
        lb.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
      function closeLightbox() {
        var lb = document.getElementById('img-lightbox');
        lb.style.display = 'none';
        document.body.style.overflow = '';
      }"""

new_script = """      function openLightbox(src) {
        var lb = document.getElementById('img-lightbox');
        document.getElementById('lightbox-video').style.display = 'none';
        document.getElementById('lightbox-video').pause();
        var img = document.getElementById('lightbox-img');
        img.style.display = 'block';
        img.src = src;
        lb.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
      
      function openVideoLightbox(src) {
        var lb = document.getElementById('img-lightbox');
        document.getElementById('lightbox-img').style.display = 'none';
        var vid = document.getElementById('lightbox-video');
        vid.style.display = 'block';
        vid.src = src;
        vid.play();
        lb.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }

      function closeLightbox() {
        var lb = document.getElementById('img-lightbox');
        lb.style.display = 'none';
        document.body.style.overflow = '';
        var vid = document.getElementById('lightbox-video');
        vid.pause();
        vid.src = '';
        document.getElementById('lightbox-img').src = '';
      }"""

html = html.replace(old_script, new_script)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print('Lightbox updated with video support')
