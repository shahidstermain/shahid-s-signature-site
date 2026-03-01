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

      expect(sitemap).toContain("<url>");
      expect(sitemap).toContain("<loc>https://shahidster.tech</loc>");
    });

    it("should include homepage metadata", () => {
      const sitemap = generateSitemap();

      // Homepage should have priority 1.0 and changefreq weekly
      const homepageSection = sitemap.substring(
        sitemap.indexOf("<loc>https://shahidster.tech</loc>"),
        sitemap.indexOf("</url>", sitemap.indexOf("<loc>https://shahidster.tech</loc>"))
      );

      expect(homepageSection).toContain("<lastmod>");
      expect(homepageSection).toContain("<changefreq>weekly</changefreq>");
      expect(homepageSection).toContain("<priority>1.0</priority>");
    });

    it("should include blog post URLs", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain("https://shahidster.tech/blog/");
      expect(sitemap).toContain("cap-theorem-production");
    });

    it("should include all articles", () => {
      const sitemap = generateSitemap();

      // There are 9 articles in the test data
      const urlMatches = sitemap.match(/<url>/g);
      expect(urlMatches).toBeTruthy();
      // 1 homepage + 9 articles = 10 URLs
      expect(urlMatches!.length).toBe(10);
    });

    it("should set correct priority for blog posts", () => {
      const sitemap = generateSitemap();

      // Find a blog post section
      const blogPostStart = sitemap.indexOf("https://shahidster.tech/blog/");
      const blogPostSection = sitemap.substring(
        blogPostStart,
        sitemap.indexOf("</url>", blogPostStart)
      );

      expect(blogPostSection).toContain("<priority>0.8</priority>");
    });

    it("should set correct changefreq for blog posts", () => {
      const sitemap = generateSitemap();

      // Find a blog post section
      const blogPostStart = sitemap.indexOf("https://shahidster.tech/blog/");
      const blogPostSection = sitemap.substring(
        blogPostStart,
        sitemap.indexOf("</url>", blogPostStart)
      );

      expect(blogPostSection).toContain("<changefreq>monthly</changefreq>");
    });

    it("should format lastmod as YYYY-MM-DD", () => {
      const sitemap = generateSitemap();

      const lastmodMatches = sitemap.match(/<lastmod>([^<]+)<\/lastmod>/g);
      expect(lastmodMatches).toBeTruthy();

      lastmodMatches!.forEach((match) => {
        const date = match.replace(/<\/?lastmod>/g, "");
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it("should escape XML special characters in URLs", () => {
      const sitemap = generateSitemap();

      // Should not contain unescaped ampersands in URLs
      const locMatches = sitemap.match(/<loc>[^<]+<\/loc>/g);
      expect(locMatches).toBeTruthy();

      locMatches!.forEach((match) => {
        const url = match.replace(/<\/?loc>/g, "");
        if (url.includes("&")) {
          expect(url).toContain("&amp;");
        }
      });
    });

    it("should include proper URL elements", () => {
      const sitemap = generateSitemap();

      // Each URL should have required elements
      expect(sitemap).toContain("<loc>");
      expect(sitemap).toContain("<lastmod>");
      expect(sitemap).toContain("<changefreq>");
      expect(sitemap).toContain("<priority>");
    });

    it("should format priority as decimal with one digit", () => {
      const sitemap = generateSitemap();

      const priorityMatches = sitemap.match(/<priority>([^<]+)<\/priority>/g);
      expect(priorityMatches).toBeTruthy();

      priorityMatches!.forEach((match) => {
        const priority = match.replace(/<\/?priority>/g, "");
        expect(priority).toMatch(/^\d\.\d$/);
      });
    });

    it("should have valid structure for each URL entry", () => {
      const sitemap = generateSitemap();

      // Split by URL tags
      const urlSections = sitemap.split("<url>");

      urlSections.slice(1).forEach((section) => {
        expect(section).toContain("<loc>");
        expect(section).toContain("</url>");
      });
    });

    it("should include article slugs correctly", () => {
      const sitemap = generateSitemap();

      const expectedSlugs = [
        "cap-theorem-production",
        "pragmatic-consistency",
        "latency-tax-separated-compute-storage",
        "data-skew-distributed-joins",
        "non-blocking-ddl-myth",
        "defensive-ingestion-backpressure-htap",
        "query-optimization-petabyte-scale",
        "incident-response-database-engineers",
        "sharding-strategies-that-work",
      ];

      expectedSlugs.forEach((slug) => {
        expect(sitemap).toContain(`/blog/${slug}`);
      });
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

      const lines = robots.trim().split("\n");
      expect(lines[0]).toBe("User-agent: *");
      expect(lines[1]).toBe("Allow: /");
      expect(lines[2]).toBe("");
      expect(lines[3]).toBe("Sitemap: https://shahidster.tech/sitemap.xml");
    });

    it("should not contain disallow directives", () => {
      const robots = generateRobotsTxt();

      expect(robots).not.toContain("Disallow:");
    });

    it("should end with newline", () => {
      const robots = generateRobotsTxt();

      expect(robots.endsWith("\n")).toBe(true);
    });
  });

  describe("integration and edge cases", () => {
    it("should generate consistent output on multiple calls", () => {
      const sitemap1 = generateSitemap();
      const sitemap2 = generateSitemap();

      // Should have same structure (URLs and priorities)
      const urls1 = sitemap1.match(/<loc>[^<]+<\/loc>/g) || [];
      const urls2 = sitemap2.match(/<loc>[^<]+<\/loc>/g) || [];

      expect(urls1.length).toBe(urls2.length);
      urls1.forEach((url, index) => {
        expect(url).toBe(urls2[index]);
      });
    });

    it("should handle sitemap and robots.txt integration", () => {
      const sitemap = generateSitemap();
      const robots = generateRobotsTxt();

      // Robots.txt should reference the sitemap
      expect(robots).toContain("sitemap.xml");

      // Sitemap should be valid XML
      expect(sitemap).toContain('<?xml version="1.0"');
    });

    it("should not include duplicate URLs", () => {
      const sitemap = generateSitemap();

      const locMatches = sitemap.match(/<loc>([^<]+)<\/loc>/g) || [];
      const urls = locMatches.map((match) => match.replace(/<\/?loc>/g, ""));

      const uniqueUrls = new Set(urls);
      expect(uniqueUrls.size).toBe(urls.length);
    });

    it("should generate compact XML without excessive whitespace", () => {
      const sitemap = generateSitemap();

      // Should have reasonable size
      expect(sitemap.length).toBeLessThan(10000);

      // Should have proper indentation (2 spaces is fine)
      expect(sitemap).toContain("  <url>");
    });

    it("should handle article date formatting consistently", () => {
      const sitemap = generateSitemap();

      // Extract all lastmod dates
      const lastmodMatches = sitemap.match(/<lastmod>([^<]+)<\/lastmod>/g) || [];
      const dates = lastmodMatches.map((match) =>
        match.replace(/<\/?lastmod>/g, "")
      );

      // All dates should be valid
      dates.forEach((date) => {
        expect(new Date(date).toString()).not.toBe("Invalid Date");
      });
    });

    it("should properly close all XML tags", () => {
      const sitemap = generateSitemap();

      // Count opening and closing tags
      const urlOpen = (sitemap.match(/<url>/g) || []).length;
      const urlClose = (sitemap.match(/<\/url>/g) || []).length;

      expect(urlOpen).toBe(urlClose);

      const urlsetOpen = (sitemap.match(/<urlset[^>]*>/g) || []).length;
      const urlsetClose = (sitemap.match(/<\/urlset>/g) || []).length;

      expect(urlsetOpen).toBe(urlsetClose);
      expect(urlsetOpen).toBe(1);
    });

    it("should maintain priority ordering for homepage vs articles", () => {
      const sitemap = generateSitemap();

      // Extract priority values
      const priorities = [...sitemap.matchAll(/<priority>([^<]+)<\/priority>/g)].map(
        (m) => Number.parseFloat(m[1])
      );

      // First entry (homepage) should have highest priority
      expect(priorities[0]).toBe(1.0);

      // All article priorities should be lower
      priorities.slice(1).forEach((priority) => {
        expect(priority).toBeLessThan(1.0);
      });
    });

    it("should use consistent URL scheme across all entries", () => {
      const sitemap = generateSitemap();

      const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

      // All URLs should use https
      urls.forEach((url) => {
        expect(url).toMatch(/^https:\/\//);
      });
    });

    it("should handle robots.txt with proper line endings", () => {
      const robots = generateRobotsTxt();

      // Should have Unix line endings
      expect(robots).toContain("\n");

      // Should not have Windows line endings
      expect(robots).not.toContain("\r\n");
    });

    it("should generate valid sitemap XML parseable by XML parser", () => {
      const sitemap = generateSitemap();

      // Basic XML structure validation
      expect(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
      expect(sitemap).toContain("<urlset");
      expect(sitemap.endsWith("</urlset>")).toBe(true);
    });
  });
});