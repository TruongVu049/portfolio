# Portfolio

A single-page developer portfolio built with React, Vite, Tailwind CSS v4, Framer Motion, GSAP and react-three-fiber.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Make it yours

Content lives in `src/data/`; no component changes are needed. Lines marked `TODO` still hold placeholders.

- **`profile.js`**: name, role, tagline, location, email, socials, résumé link, about text, experience, engineering notes and footer copy
- **`projects.js`**: featured projects and their case studies (overview, role, challenges, architecture, results)
- **`expertise.js`**: skills grouped by depth of experience, linked to the projects that used them
- **Skill bubbles**: `src/components/skills/skills.data.js`
- **Résumé**: put your CV at `public/resume.pdf` (or set `PROFILE.resumeUrl` to `''` to hide the button)
- **Contact form**: create a key at [web3forms.com](https://web3forms.com), copy `.env.example` to `.env`, and set `VITE_WEB3FORMS_KEY`

For company projects, describe only your own contribution and never publish source code, customer data or internal
documents without permission.

## Sections

| Section | File | Highlights |
| --- | --- | --- |
| Hero | `components/hero/` | positioning, résumé and social links, typing terminal, draggable 3D lanyard (Rapier physics) |
| Featured projects | `components/projects/` | list and detail card linking to a case study page per project |
| Case study | `components/projects/CaseStudy.jsx` | overview, role, challenges and solutions, architecture flow, results; served at `#/work/<slug>` |
| Technical expertise | `components/skills/` | skills grouped by experience level, plus a 2D bubble pit (poke, drag, flick) |
| Marquee | `components/marquee/` | draggable text looping along a curved path |
| Experience | `components/experience/` | alternating career timeline with a scroll-driven line |
| About | `components/about/` | profile card, scroll-revealed intro, the three strengths, what I am learning |
| Engineering notes | `components/notes/` | technical articles, marked "In draft" until they have a URL |
| Contact | `components/contact/` | validated form and a cursor-reactive 3D blob |
| Footer | `components/footer/` | navigation and oversized name |

Case studies use hash routes, so the site deploys to any static host without rewrite rules.

The theme toggle switches dark and light themes with a circular View Transition. Scrolling is smoothed by Lenis.

## Fonts

All fonts are free: Instrument Serif, DM Serif Display and Mrs Saint Delafield come from Google Fonts, and Supreme comes from Fontshare.
