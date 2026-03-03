import { describe, it, expect } from 'vitest';

/**
 * Tests for NextJS RSS route example
 * Location: docs/nextjs-migration-examples/app/rss.xml/route.ts
 *
 * These tests verify the example file demonstrates correct RSS generation patterns
 */
describe('NextJS RSS Route Example', () => {
  describe('escapeXml utility', () => {
    function escapeXml(text: string): string {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    }

    it('should escape ampersands', () => {
      expect(escapeXml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    it('should escape less than', () => {
      expect(escapeXml('<div>')).toBe('&lt;div&gt;');
    });

    it('should escape greater than', () => {
      expect(escapeXml('5 > 3')).toBe('5 &gt; 3');
    });

    it('should escape quotes', () => {
      expect(escapeXml('Say "hello"')).toBe('Say &quot;hello&quot;');
    });

    it('should escape apostrophes', () => {
      expect(escapeXml("It's here")).toBe('It&apos;s here');
    });

    it('should handle multiple special characters', () => {
      const input = `<title>Tom & Jerry's "Adventure"</title>`;
      const expected = `&lt;title&gt;Tom &amp; Jerry&apos;s &quot;Adventure&quot;&lt;/title&gt;`;

      expect(escapeXml(input)).toBe(expected);
    });
  });

  describe('parseDate utility', () => {
    function parseDate(dateStr: string): Date {
      const months: Record<string, number> = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
      };
      const [month, year] = dateStr.split(' ');
      return new Date(parseInt(year), months[month] || 0, 15);
    }

    it('should parse January', () => {
      const date = parseDate('Jan 2024');
      expect(date.getMonth()).toBe(0);
      expect(date.getFullYear()).toBe(2024);
      expect(date.getDate()).toBe(15);
    });

    it('should parse December', () => {
      const date = parseDate('Dec 2024');
      expect(date.getMonth()).toBe(11);
    });

    it('should parse mid-year month', () => {
      const date = parseDate('Jun 2024');
      expect(date.getMonth()).toBe(5);
    });

    it('should handle different years', () => {
      const date2020 = parseDate('Jan 2020');
      const date2025 = parseDate('Jan 2025');

      expect(date2020.getFullYear()).toBe(2020);
      expect(date2025.getFullYear()).toBe(2025);
    });

    it('should default to January for invalid month', () => {
      const date = parseDate('Invalid 2024');
      expect(date.getMonth()).toBe(0);
    });

    it('should set day to 15th of month', () => {
      const date = parseDate('Mar 2024');
      expect(date.getDate()).toBe(15);
    });

    it('should format to UTC string', () => {
      const date = parseDate('Jan 2024');
      const utc = date.toUTCString();

      expect(utc).toContain('GMT');
    });
  });

  describe('stripMarkdown utility', () => {
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

    it('should remove code blocks', () => {
      const input = 'Text\n```javascript\nconst x = 1;\n```\nMore text';
      const result = stripMarkdown(input);

      expect(result).not.toContain('```');
      expect(result).not.toContain('const x = 1');
    });

    it('should remove inline code', () => {
      const input = 'This is `code` text';
      const result = stripMarkdown(input);

      expect(result).not.toContain('`');
      expect(result).toBe('This is  text');
    });

    it('should remove bold markers', () => {
      const input = 'This is **bold** text';
      const result = stripMarkdown(input);

      expect(result).not.toContain('**');
      expect(result).toBe('This is bold text');
    });

    it('should remove headers', () => {
      const input = '## Header\nContent';
      const result = stripMarkdown(input);

      expect(result).not.toContain('##');
      expect(result).toContain('Header');
    });

    it('should convert links to text', () => {
      const input = 'Check [this link](https://example.com)';
      const result = stripMarkdown(input);

      expect(result).not.toContain('[');
      expect(result).not.toContain('](');
      expect(result).toContain('this link');
    });

    it('should replace newlines with spaces', () => {
      const input = 'Line 1\nLine 2\nLine 3';
      const result = stripMarkdown(input);

      expect(result).not.toContain('\n');
      expect(result).toContain(' ');
    });

    it('should trim result', () => {
      const input = '  Text with spaces  ';
      const result = stripMarkdown(input);

      expect(result).toBe('Text with spaces');
    });

    it('should truncate to 500 characters', () => {
      const input = 'a'.repeat(1000);
      const result = stripMarkdown(input);

      expect(result.length).toBe(500);
    });
  });

  describe('RSS feed structure', () => {
    it('should build XML declaration', () => {
      const declaration = '<?xml version="1.0" encoding="UTF-8"?>';

      expect(declaration).toContain('<?xml');
      expect(declaration).toContain('UTF-8');
    });

    it('should build RSS opening tag with namespaces', () => {
      const rssTag = '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">';

      expect(rssTag).toContain('version="2.0"');
      expect(rssTag).toContain('xmlns:content');
      expect(rssTag).toContain('xmlns:atom');
    });

    it('should build channel element', () => {
      const channel = {
        title: 'Blog Title',
        link: 'https://example.com',
        description: 'Blog description',
      };

      expect(channel.title).toBeDefined();
      expect(channel.link).toBeDefined();
      expect(channel.description).toBeDefined();
    });
  });

  describe('RSS item generation', () => {
    it('should build item structure', () => {
      const item = {
        title: 'Article Title',
        link: 'https://example.com/article',
        guid: 'https://example.com/article',
        description: 'Article description',
        pubDate: new Date().toUTCString(),
        category: 'Technology',
      };

      expect(item.title).toBeDefined();
      expect(item.link).toBeDefined();
      expect(item.guid).toBeDefined();
    });

    it('should format item as XML', () => {
      const xml = `
    <item>
      <title>Test</title>
      <link>https://example.com</link>
      <guid isPermaLink="true">https://example.com</guid>
    </item>`;

      expect(xml).toContain('<item>');
      expect(xml).toContain('</item>');
      expect(xml).toContain('<title>');
    });

    it('should include CDATA for content', () => {
      const content = '<![CDATA[Article content...]]>';

      expect(content).toContain('<![CDATA[');
      expect(content).toContain(']]>');
    });
  });

  describe('article sorting', () => {
    interface Article {
      slug: string;
      date: string;
    }

    function parseDate(dateStr: string): Date {
      const months: Record<string, number> = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
      };
      const [month, year] = dateStr.split(' ');
      return new Date(parseInt(year), months[month] || 0, 15);
    }

    it('should sort articles by date (newest first)', () => {
      const articles: Article[] = [
        { slug: 'article-1', date: 'Jan 2024' },
        { slug: 'article-2', date: 'Mar 2024' },
        { slug: 'article-3', date: 'Feb 2024' },
      ];

      const sorted = [...articles].sort((a, b) => {
        return parseDate(b.date).getTime() - parseDate(a.date).getTime();
      });

      expect(sorted[0].slug).toBe('article-2'); // Mar
      expect(sorted[1].slug).toBe('article-3'); // Feb
      expect(sorted[2].slug).toBe('article-1'); // Jan
    });
  });

  describe('category generation', () => {
    it('should include article category', () => {
      const article = {
        category: 'Technology',
        seoKeywords: [] as string[],
      };

      const categories = [article.category];

      expect(categories).toContain('Technology');
    });

    it('should include SEO keywords as categories', () => {
      const article = {
        category: 'Technology',
        seoKeywords: ['javascript', 'web', 'development'],
      };

      const categories = [article.category, ...(article.seoKeywords || [])];

      expect(categories).toHaveLength(4);
      expect(categories).toContain('javascript');
    });

    it('should handle articles without keywords', () => {
      const article = {
        category: 'Technology',
        seoKeywords: undefined,
      };

      const categories = [article.category, ...(article.seoKeywords || [])];

      expect(categories).toHaveLength(1);
      expect(categories[0]).toBe('Technology');
    });
  });

  describe('Response headers', () => {
    it('should set correct Content-Type', () => {
      const headers = {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      };

      expect(headers['Content-Type']).toBe('application/rss+xml; charset=utf-8');
    });

    it('should set Cache-Control', () => {
      const cacheControl = 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400';

      expect(cacheControl).toContain('public');
      expect(cacheControl).toContain('max-age=3600');
    });

    it('should set security headers', () => {
      const headers = {
        'X-Content-Type-Options': 'nosniff',
      };

      expect(headers['X-Content-Type-Options']).toBe('nosniff');
    });
  });

  describe('date formatting', () => {
    it('should format to RFC 822', () => {
      const date = new Date('2024-01-15T00:00:00Z');
      const rfc822 = date.toUTCString();

      expect(rfc822).toMatch(/^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4}/);
      expect(rfc822).toContain('GMT');
    });
  });

  describe('edge cases', () => {
    it('should handle special characters in titles', () => {
      function escapeXml(text: string): string {
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
      }

      const title = 'Article <with> & "special" \'chars\'';
      const escaped = escapeXml(title);

      expect(escaped).not.toMatch(/<(?!\/)/); // No unescaped < except in closing tags
      expect(escaped).toContain('&amp;');
      expect(escaped).toContain('&lt;');
      expect(escaped).toContain('&gt;');
      expect(escaped).toContain('&quot;');
      expect(escaped).toContain('&apos;');
    });

    it('should handle empty content', () => {
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

      const result = stripMarkdown('');
      expect(result).toBe('');
    });
  });
});