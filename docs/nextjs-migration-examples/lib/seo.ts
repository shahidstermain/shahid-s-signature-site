/**
 * SEO Utility Functions for Next.js App Router
 * 
 * This module provides helper functions for:
 * - Generating metadata
 * - Creating structured data
 * - URL handling
 * - Analytics tracking
 */

import type { Metadata } from 'next';

// Site configuration
export const SITE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://shahidster.tech',
  name: 'Shahid Moosa',
  title: 'Shahid Moosa — Cloud Database Engineer',
  description: 'Cloud Database Support Engineer at SingleStore. I debug distributed systems, optimize queries at petabyte scale, and help Fortune 500 teams ship reliable data infrastructure.',
  author: {
    name: 'Shahid Moosa',
    email: 'hello@shahidster.tech',
    twitter: '@shahidster_',
    jobTitle: 'Cloud Database Support Engineer',
  },
  organization: {
    name: 'SingleStore',
    url: 'https://www.singlestore.com',
  },
  social: {
    twitter: 'https://twitter.com/shahidster_',
    linkedin: 'https://linkedin.com/in/shahidmoosa',
    github: 'https://github.com/shahidmoosa',
  },
} as const;

/**
 * Produce a canonical absolute URL by joining the site base URL with a normalized path.
 *
 * Normalization: a single root path `'/'` becomes the site base, and any trailing slash is removed from the provided path.
 *
 * @param path - The path to append to the site URL (e.g., `/blog/post` or `blog/post`). Defaults to empty which yields the site base.
 * @returns The canonical absolute URL for the given path
 */
export function getCanonicalUrl(path: string = ''): string {
  const cleanPath = path === '/' ? '' : path.replace(/\/$/, '');
  return `${SITE_CONFIG.url}${cleanPath}`;
}

/**
 * Convert a month-year string like "Nov 2025" into an ISO date anchored to the 15th of that month.
 *
 * @param dateStr - The month and year in "Mon YYYY" format (e.g., "Nov 2025")
 * @returns The ISO 8601 date string set to the 15th of the parsed month at 00:00:00.000Z; returns the current date-time in ISO format if parsing fails
 */
export function parseArticleDateToISO(dateStr: string): string {
  const months: Record<string, string> = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04',
    May: '05', Jun: '06', Jul: '07', Aug: '08',
    Sep: '09', Oct: '10', Nov: '11', Dec: '12',
  };
  const parts = dateStr.split(' ');
  if (parts.length === 2) {
    const month = months[parts[0]] || '01';
    const year = parts[1];
    return `${year}-${month}-15T00:00:00.000Z`;
  }
  return new Date().toISOString();
}

/**
 * Create a base Next.js Metadata object populated with the site's default values.
 *
 * Merges any provided `overrides` into the generated base metadata so supplied fields replace defaults.
 *
 * @param overrides - Partial metadata fields to merge into the base; provided values override defaults
 * @returns A Metadata object containing site defaults merged with `overrides`
 */
export function generateBaseMetadata(overrides: Partial<Metadata> = {}): Metadata {
  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: SITE_CONFIG.title,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description: SITE_CONFIG.description,
    authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.url }],
    creator: SITE_CONFIG.author.name,
    publisher: SITE_CONFIG.author.name,
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
    ...overrides,
  };
}

/**
 * Builds Next.js metadata tailored for a blog article.
 *
 * @param article - Article details: `title`, `description`, `slug` (used to form canonical URL), `date` (e.g., "Nov 2025"), `category`, and optional `seoKeywords`
 * @returns The `Metadata` object for the article, including Open Graph and Twitter card data, authors, keywords, publish/modified timestamps, and canonical alternate URL
 */
export function generateArticleMetadata(article: {
  title: string;
  description: string;
  slug: string;
  date: string;
  category: string;
  seoKeywords?: string[];
}): Metadata {
  const articleUrl = getCanonicalUrl(`/blog/${article.slug}`);
  const publishDate = parseArticleDateToISO(article.date);

  return {
    title: article.title,
    description: article.description,
    keywords: article.seoKeywords,
    authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.url }],
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: articleUrl,
      siteName: SITE_CONFIG.name,
      title: article.title,
      description: article.description,
      images: [
        {
          url: `${SITE_CONFIG.url}/og-image.png`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      publishedTime: publishDate,
      modifiedTime: publishDate,
      authors: [SITE_CONFIG.author.name],
      section: article.category,
      tags: article.seoKeywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [`${SITE_CONFIG.url}/og-image.png`],
      creator: SITE_CONFIG.author.twitter,
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

/**
 * Create a JSON-LD Person schema for the site author.
 *
 * @returns A JSON-LD object for `schema.org` Person populated from `SITE_CONFIG`,
 *          including name, jobTitle, email, url, worksFor, sameAs, and knowsAbout.
 */
export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_CONFIG.url}/#person`,
    name: SITE_CONFIG.author.name,
    jobTitle: SITE_CONFIG.author.jobTitle,
    email: `mailto:${SITE_CONFIG.author.email}`,
    url: SITE_CONFIG.url,
    worksFor: {
      '@type': 'Organization',
      name: SITE_CONFIG.organization.name,
      url: SITE_CONFIG.organization.url,
    },
    sameAs: Object.values(SITE_CONFIG.social),
    knowsAbout: [
      'Distributed Systems',
      'Database Engineering',
      'Cloud Infrastructure',
      'AWS',
      'PostgreSQL',
      'MySQL',
      'SingleStore',
    ],
  };
}

/**
 * Create a JSON-LD WebSite schema object for the site.
 *
 * @returns A JSON-LD `WebSite` schema object containing the site's `@id`, `url`, `name`, `description`, `publisher` reference, and `inLanguage`.
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.url}/#website`,
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    publisher: {
      '@id': `${SITE_CONFIG.url}/#person`,
    },
    inLanguage: 'en-US',
  };
}

/**
 * Builds a JSON-LD TechArticle schema object for an article suitable for embedding in a webpage.
 *
 * Produces a Schema.org TechArticle representation that includes headline, description,
 * publication and modification dates, author and publisher references, mainEntityOfPage,
 * section, keywords, word count, proficiency level, and language. If `seriesInfo` is provided,
 * the result includes an `isPartOf` CreativeWorkSeries entry.
 *
 * @param article - Article properties:
 *   - title: Article headline
 *   - description: Short summary of the article
 *   - slug: URL path segment for the article (appended to the site's /blog/ path)
 *   - date: Publish date in "Mon YYYY" format (e.g., "Nov 2025")
 *   - category: Article section or category
 *   - content: Full article content used to compute word count
 *   - seoKeywords: Optional list of SEO keywords
 *   - seriesPosition: Optional position within a series (string form)
 * @param seriesInfo - Optional series metadata with `currentIndex` (position) and `total` (number of items)
 * @returns A JSON-LD object representing a Schema.org `TechArticle` for the provided article
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  slug: string;
  date: string;
  category: string;
  content: string;
  seoKeywords?: string[];
  seriesPosition?: string;
}, seriesInfo?: { currentIndex: number; total: number }) {
  const articleUrl = getCanonicalUrl(`/blog/${article.slug}`);
  const publishDate = parseArticleDateToISO(article.date);
  const wordCount = article.content.split(/\s+/).length;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': articleUrl,
    headline: article.title,
    description: article.description,
    datePublished: publishDate,
    dateModified: publishDate,
    author: {
      '@type': 'Person',
      '@id': `${SITE_CONFIG.url}/#person`,
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      '@type': 'Person',
      '@id': `${SITE_CONFIG.url}/#person`,
      name: SITE_CONFIG.author.name,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleSection: article.category,
    keywords: article.seoKeywords?.join(', ') || article.category,
    wordCount,
    proficiencyLevel: 'Expert',
    inLanguage: 'en-US',
  };

  if (seriesInfo) {
    schema.isPartOf = {
      '@type': 'CreativeWorkSeries',
      name: 'Distributed Systems Series',
      position: seriesInfo.currentIndex,
      numberOfItems: seriesInfo.total,
    };
  }

  return schema;
}

/**
 * Builds a JSON-LD BreadcrumbList object for page structured data.
 *
 * @param items - Array of breadcrumb entries; each entry must have `name` and `url`. The array order determines each item's `position`.
 * @returns A BreadcrumbList JSON-LD object where `itemListElement` contains `ListItem` entries with `position`, `name`, and `item` (URL).
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Create a JSON-LD FAQPage schema from question and answer pairs.
 *
 * @param faqs - Array of objects each containing `question` and `answer` strings
 * @returns A JSON-LD object representing a Schema.org `FAQPage` with `Question` and `Answer` entries
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Send a page-view event to Google Analytics 4 for the specified URL.
 *
 * If the analytics function is unavailable in the runtime environment, this is a no-op.
 *
 * @param url - The page path to report as `page_path`
 * @param title - Optional page title to report as `page_title`
 */
export function trackPageView(url: string, title?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      page_path: url,
      page_title: title,
    });
  }
}

/**
 * Sends a custom event to Google Analytics 4 when the global `gtag` function is available.
 *
 * @param eventName - The name of the event to record
 * @param eventParams - Optional parameters to attach to the event (e.g., `value`, `category`, `label`)
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}

/**
 * TypeScript declarations for gtag
 */
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
  }
}

/**
 * Convert Markdown/inline HTML-like content to plain text suitable for meta descriptions.
 *
 * Strips code blocks, inline code, Markdown formatting (bold/italic), headers, and links,
 * collapses consecutive newlines to single spaces, trims surrounding whitespace, and
 * truncates the result to `maxLength` characters by appending an ellipsis when needed.
 *
 * @param content - The Markdown or HTML-like string to sanitize
 * @param maxLength - Maximum length of the returned string; defaults to 160. If truncation occurs, the returned string ends with `...` and its total length will not exceed `maxLength`.
 * @returns A plain-text string with Markdown removed; truncated and suffixed with `...` when longer than `maxLength`
 */
export function stripMarkdown(content: string, maxLength: number = 160): string {
  const plain = content
    .replace(/```[\s\S]*?```/g, '') // Code blocks
    .replace(/`[^`]+`/g, '') // Inline code
    .replace(/\*\*(.+?)\*\*/g, '$1') // Bold
    .replace(/\*(.+?)\*/g, '$1') // Italic
    .replace(/^#{1,6}\s+/gm, '') // Headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/\n+/g, ' ')
    .trim();

  if (plain.length <= maxLength) {
    return plain;
  }

  return plain.slice(0, maxLength - 3) + '...';
}

/**
 * Estimate the reading time for the provided text content.
 *
 * Rounds up to the nearest whole minute.
 *
 * @param content - The text whose reading time will be estimated.
 * @param wordsPerMinute - Reading speed to use (words per minute). Defaults to 200.
 * @returns A string in the form `X min read` where `X` is the estimated minutes.
 */
export function calculateReadTime(content: string, wordsPerMinute: number = 200): string {
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}