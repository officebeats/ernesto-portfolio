import re

html_path = r'C:\Users\admin-beats\OneDrive\xo Vibe Coding xo\ernesto-portfolio\index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

old_script = """      function openVideoLightbox(src) {
        var lb = document.getElementById('img-lightbox');
        document.getElementById('lightbox-img').style.display = 'none';
        var vid = document.getElementById('lightbox-video');
        vid.style.display = 'block';
        vid.src = src;
        vid.play();
        lb.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }"""

new_script = """      function openVideoLightbox(src) {
        var lb = document.getElementById('img-lightbox');
        document.getElementById('lightbox-img').style.display = 'none';
        var vid = document.getElementById('lightbox-video');
        vid.style.display = 'block';
        vid.src = src;
        lb.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Safely play video so exceptions (e.g., Chrome autoplay blocks) don't break the UI
        var playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise.catch(function(error) {
            console.log('Video autoplay blocked or delayed by browser.', error);
          });
        }
      }"""

# Update JS if it's there
if old_script in html:
    html = html.replace(old_script, new_script)
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print("Video script safely updated!")
else:
    print("Could not find the target script!")
