# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio site for Ernesto Rodriguez (ernest0.com) — a zero-dependency, PWA-enabled single-page application built with vanilla HTML, CSS, and JavaScript. Deployed on GitHub Pages.

## Architecture

**No build system.** Files are served directly — no bundler, transpiler, or asset pipeline.

- `index.html` — The entire app: all sections, navigation, modals, inline scripts, meta/SEO tags, and Content Security Policy
- `styles.css` — Full design system: CSS custom properties for light/dark theming, responsive layout via CSS Grid, animations, and all component styles (~1,250 lines)
- `app.js` — Three features: scroll-reveal via IntersectionObserver, theme toggle (persisted to localStorage), mobile hamburger menu
- `sw.js` — Service Worker with stale-while-revalidate for core assets, cache-first for media. Cache version: `ernesto-portfolio-v1.1`
- `manifest.json` — PWA manifest (standalone display, app shortcuts, maskable icon)
- `logos/` — All images: company logos, certificate PNGs, PWA icon

## Testing

Playwright is the only dev dependency. Tests load the site via `file://` protocol (no dev server needed).

```bash
# Install Playwright browsers (first time)
npx playwright install

# Run all tests
npx playwright test

# Run a single test file
npx playwright test tests/layout.test.ts
npx playwright test tests/regression.spec.js

# Run with UI mode
npx playwright test --ui

# View last HTML report
npx playwright show-report
```

**Test files:**
- `tests/layout.test.ts` — Hero layout validation: emphasis line wrapping, logo bar fold position, BCG Green color correctness (#009270 / rgb(0,146,112)), grid ratio (2:1), element alignment
- `tests/regression.spec.js` — Feature regression: certificate modal open/close/Escape/overlay, data attributes, body scroll lock, logo bar items, footer styling, publications heading. **Note:** this file uses a hardcoded `file:///` path that may need updating for your environment.

**Config:** `playwright.config.ts` — Chromium only, 1280x768 viewport, HTML reporter, 2 retries on CI.

## Design System

**Brand color:** BCG Green `#009270` (light mode accent), `#00d28d` (dark mode accent).

**Theming:** CSS custom properties on `:root` / `[data-theme="dark"]`. Key variables: `--bg`, `--accent`, `--text`, `--text-secondary`, `--border`.

**Typography:** Inter via Google Fonts, fluid sizing with `clamp()`, tight letter-spacing (-0.02em to -0.04em).

**Responsive breakpoints:** 480px, 640px, 768px, 860px (hero grid splits), 960px, 1024px. Mobile-first approach.

**Key CSS classes:** `.hero-grid` (2fr/1fr), `.domain-grid` (1→2→4 columns), `.experience-grid` (4fr/8fr sidebar), `.logo-bar` (infinite marquee), `.reveal` (scroll-triggered fade-in, activated by `.visible`).

## Deployment

GitHub Pages with custom domain `ernest0.com` (CNAME file). The `index.html` contains a canonical URL enforcer that redirects non-local traffic to ernest0.com.

## Gotchas

- Modal/lightbox functions are defined inline in `index.html`, not in `app.js`
- `regression.spec.js` has a hardcoded Windows `file:///` path (unlike `layout.test.ts` which uses `path.resolve`)
- The logo marquee animation intentionally overrides `prefers-reduced-motion`
- Service Worker cache must be version-bumped in `sw.js` when changing core assets
- CSS specificity: the hobbies grid uses `#hobbies` ID selector to override competing rules
