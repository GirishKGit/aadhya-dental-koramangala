# Aadhya Dental Care — Koramangala Branch

Premium dental clinic website prototype for Aadhya Dental Care, Koramangala, Bangalore.

## 🚀 Quick Start

```bash
# Using any static server
npx -y http-server -p 8080 -o

# Or simply open index.html in a browser
```

## 📁 Project Structure

```
aadhya-dental-koramangala/
├── index.html          # Main page (SEO-optimized, Schema.org JSON-LD)
├── styles.css          # Design system (BEM methodology, responsive, accessible)
├── script.js           # Interactivity + structured logging + error tracking
├── 404.html            # Custom branded error page
├── robots.txt          # Search engine crawl directives
├── sitemap.xml         # XML sitemap for indexing
├── .gitignore          # Git ignore rules
├── .editorconfig       # Code formatting consistency
└── README.md           # This file
```

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#1A2F3A` (Deep Teal) | Backgrounds, headings |
| Accent  | `#C4956A` (Warm Gold) | CTAs, highlights |
| Sage    | `#4A8B7F` (Sage Green) | Subtle accents |
| Body Font | Inter | Body text |
| Heading Font | Playfair Display | Headings |

## 🔍 SEO Features

- Schema.org **Dentist** structured data (JSON-LD)
- Open Graph + Twitter Card meta tags
- Canonical URL, keywords, robots directives
- XML Sitemap + robots.txt
- Semantic HTML with proper heading hierarchy

## ♿ Accessibility (WCAG 2.2 AA)

- Skip-to-content link for keyboard users
- `prefers-reduced-motion` support
- `focus-visible` keyboard focus indicators
- ARIA roles and landmarks (`role="banner"`, `<main>`)
- Screen-reader-only utility class

## 📊 Logging & Analytics

- Structured console logging with module tags (`[NAV]`, `[CAROUSEL]`, etc.)
- Global error handler (`window.onerror`, `unhandledrejection`)
- CTA click event tracking (Book Appointment, Call Now, etc.)
- Web Vitals performance reporting
- Google Analytics 4 placeholder (uncomment + add your ID)

## 🚀 Deployment

Currently deployed via GitHub Pages:
**https://girishkgit.github.io/aadhya-dental-koramangala/**

### To deploy elsewhere:
1. Upload all files to any static hosting (Netlify, Vercel, etc.)
2. Uncomment GA4 snippet in `<head>` and replace `GA_MEASUREMENT_ID`
3. Update canonical URL and sitemap to match your domain

## 📋 Production Checklist

- [x] SEO meta tags & structured data
- [x] Open Graph & Twitter Cards
- [x] Accessibility (skip nav, focus, reduced motion)
- [x] Structured logging & error tracking
- [x] robots.txt & sitemap.xml
- [x] Custom 404 page
- [x] .gitignore & .editorconfig
- [ ] Custom domain setup
- [ ] Google Analytics activation
- [ ] Google Search Console verification

## 📄 License

© 2025 Aadhya Dental Care. All rights reserved.
