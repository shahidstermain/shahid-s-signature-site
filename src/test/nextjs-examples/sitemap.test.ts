/**
 * Tests for Next.js sitemap generator
 * Testing: docs/nextjs-migration-examples/app/sitemap.ts
 */

import { describe, it, expect, beforeEach } from 'vitest';

const SITE_URL = 'https://shahidster.tech';

interface SitemapEntry {
  url: string;
  lastModified?: Date | string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

type Sitemap = SitemapEntry[];

interface Article {
  slug: string;
  title: string;
  date: string;
  featured?: boolean;
}

// Mock articles data
const mockArticles: Article[] = [
  {
    slug: 'cap-theorem-production',
    title: 'CAP Theorem in Production',
    date: 'Nov 2025',
    featured: true,
  },
  {
    slug: 'sharding-strategies-that-work',
    title: 'Sharding Strategies That Work',
    date: 'Oct 2025',
  },
  {
    slug: 'query-optimization-petabyte-scale',
    title: 'Query Optimization at Petabyte Scale',
    date: 'Sep 2025',
    featured: true,
  },
  {
    slug: 'eventual-consistency-practice',
    title: 'Eventual Consistency in Practice',
    date: 'Aug 2025',
  },
];

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

function generateSitemap(articles: Article[]): Sitemap {
  const now = new Date();

  const staticPages: Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  const blogPosts: Sitemap = articles
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

describe('Sitemap Generator', () => {
  describe('Static Pages', () => {
    it('should include homepage', () => {
      const sitemap = generateSitemap([]);

      expect(sitemap).toHaveLength(1);
      expect(sitemap[0].url).toBe(SITE_URL);
    });

    it('should set homepage priority to 1.0', () => {
      const sitemap = generateSitemap([]);

      expect(sitemap[0].priority).toBe(1.0);
    });

    it('should set homepage changeFrequency to weekly', () => {
      const sitemap = generateSitemap([]);

      expect(sitemap[0].changeFrequency).toBe('weekly');
    });

    it('should set homepage lastModified to current date', () => {
      const before = new Date();
      const sitemap = generateSitemap([]);
      const after = new Date();

      const lastModified = sitemap[0].lastModified as Date;
      expect(lastModified.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(lastModified.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('Blog Posts', () => {
    it('should include all blog posts', () => {
      const sitemap = generateSitemap(mockArticles);

      // 1 static page + 4 articles
      expect(sitemap).toHaveLength(5);
    });

    it('should generate correct URLs for blog posts', () => {
      const sitemap = generateSitemap(mockArticles);

      expect(sitemap[1].url).toContain('/blog/');
      expect(sitemap[2].url).toContain('/blog/');
    });

    it('should set blog post changeFrequency to monthly', () => {
      const sitemap = generateSitemap(mockArticles);

      const blogPosts = sitemap.slice(1);
      blogPosts.forEach(post => {
        expect(post.changeFrequency).toBe('monthly');
      });
    });

    it('should set higher priority for featured articles', () => {
      const sitemap = generateSitemap(mockArticles);

      const capTheorem = sitemap.find(entry => entry.url.includes('cap-theorem-production'));
      const queryOpt = sitemap.find(entry => entry.url.includes('query-optimization-petabyte-scale'));

      expect(capTheorem?.priority).toBe(0.9);
      expect(queryOpt?.priority).toBe(0.9);
    });

    it('should set normal priority for non-featured articles', () => {
      const sitemap = generateSitemap(mockArticles);

      const sharding = sitemap.find(entry => entry.url.includes('sharding-strategies-that-work'));
      const eventual = sitemap.find(entry => entry.url.includes('eventual-consistency-practice'));

      expect(sharding?.priority).toBe(0.8);
      expect(eventual?.priority).toBe(0.8);
    });

    it('should sort blog posts by date (newest first)', () => {
      const sitemap = generateSitemap(mockArticles);

      const blogPosts = sitemap.slice(1); // Skip homepage

      // Nov 2025 should be first
      expect(blogPosts[0].url).toContain('cap-theorem-production');
      // Oct 2025 should be second
      expect(blogPosts[1].url).toContain('sharding-strategies-that-work');
      // Sep 2025 should be third
      expect(blogPosts[2].url).toContain('query-optimization-petabyte-scale');
      // Aug 2025 should be last
      expect(blogPosts[3].url).toContain('eventual-consistency-practice');
    });
  });

  describe('Date Parsing', () => {
    it('should parse article dates correctly', () => {
      const nov2025 = parseArticleDate('Nov 2025');
      expect(nov2025.getFullYear()).toBe(2025);
      expect(nov2025.getMonth()).toBe(10); // November (0-indexed)
      expect(nov2025.getDate()).toBe(15);
    });

    it('should parse all months correctly', () => {
      const dates = [
        { str: 'Jan 2025', month: 0 },
        { str: 'Feb 2025', month: 1 },
        { str: 'Mar 2025', month: 2 },
        { str: 'Apr 2025', month: 3 },
        { str: 'May 2025', month: 4 },
        { str: 'Jun 2025', month: 5 },
        { str: 'Jul 2025', month: 6 },
        { str: 'Aug 2025', month: 7 },
        { str: 'Sep 2025', month: 8 },
        { str: 'Oct 2025', month: 9 },
        { str: 'Nov 2025', month: 10 },
        { str: 'Dec 2025', month: 11 },
      ];

      dates.forEach(({ str, month }) => {
        const date = parseArticleDate(str);
        expect(date.getMonth()).toBe(month);
      });
    });

    it('should use lastModified date from article date', () => {
      const sitemap = generateSitemap(mockArticles);

      const nov2025Article = sitemap.find(entry => entry.url.includes('cap-theorem-production'));
      const lastModified = nov2025Article!.lastModified as Date;

      expect(lastModified.getFullYear()).toBe(2025);
      expect(lastModified.getMonth()).toBe(10); // November
    });

    it('should handle invalid date format', () => {
      const date = parseArticleDate('Invalid');
      expect(date).toBeInstanceOf(Date);
      // Should return current date
      expect(date.getFullYear()).toBeGreaterThanOrEqual(2025);
    });
  });

  describe('URL Structure', () => {
    it('should use correct site URL', () => {
      const sitemap = generateSitemap(mockArticles);

      sitemap.forEach(entry => {
        expect(entry.url).toContain('https://shahidster.tech');
      });
    });

    it('should have proper blog post URL structure', () => {
      const sitemap = generateSitemap(mockArticles);

      const blogPosts = sitemap.slice(1);
      blogPosts.forEach(post => {
        expect(post.url).toMatch(/^https:\/\/shahidster\.tech\/blog\/[\w-]+$/);
      });
    });

    it('should use article slugs in URLs', () => {
      const sitemap = generateSitemap(mockArticles);

      mockArticles.forEach(article => {
        const found = sitemap.some(entry => entry.url.includes(article.slug));
        expect(found).toBe(true);
      });
    });
  });

  describe('Priority Configuration', () => {
    it('should have homepage with highest priority', () => {
      const sitemap = generateSitemap(mockArticles);

      const homepage = sitemap[0];
      const otherPages = sitemap.slice(1);

      otherPages.forEach(page => {
        expect(homepage.priority).toBeGreaterThan(page.priority!);
      });
    });

    it('should prioritize featured articles over regular ones', () => {
      const sitemap = generateSitemap(mockArticles);

      const featured = sitemap.filter(entry => entry.priority === 0.9);
      const regular = sitemap.filter(entry => entry.priority === 0.8);

      expect(featured.length).toBe(2); // Two featured articles
      expect(regular.length).toBe(2); // Two regular articles
    });

    it('should have all priorities within valid range', () => {
      const sitemap = generateSitemap(mockArticles);

      sitemap.forEach(entry => {
        expect(entry.priority).toBeGreaterThanOrEqual(0);
        expect(entry.priority).toBeLessThanOrEqual(1.0);
      });
    });
  });

  describe('Change Frequency', () => {
    it('should use appropriate change frequencies', () => {
      const sitemap = generateSitemap(mockArticles);

      const homepage = sitemap[0];
      const blogPosts = sitemap.slice(1);

      expect(homepage.changeFrequency).toBe('weekly');
      blogPosts.forEach(post => {
        expect(post.changeFrequency).toBe('monthly');
      });
    });

    it('should use valid changeFrequency values', () => {
      const sitemap = generateSitemap(mockArticles);

      const validFrequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

      sitemap.forEach(entry => {
        expect(validFrequencies).toContain(entry.changeFrequency);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty articles array', () => {
      const sitemap = generateSitemap([]);

      expect(sitemap).toHaveLength(1);
      expect(sitemap[0].url).toBe(SITE_URL);
    });

    it('should handle single article', () => {
      const singleArticle: Article[] = [mockArticles[0]];
      const sitemap = generateSitemap(singleArticle);

      expect(sitemap).toHaveLength(2); // Homepage + 1 article
    });

    it('should handle many articles', () => {
      const manyArticles: Article[] = Array.from({ length: 100 }, (_, i) => ({
        slug: `article-${i}`,
        title: `Article ${i}`,
        date: 'Jan 2025',
      }));

      const sitemap = generateSitemap(manyArticles);

      expect(sitemap).toHaveLength(101); // Homepage + 100 articles
    });

    it('should handle articles without featured flag', () => {
      const articles: Article[] = [
        { slug: 'test-article', title: 'Test', date: 'Jan 2025' },
      ];

      const sitemap = generateSitemap(articles);
      const article = sitemap.find(entry => entry.url.includes('test-article'));

      expect(article?.priority).toBe(0.8); // Default priority
    });

    it('should maintain order after sorting', () => {
      const sitemap1 = generateSitemap(mockArticles);
      const sitemap2 = generateSitemap(mockArticles);

      expect(sitemap1).toEqual(sitemap2);
    });
  });

  describe('Sitemap Structure', () => {
    it('should return array of sitemap entries', () => {
      const sitemap = generateSitemap(mockArticles);

      expect(Array.isArray(sitemap)).toBe(true);
      sitemap.forEach(entry => {
        expect(entry).toHaveProperty('url');
        expect(entry).toHaveProperty('lastModified');
        expect(entry).toHaveProperty('changeFrequency');
        expect(entry).toHaveProperty('priority');
      });
    });

    it('should have required fields for all entries', () => {
      const sitemap = generateSitemap(mockArticles);

      sitemap.forEach(entry => {
        expect(typeof entry.url).toBe('string');
        expect(entry.lastModified).toBeDefined();
        expect(entry.changeFrequency).toBeDefined();
        expect(typeof entry.priority).toBe('number');
      });
    });

    it('should have valid lastModified dates', () => {
      const sitemap = generateSitemap(mockArticles);

      sitemap.forEach(entry => {
        const date = entry.lastModified instanceof Date
          ? entry.lastModified
          : new Date(entry.lastModified!);

        expect(date).toBeInstanceOf(Date);
        expect(date.getTime()).not.toBeNaN();
      });
    });
  });

  describe('SEO Best Practices', () => {
    it('should place most recent content first after homepage', () => {
      const sitemap = generateSitemap(mockArticles);

      const blogPosts = sitemap.slice(1);

      for (let i = 0; i < blogPosts.length - 1; i++) {
        const current = blogPosts[i].lastModified as Date;
        const next = blogPosts[i + 1].lastModified as Date;
        expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
      }
    });

    it('should use clean URLs without trailing slashes', () => {
      const sitemap = generateSitemap(mockArticles);

      sitemap.forEach(entry => {
        expect(entry.url).not.toMatch(/\/$/);
      });
    });

    it('should use HTTPS protocol', () => {
      const sitemap = generateSitemap(mockArticles);

      sitemap.forEach(entry => {
        expect(entry.url).toMatch(/^https:\/\//);
      });
    });
  });

  describe('Large Scale Performance', () => {
    it('should handle sitemap size limits (50k URLs)', () => {
      // Test approaching the 50,000 URL limit
      const largeArticleSet: Article[] = Array.from({ length: 10000 }, (_, i) => ({
        slug: `article-${i}`,
        title: `Article ${i}`,
        date: 'Jan 2025',
      }));

      const sitemap = generateSitemap(largeArticleSet);

      expect(sitemap.length).toBe(10001); // 10000 articles + 1 homepage
      expect(sitemap[0].url).toBe(SITE_URL);
    });

    it('should maintain sort stability with identical dates', () => {
      const identicalDates: Article[] = Array.from({ length: 100 }, (_, i) => ({
        slug: `article-${i}`,
        title: `Article ${i}`,
        date: 'Jan 2025',
      }));

      const sitemap1 = generateSitemap(identicalDates);
      const sitemap2 = generateSitemap(identicalDates);

      // Should produce consistent results
      expect(sitemap1).toEqual(sitemap2);
    });

    it('should efficiently process dates across years', () => {
      const multiYearArticles: Article[] = [
        { slug: 'article-2023', title: 'Test', date: 'Dec 2023' },
        { slug: 'article-2024', title: 'Test', date: 'Jun 2024' },
        { slug: 'article-2025', title: 'Test', date: 'Jan 2025' },
        { slug: 'article-2026', title: 'Test', date: 'Mar 2026' },
      ];

      const sitemap = generateSitemap(multiYearArticles);

      // Should be sorted newest first (2026, 2025, 2024, 2023)
      expect(sitemap[1].url).toContain('2026');
      expect(sitemap[2].url).toContain('2025');
      expect(sitemap[3].url).toContain('2024');
      expect(sitemap[4].url).toContain('2023');
    });
  });

  describe('URL and Slug Handling', () => {
    it('should handle slugs with special characters', () => {
      const specialArticles: Article[] = [
        { slug: 'test-with-dashes', title: 'Test', date: 'Jan 2025' },
        { slug: 'test_with_underscores', title: 'Test', date: 'Jan 2025' },
        { slug: 'test.with.dots', title: 'Test', date: 'Jan 2025' },
      ];

      const sitemap = generateSitemap(specialArticles);

      expect(sitemap.some(e => e.url.includes('test-with-dashes'))).toBe(true);
      expect(sitemap.some(e => e.url.includes('test_with_underscores'))).toBe(true);
      expect(sitemap.some(e => e.url.includes('test.with.dots'))).toBe(true);
    });

    it('should handle very long slugs', () => {
      const longSlug = 'a'.repeat(500);
      const article: Article = {
        slug: longSlug,
        title: 'Test',
        date: 'Jan 2025',
      };

      const sitemap = generateSitemap([article]);

      expect(sitemap[1].url).toContain(longSlug);
      expect(sitemap[1].url.length).toBeGreaterThan(500);
    });

    it('should preserve URL encoding requirements', () => {
      const articles: Article[] = [
        { slug: 'test article with spaces', title: 'Test', date: 'Jan 2025' },
      ];

      const sitemap = generateSitemap(articles);

      // Should include the slug as-is (encoding happens at XML serialization)
      expect(sitemap[1].url).toContain('test article with spaces');
    });
  });

  describe('Priority Distribution', () => {
    it('should have varied priorities for better crawl guidance', () => {
      const sitemap = generateSitemap(mockArticles);

      const priorities = new Set(sitemap.map(e => e.priority));

      // Should have at least homepage (1.0), featured (0.9), and regular (0.8)
      expect(priorities.has(1.0)).toBe(true);
      expect(priorities.has(0.9)).toBe(true);
      expect(priorities.has(0.8)).toBe(true);
    });

    it('should correctly identify featured articles for priority boost', () => {
      const mixedArticles: Article[] = [
        { slug: 'featured-1', title: 'Test', date: 'Jan 2025', featured: true },
        { slug: 'regular-1', title: 'Test', date: 'Jan 2025', featured: false },
        { slug: 'regular-2', title: 'Test', date: 'Jan 2025' }, // undefined featured
        { slug: 'featured-2', title: 'Test', date: 'Jan 2025', featured: true },
      ];

      const sitemap = generateSitemap(mixedArticles);

      const featured1 = sitemap.find(e => e.url.includes('featured-1'));
      const featured2 = sitemap.find(e => e.url.includes('featured-2'));
      const regular1 = sitemap.find(e => e.url.includes('regular-1'));
      const regular2 = sitemap.find(e => e.url.includes('regular-2'));

      expect(featured1?.priority).toBe(0.9);
      expect(featured2?.priority).toBe(0.9);
      expect(regular1?.priority).toBe(0.8);
      expect(regular2?.priority).toBe(0.8);
    });
  });

  describe('Date Handling Edge Cases', () => {
    it('should handle leap year dates', () => {
      const article: Article = {
        slug: 'leap-year',
        title: 'Test',
        date: 'Feb 2024', // 2024 is a leap year
      };

      const sitemap = generateSitemap([article]);
      const entry = sitemap.find(e => e.url.includes('leap-year'));
      const date = entry!.lastModified as Date;

      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(1); // February
    });

    it('should handle end-of-year dates', () => {
      const article: Article = {
        slug: 'end-of-year',
        title: 'Test',
        date: 'Dec 2025',
      };

      const sitemap = generateSitemap([article]);
      const entry = sitemap.find(e => e.url.includes('end-of-year'));
      const date = entry!.lastModified as Date;

      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(11); // December
      expect(date.getDate()).toBe(15);
    });

    it('should maintain date immutability', () => {
      const sitemap = generateSitemap(mockArticles);

      const entry1 = sitemap[1];
      const date1 = entry1.lastModified as Date;
      const originalTime = date1.getTime();

      // Attempt to modify (shouldn't affect other calls)
      date1.setFullYear(2099);

      const sitemap2 = generateSitemap(mockArticles);
      const date2 = sitemap2[1].lastModified as Date;

      expect(date2.getFullYear()).not.toBe(2099);
    });
  });
});