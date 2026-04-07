# Copilot Instructions for Shahid's Signature Site

## Project Overview

This is the personal engineering portfolio of Shahid Moosa — a Distributed Systems Engineer. The site is a static single-page application (SPA) built with React 18, TypeScript, and Vite, deployed to Firebase Hosting.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v3, Shadcn UI (Radix UI primitives), `tailwind-merge`, `class-variance-authority`
- **Animation**: Framer Motion
- **Routing**: React Router v6 (`react-router-dom`)
- **SEO**: `react-helmet-async`, custom JSON-LD structured data, dynamic sitemap & RSS feed generation
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **State / Data Fetching**: TanStack React Query
- **Testing**: Vitest + jsdom + Testing Library
- **Linting**: ESLint 9 (flat config), `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- **Deployment**: Firebase Hosting

## Project Structure

```
src/
├── assets/        # Static assets (images, logos)
├── components/
│   ├── layout/    # Header, Footer components
│   ├── sections/  # Page sections (Hero, Writing, Work, etc.)
│   ├── seo/       # SEO / metadata components (Seo.tsx, JSON-LD)
│   └── ui/        # Reusable Shadcn UI primitives
├── data/          # Static content (articles.ts, site config)
├── hooks/         # Custom React hooks
├── lib/           # Utility functions (RSS, sitemap, utils)
├── pages/         # Route-level components (Index, BlogPost, NotFound)
├── test/          # Test helpers, stubs, and test files
└── App.tsx        # Application entry point and routing
scripts/           # Build-time scripts (SEO generation, sitemap)
```

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server
npm run build        # Generate SEO assets then build for production (dist/)
npm run build:dev    # Build in development mode
npm run lint         # Run ESLint
npm run test         # Run Vitest (single run)
npm run test:watch   # Run Vitest in watch mode
npm run seo:generate # Run scripts/generate-seo.ts only
firebase deploy      # Deploy to Firebase Hosting
```

## Coding Conventions

- **Language**: TypeScript everywhere. Follow the current repository TypeScript configuration; the project is not currently using strict mode, so do not assume strict-only checks are enabled unless the TS configs are updated.
- **Components**: Functional components with hooks only. No class components.
- **Exports**: Named exports for components; default export only for route-level page components.
- **Styling**: Use Tailwind CSS utility classes. Use `cn()` from `src/lib/utils.ts` (wraps `clsx` + `tailwind-merge`) to conditionally merge classes.
- **Shadcn UI**: Prefer composing from existing primitives in `src/components/ui/` before adding new ones.
- **Imports**: Use the `@/` alias (mapped to `src/`) for all internal imports.
- **No comments** unless they explain non-obvious logic; prefer self-documenting names instead.
- **ESLint**: `eslint-plugin-react` is **not** installed — do not add `react/*` rules. Only `react-hooks` and `react-refresh` plugins are active.

## SEO & Security

- Embed JSON-LD structured data as a `<script>` tag **outside** of `react-helmet-async` (Helmet does not inject `dangerouslySetInnerHTML` scripts in jsdom).
- **Always** use `safeJsonStringify` (defined in `src/components/seo/Seo.tsx`) when interpolating JSON into `<script>` tags to prevent XSS via Unicode-escaping of `<`, `>`, `&`, and `'`.

## Testing

- Test files live alongside source files (`src/**/*.test.{ts,tsx}`) or under `src/test/`.
- Vitest runs with `globals: true` in jsdom; no need to import `describe`/`it`/`expect`.
- `src/test/setup.ts` configures Testing Library matchers.
- Stubs for Next.js modules (`next/navigation`, `next/link`, `next/script`) live in `src/test/__stubs__/` — these exist to allow testing of any migrated Next.js code.
- When testing components that use `react-router-dom`, wrap them in a `<MemoryRouter>`.
- When testing components that use `react-helmet-async`, wrap them in a `<HelmetProvider>`.

## Pull Request Guidelines

- Keep changes focused and minimal — one logical concern per PR.
- Ensure `npm run lint` and `npm run test` pass before requesting review.
- Update `src/data/` content files (not component logic) when changing site copy or blog posts.
