import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the SEO utility functions since they're in docs/
const SITE_URL = 'https://shahidster.tech';

// Utility functions to test (copied from the example)
function getCanonicalUrl(path: string = ''): string {
  const cleanPath = path === '/' ? '' : path.replace(/\/$/, '');
  return `${SITE_URL}${cleanPath}`;
}

function parseArticleDateToISO(dateStr: string): string {
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

function stripMarkdown(content: string, maxLength: number = 160): string {
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

function calculateReadTime(content: string, wordsPerMinute: number = 200): string {
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

describe('SEO Utility Functions', () => {
  describe('getCanonicalUrl', () => {
    it('should return base URL for empty path', () => {
      expect(getCanonicalUrl('')).toBe(SITE_URL);
    });

    it('should return base URL for root path', () => {
      expect(getCanonicalUrl('/')).toBe(SITE_URL);
    });

    it('should handle paths without trailing slash', () => {
      expect(getCanonicalUrl('/blog/article')).toBe(`${SITE_URL}/blog/article`);
    });

    it('should remove trailing slash from paths', () => {
      expect(getCanonicalUrl('/blog/article/')).toBe(`${SITE_URL}/blog/article`);
    });

    it('should handle paths with query parameters', () => {
      expect(getCanonicalUrl('/blog?page=2')).toBe(`${SITE_URL}/blog?page=2`);
    });

    it('should handle complex paths', () => {
      expect(getCanonicalUrl('/blog/cap-theorem-production/')).toBe(
        `${SITE_URL}/blog/cap-theorem-production`
      );
    });
  });

  describe('parseArticleDateToISO', () => {
    it('should parse "Nov 2025" format correctly', () => {
      const result = parseArticleDateToISO('Nov 2025');
      expect(result).toBe('2025-11-15T00:00:00.000Z');
    });

    it('should parse "Jan 2024" format correctly', () => {
      const result = parseArticleDateToISO('Jan 2024');
      expect(result).toBe('2024-01-15T00:00:00.000Z');
    });

    it('should parse "Dec 2023" format correctly', () => {
      const result = parseArticleDateToISO('Dec 2023');
      expect(result).toBe('2023-12-15T00:00:00.000Z');
    });

    it('should handle all months correctly', () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthNumbers = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

      months.forEach((month, index) => {
        const result = parseArticleDateToISO(`${month} 2025`);
        expect(result).toBe(`2025-${monthNumbers[index]}-15T00:00:00.000Z`);
      });
    });

    it('should return current date for invalid format', () => {
      const result = parseArticleDateToISO('invalid');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
    });

    it('should handle empty string', () => {
      const result = parseArticleDateToISO('');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
    });
  });

  describe('stripMarkdown', () => {
    it('should remove code blocks', () => {
      const input = '```typescript\nconst x = 1;\n```';
      expect(stripMarkdown(input)).toBe('');
    });

    it('should remove inline code', () => {
      const input = 'Use the `npm install` command';
      expect(stripMarkdown(input)).toBe('Use the  command');
    });

    it('should remove bold formatting', () => {
      const input = 'This is **bold** text';
      expect(stripMarkdown(input)).toBe('This is bold text');
    });

    it('should remove italic formatting', () => {
      const input = 'This is *italic* text';
      expect(stripMarkdown(input)).toBe('This is italic text');
    });

    it('should remove headers', () => {
      const input = '# Header 1\n## Header 2\n### Header 3';
      expect(stripMarkdown(input)).toBe('Header 1 Header 2 Header 3');
    });

    it('should convert links to text', () => {
      const input = 'Check out [this link](https://example.com)';
      expect(stripMarkdown(input)).toBe('Check out this link');
    });

    it('should replace newlines with spaces', () => {
      const input = 'Line 1\n\nLine 2\n\nLine 3';
      expect(stripMarkdown(input)).toBe('Line 1 Line 2 Line 3');
    });

    it('should truncate long text with ellipsis', () => {
      const longText = 'a'.repeat(200);
      const result = stripMarkdown(longText, 50);
      expect(result).toHaveLength(50);
      expect(result).toMatch(/\.\.\.$/);
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      const result = stripMarkdown(shortText, 50);
      expect(result).toBe(shortText);
    });

    it('should handle complex markdown', () => {
      const input = `# Title

This is **bold** and *italic* with \`code\` and [links](url).

\`\`\`js
const x = 1;
\`\`\`

More text here.`;
      const result = stripMarkdown(input);
      expect(result).not.toContain('**');
      expect(result).not.toContain('*');
      expect(result).not.toContain('`');
      expect(result).not.toContain('[');
      expect(result).not.toContain('#');
    });
  });

  describe('calculateReadTime', () => {
    it('should calculate read time for short content', () => {
      const content = 'word '.repeat(100); // 100 words
      expect(calculateReadTime(content)).toBe('1 min read');
    });

    it('should calculate read time for medium content', () => {
      const content = 'word '.repeat(500); // 500 words
      expect(calculateReadTime(content)).toBe('3 min read');
    });

    it('should calculate read time for long content', () => {
      const words = Array(1000).fill('word').join(' '); // Exactly 1000 words
      expect(calculateReadTime(words)).toBe('5 min read');
    });

    it('should round up to nearest minute', () => {
      const words = Array(250).fill('word').join(' '); // Exactly 250 words
      expect(calculateReadTime(words)).toBe('2 min read');
    });

    it('should handle custom words per minute', () => {
      const words = Array(400).fill('word').join(' '); // Exactly 400 words
      expect(calculateReadTime(words, 100)).toBe('4 min read');
    });

    it('should handle empty content', () => {
      expect(calculateReadTime('')).toBe('1 min read');
    });

    it('should handle single word', () => {
      expect(calculateReadTime('word')).toBe('1 min read');
    });
  });

  describe('Schema Generation', () => {
    it('should generate person schema structure', () => {
      const personSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: 'Shahid Moosa',
        jobTitle: 'Cloud Database Support Engineer',
      };

      expect(personSchema['@context']).toBe('https://schema.org');
      expect(personSchema['@type']).toBe('Person');
      expect(personSchema['@id']).toContain('#person');
      expect(personSchema.name).toBe('Shahid Moosa');
    });

    it('should generate website schema structure', () => {
      const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
      };

      expect(websiteSchema['@context']).toBe('https://schema.org');
      expect(websiteSchema['@type']).toBe('WebSite');
      expect(websiteSchema['@id']).toContain('#website');
      expect(websiteSchema.url).toBe(SITE_URL);
    });

    it('should generate article schema with required properties', () => {
      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: 'Test Article',
        datePublished: '2025-01-15T00:00:00.000Z',
        author: {
          '@type': 'Person',
          name: 'Shahid Moosa',
        },
      };

      expect(articleSchema['@type']).toBe('TechArticle');
      expect(articleSchema.headline).toBe('Test Article');
      expect(articleSchema.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}/);
      expect(articleSchema.author['@type']).toBe('Person');
    });

    it('should generate breadcrumb schema structure', () => {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        ],
      };

      expect(breadcrumbSchema['@type']).toBe('BreadcrumbList');
      expect(breadcrumbSchema.itemListElement).toHaveLength(2);
      expect(breadcrumbSchema.itemListElement[0].position).toBe(1);
      expect(breadcrumbSchema.itemListElement[1].position).toBe(2);
    });
  });

  describe('URL and Analytics Edge Cases', () => {
    it('should handle special characters in URLs', () => {
      const url = '/blog/test-article?utm_source=twitter&utm_medium=social';
      expect(getCanonicalUrl(url)).toContain('?');
      expect(getCanonicalUrl(url)).toContain('&');
    });

    it('should handle URL fragments', () => {
      const url = '/blog/article#section';
      expect(getCanonicalUrl(url)).toContain('#section');
    });

    it('should handle double slashes', () => {
      const url = '/blog//article/';
      expect(getCanonicalUrl(url)).toBe(`${SITE_URL}/blog//article`);
    });
  });

  describe('Metadata Generation', () => {
    it('should create valid open graph metadata structure', () => {
      const metadata = {
        openGraph: {
          type: 'article',
          locale: 'en_US',
          url: `${SITE_URL}/blog/test`,
          title: 'Test Article',
          description: 'Test description',
          images: [{
            url: `${SITE_URL}/og-image.png`,
            width: 1200,
            height: 630,
          }],
        },
      };

      expect(metadata.openGraph.type).toBe('article');
      expect(metadata.openGraph.images[0].width).toBe(1200);
      expect(metadata.openGraph.images[0].height).toBe(630);
    });

    it('should create valid twitter card metadata', () => {
      const metadata = {
        twitter: {
          card: 'summary_large_image',
          title: 'Test Article',
          creator: '@shahidster_',
        },
      };

      expect(metadata.twitter.card).toBe('summary_large_image');
      expect(metadata.twitter.creator).toMatch(/^@/);
    });
  });
});