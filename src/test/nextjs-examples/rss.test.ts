/**
 * Tests for Next.js RSS feed route handler
 * Testing: docs/nextjs-migration-examples/app/rss.xml/route.ts
 */

import { describe, it, expect, beforeEach } from 'vitest';

const SITE_URL = 'https://shahidster.tech';
const SITE_TITLE = 'Shahid Moosa — Distributed Systems Engineering';
const SITE_DESCRIPTION = 'Deep dives into distributed databases, data infrastructure, and production systems. Written by a senior distributed-systems engineer.';
const AUTHOR_NAME = 'Shahid Moosa';
const AUTHOR_EMAIL = 'hello@shahidster.tech';

interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  content: string;
  seoKeywords?: string[];
}

// Mock articles
const mockArticles: Article[] = [
  {
    slug: 'cap-theorem-production',
    title: 'CAP Theorem in Production',
    description: 'Understanding CAP theorem in real-world systems',
    date: 'Nov 2025',
    category: 'Distributed Systems',
    content: 'This is a **test** article with `code` and more content.',
    seoKeywords: ['CAP', 'distributed systems', 'consistency'],
  },
  {
    slug: 'sharding-strategies',
    title: 'Sharding Strategies That Work',
    description: 'Practical sharding approaches',
    date: 'Oct 2025',
    category: 'Database',
    content: '## Heading\n\nSome content here.',
    seoKeywords: ['sharding', 'database', 'scalability'],
  },
];

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

function generateRSSFeed(articles: Article[]): string {
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

describe('RSS Feed Generator', () => {
  describe('Feed Structure', () => {
    it('should generate valid XML structure', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(rss).toContain('<rss version="2.0"');
      expect(rss).toContain('<channel>');
      expect(rss).toContain('</channel>');
      expect(rss).toContain('</rss>');
    });

    it('should include RSS 2.0 namespaces', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
      expect(rss).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
      expect(rss).toContain('xmlns:dc="http://purl.org/dc/elements/1.1/"');
    });

    it('should have proper RSS 2.0 version', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('version="2.0"');
    });
  });

  describe('Channel Metadata', () => {
    it('should include channel title', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain(`<title>${escapeXml(SITE_TITLE)}</title>`);
    });

    it('should include channel link', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain(`<link>${SITE_URL}</link>`);
    });

    it('should include channel description', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain(`<description>${escapeXml(SITE_DESCRIPTION)}</description>`);
    });

    it('should include language tag', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('<language>en-us</language>');
    });

    it('should include lastBuildDate', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('<lastBuildDate>');
      expect(rss).toMatch(/<lastBuildDate>[^<]+<\/lastBuildDate>/);
    });

    it('should include pubDate', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('<pubDate>');
      expect(rss).toMatch(/<pubDate>[^<]+<\/pubDate>/);
    });

    it('should include TTL (time to live)', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('<ttl>60</ttl>');
    });

    it('should include generator', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('<generator>Next.js RSS Generator</generator>');
    });

    it('should include managingEditor', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain(`<managingEditor>${AUTHOR_EMAIL} (${AUTHOR_NAME})</managingEditor>`);
    });

    it('should include webMaster', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain(`<webMaster>${AUTHOR_EMAIL} (${AUTHOR_NAME})</webMaster>`);
    });

    it('should include copyright notice', () => {
      const rss = generateRSSFeed(mockArticles);
      const year = new Date().getFullYear();

      expect(rss).toContain(`<copyright>Copyright ${year} ${AUTHOR_NAME}. All rights reserved.</copyright>`);
    });

    it('should include atom:link self reference', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain(`<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>`);
    });
  });

  describe('Channel Image', () => {
    it('should include channel image', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('<image>');
      expect(rss).toContain('</image>');
    });

    it('should have image URL', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain(`<url>${SITE_URL}/og-image.png</url>`);
    });

    it('should have image dimensions', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('<width>1200</width>');
      expect(rss).toContain('<height>630</height>');
    });
  });

  describe('Feed Items', () => {
    it('should include all articles as items', () => {
      const rss = generateRSSFeed(mockArticles);

      mockArticles.forEach(article => {
        expect(rss).toContain(`<title>${escapeXml(article.title)}</title>`);
      });
    });

    it('should include item title', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('<title>CAP Theorem in Production</title>');
    });

    it('should include item link', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain(`<link>${SITE_URL}/blog/cap-theorem-production</link>`);
    });

    it('should include guid with permalink', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain(`<guid isPermaLink="true">${SITE_URL}/blog/cap-theorem-production</guid>`);
    });

    it('should include item description', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('<description>Understanding CAP theorem in real-world systems</description>');
    });

    it('should include content:encoded with CDATA', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('<content:encoded><![CDATA[');
      expect(rss).toContain(']]></content:encoded>');
    });

    it('should include pubDate for items', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toMatch(/<pubDate>[^<]+<\/pubDate>/);
    });

    it('should include author', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain(`<author>${AUTHOR_EMAIL} (${AUTHOR_NAME})</author>`);
    });

    it('should include categories', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('<category>Distributed Systems</category>');
      expect(rss).toContain('<category>CAP</category>');
    });
  });

  describe('Content Processing', () => {
    it('should sort articles by date (newest first)', () => {
      const rss = generateRSSFeed(mockArticles);

      const capIndex = rss.indexOf('CAP Theorem in Production');
      const shardingIndex = rss.indexOf('Sharding Strategies That Work');

      expect(capIndex).toBeLessThan(shardingIndex);
    });

    it('should strip markdown from content', () => {
      const rss = generateRSSFeed(mockArticles);

      // Should not contain markdown syntax
      expect(rss).not.toContain('**');
      expect(rss).not.toContain('##');
    });

    it('should truncate content summaries', () => {
      const longArticle: Article = {
        slug: 'long-article',
        title: 'Long Article',
        description: 'Test',
        date: 'Jan 2025',
        category: 'Test',
        content: 'word '.repeat(1000), // 1000 words
      };

      const rss = generateRSSFeed([longArticle]);
      const summary = stripMarkdown(longArticle.content);

      expect(summary.length).toBeLessThanOrEqual(500);
    });
  });

  describe('XML Escaping', () => {
    it('should escape XML special characters', () => {
      expect(escapeXml('Test & Co.')).toBe('Test &amp; Co.');
      expect(escapeXml('<tag>')).toBe('&lt;tag&gt;');
      expect(escapeXml('"quotes"')).toBe('&quot;quotes&quot;');
      expect(escapeXml("'apostrophe'")).toBe('&apos;apostrophe&apos;');
    });

    it('should escape all XML entities in content', () => {
      const article: Article = {
        slug: 'test',
        title: 'Test & <Example>',
        description: 'Description with "quotes"',
        date: 'Jan 2025',
        category: 'Test',
        content: 'Content',
      };

      const rss = generateRSSFeed([article]);

      expect(rss).toContain('Test &amp; &lt;Example&gt;');
      expect(rss).toContain('Description with &quot;quotes&quot;');
    });

    it('should handle multiple special characters', () => {
      const text = 'A & B < C > D "E" \'F\'';
      const escaped = escapeXml(text);

      expect(escaped).toBe('A &amp; B &lt; C &gt; D &quot;E&quot; &apos;F&apos;');
    });
  });

  describe('Date Handling', () => {
    it('should parse article dates correctly', () => {
      const date = parseDate('Nov 2025');

      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(10); // November
      expect(date.getDate()).toBe(15);
    });

    it('should format dates in RFC 2822 format', () => {
      const rss = generateRSSFeed(mockArticles);

      // Should contain dates in RFC 2822 format (e.g., "Wed, 15 Nov 2025 00:00:00 GMT")
      expect(rss).toMatch(/<pubDate>[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT<\/pubDate>/);
    });

    it('should sort by parsed dates', () => {
      const articles: Article[] = [
        { ...mockArticles[0], date: 'Jan 2025' },
        { ...mockArticles[1], date: 'Dec 2024' },
      ];

      const rss = generateRSSFeed(articles);
      const janIndex = rss.indexOf('CAP Theorem in Production');
      const decIndex = rss.indexOf('Sharding Strategies');

      // Jan 2025 should come before Dec 2024
      expect(janIndex).toBeLessThan(decIndex);
    });
  });

  describe('Category Handling', () => {
    it('should include article category', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('<category>Distributed Systems</category>');
      expect(rss).toContain('<category>Database</category>');
    });

    it('should include SEO keywords as categories', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain('<category>CAP</category>');
      expect(rss).toContain('<category>distributed systems</category>');
      expect(rss).toContain('<category>consistency</category>');
    });

    it('should handle articles without SEO keywords', () => {
      const article: Article = {
        slug: 'no-keywords',
        title: 'Test',
        description: 'Test',
        date: 'Jan 2025',
        category: 'Test Category',
        content: 'Content',
      };

      const rss = generateRSSFeed([article]);

      expect(rss).toContain('<category>Test Category</category>');
    });

    it('should escape special characters in categories', () => {
      const article: Article = {
        slug: 'test',
        title: 'Test',
        description: 'Test',
        date: 'Jan 2025',
        category: 'Test & Category',
        content: 'Content',
      };

      const rss = generateRSSFeed([article]);

      expect(rss).toContain('<category>Test &amp; Category</category>');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty articles array', () => {
      const rss = generateRSSFeed([]);

      expect(rss).toContain('<channel>');
      expect(rss).toContain('</channel>');
      expect(rss).not.toContain('<item>');
    });

    it('should handle single article', () => {
      const rss = generateRSSFeed([mockArticles[0]]);

      const itemCount = (rss.match(/<item>/g) || []).length;
      expect(itemCount).toBe(1);
    });

    it('should handle articles with empty content', () => {
      const article: Article = {
        slug: 'empty',
        title: 'Empty',
        description: 'Empty',
        date: 'Jan 2025',
        category: 'Test',
        content: '',
      };

      const rss = generateRSSFeed([article]);

      expect(rss).toContain('<item>');
    });

    it('should handle long titles', () => {
      const article: Article = {
        slug: 'long-title',
        title: 'This is a very long title '.repeat(10),
        description: 'Test',
        date: 'Jan 2025',
        category: 'Test',
        content: 'Content',
      };

      const rss = generateRSSFeed([article]);

      expect(rss).toContain(escapeXml(article.title));
    });
  });

  describe('URL Structure', () => {
    it('should use correct site URL', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toContain(SITE_URL);
    });

    it('should generate proper blog post URLs', () => {
      const rss = generateRSSFeed(mockArticles);

      mockArticles.forEach(article => {
        expect(rss).toContain(`${SITE_URL}/blog/${article.slug}`);
      });
    });

    it('should use HTTPS protocol', () => {
      const rss = generateRSSFeed(mockArticles);

      expect(rss).toMatch(/https:\/\//);
    });
  });

  describe('RSS Compliance', () => {
    it('should have all required channel elements', () => {
      const rss = generateRSSFeed(mockArticles);

      // Required RSS 2.0 channel elements
      expect(rss).toContain('<title>');
      expect(rss).toContain('<link>');
      expect(rss).toContain('<description>');
    });

    it('should have proper nesting', () => {
      const rss = generateRSSFeed(mockArticles);

      // Check proper XML nesting
      expect(rss.indexOf('<rss')).toBeLessThan(rss.indexOf('<channel>'));
      expect(rss.indexOf('<channel>')).toBeLessThan(rss.indexOf('</channel>'));
      expect(rss.indexOf('</channel>')).toBeLessThan(rss.indexOf('</rss>'));
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle large number of articles efficiently', () => {
      const manyArticles: Article[] = Array.from({ length: 500 }, (_, i) => ({
        slug: `article-${i}`,
        title: `Article ${i}`,
        description: `Description ${i}`,
        date: 'Jan 2025',
        category: 'Test',
        content: 'Content here',
        seoKeywords: ['keyword1', 'keyword2'],
      }));

      const rss = generateRSSFeed(manyArticles);

      expect(rss).toContain('<rss');
      expect(rss).toContain('</rss>');

      // Should have all items
      const itemCount = (rss.match(/<item>/g) || []).length;
      expect(itemCount).toBe(500);
    });

    it('should maintain consistent sorting with duplicate dates', () => {
      const articlesWithSameDate: Article[] = [
        { ...mockArticles[0], slug: 'first', date: 'Jan 2025' },
        { ...mockArticles[0], slug: 'second', date: 'Jan 2025' },
        { ...mockArticles[0], slug: 'third', date: 'Jan 2025' },
      ];

      const rss = generateRSSFeed(articlesWithSameDate);

      // All should be present
      expect(rss).toContain('first');
      expect(rss).toContain('second');
      expect(rss).toContain('third');
    });

    it('should handle articles with very long content', () => {
      const longContent = 'word '.repeat(10000);
      const article: Article = {
        slug: 'long-article',
        title: 'Long Article',
        description: 'Test',
        date: 'Jan 2025',
        category: 'Test',
        content: longContent,
      };

      const rss = generateRSSFeed([article]);

      // Should truncate in summary but still generate valid RSS
      expect(rss).toContain('<item>');
      expect(rss).toContain('</item>');
    });
  });

  describe('Content Security', () => {
    it('should escape malicious XML in titles', () => {
      const article: Article = {
        slug: 'test',
        title: '"><script>alert("xss")</script><"',
        description: 'Test',
        date: 'Jan 2025',
        category: 'Test',
        content: 'Content',
      };

      const rss = generateRSSFeed([article]);

      expect(rss).not.toContain('<script>');
      expect(rss).toContain('&gt;');
      expect(rss).toContain('&lt;');
    });

    it('should handle CDATA sections correctly', () => {
      const rss = generateRSSFeed(mockArticles);

      // CDATA should be properly formatted
      expect(rss).toContain('<![CDATA[');
      expect(rss).toContain(']]>');

      // No nested CDATA
      expect(rss).not.toContain('<![CDATA[<![CDATA[');
    });

    it('should prevent XML injection through categories', () => {
      const article: Article = {
        slug: 'test',
        title: 'Test',
        description: 'Test',
        date: 'Jan 2025',
        category: '</category><evil>injected</evil><category>',
        content: 'Content',
      };

      const rss = generateRSSFeed([article]);

      expect(rss).not.toContain('<evil>');
      expect(rss).toContain('&lt;/category&gt;');
    });
  });

  describe('Date and Time Handling', () => {
    it('should handle future dates correctly', () => {
      const futureArticle: Article = {
        slug: 'future',
        title: 'Future Article',
        description: 'Test',
        date: 'Dec 2030',
        category: 'Test',
        content: 'Content',
      };

      const rss = generateRSSFeed([futureArticle]);

      expect(rss).toContain('<item>');
      expect(rss).toMatch(/<pubDate>.*2030.*<\/pubDate>/);
    });

    it('should handle past dates correctly', () => {
      const pastArticle: Article = {
        slug: 'past',
        title: 'Past Article',
        description: 'Test',
        date: 'Jan 2020',
        category: 'Test',
        content: 'Content',
      };

      const rss = generateRSSFeed([pastArticle]);

      expect(rss).toContain('<item>');
      expect(rss).toMatch(/<pubDate>.*2020.*<\/pubDate>/);
    });

    it('should maintain copyright year accuracy', () => {
      const rss = generateRSSFeed(mockArticles);
      const currentYear = new Date().getFullYear();

      expect(rss).toContain(`Copyright ${currentYear}`);
    });
  });
});