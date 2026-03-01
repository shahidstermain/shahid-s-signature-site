import { describe, it, expect, beforeEach, vi } from "vitest";
import { generateSitemap, generateRobotsTxt } from "../lib/sitemap";
import * as articlesModule from "../data/articles";

// Mock articles data for testing
const mockArticles = [
  {
    slug: "test-article-1",
    title: "Test Article 1",
    description: "Test description",
    category: "Testing",
    readTime: "5 min read",
    date: "Jan 2026",
    featured: true,
    content: "Test content",
  },
  {
    slug: "test-article-2",
    title: "Test Article 2",
    description: "Test description 2",
    category: "Development",
    readTime: "3 min read",
    date: "Dec 2025",
    featured: false,
    content: "Test content 2",
  },
];

describe("Sitemap Generation", () => {
  beforeEach(() => {
    // Mock the articles array
    vi.spyOn(articlesModule, "articles", "get").mockReturnValue(mockArticles as any);
  });

  describe("generateSitemap", () => {
    it("should generate valid XML sitemap", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(sitemap).toContain('</urlset>');
    });

    it("should include homepage URL", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain("<loc>https://shahidster.tech</loc>");
    });

    it("should include homepage with priority 1.0", () => {
      const sitemap = generateSitemap();

      // Check homepage entry has priority 1.0
      const homepageMatch = sitemap.match(
        /<url>[\s\S]*?<loc>https:\/\/shahidster\.tech<\/loc>[\s\S]*?<priority>1\.0<\/priority>[\s\S]*?<\/url>/
      );
      expect(homepageMatch).toBeTruthy();
    });

    it("should include homepage with weekly changefreq", () => {
      const sitemap = generateSitemap();

      const homepageMatch = sitemap.match(
        /<url>[\s\S]*?<loc>https:\/\/shahidster\.tech<\/loc>[\s\S]*?<changefreq>weekly<\/changefreq>[\s\S]*?<\/url>/
      );
      expect(homepageMatch).toBeTruthy();
    });

    it("should include lastmod for homepage", () => {
      const sitemap = generateSitemap();

      // Should have lastmod in YYYY-MM-DD format
      expect(sitemap).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    });

    it("should include all blog article URLs", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain("<loc>https://shahidster.tech/blog/test-article-1</loc>");
      expect(sitemap).toContain("<loc>https://shahidster.tech/blog/test-article-2</loc>");
    });

    it("should include blog posts with priority 0.8", () => {
      const sitemap = generateSitemap();

      const article1Match = sitemap.match(
        /<url>[\s\S]*?<loc>https:\/\/shahidster\.tech\/blog\/test-article-1<\/loc>[\s\S]*?<priority>0\.8<\/priority>[\s\S]*?<\/url>/
      );
      expect(article1Match).toBeTruthy();
    });

    it("should include blog posts with monthly changefreq", () => {
      const sitemap = generateSitemap();

      const article1Match = sitemap.match(
        /<url>[\s\S]*?<loc>https:\/\/shahidster\.tech\/blog\/test-article-1<\/loc>[\s\S]*?<changefreq>monthly<\/changefreq>[\s\S]*?<\/url>/
      );
      expect(article1Match).toBeTruthy();
    });

    it("should include lastmod for blog posts based on article date", () => {
      const sitemap = generateSitemap();

      // Jan 2026 should be 2026-01-01
      expect(sitemap).toContain("<lastmod>2026-01-01</lastmod>");
      // Dec 2025 should be 2025-12-01
      expect(sitemap).toContain("<lastmod>2025-12-01</lastmod>");
    });

    it("should escape XML special characters in URLs", () => {
      const articlesWithSpecialChars = [
        {
          ...mockArticles[0],
          slug: "test&article",
        },
      ];

      vi.spyOn(articlesModule, "articles", "get").mockReturnValue(articlesWithSpecialChars as any);

      const sitemap = generateSitemap();

      expect(sitemap).toContain("test&amp;article");
      expect(sitemap).not.toContain("test&article</loc>");
    });

    it("should have proper XML structure with nested url elements", () => {
      const sitemap = generateSitemap();

      // Count <url> opening tags
      const urlTags = sitemap.match(/<url>/g);
      // Should have 1 homepage + 2 articles = 3 urls
      expect(urlTags).toHaveLength(3);
    });

    it("should include all required URL elements", () => {
      const sitemap = generateSitemap();

      // Each URL should have loc, lastmod, changefreq, priority
      const urlMatches = sitemap.match(/<url>[\s\S]*?<\/url>/g);

      expect(urlMatches).toBeTruthy();
      urlMatches?.forEach((url) => {
        expect(url).toContain("<loc>");
        expect(url).toContain("<lastmod>");
        expect(url).toContain("<changefreq>");
        expect(url).toContain("<priority>");
      });
    });

    it("should format priority with one decimal place", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain("<priority>1.0</priority>");
      expect(sitemap).toContain("<priority>0.8</priority>");
    });

    it("should handle empty articles array", () => {
      vi.spyOn(articlesModule, "articles", "get").mockReturnValue([]);

      const sitemap = generateSitemap();

      // Should still have homepage
      expect(sitemap).toContain("<loc>https://shahidster.tech</loc>");
      // Should only have 1 url tag (homepage)
      const urlTags = sitemap.match(/<url>/g);
      expect(urlTags).toHaveLength(1);
    });

    it("should handle articles with special characters in slugs", () => {
      const articlesWithSpecialSlugs = [
        {
          ...mockArticles[0],
          slug: "test-<script>-article",
        },
      ];

      vi.spyOn(articlesModule, "articles", "get").mockReturnValue(articlesWithSpecialSlugs as any);

      const sitemap = generateSitemap();

      expect(sitemap).toContain("test-&lt;script&gt;-article");
    });

    it("should handle articles with quotes in slugs", () => {
      const articlesWithQuotes = [
        {
          ...mockArticles[0],
          slug: 'test-"quoted"-article',
        },
      ];

      vi.spyOn(articlesModule, "articles", "get").mockReturnValue(articlesWithQuotes as any);

      const sitemap = generateSitemap();

      expect(sitemap).toContain("test-&quot;quoted&quot;-article");
    });
  });

  describe("generateRobotsTxt", () => {
    it("should generate valid robots.txt content", () => {
      const robots = generateRobotsTxt();

      expect(robots).toBeTruthy();
      expect(typeof robots).toBe("string");
    });

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

    it("should have proper format with newlines", () => {
      const robots = generateRobotsTxt();

      // Should start with User-agent
      expect(robots.startsWith("User-agent: *")).toBe(true);
      // Should contain newlines for proper formatting
      expect(robots).toContain("\n");
    });

    it("should end with newline", () => {
      const robots = generateRobotsTxt();

      expect(robots.endsWith("\n")).toBe(true);
    });

    it("should have blank line after Allow", () => {
      const robots = generateRobotsTxt();

      expect(robots).toContain("Allow: /\n\nSitemap:");
    });

    it("should be concise and minimal", () => {
      const robots = generateRobotsTxt();

      // Should be short (less than 200 chars for this simple version)
      expect(robots.length).toBeLessThan(200);
    });

    it("should not contain any disallow rules", () => {
      const robots = generateRobotsTxt();

      expect(robots).not.toContain("Disallow:");
    });

    it("should match expected exact format", () => {
      const robots = generateRobotsTxt();

      const expectedFormat = `User-agent: *
Allow: /

Sitemap: https://shahidster.tech/sitemap.xml
`;

      expect(robots).toBe(expectedFormat);
    });
  });

  describe("Integration", () => {
    it("should generate sitemap and robots.txt that reference each other", () => {
      const sitemap = generateSitemap();
      const robots = generateRobotsTxt();

      // Robots.txt should reference the sitemap
      expect(robots).toContain("sitemap.xml");

      // Sitemap should exist and be valid XML
      expect(sitemap).toContain("<?xml version");
    });

    it("should use consistent base URL across both files", () => {
      const sitemap = generateSitemap();
      const robots = generateRobotsTxt();

      const baseUrl = "https://shahidster.tech";

      expect(sitemap).toContain(baseUrl);
      expect(robots).toContain(baseUrl);
    });
  });
});