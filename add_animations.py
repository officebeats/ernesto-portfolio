import sys

def modify_html(filepath):
    print(f"Reading {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Hero
    content = content.replace('<section class="hero" id="top">', '<section class="hero bg-mesh-light" id="top">')
    if '<section class="hero" id="top">' not in content:
        content = content.replace('<section class="hero">', '<section class="hero bg-mesh-light" id="top">')
        
    content = content.replace('<div class="hero-content">', '<div class="hero-content reveal-blur stagger-parent">')
    content = content.replace('<p class="eyebrow">', '<p class="eyebrow stagger-item">')
    content = content.replace('<h1 class="hero-title">', '<h1 class="hero-title stagger-item">')
    content = content.replace('<p class="hero-body">', '<p class="hero-body stagger-item">')
    content = content.replace('<div class="hero-actions">', '<div class="hero-actions stagger-item">')
    content = content.replace('<div class="hero-aside">', '<div class="hero-aside reveal-right">')
    
    # Metrics
    content = content.replace('<div class="metric-stack">', '<div class="metric-stack stagger-parent">')
    content = content.replace('<div class="metric">', '<div class="metric stagger-item">')

    # Logos
    content = content.replace('<div class="logo-bar" aria-label="Companies I\'ve worked with">', '<div class="logo-bar reveal" aria-label="Companies I\'ve worked with">')
    
    # General About Left / About Right
    content = content.replace('<div class="about-left">', '<div class="about-left reveal-left">')
    content = content.replace('<div class="about-right">', '<div class="about-right stagger-parent reveal-right">')
    content = content.replace('<div class="about-right foundation-content">', '<div class="about-right foundation-content reveal-blur stagger-parent\">')
    
    # Specific Sections
    content = content.replace('<section class="section section-foundation" id="foundation">', '<section class="section section-foundation bg-mesh-light" id="foundation">')
    
    # Expertise / Domains
    content = content.replace('<section class="section section-dark" id="domains">', '<section class="section section-dark bg-mesh-dark" id="domains">')
    content = content.replace('<div class="domain-grid">', '<div class="domain-grid stagger-parent">')
    content = content.replace('<div class="domain-card">', '<div class="domain-card stagger-item">')
    # Prevent nested stagger-parent issue for hobbies if any, but since we replace exact strings it's fine
    
    # Credentials
    content = content.replace('<section class="section cred-section" id="credentials" style="background: #111; color: #fff; padding-bottom: 6rem;">', '<section class="section cred-section bg-mesh-dark" id="credentials" style="background: #111; color: #fff; padding-bottom: 6rem;">')
    content = content.replace('<div class="cred-item">', '<div class="cred-item stagger-item">')

    # Side Project
    content = content.replace('<section class="section section-dark" id="antigravity" style="padding-top: 6rem; padding-bottom: 6rem; border-bottom: 1px solid var(--border);">', '<section class="section section-dark bg-mesh-dark" id="antigravity" style="padding-top: 6rem; padding-bottom: 6rem; border-bottom: 1px solid var(--border);">')
    
    # Community
    content = content.replace('<section class="section" id="chicago" style="padding-top: 6rem; padding-bottom: 6rem;">', '<section class="section bg-gradient-subtle" id="chicago" style="padding-top: 6rem; padding-bottom: 6rem;">')

    # Hobbies
    content = content.replace('<section class="section" id="hobbies" style="background-color: var(--bg-card); padding-top: 6rem; padding-bottom: 8rem;">', '<section class="section bg-mesh-light" id="hobbies" style="background-color: var(--bg-card); padding-top: 6rem; padding-bottom: 8rem;">')
    content = content.replace('<div class="domain-grid bento-hobbies"', '<div class="domain-grid bento-hobbies stagger-parent"')
    content = content.replace('<div class="domain-card bento-card"', '<div class="domain-card bento-card stagger-item"')
    content = content.replace('<div class="domain-card bento-card row-span-1"', '<div class="domain-card bento-card row-span-1 stagger-item"')

    # Experience Items
    content = content.replace('<div class="exp-item">', '<div class="exp-item stagger-item">')

    print(f"Writing to {filepath}...")
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print('DOM Manipulation Complete')

modify_html('C:/Users/admin-beats/OneDrive/xo Vibe Coding xo/ernesto-portfolio/ernesto-portfolio/index.html')
