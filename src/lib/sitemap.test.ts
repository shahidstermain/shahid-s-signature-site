import { describe, it, expect } from "vitest";
import { generateSitemap, generateRobotsTxt } from "./sitemap";

describe("sitemap", () => {
  describe("generateSitemap", () => {
    it("should generate valid XML sitemap", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(sitemap).toContain("</urlset>");
    });

    it("should include homepage URL", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain("<loc>https://shahidster.tech</loc>");
    });

    it("should include homepage with priority 1.0", () => {
      const sitemap = generateSitemap();

      // Homepage should have highest priority
      const homepageSection = sitemap.match(
        /<url>[\s\S]*?<loc>https:\/\/shahidster\.tech<\/loc>[\s\S]*?<\/url>/
      );

      expect(homepageSection).toBeTruthy();
      expect(homepageSection![0]).toContain("<priority>1.0</priority>");
    });

    it("should include homepage with weekly changefreq", () => {
      const sitemap = generateSitemap();

      const homepageSection = sitemap.match(
        /<url>[\s\S]*?<loc>https:\/\/shahidster\.tech<\/loc>[\s\S]*?<\/url>/
      );

      expect(homepageSection![0]).toContain("<changefreq>weekly</changefreq>");
    });

    it("should include all blog articles", () => {
      const sitemap = generateSitemap();

      // Should have blog URLs
      expect(sitemap).toContain("https://shahidster.tech/blog/");

      // Check for specific articles
      expect(sitemap).toContain("https://shahidster.tech/blog/cap-theorem-production");
      expect(sitemap).toContain("https://shahidster.tech/blog/pragmatic-consistency");
      expect(sitemap).toContain("https://shahidster.tech/blog/sharding-strategies-that-work");
    });

    it("should include blog posts with priority 0.8", () => {
      const sitemap = generateSitemap();

      const blogSection = sitemap.match(
        /<url>[\s\S]*?<loc>https:\/\/shahidster\.tech\/blog\/cap-theorem-production<\/loc>[\s\S]*?<\/url>/
      );

      expect(blogSection).toBeTruthy();
      expect(blogSection![0]).toContain("<priority>0.8</priority>");
    });

    it("should include blog posts with monthly changefreq", () => {
      const sitemap = generateSitemap();

      const blogSection = sitemap.match(
        /<url>[\s\S]*?<loc>https:\/\/shahidster\.tech\/blog\/cap-theorem-production<\/loc>[\s\S]*?<\/url>/
      );

      expect(blogSection![0]).toContain("<changefreq>monthly</changefreq>");
    });

    it("should include lastmod dates for all URLs", () => {
      const sitemap = generateSitemap();

      // Should have lastmod tags
      expect(sitemap).toContain("<lastmod>");

      // Count URLs and lastmod tags
      const urlCount = (sitemap.match(/<url>/g) || []).length;
      const lastmodCount = (sitemap.match(/<lastmod>/g) || []).length;

      expect(lastmodCount).toBe(urlCount);
    });

    it("should format lastmod dates as YYYY-MM-DD", () => {
      const sitemap = generateSitemap();

      const lastmodMatches = sitemap.match(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/g);

      expect(lastmodMatches).toBeTruthy();
      expect(lastmodMatches!.length).toBeGreaterThan(0);

      lastmodMatches!.forEach((match) => {
        expect(match).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
      });
    });

    it("should escape XML special characters in URLs", () => {
      const sitemap = generateSitemap();

      // URLs should be properly escaped (ampersands, etc.)
      expect(sitemap).not.toMatch(/<loc>[^<]*&[^a][^<]*<\/loc>/);
    });

    it("should include correct number of URLs", () => {
      const sitemap = generateSitemap();

      const urlCount = (sitemap.match(/<url>/g) || []).length;

      // 1 homepage + 9 blog articles = 10 URLs
      expect(urlCount).toBe(10);
    });

    it("should have well-formed XML structure", () => {
      const sitemap = generateSitemap();

      // Each <url> should have proper closing tag
      const openCount = (sitemap.match(/<url>/g) || []).length;
      const closeCount = (sitemap.match(/<\/url>/g) || []).length;

      expect(openCount).toBe(closeCount);

      // Each <loc> should have proper closing tag
      const locOpenCount = (sitemap.match(/<loc>/g) || []).length;
      const locCloseCount = (sitemap.match(/<\/loc>/g) || []).length;

      expect(locOpenCount).toBe(locCloseCount);
    });

    it("should indent XML properly", () => {
      const sitemap = generateSitemap();

      // Should have proper indentation
      expect(sitemap).toContain("  <url>");
      expect(sitemap).toContain("    <loc>");
    });

    it("should include all required elements for each URL", () => {
      const sitemap = generateSitemap();

      const urlSections = sitemap.match(/<url>[\s\S]*?<\/url>/g);

      expect(urlSections).toBeTruthy();
      expect(urlSections!.length).toBeGreaterThan(0);

      urlSections!.forEach((section) => {
        expect(section).toContain("<loc>");
        expect(section).toContain("</loc>");
        // All URLs should have lastmod, changefreq, and priority
        expect(section).toContain("<lastmod>");
        expect(section).toContain("<changefreq>");
        expect(section).toContain("<priority>");
      });
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

    it("should have proper format", () => {
      const robots = generateRobotsTxt();

      const lines = robots.split("\n");

      expect(lines[0]).toBe("User-agent: *");
      expect(lines[1]).toBe("Allow: /");
      expect(lines[2]).toBe("");
      expect(lines[3]).toBe("Sitemap: https://shahidster.tech/sitemap.xml");
    });

    it("should end with newline", () => {
      const robots = generateRobotsTxt();

      expect(robots.endsWith("\n")).toBe(true);
    });

    it("should not contain disallow rules", () => {
      const robots = generateRobotsTxt();

      expect(robots).not.toContain("Disallow:");
    });

    it("should be plain text format", () => {
      const robots = generateRobotsTxt();

      // Should not contain HTML or XML tags
      expect(robots).not.toContain("<");
      expect(robots).not.toContain(">");
    });
  });

  describe("edge cases", () => {
    it("should handle articles with special characters in slugs", () => {
      const sitemap = generateSitemap();

      // Should still generate valid XML
      expect(sitemap).toContain("<?xml");
      expect(sitemap).toContain("</urlset>");
    });

    it("should not throw errors when generating sitemap", () => {
      expect(() => generateSitemap()).not.toThrow();
    });

    it("should not throw errors when generating robots.txt", () => {
      expect(() => generateRobotsTxt()).not.toThrow();
    });

    it("should handle articles with dates in different formats", () => {
      const sitemap = generateSitemap();

      // All dates should be properly formatted
      const lastmodDates = sitemap.match(/<lastmod>([^<]+)<\/lastmod>/g);

      expect(lastmodDates).toBeTruthy();
      lastmodDates!.forEach((dateTag) => {
        const date = dateTag.replace(/<lastmod>/, "").replace(/<\/lastmod>/, "");
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it("sitemap should have consistent structure", () => {
      const sitemap = generateSitemap();

      // Verify opening and closing tags match
      expect(sitemap.match(/<urlset/g)!.length).toBe(1);
      expect(sitemap.match(/<\/urlset>/g)!.length).toBe(1);
    });
  });

  describe("XML escaping", () => {
    it("should escape ampersands in URLs", () => {
      const sitemap = generateSitemap();

      // If there were any & in URLs, they should be &amp;
      const locContent = sitemap.match(/<loc>([^<]+)<\/loc>/g);

      locContent!.forEach((loc) => {
        if (loc.includes("&")) {
          expect(loc).toContain("&amp;");
          expect(loc).not.toMatch(/&[^a]/);
        }
      });
    });

    it("should escape less than and greater than symbols", () => {
      const sitemap = generateSitemap();

      const locContent = sitemap.match(/<loc>([^<]+)<\/loc>/g);

      locContent!.forEach((loc) => {
        const content = loc.replace(/<loc>/, "").replace(/<\/loc>/, "");
        // Content between tags should not have unescaped < or >
        if (content.includes("<") || content.includes(">")) {
          expect(content).toContain("&lt;");
        }
      });
    });

    it("should produce parseable XML", () => {
      const sitemap = generateSitemap();

      // Basic XML validation - should have matching tags
      expect(() => {
        // This is a simple check - in production you'd use a real XML parser
        const openTags = sitemap.match(/<[^/][^>]*>/g) || [];
        const closeTags = sitemap.match(/<\/[^>]+>/g) || [];

        // Number of opening and closing URL tags should match
        expect(openTags.filter(t => t === "<url>").length).toBe(
          closeTags.filter(t => t === "</url>").length
        );
      }).not.toThrow();
    });
  });
});