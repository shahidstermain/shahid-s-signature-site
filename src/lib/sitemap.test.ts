import { describe, it, expect, vi } from "vitest";
import { generateSitemap, generateRobotsTxt } from "./sitemap";

// Mock the articles data
vi.mock("../data/articles", () => ({
  articles: [
    {
      slug: "article-1",
      title: "Article 1",
      date: "Jan 2024",
    },
    {
      slug: "article-2",
      title: "Article 2",
      date: "Feb 2024",
    },
    {
      slug: "special-chars-&-<>",
      title: "Special Characters",
      date: "Mar 2024",
    },
  ],
}));

describe("sitemap", () => {
  describe("generateSitemap", () => {
    it("should generate valid XML structure", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(sitemap).toContain("</urlset>");
    });

    it("should include homepage URL", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain("<url>");
      expect(sitemap).toContain("<loc>https://shahidster.tech</loc>");
    });

    it("should include homepage with priority 1.0", () => {
      const sitemap = generateSitemap();

      const homepageSection = sitemap.substring(
        sitemap.indexOf("https://shahidster.tech</loc>"),
        sitemap.indexOf("</url>", sitemap.indexOf("https://shahidster.tech</loc>"))
      );

      expect(homepageSection).toContain("<priority>1.0</priority>");
    });

    it("should include homepage with weekly changefreq", () => {
      const sitemap = generateSitemap();

      const homepageSection = sitemap.substring(
        sitemap.indexOf("https://shahidster.tech</loc>"),
        sitemap.indexOf("</url>", sitemap.indexOf("https://shahidster.tech</loc>"))
      );

      expect(homepageSection).toContain("<changefreq>weekly</changefreq>");
    });

    it("should include homepage with lastmod", () => {
      const sitemap = generateSitemap();

      const homepageSection = sitemap.substring(
        sitemap.indexOf("https://shahidster.tech</loc>"),
        sitemap.indexOf("</url>", sitemap.indexOf("https://shahidster.tech</loc>"))
      );

      expect(homepageSection).toContain("<lastmod>");
      expect(homepageSection).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    });

    it("should include all article URLs", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain("https://shahidster.tech/blog/article-1");
      expect(sitemap).toContain("https://shahidster.tech/blog/article-2");
    });

    it("should include articles with priority 0.8", () => {
      const sitemap = generateSitemap();

      const articleSection = sitemap.substring(
        sitemap.indexOf("/blog/article-1"),
        sitemap.indexOf("</url>", sitemap.indexOf("/blog/article-1"))
      );

      expect(articleSection).toContain("<priority>0.8</priority>");
    });

    it("should include articles with monthly changefreq", () => {
      const sitemap = generateSitemap();

      const articleSection = sitemap.substring(
        sitemap.indexOf("/blog/article-1"),
        sitemap.indexOf("</url>", sitemap.indexOf("/blog/article-1"))
      );

      expect(articleSection).toContain("<changefreq>monthly</changefreq>");
    });

    it("should include articles with lastmod based on article date", () => {
      const sitemap = generateSitemap();

      const article1Section = sitemap.substring(
        sitemap.indexOf("/blog/article-1"),
        sitemap.indexOf("</url>", sitemap.indexOf("/blog/article-1"))
      );

      expect(article1Section).toContain("<lastmod>2024-01-01</lastmod>");
    });

    it("should escape XML special characters in URLs", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain("special-chars-&amp;-&lt;&gt;");
      expect(sitemap).not.toContain("special-chars-&-<>");
    });

    it("should have correct number of url entries", () => {
      const sitemap = generateSitemap();

      const urlCount = (sitemap.match(/<url>/g) || []).length;
      // 1 homepage + 3 articles = 4 URLs
      expect(urlCount).toBe(4);
    });

    it("should format lastmod dates correctly", () => {
      const sitemap = generateSitemap();

      const lastmodMatches = sitemap.match(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/g);
      expect(lastmodMatches).toBeTruthy();
      expect(lastmodMatches!.length).toBeGreaterThan(0);
    });

    it("should use proper indentation", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain("  <url>");
      expect(sitemap).toContain("    <loc>");
    });

    it("should close all XML tags properly", () => {
      const sitemap = generateSitemap();

      const openTags = (sitemap.match(/<url>/g) || []).length;
      const closeTags = (sitemap.match(/<\/url>/g) || []).length;
      expect(openTags).toBe(closeTags);

      expect((sitemap.match(/<loc>/g) || []).length).toBe(
        (sitemap.match(/<\/loc>/g) || []).length
      );
    });

    it("should generate valid sitemap that can be parsed", () => {
      const sitemap = generateSitemap();

      // Basic XML validity check
      expect(sitemap.trim().startsWith("<?xml")).toBe(true);
      expect(sitemap.trim().endsWith("</urlset>")).toBe(true);
    });

    it("should include namespace declaration", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    });

    it("should format priority with one decimal place", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain("<priority>1.0</priority>");
      expect(sitemap).toContain("<priority>0.8</priority>");
      expect(sitemap).not.toContain("<priority>1</priority>");
      expect(sitemap).not.toContain("<priority>0.80</priority>");
    });
  });

  describe("generateRobotsTxt", () => {
    it("should allow all user agents", () => {
      const robots = generateRobotsTxt();

      expect(robots).toContain("User-agent: *");
    });

    it("should allow all paths", () => {
      const robots = generateRobotsTxt();

      expect(robots).toContain("Allow: /");
    });

    it("should include sitemap URL", () => {
      const robots = generateRobotsTxt();

      expect(robots).toContain("Sitemap: https://shahidster.tech/sitemap.xml");
    });

    it("should have proper line breaks", () => {
      const robots = generateRobotsTxt();

      expect(robots).toContain("\n");
      const lines = robots.split("\n");
      expect(lines.length).toBeGreaterThanOrEqual(3);
    });

    it("should have User-agent on first line", () => {
      const robots = generateRobotsTxt();

      const lines = robots.trim().split("\n");
      expect(lines[0]).toBe("User-agent: *");
    });

    it("should have Allow on second line", () => {
      const robots = generateRobotsTxt();

      const lines = robots.trim().split("\n");
      expect(lines[1]).toBe("Allow: /");
    });

    it("should have blank line before Sitemap", () => {
      const robots = generateRobotsTxt();

      expect(robots).toContain("Allow: /\n\nSitemap:");
    });

    it("should be plain text format", () => {
      const robots = generateRobotsTxt();

      expect(robots).not.toContain("<");
      expect(robots).not.toContain(">");
      expect(robots).not.toContain("<?xml");
    });

    it("should use correct capitalization", () => {
      const robots = generateRobotsTxt();

      expect(robots).toContain("User-agent");
      expect(robots).not.toContain("user-agent: ");
      expect(robots).not.toContain("USER-AGENT");

      expect(robots).toContain("Allow");
      expect(robots).not.toContain("allow: ");

      expect(robots).toContain("Sitemap");
      // Note: sitemap appears in the URL https://shahidster.tech/sitemap.xml
      // So we check for lowercase sitemap with colon only
      expect(robots).not.toContain("sitemap:");
    });

    it("should end with newline", () => {
      const robots = generateRobotsTxt();

      expect(robots.endsWith("\n")).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle empty special characters in escapeXml", () => {
      const sitemap = generateSitemap();

      // Should not have any unescaped special characters in loc elements
      const locElements = sitemap.match(/<loc>([^<]+)<\/loc>/g);
      locElements?.forEach((loc) => {
        const content = loc.replace(/<\/?loc>/g, "");
        // Should not have raw & < > " ' unless escaped
        expect(content).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/);
      });
    });

    it("should maintain consistent XML structure", () => {
      const sitemap = generateSitemap();

      // Every url element should have a loc element
      const urlCount = (sitemap.match(/<url>/g) || []).length;
      const locCount = (sitemap.match(/<loc>/g) || []).length;
      expect(urlCount).toBe(locCount);
    });

    it("should generate sitemap with consistent date format", () => {
      const sitemap = generateSitemap();

      const dates = sitemap.match(/\d{4}-\d{2}-\d{2}/g);
      dates?.forEach((date) => {
        const [year, month, day] = date.split("-").map(Number);
        expect(year).toBeGreaterThan(2000);
        expect(year).toBeLessThan(3000);
        expect(month).toBeGreaterThanOrEqual(1);
        expect(month).toBeLessThanOrEqual(12);
        expect(day).toBeGreaterThanOrEqual(1);
        expect(day).toBeLessThanOrEqual(31);
      });
    });

    it("should not include undefined or null in output", () => {
      const sitemap = generateSitemap();

      expect(sitemap).not.toContain("undefined");
      expect(sitemap).not.toContain("null");
    });

    it("should not include undefined or null in robots.txt", () => {
      const robots = generateRobotsTxt();

      expect(robots).not.toContain("undefined");
      expect(robots).not.toContain("null");
    });
  });
});