/**
 * Tests for docs/nextjs-migration-examples/app/sitemap.ts
 *
 * Covers the default sitemap() export which generates a MetadataRoute.Sitemap
 * array containing the homepage and all blog post entries.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';

// Mock 'next' so MetadataRoute type import does not fail at runtime
vi.mock('next', () => ({}));

// ---------------------------------------------------------------------------
// Mock @/data/articles with controlled test data
// ---------------------------------------------------------------------------
vi.mock('@/data/articles', () => ({
  articles: [
    {
      slug: 'cap-theorem-production',
      title: 'CAP Theorem in Production',
      description: 'Understanding CAP',
      category: 'Fundamentals',
      readTime: '8 min read',
      date: 'Nov 2025',
      featured: false,
      content: 'CAP theorem content.',
    },
    {
      slug: 'latency-tax',
      title: 'The Latency Tax',
      description: 'Separated compute and storage',
      category: 'Architecture',
      readTime: '14 min read',
      date: 'Jan 2026',
      featured: true,
      content: 'Latency tax content.',
    },
    {
      slug: 'query-optimization',
      title: 'Query Optimization',
      description: 'Petabyte-scale optimization',
      category: 'Deep Dive',
      readTime: '12 min read',
      date: 'Sep 2025',
      featured: false,
      content: 'Query optimization content.',
    },
  ],
}));

// Import after mocks are set up
const { default: sitemap } = await import(
  '../../docs/nextjs-migration-examples/app/sitemap'
);

afterEach(() => {
  vi.unstubAllEnvs();
});

// ---------------------------------------------------------------------------
// Basic shape
// ---------------------------------------------------------------------------
describe('sitemap() – basic shape', () => {
  it('returns an array', () => {
    const result = sitemap();
    expect(Array.isArray(result)).toBe(true);
  });

  it('returns one homepage entry plus one entry per article', () => {
    const result = sitemap();
    // 1 homepage + 3 articles = 4
    expect(result.length).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// Homepage entry
// ---------------------------------------------------------------------------
describe('sitemap() – homepage entry', () => {
  it('includes the homepage URL as the first entry', () => {
    const result = sitemap();
    expect(result[0].url).toBe('https://shahidster.tech');
  });

  it('sets changeFrequency to weekly for the homepage', () => {
    const result = sitemap();
    expect(result[0].changeFrequency).toBe('weekly');
  });

  it('sets priority 1.0 for the homepage', () => {
    const result = sitemap();
    expect(result[0].priority).toBe(1.0);
  });

  it('sets a lastModified date for the homepage', () => {
    const result = sitemap();
    expect(result[0].lastModified).toBeInstanceOf(Date);
  });
});

// ---------------------------------------------------------------------------
// Blog post entries
// ---------------------------------------------------------------------------
describe('sitemap() – blog post entries', () => {
  it('all blog posts have a URL under /blog/', () => {
    const result = sitemap();
    const blogEntries = result.slice(1);
    blogEntries.forEach((entry) => {
      expect(entry.url).toMatch(/^https:\/\/shahidster\.tech\/blog\//);
    });
  });

  it('includes the slugs of all articles', () => {
    const result = sitemap();
    const urls = result.map((e) => e.url);
    expect(urls).toContain('https://shahidster.tech/blog/cap-theorem-production');
    expect(urls).toContain('https://shahidster.tech/blog/latency-tax');
    expect(urls).toContain('https://shahidster.tech/blog/query-optimization');
  });

  it('sets changeFrequency to monthly for all blog posts', () => {
    const result = sitemap();
    const blogEntries = result.slice(1);
    blogEntries.forEach((entry) => {
      expect(entry.changeFrequency).toBe('monthly');
    });
  });

  it('gives featured articles a priority of 0.9', () => {
    const result = sitemap();
    const latencyEntry = result.find(
      (e) => e.url === 'https://shahidster.tech/blog/latency-tax'
    );
    expect(latencyEntry?.priority).toBe(0.9);
  });

  it('gives non-featured articles a priority of 0.8', () => {
    const result = sitemap();
    const capEntry = result.find(
      (e) => e.url === 'https://shahidster.tech/blog/cap-theorem-production'
    );
    expect(capEntry?.priority).toBe(0.8);
  });

  it('sets lastModified to the 15th of the article\'s month', () => {
    const result = sitemap();
    // Nov 2025 → 15 Nov 2025
    const capEntry = result.find(
      (e) => e.url === 'https://shahidster.tech/blog/cap-theorem-production'
    );
    const d = capEntry?.lastModified as Date;
    expect(d.getFullYear()).toBe(2025);
    expect(d.getMonth()).toBe(10); // November (0-indexed)
    expect(d.getDate()).toBe(15);
  });
});

// ---------------------------------------------------------------------------
// Ordering (newest first)
// ---------------------------------------------------------------------------
describe('sitemap() – article ordering', () => {
  it('sorts blog posts from newest to oldest', () => {
    const result = sitemap();
    const blogEntries = result.slice(1);
    const dates = blogEntries.map((e) => (e.lastModified as Date).getTime());
    // Each date should be >= the next one
    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
    }
  });

  it('places the most recent article (Jan 2026) before Nov 2025', () => {
    const result = sitemap();
    const urls = result.map((e) => e.url);
    const indexLatency = urls.indexOf('https://shahidster.tech/blog/latency-tax');
    const indexCap = urls.indexOf(
      'https://shahidster.tech/blog/cap-theorem-production'
    );
    expect(indexLatency).toBeLessThan(indexCap);
  });
});

// ---------------------------------------------------------------------------
// Environment variable for site URL
// ---------------------------------------------------------------------------
describe('sitemap() – NEXT_PUBLIC_SITE_URL', () => {
  it('respects a custom NEXT_PUBLIC_SITE_URL environment variable', async () => {
    vi.resetModules();
    vi.mock('next', () => ({}));
    vi.mock('@/data/articles', () => ({
      articles: [
        {
          slug: 'test-slug',
          title: 'Test',
          description: 'Desc',
          category: 'Cat',
          readTime: '1 min read',
          date: 'Jan 2024',
          featured: false,
          content: 'Content',
        },
      ],
    }));
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://custom.example.com');
    const { default: customSitemap } = await import(
      '../../docs/nextjs-migration-examples/app/sitemap'
    );
    const result = customSitemap();
    expect(result[0].url).toBe('https://custom.example.com');
    expect(result[1].url).toBe('https://custom.example.com/blog/test-slug');
  });
});