# Repository Guidelines

## Project Structure & Module Organization

```
src/
├── components/       # Reusable UI components
│   ├── layouts/      # Page layout components
│   └── ui/           # shadcn/ui primitives
├── data/             # Static content (projects, experience, etc.)
├── hooks/            # Custom React hooks
├── integrations/     # Third-party service clients
│   └── supabase/     # Supabase client & queries
├── lib/              # Utility functions
└── pages/            # Route-level page components
public/               # Static assets (images, favicon, fonts)
supabase/             # Supabase migrations & edge functions
```

## Build, Test, and Development Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check then production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run build:dev` | Build in development mode (no minification) |
| `npm run lint` | Run ESLint on all `.ts`/`.tsx` files (zero warnings) |

No test suite is configured yet. Run `npm run build` before pushing to verify no type errors.

## Coding Style & Naming Conventions

- **TypeScript** strict mode via `tsconfig.json`
- **ESLint** with `eslint.config.js` — zero warnings tolerated
- **Tailwind CSS** for all styling; no separate CSS files
- Components use `PascalCase` filenames; hooks use `useCamelCase`
- Utilities and data files use `kebab-case`
- shadcn/ui components live under `src/components/ui/` and follow the library conventions

## Testing Guidelines

No test framework is currently configured. All verification is done manually in the browser and via `npm run build` type-checking. Add tests when a critical path (e.g., Supabase integration, form validation) grows complex enough to warrant it.

## Commit & Pull Request Guidelines

- Commit messages are informal, descriptive, and lowercase — follow the repo existing style (e.g., `fix favicon issue`, `update mobile responsive`)
- Keep commits focused on a single logical change
- PRs should include a brief description of what changed and why
- Link related issues in the PR body when applicable

## Agent Skills

### Issue tracker

GitHub Issues on `Ghufrnainun/My-Porto-Guwe`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — root `CONTEXT.md` + `docs/adr/`. See `docs/agents/domain.md`.
