/**
 * Tests for docs/nextjs-migration-examples/app/rss.xml/route.ts
 *
 * Covers the GET handler that generates an RSS 2.0 feed from blog articles.
 * The private helpers (escapeXml, parseDate, stripMarkdown) are verified
 * indirectly through the response body.
 */

import { describe, it, expect, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Mock @/data/articles so we control the test data
// ---------------------------------------------------------------------------
vi.mock('@/data/articles', () => ({
  articles: [
    {
      slug: 'article-one',
      title: 'First & Article',
      description: 'First <article> description',
      category: 'Architecture',
      readTime: '5 min read',
      date: 'Nov 2025',
      featured: true,
      seoKeywords: ['distributed', 'systems'],
      content: '## Intro\n\nThis is **bold** content with `code` and more words.',
    },
    {
      slug: 'article-two',
      title: 'Second Article',
      description: 'Second article description',
      category: 'Operations',
      readTime: '8 min read',
      date: 'Sep 2025',
      featured: false,
      seoKeywords: ['operations'],
      content: 'Second article plain content.',
    },
    {
      slug: 'article-three',
      title: 'Third "Article"',
      description: "Third article's description",
      category: 'Performance',
      readTime: '10 min read',
      date: 'Jan 2026',
      featured: false,
      content: 'Third article content here.',
    },
  ],
}));

// Import AFTER mocking
const { GET } = await import(
  '../../docs/nextjs-migration-examples/app/rss.xml/route'
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function getBody(): Promise<string> {
  const response = await GET();
  return response.text();
}

// ---------------------------------------------------------------------------
// Response structure
// ---------------------------------------------------------------------------
describe('GET /rss.xml - response structure', () => {
  it('returns a Response object', async () => {
    const response = await GET();
    expect(response).toBeInstanceOf(Response);
  });

  it('sets Content-Type to application/rss+xml; charset=utf-8', async () => {
    const response = await GET();
    expect(response.headers.get('Content-Type')).toBe(
      'application/rss+xml; charset=utf-8'
    );
  });

  it('sets Cache-Control header with public directive', async () => {
    const response = await GET();
    const cacheControl = response.headers.get('Cache-Control');
    expect(cacheControl).toContain('public');
    expect(cacheControl).toContain('max-age=3600');
    expect(cacheControl).toContain('s-maxage=3600');
  });

  it('sets X-Content-Type-Options to nosniff', async () => {
    const response = await GET();
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
  });
});

// ---------------------------------------------------------------------------
// XML structure
// ---------------------------------------------------------------------------
describe('GET /rss.xml - XML structure', () => {
  it('starts with an XML declaration', async () => {
    const body = await getBody();
    expect(body.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });

  it('contains the RSS root element with version 2.0', async () => {
    const body = await getBody();
    expect(body).toContain('rss version="2.0"');
  });

  it('declares the content namespace', async () => {
    const body = await getBody();
    expect(body).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
  });

  it('declares the atom namespace', async () => {
    const body = await getBody();
    expect(body).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
  });

  it('contains a channel element', async () => {
    const body = await getBody();
    expect(body).toContain('<channel>');
    expect(body).toContain('</channel>');
  });

  it('includes a channel title', async () => {
    const body = await getBody();
    expect(body).toContain('<title>');
    expect(body).toContain('Shahid Moosa');
  });

  it('includes the Atom self-link', async () => {
    const body = await getBody();
    expect(body).toContain('atom:link');
    expect(body).toContain('rel="self"');
  });

  it('includes an image block for the feed', async () => {
    const body = await getBody();
    expect(body).toContain('<image>');
    expect(body).toContain('og-image.png');
  });
});

// ---------------------------------------------------------------------------
// Article items in the feed
// ---------------------------------------------------------------------------
describe('GET /rss.xml - article items', () => {
  it('includes an <item> block for each article', async () => {
    const body = await getBody();
    const itemCount = (body.match(/<item>/g) || []).length;
    expect(itemCount).toBe(3);
  });

  it('includes article slugs in item links', async () => {
    const body = await getBody();
    expect(body).toContain('/blog/article-one');
    expect(body).toContain('/blog/article-two');
    expect(body).toContain('/blog/article-three');
  });

  it('includes article descriptions', async () => {
    const body = await getBody();
    expect(body).toContain('Second article description');
  });

  it('includes author information', async () => {
    const body = await getBody();
    expect(body).toContain('hello@shahidster.tech');
    expect(body).toContain('Shahid Moosa');
  });

  it('includes category tags from article category and seoKeywords', async () => {
    const body = await getBody();
    expect(body).toContain('<category>Architecture</category>');
    expect(body).toContain('<category>distributed</category>');
    expect(body).toContain('<category>systems</category>');
  });

  it('includes content:encoded CDATA block', async () => {
    const body = await getBody();
    expect(body).toContain('<content:encoded>');
    expect(body).toContain('<![CDATA[');
  });
});

// ---------------------------------------------------------------------------
// XML escaping (via escapeXml helper)
// ---------------------------------------------------------------------------
describe('GET /rss.xml - XML escaping', () => {
  it('escapes ampersands in article titles', async () => {
    const body = await getBody();
    // "First & Article" → "First &amp; Article"
    expect(body).toContain('First &amp; Article');
    expect(body).not.toContain('First & Article');
  });

  it('escapes angle brackets in article descriptions', async () => {
    const body = await getBody();
    // "First <article> description" → "First &lt;article&gt; description"
    expect(body).toContain('&lt;article&gt;');
    expect(body).not.toContain('<article>');
  });

  it('escapes double quotes in article titles', async () => {
    const body = await getBody();
    // 'Third "Article"' → 'Third &quot;Article&quot;'
    expect(body).toContain('Third &quot;Article&quot;');
  });

  it("escapes apostrophes in article descriptions", async () => {
    const body = await getBody();
    // "Third article's description" → "Third article&apos;s description"
    expect(body).toContain('&apos;s description');
  });
});

// ---------------------------------------------------------------------------
// Date sorting (newest first)
// ---------------------------------------------------------------------------
describe('GET /rss.xml - article ordering', () => {
  it('lists the most recent article first', async () => {
    const body = await getBody();
    // Jan 2026 > Nov 2025 > Sep 2025
    const indexThird = body.indexOf('/blog/article-three'); // Jan 2026
    const indexFirst = body.indexOf('/blog/article-one');  // Nov 2025
    const indexSecond = body.indexOf('/blog/article-two'); // Sep 2025
    expect(indexThird).toBeLessThan(indexFirst);
    expect(indexFirst).toBeLessThan(indexSecond);
  });
});

// ---------------------------------------------------------------------------
// Content stripping (via stripMarkdown helper)
// ---------------------------------------------------------------------------
describe('GET /rss.xml - markdown stripping in content:encoded', () => {
  it('strips markdown headers from content', async () => {
    const body = await getBody();
    // The content:encoded for article-one should not have "## Intro"
    const cdataStart = body.indexOf('<![CDATA[');
    const cdataEnd = body.indexOf(']]>');
    const cdata = body.slice(cdataStart, cdataEnd);
    expect(cdata).not.toContain('## ');
  });

  it('strips bold markers but keeps the text', async () => {
    const body = await getBody();
    const cdataStart = body.indexOf('<![CDATA[');
    const cdataEnd = body.indexOf(']]>');
    const cdata = body.slice(cdataStart, cdataEnd);
    expect(cdata).not.toContain('**bold**');
    expect(cdata).toContain('bold');
  });
});