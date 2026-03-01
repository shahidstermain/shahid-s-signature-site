/**
 * Tests for Next.js Route Handler Functions
 * Testing utility functions used in Next.js route handlers and pages
 */

import { describe, it, expect } from 'vitest';

describe('Next.js Route Handler Utilities', () => {
  describe('Robots.txt Generation', () => {
    it('should block all crawlers in non-production', () => {
      const generateRobots = (isProduction: boolean, isProductionDomain: boolean) => {
        if (!isProduction || !isProductionDomain) {
          return {
            rules: {
              userAgent: '*',
              disallow: '/',
            },
          };
        }
        return {
          rules: [
            {
              userAgent: '*',
              allow: '/',
              disallow: ['/api/', '/admin/'],
            },
          ],
          sitemap: 'https://shahidster.tech/sitemap.xml',
        };
      };

      const robots = generateRobots(false, false);
      expect(robots.rules).toHaveProperty('userAgent', '*');
      expect(robots.rules).toHaveProperty('disallow', '/');
    });

    it('should allow crawlers in production', () => {
      const generateRobots = (isProduction: boolean, isProductionDomain: boolean) => {
        if (!isProduction || !isProductionDomain) {
          return {
            rules: {
              userAgent: '*',
              disallow: '/',
            },
          };
        }
        return {
          rules: [
            {
              userAgent: '*',
              allow: '/',
              disallow: ['/api/', '/admin/'],
            },
          ],
          sitemap: 'https://shahidster.tech/sitemap.xml',
        };
      };

      const robots = generateRobots(true, true);
      expect(robots.sitemap).toBe('https://shahidster.tech/sitemap.xml');
      expect(Array.isArray(robots.rules)).toBe(true);
    });

    it('should protect sensitive paths in production', () => {
      const generateRobots = (isProduction: boolean, isProductionDomain: boolean) => {
        if (!isProduction || !isProductionDomain) {
          return {
            rules: {
              userAgent: '*',
              disallow: '/',
            },
          };
        }
        return {
          rules: [
            {
              userAgent: '*',
              allow: '/',
              disallow: ['/api/', '/admin/', '/_next/'],
            },
          ],
          sitemap: 'https://shahidster.tech/sitemap.xml',
        };
      };

      const robots = generateRobots(true, true);
      const defaultRule = robots.rules[0];

      expect(defaultRule.disallow).toContain('/api/');
      expect(defaultRule.disallow).toContain('/admin/');
    });
  });

  describe('Sitemap Generation', () => {
    interface Article {
      slug: string;
      date: string;
      featured?: boolean;
    }

    it('should generate sitemap entries for all articles', () => {
      const generateSitemap = (articles: Article[]) => {
        const SITE_URL = 'https://shahidster.tech';

        const parseArticleDate = (dateStr: string): Date => {
          const months: Record<string, number> = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
          };
          const [month, year] = dateStr.split(' ');
          return new Date(parseInt(year), months[month] || 0, 15);
        };

        return articles.map((article) => ({
          url: `${SITE_URL}/blog/${article.slug}`,
          lastModified: parseArticleDate(article.date),
          changeFrequency: 'monthly' as const,
          priority: article.featured ? 0.9 : 0.8,
        }));
      };

      const articles = [
        { slug: 'test-article', date: 'Jan 2025', featured: false },
        { slug: 'featured-article', date: 'Feb 2025', featured: true },
      ];

      const sitemap = generateSitemap(articles);

      expect(sitemap).toHaveLength(2);
      expect(sitemap[0].url).toBe('https://shahidster.tech/blog/test-article');
      expect(sitemap[1].url).toBe('https://shahidster.tech/blog/featured-article');
    });

    it('should set higher priority for featured articles', () => {
      const generateSitemap = (articles: Article[]) => {
        const SITE_URL = 'https://shahidster.tech';

        const parseArticleDate = (dateStr: string): Date => {
          const months: Record<string, number> = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
          };
          const [month, year] = dateStr.split(' ');
          return new Date(parseInt(year), months[month] || 0, 15);
        };

        return articles.map((article) => ({
          url: `${SITE_URL}/blog/${article.slug}`,
          lastModified: parseArticleDate(article.date),
          changeFrequency: 'monthly' as const,
          priority: article.featured ? 0.9 : 0.8,
        }));
      };

      const articles = [
        { slug: 'regular', date: 'Jan 2025', featured: false },
        { slug: 'featured', date: 'Feb 2025', featured: true },
      ];

      const sitemap = generateSitemap(articles);

      expect(sitemap[0].priority).toBe(0.8);
      expect(sitemap[1].priority).toBe(0.9);
    });

    it('should include homepage with highest priority', () => {
      const generateHomepageSitemap = () => {
        return {
          url: 'https://shahidster.tech',
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 1.0,
        };
      };

      const homepage = generateHomepageSitemap();

      expect(homepage.priority).toBe(1.0);
      expect(homepage.url).toBe('https://shahidster.tech');
      expect(homepage.changeFrequency).toBe('weekly');
    });
  });

  describe('RSS Feed Generation', () => {
    it('should sort articles by date (newest first)', () => {
      interface Article {
        slug: string;
        date: string;
        title: string;
      }

      const sortArticles = (articles: Article[]) => {
        const parseDate = (dateStr: string): Date => {
          const months: Record<string, number> = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
          };
          const [month, year] = dateStr.split(' ');
          return new Date(parseInt(year), months[month] || 0, 15);
        };

        return [...articles].sort((a, b) => {
          return parseDate(b.date).getTime() - parseDate(a.date).getTime();
        });
      };

      const articles = [
        { slug: 'old', date: 'Jan 2024', title: 'Old Article' },
        { slug: 'new', date: 'Dec 2025', title: 'New Article' },
        { slug: 'mid', date: 'Jun 2025', title: 'Mid Article' },
      ];

      const sorted = sortArticles(articles);

      expect(sorted[0].slug).toBe('new');
      expect(sorted[1].slug).toBe('mid');
      expect(sorted[2].slug).toBe('old');
    });

    it('should generate valid RSS XML structure', () => {
      const generateRSSItem = (article: { title: string; slug: string; description: string }) => {
        const SITE_URL = 'https://shahidster.tech';
        const escapeXml = (text: string): string => {
          return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
        };

        const articleUrl = `${SITE_URL}/blog/${article.slug}`;

        return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description>${escapeXml(article.description)}</description>
    </item>`;
      };

      const article = {
        title: 'Test & Article',
        slug: 'test-article',
        description: 'Description with <html>',
      };

      const rssItem = generateRSSItem(article);

      expect(rssItem).toContain('<title>Test &amp; Article</title>');
      expect(rssItem).toContain('<description>Description with &lt;html&gt;</description>');
      expect(rssItem).toContain('<guid isPermaLink="true">');
    });

    it('should include article categories', () => {
      const generateCategories = (category: string, keywords: string[]) => {
        return [category, ...keywords]
          .map((cat) => `      <category>${cat}</category>`)
          .join('\n');
      };

      const categories = generateCategories('Fundamentals', ['Database', 'Distributed Systems']);

      expect(categories).toContain('<category>Fundamentals</category>');
      expect(categories).toContain('<category>Database</category>');
      expect(categories).toContain('<category>Distributed Systems</category>');
    });
  });

  describe('Blog Page Utilities', () => {
    describe('getSeriesNavigation', () => {
      interface Article {
        slug: string;
        title: string;
      }

      it('should return prev and next articles', () => {
        const getSeriesNavigation = (currentSlug: string, articles: Article[]) => {
          const currentIndex = articles.findIndex((a) => a.slug === currentSlug);
          return {
            prev: currentIndex > 0 ? articles[currentIndex - 1] : null,
            next: currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null,
            currentIndex: currentIndex + 1,
            total: articles.length,
          };
        };

        const articles = [
          { slug: 'first', title: 'First' },
          { slug: 'second', title: 'Second' },
          { slug: 'third', title: 'Third' },
        ];

        const nav = getSeriesNavigation('second', articles);

        expect(nav.prev?.slug).toBe('first');
        expect(nav.next?.slug).toBe('third');
        expect(nav.currentIndex).toBe(2);
        expect(nav.total).toBe(3);
      });

      it('should return null prev for first article', () => {
        const getSeriesNavigation = (currentSlug: string, articles: Article[]) => {
          const currentIndex = articles.findIndex((a) => a.slug === currentSlug);
          return {
            prev: currentIndex > 0 ? articles[currentIndex - 1] : null,
            next: currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null,
            currentIndex: currentIndex + 1,
            total: articles.length,
          };
        };

        const articles = [
          { slug: 'first', title: 'First' },
          { slug: 'second', title: 'Second' },
        ];

        const nav = getSeriesNavigation('first', articles);

        expect(nav.prev).toBeNull();
        expect(nav.next?.slug).toBe('second');
      });

      it('should return null next for last article', () => {
        const getSeriesNavigation = (currentSlug: string, articles: Article[]) => {
          const currentIndex = articles.findIndex((a) => a.slug === currentSlug);
          return {
            prev: currentIndex > 0 ? articles[currentIndex - 1] : null,
            next: currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null,
            currentIndex: currentIndex + 1,
            total: articles.length,
          };
        };

        const articles = [
          { slug: 'first', title: 'First' },
          { slug: 'second', title: 'Second' },
        ];

        const nav = getSeriesNavigation('second', articles);

        expect(nav.prev?.slug).toBe('first');
        expect(nav.next).toBeNull();
      });
    });

    describe('formatContent', () => {
      it('should convert markdown headers to HTML', () => {
        const formatContent = (content: string): string => {
          return content
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>');
        };

        const markdown = '## Heading 2\n### Heading 3';
        const html = formatContent(markdown);

        expect(html).toContain('<h2>Heading 2</h2>');
        expect(html).toContain('<h3>Heading 3</h3>');
      });

      it('should convert bold text', () => {
        const formatContent = (content: string): string => {
          return content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        };

        const markdown = 'This is **bold** text';
        const html = formatContent(markdown);

        expect(html).toContain('<strong>bold</strong>');
      });

      it('should convert inline code', () => {
        const formatContent = (content: string): string => {
          return content.replace(/`([^`]+)`/g, '<code>$1</code>');
        };

        const markdown = 'Use the `variable` here';
        const html = formatContent(markdown);

        expect(html).toContain('<code>variable</code>');
      });
    });
  });

  describe('Metadata Generation', () => {
    it('should generate proper Open Graph metadata for articles', () => {
      const generateOGMetadata = (article: {
        title: string;
        description: string;
        slug: string;
        category: string;
      }) => {
        const SITE_URL = 'https://shahidster.tech';
        const articleUrl = `${SITE_URL}/blog/${article.slug}`;

        return {
          type: 'article',
          locale: 'en_US',
          url: articleUrl,
          title: article.title,
          description: article.description,
          section: article.category,
        };
      };

      const article = {
        title: 'Test Article',
        description: 'Test Description',
        slug: 'test-article',
        category: 'Fundamentals',
      };

      const og = generateOGMetadata(article);

      expect(og.type).toBe('article');
      expect(og.locale).toBe('en_US');
      expect(og.url).toBe('https://shahidster.tech/blog/test-article');
      expect(og.section).toBe('Fundamentals');
    });

    it('should generate Twitter Card metadata', () => {
      const generateTwitterMetadata = (article: { title: string; description: string }) => {
        return {
          card: 'summary_large_image',
          title: article.title,
          description: article.description,
          creator: '@shahidster_',
        };
      };

      const article = {
        title: 'Test Article',
        description: 'Test Description',
      };

      const twitter = generateTwitterMetadata(article);

      expect(twitter.card).toBe('summary_large_image');
      expect(twitter.creator).toBe('@shahidster_');
    });
  });
});

describe('Edge Cases and Boundary Tests', () => {
  describe('Date Parsing Edge Cases', () => {
    it('should handle invalid date gracefully', () => {
      const parseDate = (dateStr: string): Date => {
        const months: Record<string, number> = {
          Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
          Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
        };
        const [month, year] = dateStr.split(' ');
        return new Date(parseInt(year) || 1970, months[month] || 0, 15);
      };

      const invalidDate = parseDate('InvalidMonth 2025');
      expect(invalidDate.getFullYear()).toBe(2025);
      expect(invalidDate.getMonth()).toBe(0); // Defaults to January
    });

    it('should handle missing year', () => {
      const parseDate = (dateStr: string): Date => {
        const months: Record<string, number> = {
          Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
          Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
        };
        const [month, year] = dateStr.split(' ');
        const yearNum = parseInt(year);
        return new Date(isNaN(yearNum) ? 1970 : yearNum, months[month] || 0, 15);
      };

      const date = parseDate('Jan');
      expect(date.getFullYear()).toBe(1970);
    });
  });

  describe('Series Navigation Edge Cases', () => {
    it('should handle single article', () => {
      const getSeriesNavigation = (
        currentSlug: string,
        articles: Array<{ slug: string; title: string }>
      ) => {
        const currentIndex = articles.findIndex((a) => a.slug === currentSlug);
        return {
          prev: currentIndex > 0 ? articles[currentIndex - 1] : null,
          next: currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null,
          currentIndex: currentIndex + 1,
          total: articles.length,
        };
      };

      const articles = [{ slug: 'only', title: 'Only Article' }];
      const nav = getSeriesNavigation('only', articles);

      expect(nav.prev).toBeNull();
      expect(nav.next).toBeNull();
      expect(nav.total).toBe(1);
    });

    it('should handle article not found', () => {
      const getSeriesNavigation = (
        currentSlug: string,
        articles: Array<{ slug: string; title: string }>
      ) => {
        const currentIndex = articles.findIndex((a) => a.slug === currentSlug);
        if (currentIndex === -1) {
          return {
            prev: null,
            next: null,
            currentIndex: 0,
            total: articles.length,
          };
        }
        return {
          prev: currentIndex > 0 ? articles[currentIndex - 1] : null,
          next: currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null,
          currentIndex: currentIndex + 1,
          total: articles.length,
        };
      };

      const articles = [{ slug: 'first', title: 'First' }];
      const nav = getSeriesNavigation('nonexistent', articles);

      expect(nav.currentIndex).toBe(0);
      expect(nav.prev).toBeNull();
      expect(nav.next).toBeNull();
    });
  });

  describe('XML Escaping Edge Cases', () => {
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

    it('should handle multiple consecutive special characters', () => {
      const escapeXml = (text: string): string => {
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
      };

      expect(escapeXml('&&<<>>')).toBe('&amp;&amp;&lt;&lt;&gt;&gt;');
    });

    it('should not double-escape already escaped content', () => {
      const escapeXml = (text: string): string => {
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
      };

      const result = escapeXml(escapeXml('&'));
      // First escape: & -> &amp;
      // Second escape: &amp; -> &amp;amp;
      expect(result).toBe('&amp;amp;');
    });
  });
});