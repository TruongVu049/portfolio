# Portfolio

[![CI](https://github.com/TruongVu049/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/TruongVu049/portfolio/actions/workflows/ci.yml)

A single-page developer portfolio built with React 19, Vite, Tailwind CSS v4, Framer Motion, GSAP and react-three-fiber.
Case studies explain real production work with interactive diagrams instead of screenshots, so no private code or
customer data is shown.

## Getting started

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # production build in dist/
npm run lint           # ESLint (flat config, React Hooks + React Refresh rules)
npm test               # Vitest + Testing Library
npm run test:coverage  # coverage with an 80% threshold on logic and content modules
```

CI (`.github/workflows/ci.yml`) runs lint, tests with coverage and the production build on every push and pull request.

## Make it yours

Content lives in `src/data/`; no component changes are needed.

- **`profile.js`**: name, role, tagline, positioning line, location, email, socials, résumé link, about text, experience,
  engineering notes and footer copy
- **`projects.js`**: featured projects and their case studies
  - `architecture` is a list of layers, `{ layer: 'Client', nodes: ['Next.js storefront', …] }`, read top to bottom
  - `visual` picks the explainer diagram from `components/projects/visuals/` (`offline-sync`, `payment-ingestion`,
    `server-form`, `approval-routing`)
- **`expertise.js`**: skills grouped by depth of experience, linked to the projects that used them
- **Skill bubbles**: `src/components/skills/skills.data.js`
- **Résumé**: put your CV at `public/resume.pdf` and set `PROFILE.resumeUrl` to `'/resume.pdf'`. The download button then
  appears in the hero, the menu and the contact section
- **LinkedIn**: set `PROFILE.socials.linkedin`; an empty URL hides the icon everywhere
- **Engineering notes**: only notes with an `href` are shown. With none published, the section and its menu entry are
  hidden
- **Contact form**: create a key at [web3forms.com](https://web3forms.com), copy `.env.example` to `.env`, and set
  `VITE_WEB3FORMS_KEY`. The form validates input, has a honeypot against bots, and falls back to your email address
  when sending fails

`src/data/content.test.jsx` checks the content: unique slugs, complete case studies, valid architecture layers, a visual
for every project and links that point to real projects. Run `npm test` after editing data.

For company projects, describe only your own contribution and never publish source code, customer data or internal
documents without permission.

## Sections

| Section | File | Highlights |
| --- | --- | --- |
| Hero | `components/hero/` | name, positioning and buttons visible right away; typing terminal; draggable 3D lanyard (Rapier physics) |
| Featured projects | `components/projects/` | list and detail card with a compact explainer diagram, linking to a case study page per project |
| Case study | `components/projects/CaseStudy.jsx` | overview, role, challenges, "how it works" diagram, layered architecture, results; served at `#/work/<slug>` |
| Technical expertise | `components/skills/` | skills grouped by experience level, plus a 2D bubble playground (drag, flick) |
| Marquee | `components/marquee/` | draggable text looping along a curved path |
| Experience | `components/experience/` | alternating career timeline with a scroll-driven line |
| About | `components/about/` | profile card, the three strengths, current learning linked to where it was applied |
| Engineering notes | `components/notes/` | published articles only |
| Contact | `components/contact/` | résumé and social links, validated form, cursor-reactive 3D blob |
| Footer | `components/footer/` | navigation and oversized name |

Case studies use hash routes, so the site deploys to any static host without rewrite rules.

## Accessibility and motion

- `prefers-reduced-motion` is honoured throughout: Framer Motion drops transform animations (`MotionConfig`), CSS
  animations are cut, smooth scrolling (Lenis) is off, the 3D lanyard is not loaded, the marquee only moves when dragged,
  the contact blob is drawn once, and the skill bubbles appear already settled
- The bubble playground lets vertical swipes scroll the page on touch screens; the same skills are listed as text above it
- Micro-labels are at least 11 px with readable contrast in both themes

The theme toggle switches dark and light themes with a circular View Transition.

## Fonts

All fonts are free: Instrument Serif, DM Serif Display and Mrs Saint Delafield come from Google Fonts, and Supreme comes
from Fontshare.
