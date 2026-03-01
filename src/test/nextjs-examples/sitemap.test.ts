import { describe, it, expect } from 'vitest';

const SITE_URL = 'https://shahidster.tech';

// Date parsing function from the example
function parseArticleDate(dateStr: string): Date {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const parts = dateStr.split(' ');
  if (parts.length === 2) {
    const month = months[parts[0]] || 0;
    const year = parseInt(parts[1]);
    return new Date(year, month, 15);
  }
  return new Date();
}

// Mock article data
const mockArticles = [
  {
    slug: 'cap-theorem-production',
    title: 'CAP Theorem in Production',
    date: 'Nov 2025',
    category: 'Fundamentals',
    featured: true,
  },
  {
    slug: 'sharding-strategies-that-work',
    title: 'Sharding Strategies',
    date: 'Oct 2025',
    category: 'Database',
    featured: false,
  },
  {
    slug: 'query-optimization-petabyte-scale',
    title: 'Query Optimization',
    date: 'Sep 2025',
    category: 'Performance',
    featured: true,
  },
];

// Sitemap generator function
function generateSitemap(articles: typeof mockArticles) {
  const now = new Date();

  const staticPages = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
  ];

  const blogPosts = articles
    .map((article) => ({
      url: `${SITE_URL}/blog/${article.slug}`,
      lastModified: parseArticleDate(article.date),
      changeFrequency: 'monthly' as const,
      priority: article.featured ? 0.9 : 0.8,
    }))
    .sort((a, b) => {
      const dateA = a.lastModified instanceof Date ? a.lastModified : new Date(a.lastModified);
      const dateB = b.lastModified instanceof Date ? b.lastModified : new Date(b.lastModified);
      return dateB.getTime() - dateA.getTime();
    });

  return [...staticPages, ...blogPosts];
}

describe('Sitemap Generation', () => {
  describe('parseArticleDate', () => {
    it('should parse "Nov 2025" correctly', () => {
      const date = parseArticleDate('Nov 2025');
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(10); // November (0-indexed)
      expect(date.getDate()).toBe(15);
    });

    it('should parse all months correctly', () => {
      const testCases = [
        { input: 'Jan 2024', month: 0 },
        { input: 'Feb 2024', month: 1 },
        { input: 'Mar 2024', month: 2 },
        { input: 'Apr 2024', month: 3 },
        { input: 'May 2024', month: 4 },
        { input: 'Jun 2024', month: 5 },
        { input: 'Jul 2024', month: 6 },
        { input: 'Aug 2024', month: 7 },
        { input: 'Sep 2024', month: 8 },
        { input: 'Oct 2024', month: 9 },
        { input: 'Nov 2024', month: 10 },
        { input: 'Dec 2024', month: 11 },
      ];

      testCases.forEach(({ input, month }) => {
        const date = parseArticleDate(input);
        expect(date.getMonth()).toBe(month);
        expect(date.getFullYear()).toBe(2024);
      });
    });

    it('should default to 15th day of month', () => {
      const date = parseArticleDate('Jun 2025');
      expect(date.getDate()).toBe(15);
    });

    it('should handle invalid format', () => {
      const date = parseArticleDate('invalid');
      expect(date).toBeInstanceOf(Date);
      expect(date.getTime()).toBeCloseTo(new Date().getTime(), -2);
    });

    it('should handle empty string', () => {
      const date = parseArticleDate('');
      expect(date).toBeInstanceOf(Date);
    });

    it('should handle malformed input', () => {
      const date = parseArticleDate('November 2025');
      expect(date).toBeInstanceOf(Date);
    });

    it('should handle year-only input', () => {
      const date = parseArticleDate('2025');
      expect(date).toBeInstanceOf(Date);
    });
  });

  describe('Sitemap Structure', () => {
    it('should generate sitemap with homepage and articles', () => {
      const sitemap = generateSitemap(mockArticles);
      expect(sitemap.length).toBe(4); // 1 homepage + 3 articles
    });

    it('should include homepage with priority 1.0', () => {
      const sitemap = generateSitemap(mockArticles);
      const homepage = sitemap.find((entry) => entry.url === SITE_URL);

      expect(homepage).toBeDefined();
      expect(homepage?.priority).toBe(1.0);
      expect(homepage?.changeFrequency).toBe('weekly');
    });

    it('should include all blog posts', () => {
      const sitemap = generateSitemap(mockArticles);
      const blogUrls = sitemap.filter((entry) => entry.url.includes('/blog/'));

      expect(blogUrls).toHaveLength(mockArticles.length);
    });

    it('should generate correct URLs for articles', () => {
      const sitemap = generateSitemap(mockArticles);

      mockArticles.forEach((article) => {
        const entry = sitemap.find((e) => e.url === `${SITE_URL}/blog/${article.slug}`);
        expect(entry).toBeDefined();
      });
    });

    it('should sort articles by date (newest first)', () => {
      const sitemap = generateSitemap(mockArticles);
      const blogEntries = sitemap.filter((e) => e.url.includes('/blog/'));

      for (let i = 0; i < blogEntries.length - 1; i++) {
        const currentDate = new Date(blogEntries[i].lastModified).getTime();
        const nextDate = new Date(blogEntries[i + 1].lastModified).getTime();
        expect(currentDate).toBeGreaterThanOrEqual(nextDate);
      }
    });
  });

  describe('Priority Settings', () => {
    it('should assign priority 0.9 to featured articles', () => {
      const sitemap = generateSitemap(mockArticles);
      const featuredArticles = mockArticles.filter((a) => a.featured);

      featuredArticles.forEach((article) => {
        const entry = sitemap.find((e) => e.url.includes(article.slug));
        expect(entry?.priority).toBe(0.9);
      });
    });

    it('should assign priority 0.8 to non-featured articles', () => {
      const sitemap = generateSitemap(mockArticles);
      const nonFeaturedArticles = mockArticles.filter((a) => !a.featured);

      nonFeaturedArticles.forEach((article) => {
        const entry = sitemap.find((e) => e.url.includes(article.slug));
        expect(entry?.priority).toBe(0.8);
      });
    });
  });

  describe('Change Frequency', () => {
    it('should set homepage change frequency to weekly', () => {
      const sitemap = generateSitemap(mockArticles);
      const homepage = sitemap[0];

      expect(homepage.changeFrequency).toBe('weekly');
    });

    it('should set article change frequency to monthly', () => {
      const sitemap = generateSitemap(mockArticles);
      const blogEntries = sitemap.filter((e) => e.url.includes('/blog/'));

      blogEntries.forEach((entry) => {
        expect(entry.changeFrequency).toBe('monthly');
      });
    });
  });

  describe('Last Modified Dates', () => {
    it('should use current date for homepage', () => {
      const sitemap = generateSitemap(mockArticles);
      const homepage = sitemap[0];
      const now = new Date();

      expect(homepage.lastModified).toBeInstanceOf(Date);
      const diff = Math.abs(now.getTime() - homepage.lastModified.getTime());
      expect(diff).toBeLessThan(1000); // Within 1 second
    });

    it('should use article publication date for blog posts', () => {
      const sitemap = generateSitemap(mockArticles);

      mockArticles.forEach((article) => {
        const entry = sitemap.find((e) => e.url.includes(article.slug));
        const expectedDate = parseArticleDate(article.date);

        expect(entry?.lastModified).toBeInstanceOf(Date);
        expect(entry?.lastModified.getTime()).toBe(expectedDate.getTime());
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty articles array', () => {
      const sitemap = generateSitemap([]);
      expect(sitemap).toHaveLength(1); // Only homepage
      expect(sitemap[0].url).toBe(SITE_URL);
    });

    it('should handle single article', () => {
      const singleArticle = [mockArticles[0]];
      const sitemap = generateSitemap(singleArticle);

      expect(sitemap).toHaveLength(2); // Homepage + 1 article
    });

    it('should handle articles without featured flag', () => {
      const articlesWithoutFeatured = mockArticles.map((a) => ({
        ...a,
        featured: undefined as any,
      }));

      const sitemap = generateSitemap(articlesWithoutFeatured);
      const blogEntries = sitemap.filter((e) => e.url.includes('/blog/'));

      blogEntries.forEach((entry) => {
        expect(entry.priority).toBe(0.8); // Default to non-featured
      });
    });

    it('should handle articles with same date', () => {
      const articlesWithSameDate = mockArticles.map((a) => ({
        ...a,
        date: 'Nov 2025',
      }));

      const sitemap = generateSitemap(articlesWithSameDate);
      expect(sitemap.length).toBe(4);
    });

    it('should handle articles with special characters in slug', () => {
      const specialArticle = [
        {
          slug: 'article-with-special-chars-&-more',
          title: 'Special Article',
          date: 'Nov 2025',
          category: 'Test',
          featured: false,
        },
      ];

      const sitemap = generateSitemap(specialArticle);
      const entry = sitemap.find((e) => e.url.includes('special-chars'));

      expect(entry).toBeDefined();
      expect(entry?.url).toContain('&');
    });
  });

  describe('URL Format', () => {
    it('should generate valid URLs', () => {
      const sitemap = generateSitemap(mockArticles);

      sitemap.forEach((entry) => {
        expect(entry.url).toMatch(/^https:\/\//);
        expect(entry.url).not.toContain(' ');
      });
    });

    it('should not have trailing slashes', () => {
      const sitemap = generateSitemap(mockArticles);

      sitemap.forEach((entry) => {
        if (entry.url !== SITE_URL) {
          expect(entry.url).not.toMatch(/\/$/);
        }
      });
    });

    it('should use correct domain', () => {
      const sitemap = generateSitemap(mockArticles);

      sitemap.forEach((entry) => {
        expect(entry.url).toContain('shahidster.tech');
      });
    });
  });

  describe('Sitemap Validation', () => {
    it('should have valid priority values (0.0 - 1.0)', () => {
      const sitemap = generateSitemap(mockArticles);

      sitemap.forEach((entry) => {
        expect(entry.priority).toBeGreaterThanOrEqual(0.0);
        expect(entry.priority).toBeLessThanOrEqual(1.0);
      });
    });

    it('should have valid change frequency values', () => {
      const sitemap = generateSitemap(mockArticles);
      const validFrequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

      sitemap.forEach((entry) => {
        expect(validFrequencies).toContain(entry.changeFrequency);
      });
    });

    it('should have valid date objects', () => {
      const sitemap = generateSitemap(mockArticles);

      sitemap.forEach((entry) => {
        expect(entry.lastModified).toBeInstanceOf(Date);
        expect(entry.lastModified.getTime()).not.toBeNaN();
      });
    });
  });

  describe('Performance Considerations', () => {
    it('should handle large number of articles', () => {
      const manyArticles = Array.from({ length: 1000 }, (_, i) => ({
        slug: `article-${i}`,
        title: `Article ${i}`,
        date: 'Nov 2025',
        category: 'Test',
        featured: i % 2 === 0,
      }));

      const startTime = Date.now();
      const sitemap = generateSitemap(manyArticles);
      const endTime = Date.now();

      expect(sitemap).toHaveLength(1001); // 1 homepage + 1000 articles
      expect(endTime - startTime).toBeLessThan(100); // Should be fast
    });
  });
});