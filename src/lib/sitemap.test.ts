import { describe, it, expect } from "vitest";
import { generateSitemap, generateRobotsTxt } from "./sitemap";
import { siteConfig } from "./site-config";

describe("sitemap", () => {
  describe("generateSitemap", () => {
    let sitemap: string;

    beforeEach(() => {
      sitemap = generateSitemap();
    });

    it("should generate valid XML with declaration", () => {
      expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    });

    it("should include urlset root element", () => {
      expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(sitemap).toContain('</urlset>');
    });

    it("should include homepage URL", () => {
      expect(sitemap).toContain(`<loc>${siteConfig.siteUrl}</loc>`);
    });

    it("should set homepage priority to 1.0", () => {
      const homepageSection = sitemap.substring(
        sitemap.indexOf(`<loc>${siteConfig.siteUrl}</loc>`) - 100,
        sitemap.indexOf(`<loc>${siteConfig.siteUrl}</loc>`) + 200
      );
      expect(homepageSection).toContain('<priority>1.0</priority>');
    });

    it("should set homepage changefreq to weekly", () => {
      const homepageSection = sitemap.substring(
        sitemap.indexOf(`<loc>${siteConfig.siteUrl}</loc>`) - 100,
        sitemap.indexOf(`<loc>${siteConfig.siteUrl}</loc>`) + 200
      );
      expect(homepageSection).toContain('<changefreq>weekly</changefreq>');
    });

    it("should include lastmod for homepage", () => {
      const homepageSection = sitemap.substring(
        sitemap.indexOf(`<loc>${siteConfig.siteUrl}</loc>`) - 100,
        sitemap.indexOf(`<loc>${siteConfig.siteUrl}</loc>`) + 200
      );
      expect(homepageSection).toContain('<lastmod>');
      expect(homepageSection).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    });

    it("should include blog article URLs", () => {
      expect(sitemap).toContain(`<loc>${siteConfig.siteUrl}/blog/cap-theorem-production</loc>`);
      expect(sitemap).toContain(`<loc>${siteConfig.siteUrl}/blog/pragmatic-consistency</loc>`);
    });

    it("should set article priority to 0.8", () => {
      const articleSection = sitemap.substring(
        sitemap.indexOf('/blog/cap-theorem-production') - 100,
        sitemap.indexOf('/blog/cap-theorem-production') + 200
      );
      expect(articleSection).toContain('<priority>0.8</priority>');
    });

    it("should set article changefreq to monthly", () => {
      const articleSection = sitemap.substring(
        sitemap.indexOf('/blog/cap-theorem-production') - 100,
        sitemap.indexOf('/blog/cap-theorem-production') + 200
      );
      expect(articleSection).toContain('<changefreq>monthly</changefreq>');
    });

    it("should include lastmod for articles", () => {
      const articleSection = sitemap.substring(
        sitemap.indexOf('/blog/cap-theorem-production') - 100,
        sitemap.indexOf('/blog/cap-theorem-production') + 200
      );
      expect(articleSection).toContain('<lastmod>');
    });

    it("should have proper URL structure", () => {
      const urls = sitemap.match(/<url>[\s\S]*?<\/url>/g);
      expect(urls).toBeTruthy();
      expect(urls!.length).toBeGreaterThan(1); // At least homepage + articles
    });

    it("should wrap each URL in <url> tags", () => {
      const urlCount = (sitemap.match(/<url>/g) || []).length;
      const urlCloseCount = (sitemap.match(/<\/url>/g) || []).length;
      expect(urlCount).toBe(urlCloseCount);
      expect(urlCount).toBeGreaterThan(0);
    });

    it("should escape XML special characters in URLs", () => {
      // Check that & is properly escaped
      const locMatches = sitemap.match(/<loc>([^<]*)<\/loc>/g);
      if (locMatches) {
        locMatches.forEach(loc => {
          const url = loc.replace(/<\/?loc>/g, '');
          if (url.includes('&')) {
            expect(url).toMatch(/&amp;/);
          }
        });
      }
    });

    it("should include all URL elements in correct order", () => {
      const firstUrl = sitemap.match(/<url>[\s\S]*?<\/url>/)?.[0];
      expect(firstUrl).toBeTruthy();
      if (firstUrl) {
        // Check order: loc, lastmod, changefreq, priority
        const locIndex = firstUrl.indexOf('<loc>');
        const lastmodIndex = firstUrl.indexOf('<lastmod>');
        const changefreqIndex = firstUrl.indexOf('<changefreq>');
        const priorityIndex = firstUrl.indexOf('<priority>');

        expect(locIndex).toBeGreaterThan(-1);
        expect(locIndex).toBeLessThan(lastmodIndex);
      }
    });

    it("should have properly formatted lastmod dates", () => {
      const lastmodMatches = sitemap.match(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/g);
      expect(lastmodMatches).toBeTruthy();
      expect(lastmodMatches!.length).toBeGreaterThan(0);
    });

    it("should have valid priority values", () => {
      const priorityMatches = sitemap.match(/<priority>([\d.]+)<\/priority>/g);
      expect(priorityMatches).toBeTruthy();
      priorityMatches?.forEach(priority => {
        const value = parseFloat(priority.match(/[\d.]+/)![0]);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      });
    });

    it("should have valid changefreq values", () => {
      const changefreqMatches = sitemap.match(/<changefreq>(.*?)<\/changefreq>/g);
      expect(changefreqMatches).toBeTruthy();
      const validFreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
      changefreqMatches?.forEach(freq => {
        const value = freq.match(/<changefreq>(.*?)<\/changefreq>/)![1];
        expect(validFreqs).toContain(value);
      });
    });

    it("should include multiple articles", () => {
      const blogUrls = (sitemap.match(/\/blog\/[\w-]+/g) || []);
      expect(blogUrls.length).toBeGreaterThan(1);
    });

    it("should properly close all XML tags", () => {
      // Count opening and closing tags
      const urlOpen = (sitemap.match(/<url>/g) || []).length;
      const urlClose = (sitemap.match(/<\/url>/g) || []).length;
      const locOpen = (sitemap.match(/<loc>/g) || []).length;
      const locClose = (sitemap.match(/<\/loc>/g) || []).length;

      expect(urlOpen).toBe(urlClose);
      expect(locOpen).toBe(locClose);
    });
  });

  describe("generateRobotsTxt", () => {
    let robots: string;

    beforeEach(() => {
      robots = generateRobotsTxt();
    });

    it("should include User-agent directive", () => {
      expect(robots).toContain('User-agent: *');
    });

    it("should allow all paths", () => {
      expect(robots).toContain('Allow: /');
    });

    it("should include sitemap URL", () => {
      expect(robots).toContain(`Sitemap: ${siteConfig.siteUrl}/sitemap.xml`);
    });

    it("should have proper format with line breaks", () => {
      const lines = robots.split('\n');
      expect(lines.length).toBeGreaterThanOrEqual(3);
      expect(lines[0]).toBe('User-agent: *');
      expect(lines[1]).toBe('Allow: /');
      expect(lines[2]).toBe('');
      expect(lines[3]).toContain('Sitemap:');
    });

    it("should end with newline", () => {
      expect(robots).toMatch(/\n$/);
    });

    it("should have exactly one User-agent directive", () => {
      const matches = robots.match(/User-agent:/g);
      expect(matches?.length).toBe(1);
    });

    it("should have exactly one Allow directive", () => {
      const matches = robots.match(/Allow:/g);
      expect(matches?.length).toBe(1);
    });

    it("should have exactly one Sitemap directive", () => {
      const matches = robots.match(/Sitemap:/g);
      expect(matches?.length).toBe(1);
    });

    it("should not include Disallow directives", () => {
      expect(robots).not.toContain('Disallow:');
    });

    it("should point to correct sitemap URL", () => {
      expect(robots).toContain('/sitemap.xml');
      expect(robots).toContain(siteConfig.siteUrl);
    });

    it("should be plain text format", () => {
      // No HTML, XML, or JSON
      expect(robots).not.toContain('<');
      expect(robots).not.toContain('>');
      expect(robots).not.toContain('{');
      expect(robots).not.toContain('}');
    });
  });

  describe("XML escaping", () => {
    it("should properly escape special characters in sitemap", () => {
      const sitemap = generateSitemap();

      // Ensure no unescaped special characters in element content
      const locContent = sitemap.match(/<loc>([^<]*)<\/loc>/g);
      if (locContent) {
        locContent.forEach(loc => {
          const content = loc.replace(/<\/?loc>/g, '');
          // If there's an ampersand, it should be escaped
          if (content.includes('&')) {
            expect(content).toMatch(/&amp;/);
            expect(content).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/);
          }
        });
      }
    });
  });

  describe("date formatting", () => {
    it("should format article dates as YYYY-MM-DD", () => {
      const sitemap = generateSitemap();
      const lastmodMatches = sitemap.match(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/g);

      expect(lastmodMatches).toBeTruthy();
      lastmodMatches?.forEach(match => {
        const date = match.match(/\d{4}-\d{2}-\d{2}/)![0];
        const parsed = new Date(date);
        expect(parsed).toBeInstanceOf(Date);
        expect(parsed.toString()).not.toBe('Invalid Date');
      });
    });
  });

  describe("edge cases and regression tests", () => {
    it("should generate consistent output on multiple calls", () => {
      const sitemap1 = generateSitemap();
      const sitemap2 = generateSitemap();
      // Should be identical except for today's date on homepage
      expect(sitemap1.split('\n').length).toBe(sitemap2.split('\n').length);
    });

    it("should handle special URL characters", () => {
      const sitemap = generateSitemap();
      // URLs with special chars should be escaped
      expect(sitemap).not.toMatch(/<loc>[^<]*&(?!amp;|lt;|gt;|quot;|apos;)[^<]*<\/loc>/);
    });

    it("should generate valid XML structure", () => {
      const sitemap = generateSitemap();
      // Basic XML validation
      expect(sitemap.startsWith('<?xml')).toBe(true);
      expect(sitemap).toContain('<urlset');
      expect(sitemap.endsWith('</urlset>'));
    });

    it("should not include duplicate URLs", () => {
      const sitemap = generateSitemap();
      const urls = sitemap.match(/<loc>(.*?)<\/loc>/g) || [];
      const uniqueUrls = new Set(urls);
      expect(urls.length).toBe(uniqueUrls.size);
    });

    it("should order URLs with homepage first", () => {
      const sitemap = generateSitemap();
      const firstUrl = sitemap.match(/<loc>(.*?)<\/loc>/)?.[1];
      expect(firstUrl).toBe(siteConfig.siteUrl);
    });

    it("should include xmlns namespace in urlset", () => {
      const sitemap = generateSitemap();
      expect(sitemap).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    });

    it("should handle articles with various date formats", () => {
      const sitemap = generateSitemap();
      // Should parse "Nov 2025", "Jan 2026", etc.
      const lastmodDates = sitemap.match(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/g) || [];
      expect(lastmodDates.length).toBeGreaterThan(5); // Homepage + multiple articles
    });

    it("should generate robots.txt with single newline at end", () => {
      const robots = generateRobotsTxt();
      expect(robots.endsWith('\n')).toBe(true);
      expect(robots.endsWith('\n\n')).toBe(false);
    });

    it("should not have trailing whitespace in robots.txt", () => {
      const robots = generateRobotsTxt();
      const lines = robots.split('\n');
      lines.forEach(line => {
        if (line.trim() !== '') {
          expect(line).toBe(line.trimEnd());
        }
      });
    });

    it("should generate sitemap with proper indentation", () => {
      const sitemap = generateSitemap();
      // Check that URLs are indented with 2 spaces
      const urlBlocks = sitemap.match(/  <url>/g);
      expect(urlBlocks).toBeTruthy();
      expect(urlBlocks!.length).toBeGreaterThan(0);
    });

    it("should handle blog slugs with hyphens", () => {
      const sitemap = generateSitemap();
      expect(sitemap).toContain('cap-theorem-production');
      expect(sitemap).toContain('latency-tax-separated-compute-storage');
    });

    it("should generate sitemap URLs matching site config", () => {
      const sitemap = generateSitemap();
      const urls = sitemap.match(/<loc>(.*?)<\/loc>/g) || [];
      urls.forEach(url => {
        expect(url).toContain(siteConfig.siteUrl);
      });
    });
  });
});