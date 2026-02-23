import os

html_path = r'C:\Users\admin-beats\OneDrive\xo Vibe Coding xo\ernesto-portfolio\index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the line with "Universal Modal Structure" or the old modal
cut_line = None
for i, line in enumerate(lines):
    if 'Universal Modal' in line or 'universal-modal' in line:
        # Go back one line to capture the comment
        cut_line = i - 1 if '<!--' in lines[i-1] else i
        break

if cut_line is None:
    print("ERROR: Could not find modal section")
    exit(1)

print(f"Cutting at line {cut_line}")

# Keep everything before modal
clean = lines[:cut_line]

# Append the new simplified lightbox + rest of page
new_content = """
      <!-- Image Lightbox -->
      <div id="img-lightbox" class="lightbox" onclick="closeLightbox()">
        <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
        <img id="lightbox-img" src="" alt="Certificate" onclick="event.stopPropagation()" />
      </div>

      <!-- Credentials -->
      <section id="credentials" class="section section-dark">
        <div class="container credentials-grid">
          <div>
            <p class="section-label">Credentials</p>
            <h2 class="section-heading">
              Certifications<br /><em>& training.</em>
            </h2>
          </div>
          <div class="cred-list">
            <div class="cred-item" onclick="openLightbox('logos/ai-pm-cert.png')" style="cursor:pointer">
              <h3>Gen AI Product Management Specialization</h3>
              <p>Microsoft &middot; 2025</p>
            </div>
            <div class="cred-item" onclick="openLightbox('logos/design-sprint-cert.png')" style="cursor:pointer">
              <h3>GV Design Sprint Certified</h3>
              <p>AJ &amp; Smart (Jake Knapp) &middot; 2019</p>
            </div>
            <div class="cred-item" onclick="openLightbox('logos/csm-cert.png')" style="cursor:pointer">
              <h3>Certified Scrum Master</h3>
              <p>3Back &middot; 2015</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Publications -->
      <section id="writing" class="section">
        <div class="container credentials-grid">
          <div>
            <p class="section-label">Thought Leadership</p>
            <h2 class="section-heading">Publications</h2>
          </div>
          <div class="cred-list">
            <div class="cred-item">
              <h3>How to Overcome AR Challenges: A Guide for Product Managers</h3>
              <p>Product School &middot; 2023</p>
              <a href="https://productschool.com/product-leaders/ernesto-rodriguez" target="_blank" rel="noopener" class="link-arrow">Read on Product School &rarr;</a>
            </div>
            <div class="cred-item">
              <h3>Creative Passions in the Workplace</h3>
              <p>TEDx &middot; 2016</p>
              <a href="https://www.youtube.com/watch?v=Sv3IN8D4AoI&t=74s" target="_blank" rel="noopener" class="link-arrow">Watch TEDx Talk &rarr;</a>
            </div>
          </div>
        </div>
      </section>

      <hr class="divider container" />

      <!-- Side Project -->
      <section class="section">
        <div class="container about-grid">
          <div class="about-left">
            <p class="section-label">Side Project</p>
            <h2 class="section-heading"><em>Antigravity Brain</em></h2>
          </div>
          <div class="about-right">
            <p>
              Outside of work, I engineer the
              <strong>Beats PM Antigravity Brain</strong> &mdash; a local-first,
              agent-driven AI system that automates the operational chaos of
              product management. Strategy requires space; I build systems that
              create it.
            </p>
            <a href="https://x.com/officebeats" target="_blank" rel="noopener" class="link-arrow">Follow the research &rarr;</a>
          </div>
        </div>
      </section>

      <!-- Chicago -->
      <section class="section section-dark">
        <div class="container about-grid">
          <div class="about-left">
            <p class="section-label">Community</p>
            <h2 class="section-heading">Chicago<br /><em>roots.</em></h2>
          </div>
          <div class="about-right">
            <p>
              I mentor emerging product managers, speak at local tech events,
              and collaborate with Chicago startups and enterprise companies.
              Building the next generation of product leaders is part of the
              job.
            </p>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <h2>Ernesto Rodriguez</h2>
          <p>Product Leader &middot; AI &middot; Digital Transformation</p>
        </div>
        <div class="footer-links">
          <a href="https://www.linkedin.com/in/productmg/" target="_blank" rel="noopener">LinkedIn</a>
          <a href="https://x.com/officebeats" target="_blank" rel="noopener">X (Twitter)</a>
          <a href="mailto:Ernesto@ProductMG.com">Email</a>
          <a href="https://ernest0.com" target="_blank" rel="noopener">Ernest0.com</a>
        </div>
      </div>
      <div class="container footer-bottom">
        <p>&copy; 2026 Ernesto Rodriguez &middot; Ernest0.com &middot; Chicago</p>
        <p class="footer-attribution">
          Built with &#10084;&#65039; by vibecoding with Google Antigravity
          <svg class="ag-logo" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z" />
          </svg>
        </p>
      </div>
    </footer>

    <script src="app.js"></script>
    <script>
      function openLightbox(src) {
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
      }
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeLightbox();
      });
    </script>
  </body>
</html>
"""

clean.append(new_content)

with open(html_path, 'w', encoding='utf-8') as f:
    f.writelines(clean)

print(f"Done! Kept {cut_line} lines + new lightbox content")
