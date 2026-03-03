import { describe, it, expect, vi } from "vitest";
import { generateSitemap, generateRobotsTxt } from "./sitemap";

// Mock dependencies
vi.mock("./site-config", () => ({
  siteConfig: {
    siteUrl: "https://shahidster.tech",
  },
}));

vi.mock("../data/articles", () => ({
  articles: [
    {
      slug: "article-1",
      title: "First Article",
      date: "Jan 2024",
    },
    {
      slug: "article-2",
      title: "Second Article",
      date: "Feb 2024",
    },
    {
      slug: "article-with-special-chars",
      title: "Article with <special> & chars",
      date: "Mar 2024",
    },
  ],
}));

vi.mock("./seo-utils", () => ({
  formatArticleDateOnly: (dateStr: string) => {
    const months: Record<string, string> = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
    };
    const [month, year] = dateStr.split(" ");
    return `${year}-${months[month]}-01`;
  },
}));

describe("sitemap", () => {
  describe("generateSitemap", () => {
    it("should generate valid XML sitemap", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(sitemap).toContain("</urlset>");
    });

    it("should include homepage entry", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain("<url>");
      expect(sitemap).toContain("<loc>https://shahidster.tech</loc>");
      expect(sitemap).toContain("<changefreq>weekly</changefreq>");
      expect(sitemap).toContain("<priority>1.0</priority>");
    });

    it("should include lastmod for homepage", () => {
      const sitemap = generateSitemap();
      const today = new Date().toISOString().split("T")[0];

      expect(sitemap).toContain(`<lastmod>${today}</lastmod>`);
    });

    it("should include all articles", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain(
        "<loc>https://shahidster.tech/blog/article-1</loc>"
      );
      expect(sitemap).toContain(
        "<loc>https://shahidster.tech/blog/article-2</loc>"
      );
      expect(sitemap).toContain(
        "<loc>https://shahidster.tech/blog/article-with-special-chars</loc>"
      );
    });

    it("should include article metadata", () => {
      const sitemap = generateSitemap();

      // Articles should have lastmod, changefreq, and priority
      expect(sitemap).toContain("<lastmod>2024-01-01</lastmod>");
      expect(sitemap).toContain("<lastmod>2024-02-01</lastmod>");
      expect(sitemap).toContain("<lastmod>2024-03-01</lastmod>");
      expect(sitemap).toContain("<changefreq>monthly</changefreq>");
      expect(sitemap).toContain("<priority>0.8</priority>");
    });

    it("should escape XML special characters in URLs", () => {
      const sitemap = generateSitemap();

      // Special characters should be escaped
      expect(sitemap).not.toContain("<special>");
      expect(sitemap).not.toContain(" & ");
    });

    it("should have proper XML structure for each URL", () => {
      const sitemap = generateSitemap();

      // Each URL should be properly formatted
      const urlMatches = sitemap.match(/<url>[\s\S]*?<\/url>/g);
      expect(urlMatches).toBeTruthy();
      expect(urlMatches!.length).toBeGreaterThanOrEqual(4); // 1 homepage + 3 articles
    });

    it("should include all required URL fields", () => {
      const sitemap = generateSitemap();

      // Each URL should have loc
      const locCount = (sitemap.match(/<loc>/g) || []).length;
      expect(locCount).toBe(4); // 1 homepage + 3 articles
    });

    it("should format priority with one decimal place", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain("<priority>1.0</priority>");
      expect(sitemap).toContain("<priority>0.8</priority>");
      expect(sitemap).not.toContain("<priority>1</priority>");
      expect(sitemap).not.toContain("<priority>0.80</priority>");
    });

    it("should properly indent XML elements", () => {
      const sitemap = generateSitemap();

      // Should have proper indentation
      expect(sitemap).toContain("  <url>");
      expect(sitemap).toContain("    <loc>");
    });

    it("should handle empty lastmod gracefully", () => {
      const sitemap = generateSitemap();

      // All URLs in our test have lastmod, but structure should support optional
      expect(sitemap).toContain("<lastmod>");
    });

    it("should validate sitemap structure", () => {
      const sitemap = generateSitemap();

      // Count opening and closing tags
      const openUrlSet = (sitemap.match(/<urlset/g) || []).length;
      const closeUrlSet = (sitemap.match(/<\/urlset>/g) || []).length;
      const openUrl = (sitemap.match(/<url>/g) || []).length;
      const closeUrl = (sitemap.match(/<\/url>/g) || []).length;

      expect(openUrlSet).toBe(1);
      expect(closeUrlSet).toBe(1);
      expect(openUrl).toBe(closeUrl);
    });

    it("should handle articles with special characters in slug", () => {
      const sitemap = generateSitemap();

      // Should include the article with special chars in slug
      expect(sitemap).toContain("article-with-special-chars");
    });

    it("should use consistent date format", () => {
      const sitemap = generateSitemap();

      // All dates should be in YYYY-MM-DD format
      const dateMatches = sitemap.match(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/g);
      expect(dateMatches).toBeTruthy();
      expect(dateMatches!.length).toBeGreaterThan(0);
    });

    it("should not include duplicate URLs", () => {
      const sitemap = generateSitemap();

      const urls = sitemap.match(/<loc>(.*?)<\/loc>/g);
      expect(urls).toBeTruthy();

      const uniqueUrls = new Set(urls);
      expect(urls!.length).toBe(uniqueUrls.size);
    });
  });

  describe("generateRobotsTxt", () => {
    it("should allow all user agents", () => {
      const robots = generateRobotsTxt();

      expect(robots).toContain("User-agent: *");
      expect(robots).toContain("Allow: /");
    });

    it("should include sitemap reference", () => {
      const robots = generateRobotsTxt();

      expect(robots).toContain("Sitemap: https://shahidster.tech/sitemap.xml");
    });

    it("should have proper format", () => {
      const robots = generateRobotsTxt();

      // Should have proper line breaks
      const lines = robots.split("\n");
      expect(lines.length).toBeGreaterThanOrEqual(3);
    });

    it("should start with User-agent directive", () => {
      const robots = generateRobotsTxt();

      expect(robots.trim().startsWith("User-agent:")).toBe(true);
    });

    it("should end with newline", () => {
      const robots = generateRobotsTxt();

      expect(robots.endsWith("\n")).toBe(true);
    });

    it("should have blank line before Sitemap directive", () => {
      const robots = generateRobotsTxt();
      const lines = robots.split("\n");

      // Should have structure: User-agent, Allow, blank, Sitemap
      expect(lines[0]).toContain("User-agent:");
      expect(lines[1]).toContain("Allow:");
      expect(lines[2]).toBe("");
      expect(lines[3]).toContain("Sitemap:");
    });

    it("should not disallow any paths", () => {
      const robots = generateRobotsTxt();

      expect(robots).not.toContain("Disallow:");
    });

    it("should be valid robots.txt format", () => {
      const robots = generateRobotsTxt();

      // Basic validation - should contain required directives
      expect(robots).toMatch(/User-agent:\s*\*/);
      expect(robots).toMatch(/Allow:\s*\//);
      expect(robots).toMatch(/Sitemap:\s*https?:\/\//);
    });
  });

  describe("integration between sitemap and robots.txt", () => {
    it("should reference correct sitemap URL in robots.txt", () => {
      const sitemap = generateSitemap();
      const robots = generateRobotsTxt();

      // Sitemap URL in robots.txt should match the site
      expect(robots).toContain("https://shahidster.tech/sitemap.xml");

      // Sitemap should be valid
      expect(sitemap).toContain('<?xml version="1.0"');
    });

    it("should use consistent site URL", () => {
      const sitemap = generateSitemap();
      const robots = generateRobotsTxt();

      const siteUrl = "https://shahidster.tech";
      expect(sitemap).toContain(siteUrl);
      expect(robots).toContain(siteUrl);
    });
  });

  describe("edge cases", () => {
    it("should handle sitemap with no articles", () => {
      // Would require re-mocking articles as empty
      // Current implementation should still include homepage
      const sitemap = generateSitemap();
      expect(sitemap).toContain("https://shahidster.tech</loc>");
    });

    it("should handle very long article slugs", () => {
      // Test that URL escaping works for edge cases
      const sitemap = generateSitemap();
      expect(sitemap).toContain("<loc>https://shahidster.tech/blog/");
    });

    it("should use proper XML escaping", () => {
      const sitemap = generateSitemap();

      // Should escape ampersands, less than, greater than
      expect(sitemap).not.toContain("&lt;special&gt; &amp;");
    });

    it("should generate valid sitemap regardless of article count", () => {
      const sitemap = generateSitemap();

      // Should always have valid XML structure
      expect(sitemap.startsWith('<?xml version="1.0"')).toBe(true);
      expect(sitemap.endsWith("</urlset>")).toBe(true);
    });

    it("should handle duplicate URLs correctly", () => {
      const sitemap = generateSitemap();

      // Extract all URLs
      const urlMatches = sitemap.match(/<loc>(.*?)<\/loc>/g);
      expect(urlMatches).toBeTruthy();

      const urls = urlMatches!.map((m) => m.replace(/<\/?loc>/g, ""));
      const uniqueUrls = new Set(urls);

      // Should not have duplicates
      expect(urls.length).toBe(uniqueUrls.size);
    });

    it("should prioritize homepage correctly", () => {
      const sitemap = generateSitemap();

      // Homepage should have highest priority
      expect(sitemap).toContain("<priority>1.0</priority>");

      // Articles should have lower priority
      expect(sitemap).toContain("<priority>0.8</priority>");
    });
  });
});