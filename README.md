# Ghufron Portfolio

Personal portfolio site built with Vite + React + TypeScript. Includes core
portfolio sections plus a blog/admin flow backed by Supabase.

## Features

- Landing page with smooth scroll animations
- Portfolio sections: About, Projects, Skills, Education, Contact
- Blog + admin/editor screens (Supabase-backed)
- Responsive layout and theming

## Tech Stack

- Vite
- React + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase

## Getting Started

Prereqs: Node.js 18+ and npm.

```sh
npm install
npm run dev
```

Build and preview:

```sh
npm run build
npm run preview
```

## Environment

Create a `.env` file in the project root when using Supabase features:

```sh
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```
