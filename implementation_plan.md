# Implementation Plan: Portfolio Optimization & Refinement

## 1. Top Navigation Updates

- **Action**: Remove the "Resume" link from the `.nav-links` block.
- **Action**: Replace the "Get in touch" CTA button with the "Resume" button (linking to `Ernesto_Rodriguez_Resume.pdf`) and position it top-right.

## 2. Hero Section & Avatar

- **Action**: Update `object-position` in `.hero-avatar` CSS to `center 15%` to firmly center the user's face within the rectangular frame instead of it cutting off abruptly.
- **Action**: We previously drastically reduced the file size of the image `profile-full.jpg` from 5MB+ to a few KB using bicubic filtering and 400px width. That covers the load time issue. We will verify load performance in Chrome.

## 3. Logo Bar Sub-Hero Placement & Animation

- **Action**: Move the `<section class="logo-bar">` up into the bottom of the `.hero` HTML block or greatly reduce vertical padding in `.hero` so the logo bar always sits comfortably entirely above the fold on desktop.
- **Action**: Make the Logo Bar self-animating under all OS settings. Override overriding OS-level accessibility flags (`prefers-reduced-motion`) just for the marquee via CSS, as the user indicated it "isn't auto animated" which happens on Windows machines with animations turned off locally.

## 4. Final Verification

- **Action**: Use a browser subagent instance to open `https://officebeats.github.io/ernesto-portfolio/` in Chrome. Wait for 5 seconds to ensure animations, assets, and logo scalings are visually checked as FAANG-tier.
