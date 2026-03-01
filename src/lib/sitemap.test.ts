import { describe, it, expect } from "vitest";
import { generateSitemap, generateRobotsTxt } from "./sitemap";

describe("sitemap", () => {
  describe("generateSitemap", () => {
    it("should generate valid XML sitemap", () => {
      const sitemap = generateSitemap();

      // Check XML declaration
      expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');

      // Check urlset namespace
      expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(sitemap).toContain('</urlset>');
    });

    it("should include homepage URL", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain('<loc>https://shahidster.tech</loc>');
    });

    it("should set homepage priority to 1.0", () => {
      const sitemap = generateSitemap();

      // Extract homepage entry
      const homepageMatch = sitemap.match(
        /<url>\s*<loc>https:\/\/shahidster\.tech<\/loc>[\s\S]*?<\/url>/
      );

      expect(homepageMatch).toBeTruthy();
      expect(homepageMatch![0]).toContain('<priority>1.0</priority>');
    });

    it("should set homepage changefreq to weekly", () => {
      const sitemap = generateSitemap();

      const homepageMatch = sitemap.match(
        /<url>\s*<loc>https:\/\/shahidster\.tech<\/loc>[\s\S]*?<\/url>/
      );

      expect(homepageMatch![0]).toContain('<changefreq>weekly</changefreq>');
    });

    it("should include blog post URLs", () => {
      const sitemap = generateSitemap();

      // Should have multiple URL entries
      const urlCount = (sitemap.match(/<url>/g) || []).length;
      expect(urlCount).toBeGreaterThan(1); // Homepage + articles

      // Check for blog URLs
      expect(sitemap).toContain('/blog/');
    });

    it("should set blog post priority to 0.8", () => {
      const sitemap = generateSitemap();

      // Extract a blog post entry
      const blogMatch = sitemap.match(
        /<url>\s*<loc>https:\/\/shahidster\.tech\/blog\/[^<]+<\/loc>[\s\S]*?<\/url>/
      );

      expect(blogMatch).toBeTruthy();
      expect(blogMatch![0]).toContain('<priority>0.8</priority>');
    });

    it("should set blog post changefreq to monthly", () => {
      const sitemap = generateSitemap();

      const blogMatch = sitemap.match(
        /<url>\s*<loc>https:\/\/shahidster\.tech\/blog\/[^<]+<\/loc>[\s\S]*?<\/url>/
      );

      expect(blogMatch![0]).toContain('<changefreq>monthly</changefreq>');
    });

    it("should include lastmod dates", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain('<lastmod>');
      expect(sitemap).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    });

    it("should format lastmod as YYYY-MM-DD", () => {
      const sitemap = generateSitemap();

      const lastmodMatches = sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g);
      const dates = Array.from(lastmodMatches).map(m => m[1]);

      dates.forEach(date => {
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it("should escape XML special characters in URLs", () => {
      const sitemap = generateSitemap();

      // Should not contain unescaped ampersands
      expect(sitemap).not.toMatch(/<loc>[^<]*&[^a][^m][^p]/);
    });

    it("should include all expected URL elements", () => {
      const sitemap = generateSitemap();

      // Each URL should have these elements
      expect(sitemap).toContain('<loc>');
      expect(sitemap).toContain('<lastmod>');
      expect(sitemap).toContain('<changefreq>');
      expect(sitemap).toContain('<priority>');
    });

    it("should have well-formed XML structure", () => {
      const sitemap = generateSitemap();

      // Count opening and closing tags
      const openUrlCount = (sitemap.match(/<url>/g) || []).length;
      const closeUrlCount = (sitemap.match(/<\/url>/g) || []).length;

      expect(openUrlCount).toBe(closeUrlCount);
      expect(openUrlCount).toBeGreaterThan(0);
    });

    it("should use consistent indentation", () => {
      const sitemap = generateSitemap();

      // URL entries should have consistent structure
      expect(sitemap).toContain('  <url>');
      expect(sitemap).toContain('    <loc>');
    });
  });

  describe("generateRobotsTxt", () => {
    it("should allow all user agents", () => {
      const robots = generateRobotsTxt();

      expect(robots).toContain("User-agent: *");
      expect(robots).toContain("Allow: /");
    });

    it("should include sitemap location", () => {
      const robots = generateRobotsTxt();

      expect(robots).toContain("Sitemap: https://shahidster.tech/sitemap.xml");
    });

    it("should have proper line breaks", () => {
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

    it("should not contain any disallow rules", () => {
      const robots = generateRobotsTxt();

      expect(robots).not.toContain("Disallow:");
    });

    it("should be plain text format", () => {
      const robots = generateRobotsTxt();

      // Should not contain HTML or XML
      expect(robots).not.toContain("<");
      expect(robots).not.toContain(">");
    });
  });
});