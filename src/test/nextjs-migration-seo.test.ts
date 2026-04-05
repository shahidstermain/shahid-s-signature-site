/**
 * Tests for docs/nextjs-migration-examples/lib/seo.ts
 *
 * Covers all exported utility functions used for SEO metadata generation,
 * structured data (JSON-LD), URL handling, markdown stripping, and analytics.
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import {
  SITE_CONFIG,
  getCanonicalUrl,
  parseArticleDateToISO,
  generateBaseMetadata,
  generateArticleMetadata,
  generatePersonSchema,
  generateWebsiteSchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  stripMarkdown,
  calculateReadTime,
  trackPageView,
  trackEvent,
} from '../../docs/nextjs-migration-examples/lib/seo';

// ---------------------------------------------------------------------------
// SITE_CONFIG
// ---------------------------------------------------------------------------
describe('SITE_CONFIG', () => {
  it('has the expected site URL', () => {
    expect(SITE_CONFIG.url).toBe('https://shahidster.tech');
  });

  it('has author information', () => {
    expect(SITE_CONFIG.author.name).toBe('Shahid Moosa');
    expect(SITE_CONFIG.author.twitter).toBe('@shahidster_');
  });

  it('has social links', () => {
    expect(SITE_CONFIG.social.twitter).toContain('twitter.com');
    expect(SITE_CONFIG.social.linkedin).toContain('linkedin.com');
    expect(SITE_CONFIG.social.github).toContain('github.com');
  });
});

// ---------------------------------------------------------------------------
// getCanonicalUrl
// ---------------------------------------------------------------------------
describe('getCanonicalUrl', () => {
  it('returns the site root for "/"', () => {
    expect(getCanonicalUrl('/')).toBe('https://shahidster.tech');
  });

  it('returns the site root when called with no argument', () => {
    expect(getCanonicalUrl()).toBe('https://shahidster.tech');
  });

  it('appends a plain path correctly', () => {
    expect(getCanonicalUrl('/blog/my-post')).toBe(
      'https://shahidster.tech/blog/my-post'
    );
  });

  it('removes a trailing slash from a path', () => {
    expect(getCanonicalUrl('/blog/my-post/')).toBe(
      'https://shahidster.tech/blog/my-post'
    );
  });

  it('handles paths without a leading slash', () => {
    // No leading slash – still concatenated directly
    expect(getCanonicalUrl('blog/post')).toBe(
      'https://shahidster.techblog/post'
    );
  });

  it('handles empty string the same as no argument', () => {
    expect(getCanonicalUrl('')).toBe('https://shahidster.tech');
  });
});

// ---------------------------------------------------------------------------
// parseArticleDateToISO
// ---------------------------------------------------------------------------
describe('parseArticleDateToISO', () => {
  it('parses January correctly', () => {
    expect(parseArticleDateToISO('Jan 2024')).toBe('2024-01-15T00:00:00.000Z');
  });

  it('parses all twelve months', () => {
    const months = [
      ['Jan', '01'], ['Feb', '02'], ['Mar', '03'], ['Apr', '04'],
      ['May', '05'], ['Jun', '06'], ['Jul', '07'], ['Aug', '08'],
      ['Sep', '09'], ['Oct', '10'], ['Nov', '11'], ['Dec', '12'],
    ];
    for (const [abbr, num] of months) {
      expect(parseArticleDateToISO(`${abbr} 2025`)).toBe(
        `2025-${num}-15T00:00:00.000Z`
      );
    }
  });

  it('parses a recent date correctly', () => {
    expect(parseArticleDateToISO('Nov 2025')).toBe('2025-11-15T00:00:00.000Z');
  });

  it('falls back to current datetime for an invalid format', () => {
    const before = Date.now();
    const result = parseArticleDateToISO('invalid');
    const after = Date.now();
    const ts = new Date(result).getTime();
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);
  });

  it('falls back to current datetime when month part is missing', () => {
    const before = Date.now();
    const result = parseArticleDateToISO('2025');
    const after = Date.now();
    const ts = new Date(result).getTime();
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);
  });

  it('defaults to month 01 for an unrecognized month abbreviation', () => {
    expect(parseArticleDateToISO('Xyz 2024')).toBe('2024-01-15T00:00:00.000Z');
  });
});

// ---------------------------------------------------------------------------
// generateBaseMetadata
// ---------------------------------------------------------------------------
describe('generateBaseMetadata', () => {
  it('returns site title and description by default', () => {
    const meta = generateBaseMetadata();
    expect((meta.title as { default: string }).default).toBe(SITE_CONFIG.title);
    expect(meta.description).toBe(SITE_CONFIG.description);
  });

  it('includes title template with author name', () => {
    const meta = generateBaseMetadata();
    expect((meta.title as { template: string }).template).toBe(
      `%s | ${SITE_CONFIG.name}`
    );
  });

  it('sets robots to indexable by default', () => {
    const meta = generateBaseMetadata();
    expect((meta.robots as { index: boolean }).index).toBe(true);
    expect((meta.robots as { follow: boolean }).follow).toBe(true);
  });

  it('merges overrides onto the base metadata', () => {
    const meta = generateBaseMetadata({ description: 'Custom description' });
    expect(meta.description).toBe('Custom description');
  });

  it('override does not affect unrelated fields', () => {
    const meta = generateBaseMetadata({ description: 'Custom' });
    expect(meta.creator).toBe(SITE_CONFIG.author.name);
  });

  it('includes author information', () => {
    const meta = generateBaseMetadata();
    const authors = meta.authors as Array<{ name: string; url: string }>;
    expect(authors[0].name).toBe(SITE_CONFIG.author.name);
  });

  it('allows overriding robots', () => {
    const meta = generateBaseMetadata({ robots: { index: false, follow: false } });
    expect((meta.robots as { index: boolean }).index).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// generateArticleMetadata
// ---------------------------------------------------------------------------
describe('generateArticleMetadata', () => {
  const article = {
    title: 'CAP Theorem Explained',
    description: 'An in-depth look at the CAP theorem.',
    slug: 'cap-theorem-production',
    date: 'Nov 2025',
    category: 'Fundamentals',
    seoKeywords: ['CAP theorem', 'distributed systems'],
  };

  it('sets title and description from the article', () => {
    const meta = generateArticleMetadata(article);
    expect(meta.title).toBe(article.title);
    expect(meta.description).toBe(article.description);
  });

  it('sets keywords from seoKeywords', () => {
    const meta = generateArticleMetadata(article);
    expect(meta.keywords).toEqual(article.seoKeywords);
  });

  it('produces an Open Graph article type', () => {
    const meta = generateArticleMetadata(article);
    expect(meta.openGraph?.type).toBe('article');
  });

  it('sets Open Graph URL to the canonical article URL', () => {
    const meta = generateArticleMetadata(article);
    expect(meta.openGraph?.url).toBe(
      `${SITE_CONFIG.url}/blog/cap-theorem-production`
    );
  });

  it('sets Open Graph locale to en_US', () => {
    const meta = generateArticleMetadata(article);
    expect(meta.openGraph?.locale).toBe('en_US');
  });

  it('includes OG image with correct dimensions', () => {
    const meta = generateArticleMetadata(article);
    const images = meta.openGraph?.images as Array<{ url: string; width: number; height: number }>;
    expect(images[0].url).toBe(`${SITE_CONFIG.url}/og-image.png`);
    expect(images[0].width).toBe(1200);
    expect(images[0].height).toBe(630);
  });

  it('sets publishedTime and modifiedTime in Open Graph', () => {
    const meta = generateArticleMetadata(article);
    expect(meta.openGraph?.publishedTime).toBe('2025-11-15T00:00:00.000Z');
    expect(meta.openGraph?.modifiedTime).toBe('2025-11-15T00:00:00.000Z');
  });

  it('sets Open Graph section to article category', () => {
    const meta = generateArticleMetadata(article);
    expect(meta.openGraph?.section).toBe('Fundamentals');
  });

  it('sets Twitter card to summary_large_image', () => {
    const meta = generateArticleMetadata(article);
    expect(meta.twitter?.card).toBe('summary_large_image');
    expect(meta.twitter?.creator).toBe(SITE_CONFIG.author.twitter);
  });

  it('sets the canonical URL in alternates', () => {
    const meta = generateArticleMetadata(article);
    expect(meta.alternates?.canonical).toBe(
      `${SITE_CONFIG.url}/blog/cap-theorem-production`
    );
  });

  it('handles articles without seoKeywords', () => {
    const minimal = {
      title: 'Test',
      description: 'Test desc',
      slug: 'test-slug',
      date: 'Jan 2024',
      category: 'Test',
    };
    const meta = generateArticleMetadata(minimal);
    expect(meta.keywords).toBeUndefined();
    expect(meta.openGraph?.tags).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// generatePersonSchema
// ---------------------------------------------------------------------------
describe('generatePersonSchema', () => {
  it('returns a Person type schema', () => {
    const schema = generatePersonSchema();
    expect(schema['@type']).toBe('Person');
    expect(schema['@context']).toBe('https://schema.org');
  });

  it('contains the correct author name', () => {
    const schema = generatePersonSchema();
    expect(schema.name).toBe(SITE_CONFIG.author.name);
  });

  it('contains the correct job title', () => {
    const schema = generatePersonSchema();
    expect(schema.jobTitle).toBe(SITE_CONFIG.author.jobTitle);
  });

  it('contains the worksFor organization', () => {
    const schema = generatePersonSchema();
    expect(schema.worksFor.name).toBe(SITE_CONFIG.organization.name);
    expect(schema.worksFor.url).toBe(SITE_CONFIG.organization.url);
  });

  it('lists all social links in sameAs', () => {
    const schema = generatePersonSchema();
    expect(schema.sameAs).toContain(SITE_CONFIG.social.twitter);
    expect(schema.sameAs).toContain(SITE_CONFIG.social.linkedin);
    expect(schema.sameAs).toContain(SITE_CONFIG.social.github);
  });

  it('has a @id referencing the site person anchor', () => {
    const schema = generatePersonSchema();
    expect(schema['@id']).toBe(`${SITE_CONFIG.url}/#person`);
  });

  it('includes knowsAbout entries', () => {
    const schema = generatePersonSchema();
    expect(Array.isArray(schema.knowsAbout)).toBe(true);
    expect(schema.knowsAbout.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// generateWebsiteSchema
// ---------------------------------------------------------------------------
describe('generateWebsiteSchema', () => {
  it('returns a WebSite type schema', () => {
    const schema = generateWebsiteSchema();
    expect(schema['@type']).toBe('WebSite');
    expect(schema['@context']).toBe('https://schema.org');
  });

  it('has the correct site URL', () => {
    const schema = generateWebsiteSchema();
    expect(schema.url).toBe(SITE_CONFIG.url);
  });

  it('references the person publisher', () => {
    const schema = generateWebsiteSchema();
    expect(schema.publisher['@id']).toBe(`${SITE_CONFIG.url}/#person`);
  });

  it('sets inLanguage to en-US', () => {
    const schema = generateWebsiteSchema();
    expect(schema.inLanguage).toBe('en-US');
  });

  it('has the correct @id', () => {
    const schema = generateWebsiteSchema();
    expect(schema['@id']).toBe(`${SITE_CONFIG.url}/#website`);
  });
});

// ---------------------------------------------------------------------------
// generateArticleSchema
// ---------------------------------------------------------------------------
describe('generateArticleSchema', () => {
  const article = {
    title: 'Query Optimization at Petabyte Scale',
    description: 'Deep dive into query optimization.',
    slug: 'query-optimization-petabyte-scale',
    date: 'Oct 2025',
    category: 'Deep Dive',
    content: 'word '.repeat(500),
    seoKeywords: ['query optimization', 'database'],
    seriesPosition: 'Part 7 of 9',
  };

  it('returns a TechArticle type schema', () => {
    const schema = generateArticleSchema(article);
    expect(schema['@type']).toBe('TechArticle');
    expect(schema['@context']).toBe('https://schema.org');
  });

  it('sets headline and description from the article', () => {
    const schema = generateArticleSchema(article);
    expect(schema.headline).toBe(article.title);
    expect(schema.description).toBe(article.description);
  });

  it('uses the parsed publish date', () => {
    const schema = generateArticleSchema(article);
    expect(schema.datePublished).toBe('2025-10-15T00:00:00.000Z');
    expect(schema.dateModified).toBe('2025-10-15T00:00:00.000Z');
  });

  it('calculates word count from content', () => {
    const schema = generateArticleSchema(article);
    expect(schema.wordCount).toBe(500);
  });

  it('uses seoKeywords joined by ", " for keywords', () => {
    const schema = generateArticleSchema(article);
    expect(schema.keywords).toBe('query optimization, database');
  });

  it('falls back to category when no seoKeywords', () => {
    const noKeywords = { ...article, seoKeywords: undefined };
    const schema = generateArticleSchema(noKeywords);
    expect(schema.keywords).toBe('Deep Dive');
  });

  it('sets proficiencyLevel to Expert', () => {
    const schema = generateArticleSchema(article);
    expect(schema.proficiencyLevel).toBe('Expert');
  });

  it('sets inLanguage to en-US', () => {
    const schema = generateArticleSchema(article);
    expect(schema.inLanguage).toBe('en-US');
  });

  it('includes isPartOf when seriesInfo is provided', () => {
    const schema = generateArticleSchema(article, { currentIndex: 7, total: 9 });
    expect(schema.isPartOf).toBeDefined();
    expect((schema.isPartOf as { position: number }).position).toBe(7);
    expect((schema.isPartOf as { numberOfItems: number }).numberOfItems).toBe(9);
    expect((schema.isPartOf as { '@type': string })['@type']).toBe(
      'CreativeWorkSeries'
    );
  });

  it('does not include isPartOf when seriesInfo is omitted', () => {
    const schema = generateArticleSchema(article);
    expect(schema.isPartOf).toBeUndefined();
  });

  it('sets the @id to the canonical article URL', () => {
    const schema = generateArticleSchema(article);
    expect(schema['@id']).toBe(
      `${SITE_CONFIG.url}/blog/query-optimization-petabyte-scale`
    );
  });

  it('includes author with person @id reference', () => {
    const schema = generateArticleSchema(article);
    const author = schema.author as { '@id': string };
    expect(author['@id']).toBe(`${SITE_CONFIG.url}/#person`);
  });
});

// ---------------------------------------------------------------------------
// generateBreadcrumbSchema
// ---------------------------------------------------------------------------
describe('generateBreadcrumbSchema', () => {
  const items = [
    { name: 'Home', url: 'https://shahidster.tech' },
    { name: 'Writing', url: 'https://shahidster.tech/#writing' },
    { name: 'My Article', url: 'https://shahidster.tech/blog/my-article' },
  ];

  it('returns a BreadcrumbList type schema', () => {
    const schema = generateBreadcrumbSchema(items);
    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema['@context']).toBe('https://schema.org');
  });

  it('creates itemListElement for each item', () => {
    const schema = generateBreadcrumbSchema(items);
    expect(schema.itemListElement.length).toBe(3);
  });

  it('assigns 1-based positions', () => {
    const schema = generateBreadcrumbSchema(items);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[1].position).toBe(2);
    expect(schema.itemListElement[2].position).toBe(3);
  });

  it('sets name and item on each ListItem', () => {
    const schema = generateBreadcrumbSchema(items);
    expect(schema.itemListElement[0].name).toBe('Home');
    expect(schema.itemListElement[0].item).toBe('https://shahidster.tech');
    expect(schema.itemListElement[2].name).toBe('My Article');
  });

  it('each itemListElement has @type ListItem', () => {
    const schema = generateBreadcrumbSchema(items);
    schema.itemListElement.forEach((el) => {
      expect(el['@type']).toBe('ListItem');
    });
  });

  it('handles a single-item breadcrumb', () => {
    const schema = generateBreadcrumbSchema([
      { name: 'Home', url: 'https://shahidster.tech' },
    ]);
    expect(schema.itemListElement.length).toBe(1);
    expect(schema.itemListElement[0].position).toBe(1);
  });

  it('handles an empty breadcrumb list', () => {
    const schema = generateBreadcrumbSchema([]);
    expect(schema.itemListElement).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// generateFAQSchema
// ---------------------------------------------------------------------------
describe('generateFAQSchema', () => {
  const faqs = [
    { question: 'What is CAP?', answer: 'Consistency, Availability, Partition tolerance.' },
    { question: 'What is eventual consistency?', answer: 'Reads may return stale data temporarily.' },
  ];

  it('returns a FAQPage type schema', () => {
    const schema = generateFAQSchema(faqs);
    expect(schema['@type']).toBe('FAQPage');
    expect(schema['@context']).toBe('https://schema.org');
  });

  it('creates a mainEntity entry for each FAQ', () => {
    const schema = generateFAQSchema(faqs);
    expect(schema.mainEntity.length).toBe(2);
  });

  it('sets each entity type to Question', () => {
    const schema = generateFAQSchema(faqs);
    schema.mainEntity.forEach((entity) => {
      expect(entity['@type']).toBe('Question');
    });
  });

  it('sets the question name', () => {
    const schema = generateFAQSchema(faqs);
    expect(schema.mainEntity[0].name).toBe('What is CAP?');
  });

  it('sets acceptedAnswer type to Answer with text', () => {
    const schema = generateFAQSchema(faqs);
    expect(schema.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe(
      'Consistency, Availability, Partition tolerance.'
    );
  });

  it('handles an empty FAQ list', () => {
    const schema = generateFAQSchema([]);
    expect(schema.mainEntity).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// stripMarkdown
// ---------------------------------------------------------------------------
describe('stripMarkdown', () => {
  it('removes fenced code blocks', () => {
    const input = 'Before\n```js\nconst x = 1;\n```\nAfter';
    const result = stripMarkdown(input, 500);
    expect(result).not.toContain('```');
    expect(result).not.toContain('const x = 1;');
    expect(result).toContain('Before');
    expect(result).toContain('After');
  });

  it('removes inline code', () => {
    const result = stripMarkdown('Use `myFunction()` here', 500);
    expect(result).not.toContain('`');
    expect(result).not.toContain('myFunction()');
  });

  it('removes bold markers but keeps the text', () => {
    const result = stripMarkdown('This is **important** text', 500);
    expect(result).not.toContain('**');
    expect(result).toContain('important');
  });

  it('removes italic markers but keeps the text', () => {
    const result = stripMarkdown('This is *emphasized* text', 500);
    expect(result).not.toContain('*emphasized*');
    expect(result).toContain('emphasized');
  });

  it('removes markdown headers', () => {
    const result = stripMarkdown('## My Section\nContent here', 500);
    expect(result).not.toContain('#');
    expect(result).toContain('My Section');
  });

  it('removes all heading levels', () => {
    const input = '# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6';
    const result = stripMarkdown(input, 500);
    expect(result).not.toContain('#');
  });

  it('converts markdown links to link text only', () => {
    const result = stripMarkdown('[click here](https://example.com)', 500);
    expect(result).not.toContain('https://example.com');
    expect(result).toContain('click here');
  });

  it('collapses newlines into spaces', () => {
    const result = stripMarkdown('Line one\n\nLine two', 500);
    expect(result).toContain('Line one');
    expect(result).toContain('Line two');
    expect(result).not.toMatch(/\n\n/);
  });

  it('truncates to the default maxLength of 160 characters', () => {
    const longText = 'a'.repeat(200);
    const result = stripMarkdown(longText);
    expect(result.length).toBe(160);
    expect(result.endsWith('...')).toBe(true);
  });

  it('truncates to a custom maxLength', () => {
    const text = 'Hello world, this is a longer sentence that needs truncating.';
    const result = stripMarkdown(text, 20);
    expect(result.length).toBe(20);
    expect(result.endsWith('...')).toBe(true);
  });

  it('does not truncate text shorter than maxLength', () => {
    const short = 'Short text.';
    const result = stripMarkdown(short);
    expect(result).toBe('Short text.');
  });

  it('trims surrounding whitespace', () => {
    const result = stripMarkdown('  hello world  ', 500);
    expect(result).toBe('hello world');
  });

  it('handles empty string', () => {
    expect(stripMarkdown('')).toBe('');
  });
});

// ---------------------------------------------------------------------------
// calculateReadTime
// ---------------------------------------------------------------------------
describe('calculateReadTime', () => {
  it('formats the result as "<n> min read"', () => {
    const result = calculateReadTime('word '.repeat(200));
    expect(result).toMatch(/^\d+ min read$/);
  });

  it('calculates 1 min read for content under the WPM threshold', () => {
    const result = calculateReadTime('word '.repeat(199));
    expect(result).toBe('1 min read');
  });

  it('calculates 1 min read for exactly 200 words at default WPM', () => {
    const result = calculateReadTime('word '.repeat(200));
    expect(result).toBe('1 min read');
  });

  it('calculates 2 min read for 201 words at default WPM', () => {
    const result = calculateReadTime('word '.repeat(201));
    expect(result).toBe('2 min read');
  });

  it('respects a custom wordsPerMinute value', () => {
    // 100 words at 50 WPM = 2 min
    const result = calculateReadTime('word '.repeat(100), 50);
    expect(result).toBe('2 min read');
  });

  it('always returns at least 1 min read for non-empty content', () => {
    const result = calculateReadTime('single');
    expect(result).toBe('1 min read');
  });

  it('rounds up fractional minutes', () => {
    // 201 words / 200 WPM = 1.005 → ceil → 2
    const result = calculateReadTime('word '.repeat(201));
    expect(result).toBe('2 min read');
  });
});

// ---------------------------------------------------------------------------
// trackPageView and trackEvent (analytics)
// ---------------------------------------------------------------------------
describe('trackPageView', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('does not throw when window.gtag is absent', () => {
    expect(() => trackPageView('/blog/test')).not.toThrow();
  });

  it('calls window.gtag with config command when available', () => {
    const mockGtag = vi.fn();
    const previousGaId = process.env.NEXT_PUBLIC_GA_ID;
    process.env.NEXT_PUBLIC_GA_ID = 'G-TEST123456';

    try {
      vi.stubGlobal('window', { ...window, gtag: mockGtag });
      trackPageView('/blog/test', 'Test Title');
      expect(mockGtag).toHaveBeenCalledWith(
        'config',
        'G-TEST123456',
        expect.objectContaining({
          page_path: '/blog/test',
          page_title: 'Test Title',
        })
      );
    } finally {
      if (previousGaId === undefined) {
        delete process.env.NEXT_PUBLIC_GA_ID;
      } else {
        process.env.NEXT_PUBLIC_GA_ID = previousGaId;
      }
    }
  });
});

describe('trackEvent', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('does not throw when window.gtag is absent', () => {
    expect(() => trackEvent('article_view')).not.toThrow();
  });

  it('calls window.gtag with event command when available', () => {
    const mockGtag = vi.fn();
    vi.stubGlobal('window', { ...window, gtag: mockGtag });
    trackEvent('article_view', { slug: 'test' });
    expect(mockGtag).toHaveBeenCalledWith(
      'event',
      'article_view',
      { slug: 'test' }
    );
  });

  it('handles event with no params', () => {
    const mockGtag = vi.fn();
    vi.stubGlobal('window', { ...window, gtag: mockGtag });
    trackEvent('page_load');
    expect(mockGtag).toHaveBeenCalledWith('event', 'page_load', undefined);
  });
});