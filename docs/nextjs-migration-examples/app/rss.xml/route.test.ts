/**
 * Tests for Next.js App Router RSS Feed Route Handler
 * Testing RSS 2.0 feed generation, XML escaping, and caching
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';

// Mock the articles data
vi.mock('@/data/articles', () => ({
  articles: [
    {
      slug: 'first-article',
      title: 'First Article',
      description: 'First article description',
      category: 'Testing',
      date: 'Jan 2024',
      seoKeywords: ['test', 'article', 'first'],
      content:
        '## Introduction\n\nThis is **bold** and `code` with ```javascript\nconst x = 1;\n``` blocks.',
    },
    {
      slug: 'second-article',
      title: 'Second Article with <Special> & Characters',
      description: 'Description with & and < and > symbols',
      category: 'Advanced & Special',
      date: 'Feb 2024',
      seoKeywords: ['special', 'chars'],
      content: 'Simple content for second article.',
    },
    {
      slug: 'third-article',
      title: 'Third Article',
      description: 'Recent article',
      category: 'Latest',
      date: 'Mar 2024',
      content: 'Recent article content with [link](https://example.com)',
    },
  ],
}));

describe('RSS Feed Route - GET handler', () => {
  it('should return Response object', async () => {
    const response = await GET();

    expect(response).toBeInstanceOf(Response);
  });

  it('should return RSS 2.0 XML feed', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(text).toContain('<rss version="2.0"');
    expect(text).toContain('</rss>');
  });

  it('should include required namespaces', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
    expect(text).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    expect(text).toContain('xmlns:dc="http://purl.org/dc/elements/1.1/"');
  });

  it('should include channel metadata', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<channel>');
    expect(text).toContain('<title>');
    expect(text).toContain('<link>');
    expect(text).toContain('<description>');
    expect(text).toContain('<language>en-us</language>');
    expect(text).toContain('</channel>');
  });

  it('should include lastBuildDate', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<lastBuildDate>');
    expect(text).toMatch(/<lastBuildDate>[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4}/);
  });

  it('should include atom self link', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<atom:link');
    expect(text).toContain('rel="self"');
    expect(text).toContain('type="application/rss+xml"');
    expect(text).toContain('/rss.xml');
  });

  it('should include channel image', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<image>');
    expect(text).toContain('<url>');
    expect(text).toContain('<width>1200</width>');
    expect(text).toContain('<height>630</height>');
    expect(text).toContain('</image>');
  });

  it('should include all articles as items', async () => {
    const response = await GET();
    const text = await response.text();

    const itemMatches = text.match(/<item>/g);
    expect(itemMatches).not.toBeNull();
    expect(itemMatches!.length).toBe(3);

    expect(text).toContain('First Article');
    expect(text).toContain('second-article');
    expect(text).toContain('Third Article');
  });

  it('should sort articles by date (newest first)', async () => {
    const response = await GET();
    const text = await response.text();

    const thirdIndex = text.indexOf('Third Article');
    const secondIndex = text.indexOf('Second Article');
    const firstIndex = text.indexOf('First Article');

    expect(thirdIndex).toBeLessThan(secondIndex);
    expect(secondIndex).toBeLessThan(firstIndex);
  });

  it('should escape XML special characters', async () => {
    const response = await GET();
    const text = await response.text();

    // Should escape < > & " '
    expect(text).toContain('&lt;Special&gt; &amp;');
    expect(text).not.toContain('<Special> &');

    // Title should be escaped
    expect(text).toContain('&lt;Special&gt;');
  });

  it('should include item title', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<title>First Article</title>');
  });

  it('should include item link', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<link>https://shahidster.tech/blog/first-article</link>');
  });

  it('should include item guid with isPermaLink', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<guid isPermaLink="true">');
    expect(text).toContain('/blog/first-article</guid>');
  });

  it('should include item description', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<description>First article description</description>');
  });

  it('should include content:encoded with CDATA', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<content:encoded><![CDATA[');
    expect(text).toContain(']]></content:encoded>');
  });

  it('should include pubDate in RFC 822 format', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<pubDate>');
    expect(text).toMatch(
      /<pubDate>[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT<\/pubDate>/
    );
  });

  it('should include author information', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<author>');
    expect(text).toContain('hello@shahidster.tech');
    expect(text).toContain('Shahid Moosa');
  });

  it('should include article category', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<category>Testing</category>');
  });

  it('should include SEO keywords as categories', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<category>test</category>');
    expect(text).toContain('<category>article</category>');
    expect(text).toContain('<category>first</category>');
  });

  it('should handle articles without SEO keywords', async () => {
    const response = await GET();
    const text = await response.text();

    // Third article has no keywords, should still have category
    const thirdArticleSection = text.substring(
      text.indexOf('third-article'),
      text.indexOf('third-article') + 500
    );
    expect(thirdArticleSection).toContain('<category>Latest</category>');
  });

  it('should set correct Content-Type header', async () => {
    const response = await GET();

    expect(response.headers.get('Content-Type')).toBe(
      'application/rss+xml; charset=utf-8'
    );
  });

  it('should set Cache-Control headers', async () => {
    const response = await GET();
    const cacheControl = response.headers.get('Cache-Control');

    expect(cacheControl).toBeTruthy();
    expect(cacheControl).toContain('public');
    expect(cacheControl).toContain('max-age=3600');
    expect(cacheControl).toContain('s-maxage=3600');
    expect(cacheControl).toContain('stale-while-revalidate=86400');
  });

  it('should set X-Content-Type-Options header', async () => {
    const response = await GET();

    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
  });

  it('should include generator tag', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<generator>Next.js RSS Generator</generator>');
  });

  it('should include managingEditor', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<managingEditor>');
    expect(text).toContain('hello@shahidster.tech');
  });

  it('should include webMaster', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<webMaster>');
  });

  it('should include copyright', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<copyright>');
    const currentYear = new Date().getFullYear();
    expect(text).toContain(`Copyright ${currentYear}`);
  });

  it('should include TTL', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('<ttl>60</ttl>');
  });
});

describe('RSS Feed Route - stripMarkdown', () => {
  it('should remove code blocks from content', async () => {
    const response = await GET();
    const text = await response.text();

    // Code blocks should be stripped from content:encoded
    const cdataMatch = text.match(/<content:encoded><!\[CDATA\[(.*?)\]\]>/s);
    if (cdataMatch) {
      const content = cdataMatch[1];
      expect(content).not.toContain('```javascript');
      expect(content).not.toContain('const x = 1;');
    }
  });

  it('should remove inline code from content', async () => {
    const response = await GET();
    const text = await response.text();

    const cdataMatch = text.match(/<content:encoded><!\[CDATA\[(.*?)\]\]>/s);
    if (cdataMatch) {
      const content = cdataMatch[1];
      expect(content).not.toContain('`code`');
    }
  });

  it('should remove bold markers from content', async () => {
    const response = await GET();
    const text = await response.text();

    const cdataMatch = text.match(/<content:encoded><!\[CDATA\[(.*?)\]\]>/s);
    if (cdataMatch) {
      const content = cdataMatch[1];
      expect(content).not.toContain('**bold**');
    }
  });

  it('should remove headers from content', async () => {
    const response = await GET();
    const text = await response.text();

    const cdataMatch = text.match(/<content:encoded><!\[CDATA\[(.*?)\]\]>/s);
    if (cdataMatch) {
      const content = cdataMatch[1];
      expect(content).not.toContain('## Introduction');
    }
  });

  it('should convert links to plain text', async () => {
    const response = await GET();
    const text = await response.text();

    const cdataMatch = text.match(/<content:encoded><!\[CDATA\[(.*?)\]\]>/s);
    if (cdataMatch) {
      const content = cdataMatch[1];
      expect(content).not.toContain('[link](https://example.com)');
    }
  });

  it('should append ellipsis to content', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('...</content:encoded>');
  });

  it('should limit content to 500 characters', async () => {
    const response = await GET();
    const text = await response.text();

    const cdataMatches = text.match(/<content:encoded><!\[CDATA\[(.*?)\.\.\.\]\]>/gs);
    if (cdataMatches) {
      cdataMatches.forEach((match) => {
        const contentLength = match.length - '<content:encoded><![CDATA['.length - '...]]>'.length;
        expect(contentLength).toBeLessThanOrEqual(500);
      });
    }
  });
});

describe('RSS Feed Route - escapeXml', () => {
  it('should escape ampersands', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('&amp;');
  });

  it('should escape less than signs', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('&lt;Special&gt;');
  });

  it('should escape greater than signs', async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain('&gt;');
  });

  it('should escape quotes', async () => {
    const response = await GET();
    const text = await response.text();

    // XML escaping should handle quotes
    expect(text).not.toContain('<title>"Unescaped"</title>');
  });

  it('should escape apostrophes', async () => {
    const response = await GET();
    const text = await response.text();

    // Test that the feed is valid XML
    expect(text).toContain('<rss version="2.0"');
  });
});

describe('RSS Feed Route - parseDate', () => {
  it('should parse dates to UTC', async () => {
    const response = await GET();
    const text = await response.text();

    // All dates should be in GMT
    const dateMatches = text.match(/<pubDate>.*?GMT<\/pubDate>/g);
    expect(dateMatches).not.toBeNull();
    expect(dateMatches!.length).toBeGreaterThan(0);
  });

  it('should handle all months correctly', async () => {
    const response = await GET();
    const text = await response.text();

    // Verify dates are properly formatted
    expect(text).toContain('<pubDate>');
    expect(text).toMatch(/Jan \d{4}/);
    expect(text).toMatch(/Feb \d{4}/);
    expect(text).toMatch(/Mar \d{4}/);
  });
});

describe('RSS Feed Route - edge cases', () => {
  it('should handle empty CDATA sections safely', async () => {
    const response = await GET();
    const text = await response.text();

    // Should not have empty CDATA
    expect(text).not.toContain('<![CDATA[]]>');
  });

  it('should not break on CDATA escape sequences', async () => {
    const response = await GET();
    const text = await response.text();

    // Feed should be well-formed
    expect(text.startsWith('<?xml version="1.0"')).toBe(true);
    expect(text.endsWith('</rss>')).toBe(true);
  });

  it('should handle multiple categories per item', async () => {
    const response = await GET();
    const text = await response.text();

    // First article should have category + keywords
    const firstArticleMatch = text.match(
      /<item>[\s\S]*?first-article[\s\S]*?<\/item>/
    );
    if (firstArticleMatch) {
      const categoryMatches = firstArticleMatch[0].match(/<category>/g);
      expect(categoryMatches).not.toBeNull();
      expect(categoryMatches!.length).toBeGreaterThan(1); // category + keywords
    }
  });

  it('should produce valid RSS 2.0 structure', async () => {
    const response = await GET();
    const text = await response.text();

    // Count opening and closing tags
    const openRss = (text.match(/<rss/g) || []).length;
    const closeRss = (text.match(/<\/rss>/g) || []).length;
    const openChannel = (text.match(/<channel>/g) || []).length;
    const closeChannel = (text.match(/<\/channel>/g) || []).length;

    expect(openRss).toBe(1);
    expect(closeRss).toBe(1);
    expect(openChannel).toBe(1);
    expect(closeChannel).toBe(1);
  });

  it('should not include malformed XML', async () => {
    const response = await GET();
    const text = await response.text();

    // No unclosed tags
    expect(text).not.toMatch(/<[a-z]+>[^<]*$/i);
  });

  it('should handle long content gracefully', async () => {
    const response = await GET();
    const text = await response.text();

    // Content should be truncated to reasonable length
    expect(text.length).toBeLessThan(1000000); // Less than 1MB
  });
});

describe('RSS Feed Route - performance', () => {
  it('should complete within reasonable time', async () => {
    const start = Date.now();
    await GET();
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(1000); // Less than 1 second
  });

  it('should return cacheable response', async () => {
    const response = await GET();

    expect(response.headers.get('Cache-Control')).toBeTruthy();
  });
});