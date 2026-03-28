# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Documentation First

**Before generating any code, always check the `/docs` directory for relevant documentation.** This includes component specs, design decisions, API contracts, data models, or any other guidance that applies to the task at hand. Code must align with what is documented there. Refer following:

- /docs/ui.md
- /docs/data-fetching.md
- /docs/auth.md
- /docs/data-mutation.mdcr

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

This is a **Next.js 16 App Router** project with TypeScript and Tailwind CSS v4.

- `src/app/` — App Router directory. All routes, layouts, and pages live here.
- `src/app/layout.tsx` — Root layout; sets global fonts (Geist Sans/Mono via `next/font`) and metadata.
- `src/app/globals.css` — Global styles using Tailwind v4 with CSS variables for light/dark theming (`--background`, `--foreground`).

**Import alias:** `@/*` maps to `./src/*`.

**Styling:** Tailwind CSS v4 (PostCSS-based). Dark mode via `@media (prefers-color-scheme: dark)` CSS variables, not Tailwind's `dark:` class strategy.
