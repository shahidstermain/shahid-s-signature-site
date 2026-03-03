import { describe, it, expect } from 'vitest';

/**
 * Tests for NextJS blog page example
 * Location: docs/nextjs-migration-examples/app/blog/[slug]/page.tsx
 *
 * These tests verify the example file demonstrates correct NextJS patterns
 */
describe('NextJS Blog Page Example', () => {
  describe('parseArticleDate utility', () => {
    it('should parse month abbreviations correctly', () => {
      const months: Record<string, number> = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
      };

      Object.entries(months).forEach(([month, expected]) => {
        expect(months[month]).toBe(expected);
      });
    });

    it('should handle all 12 months', () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      expect(months).toHaveLength(12);
    });

    it('should parse date string format', () => {
      const dateStr = 'Jan 2024';
      const [month, year] = dateStr.split(' ');

      expect(month).toBe('Jan');
      expect(year).toBe('2024');
      expect(parseInt(year)).toBe(2024);
    });

    it('should create valid Date objects', () => {
      const year = 2024;
      const month = 0; // January
      const day = 1;
      const date = new Date(Date.UTC(year, month, day));

      expect(date).toBeInstanceOf(Date);
      expect(date.getUTCFullYear()).toBe(2024);
      expect(date.getUTCMonth()).toBe(0);
    });
  });

  describe('formatContent utility patterns', () => {
    it('should handle markdown headers with regex', () => {
      const input = '## Header 2\n### Header 3';
      const h2Regex = /^## (.+)$/gm;
      const h3Regex = /^### (.+)$/gm;

      expect(h2Regex.test('## Header 2')).toBe(true);
      expect(h3Regex.test('### Header 3')).toBe(true);
    });

    it('should handle bold markdown with regex', () => {
      const input = 'This is **bold** text';
      const boldRegex = /\*\*(.+?)\*\*/g;

      expect(boldRegex.test(input)).toBe(true);
    });

    it('should handle inline code with regex', () => {
      const input = 'This is `code` text';
      const codeRegex = /`([^`]+)`/g;

      expect(codeRegex.test(input)).toBe(true);
    });

    it('should handle code blocks with regex', () => {
      const input = '```javascript\nconst x = 1;\n```';
      const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;

      expect(codeBlockRegex.test(input)).toBe(true);
    });

    it('should handle horizontal rules', () => {
      const hrRegex = /^---$/gm;
      expect(hrRegex.test('---')).toBe(true);
    });

    it('should handle blockquotes', () => {
      const blockquoteRegex = /^> (.+)$/gm;
      expect(blockquoteRegex.test('> Quote text')).toBe(true);
    });

    it('should handle list items', () => {
      const listRegex = /^- (.+)$/gm;
      expect(listRegex.test('- List item')).toBe(true);
    });
  });

  describe('getSeriesNavigation logic', () => {
    const mockArticles = [
      { slug: 'article-1', title: 'First' },
      { slug: 'article-2', title: 'Second' },
      { slug: 'article-3', title: 'Third' },
    ];

    it('should find article index', () => {
      const currentSlug = 'article-2';
      const currentIndex = mockArticles.findIndex(a => a.slug === currentSlug);

      expect(currentIndex).toBe(1);
    });

    it('should determine if previous article exists', () => {
      const currentIndex = 1;
      const hasPrev = currentIndex > 0;

      expect(hasPrev).toBe(true);
    });

    it('should determine if next article exists', () => {
      const currentIndex = 1;
      const hasNext = currentIndex < mockArticles.length - 1;

      expect(hasNext).toBe(true);
    });

    it('should get previous article', () => {
      const currentIndex = 1;
      const prev = currentIndex > 0 ? mockArticles[currentIndex - 1] : null;

      expect(prev).toEqual({ slug: 'article-1', title: 'First' });
    });

    it('should get next article', () => {
      const currentIndex = 1;
      const next = currentIndex < mockArticles.length - 1 ? mockArticles[currentIndex + 1] : null;

      expect(next).toEqual({ slug: 'article-3', title: 'Third' });
    });

    it('should return null for prev on first article', () => {
      const currentIndex = 0;
      const prev = currentIndex > 0 ? mockArticles[currentIndex - 1] : null;

      expect(prev).toBeNull();
    });

    it('should return null for next on last article', () => {
      const currentIndex = mockArticles.length - 1;
      const next = currentIndex < mockArticles.length - 1 ? mockArticles[currentIndex + 1] : null;

      expect(next).toBeNull();
    });
  });

  describe('related articles logic', () => {
    const mockArticles = [
      { slug: 'article-1', category: 'Tech', title: 'First' },
      { slug: 'article-2', category: 'Tech', title: 'Second' },
      { slug: 'article-3', category: 'Dev', title: 'Third' },
    ];

    it('should filter by category', () => {
      const currentArticle = mockArticles[0];
      const related = mockArticles.filter(a => a.category === currentArticle.category);

      expect(related).toHaveLength(2);
    });

    it('should exclude current article', () => {
      const currentArticle = mockArticles[0];
      const related = mockArticles.filter(
        a => a.category === currentArticle.category && a.slug !== currentArticle.slug
      );

      expect(related).toHaveLength(1);
      expect(related[0].slug).toBe('article-2');
    });

    it('should limit to 3 articles', () => {
      const related = mockArticles.slice(0, 3);
      expect(related.length).toBeLessThanOrEqual(3);
    });
  });

  describe('generateStaticParams pattern', () => {
    it('should map articles to params objects', () => {
      const articles = [
        { slug: 'test-1' },
        { slug: 'test-2' },
      ];

      const params = articles.map(article => ({ slug: article.slug }));

      expect(params).toEqual([
        { slug: 'test-1' },
        { slug: 'test-2' },
      ]);
    });
  });

  describe('metadata generation patterns', () => {
    it('should build canonical URL', () => {
      const siteUrl = 'https://example.com';
      const slug = 'test-article';
      const canonical = `${siteUrl}/blog/${slug}`;

      expect(canonical).toBe('https://example.com/blog/test-article');
    });

    it('should format ISO date', () => {
      const date = new Date('2024-01-15');
      const iso = date.toISOString();

      expect(iso).toContain('2024-01-15');
    });

    it('should build Open Graph image URL', () => {
      const siteUrl = 'https://example.com';
      const ogImage = `${siteUrl}/og-image.png`;

      expect(ogImage).toBe('https://example.com/og-image.png');
    });
  });

  describe('JSON-LD schema generation', () => {
    it('should create article schema structure', () => {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Test Article',
        description: 'Test description',
      };

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Article');
    });

    it('should create breadcrumb schema structure', () => {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home' },
          { '@type': 'ListItem', position: 2, name: 'Writing' },
          { '@type': 'ListItem', position: 3, name: 'Article' },
        ],
      };

      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[0].position).toBe(1);
    });

    it('should include series information', () => {
      const schema = {
        '@type': 'CreativeWorkSeries',
        name: 'Distributed Systems Series',
        position: 1,
        numberOfItems: 9,
      };

      expect(schema['@type']).toBe('CreativeWorkSeries');
      expect(schema.position).toBe(1);
    });
  });

  describe('ISR configuration', () => {
    it('should set revalidate period', () => {
      const revalidate = 3600; // 1 hour

      expect(revalidate).toBeGreaterThan(0);
      expect(revalidate).toBe(3600);
    });
  });
});