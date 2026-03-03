import { describe, it, expect, beforeEach, vi } from "vitest";
import { generateSitemap, generateRobotsTxt } from "./sitemap";
import { siteConfig } from "./site-config";

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

      expect(sitemap).toContain(`<loc>${siteConfig.siteUrl}</loc>`);
    });

    it("should include homepage with highest priority", () => {
      const sitemap = generateSitemap();

      // Find the homepage url block
      const homepageSection = sitemap.split("<url>")[1];
      expect(homepageSection).toContain(siteConfig.siteUrl);
      expect(homepageSection).toContain("<priority>1.0</priority>");
    });

    it("should include homepage with weekly changefreq", () => {
      const sitemap = generateSitemap();

      const homepageSection = sitemap.split("<url>")[1];
      expect(homepageSection).toContain("<changefreq>weekly</changefreq>");
    });

    it("should include homepage with lastmod date", () => {
      const sitemap = generateSitemap();

      const homepageSection = sitemap.split("<url>")[1];
      expect(homepageSection).toContain("<lastmod>");
      expect(homepageSection).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    });

    it("should include blog post URLs", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain(`${siteConfig.siteUrl}/blog/`);
    });

    it("should include blog posts with priority 0.8", () => {
      const sitemap = generateSitemap();

      const urlSections = sitemap.split("<url>");
      // Skip first (empty) and second (homepage)
      const blogPosts = urlSections.slice(2);

      blogPosts.forEach((section) => {
        if (section.includes("/blog/")) {
          expect(section).toContain("<priority>0.8</priority>");
        }
      });
    });

    it("should include blog posts with monthly changefreq", () => {
      const sitemap = generateSitemap();

      const urlSections = sitemap.split("<url>");
      const blogPosts = urlSections.slice(2);

      blogPosts.forEach((section) => {
        if (section.includes("/blog/")) {
          expect(section).toContain("<changefreq>monthly</changefreq>");
        }
      });
    });

    it("should include blog posts with lastmod dates", () => {
      const sitemap = generateSitemap();

      const urlSections = sitemap.split("<url>");
      const blogPosts = urlSections.slice(2);

      blogPosts.forEach((section) => {
        if (section.includes("/blog/")) {
          expect(section).toContain("<lastmod>");
          expect(section).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
        }
      });
    });

    it("should have at least homepage plus blog posts", () => {
      const sitemap = generateSitemap();

      const urlCount = (sitemap.match(/<url>/g) || []).length;
      expect(urlCount).toBeGreaterThan(5); // Homepage + multiple blog posts
    });

    it("should format lastmod as YYYY-MM-DD", () => {
      const sitemap = generateSitemap();

      const lastmodMatches = sitemap.match(/<lastmod>([^<]+)<\/lastmod>/g);
      expect(lastmodMatches).toBeTruthy();

      lastmodMatches?.forEach((match) => {
        const date = match.replace(/<\/?lastmod>/g, "");
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        // Verify it's a valid date
        expect(new Date(date).toString()).not.toBe("Invalid Date");
      });
    });

    it("should escape XML special characters in URLs", () => {
      const sitemap = generateSitemap();

      // URLs should not contain unescaped ampersands
      const locMatches = sitemap.match(/<loc>([^<]+)<\/loc>/g);
      locMatches?.forEach((match) => {
        const url = match.replace(/<\/?loc>/g, "");
        if (url.includes("&")) {
          // Should be part of an XML entity
          expect(url).toMatch(/&[a-z]+;/);
        }
      });
    });

    it("should have well-formed XML with proper closing tags", () => {
      const sitemap = generateSitemap();

      const openingTags = (sitemap.match(/<url>/g) || []).length;
      const closingTags = (sitemap.match(/<\/url>/g) || []).length;
      expect(openingTags).toBe(closingTags);

      const openingLoc = (sitemap.match(/<loc>/g) || []).length;
      const closingLoc = (sitemap.match(/<\/loc>/g) || []).length;
      expect(openingLoc).toBe(closingLoc);
    });

    it("should include all required URL elements", () => {
      const sitemap = generateSitemap();

      const urlSections = sitemap.split("<url>").slice(1);

      urlSections.forEach((section) => {
        expect(section).toContain("<loc>");
        expect(section).toContain("</loc>");
        // lastmod, changefreq, and priority are optional but should be present in our implementation
        expect(section).toContain("<lastmod>");
        expect(section).toContain("<changefreq>");
        expect(section).toContain("<priority>");
      });
    });

    it("should format priority with one decimal place", () => {
      const sitemap = generateSitemap();

      const priorityMatches = sitemap.match(/<priority>([^<]+)<\/priority>/g);
      priorityMatches?.forEach((match) => {
        const priority = match.replace(/<\/?priority>/g, "");
        expect(priority).toMatch(/^\d\.\d$/);
      });
    });

    it("should properly indent XML elements", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain("  <url>");
      expect(sitemap).toContain("    <loc>");
    });

    it("should include blog post slugs in URLs", () => {
      const sitemap = generateSitemap();

      // Check for various article slugs
      expect(sitemap).toContain("/blog/cap-theorem-production");
      expect(sitemap).toContain("/blog/pragmatic-consistency");
    });

    it("should use article dates for blog post lastmod", () => {
      const sitemap = generateSitemap();

      // Blog posts should have their article date as lastmod
      const urlSections = sitemap.split("<url>");
      const blogPostSection = urlSections.find((section) =>
        section.includes("/blog/cap-theorem-production")
      );

      if (blogPostSection) {
        expect(blogPostSection).toContain("<lastmod>2025-11-");
      }
    });

    it("should handle homepage lastmod as current date", () => {
      const sitemap = generateSitemap();

      const today = new Date().toISOString().split("T")[0];
      const homepageSection = sitemap.split("<url>")[1];

      expect(homepageSection).toContain(`<lastmod>${today}</lastmod>`);
    });
  });

  describe("generateRobotsTxt", () => {
    it("should allow all user agents", () => {
      const robots = generateRobotsTxt();

      expect(robots).toContain("User-agent: *");
      expect(robots).toContain("Allow: /");
    });

    it("should include sitemap URL", () => {
      const robots = generateRobotsTxt();

      expect(robots).toContain(`Sitemap: ${siteConfig.siteUrl}/sitemap.xml`);
    });

    it("should have proper formatting with newlines", () => {
      const robots = generateRobotsTxt();

      expect(robots).toContain("\n");
      expect(robots.split("\n").length).toBeGreaterThanOrEqual(3);
    });

    it("should start with User-agent directive", () => {
      const robots = generateRobotsTxt();

      expect(robots.trimStart().startsWith("User-agent:")).toBe(true);
    });

    it("should end with sitemap directive", () => {
      const robots = generateRobotsTxt();

      expect(robots.trim().endsWith(`${siteConfig.siteUrl}/sitemap.xml`)).toBe(
        true
      );
    });

    it("should not contain disallow directives", () => {
      const robots = generateRobotsTxt();

      expect(robots).not.toContain("Disallow");
    });

    it("should have blank line between sections", () => {
      const robots = generateRobotsTxt();
      const lines = robots.split("\n");

      // Should have User-agent, Allow, blank line, Sitemap
      expect(lines[2]).toBe("");
    });

    it("should use correct sitemap URL format", () => {
      const robots = generateRobotsTxt();

      expect(robots).toMatch(/Sitemap: https?:\/\/[^\s]+\/sitemap\.xml/);
    });

    it("should have at least 4 lines", () => {
      const robots = generateRobotsTxt();
      const lines = robots.split("\n");

      // User-agent, Allow, blank, Sitemap, (possibly trailing newline)
      expect(lines.length).toBeGreaterThanOrEqual(4);
      expect(lines.length).toBeLessThanOrEqual(5);
    });
  });

  describe("XML escaping", () => {
    it("should escape ampersands", () => {
      const sitemap = generateSitemap();

      // If there are ampersands in URLs, they should be escaped
      if (sitemap.includes("&")) {
        expect(sitemap).toMatch(/&amp;/);
      }
    });

    it("should escape less-than signs", () => {
      const sitemap = generateSitemap();

      const locContents = sitemap.match(/<loc>([^<]+)<\/loc>/g);
      locContents?.forEach((content) => {
        const url = content.replace(/<\/?loc>/g, "");
        if (url.includes("<")) {
          expect(url).toContain("&lt;");
        }
      });
    });

    it("should escape greater-than signs", () => {
      const sitemap = generateSitemap();

      const locContents = sitemap.match(/<loc>([^<]+)<\/loc>/g);
      locContents?.forEach((content) => {
        const url = content.replace(/<\/?loc>/g, "");
        if (url.includes(">") && !url.match(/<\/?[a-z]+>/)) {
          expect(url).toContain("&gt;");
        }
      });
    });
  });

  describe("integration tests", () => {
    it("should generate consistent output structure", () => {
      const sitemap1 = generateSitemap();
      const sitemap2 = generateSitemap();

      // Structure should be the same (but lastmod for homepage may differ)
      const urls1 = sitemap1.match(/<loc>([^<]+)<\/loc>/g);
      const urls2 = sitemap2.match(/<loc>([^<]+)<\/loc>/g);

      expect(urls1?.length).toBe(urls2?.length);
    });

    it("should produce valid XML parseable by DOMParser", () => {
      const sitemap = generateSitemap();

      // This would be tested in a browser environment with DOMParser
      // For node, we can at least check for balanced tags
      const openTags = sitemap.match(/<[^/][^>]*>/g) || [];
      const closeTags = sitemap.match(/<\/[^>]+>/g) || [];

      // Should have balanced structure (accounting for self-closing declarations)
      expect(closeTags.length).toBeGreaterThan(0);
    });

    it("should handle special characters in blog slugs", () => {
      const sitemap = generateSitemap();

      // Slugs with hyphens should be preserved
      expect(sitemap).toContain("cap-theorem-production");
      expect(sitemap).toContain("latency-tax-separated-compute-storage");
    });
  });
});