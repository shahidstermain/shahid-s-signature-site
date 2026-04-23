# Migration Guide: Vite SPA to Next.js App Router

This guide outlines the step-by-step process to migrate the current Vite + React SPA to Next.js App Router for improved SEO and performance.

---

## Table of Contents

1. [Why Migrate?](#1-why-migrate)
2. [Migration Overview](#2-migration-overview)
3. [Phase 1: Project Setup](#3-phase-1-project-setup)
4. [Phase 2: Component Migration](#4-phase-2-component-migration)
5. [Phase 3: Routing Migration](#5-phase-3-routing-migration)
6. [Phase 4: SEO Implementation](#6-phase-4-seo-implementation)
7. [Phase 5: Deployment](#7-phase-5-deployment)
8. [Testing & Validation](#8-testing--validation)

---

## 1. Why Migrate?

### Current Architecture (Vite SPA)

```
Browser Request → index.html (empty) → JavaScript loads → React renders → Content visible
```

**SEO Issues:**
- Search engines may not execute JavaScript
- Social crawlers (Twitter, Facebook) see empty page
- No server-rendered HTML for fast indexing
- Meta tags injected client-side may not be crawled

### Target Architecture (Next.js SSG)

```
Browser Request → Pre-rendered HTML (with content + meta) → JavaScript hydrates → Interactive
```

**SEO Benefits:**
- Full HTML content available immediately
- Meta tags present in initial HTML
- Perfect for search engine crawling
- Faster First Contentful Paint (FCP)

---

## 2. Migration Overview

### Current Stack → Target Stack

| Component | Current | Target |
|-----------|---------|--------|
| Framework | Vite + React | Next.js 14+ |
| Routing | React Router | App Router |
| Rendering | Client-side (CSR) | Static (SSG) + ISR |
| Meta Tags | Client-side injection | Server-side (Metadata API) |
| Hosting | Firebase Hosting (SPA) | Firebase Hosting (Static) |

### File Structure Mapping

```
Current (Vite)                    Target (Next.js)
─────────────────────────────────────────────────────
src/
├── App.tsx                 →     app/layout.tsx
├── pages/
│   ├── Index.tsx           →     app/page.tsx
│   ├── BlogPost.tsx        →     app/blog/[slug]/page.tsx
│   ├── NotFound.tsx        →     app/not-found.tsx
│   ├── RSSFeed.tsx         →     app/rss.xml/route.ts
│   └── Sitemap.tsx         →     app/sitemap.ts
├── components/             →     components/ (mostly unchanged)
├── data/                   →     data/ (unchanged)
├── lib/                    →     lib/ (unchanged)
└── hooks/                  →     hooks/ (unchanged)
```

---

## 3. Phase 1: Project Setup

### Step 1: Initialize Next.js Project

```bash
# Create new Next.js project alongside existing
npx create-next-app@latest shahidster-next --typescript --tailwind --app --src-dir

# Or in same directory (backup first!)
npx create-next-app@latest . --typescript --tailwind --app --src-dir
```

### Step 2: Install Dependencies

```bash
# Copy dependencies from current package.json
npm install @radix-ui/react-accordion @radix-ui/react-avatar \
  @radix-ui/react-dialog @radix-ui/react-dropdown-menu \
  @radix-ui/react-navigation-menu @radix-ui/react-separator \
  @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-toast \
  @radix-ui/react-tooltip \
  class-variance-authority clsx cmdk date-fns \
  framer-motion lucide-react \
  tailwind-merge tailwindcss-animate

# Dev dependencies
npm install -D @tailwindcss/typography
```

### Step 3: Copy Configuration Files

```bash
# Copy Tailwind config
cp tailwind.config.ts next-project/tailwind.config.ts

# Copy PostCSS config
cp postcss.config.js next-project/postcss.config.js

# Copy and adapt tsconfig
# Next.js generates its own, but copy custom paths
```

### Step 4: Update tailwind.config.ts

```typescript
// Update content paths for Next.js
export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  // ... rest unchanged
};
```

---

## 4. Phase 2: Component Migration

### Migrating UI Components

Most UI components work unchanged. Key differences:

```typescript
// Before (Vite)
import { useNavigate } from 'react-router-dom';

export function Button() {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/blog')}>Blog</button>;
}

// After (Next.js)
import { useRouter } from 'next/navigation';
// Or better, use Link component
import Link from 'next/link';

export function Button() {
  return <Link href="/blog">Blog</Link>;
}
```

### Link Component Migration

```typescript
// Before (React Router)
import { Link } from 'react-router-dom';
<Link to="/blog/my-post">Read More</Link>

// After (Next.js)
import Link from 'next/link';
<Link href="/blog/my-post">Read More</Link>
```

### Image Component Migration

```typescript
// Before (Vite)
<img src="/shahid-moosa.jpg" alt="Shahid Moosa" />

// After (Next.js)
import Image from 'next/image';
<Image 
  src="/shahid-moosa.jpg" 
  alt="Shahid Moosa"
  width={400}
  height={400}
  priority // For LCP image
/>
```

### useEffect for Meta Tags → Remove

```typescript
// Before (BlogPost.tsx)
useEffect(() => {
  document.title = article.title;
  // ... set meta tags
}, [article]);

// After (Next.js)
// Remove this! Use generateMetadata instead
export async function generateMetadata({ params }) {
  const article = getArticle(params.slug);
  return {
    title: article.title,
    description: article.description,
  };
}
```

---

## 5. Phase 3: Routing Migration

### React Router → App Router

**Before: React Router Configuration**
```typescript
// src/App.tsx
<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/blog/:slug" element={<BlogPost />} />
  <Route path="/rss.xml" element={<RSSFeed />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

**After: File-based Routing**
```
app/
├── page.tsx              # / (Index)
├── blog/
│   └── [slug]/
│       └── page.tsx      # /blog/:slug (BlogPost)
├── rss.xml/
│   └── route.ts          # /rss.xml (RSSFeed)
└── not-found.tsx         # 404 (NotFound)
```

### Dynamic Route Parameters

```typescript
// Before (React Router)
import { useParams } from 'react-router-dom';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticleBySlug(slug);
  // ...
}

// After (Next.js)
interface PageProps {
  params: { slug: string };
}

export default function BlogPost({ params }: PageProps) {
  const article = getArticleBySlug(params.slug);
  // ...
}
```

### Programmatic Navigation

```typescript
// Before
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/blog');

// After
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/blog');
```

---

## 6. Phase 4: SEO Implementation

### Root Layout (replaces index.html + App.tsx)

```typescript
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Shahid Moosa — Cloud Database Engineer',
    template: '%s | Shahid Moosa',
  },
  description: 'Cloud Database Support Engineer at SingleStore...',
  // ... full metadata
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Dynamic Metadata for Blog Posts

```typescript
// app/blog/[slug]/page.tsx
import { getArticleBySlug, articles } from '@/data/articles';

export async function generateMetadata({ params }) {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: 'Not Found' };
  
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      type: 'article',
      title: article.title,
      // ...
    },
  };
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}
```

### Structured Data Migration

```typescript
// Before: useEffect injection
useEffect(() => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}, []);

// After: Server Component with Script
import Script from 'next/script';

export default function Page() {
  const schema = { /* ... */ };
  
  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Page content */}
    </>
  );
}
```

---

## 7. Phase 5: Deployment

### Next.js Static Export Configuration

```javascript
// next.config.js
module.exports = {
  output: 'export',
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};
```

### Build and Export

```bash
# Build static site
npm run build

# Output is in 'out' directory
ls out/
# index.html, blog/, sitemap.xml, etc.
```

### Firebase Hosting Deployment

```bash
# Initialize Firebase (if not done)
firebase init hosting

# Deploy
firebase deploy --only hosting
```

### Updated firebase.json

```json
{
  "hosting": {
    "public": "out",
    "cleanUrls": true,
    "trailingSlash": false,
    "headers": [/* ... */],
    "redirects": [/* ... */]
  }
}
```

---

## 8. Testing & Validation

### Pre-Deployment Checklist

```bash
# Build the project
npm run build

# Test locally
npx serve out

# Check pages
curl -I http://localhost:3000/          # Should be 200
curl -I http://localhost:3000/blog/cap-theorem-production  # 200
curl -I http://localhost:3000/nonexistent  # 404
curl http://localhost:3000/sitemap.xml    # Valid XML
curl http://localhost:3000/robots.txt     # Valid robots.txt
```

### SEO Validation

1. **Rich Results Test**: https://search.google.com/test/rich-results
2. **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
3. **PageSpeed Insights**: https://pagespeed.web.dev

### Post-Deployment

1. Submit sitemap to Google Search Console
2. Request indexing for key pages
3. Monitor Search Console for crawl errors
4. Verify all redirects work correctly

---

## Migration Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| Setup | 1 day | Initialize Next.js, copy configs |
| Components | 2-3 days | Migrate all components |
| Routing | 1-2 days | Set up App Router pages |
| SEO | 2-3 days | Implement metadata, schemas |
| Testing | 1-2 days | Validate everything |
| Deployment | 1 day | Deploy and verify |

**Total: ~8-12 days**

---

## Rollback Plan

Keep the original Vite project until the migration is verified:

```bash
# During migration
/project
├── shahidster-vite/    # Original (keep as backup)
└── shahidster-next/    # New Next.js version

# After successful migration
/project
├── shahidster-vite-backup/  # Archive
└── shahidster-next/         # Active (rename to main)
```

---

## Common Issues & Solutions

### Issue: Framer Motion SSR Errors

```typescript
// Solution: Use dynamic import with ssr: false
import dynamic from 'next/dynamic';

const Motion = dynamic(
  () => import('framer-motion').then(mod => mod.motion),
  { ssr: false }
);
```

### Issue: window/document not defined

```typescript
// Solution: Check for client-side
if (typeof window !== 'undefined') {
  // Client-side only code
}

// Or use useEffect (runs only on client)
useEffect(() => {
  // Safe to use window/document here
}, []);
```

### Issue: Static export with dynamic routes

```typescript
// Solution: Always implement generateStaticParams
export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}
```

---

*This guide provides a structured approach to migration. Adapt timelines and specific steps based on your team's familiarity with Next.js.*
