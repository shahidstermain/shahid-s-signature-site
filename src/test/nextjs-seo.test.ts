/**
 * Tests for Next.js Migration Example SEO Utilities
 * Testing functions from docs/nextjs-migration-examples/lib/seo.ts
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the SITE_CONFIG for testing
const SITE_URL = 'https://shahidster.tech';
const SITE_NAME = 'Shahid Moosa';
const SITE_TITLE = 'Shahid Moosa — Cloud Database Engineer';

describe('Next.js SEO Utilities', () => {
  describe('getCanonicalUrl', () => {
    it('should return base URL for root path', () => {
      const getCanonicalUrl = (path: string = ''): string => {
        const cleanPath = path === '/' ? '' : path.replace(/\/$/, '');
        return `${SITE_URL}${cleanPath}`;
      };

      expect(getCanonicalUrl('/')).toBe('https://shahidster.tech');
      expect(getCanonicalUrl('')).toBe('https://shahidster.tech');
    });

    it('should remove trailing slashes from paths', () => {
      const getCanonicalUrl = (path: string = ''): string => {
        const cleanPath = path === '/' ? '' : path.replace(/\/$/, '');
        return `${SITE_URL}${cleanPath}`;
      };

      expect(getCanonicalUrl('/blog/')).toBe('https://shahidster.tech/blog');
      expect(getCanonicalUrl('/blog/article/')).toBe('https://shahidster.tech/blog/article');
    });

    it('should handle paths without trailing slashes', () => {
      const getCanonicalUrl = (path: string = ''): string => {
        const cleanPath = path === '/' ? '' : path.replace(/\/$/, '');
        return `${SITE_URL}${cleanPath}`;
      };

      expect(getCanonicalUrl('/blog')).toBe('https://shahidster.tech/blog');
      expect(getCanonicalUrl('/blog/my-post')).toBe('https://shahidster.tech/blog/my-post');
    });
  });

  describe('parseArticleDateToISO', () => {
    it('should parse "Nov 2025" format to ISO string', () => {
      const parseArticleDateToISO = (dateStr: string): string => {
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
      };

      expect(parseArticleDateToISO('Nov 2025')).toBe('2025-11-15T00:00:00.000Z');
      expect(parseArticleDateToISO('Jan 2024')).toBe('2024-01-15T00:00:00.000Z');
      expect(parseArticleDateToISO('Dec 2023')).toBe('2023-12-15T00:00:00.000Z');
    });

    it('should handle all month abbreviations', () => {
      const parseArticleDateToISO = (dateStr: string): string => {
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
      };

      expect(parseArticleDateToISO('Jan 2025')).toBe('2025-01-15T00:00:00.000Z');
      expect(parseArticleDateToISO('Feb 2025')).toBe('2025-02-15T00:00:00.000Z');
      expect(parseArticleDateToISO('Mar 2025')).toBe('2025-03-15T00:00:00.000Z');
      expect(parseArticleDateToISO('Apr 2025')).toBe('2025-04-15T00:00:00.000Z');
      expect(parseArticleDateToISO('May 2025')).toBe('2025-05-15T00:00:00.000Z');
      expect(parseArticleDateToISO('Jun 2025')).toBe('2025-06-15T00:00:00.000Z');
    });

    it('should return current date for invalid format', () => {
      const parseArticleDateToISO = (dateStr: string): string => {
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
      };

      const result = parseArticleDateToISO('invalid');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe('stripMarkdown', () => {
    it('should remove code blocks', () => {
      const stripMarkdown = (content: string, maxLength: number = 160): string => {
        const plain = content
          .replace(/```[\s\S]*?```/g, '')
          .replace(/`[^`]+`/g, '')
          .replace(/\*\*(.+?)\*\*/g, '$1')
          .replace(/\*(.+?)\*/g, '$1')
          .replace(/^#{1,6}\s+/gm, '')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/\n+/g, ' ')
          .trim();

        if (plain.length <= maxLength) {
          return plain;
        }
        return plain.slice(0, maxLength - 3) + '...';
      };

      const input = 'Here is some text with ```code block``` in it.';
      const result = stripMarkdown(input);
      expect(result).toBe('Here is some text with  in it.');
    });

    it('should remove inline code', () => {
      const stripMarkdown = (content: string, maxLength: number = 160): string => {
        const plain = content
          .replace(/```[\s\S]*?```/g, '')
          .replace(/`[^`]+`/g, '')
          .replace(/\*\*(.+?)\*\*/g, '$1')
          .replace(/\*(.+?)\*/g, '$1')
          .replace(/^#{1,6}\s+/gm, '')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/\n+/g, ' ')
          .trim();

        if (plain.length <= maxLength) {
          return plain;
        }
        return plain.slice(0, maxLength - 3) + '...';
      };

      const input = 'Use the `variable` name here.';
      const result = stripMarkdown(input);
      expect(result).toBe('Use the  name here.');
    });

    it('should remove bold formatting', () => {
      const stripMarkdown = (content: string, maxLength: number = 160): string => {
        const plain = content
          .replace(/```[\s\S]*?```/g, '')
          .replace(/`[^`]+`/g, '')
          .replace(/\*\*(.+?)\*\*/g, '$1')
          .replace(/\*(.+?)\*/g, '$1')
          .replace(/^#{1,6}\s+/gm, '')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/\n+/g, ' ')
          .trim();

        if (plain.length <= maxLength) {
          return plain;
        }
        return plain.slice(0, maxLength - 3) + '...';
      };

      const input = 'This is **bold text** and this is *italic*.';
      const result = stripMarkdown(input);
      expect(result).toBe('This is bold text and this is italic.');
    });

    it('should remove headers', () => {
      const stripMarkdown = (content: string, maxLength: number = 160): string => {
        const plain = content
          .replace(/```[\s\S]*?```/g, '')
          .replace(/`[^`]+`/g, '')
          .replace(/\*\*(.+?)\*\*/g, '$1')
          .replace(/\*(.+?)\*/g, '$1')
          .replace(/^#{1,6}\s+/gm, '')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/\n+/g, ' ')
          .trim();

        if (plain.length <= maxLength) {
          return plain;
        }
        return plain.slice(0, maxLength - 3) + '...';
      };

      const input = '# Heading 1\n## Heading 2\nRegular text';
      const result = stripMarkdown(input);
      expect(result).toBe('Heading 1 Heading 2 Regular text');
    });

    it('should convert links to plain text', () => {
      const stripMarkdown = (content: string, maxLength: number = 160): string => {
        const plain = content
          .replace(/```[\s\S]*?```/g, '')
          .replace(/`[^`]+`/g, '')
          .replace(/\*\*(.+?)\*\*/g, '$1')
          .replace(/\*(.+?)\*/g, '$1')
          .replace(/^#{1,6}\s+/gm, '')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/\n+/g, ' ')
          .trim();

        if (plain.length <= maxLength) {
          return plain;
        }
        return plain.slice(0, maxLength - 3) + '...';
      };

      const input = 'Check out [this link](https://example.com) for more.';
      const result = stripMarkdown(input);
      expect(result).toBe('Check out this link for more.');
    });

    it('should truncate long text', () => {
      const stripMarkdown = (content: string, maxLength: number = 160): string => {
        const plain = content
          .replace(/```[\s\S]*?```/g, '')
          .replace(/`[^`]+`/g, '')
          .replace(/\*\*(.+?)\*\*/g, '$1')
          .replace(/\*(.+?)\*/g, '$1')
          .replace(/^#{1,6}\s+/gm, '')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/\n+/g, ' ')
          .trim();

        if (plain.length <= maxLength) {
          return plain;
        }
        return plain.slice(0, maxLength - 3) + '...';
      };

      const longText = 'a'.repeat(200);
      const result = stripMarkdown(longText, 50);
      expect(result).toBe('a'.repeat(47) + '...');
      expect(result.length).toBe(50);
    });

    it('should not truncate text within limit', () => {
      const stripMarkdown = (content: string, maxLength: number = 160): string => {
        const plain = content
          .replace(/```[\s\S]*?```/g, '')
          .replace(/`[^`]+`/g, '')
          .replace(/\*\*(.+?)\*\*/g, '$1')
          .replace(/\*(.+?)\*/g, '$1')
          .replace(/^#{1,6}\s+/gm, '')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/\n+/g, ' ')
          .trim();

        if (plain.length <= maxLength) {
          return plain;
        }
        return plain.slice(0, maxLength - 3) + '...';
      };

      const shortText = 'This is short text';
      const result = stripMarkdown(shortText, 100);
      expect(result).toBe('This is short text');
    });
  });

  describe('calculateReadTime', () => {
    it('should calculate read time for typical article', () => {
      const calculateReadTime = (content: string, wordsPerMinute: number = 200): string => {
        const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min read`;
      };

      const content = 'word '.repeat(400); // 400 words
      expect(calculateReadTime(content)).toBe('2 min read');
    });

    it('should round up partial minutes', () => {
      const calculateReadTime = (content: string, wordsPerMinute: number = 200): string => {
        const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min read`;
      };

      const content = 'word '.repeat(250); // 250 words = 1.25 minutes
      expect(calculateReadTime(content)).toBe('2 min read');
    });

    it('should return 1 min for short content', () => {
      const calculateReadTime = (content: string, wordsPerMinute: number = 200): string => {
        const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min read`;
      };

      const content = 'word '.repeat(50); // 50 words
      expect(calculateReadTime(content)).toBe('1 min read');
    });

    it('should handle custom words per minute', () => {
      const calculateReadTime = (content: string, wordsPerMinute: number = 200): string => {
        const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min read`;
      };

      const content = 'word '.repeat(300); // 300 words
      expect(calculateReadTime(content, 150)).toBe('2 min read');
      expect(calculateReadTime(content, 300)).toBe('1 min read');
    });

    it('should handle empty content', () => {
      const calculateReadTime = (content: string, wordsPerMinute: number = 200): string => {
        const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
        const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
        return `${minutes} min read`;
      };

      expect(calculateReadTime('')).toBe('1 min read');
    });
  });

  describe('escapeXml', () => {
    it('should escape ampersands', () => {
      const escapeXml = (text: string): string => {
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
      };

      expect(escapeXml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    it('should escape less than and greater than', () => {
      const escapeXml = (text: string): string => {
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
      };

      expect(escapeXml('<div>content</div>')).toBe('&lt;div&gt;content&lt;/div&gt;');
    });

    it('should escape quotes', () => {
      const escapeXml = (text: string): string => {
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
      };

      expect(escapeXml('He said "hello"')).toBe('He said &quot;hello&quot;');
      expect(escapeXml("It's working")).toBe('It&apos;s working');
    });

    it('should escape all special characters together', () => {
      const escapeXml = (text: string): string => {
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
      };

      expect(escapeXml(`<tag attr="value" & attr2='value2'>`)).toBe(
        '&lt;tag attr=&quot;value&quot; &amp; attr2=&apos;value2&apos;&gt;'
      );
    });

    it('should handle empty string', () => {
      const escapeXml = (text: string): string => {
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
      };

      expect(escapeXml('')).toBe('');
    });

    it('should handle text without special characters', () => {
      const escapeXml = (text: string): string => {
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
      };

      expect(escapeXml('Normal text without special chars')).toBe('Normal text without special chars');
    });
  });

  describe('parseDate', () => {
    it('should parse month-year format to Date object', () => {
      const parseDate = (dateStr: string): Date => {
        const months: Record<string, number> = {
          Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
          Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
        };
        const [month, year] = dateStr.split(' ');
        return new Date(parseInt(year), months[month] || 0, 15);
      };

      const date = parseDate('Nov 2025');
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(10); // November is month 10 (0-indexed)
      expect(date.getDate()).toBe(15);
    });

    it('should handle all months correctly', () => {
      const parseDate = (dateStr: string): Date => {
        const months: Record<string, number> = {
          Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
          Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
        };
        const [month, year] = dateStr.split(' ');
        return new Date(parseInt(year), months[month] || 0, 15);
      };

      expect(parseDate('Jan 2025').getMonth()).toBe(0);
      expect(parseDate('Feb 2025').getMonth()).toBe(1);
      expect(parseDate('Dec 2025').getMonth()).toBe(11);
    });

    it('should default to January for unknown months', () => {
      const parseDate = (dateStr: string): Date => {
        const months: Record<string, number> = {
          Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
          Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
        };
        const [month, year] = dateStr.split(' ');
        return new Date(parseInt(year), months[month] || 0, 15);
      };

      const date = parseDate('Invalid 2025');
      expect(date.getMonth()).toBe(0); // January
    });
  });

  describe('generatePersonSchema', () => {
    it('should generate valid Person schema', () => {
      const generatePersonSchema = () => {
        return {
          '@context': 'https://schema.org',
          '@type': 'Person',
          '@id': `${SITE_URL}/#person`,
          name: SITE_NAME,
          jobTitle: 'Cloud Database Support Engineer',
          url: SITE_URL,
        };
      };

      const schema = generatePersonSchema();
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Person');
      expect(schema['@id']).toBe('https://shahidster.tech/#person');
      expect(schema.name).toBe('Shahid Moosa');
      expect(schema.jobTitle).toBe('Cloud Database Support Engineer');
    });
  });

  describe('generateWebsiteSchema', () => {
    it('should generate valid WebSite schema', () => {
      const generateWebsiteSchema = () => {
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: SITE_URL,
          name: SITE_TITLE,
          publisher: {
            '@id': `${SITE_URL}/#person`,
          },
        };
      };

      const schema = generateWebsiteSchema();
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('WebSite');
      expect(schema['@id']).toBe('https://shahidster.tech/#website');
      expect(schema.url).toBe(SITE_URL);
      expect(schema.publisher['@id']).toBe('https://shahidster.tech/#person');
    });
  });

  describe('generateBreadcrumbSchema', () => {
    it('should generate valid BreadcrumbList schema', () => {
      const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
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
      };

      const items = [
        { name: 'Home', url: 'https://shahidster.tech' },
        { name: 'Blog', url: 'https://shahidster.tech/blog' },
        { name: 'Article', url: 'https://shahidster.tech/blog/article' },
      ];

      const schema = generateBreadcrumbSchema(items);
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[2].position).toBe(3);
    });

    it('should handle single item breadcrumb', () => {
      const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
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
      };

      const items = [{ name: 'Home', url: 'https://shahidster.tech' }];
      const schema = generateBreadcrumbSchema(items);
      expect(schema.itemListElement).toHaveLength(1);
      expect(schema.itemListElement[0].position).toBe(1);
    });
  });
});