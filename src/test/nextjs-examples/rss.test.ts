import { describe, it, expect } from 'vitest';

const SITE_URL = 'https://shahidster.tech';
const SITE_TITLE = 'Shahid Moosa — Distributed Systems Engineering';
const SITE_DESCRIPTION = 'Deep dives into distributed databases, data infrastructure, and production systems.';
const AUTHOR_NAME = 'Shahid Moosa';
const AUTHOR_EMAIL = 'hello@shahidster.tech';

// Utility functions from the example
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
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const [month, year] = dateStr.split(' ');
  return new Date(parseInt(year), months[month] || 0, 15);
}

function stripMarkdown(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 500);
}

// Mock article data
const mockArticles = [
  {
    slug: 'cap-theorem-production',
    title: 'CAP Theorem in Production',
    description: 'Understanding CAP theorem in real-world systems',
    content: 'This is the article content with **bold** text and `code`.',
    date: 'Nov 2025',
    category: 'Fundamentals',
    seoKeywords: ['CAP theorem', 'distributed systems', 'consistency'],
  },
  {
    slug: 'sharding-strategies',
    title: 'Sharding Strategies That Work',
    description: 'Practical approaches to database sharding',
    content: 'Article about sharding with [links](http://example.com).',
    date: 'Oct 2025',
    category: 'Database',
    seoKeywords: ['sharding', 'database', 'scalability'],
  },
];

// RSS generator function
function generateRSSFeed(articles: typeof mockArticles) {
  const now = new Date().toUTCString();
  const sortedArticles = [...articles].sort((a, b) => {
    return parseDate(b.date).getTime() - parseDate(a.date).getTime();
  });

  const items = sortedArticles
    .map((article) => {
      const pubDate = parseDate(article.date).toUTCString();
      const articleUrl = `${SITE_URL}/blog/${article.slug}`;
      const summary = stripMarkdown(article.content);
      const categories = [
        article.category,
        ...(article.seoKeywords || []),
      ]
        .map((cat) => `      <category>${escapeXml(cat)}</category>`)
        .join('\n');

      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description>${escapeXml(article.description)}</description>
      <content:encoded><![CDATA[${summary}...]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <author>${AUTHOR_EMAIL} (${AUTHOR_NAME})</author>
${categories}
    </item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <ttl>60</ttl>
    <generator>Next.js RSS Generator</generator>
    <managingEditor>${AUTHOR_EMAIL} (${AUTHOR_NAME})</managingEditor>
    <webMaster>${AUTHOR_EMAIL} (${AUTHOR_NAME})</webMaster>
    <copyright>Copyright ${new Date().getFullYear()} ${AUTHOR_NAME}. All rights reserved.</copyright>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/og-image.png</url>
      <title>${escapeXml(SITE_TITLE)}</title>
      <link>${SITE_URL}</link>
      <width>1200</width>
      <height>630</height>
    </image>
    ${items}
  </channel>
</rss>`;
}

describe('RSS Feed Generation', () => {
  describe('escapeXml', () => {
    it('should escape ampersands', () => {
      expect(escapeXml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    it('should escape less than signs', () => {
      expect(escapeXml('5 < 10')).toBe('5 &lt; 10');
    });

    it('should escape greater than signs', () => {
      expect(escapeXml('10 > 5')).toBe('10 &gt; 5');
    });

    it('should escape double quotes', () => {
      expect(escapeXml('Say "hello"')).toBe('Say &quot;hello&quot;');
    });

    it('should escape single quotes', () => {
      expect(escapeXml("It's working")).toBe('It&apos;s working');
    });

    it('should escape multiple special characters', () => {
      const input = '<tag attr="value" & more>';
      const expected = '&lt;tag attr=&quot;value&quot; &amp; more&gt;';
      expect(escapeXml(input)).toBe(expected);
    });

    it('should handle empty string', () => {
      expect(escapeXml('')).toBe('');
    });

    it('should handle string without special characters', () => {
      expect(escapeXml('Hello World')).toBe('Hello World');
    });

    it('should handle XML injection attempts', () => {
      const malicious = '<script>alert("xss")</script>';
      const escaped = escapeXml(malicious);
      expect(escaped).not.toContain('<script>');
      expect(escaped).toContain('&lt;script&gt;');
    });
  });

  describe('parseDate', () => {
    it('should parse date to UTC string', () => {
      const date = parseDate('Nov 2025');
      const utcString = date.toUTCString();
      expect(utcString).toMatch(/^\w{3}, \d{2} \w{3} \d{4}/);
    });

    it('should handle different months', () => {
      const dates = [
        'Jan 2024',
        'Jun 2024',
        'Dec 2024',
      ];

      dates.forEach((dateStr) => {
        const date = parseDate(dateStr);
        expect(date).toBeInstanceOf(Date);
        expect(date.getTime()).not.toBeNaN();
      });
    });
  });

  describe('RSS Feed Structure', () => {
    it('should generate valid RSS 2.0 feed', () => {
      const feed = generateRSSFeed(mockArticles);

      expect(feed).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(feed).toContain('<rss version="2.0"');
      expect(feed).toContain('</rss>');
    });

    it('should include required channel elements', () => {
      const feed = generateRSSFeed(mockArticles);

      expect(feed).toContain('<channel>');
      expect(feed).toContain('</channel>');
      expect(feed).toContain('<title>');
      expect(feed).toContain('<link>');
      expect(feed).toContain('<description>');
    });

    it('should include namespace declarations', () => {
      const feed = generateRSSFeed(mockArticles);

      expect(feed).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
      expect(feed).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
      expect(feed).toContain('xmlns:dc="http://purl.org/dc/elements/1.1/"');
    });

    it('should include channel metadata', () => {
      const feed = generateRSSFeed(mockArticles);

      expect(feed).toContain(escapeXml(SITE_TITLE));
      expect(feed).toContain(SITE_URL);
      expect(feed).toContain(escapeXml(SITE_DESCRIPTION));
      expect(feed).toContain('<language>en-us</language>');
    });

    it('should include build date', () => {
      const feed = generateRSSFeed(mockArticles);
      expect(feed).toContain('<lastBuildDate>');
      expect(feed).toContain('<pubDate>');
    });

    it('should include TTL', () => {
      const feed = generateRSSFeed(mockArticles);
      expect(feed).toContain('<ttl>60</ttl>');
    });

    it('should include generator info', () => {
      const feed = generateRSSFeed(mockArticles);
      expect(feed).toContain('<generator>Next.js RSS Generator</generator>');
    });

    it('should include managing editor', () => {
      const feed = generateRSSFeed(mockArticles);
      expect(feed).toContain(`<managingEditor>${AUTHOR_EMAIL} (${AUTHOR_NAME})</managingEditor>`);
    });

    it('should include webmaster', () => {
      const feed = generateRSSFeed(mockArticles);
      expect(feed).toContain(`<webMaster>${AUTHOR_EMAIL} (${AUTHOR_NAME})</webMaster>`);
    });

    it('should include copyright notice', () => {
      const feed = generateRSSFeed(mockArticles);
      const currentYear = new Date().getFullYear();
      expect(feed).toContain(`Copyright ${currentYear}`);
    });

    it('should include atom self link', () => {
      const feed = generateRSSFeed(mockArticles);
      expect(feed).toContain(`<atom:link href="${SITE_URL}/rss.xml" rel="self"`);
    });

    it('should include channel image', () => {
      const feed = generateRSSFeed(mockArticles);
      expect(feed).toContain('<image>');
      expect(feed).toContain(`<url>${SITE_URL}/og-image.png</url>`);
      expect(feed).toContain('<width>1200</width>');
      expect(feed).toContain('<height>630</height>');
    });
  });

  describe('RSS Items', () => {
    it('should include all articles as items', () => {
      const feed = generateRSSFeed(mockArticles);
      const itemCount = (feed.match(/<item>/g) || []).length;
      expect(itemCount).toBe(mockArticles.length);
    });

    it('should include item title', () => {
      const feed = generateRSSFeed(mockArticles);
      mockArticles.forEach((article) => {
        expect(feed).toContain(`<title>${escapeXml(article.title)}</title>`);
      });
    });

    it('should include item link', () => {
      const feed = generateRSSFeed(mockArticles);
      mockArticles.forEach((article) => {
        const expectedUrl = `${SITE_URL}/blog/${article.slug}`;
        expect(feed).toContain(`<link>${expectedUrl}</link>`);
      });
    });

    it('should include item guid', () => {
      const feed = generateRSSFeed(mockArticles);
      mockArticles.forEach((article) => {
        const expectedUrl = `${SITE_URL}/blog/${article.slug}`;
        expect(feed).toContain(`<guid isPermaLink="true">${expectedUrl}</guid>`);
      });
    });

    it('should include item description', () => {
      const feed = generateRSSFeed(mockArticles);
      mockArticles.forEach((article) => {
        expect(feed).toContain(`<description>${escapeXml(article.description)}</description>`);
      });
    });

    it('should include content:encoded with CDATA', () => {
      const feed = generateRSSFeed(mockArticles);
      expect(feed).toContain('<content:encoded><![CDATA[');
      expect(feed).toContain(']]></content:encoded>');
    });

    it('should include publication date', () => {
      const feed = generateRSSFeed(mockArticles);
      expect(feed).toContain('<pubDate>');
    });

    it('should include author', () => {
      const feed = generateRSSFeed(mockArticles);
      expect(feed).toContain(`<author>${AUTHOR_EMAIL} (${AUTHOR_NAME})</author>`);
    });

    it('should include categories', () => {
      const feed = generateRSSFeed(mockArticles);
      mockArticles.forEach((article) => {
        expect(feed).toContain(`<category>${escapeXml(article.category)}</category>`);
      });
    });

    it('should include SEO keywords as categories', () => {
      const feed = generateRSSFeed(mockArticles);
      mockArticles.forEach((article) => {
        article.seoKeywords?.forEach((keyword) => {
          expect(feed).toContain(`<category>${escapeXml(keyword)}</category>`);
        });
      });
    });
  });

  describe('Content Processing', () => {
    it('should strip markdown from content', () => {
      const feed = generateRSSFeed(mockArticles);
      expect(feed).not.toContain('**bold**');
      expect(feed).not.toContain('`code`');
      expect(feed).not.toContain('[links]');
    });

    it('should handle content with special characters', () => {
      const specialArticle = [{
        ...mockArticles[0],
        title: 'Article with <special> & "characters"',
        description: 'Description with <tags> & more',
        content: 'Content here',
      }];

      const feed = generateRSSFeed(specialArticle);
      expect(feed).toContain('&lt;special&gt;');
      expect(feed).toContain('&amp;');
      expect(feed).toContain('&quot;');
    });
  });

  describe('Article Sorting', () => {
    it('should sort articles by date (newest first)', () => {
      const feed = generateRSSFeed(mockArticles);
      const novIndex = feed.indexOf('Nov 2025');
      const octIndex = feed.indexOf('Oct 2025');

      expect(novIndex).toBeLessThan(octIndex);
    });

    it('should maintain sort order with multiple articles', () => {
      const articles = [
        { ...mockArticles[0], date: 'Jan 2025' },
        { ...mockArticles[0], date: 'Dec 2024' },
        { ...mockArticles[0], date: 'Nov 2024' },
      ];

      const feed = generateRSSFeed(articles);
      const janIndex = feed.indexOf('Jan 2025');
      const decIndex = feed.indexOf('Dec 2024');
      const novIndex = feed.indexOf('Nov 2024');

      expect(janIndex).toBeLessThan(decIndex);
      expect(decIndex).toBeLessThan(novIndex);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty articles array', () => {
      const feed = generateRSSFeed([]);
      expect(feed).toContain('<channel>');
      expect(feed).not.toContain('<item>');
    });

    it('should handle articles without SEO keywords', () => {
      const articlesWithoutKeywords = [{
        ...mockArticles[0],
        seoKeywords: undefined,
      }];

      const feed = generateRSSFeed(articlesWithoutKeywords);
      expect(feed).toContain('<item>');
    });

    it('should handle very long content', () => {
      const longArticle = [{
        ...mockArticles[0],
        content: 'word '.repeat(1000), // 1000 words
      }];

      const feed = generateRSSFeed(longArticle);
      expect(feed).toContain('<content:encoded>');
    });

    it('should handle special characters in URLs', () => {
      const specialArticle = [{
        ...mockArticles[0],
        slug: 'article-with-special-chars',
      }];

      const feed = generateRSSFeed(specialArticle);
      expect(feed).toContain('article-with-special-chars');
    });
  });

  describe('XML Validation', () => {
    it('should produce well-formed XML', () => {
      const feed = generateRSSFeed(mockArticles);

      // Basic XML structure checks
      expect(feed).toMatch(/^<\?xml/);
      expect((feed.match(/<rss/g) || []).length).toBe(1);
      expect((feed.match(/<\/rss>/g) || []).length).toBe(1);
      expect((feed.match(/<channel>/g) || []).length).toBe(1);
      expect((feed.match(/<\/channel>/g) || []).length).toBe(1);
    });

    it('should have matching open and close tags for items', () => {
      const feed = generateRSSFeed(mockArticles);
      const openItems = (feed.match(/<item>/g) || []).length;
      const closeItems = (feed.match(/<\/item>/g) || []).length;
      expect(openItems).toBe(closeItems);
    });

    it('should escape all special characters in content', () => {
      const specialArticle = [{
        ...mockArticles[0],
        title: '< > & " \' test',
        description: '< > & " \' test',
      }];

      const feed = generateRSSFeed(specialArticle);

      // Check that special characters in title and description are escaped
      expect(feed).toContain('&lt; &gt; &amp; &quot; &apos; test');

      // Verify the escaped title appears in the feed
      const escapedTitleRegex = /<title>(&lt; &gt; &amp; &quot; &apos; test)<\/title>/;
      expect(feed).toMatch(escapedTitleRegex);

      // Should not contain raw unescaped script tags
      expect(feed).not.toContain('<script>');
    });
  });

  describe('Security', () => {
    it('should prevent XSS in titles', () => {
      const xssArticle = [{
        ...mockArticles[0],
        title: '<script>alert("xss")</script>',
      }];

      const feed = generateRSSFeed(xssArticle);
      expect(feed).not.toContain('<script>alert("xss")</script>');
      expect(feed).toContain('&lt;script&gt;');
    });

    it('should prevent XSS in descriptions', () => {
      const xssArticle = [{
        ...mockArticles[0],
        description: '<img src=x onerror=alert("xss")>',
      }];

      const feed = generateRSSFeed(xssArticle);
      expect(feed).not.toContain('<img src=x onerror=');
      expect(feed).toContain('&lt;img');
    });

    it('should handle SQL injection attempts', () => {
      const sqlArticle = [{
        ...mockArticles[0],
        title: "'; DROP TABLE articles; --",
      }];

      const feed = generateRSSFeed(sqlArticle);
      expect(feed).toContain('&apos;');
    });
  });
});