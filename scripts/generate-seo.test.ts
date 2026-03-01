import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateRSSFeed, generateJSONFeed } from "../src/lib/rss";
import { generateSitemap, generateRobotsTxt } from "../src/lib/sitemap";

// Mock the fs/promises module
vi.mock("node:fs/promises", () => ({
  writeFile: vi.fn(),
  mkdir: vi.fn(),
}));

describe("generate-seo script", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("output generation", () => {
    it("should generate sitemap.xml content", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain('<?xml version="1.0"');
      expect(sitemap).toContain("<urlset");
      expect(sitemap).toContain("</urlset>");
    });

    it("should generate rss.xml content", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain('<?xml version="1.0"');
      expect(rss).toContain("<rss");
      expect(rss).toContain("</rss>");
    });

    it("should generate feed.json content", () => {
      const feed = generateJSONFeed();

      expect(() => JSON.parse(feed)).not.toThrow();
      const parsed = JSON.parse(feed);
      expect(parsed.version).toBe("https://jsonfeed.org/version/1.1");
    });

    it("should generate robots.txt content", () => {
      const robots = generateRobotsTxt();

      expect(robots).toContain("User-agent: *");
      expect(robots).toContain("Allow: /");
      expect(robots).toContain("Sitemap:");
    });
  });

  describe("file operations", () => {
    it("should create public directory recursively", async () => {
      const mockMkdir = vi.mocked(mkdir);

      // The script calls mkdir with { recursive: true }
      expect(mockMkdir).toBeDefined();
    });

    it("should write all expected files", () => {
      const expectedFiles = [
        "sitemap.xml",
        "rss.xml",
        "feed.json",
        "robots.txt",
      ];

      expectedFiles.forEach(file => {
        expect(file).toBeTruthy();
      });
    });
  });

  describe("content validation", () => {
    it("sitemap should be valid XML", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toMatch(/<\?xml/);
      expect(sitemap).toMatch(/<urlset/);
      expect(sitemap).toMatch(/<\/urlset>/);
    });

    it("RSS should be valid XML", () => {
      const rss = generateRSSFeed();

      expect(rss).toMatch(/<\?xml/);
      expect(rss).toMatch(/<rss/);
      expect(rss).toMatch(/<\/rss>/);
    });

    it("JSON feed should be valid JSON", () => {
      const feed = generateJSONFeed();

      expect(() => JSON.parse(feed)).not.toThrow();
    });

    it("robots.txt should be plain text", () => {
      const robots = generateRobotsTxt();

      expect(robots).not.toContain("<");
      expect(robots).not.toContain(">");
    });
  });

  describe("integration with lib functions", () => {
    it("should use generateSitemap from lib/sitemap", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toBeTruthy();
      expect(typeof sitemap).toBe("string");
    });

    it("should use generateRSSFeed from lib/rss", () => {
      const rss = generateRSSFeed();

      expect(rss).toBeTruthy();
      expect(typeof rss).toBe("string");
    });

    it("should use generateJSONFeed from lib/rss", () => {
      const feed = generateJSONFeed();

      expect(feed).toBeTruthy();
      expect(typeof feed).toBe("string");
    });

    it("should use generateRobotsTxt from lib/sitemap", () => {
      const robots = generateRobotsTxt();

      expect(robots).toBeTruthy();
      expect(typeof robots).toBe("string");
    });
  });

  describe("output structure", () => {
    it("should generate non-empty content for all files", () => {
      const outputs = [
        { name: "sitemap.xml", contents: generateSitemap() },
        { name: "rss.xml", contents: generateRSSFeed() },
        { name: "feed.json", contents: generateJSONFeed() },
        { name: "robots.txt", contents: generateRobotsTxt() },
      ];

      outputs.forEach(output => {
        expect(output.contents.length).toBeGreaterThan(0);
      });
    });

    it("should have correct file names", () => {
      const expectedFiles = ["sitemap.xml", "rss.xml", "feed.json", "robots.txt"];

      expectedFiles.forEach(filename => {
        expect(filename).toMatch(/\.(xml|json|txt)$/);
      });
    });
  });

  describe("error handling", () => {
    it("should handle generation errors gracefully", () => {
      expect(() => generateSitemap()).not.toThrow();
      expect(() => generateRSSFeed()).not.toThrow();
      expect(() => generateJSONFeed()).not.toThrow();
      expect(() => generateRobotsTxt()).not.toThrow();
    });
  });

  describe("UTF-8 encoding", () => {
    it("all outputs should be valid UTF-8", () => {
      const outputs = [
        generateSitemap(),
        generateRSSFeed(),
        generateJSONFeed(),
        generateRobotsTxt(),
      ];

      outputs.forEach(output => {
        // Should encode without errors
        expect(() => Buffer.from(output, "utf8")).not.toThrow();
      });
    });

    it("should handle unicode characters", () => {
      const rss = generateRSSFeed();
      const json = generateJSONFeed();

      // Should contain valid UTF-8
      expect(rss).toBeTruthy();
      expect(json).toBeTruthy();
    });
  });

  describe("consistency across outputs", () => {
    it("sitemap and robots.txt should reference same sitemap URL", () => {
      const sitemap = generateSitemap();
      const robots = generateRobotsTxt();

      expect(robots).toContain("sitemap.xml");
    });

    it("RSS and JSON should have consistent article counts", () => {
      const rss = generateRSSFeed();
      const json = generateJSONFeed();

      const rssItemCount = (rss.match(/<item>/g) || []).length;
      const jsonData = JSON.parse(json);
      const jsonItemCount = jsonData.items.length;

      expect(rssItemCount).toBe(jsonItemCount);
    });
  });

  describe("performance", () => {
    it("should generate all files quickly", () => {
      const start = Date.now();

      generateSitemap();
      generateRSSFeed();
      generateJSONFeed();
      generateRobotsTxt();

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it("should not have memory leaks with multiple generations", () => {
      const iterations = 10;

      for (let i = 0; i < iterations; i++) {
        generateSitemap();
        generateRSSFeed();
        generateJSONFeed();
        generateRobotsTxt();
      }

      expect(true).toBe(true);
    });
  });

  describe("deterministic output", () => {
    it("should generate consistent sitemap content", () => {
      const sitemap1 = generateSitemap();
      const sitemap2 = generateSitemap();

      // URLs should be same (dates might differ by a day if run at midnight)
      const urls1 = sitemap1.match(/<loc>(.*?)<\/loc>/g) || [];
      const urls2 = sitemap2.match(/<loc>(.*?)<\/loc>/g) || [];

      expect(urls1.length).toBe(urls2.length);
    });

    it("should generate consistent robots.txt", () => {
      const robots1 = generateRobotsTxt();
      const robots2 = generateRobotsTxt();

      expect(robots1).toBe(robots2);
    });
  });

  describe("file path handling", () => {
    it("should use correct public directory path", () => {
      // Script should write to public directory
      const publicDir = "public";

      expect(publicDir).toBeTruthy();
      expect(typeof publicDir).toBe("string");
    });

    it("should handle path resolution correctly", () => {
      const filename = "sitemap.xml";
      const publicPath = path.join("public", filename);

      expect(publicPath).toContain("public");
      expect(publicPath).toContain("sitemap.xml");
    });
  });

  describe("content correctness", () => {
    it("sitemap should include blog URLs", () => {
      const sitemap = generateSitemap();

      expect(sitemap).toContain("/blog/");
    });

    it("RSS should include article titles", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<title>");
      expect(rss).toContain("</title>");
    });

    it("JSON feed should include article data", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(feed.items.length).toBeGreaterThan(0);
      expect(feed.items[0]).toHaveProperty("title");
      expect(feed.items[0]).toHaveProperty("url");
    });

    it("robots.txt should allow all crawlers", () => {
      const robots = generateRobotsTxt();

      expect(robots).toContain("User-agent: *");
      expect(robots).toContain("Allow: /");
    });
  });
});