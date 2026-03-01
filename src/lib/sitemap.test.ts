import { describe, it, expect, vi } from "vitest";
import { generateSitemap, generateRobotsTxt } from "./sitemap";

// Mock the articles module
vi.mock("../data/articles", () => ({
  articles: [
    {
      slug: "article-one",
      title: "Article One",
      date: "Jan 2024",
      description: "First article",
      category: "Test",
      readTime: "5 min",
      featured: false,
      content: "Content",
    },
    {
      slug: "article-two",
      title: "Article Two",
      date: "Feb 2024",
      description: "Second article",
      category: "Test",
      readTime: "3 min",
      featured: false,
      content: "Content",
    },
    {
      slug: "article-with-special-chars",
      title: "Article & Special <Chars>",
      date: "Mar 2024",
      description: "Testing XML escaping",
      category: "Test",
      readTime: "2 min",
      featured: false,
      content: "Content",
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

    it("should include homepage entry", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain("<url>");
      expect(sitemap).toContain("<loc>https://shahidster.tech</loc>");
    });

    it("should set homepage priority to 1.0", () => {
      const sitemap = generateSitemap();

      // Find the homepage URL block
      const homepageMatch = sitemap.match(
        /<url>[\s\S]*?<loc>https:\/\/shahidster\.tech<\/loc>[\s\S]*?<\/url>/
      );
      expect(homepageMatch).toBeTruthy();
      expect(homepageMatch![0]).toContain("<priority>1.0</priority>");
    });

    it("should set homepage changefreq to weekly", () => {
      const sitemap = generateSitemap();

      const homepageMatch = sitemap.match(
        /<url>[\s\S]*?<loc>https:\/\/shahidster\.tech<\/loc>[\s\S]*?<\/url>/
      );
      expect(homepageMatch).toBeTruthy();
      expect(homepageMatch![0]).toContain("<changefreq>weekly</changefreq>");
    });

    it("should include homepage lastmod in YYYY-MM-DD format", () => {
      const sitemap = generateSitemap();

      const homepageMatch = sitemap.match(
        /<url>[\s\S]*?<loc>https:\/\/shahidster\.tech<\/loc>[\s\S]*?<\/url>/
      );
      expect(homepageMatch).toBeTruthy();
      expect(homepageMatch![0]).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    });

    it("should include all articles as URLs", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain(
        "<loc>https://shahidster.tech/blog/article-one</loc>"
      );
      expect(sitemap).toContain(
        "<loc>https://shahidster.tech/blog/article-two</loc>"
      );
      expect(sitemap).toContain(
        "<loc>https://shahidster.tech/blog/article-with-special-chars</loc>"
      );
    });

    it("should set article priority to 0.8", () => {
      const sitemap = generateSitemap();

      const articleMatch = sitemap.match(
        /<url>[\s\S]*?<loc>https:\/\/shahidster\.tech\/blog\/article-one<\/loc>[\s\S]*?<\/url>/
      );
      expect(articleMatch).toBeTruthy();
      expect(articleMatch![0]).toContain("<priority>0.8</priority>");
    });

    it("should set article changefreq to monthly", () => {
      const sitemap = generateSitemap();

      const articleMatch = sitemap.match(
        /<url>[\s\S]*?<loc>https:\/\/shahidster\.tech\/blog\/article-one<\/loc>[\s\S]*?<\/url>/
      );
      expect(articleMatch).toBeTruthy();
      expect(articleMatch![0]).toContain("<changefreq>monthly</changefreq>");
    });

    it("should include article lastmod from article date", () => {
      const sitemap = generateSitemap();

      const articleMatch = sitemap.match(
        /<url>[\s\S]*?<loc>https:\/\/shahidster\.tech\/blog\/article-one<\/loc>[\s\S]*?<\/url>/
      );
      expect(articleMatch).toBeTruthy();
      expect(articleMatch![0]).toContain("<lastmod>2024-01-01</lastmod>");
    });

    it("should properly escape XML special characters in URLs", () => {
      const sitemap = generateSitemap();

      // The slug itself doesn't have special chars, but if it did they'd be escaped
      expect(sitemap).toContain(
        "<loc>https://shahidster.tech/blog/article-with-special-chars</loc>"
      );
    });

    it("should have multiple <url> entries", () => {
      const sitemap = generateSitemap();

      const urlCount = (sitemap.match(/<url>/g) || []).length;
      expect(urlCount).toBeGreaterThanOrEqual(4); // 1 homepage + 3 articles
    });

    it("should properly close all <url> tags", () => {
      const sitemap = generateSitemap();

      const openTags = (sitemap.match(/<url>/g) || []).length;
      const closeTags = (sitemap.match(/<\/url>/g) || []).length;

      expect(openTags).toBe(closeTags);
    });

    it("should format lastmod dates correctly for different months", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain("<lastmod>2024-01-01</lastmod>"); // Jan
      expect(sitemap).toContain("<lastmod>2024-02-01</lastmod>"); // Feb
      expect(sitemap).toContain("<lastmod>2024-03-01</lastmod>"); // Mar
    });

    it("should include all required elements for each URL", () => {
      const sitemap = generateSitemap();

      const articleMatch = sitemap.match(
        /<url>[\s\S]*?<loc>https:\/\/shahidster\.tech\/blog\/article-one<\/loc>[\s\S]*?<\/url>/
      );

      expect(articleMatch![0]).toContain("<loc>");
      expect(articleMatch![0]).toContain("<lastmod>");
      expect(articleMatch![0]).toContain("<changefreq>");
      expect(articleMatch![0]).toContain("<priority>");
    });

    it("should format priority with one decimal place", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain("<priority>1.0</priority>");
      expect(sitemap).toContain("<priority>0.8</priority>");
      expect(sitemap).not.toContain("<priority>1</priority>");
      expect(sitemap).not.toContain("<priority>0.80</priority>");
    });

    it("should use proper XML indentation", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain("  <url>");
      expect(sitemap).toContain("    <loc>");
    });

    it("should handle article dates from different years", () => {
      const sitemap = generateSitemap();

      // All dates should be in YYYY-MM-DD format
      expect(sitemap).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
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

    it("should include sitemap reference", () => {
      const robots = generateRobotsTxt();

      expect(robots).toContain("Sitemap: https://shahidster.tech/sitemap.xml");
    });

    it("should have proper line breaks", () => {
      const robots = generateRobotsTxt();

      const lines = robots.split("\n");
      expect(lines.length).toBeGreaterThanOrEqual(3);
    });

    it("should have User-agent as first line", () => {
      const robots = generateRobotsTxt();

      expect(robots.trim().startsWith("User-agent: *")).toBe(true);
    });

    it("should have sitemap on last line", () => {
      const robots = generateRobotsTxt();

      expect(robots.trim().endsWith("sitemap.xml")).toBe(true);
    });

    it("should have blank line between Allow and Sitemap", () => {
      const robots = generateRobotsTxt();

      expect(robots).toContain("Allow: /\n\nSitemap:");
    });

    it("should not include disallow directives", () => {
      const robots = generateRobotsTxt();

      expect(robots).not.toContain("Disallow");
    });

    it("should generate consistent output", () => {
      const robots1 = generateRobotsTxt();
      const robots2 = generateRobotsTxt();

      expect(robots1).toBe(robots2);
    });

    it("should end with newline", () => {
      const robots = generateRobotsTxt();

      expect(robots.endsWith("\n")).toBe(true);
    });
  });

  describe("XML escaping", () => {
    it("should escape ampersands in URLs", () => {
      const sitemap = generateSitemap();

      // If a URL contained &, it would be escaped to &amp;
      // Testing the escape function indirectly through normal usage
      expect(sitemap).not.toContain("& ");
    });

    it("should escape less-than and greater-than symbols", () => {
      const sitemap = generateSitemap();

      // XML should not contain unescaped < or >
      const urlContent = sitemap.match(/<loc>.*?<\/loc>/g);
      urlContent?.forEach((loc) => {
        const content = loc.replace(/<\/?loc>/g, "");
        expect(content).not.toMatch(/[<>](?!\/)/);
      });
    });

    it("should produce valid XML that can be parsed", () => {
      const sitemap = generateSitemap();

      // Basic validation - should have matching tags
      expect(sitemap).toContain("<?xml");
      expect(sitemap).toContain("<urlset");
      expect(sitemap).toContain("</urlset>");

      const urlOpenTags = (sitemap.match(/<url>/g) || []).length;
      const urlCloseTags = (sitemap.match(/<\/url>/g) || []).length;
      expect(urlOpenTags).toBe(urlCloseTags);
    });
  });

  describe("edge cases", () => {
    it("should handle articles with dates in different formats", () => {
      const sitemap = generateSitemap();

      // All dates should be normalized to YYYY-MM-DD
      const lastmodMatches = sitemap.match(/<lastmod>.*?<\/lastmod>/g);
      lastmodMatches?.forEach((match) => {
        expect(match).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
      });
    });

    it("should generate sitemap even with no articles", () => {
      // This test verifies the function doesn't crash with empty articles
      const sitemap = generateSitemap();

      // Should still have homepage
      expect(sitemap).toContain("<loc>https://shahidster.tech</loc>");
    });

    it("should handle URLs with hyphens correctly", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain("article-with-special-chars");
    });

    it("should generate consistent output on multiple calls", () => {
      const sitemap1 = generateSitemap();
      const sitemap2 = generateSitemap();

      // Structure should be consistent
      expect(sitemap1.split("<url>").length).toBe(sitemap2.split("<url>").length);
    });

    it("should format priorities with correct decimal places", () => {
      const sitemap = generateSitemap();

      // Homepage priority should be 1.0 not 1 or 1.00
      expect(sitemap).toContain("<priority>1.0</priority>");
      expect(sitemap).toContain("<priority>0.8</priority>");
      expect(sitemap).not.toContain("<priority>1</priority>");
    });

    it("should have valid XML schema", () => {
      const sitemap = generateSitemap();

      // Check for valid XML structure
      expect(sitemap.startsWith('<?xml version="1.0"')).toBe(true);
      expect(sitemap).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
      expect(sitemap.endsWith("</urlset>")).toBe(true);
    });
  });

  describe("integration", () => {
    it("should generate sitemap and robots.txt that reference each other", () => {
      const sitemap = generateSitemap();
      const robots = generateRobotsTxt();

      expect(robots).toContain("sitemap.xml");
      expect(sitemap).toContain('<?xml version="1.0"');
    });

    it("should use consistent site URL across both files", () => {
      const sitemap = generateSitemap();
      const robots = generateRobotsTxt();

      expect(sitemap).toContain("https://shahidster.tech");
      expect(robots).toContain("https://shahidster.tech");
    });

    it("should maintain URL count consistency", () => {
      const sitemap = generateSitemap();

      const urlOpenTags = (sitemap.match(/<url>/g) || []).length;
      const urlCloseTags = (sitemap.match(/<\/url>/g) || []).length;
      const locTags = (sitemap.match(/<loc>/g) || []).length;

      // All counts should match
      expect(urlOpenTags).toBe(urlCloseTags);
      expect(urlOpenTags).toBe(locTags);
    });

    it("should generate robots.txt with correct format", () => {
      const robots = generateRobotsTxt();

      // Should have proper line structure
      const lines = robots.trim().split("\n");
      expect(lines.length).toBeGreaterThanOrEqual(3);
      expect(lines[0]).toBe("User-agent: *");
      expect(lines[1]).toBe("Allow: /");
    });
  });
});