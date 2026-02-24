import os

css_path = r'c:\Users\admin-beats\OneDrive\xo Vibe Coding xo\beats-pm-antigravity-brain\2. Products\Portfolio_Website\code\styles.css'

with open(css_path, 'r', encoding='utf-8', errors='replace') as f:
    lines = f.readlines()

# Keep lines before @layer corruption (line 1040 = index 1040)
clean_lines = lines[:1040]

# Append clean modal + footer styles
modal_and_footer_css = """
/* ═══════════ Modal System ═══════════ */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 2rem;
}

.modal-content {
  background: var(--bg);
  border: 1px solid var(--border);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 3rem;
  position: relative;
  border-radius: 4px;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
}

.close-button {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  font-size: 2rem;
  cursor: pointer;
  color: var(--text-dim);
  line-height: 1;
  transition: color 0.2s;
}

.close-button:hover {
  color: var(--text);
}

.modal-content h3 {
  font-family: var(--font-display);
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: var(--text);
}

.modal-content p,
.modal-content div#modal-body {
  color: var(--text-dim);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

#modal-image-container {
  margin: 2rem 0;
  border: 1px solid var(--border);
  overflow: hidden;
  background: #fff;
}

#modal-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}

.modal-open {
  overflow: hidden;
}

.cred-item a.modal-trigger {
  text-decoration: none;
  color: inherit;
  display: block;
  cursor: pointer;
}

.cred-item a.modal-trigger:hover {
  border-color: var(--primary);
}

/* ═══════════ Footer — BCG Green ═══════════ */
.footer {
  background-color: #009270;
  color: #fff;
}

.footer h2,
.footer p,
.footer a,
.footer .footer-attribution {
  color: #fff;
}

.footer a:hover {
  opacity: 0.8;
}

.footer .ag-logo {
  fill: #fff;
}
"""

clean_lines.append(modal_and_footer_css)

with open(css_path, 'w', encoding='utf-8') as f:
    f.writelines(clean_lines)

print("CSS fixed successfully. Total clean lines:", len(clean_lines))
