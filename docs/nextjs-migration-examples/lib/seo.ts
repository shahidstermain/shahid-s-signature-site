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
 * Produce a canonical absolute URL by joining the site's base URL with a cleaned path.
 *
 * @param path - Path to append; passing '/' returns the site root. Trailing slash is removed for other paths.
 * @returns The canonical absolute URL for the provided path.
 */
export function getCanonicalUrl(path: string = ''): string {
  const cleanPath = path === '/' ? '' : path.replace(/\/$/, '');
  return `${SITE_CONFIG.url}${cleanPath}`;
}

/**
 * Convert a "Mon YYYY" month-year string into an ISO timestamp for the 15th of that month.
 *
 * @param dateStr - Month and year in the form "Mon YYYY" (e.g., "Nov 2025")
 * @returns An ISO 8601 timestamp (UTC) representing the 15th day of the parsed month and year; if `dateStr` does not match the expected format, returns the current date-time in ISO 8601.
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
 * Produce a Next.js Metadata object populated with site-wide defaults.
 *
 * Merges any provided `overrides` into the generated base metadata.
 *
 * @param overrides - Partial metadata values that will override the defaults
 * @returns The resulting Metadata object with defaults applied and overrides merged
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
 * Builds metadata for a blog article, including Open Graph, Twitter card, authors, keywords, and canonical URL.
 *
 * @param article - Article data (title, description, slug, date, category, and optional `seoKeywords`)
 * @returns A Metadata object populated with the article's title, description, keywords, author info, Open Graph article fields (including images and publish/modified times), Twitter card data, and canonical alternate URL
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
 * Create a JSON-LD Person schema describing the site's author.
 *
 * @returns An object containing a Schema.org `Person` node with author name, job title, contact email, URL, employer (`worksFor`), `sameAs` social links, and topical `knowsAbout` entries.
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
 * Generate a JSON-LD WebSite schema describing the site for search engines.
 *
 * @returns An object containing a schema.org `WebSite` JSON-LD with `@context`, `@type`, `@id`, `url`, `name`, `description`, a `publisher` reference, and `inLanguage`
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
 * Builds a JSON-LD TechArticle schema object for a blog article.
 *
 * @param article - Article data used to populate the schema: title, description, slug (used to form the canonical URL), date (e.g., "Nov 2025"), category, content (used to compute word count), optional `seoKeywords`, and optional `seriesPosition`.
 * @param seriesInfo - Optional series metadata containing `currentIndex` (position in series) and `total` (total items) which, if provided, adds an `isPartOf` CreativeWorkSeries entry.
 * @returns A JSON-LD object describing the article as a `TechArticle`, including author and publisher references, publication dates, mainEntityOfPage, articleSection, keywords, wordCount, proficiencyLevel, inLanguage, and an optional `isPartOf` series object when `seriesInfo` is supplied.
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
 * Create a JSON-LD BreadcrumbList object from an ordered array of breadcrumb items.
 *
 * @param items - Array of breadcrumb entries; each entry must include `name` (label) and `url` (item URL)
 * @returns An object formatted as a schema.org `BreadcrumbList` with `itemListElement` of `ListItem` entries
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
 * Builds a JSON-LD FAQPage schema from an array of question/answer pairs.
 *
 * @param faqs - Array of objects each containing `question` and `answer` strings
 * @returns An object formatted as a Schema.org `FAQPage` where each FAQ is a `Question` with an `acceptedAnswer` of type `Answer`
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
 * Report a page view to Google Analytics 4.
 *
 * @param url - The page path to record (e.g., "/blog/my-post")
 * @param title - Optional page title to include with the page view
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
 * Send a custom event to Google Analytics 4 when the global `gtag` function is available.
 *
 * @param eventName - The event name to record (e.g., `"purchase"`, `"sign_up"`).
 * @param eventParams - Optional key-value parameters to include with the event.
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
 * Produce a plain-text meta description by removing common Markdown constructs and collapsing whitespace; truncates with an ellipsis if longer than `maxLength`.
 *
 * @param content - Text containing Markdown (code blocks, inline code, emphasis, headers, and links) to clean
 * @param maxLength - Maximum length of the returned string; defaults to 160. If the cleaned text exceeds this, it is truncated and suffixed with `...`
 * @returns The cleaned, whitespace-collapsed plain-text string suitable for meta descriptions
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
 * Estimate reading time for the given text in minutes.
 *
 * @param content - Text whose reading time will be estimated.
 * @param wordsPerMinute - Average reading speed in words per minute; defaults to 200.
 * @returns The estimated reading time formatted as "`<n> min read`".
 */
export function calculateReadTime(content: string, wordsPerMinute: number = 200): string {
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}
