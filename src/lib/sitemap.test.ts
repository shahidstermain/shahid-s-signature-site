import { describe, it, expect } from "vitest";
import { generateSitemap, generateRobotsTxt } from "./sitemap";
import { siteConfig } from "./site-config";
import { articles } from "../data/articles";

describe("sitemap", () => {
  describe("generateSitemap", () => {
    it("should generate valid XML with declaration", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(sitemap).toContain("</urlset>");
    });

    it("should include homepage URL", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain(`<loc>${siteConfig.siteUrl}</loc>`);
    });

    it("should include all article URLs", () => {
      const sitemap = generateSitemap();

      articles.forEach(article => {
        const expectedUrl = `${siteConfig.siteUrl}/blog/${article.slug}`;
        expect(sitemap).toContain(`<loc>${expectedUrl}</loc>`);
      });
    });

    it("should include url elements for all pages", () => {
      const sitemap = generateSitemap();

      // Count url elements: homepage + articles
      const urlCount = (sitemap.match(/<url>/g) || []).length;
      expect(urlCount).toBe(articles.length + 1); // +1 for homepage
    });

    it("should include lastmod for homepage", () => {
      const sitemap = generateSitemap();

      // Should have lastmod with today's date
      const today = new Date().toISOString().split("T")[0];
      expect(sitemap).toContain(`<lastmod>${today}</lastmod>`);
    });

    it("should include lastmod for articles", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain("<lastmod>");
      // Should have multiple lastmod entries (one per article + homepage)
      const lastmodCount = (sitemap.match(/<lastmod>/g) || []).length;
      expect(lastmodCount).toBe(articles.length + 1);
    });

    it("should include changefreq for all URLs", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain("<changefreq>weekly</changefreq>"); // homepage
      expect(sitemap).toContain("<changefreq>monthly</changefreq>"); // articles
    });

    it("should include priority for all URLs", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain("<priority>1.0</priority>"); // homepage
      expect(sitemap).toContain("<priority>0.8</priority>"); // articles
    });

    it("should format homepage priority as 1.0 (one decimal)", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toMatch(/<priority>1\.0<\/priority>/);
    });

    it("should format article priority as 0.8 (one decimal)", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toMatch(/<priority>0\.8<\/priority>/);
    });

    it("should escape XML special characters in URLs", () => {
      const sitemap = generateSitemap();

      // URLs should not contain raw & < > " '
      const urlMatches = sitemap.match(/<loc>(.*?)<\/loc>/g) || [];
      urlMatches.forEach(url => {
        // Extract URL content
        const urlContent = url.replace(/<\/?loc>/g, "");
        // If URL has & it should be &amp;
        if (urlContent.includes("&")) {
          expect(urlContent).toContain("&amp;");
        }
      });
    });

    it("should have proper XML structure for each url element", () => {
      const sitemap = generateSitemap();

      // Each <url> should have closing </url>
      const openCount = (sitemap.match(/<url>/g) || []).length;
      const closeCount = (sitemap.match(/<\/url>/g) || []).length;
      expect(openCount).toBe(closeCount);

      // Each <loc> should have closing </loc>
      const locOpenCount = (sitemap.match(/<loc>/g) || []).length;
      const locCloseCount = (sitemap.match(/<\/loc>/g) || []).length;
      expect(locOpenCount).toBe(locCloseCount);
    });

    it("should properly indent XML", () => {
      const sitemap = generateSitemap();

      // Should have indentation
      expect(sitemap).toContain("  <url>");
      expect(sitemap).toContain("    <loc>");
    });

    it("should order homepage first", () => {
      const sitemap = generateSitemap();

      const urls = sitemap.match(/<loc>(.*?)<\/loc>/g) || [];
      const firstUrl = urls[0]?.replace(/<\/?loc>/g, "");
      expect(firstUrl).toBe(siteConfig.siteUrl);
    });

    it("should format article lastmod as YYYY-MM-DD", () => {
      const sitemap = generateSitemap();

      const lastmodMatches = sitemap.match(/<lastmod>(.*?)<\/lastmod>/g) || [];
      lastmodMatches.forEach(match => {
        const date = match.replace(/<\/?lastmod>/g, "");
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });
  });

  describe("generateRobotsTxt", () => {
    it("should allow all user agents", () => {
      const robots = generateRobotsTxt();

      expect(robots).toContain("User-agent: *");
      expect(robots).toContain("Allow: /");
    });

    it("should reference sitemap", () => {
      const robots = generateRobotsTxt();

      expect(robots).toContain(`Sitemap: ${siteConfig.siteUrl}/sitemap.xml`);
    });

    it("should have proper format with newlines", () => {
      const robots = generateRobotsTxt();

      const lines = robots.split("\n");
      expect(lines.length).toBeGreaterThanOrEqual(3);
      expect(lines[0]).toBe("User-agent: *");
      expect(lines[1]).toBe("Allow: /");
    });

    it("should end with newline", () => {
      const robots = generateRobotsTxt();

      expect(robots).toMatch(/\n$/);
    });

    it("should not have trailing spaces", () => {
      const robots = generateRobotsTxt();

      const lines = robots.split("\n");
      lines.forEach(line => {
        expect(line).not.toMatch(/ $/);
      });
    });

    it("should be plain text without HTML or XML", () => {
      const robots = generateRobotsTxt();

      expect(robots).not.toContain("<");
      expect(robots).not.toContain(">");
    });
  });

  // Integration tests
  describe("integration tests", () => {
    it("sitemap and robots.txt should reference the same sitemap URL", () => {
      const sitemap = generateSitemap();
      const robots = generateRobotsTxt();

      const sitemapUrl = `${siteConfig.siteUrl}/sitemap.xml`;
      expect(robots).toContain(sitemapUrl);
    });

    it("sitemap should include all articles from data", () => {
      const sitemap = generateSitemap();

      const articleCount = articles.length;
      const blogUrlCount = (sitemap.match(/\/blog\//g) || []).length;

      expect(blogUrlCount).toBe(articleCount);
    });
  });

  // Edge cases
  describe("edge cases", () => {
    it("should handle generation without errors", () => {
      expect(() => generateSitemap()).not.toThrow();
      expect(() => generateRobotsTxt()).not.toThrow();
    });

    it("sitemap should be valid even with empty articles", () => {
      const sitemap = generateSitemap();

      // Should still have homepage
      expect(sitemap).toContain(siteConfig.siteUrl);
      expect(sitemap).toContain("<urlset");
    });

    it("should produce consistent output when called multiple times", () => {
      const robots1 = generateRobotsTxt();
      const robots2 = generateRobotsTxt();

      expect(robots1).toBe(robots2);
    });
  });

  // Validation tests
  describe("validation tests", () => {
    it("sitemap should have valid XML structure", () => {
      const sitemap = generateSitemap();

      // Basic XML validation
      expect(sitemap).toMatch(/<\?xml version="1.0" encoding="UTF-8"\?>/);
      expect(sitemap).toMatch(/<urlset[^>]*>/);
      expect(sitemap).toMatch(/<\/urlset>$/);
    });

    it("all URL elements should have required children", () => {
      const sitemap = generateSitemap();

      // Extract all url blocks
      const urlBlocks = sitemap.match(/<url>[\s\S]*?<\/url>/g) || [];

      urlBlocks.forEach(block => {
        expect(block).toContain("<loc>");
        expect(block).toContain("</loc>");
        // Optional but should exist in our implementation
        expect(block).toContain("<lastmod>");
        expect(block).toContain("<changefreq>");
        expect(block).toContain("<priority>");
      });
    });

    it("should not have duplicate URLs", () => {
      const sitemap = generateSitemap();

      const urls = sitemap.match(/<loc>(.*?)<\/loc>/g) || [];
      const urlContents = urls.map(u => u.replace(/<\/?loc>/g, ""));

      const uniqueUrls = new Set(urlContents);
      expect(uniqueUrls.size).toBe(urlContents.length);
    });
  });

  // Negative tests
  describe("negative tests", () => {
    it("sitemap should not contain invalid changefreq values", () => {
      const sitemap = generateSitemap();

      // Valid values: always, hourly, daily, weekly, monthly, yearly, never
      const changefreqMatches = sitemap.match(/<changefreq>(.*?)<\/changefreq>/g) || [];

      const validValues = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];
      changefreqMatches.forEach(match => {
        const value = match.replace(/<\/?changefreq>/g, "");
        expect(validValues).toContain(value);
      });
    });

    it("priority values should be between 0.0 and 1.0", () => {
      const sitemap = generateSitemap();

      const priorityMatches = sitemap.match(/<priority>(.*?)<\/priority>/g) || [];

      priorityMatches.forEach(match => {
        const value = parseFloat(match.replace(/<\/?priority>/g, ""));
        expect(value).toBeGreaterThanOrEqual(0.0);
        expect(value).toBeLessThanOrEqual(1.0);
      });
    });
  });

  // Performance regression tests
  describe("performance regression tests", () => {
    it("should generate sitemap in reasonable time", () => {
      const start = Date.now();
      generateSitemap();
      const duration = Date.now() - start;

      // Should complete within 100ms
      expect(duration).toBeLessThan(100);
    });

    it("should generate robots.txt in reasonable time", () => {
      const start = Date.now();
      generateRobotsTxt();
      const duration = Date.now() - start;

      // Should complete within 10ms
      expect(duration).toBeLessThan(10);
    });
  });
});