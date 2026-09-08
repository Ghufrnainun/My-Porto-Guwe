# Ghufron Ainun Najib — Portfolio

> Full-stack developer. Web products, built end to end.

**Live Website:** [ghufronainun.tech](https://ghufronainun.tech/)

[![Portfolio Preview](public/og-image.png)](https://ghufronainun.tech/)

---

## Overview

This repository houses the personal portfolio, engineering case studies, and technical writing log of **Ghufron Ainun Najib**.

The site departs from generic developer templates, adopting an **editorial minimalist** design language with typography-first hierarchy, refined surfaces, deliberate whitespace, and calibrated motion. Built with React 18, TypeScript, Vite, and Tailwind CSS.

---

## Highlights

- **Editorial Design Language**: Asymmetric grid layouts, disciplined negative space, and curated typographic contrast between *Playfair Display* (serif), *Plus Jakarta Sans* (sans), *Space Grotesk* (display), and *JetBrains Mono* (monospace).
- **Fluid Motion & Lenis Scroll**: Smooth transitions and scroll-driven revelations orchestrated with Framer Motion and Lenis scrolling.
- **Calibrated Dual-Mode Theming**: Custom-mapped warm espresso dark mode (`#050505` / `hsl(20 10% 6%)`) and warm cream light mode (`hsl(30 20% 98%)`) with semantic HSL design tokens.
- **Full SEO & Structured Data**: Per-route metadata with dynamic Open Graph, Twitter Cards, JSON-LD schemas (`Person` & `WebSite`), and a build-time sitemap generator.
- **Full-Bleed Case Studies**: Dedicated project walk-throughs documenting architecture, technical constraints, team roles, and outcomes.
- **Supabase Integration**: Type-safe client queries and database schemas with Row-Level Security (RLS) for the writing log and administrative management.

---

## Selected Projects

### [TempeMail](https://github.com/Ghufrnainun/tempe-mail)
*Solo Developer · 2026 · [Live Demo](https://temp.atminku.my.id)*
- Disposable email service running entirely on the Cloudflare Workers edge.
- Multi-domain auto-provisioning across 20+ live domains with zero server cost.
- Features a REST API, HMAC-signed webhook delivery, D1 SQLite storage, and a native MCP server for AI agents.
- **Stack**: TypeScript, Cloudflare Workers, Hono, Cloudflare D1.

### [SewaInAja](https://github.com/sewainaja-pbl)
*Full-Stack Developer (4-person team) · 2026*
- Comprehensive rental platform connecting renters, owners, and administrators into a cohesive workflow.
- Spans a customer-facing Flutter mobile application and a Next.js 16 administration and API surface.
- Integrated Firebase services and Midtrans payment processing.
- **Stack**: Flutter, Next.js 16, TypeScript 5, Firebase, Midtrans.

### LSP Polines Certification Platform
*Team Lead (5-person team) · 2025*
- Certification management portal developed for Semarang State Polytechnic.
- Led five engineers through system analysis, database design, and sprint delivery.
- Designed authentication architecture and established repository branching strategies.
- **Stack**: Laravel, Livewire, Tailwind CSS, MySQL.

### [IMPP Organization Website](https://imppolines.my.id/)
*Solo Developer · 2025*
- Public website and custom content management system for Ikatan Mahasiswa Pemalang Polines.
- Built independent administration interfaces for publishing activities, organizational structure, and photo galleries.
- **Stack**: Laravel, Tailwind CSS, MySQL.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript 5, Vite 5 (SWC) |
| **Styling & UI** | Tailwind CSS 3, Radix UI Primitives, Lucide Icons |
| **Motion & Scroll** | Framer Motion 12, Lenis Scroll |
| **Data & State** | Supabase JS (`@supabase/supabase-js`), TanStack Query 5 |
| **Rich Text** | Tiptap Editor (`@tiptap/react`) |
| **Asset & Build Tools** | Sharp, to-ico, Node.js Sitemap Generator |

---

## Project Structure

```
.
├── public/                  # Static assets & metadata
│   ├── favicon.svg          # Canonical adaptive vector brand favicon
│   ├── favicon.ico          # Multi-resolution fallback icon (16/32/48)
│   ├── apple-touch-icon.png # iOS home screen icon (180x180)
│   ├── og-image.png         # Open Graph / Twitter share hero (1200x630)
│   ├── robots.txt           # Crawler indexing policy
│   ├── sitemap.xml          # Generated XML sitemap
│   └── _redirects           # SPA routing fallback for edge hosts
├── scripts/
│   ├── build-brand-assets.mjs # High-DPI brand asset & OG image generator
│   └── generate-sitemap.mjs   # Route-discovery sitemap generator
├── src/
│   ├── components/          # Reusable UI & section components
│   │   ├── layouts/         # Page layout wrappers
│   │   └── ui/              # Primitive components & design tokens
│   ├── data/                # Static data layers (projects, profile)
│   ├── hooks/               # Custom hooks (SEO, auth, theme)
│   ├── integrations/        # Third-party integrations (Supabase)
│   ├── lib/                 # Utility functions & helpers
│   ├── pages/               # Route components
│   ├── App.tsx              # Root component & route definitions
│   └── main.tsx             # Application mount point
├── supabase/                # Database migrations & storage policies
├── index.html               # Semantic HTML shell, preloader & meta tags
├── tailwind.config.ts       # Tailwind CSS theme extension
└── tsconfig.json            # TypeScript strict configuration
```

---

## Local Development

### Prerequisites

- **Node.js**: `18.x` or higher (tested with Node 20 and 24)
- **Package Manager**: `npm`

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ghufrnainun/My-Porto-Guwe.git
   cd My-Porto-Guwe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:8080](http://localhost:8080) in your browser.

### Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts Vite dev server with Hot Module Replacement |
| `npm run build` | Generates sitemap, runs `tsc` type check, and compiles to `dist/` |
| `npm run preview` | Serves the local production build for testing |
| `npm run lint` | Runs ESLint across all TypeScript and React files |

---

## Deployment

The project compiles to static assets in `dist/`. SPA routing rewrites are configured in `public/_redirects` for Cloudflare Pages, Netlify, or Vercel.

Production builds automatically run the sitemap generator before compilation:
```bash
npm run build
```

---

## License

This project is licensed under the [MIT License](LICENSE).

---

© 2026 [Ghufron Ainun Najib](https://github.com/Ghufrnainun). All rights reserved.
