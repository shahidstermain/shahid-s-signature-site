# SEO Master Plan: Next.js + Firebase Hosting

**Version:** 1.0  
**Target Site:** shahidster.tech  
**Stack:** Next.js 14+ (App Router) + Firebase Hosting  
**Author:** Cloud Database Engineer Portfolio Site  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Discovery & SEO Audit](#2-project-discovery--seo-audit)
3. [Keyword Research & Information Architecture](#3-keyword-research--information-architecture)
4. [On-Page & Content SEO in Next.js](#4-on-page--content-seo-in-nextjs-app-router)
5. [Technical SEO: Next.js Specifics](#5-technical-seo-nextjs-specifics)
6. [Sitemaps & robots.txt](#6-sitemaps--robotstxt-for-app-router)
7. [Firebase Hosting Configuration](#7-firebase-hosting-configuration-for-seo)
8. [Off-Page SEO & Authority Building](#8-off-page-seo--authority-building)
9. [Measurement, Monitoring & Iteration](#9-measurement-monitoring--iteration)
10. [Implementation Checklists](#10-implementation-checklists)
11. [Code Examples](#11-code-examples)
12. [Phased Roadmap](#12-phased-roadmap)

---

## 1. Executive Summary

### Current State Analysis

The current site is a **Vite + React SPA** with:
- Client-side routing via React Router
- Dynamic meta tag injection (client-side)
- Existing sitemap and RSS feed generation
- Structured data (JSON-LD) injection via useEffect
- Basic robots.txt

### SEO Challenges with Current SPA Architecture

| Issue | Impact | Priority |
|-------|--------|----------|
| Client-side rendering only | Search engines may not index content properly | **Critical** |
| No static HTML generation | Poor Core Web Vitals (LCP, FCP) | **Critical** |
| Dynamic meta tags via JS | Social sharing previews may fail | **High** |
| No server-side structured data | Reduced rich snippet eligibility | **High** |
| SPA routing | Potential crawl budget waste | **Medium** |

### Recommended Solution: Migration to Next.js App Router

Next.js App Router provides:
- **Server-side rendering (SSR)** for dynamic content
- **Static site generation (SSG)** for static pages
- **Incremental Static Regeneration (ISR)** for best of both worlds
- **Built-in metadata API** for SEO tags
- **Native sitemap and robots.txt** support
- **Optimal Core Web Vitals** through automatic optimizations

### SEO Goals & KPIs

| KPI | Baseline | 3-Month Target | 6-Month Target |
|-----|----------|----------------|----------------|
| Organic Traffic | TBD | +50% | +150% |
| Core Web Vitals (LCP) | TBD | <2.5s | <2.0s |
| Core Web Vitals (CLS) | TBD | <0.1 | <0.05 |
| Indexed Pages | TBD | 100% | 100% |
| Rich Snippets | 0 | 5+ | All articles |
| Domain Authority | TBD | +5 | +15 |
| Keyword Rankings (Top 10) | 0 | 10 | 50+ |

---

## 2. Project Discovery & SEO Audit

### 2.1 Target Audience & Search Intent

#### Primary Audience Segments

| Segment | Search Intent | Content Type | Priority |
|---------|---------------|--------------|----------|
| Senior Engineers | Informational | Technical deep-dives, distributed systems | **High** |
| Engineering Managers | Navigational/Commercial | Portfolio, credentials, work history | **High** |
| Recruiters | Navigational | Resume, contact info, skills | **Medium** |
| Junior Engineers | Informational | Blog articles, tutorials | **Medium** |

#### Search Intent Mapping

```
Informational (60%)
├── "CAP theorem explained"
├── "distributed database sharding strategies"
├── "HTAP systems backpressure"
└── "query optimization petabyte scale"

Navigational (25%)
├── "Shahid Moosa engineer"
├── "SingleStore database engineer"
└── "shahidster tech blog"

Commercial (10%)
├── "database consultant"
├── "distributed systems expert hire"
└── "cloud database engineer portfolio"

Transactional (5%)
└── "contact database engineer"
```

### 2.2 Technical Audit Checklist

#### Rendering & Crawlability

- [ ] **Rendering mode audit**: Identify pages requiring SSR vs SSG vs ISR
- [ ] **JavaScript dependency**: Test with JS disabled
- [ ] **Crawl simulation**: Use Google Search Console URL Inspection
- [ ] **Mobile-first indexing**: Verify mobile rendering matches desktop

#### Core Web Vitals

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | ≤2.5s | 2.5s-4.0s | >4.0s |
| FID (First Input Delay) | ≤100ms | 100ms-300ms | >300ms |
| CLS (Cumulative Layout Shift) | ≤0.1 | 0.1-0.25 | >0.25 |
| INP (Interaction to Next Paint) | ≤200ms | 200ms-500ms | >500ms |

**Tools for measurement:**
- Google PageSpeed Insights
- Chrome DevTools Lighthouse
- Web Vitals Chrome Extension
- Search Console Core Web Vitals report

#### Technical SEO Elements

- [ ] **Sitemaps**: XML sitemap with all important URLs
- [ ] **robots.txt**: Proper allow/disallow rules
- [ ] **Canonical tags**: Prevent duplicate content
- [ ] **Hreflang**: If multi-language (N/A for this site)
- [ ] **Status codes**: Proper 200, 301, 404 responses
- [ ] **HTTPS**: Full site served over HTTPS
- [ ] **Structured data**: Valid JSON-LD for articles, person, organization

### 2.3 Content Audit

#### Current Content Inventory

| Page Type | Count | Avg. Word Count | Has Meta | Has Schema |
|-----------|-------|-----------------|----------|------------|
| Homepage | 1 | ~800 | ✅ | ❌ |
| Blog Posts | 9 | ~1,200 | ✅ (JS) | ✅ (JS) |
| 404 Page | 1 | ~20 | ❌ | ❌ |

#### Content Quality Assessment (E-E-A-T)

| Factor | Current State | Improvement Needed |
|--------|---------------|-------------------|
| **Experience** | Strong (real work examples) | Showcase more case studies |
| **Expertise** | Strong (technical depth) | Add author bio to articles |
| **Authoritativeness** | Medium | Build backlinks, guest posts |
| **Trustworthiness** | Medium | Add testimonials, certifications |

### 2.4 Off-Page Audit

#### Backlink Profile Analysis

**Tools to use:**
- Ahrefs
- SEMrush
- Moz Link Explorer

**Metrics to track:**
- Domain Rating (DR)
- Number of referring domains
- Anchor text distribution
- Follow vs nofollow ratio
- Toxic backlink score

---

## 3. Keyword Research & Information Architecture

### 3.1 Keyword Cluster Strategy

#### Primary Topic Clusters

```
Distributed Systems (Pillar)
├── CAP Theorem [cap-theorem-production]
├── Consistency Models [pragmatic-consistency]
├── Sharding Strategies [sharding-strategies-that-work]
└── Data Skew [data-skew-distributed-joins]

Database Performance (Pillar)
├── Query Optimization [query-optimization-petabyte-scale]
├── Storage Architecture [latency-tax-separated-compute-storage]
└── HTAP Systems [defensive-ingestion-backpressure-htap]

Database Operations (Pillar)
├── Schema Evolution [non-blocking-ddl-myth]
└── Incident Response [incident-response-database-engineers]
```

#### Keyword Mapping to URLs

| Keyword Cluster | Primary Keyword | Secondary Keywords | Target URL |
|-----------------|-----------------|-------------------|------------|
| CAP Theorem | CAP theorem production | consistency vs availability, partition tolerance | `/blog/cap-theorem-production` |
| Consistency | consistency levels database | serializability, isolation levels | `/blog/pragmatic-consistency` |
| Storage | disaggregated storage | compute storage separation, NVMe latency | `/blog/latency-tax-separated-compute-storage` |
| Joins | data skew distributed | shuffle join, broadcast join | `/blog/data-skew-distributed-joins` |
| DDL | online DDL schema | schema migration, metadata locks | `/blog/non-blocking-ddl-myth` |
| HTAP | HTAP backpressure | Kafka ingestion, flow control | `/blog/defensive-ingestion-backpressure-htap` |
| Query | query optimization scale | execution plans, covering indexes | `/blog/query-optimization-petabyte-scale` |
| Incidents | database incident response | postmortem, runbooks | `/blog/incident-response-database-engineers` |
| Sharding | database sharding | hash sharding, range sharding | `/blog/sharding-strategies-that-work` |

### 3.2 URL Strategy

#### SEO-Friendly URL Patterns

```typescript
// Next.js App Router Structure
app/
├── page.tsx                           // / (homepage)
├── blog/
│   ├── page.tsx                       // /blog (blog listing - optional)
│   └── [slug]/
│       └── page.tsx                   // /blog/[slug] (individual posts)
├── sitemap.ts                         // /sitemap.xml
├── robots.ts                          // /robots.txt
├── rss.xml/
│   └── route.ts                       // /rss.xml
└── not-found.tsx                      // 404 page
```

#### URL Best Practices

| Rule | Example | Rationale |
|------|---------|-----------|
| Lowercase | `/blog/cap-theorem` | Consistency |
| Hyphens for words | `/cap-theorem-production` | Readability |
| Descriptive slugs | `/sharding-strategies-that-work` | Keyword relevance |
| No trailing slashes | `/blog/cap-theorem` | Canonical consistency |
| Short but descriptive | Keep under 60 chars | User experience |

### 3.3 Internal Linking Strategy

#### Link Architecture

```
Homepage
├── Hero → All blog articles (featured)
├── Writing Section → All articles
└── Footer → Sitemap, RSS

Blog Post
├── Series Navigation → Prev/Next articles
├── In-Content Links → Related articles (already implemented)
├── Related Articles → Same category
└── Breadcrumbs → Home > Writing > Article
```

#### Internal Link Implementation

```typescript
// Example: Article cross-linking (already present in content)
// From pragmatic-consistency article:
"This builds on our exploration of [data skew in distributed joins](/blog/data-skew-distributed-joins)"

// Breadcrumb schema (already implemented in BlogPost.tsx)
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "position": 1, "name": "Home", "item": "https://shahidster.tech" },
    { "position": 2, "name": "Writing", "item": "https://shahidster.tech/#writing" },
    { "position": 3, "name": "Article Title", "item": "https://shahidster.tech/blog/slug" }
  ]
}
```

---

## 4. On-Page & Content SEO in Next.js (App Router)

### 4.1 Metadata API Usage

#### Static Metadata Export

```typescript
// app/page.tsx - Homepage
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shahid Moosa — Cloud Database Engineer',
  description: 'Cloud Database Support Engineer at SingleStore. I debug distributed systems, optimize queries at petabyte scale, and help Fortune 500 teams ship reliable data infrastructure.',
  keywords: ['Cloud Database Engineer', 'SingleStore', 'AWS', 'Distributed Systems', 'Database Support', 'PostgreSQL', 'MySQL'],
  authors: [{ name: 'Shahid Moosa', url: 'https://shahidster.tech' }],
  creator: 'Shahid Moosa',
  publisher: 'Shahid Moosa',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://shahidster.tech',
    siteName: 'Shahid Moosa — Cloud Database Engineer',
    title: 'Shahid Moosa — Cloud Database Engineer',
    description: 'I keep databases alive at scale. Cloud Database Engineer at SingleStore specializing in distributed systems and production infrastructure.',
    images: [
      {
        url: 'https://shahidster.tech/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Shahid Moosa - Cloud Database Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shahid Moosa — Cloud Database Engineer',
    description: 'I keep databases alive at scale. Cloud Database Engineer at SingleStore.',
    images: ['https://shahidster.tech/og-image.png'],
    creator: '@shahidster_',
  },
  alternates: {
    canonical: 'https://shahidster.tech',
    types: {
      'application/rss+xml': 'https://shahidster.tech/rss.xml',
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'yandex-verification-code',
    // bing: 'bing-verification-code',
  },
};
```

#### Dynamic Metadata with generateMetadata

```typescript
// app/blog/[slug]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticleBySlug, articles, Article } from '@/data/articles';

interface Props {
  params: { slug: string };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  
  if (!article) {
    return {
      title: 'Article Not Found | Shahid Moosa',
      description: 'The requested article could not be found.',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const articleUrl = `https://shahidster.tech/blog/${article.slug}`;

  return {
    title: `${article.title} | Shahid Moosa`,
    description: article.description,
    keywords: article.seoKeywords,
    authors: [{ name: 'Shahid Moosa', url: 'https://shahidster.tech' }],
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: articleUrl,
      siteName: 'Shahid Moosa — Distributed Systems Engineer',
      title: article.title,
      description: article.description,
      images: [
        {
          url: 'https://shahidster.tech/og-image.png',
          width: 1200,
          height: 630,
          alt: article.title,
        },
        ...previousImages,
      ],
      publishedTime: parseArticleDate(article.date).toISOString(),
      modifiedTime: parseArticleDate(article.date).toISOString(),
      authors: ['Shahid Moosa'],
      section: article.category,
      tags: article.seoKeywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: ['https://shahidster.tech/og-image.png'],
      creator: '@shahidster_',
    },
    alternates: {
      canonical: articleUrl,
    },
    other: {
      'article:author': 'Shahid Moosa',
      'article:published_time': parseArticleDate(article.date).toISOString(),
      'article:section': article.category,
    },
  };
}

// Static params generation for SSG
export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// Helper function
function parseArticleDate(dateStr: string): Date {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };
  const [month, year] = dateStr.split(' ');
  return new Date(parseInt(year), months[month] || 0, 15);
}
```

### 4.2 Structured Data (JSON-LD)

#### Person Schema (Homepage)

```typescript
// app/page.tsx or components/PersonSchema.tsx
import Script from 'next/script';

export function PersonSchema() {
  const personData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://shahidster.tech/#person",
    "name": "Shahid Moosa",
    "jobTitle": "Cloud Database Support Engineer",
    "worksFor": {
      "@type": "Organization",
      "name": "SingleStore",
      "url": "https://www.singlestore.com"
    },
    "url": "https://shahidster.tech",
    "image": "https://shahidster.tech/shahid-moosa.jpg",
    "sameAs": [
      "https://twitter.com/shahidster_",
      "https://linkedin.com/in/shahidmoosa",
      "https://github.com/shahidmoosa"
    ],
    "knowsAbout": [
      "Distributed Systems",
      "Database Engineering",
      "Cloud Infrastructure",
      "AWS",
      "PostgreSQL",
      "MySQL",
      "SingleStore"
    ],
    "alumniOf": {
      "@type": "Organization",
      "name": "Infosys"
    }
  };

  return (
    <Script
      id="person-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
    />
  );
}
```

#### Website Schema

```typescript
// components/WebsiteSchema.tsx
import Script from 'next/script';

export function WebsiteSchema() {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://shahidster.tech/#website",
    "url": "https://shahidster.tech",
    "name": "Shahid Moosa — Cloud Database Engineer",
    "description": "Technical blog and portfolio of Shahid Moosa, a Cloud Database Engineer specializing in distributed systems.",
    "publisher": {
      "@id": "https://shahidster.tech/#person"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://shahidster.tech/blog?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
    />
  );
}
```

#### Article Schema (Dynamic)

```typescript
// app/blog/[slug]/ArticleSchema.tsx
import Script from 'next/script';
import { Article } from '@/data/articles';

interface ArticleSchemaProps {
  article: Article;
  currentIndex: number;
  total: number;
}

export function ArticleSchema({ article, currentIndex, total }: ArticleSchemaProps) {
  const articleUrl = `https://shahidster.tech/blog/${article.slug}`;
  const publishDate = parseArticleDate(article.date).toISOString();
  
  const articleData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": articleUrl,
    "headline": article.title,
    "description": article.description,
    "datePublished": publishDate,
    "dateModified": publishDate,
    "author": {
      "@type": "Person",
      "@id": "https://shahidster.tech/#person",
      "name": "Shahid Moosa",
      "url": "https://shahidster.tech",
      "jobTitle": "Cloud Database Support Engineer"
    },
    "publisher": {
      "@type": "Person",
      "@id": "https://shahidster.tech/#person",
      "name": "Shahid Moosa",
      "url": "https://shahidster.tech"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "articleSection": article.category,
    "keywords": article.seoKeywords?.join(", ") || article.category,
    "wordCount": article.content.split(/\s+/).length,
    "isPartOf": {
      "@type": "CreativeWorkSeries",
      "name": "Distributed Systems Series",
      "position": currentIndex,
      "numberOfItems": total
    },
    "proficiencyLevel": "Expert",
    "dependencies": "Knowledge of distributed systems",
    "inLanguage": "en-US"
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://shahidster.tech"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Writing",
        "item": "https://shahidster.tech/#writing"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": articleUrl
      }
    ]
  };

  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
    </>
  );
}

function parseArticleDate(dateStr: string): Date {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };
  const [month, year] = dateStr.split(' ');
  return new Date(parseInt(year), months[month] || 0, 15);
}
```

### 4.3 Content Quality Guidelines

#### E-E-A-T Content Standards

| Element | Requirement | Implementation |
|---------|-------------|----------------|
| **Heading hierarchy** | One H1, logical H2-H6 | Enforce in content schema |
| **Author attribution** | Clear byline with credentials | Add author bio component |
| **Publication date** | Visible and schema-included | Already implemented |
| **Word count** | 1,000+ for depth | Current avg: 1,200 ✅ |
| **Internal links** | 3-5 per article | Already implemented ✅ |
| **External links** | Cite authoritative sources | Add where relevant |
| **Images** | Alt text, proper sizing | Optimize with next/image |

#### Heading Structure Template

```markdown
# [Primary Keyword] - [Benefit/Topic] (H1 - one per page)

## [Secondary Keyword Section 1] (H2)
### [Supporting Point] (H3)
### [Supporting Point] (H3)

## [Secondary Keyword Section 2] (H2)
### [Supporting Point] (H3)

## Conclusion (H2)
```

---

## 5. Technical SEO: Next.js Specifics

### 5.1 Rendering Strategy Decision Matrix

| Page Type | Rendering | Revalidation | Rationale |
|-----------|-----------|--------------|-----------|
| Homepage | SSG | ISR (1 day) | Mostly static, occasional updates |
| Blog Posts | SSG | ISR (1 hour) | Content changes infrequently |
| Blog Listing | SSG | ISR (1 hour) | New posts added occasionally |
| 404 Page | SSG | None | Fully static |
| Sitemap | Dynamic | On-demand | Must reflect current content |
| RSS Feed | Dynamic | On-demand | Must reflect current content |

#### Implementation Example

```typescript
// app/blog/[slug]/page.tsx

// Enable ISR with 1-hour revalidation
export const revalidate = 3600;

// Or use on-demand revalidation
export const dynamic = 'force-static';

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  
  if (!article) {
    notFound();
  }
  
  return (
    <article>
      {/* Article content */}
    </article>
  );
}
```

### 5.2 Core Web Vitals Optimization

#### Image Optimization with next/image

```typescript
// components/OptimizedImage.tsx
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export function OptimizedImage({ src, alt, priority = false }: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      priority={priority}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMTU6OjY6MTU+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj7/2wBDAR..."
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="rounded-lg"
    />
  );
}

// Usage for hero image (priority for LCP)
<OptimizedImage
  src="/shahid-moosa.jpg"
  alt="Shahid Moosa - Cloud Database Engineer"
  priority={true}
/>
```

#### Font Optimization

```typescript
// app/layout.tsx
import { Inter, Space_Grotesk } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

#### Code Splitting Best Practices

```typescript
// Lazy load non-critical components
import dynamic from 'next/dynamic';

// Below-the-fold components
const Writing = dynamic(() => import('@/components/sections/Writing'), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-muted" />,
});

const Connect = dynamic(() => import('@/components/sections/Connect'), {
  loading: () => <div className="min-h-[300px] animate-pulse bg-muted" />,
});

// Critical above-the-fold components - import normally
import { Hero } from '@/components/sections/Hero';
```

### 5.3 404 and Error Handling

```typescript
// app/not-found.tsx
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Shahid Moosa',
  description: 'The page you are looking for could not be found.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="text-6xl font-heading font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-medium mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/#writing"
            className="inline-flex items-center px-6 py-3 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            Read Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
```

```typescript
// app/error.tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="text-4xl font-heading font-bold mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-8">
          We apologize for the inconvenience. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
```

### 5.4 Canonical URLs and Duplicate Content Prevention

```typescript
// lib/url.ts
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shahidster.tech';

export function getCanonicalUrl(path: string): string {
  // Ensure no trailing slash (except for root)
  const cleanPath = path === '/' ? '' : path.replace(/\/$/, '');
  return `${SITE_URL}${cleanPath}`;
}

// Usage in generateMetadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const canonicalUrl = getCanonicalUrl(`/blog/${params.slug}`);
  
  return {
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
```

---

## 6. Sitemaps & robots.txt for App Router

### 6.1 Dynamic Sitemap Implementation

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { articles } from '@/data/articles';

const SITE_URL = 'https://shahidster.tech';

function parseArticleDate(dateStr: string): Date {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };
  const [month, year] = dateStr.split(' ');
  return new Date(parseInt(year), months[month] || 0, 15);
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  // Blog posts
  const blogPosts: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/blog/${article.slug}`,
    lastModified: parseArticleDate(article.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticPages, ...blogPosts];
}
```

#### Large Site Sitemap Index (Future Scalability)

```typescript
// app/sitemap.ts (for large sites with multiple sitemaps)
import { MetadataRoute } from 'next';

const SITE_URL = 'https://shahidster.tech';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/sitemap-main.xml`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/sitemap-blog.xml`,
      lastModified: new Date(),
    },
  ];
}

// app/sitemap-blog.xml/route.ts
import { articles } from '@/data/articles';

export async function GET() {
  const blogUrls = articles.map((article) => `
    <url>
      <loc>https://shahidster.tech/blog/${article.slug}</loc>
      <lastmod>${parseArticleDate(article.date).toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
  `).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${blogUrls}
    </urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
```

### 6.2 robots.txt Implementation

```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

const SITE_URL = 'https://shahidster.tech';

export default function robots(): MetadataRoute.Robots {
  // Production robots.txt
  if (process.env.NODE_ENV === 'production') {
    return {
      rules: [
        {
          userAgent: 'Googlebot',
          allow: '/',
          disallow: ['/api/', '/admin/'],
        },
        {
          userAgent: 'Bingbot',
          allow: '/',
          disallow: ['/api/', '/admin/'],
        },
        {
          userAgent: 'Twitterbot',
          allow: '/',
        },
        {
          userAgent: 'facebookexternalhit',
          allow: '/',
        },
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/api/', '/admin/'],
        },
      ],
      sitemap: `${SITE_URL}/sitemap.xml`,
      host: SITE_URL,
    };
  }

  // Staging/Development - block all crawlers
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  };
}
```

### 6.3 RSS Feed Route Handler

```typescript
// app/rss.xml/route.ts
import { articles } from '@/data/articles';

const SITE_URL = 'https://shahidster.tech';
const SITE_TITLE = 'Shahid Moosa — Distributed Systems Engineering';
const SITE_DESCRIPTION = 'Deep dives into distributed databases, data infrastructure, and production systems.';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function parseDate(dateStr: string): Date {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };
  const [month, year] = dateStr.split(' ');
  return new Date(parseInt(year), months[month] || 0, 15);
}

export async function GET() {
  const items = articles
    .map((article) => {
      const pubDate = parseDate(article.date).toUTCString();
      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${SITE_URL}/blog/${article.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${article.slug}</guid>
      <description>${escapeXml(article.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(article.category)}</category>
      ${article.seoKeywords?.map((kw) => `<category>${escapeXml(kw)}</category>`).join('\n      ') || ''}
    </item>`;
    })
    .join('');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
```

---

## 7. Firebase Hosting Configuration for SEO

### 7.1 Complete firebase.json Configuration

```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "cleanUrls": true,
    "trailingSlash": false,
    
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|ico)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(woff|woff2|ttf|otf|eot)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.html",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=0, must-revalidate"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          }
        ]
      },
      {
        "source": "/sitemap.xml",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=3600"
          },
          {
            "key": "Content-Type",
            "value": "application/xml"
          }
        ]
      },
      {
        "source": "/rss.xml",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=3600"
          },
          {
            "key": "Content-Type",
            "value": "application/xml"
          }
        ]
      },
      {
        "source": "/robots.txt",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=86400"
          },
          {
            "key": "Content-Type",
            "value": "text/plain"
          }
        ]
      }
    ],

    "redirects": [
      {
        "source": "/home",
        "destination": "/",
        "type": 301
      },
      {
        "source": "/index.html",
        "destination": "/",
        "type": 301
      },
      {
        "source": "/blog",
        "destination": "/#writing",
        "type": 301
      },
      {
        "source": "/articles/:slug",
        "destination": "/blog/:slug",
        "type": 301
      },
      {
        "source": "/posts/:slug",
        "destination": "/blog/:slug",
        "type": 301
      }
    ],

    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 7.2 Firebase Hosting with Next.js SSR (Cloud Functions)

For full SSR support with Next.js on Firebase, use Firebase Cloud Functions:

```json
// firebase.json for SSR with Cloud Functions
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "cleanUrls": true,
    "trailingSlash": false,
    
    "rewrites": [
      {
        "source": "**",
        "function": "nextServer"
      }
    ],
    
    "headers": [
      {
        "source": "/_next/static/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "/images/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  },
  
  "functions": {
    "source": ".",
    "runtime": "nodejs18",
    "ignore": [
      "node_modules",
      ".git",
      "firebase.json",
      "**/.*"
    ]
  }
}
```

### 7.3 Static Export Configuration (Recommended for SEO)

For optimal SEO and performance, use Next.js static export:

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: false,
  images: {
    unoptimized: true, // Required for static export
  },
  // Ensure proper redirects for legacy URLs
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/articles/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
```

### 7.4 Domain Configuration

```bash
# Firebase CLI commands for custom domain
firebase hosting:sites:create shahidster-tech
firebase target:apply hosting prod shahidster-tech
firebase deploy --only hosting:prod

# DNS Configuration (in your domain registrar)
# A Record: @ → Firebase Hosting IP
# CNAME: www → shahidster-tech.web.app
```

---

## 8. Off-Page SEO & Authority Building

### 8.1 Link Building Strategy

#### High-Value Backlink Sources

| Source Type | Target Sites | Approach | Priority |
|-------------|--------------|----------|----------|
| **Guest Posts** | Dev.to, Medium, Hashnode | Technical deep-dives | **High** |
| **Documentation** | OSS projects, SingleStore | Contribution links | **High** |
| **Podcasts** | Database/DevOps shows | Guest appearances | **Medium** |
| **Conferences** | KubeCon, PGConf, re:Invent | Speaker bio links | **Medium** |
| **Directories** | Stack Overflow, GitHub | Profile optimization | **Low** |

#### Content Syndication Strategy

```markdown
Original Post: shahidster.tech/blog/cap-theorem-production
↓
Syndicate to:
├── Dev.to (with canonical pointing to original)
├── Medium (with canonical pointing to original)
├── LinkedIn Articles
└── Hashnode
```

**Important:** Always use canonical tags to prevent duplicate content:

```html
<!-- On syndicated platforms -->
<link rel="canonical" href="https://shahidster.tech/blog/cap-theorem-production" />
```

### 8.2 Brand Mention Strategy

#### Social Media Presence

| Platform | Strategy | Frequency |
|----------|----------|-----------|
| Twitter/X | Share articles, engage with DB community | Daily |
| LinkedIn | Professional updates, article shares | 2-3x/week |
| GitHub | Contribute to OSS, maintain public repos | Ongoing |
| Stack Overflow | Answer database questions | Weekly |

#### PR Outreach Template

```markdown
Subject: Guest Post: [Technical Topic] - From SingleStore Engineer

Hi [Editor Name],

I'm Shahid Moosa, a Cloud Database Engineer at SingleStore. I recently published 
a series on distributed systems that's gained traction in the engineering community.

I'd love to contribute a guest post on [topic] for [publication]. The piece would 
cover [specific angle unique to their audience].

My recent work includes:
- [Article 1 with link]
- [Article 2 with link]

Would this be a good fit for [publication]?

Best,
Shahid
```

### 8.3 Backlink Monitoring

#### Tools & Metrics

```yaml
Tools:
  - Ahrefs (primary)
  - Google Search Console
  - Moz Link Explorer

Metrics to Track:
  - Domain Rating (DR): Target 40+ within 12 months
  - Referring Domains: Target 100+ within 12 months
  - Organic Keywords: Target 500+ within 12 months
  - Anchor Text Distribution:
      - Branded: 30-40%
      - Topic: 30-40%
      - Generic: 15-25%
      - Exact match: <5%
```

---

## 9. Measurement, Monitoring & Iteration

### 9.1 Tracking Setup

#### Google Search Console Configuration

```typescript
// app/layout.tsx - Add verification meta tag
export const metadata: Metadata = {
  verification: {
    google: 'your-google-verification-code',
  },
};
```

#### Google Analytics 4 Setup

```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

#### Event Tracking

```typescript
// lib/analytics.ts
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}

// Usage examples
trackEvent('article_view', { 
  article_slug: 'cap-theorem-production',
  category: 'Fundamentals',
  read_time: '8 min',
});

trackEvent('external_link_click', {
  destination: 'https://singlestore.com',
  link_text: 'SingleStore',
});
```

### 9.2 Monitoring Cadence

#### Weekly Checks

- [ ] Search Console: Indexing issues, crawl errors
- [ ] Ranking movements for target keywords
- [ ] Core Web Vitals scores
- [ ] 404 errors in analytics

#### Monthly Reviews

- [ ] Content performance by article
- [ ] New keyword opportunities
- [ ] Backlink profile changes
- [ ] Traffic trends by source

#### Quarterly Sprints

- [ ] Information architecture review
- [ ] Technical SEO audit
- [ ] Content gap analysis
- [ ] Competitor analysis

### 9.3 Algorithm Update Response Plan

```markdown
## When Algorithm Update Detected

1. **Day 1-3: Observe**
   - Don't make changes immediately
   - Monitor ranking fluctuations
   - Document affected pages

2. **Day 4-7: Analyze**
   - Compare with known update characteristics
   - Identify patterns in affected content
   - Review Google's public statements

3. **Day 8-14: Plan**
   - Prioritize fixes based on impact
   - Create action items
   - Test changes on low-priority pages first

4. **Day 15+: Execute**
   - Implement changes gradually
   - Monitor results
   - Document outcomes for future reference
```

### 9.4 Content Refresh Strategy

```typescript
// lib/content-health.ts

interface ContentHealthScore {
  slug: string;
  lastUpdated: Date;
  organicTraffic: number;
  ranking: number;
  score: 'healthy' | 'needs-refresh' | 'critical';
}

function assessContentHealth(article: ContentHealthScore): string {
  const daysSinceUpdate = Math.floor(
    (Date.now() - article.lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Content older than 12 months with declining traffic
  if (daysSinceUpdate > 365 && article.organicTraffic < 100) {
    return 'critical';
  }

  // Content older than 6 months with stable traffic
  if (daysSinceUpdate > 180) {
    return 'needs-refresh';
  }

  return 'healthy';
}

// Content refresh checklist
const refreshChecklist = [
  'Update statistics and data points',
  'Add new sections for recent developments',
  'Refresh internal links to newer content',
  'Update code examples to current versions',
  'Add new structured data if applicable',
  'Update meta description for better CTR',
  'Add FAQ section based on user queries',
];
```

---

## 10. Implementation Checklists

### 10.1 On-Page SEO Checklist

```markdown
## Per-Page SEO Checklist

### Meta Tags
- [ ] Unique, descriptive title (50-60 chars)
- [ ] Compelling meta description (150-160 chars)
- [ ] Canonical URL set
- [ ] Open Graph tags complete
- [ ] Twitter Card tags complete
- [ ] robots meta (index, follow as appropriate)

### Content Structure
- [ ] Single H1 containing primary keyword
- [ ] Logical heading hierarchy (H2-H6)
- [ ] Primary keyword in first 100 words
- [ ] Keywords naturally distributed
- [ ] Internal links (3-5 minimum)
- [ ] External links to authoritative sources
- [ ] Alt text on all images
- [ ] Proper list formatting (ul/ol)

### Structured Data
- [ ] JSON-LD implemented
- [ ] Validated with Google Rich Results Test
- [ ] Article schema for blog posts
- [ ] Person schema on homepage
- [ ] BreadcrumbList on articles

### Performance
- [ ] Images optimized (next/image)
- [ ] LCP element identified and optimized
- [ ] No layout shift (CLS < 0.1)
- [ ] JavaScript deferred where possible
```

### 10.2 Technical SEO Checklist

```markdown
## Technical SEO Checklist

### Crawlability
- [ ] robots.txt properly configured
- [ ] XML sitemap submitted to Search Console
- [ ] No important pages blocked
- [ ] All pages return proper status codes

### Performance
- [ ] Core Web Vitals passing
- [ ] Mobile-friendly test passing
- [ ] Page load time < 3s
- [ ] HTTPS enabled (A+ SSL rating)

### Indexability
- [ ] All important pages indexed
- [ ] No duplicate content issues
- [ ] Canonical tags implemented
- [ ] Hreflang (if multi-language)

### Status Codes
- [ ] 200 for existing pages
- [ ] 301 for moved content
- [ ] 404 for non-existent pages
- [ ] Custom 404 page with navigation
- [ ] No soft 404s

### URL Structure
- [ ] Clean, descriptive URLs
- [ ] No URL parameters for content variations
- [ ] Consistent URL format (no trailing slashes)
- [ ] HTTPS redirect in place
```

### 10.3 Firebase Hosting SEO Checklist

```markdown
## Firebase Hosting SEO Checklist

### Configuration
- [ ] cleanUrls: true
- [ ] trailingSlash: false
- [ ] Proper caching headers
- [ ] Security headers (X-Frame-Options, etc.)

### Redirects
- [ ] HTTP → HTTPS redirect
- [ ] www → non-www (or reverse)
- [ ] Legacy URL redirects (301)
- [ ] Lowercase URL enforcement

### Performance
- [ ] Static assets cached (1 year)
- [ ] HTML with must-revalidate
- [ ] CDN enabled
- [ ] Compression enabled

### Monitoring
- [ ] Firebase Performance Monitoring
- [ ] Error tracking configured
- [ ] Uptime monitoring
```

---

## 11. Code Examples

### 11.1 Complete App Router Structure

```
app/
├── layout.tsx              # Root layout with SEO defaults
├── page.tsx                # Homepage
├── not-found.tsx           # 404 page
├── error.tsx               # Error boundary
├── sitemap.ts              # Dynamic sitemap
├── robots.ts               # robots.txt
├── manifest.ts             # PWA manifest
├── blog/
│   ├── page.tsx            # Blog listing (optional)
│   └── [slug]/
│       ├── page.tsx        # Article page
│       └── opengraph-image.tsx  # Dynamic OG images
├── rss.xml/
│   └── route.ts            # RSS feed
└── api/
    └── revalidate/
        └── route.ts        # On-demand revalidation
```

### 11.2 Root Layout with All SEO Elements

```typescript
// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const SITE_URL = 'https://shahidster.tech';

export const viewport: Viewport = {
  themeColor: '#0a0b0d',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Shahid Moosa — Cloud Database Engineer',
    template: '%s | Shahid Moosa',
  },
  description: 'Cloud Database Support Engineer at SingleStore. I debug distributed systems, optimize queries at petabyte scale, and help Fortune 500 teams ship reliable data infrastructure.',
  keywords: ['Cloud Database Engineer', 'SingleStore', 'AWS', 'Distributed Systems', 'Database Support'],
  authors: [{ name: 'Shahid Moosa', url: SITE_URL }],
  creator: 'Shahid Moosa',
  publisher: 'Shahid Moosa',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Shahid Moosa',
    title: 'Shahid Moosa — Cloud Database Engineer',
    description: 'I keep databases alive at scale.',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Shahid Moosa - Cloud Database Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@shahidster_',
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': `${SITE_URL}/rss.xml`,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: 'Shahid Moosa',
    jobTitle: 'Cloud Database Support Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'SingleStore',
    },
    url: SITE_URL,
    sameAs: [
      'https://twitter.com/shahidster_',
      'https://linkedin.com/in/shahidmoosa',
      'https://github.com/shahidmoosa',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Shahid Moosa — Cloud Database Engineer',
    publisher: { '@id': `${SITE_URL}/#person` },
  };

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <Script
          id="person-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-body bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
```

### 11.3 Dynamic OG Image Generation

```typescript
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';
import { getArticleBySlug } from '@/data/articles';

export const runtime = 'edge';
export const alt = 'Article cover image';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#0a0b0d',
          padding: '60px',
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: '#6366f1',
            marginBottom: '20px',
          }}
        >
          {article?.category || 'Blog'}
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 'bold',
            color: '#ffffff',
            lineHeight: 1.2,
            maxWidth: '900px',
          }}
        >
          {article?.title || 'Article'}
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#a1a1aa',
            marginTop: '30px',
          }}
        >
          Shahid Moosa • {article?.readTime || '5 min read'}
        </div>
      </div>
    ),
    { ...size }
  );
}
```

### 11.4 On-Demand Revalidation API

```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  // Verify secret token
  if (authHeader !== `Bearer ${process.env.REVALIDATION_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { path, tag, type } = body;

    if (type === 'path' && path) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, path });
    }

    if (type === 'tag' && tag) {
      revalidateTag(tag);
      return NextResponse.json({ revalidated: true, tag });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 });
  }
}
```

---

## 12. Phased Roadmap

### Phase 1: Foundation (Weeks 1-2)

| Task | Priority | Deliverable |
|------|----------|-------------|
| Set up Next.js App Router project | **Critical** | Working Next.js app |
| Migrate existing components | **Critical** | All components ported |
| Implement metadata API | **Critical** | All pages have meta tags |
| Configure Firebase Hosting | **Critical** | Site deployed |
| Set up Search Console | **High** | Verified property |
| Submit sitemap | **High** | Sitemap indexed |

### Phase 2: Technical SEO (Weeks 3-4)

| Task | Priority | Deliverable |
|------|----------|-------------|
| Implement structured data | **High** | All schemas validated |
| Optimize Core Web Vitals | **High** | LCP < 2.5s, CLS < 0.1 |
| Set up redirects | **High** | All legacy URLs covered |
| Configure caching headers | **Medium** | Performance optimized |
| Implement error pages | **Medium** | Custom 404/500 |

### Phase 3: Content Optimization (Weeks 5-6)

| Task | Priority | Deliverable |
|------|----------|-------------|
| Audit existing content | **High** | Content gap report |
| Optimize heading structure | **High** | All articles updated |
| Enhance internal linking | **Medium** | Link map documented |
| Add author bios | **Medium** | E-E-A-T improved |
| Create content calendar | **Medium** | 3-month plan |

### Phase 4: Off-Page & Measurement (Weeks 7-8)

| Task | Priority | Deliverable |
|------|----------|-------------|
| Set up GA4 | **High** | Tracking verified |
| Create monitoring dashboard | **High** | Weekly report template |
| Begin outreach campaign | **Medium** | 10 targets identified |
| Syndicate top articles | **Medium** | 3 platforms configured |
| Document all processes | **Low** | Runbooks complete |

### Ongoing Maintenance

| Cadence | Activities |
|---------|------------|
| **Weekly** | Monitor rankings, fix issues |
| **Monthly** | Content performance review |
| **Quarterly** | Technical audit, strategy review |
| **Annually** | Complete SEO audit, roadmap update |

---

## Appendix A: Tool Recommendations

| Purpose | Tool | Cost |
|---------|------|------|
| Keyword Research | Ahrefs / SEMrush | $99-199/mo |
| Rank Tracking | Ahrefs / SEMrush | Included |
| Technical Audit | Screaming Frog | Free (500 URLs) |
| Core Web Vitals | PageSpeed Insights | Free |
| Search Analytics | Google Search Console | Free |
| Traffic Analytics | Google Analytics 4 | Free |
| Structured Data | Schema Markup Validator | Free |
| Link Building | Ahrefs / Pitchbox | $99-490/mo |

## Appendix B: Key Performance Benchmarks

| Metric | Poor | Average | Good | Excellent |
|--------|------|---------|------|-----------|
| LCP | >4.0s | 2.5-4.0s | 1.5-2.5s | <1.5s |
| CLS | >0.25 | 0.1-0.25 | 0.05-0.1 | <0.05 |
| FID | >300ms | 100-300ms | 50-100ms | <50ms |
| Time to First Byte | >600ms | 200-600ms | 100-200ms | <100ms |
| Organic CTR | <1% | 1-3% | 3-5% | >5% |
| Bounce Rate | >80% | 60-80% | 40-60% | <40% |

---

*This SEO Master Plan is a living document. Update quarterly based on performance data and industry changes.*
