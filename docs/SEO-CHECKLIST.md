# SEO Implementation Checklist

A quick-reference checklist for implementing SEO in Next.js + Firebase Hosting projects.

---

## Pre-Launch Checklist

### Technical Foundation

- [ ] **HTTPS enabled** - All pages served over HTTPS
- [ ] **Mobile-responsive** - Passes Google Mobile-Friendly Test
- [ ] **Fast loading** - LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] **No mixed content** - All resources loaded over HTTPS
- [ ] **Proper status codes** - 200 for content, 301 for redirects, 404 for missing

### Metadata

- [ ] **Unique title** per page (50-60 characters)
- [ ] **Meta description** per page (150-160 characters)
- [ ] **Canonical URL** on every page
- [ ] **Open Graph tags** for social sharing
- [ ] **Twitter Card tags** for Twitter previews
- [ ] **robots meta** tag (index/noindex as appropriate)

### Structured Data

- [ ] **Person schema** on homepage
- [ ] **WebSite schema** on homepage
- [ ] **Article schema** on blog posts
- [ ] **BreadcrumbList** on articles
- [ ] **Validated** with Google Rich Results Test

### Crawlability

- [ ] **robots.txt** properly configured
- [ ] **XML sitemap** generated and submitted
- [ ] **Internal links** connect all important pages
- [ ] **No orphan pages** (every page is linked from another)

### Content

- [ ] **H1 heading** on every page (only one per page)
- [ ] **Heading hierarchy** is logical (H1 > H2 > H3)
- [ ] **Alt text** on all images
- [ ] **Keywords** naturally integrated in content

---

## Per-Page Checklist

### Homepage

```markdown
- [ ] Title: "Shahid Moosa — Cloud Database Engineer" (primary brand + role)
- [ ] Description: Unique, compelling, includes main keywords
- [ ] Canonical: https://shahidster.tech
- [ ] Schema: Person + WebSite
- [ ] H1: Contains primary keyword/brand
- [ ] Internal links: To all major sections
```

### Blog Post Page

```markdown
- [ ] Title: "[Article Title] | Shahid Moosa" (under 60 chars)
- [ ] Description: Article summary with keyword (150-160 chars)
- [ ] Canonical: https://shahidster.tech/blog/[slug]
- [ ] Schema: Article + BreadcrumbList
- [ ] H1: Article title with primary keyword
- [ ] Date: Published and modified dates
- [ ] Author: Clearly attributed
- [ ] Category: Displayed and linked
- [ ] Internal links: 3-5 links to related content
- [ ] Keywords: In first 100 words, headings, throughout content
```

### 404 Page

```markdown
- [ ] Returns 404 status code (not 200)
- [ ] robots: noindex, follow
- [ ] Helpful navigation back to site
- [ ] Search box or popular links
- [ ] Consistent with site design
```

---

## Firebase Hosting Checklist

### firebase.json Configuration

```markdown
- [ ] cleanUrls: true (remove .html extensions)
- [ ] trailingSlash: false (consistent URLs)
- [ ] Cache headers: Immutable for static assets
- [ ] Cache headers: Must-revalidate for HTML
- [ ] Security headers: X-Frame-Options, X-Content-Type-Options
- [ ] Redirects: HTTP → HTTPS
- [ ] Redirects: www → non-www (or reverse)
- [ ] Redirects: Legacy URLs → new URLs
```

### Deployment

```markdown
- [ ] Sitemap accessible at /sitemap.xml
- [ ] robots.txt accessible at /robots.txt
- [ ] RSS feed accessible at /rss.xml
- [ ] All static files in public directory
- [ ] Build output in 'out' directory (for static export)
```

---

## Next.js App Router Checklist

### File Structure

```
app/
├── layout.tsx          # Root layout with global metadata
├── page.tsx            # Homepage
├── not-found.tsx       # Custom 404
├── error.tsx           # Error boundary
├── sitemap.ts          # Dynamic sitemap
├── robots.ts           # Dynamic robots.txt
├── blog/
│   └── [slug]/
│       └── page.tsx    # Blog post with generateMetadata
└── rss.xml/
    └── route.ts        # RSS feed route handler
```

### Metadata API Usage

```typescript
// Static metadata
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
};

// Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await getData(params.slug);
  return {
    title: data.title,
    description: data.description,
  };
}
```

### Static Generation

```typescript
// Generate static pages at build time
export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// Optional: Enable ISR
export const revalidate = 3600; // Revalidate every hour
```

---

## Monitoring Checklist

### Weekly

- [ ] Check Search Console for indexing issues
- [ ] Review crawl errors and 404s
- [ ] Monitor Core Web Vitals scores
- [ ] Check for security issues in Search Console

### Monthly

- [ ] Review organic traffic trends in Analytics
- [ ] Check ranking positions for target keywords
- [ ] Analyze top-performing content
- [ ] Review and fix any new 404s

### Quarterly

- [ ] Full technical SEO audit
- [ ] Content gap analysis
- [ ] Backlink profile review
- [ ] Update outdated content

---

## Quick Reference: Metadata Templates

### Homepage

```typescript
export const metadata: Metadata = {
  title: 'Shahid Moosa — Cloud Database Engineer',
  description: 'Cloud Database Support Engineer at SingleStore...',
  openGraph: {
    type: 'website',
    title: 'Shahid Moosa — Cloud Database Engineer',
    description: 'I keep databases alive at scale...',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@shahidster_',
  },
  alternates: {
    canonical: 'https://shahidster.tech',
  },
};
```

### Blog Post

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = getArticle(params.slug);
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.description,
      publishedTime: article.publishedAt,
      authors: ['Shahid Moosa'],
      images: [{ url: '/og-image.png' }],
    },
    alternates: {
      canonical: `https://shahidster.tech/blog/${params.slug}`,
    },
  };
}
```

---

## Common SEO Mistakes to Avoid

### Technical

- ❌ Blocking important pages in robots.txt
- ❌ Missing or incorrect canonical tags
- ❌ Duplicate title/description across pages
- ❌ Slow page load times (LCP > 4s)
- ❌ Missing XML sitemap
- ❌ Broken internal links

### Content

- ❌ Multiple H1 tags on a page
- ❌ Missing alt text on images
- ❌ Thin content (< 300 words)
- ❌ Keyword stuffing
- ❌ Duplicate content across pages

### Structured Data

- ❌ Invalid JSON-LD syntax
- ❌ Missing required properties
- ❌ Inconsistent data across page and schema
- ❌ Using irrelevant schema types

---

## Tools Reference

| Purpose | Tool | URL |
|---------|------|-----|
| Search Console | Google | search.google.com/search-console |
| Analytics | Google Analytics 4 | analytics.google.com |
| Page Speed | PageSpeed Insights | pagespeed.web.dev |
| Mobile Test | Mobile-Friendly Test | search.google.com/test/mobile-friendly |
| Rich Results | Rich Results Test | search.google.com/test/rich-results |
| Structured Data | Schema Validator | validator.schema.org |
| Sitemap | Sitemap Validator | xml-sitemaps.com/validate-xml-sitemap.html |
| Headers | Security Headers | securityheaders.com |

---

*Print this checklist and use it for every new page or content update.*
