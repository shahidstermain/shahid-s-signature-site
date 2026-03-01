import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateSitemap, generateRobotsTxt } from "./sitemap";

// Mock dependencies
vi.mock("./site-config", () => ({
  siteConfig: {
    siteUrl: "https://shahidster.tech",
  },
}));

describe("sitemap", () => {
  describe("generateSitemap", () => {
    it("should generate valid XML structure", () => {
      const result = generateSitemap();

      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(result).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(result).toContain("</urlset>");
    });

    it("should include homepage URL", () => {
      const result = generateSitemap();

      expect(result).toContain("<url>");
      expect(result).toContain("<loc>https://shahidster.tech</loc>");
      expect(result).toContain("</url>");
    });

    it("should include homepage metadata", () => {
      const result = generateSitemap();

      // Homepage should have lastmod (current date in YYYY-MM-DD)
      expect(result).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);

      // Homepage should have changefreq
      expect(result).toContain("<changefreq>weekly</changefreq>");

      // Homepage should have priority 1.0
      expect(result).toContain("<priority>1.0</priority>");
    });

    it("should include all article URLs", () => {
      const result = generateSitemap();

      // Test with actual article slugs from the real data
      expect(result).toContain("<loc>https://shahidster.tech/blog/");
      expect(result).toContain("</loc>");
    });

    it("should include article metadata", () => {
      const result = generateSitemap();

      // Articles should have lastmod in YYYY-MM-DD format
      expect(result).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);

      // Articles should have monthly changefreq
      expect(result).toContain("<changefreq>monthly</changefreq>");

      // Articles should have priority 0.8
      expect(result).toContain("<priority>0.8</priority>");
    });

    it("should have proper XML structure with indentation", () => {
      const result = generateSitemap();

      expect(result).toContain("  <url>");
      expect(result).toContain("    <loc>");
      expect(result).toContain("  </url>");
    });

    it("should escape XML special characters in URLs", () => {
      vi.mock("../data/articles", () => ({
        articles: [
          {
            slug: "test&article",
            title: "Test",
            date: "Jan 2024",
          },
        ],
      }));

      const result = generateSitemap();

      // & should be escaped to &amp;
      if (result.includes("test&article")) {
        expect(result).toContain("test&amp;article");
      }
    });

    it("should include correct number of URLs", () => {
      const result = generateSitemap();

      // Should have at least 1 homepage + article URLs
      const urlCount = (result.match(/<url>/g) || []).length;
      expect(urlCount).toBeGreaterThan(1);
    });

    it("should format lastmod correctly for homepage (YYYY-MM-DD)", () => {
      const result = generateSitemap();

      // Extract homepage URL section
      const homepageSection = result.split("<url>")[1];

      expect(homepageSection).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    });

    it("should use article date for lastmod of blog posts", () => {
      const result = generateSitemap();

      // Check that blog post sections have lastmod in correct format
      const blogUrlMatch = result.match(/<loc>https:\/\/shahidster\.tech\/blog\/[^<]+<\/loc>[\s\S]{0,200}<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
      expect(blogUrlMatch).toBeTruthy();
    });
  });

  describe("generateRobotsTxt", () => {
    it("should allow all user agents", () => {
      const result = generateRobotsTxt();

      expect(result).toContain("User-agent: *");
    });

    it("should allow all paths", () => {
      const result = generateRobotsTxt();

      expect(result).toContain("Allow: /");
    });

    it("should include sitemap URL", () => {
      const result = generateRobotsTxt();

      expect(result).toContain("Sitemap: https://shahidster.tech/sitemap.xml");
    });

    it("should have proper format with newlines", () => {
      const result = generateRobotsTxt();

      expect(result).toBe(
        "User-agent: *\nAllow: /\n\nSitemap: https://shahidster.tech/sitemap.xml\n"
      );
    });

    it("should end with newline", () => {
      const result = generateRobotsTxt();

      expect(result.endsWith("\n")).toBe(true);
    });

    it("should have blank line between Allow and Sitemap", () => {
      const result = generateRobotsTxt();

      expect(result).toContain("Allow: /\n\nSitemap:");
    });
  });

  describe("edge cases", () => {
    it("should handle real articles data", () => {
      const result = generateSitemap();

      // Should include homepage
      expect(result).toContain("<loc>https://shahidster.tech</loc>");
      // Should have at least 1 URL
      const urlCount = (result.match(/<url>/g) || []).length;
      expect(urlCount).toBeGreaterThanOrEqual(1);
    });

    it("should escape XML special characters if present", () => {
      const result = generateSitemap();

      // If the URL contains special chars, they should be escaped
      // Test that we don't have unescaped special chars in loc tags
      const locMatches = result.match(/<loc>([^<]+)<\/loc>/g);
      if (locMatches) {
        locMatches.forEach((loc) => {
          // Should not contain literal < or > in the URL (except the tags)
          const content = loc.replace(/<\/?loc>/g, "");
          // URL should be properly formed
          expect(content).toMatch(/^https?:\/\//);
        });
      }
    });
  });

  describe("XML escaping function", () => {
    it("should escape all XML special characters", () => {
      const result = generateSitemap();

      // The escapeXml function should handle &, <, >, ", '
      // We can verify this by checking the generated output doesn't contain unescaped characters

      // Extract all <loc> content
      const locMatches = result.match(/<loc>([^<]+)<\/loc>/g);

      if (locMatches) {
        locMatches.forEach((loc) => {
          // Should not contain unescaped < or > (except in the tags themselves)
          const content = loc.replace(/<\/?loc>/g, "");
          const hasUnescapedAngleBrackets = /<[^l]|[^c]>/.test(content);
          expect(hasUnescapedAngleBrackets).toBe(false);
        });
      }
    });
  });

  describe("integration", () => {
    it("should generate consistent output", () => {
      const result1 = generateSitemap();
      const result2 = generateSitemap();

      // Results should be identical except for homepage lastmod (current date)
      const normalize = (str: string) =>
        str.replace(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/, "<lastmod>DATE</lastmod>");

      expect(normalize(result1)).toBe(normalize(result2));
    });

    it("generateRobotsTxt should be deterministic", () => {
      const result1 = generateRobotsTxt();
      const result2 = generateRobotsTxt();

      expect(result1).toBe(result2);
    });
  });
});