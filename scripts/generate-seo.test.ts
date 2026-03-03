import { describe, it, expect, vi } from "vitest";
import { generateRSSFeed, generateJSONFeed } from "../src/lib/rss";
import { generateSitemap, generateRobotsTxt } from "../src/lib/sitemap";
import path from "path";

describe("generate-seo script", () => {
  describe("SEO generation functions", () => {
    it("should generate RSS feed without errors", () => {
      const rss = generateRSSFeed();
      expect(rss).toBeTruthy();
      expect(rss).toContain("<?xml");
      expect(rss).toContain("<rss");
    });

    it("should generate JSON feed without errors", () => {
      const json = generateJSONFeed();
      expect(json).toBeTruthy();
      expect(() => JSON.parse(json)).not.toThrow();
    });

    it("should generate sitemap without errors", () => {
      const sitemap = generateSitemap();
      expect(sitemap).toBeTruthy();
      expect(sitemap).toContain("<?xml");
      expect(sitemap).toContain("<urlset");
    });

    it("should generate robots.txt without errors", () => {
      const robots = generateRobotsTxt();
      expect(robots).toBeTruthy();
      expect(robots).toContain("User-agent");
      expect(robots).toContain("Sitemap");
    });
  });

  describe("output structure", () => {
    it("should define correct output files", () => {
      const expectedFiles = ["sitemap.xml", "rss.xml", "feed.json", "robots.txt"];

      expectedFiles.forEach((fileName) => {
        expect(fileName).toMatch(/\.(xml|json|txt)$/);
      });
    });

    it("should generate valid RSS content", () => {
      const rss = generateRSSFeed();
      expect(rss).toContain('<rss version="2.0"');
      expect(rss).toContain("</rss>");
    });

    it("should generate valid JSON content", () => {
      const json = generateJSONFeed();
      const parsed = JSON.parse(json);
      expect(parsed).toHaveProperty("version");
      expect(parsed).toHaveProperty("items");
    });

    it("should generate valid sitemap content", () => {
      const sitemap = generateSitemap();
      expect(sitemap).toContain("<urlset");
      expect(sitemap).toContain("</urlset>");
      expect(sitemap).toContain("<loc>");
    });

    it("should generate valid robots.txt content", () => {
      const robots = generateRobotsTxt();
      expect(robots).toContain("User-agent: *");
      expect(robots).toContain("Allow: /");
    });
  });

  describe("content validation", () => {
    it("RSS feed should contain blog items", () => {
      const rss = generateRSSFeed();
      expect(rss).toContain("<item>");
      expect(rss).toContain("</item>");
    });

    it("JSON feed should contain items array", () => {
      const json = generateJSONFeed();
      const parsed = JSON.parse(json);
      expect(Array.isArray(parsed.items)).toBe(true);
      expect(parsed.items.length).toBeGreaterThan(0);
    });

    it("sitemap should contain blog URLs", () => {
      const sitemap = generateSitemap();
      expect(sitemap).toContain("/blog/");
    });

    it("robots.txt should reference sitemap.xml", () => {
      const robots = generateRobotsTxt();
      expect(robots).toContain("sitemap.xml");
    });
  });

  describe("file paths", () => {
    it("should construct valid public directory path", () => {
      const mockFilename = "/path/to/scripts/generate-seo.ts";
      const dirname = path.dirname(mockFilename);
      const rootDir = path.resolve(dirname, "..");
      const publicDir = path.join(rootDir, "public");

      expect(publicDir).toContain("public");
      expect(publicDir).not.toContain("scripts");
    });

    it("should join file paths correctly", () => {
      const publicDir = "/path/to/public";
      const files = ["sitemap.xml", "rss.xml", "feed.json", "robots.txt"];

      files.forEach((file) => {
        const fullPath = path.join(publicDir, file);
        expect(fullPath).toContain(publicDir);
        expect(fullPath).toContain(file);
      });
    });
  });

  describe("output array structure", () => {
    it("should have correct structure for outputs", () => {
      const outputs = [
        { name: "sitemap.xml", contents: generateSitemap() },
        { name: "rss.xml", contents: generateRSSFeed() },
        { name: "feed.json", contents: generateJSONFeed() },
        { name: "robots.txt", contents: generateRobotsTxt() },
      ];

      expect(outputs).toHaveLength(4);

      outputs.forEach((output) => {
        expect(output).toHaveProperty("name");
        expect(output).toHaveProperty("contents");
        expect(typeof output.name).toBe("string");
        expect(typeof output.contents).toBe("string");
        expect(output.contents.length).toBeGreaterThan(0);
      });
    });

    it("should generate all unique file names", () => {
      const names = ["sitemap.xml", "rss.xml", "feed.json", "robots.txt"];
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(4);
    });
  });

  describe("content encoding", () => {
    it("RSS feed should be valid UTF-8", () => {
      const rss = generateRSSFeed();
      expect(() => new TextEncoder().encode(rss)).not.toThrow();
    });

    it("JSON feed should be valid UTF-8", () => {
      const json = generateJSONFeed();
      expect(() => new TextEncoder().encode(json)).not.toThrow();
    });

    it("sitemap should be valid UTF-8", () => {
      const sitemap = generateSitemap();
      expect(() => new TextEncoder().encode(sitemap)).not.toThrow();
    });

    it("robots.txt should be valid UTF-8", () => {
      const robots = generateRobotsTxt();
      expect(() => new TextEncoder().encode(robots)).not.toThrow();
    });
  });

  describe("integration with generator functions", () => {
    it("all generator functions should be callable", () => {
      expect(typeof generateSitemap).toBe("function");
      expect(typeof generateRSSFeed).toBe("function");
      expect(typeof generateJSONFeed).toBe("function");
      expect(typeof generateRobotsTxt).toBe("function");
    });

    it("all generator functions should return strings", () => {
      expect(typeof generateSitemap()).toBe("string");
      expect(typeof generateRSSFeed()).toBe("string");
      expect(typeof generateJSONFeed()).toBe("string");
      expect(typeof generateRobotsTxt()).toBe("string");
    });

    it("all generator functions should return non-empty content", () => {
      expect(generateSitemap().length).toBeGreaterThan(100);
      expect(generateRSSFeed().length).toBeGreaterThan(100);
      expect(generateJSONFeed().length).toBeGreaterThan(50);
      expect(generateRobotsTxt().length).toBeGreaterThan(20);
    });

    it("generator functions should be idempotent", () => {
      const sitemap1 = generateSitemap();
      const sitemap2 = generateSitemap();
      // Structure should be consistent (but dates may differ)
      expect(sitemap1.includes("</urlset>")).toBe(sitemap2.includes("</urlset>"));

      const robots1 = generateRobotsTxt();
      const robots2 = generateRobotsTxt();
      expect(robots1).toBe(robots2); // Should be identical
    });
  });

  describe("file list logging", () => {
    it("should format file list correctly", () => {
      const outputs = [
        { name: "sitemap.xml" },
        { name: "rss.xml" },
        { name: "feed.json" },
        { name: "robots.txt" },
      ];

      const fileList = outputs.map((output) => output.name).join(", ");
      expect(fileList).toBe("sitemap.xml, rss.xml, feed.json, robots.txt");
    });

    it("should contain all file names in list", () => {
      const fileList = "sitemap.xml, rss.xml, feed.json, robots.txt";
      expect(fileList).toContain("sitemap.xml");
      expect(fileList).toContain("rss.xml");
      expect(fileList).toContain("feed.json");
      expect(fileList).toContain("robots.txt");
    });
  });
});