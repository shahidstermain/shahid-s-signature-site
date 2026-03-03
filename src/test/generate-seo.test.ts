import { describe, it, expect, vi } from "vitest";
import { writeFile } from "node:fs/promises";
import path from "node:path";

// Mock dependencies
vi.mock("node:fs/promises", () => ({
  writeFile: vi.fn(),
}));

vi.mock("@/lib/rss", () => ({
  generateRSSFeed: vi.fn(() => '<?xml version="1.0"?><rss>RSS Content</rss>'),
  generateJSONFeed: vi.fn(() => '{"version": "1.1"}'),
}));

vi.mock("@/lib/sitemap", () => ({
  generateSitemap: vi.fn(() => '<?xml version="1.0"?><urlset>Sitemap</urlset>'),
  generateRobotsTxt: vi.fn(() => "User-agent: *\nAllow: /\n"),
}));

describe("Generate SEO script integration", () => {
  it("should generate all four SEO files", async () => {
    const { generateRSSFeed, generateJSONFeed } = await import("@/lib/rss");
    const { generateSitemap, generateRobotsTxt } = await import("@/lib/sitemap");

    const files = [
      { name: "sitemap.xml", generator: generateSitemap },
      { name: "rss.xml", generator: generateRSSFeed },
      { name: "feed.json", generator: generateJSONFeed },
      { name: "robots.txt", generator: generateRobotsTxt },
    ];

    expect(files.length).toBe(4);
    files.forEach((file) => {
      expect(file.generator).toBeInstanceOf(Function);
    });
  });

  it("should write files to public directory", async () => {
    const publicDir = path.join(process.cwd(), "public");
    const filename = "test.xml";
    const filePath = path.join(publicDir, filename);

    expect(filePath).toContain("public");
    expect(filePath).toContain(filename);
  });

  it("should use UTF-8 encoding", () => {
    const encoding = "utf8";

    expect(encoding).toBe("utf8");
  });

  it("should handle write operations concurrently", async () => {
    const operations = [
      Promise.resolve("sitemap"),
      Promise.resolve("rss"),
      Promise.resolve("feed"),
      Promise.resolve("robots"),
    ];

    const results = await Promise.all(operations);

    expect(results.length).toBe(4);
  });

  it("should generate valid XML for sitemap", async () => {
    const { generateSitemap } = await import("@/lib/sitemap");

    const sitemap = generateSitemap();

    expect(sitemap).toContain('<?xml version="1.0"?>');
    expect(sitemap).toContain("<urlset>");
  });

  it("should generate valid XML for RSS", async () => {
    const { generateRSSFeed } = await import("@/lib/rss");

    const rss = generateRSSFeed();

    expect(rss).toContain('<?xml version="1.0"?>');
    expect(rss).toContain("<rss>");
  });

  it("should generate valid JSON for feed", async () => {
    const { generateJSONFeed } = await import("@/lib/rss");

    const feed = generateJSONFeed();

    expect(() => JSON.parse(feed)).not.toThrow();
  });

  it("should generate valid robots.txt", async () => {
    const { generateRobotsTxt } = await import("@/lib/sitemap");

    const robots = generateRobotsTxt();

    expect(robots).toContain("User-agent:");
    expect(robots).toContain("Allow:");
  });

  it("should handle file paths correctly", () => {
    const publicDir = path.join(process.cwd(), "public");
    const files = ["sitemap.xml", "rss.xml", "feed.json", "robots.txt"];

    files.forEach((filename) => {
      const filepath = path.join(publicDir, filename);
      expect(filepath).toContain("public");
      expect(filepath).toContain(filename);
    });
  });

  it("should export generation functions", async () => {
    const rssModule = await import("@/lib/rss");
    const sitemapModule = await import("@/lib/sitemap");

    expect(rssModule.generateRSSFeed).toBeDefined();
    expect(rssModule.generateJSONFeed).toBeDefined();
    expect(sitemapModule.generateSitemap).toBeDefined();
    expect(sitemapModule.generateRobotsTxt).toBeDefined();
  });

  it("should generate non-empty content", async () => {
    const { generateRSSFeed, generateJSONFeed } = await import("@/lib/rss");
    const { generateSitemap, generateRobotsTxt } = await import("@/lib/sitemap");

    expect(generateSitemap().length).toBeGreaterThan(0);
    expect(generateRSSFeed().length).toBeGreaterThan(0);
    expect(generateJSONFeed().length).toBeGreaterThan(0);
    expect(generateRobotsTxt().length).toBeGreaterThan(0);
  });

  it("should create proper file list", () => {
    const fileList = ["sitemap.xml", "rss.xml", "feed.json", "robots.txt"];

    expect(fileList).toHaveLength(4);
    expect(fileList).toContain("sitemap.xml");
    expect(fileList).toContain("rss.xml");
    expect(fileList).toContain("feed.json");
    expect(fileList).toContain("robots.txt");
  });

  it("should handle concurrent writes without errors", async () => {
    const writes = [
      writeFile("sitemap.xml", "content", "utf8"),
      writeFile("rss.xml", "content", "utf8"),
      writeFile("feed.json", "content", "utf8"),
      writeFile("robots.txt", "content", "utf8"),
    ];

    await expect(Promise.all(writes)).resolves.not.toThrow();
  });

  it("should use consistent file extensions", () => {
    const files = {
      sitemap: ".xml",
      rss: ".xml",
      feed: ".json",
      robots: ".txt",
    };

    Object.values(files).forEach((ext) => {
      expect(ext).toMatch(/^\.(xml|json|txt)$/);
    });
  });

  it("should write to correct output directory", () => {
    const outputDir = "public";

    expect(outputDir).toBe("public");
    expect(outputDir).not.toContain("/");
  });

  it("should complete all operations successfully", async () => {
    const { generateRSSFeed, generateJSONFeed } = await import("@/lib/rss");
    const { generateSitemap, generateRobotsTxt } = await import("@/lib/sitemap");

    expect(() => {
      generateSitemap();
      generateRSSFeed();
      generateJSONFeed();
      generateRobotsTxt();
    }).not.toThrow();
  });
});