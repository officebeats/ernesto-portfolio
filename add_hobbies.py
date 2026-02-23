import re

html_path = r'C:\Users\admin-beats\OneDrive\xo Vibe Coding xo\ernesto-portfolio\index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update the Modal HTML
html = html.replace('<img id="modal-image" src="" alt="Certificate" />',
                    '<img id="modal-image" src="" alt="Certificate" />\n        <video id="modal-video" src="" controls style="display:none; max-height:90vh; max-width:90vw; border-radius:12px;"></video>')

# 2. Update JavaScript Lightbox Logic
js_old = """      function openLightbox(src) {
        document.getElementById('modal-image').src = src;
        document.getElementById('cert-modal').classList.add('active');
        document.body.classList.add('modal-open');
      }

      function closeLightbox() {
        document.getElementById('cert-modal').classList.remove('active');
        document.body.classList.remove('modal-open');
        // Clear src after transition
        setTimeout(() => {
          document.getElementById('modal-image').src = '';
        }, 300);
      }"""

js_new = """      function openLightbox(src) {
        document.getElementById('modal-video').style.display = 'none';
        document.getElementById('modal-video').pause();
        var img = document.getElementById('modal-image');
        img.style.display = 'block';
        img.src = src;
        document.getElementById('cert-modal').classList.add('active');
        document.body.classList.add('modal-open');
      }

      function openVideoLightbox(src) {
        document.getElementById('modal-image').style.display = 'none';
        var vid = document.getElementById('modal-video');
        vid.style.display = 'block';
        vid.src = src;
        vid.play();
        document.getElementById('cert-modal').classList.add('active');
        document.body.classList.add('modal-open');
      }

      function closeLightbox() {
        document.getElementById('cert-modal').classList.remove('active');
        document.body.classList.remove('modal-open');
        // Clear src after transition
        setTimeout(() => {
          document.getElementById('modal-image').src = '';
          document.getElementById('modal-video').pause();
          document.getElementById('modal-video').src = '';
        }, 300);
      }"""

html = html.replace(js_old, js_new)

# 3. Add Hobbies Section before Footer
hobbies_html = """
    <!-- Hobbies Section -->
    <section id="hobbies" class="section section-dark">
      <div class="container">
        <p class="section-label">Beyond the Screen</p>
        <h2 class="section-heading">Personal Pursuits</h2>
        <div class="domain-grid">
          
          <a href="https://audius.co/officebeats_" target="_blank" rel="noopener" class="domain-card" style="text-decoration:none; color:inherit; position:relative;">
            <div class="domain-icon" aria-hidden="true" style="color:var(--accent);">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
            </div>
            <h3 class="domain-title">Audio Production & DJing</h3>
            <p class="domain-desc">Exploring sound design, producing hip hop beats, and mixing EDM.</p>
            <span class="cert-icon" style="opacity:0.6; top:1.5rem; right:1.5rem;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#009270" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg></span>
          </a>

          <div class="domain-card" onclick="openVideoLightbox('logos/vr_productivity.mp4')" style="cursor:pointer; position:relative;">
            <div class="domain-icon" aria-hidden="true" style="color:var(--accent);">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="8" rx="2" ry="2"></rect><path d="M4 12v-2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"></path><path d="M10 16v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-2"></path></svg>
            </div>
            <h3 class="domain-title">Spatial Computing</h3>
            <p class="domain-desc">Leveraging the Meta Quest Pro for deep work and extreme productivity.</p>
            <span class="cert-icon" style="opacity:0.6; top:1.5rem; right:1.5rem;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#009270" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></span>
          </div>

        </div>
      </div>
    </section>

    <!-- Footer -->"""

html = html.replace('    <!-- Footer -->', hobbies_html)

# Add nav link to hobbies
nav_old = '          <a href="#writing">Publications</a>\n        </nav>'
nav_new = '          <a href="#writing">Publications</a>\n          <a href="#hobbies">Pursuits</a>\n        </nav>'
html = html.replace(nav_old, nav_new)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print('HTML injected')
