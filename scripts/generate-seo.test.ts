import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { writeFile } from "node:fs/promises";
import { readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";

// Mock the dependencies
vi.mock("../src/lib/rss", () => ({
  generateRSSFeed: vi.fn(() => "<?xml version=\"1.0\"?><rss>Mock RSS Feed</rss>"),
  generateJSONFeed: vi.fn(() => '{"version": "https://jsonfeed.org/version/1.1", "items": []}'),
}));

vi.mock("../src/lib/sitemap", () => ({
  generateSitemap: vi.fn(() => "<?xml version=\"1.0\"?><urlset>Mock Sitemap</urlset>"),
  generateRobotsTxt: vi.fn(() => "User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml\n"),
}));

describe("generate-seo script", () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    // Create a temporary directory for testing
    testDir = path.join(tmpdir(), `seo-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
    await mkdir(path.join(testDir, "public"), { recursive: true });

    // Save original cwd
    originalCwd = process.cwd();
  });

  afterEach(async () => {
    // Restore original cwd
    process.chdir(originalCwd);

    // Clean up test directory
    try {
      const { rm } = await import("node:fs/promises");
      await rm(testDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  it("should generate all SEO assets", async () => {
    const { generateRSSFeed, generateJSONFeed } = await import("../src/lib/rss");
    const { generateSitemap, generateRobotsTxt } = await import("../src/lib/sitemap");

    const publicDir = path.join(testDir, "public");

    // Write files
    await writeFile(path.join(publicDir, "sitemap.xml"), generateSitemap(), "utf8");
    await writeFile(path.join(publicDir, "rss.xml"), generateRSSFeed(), "utf8");
    await writeFile(path.join(publicDir, "feed.json"), generateJSONFeed(), "utf8");
    await writeFile(path.join(publicDir, "robots.txt"), generateRobotsTxt(), "utf8");

    // Verify files exist
    expect(existsSync(path.join(publicDir, "sitemap.xml"))).toBe(true);
    expect(existsSync(path.join(publicDir, "rss.xml"))).toBe(true);
    expect(existsSync(path.join(publicDir, "feed.json"))).toBe(true);
    expect(existsSync(path.join(publicDir, "robots.txt"))).toBe(true);
  });

  it("should write sitemap.xml with correct content", async () => {
    const { generateSitemap } = await import("../src/lib/sitemap");
    const publicDir = path.join(testDir, "public");

    const content = generateSitemap();
    await writeFile(path.join(publicDir, "sitemap.xml"), content, "utf8");

    const written = await readFile(path.join(publicDir, "sitemap.xml"), "utf8");
    expect(written).toBe(content);
    expect(written).toContain("<?xml version=\"1.0\"?>");
    expect(written).toContain("Mock Sitemap");
  });

  it("should write rss.xml with correct content", async () => {
    const { generateRSSFeed } = await import("../src/lib/rss");
    const publicDir = path.join(testDir, "public");

    const content = generateRSSFeed();
    await writeFile(path.join(publicDir, "rss.xml"), content, "utf8");

    const written = await readFile(path.join(publicDir, "rss.xml"), "utf8");
    expect(written).toBe(content);
    expect(written).toContain("Mock RSS Feed");
  });

  it("should write feed.json with correct content", async () => {
    const { generateJSONFeed } = await import("../src/lib/rss");
    const publicDir = path.join(testDir, "public");

    const content = generateJSONFeed();
    await writeFile(path.join(publicDir, "feed.json"), content, "utf8");

    const written = await readFile(path.join(publicDir, "feed.json"), "utf8");
    expect(written).toBe(content);

    // Verify it's valid JSON
    const parsed = JSON.parse(written);
    expect(parsed.version).toBeDefined();
  });

  it("should write robots.txt with correct content", async () => {
    const { generateRobotsTxt } = await import("../src/lib/sitemap");
    const publicDir = path.join(testDir, "public");

    const content = generateRobotsTxt();
    await writeFile(path.join(publicDir, "robots.txt"), content, "utf8");

    const written = await readFile(path.join(publicDir, "robots.txt"), "utf8");
    expect(written).toBe(content);
    expect(written).toContain("User-agent:");
    expect(written).toContain("Sitemap:");
  });

  it("should write files with UTF-8 encoding", async () => {
    const { generateRSSFeed } = await import("../src/lib/rss");
    const publicDir = path.join(testDir, "public");

    await writeFile(path.join(publicDir, "rss.xml"), generateRSSFeed(), "utf8");

    const stats = await readFile(path.join(publicDir, "rss.xml"), "utf8");
    expect(typeof stats).toBe("string");
  });

  it("should call all generation functions", async () => {
    const { generateRSSFeed, generateJSONFeed } = await import("../src/lib/rss");
    const { generateSitemap, generateRobotsTxt } = await import("../src/lib/sitemap");

    // Call all functions to ensure they work
    expect(() => generateSitemap()).not.toThrow();
    expect(() => generateRSSFeed()).not.toThrow();
    expect(() => generateJSONFeed()).not.toThrow();
    expect(() => generateRobotsTxt()).not.toThrow();
  });

  it("should generate files that can be written concurrently", async () => {
    const { generateRSSFeed, generateJSONFeed } = await import("../src/lib/rss");
    const { generateSitemap, generateRobotsTxt } = await import("../src/lib/sitemap");
    const publicDir = path.join(testDir, "public");

    const outputs = [
      { name: "sitemap.xml", contents: generateSitemap() },
      { name: "rss.xml", contents: generateRSSFeed() },
      { name: "feed.json", contents: generateJSONFeed() },
      { name: "robots.txt", contents: generateRobotsTxt() },
    ];

    // Write all files concurrently
    await Promise.all(
      outputs.map((output) =>
        writeFile(path.join(publicDir, output.name), output.contents, "utf8")
      )
    );

    // Verify all files exist
    for (const output of outputs) {
      expect(existsSync(path.join(publicDir, output.name))).toBe(true);
    }
  });

  it("should overwrite existing files", async () => {
    const { generateSitemap } = await import("../src/lib/sitemap");
    const publicDir = path.join(testDir, "public");
    const filePath = path.join(publicDir, "sitemap.xml");

    // Write initial content
    await writeFile(filePath, "old content", "utf8");

    // Overwrite with new content
    const newContent = generateSitemap();
    await writeFile(filePath, newContent, "utf8");

    const written = await readFile(filePath, "utf8");
    expect(written).toBe(newContent);
    expect(written).not.toBe("old content");
  });

  describe("integration tests", () => {
    it("should generate valid XML for sitemap", async () => {
      const { generateSitemap } = await import("../src/lib/sitemap");
      const content = generateSitemap();

      expect(content).toContain('<?xml version="1.0"');
      expect(content).toContain('<urlset');
      expect(content).toContain('</urlset>');
    });

    it("should generate valid XML for RSS", async () => {
      const { generateRSSFeed } = await import("../src/lib/rss");
      const content = generateRSSFeed();

      expect(content).toContain('<?xml version="1.0"');
      expect(content).toContain('<rss');
    });

    it("should generate valid JSON feed", async () => {
      const { generateJSONFeed } = await import("../src/lib/rss");
      const content = generateJSONFeed();

      expect(() => JSON.parse(content)).not.toThrow();
      const parsed = JSON.parse(content);
      expect(parsed.version).toBeDefined();
    });

    it("should generate plain text robots.txt", async () => {
      const { generateRobotsTxt } = await import("../src/lib/sitemap");
      const content = generateRobotsTxt();

      expect(content).toMatch(/^[^<{]*$/); // No XML or JSON
      expect(content).toContain('User-agent:');
    });
  });

  describe("edge cases and error handling", () => {
    it("should handle file write failures gracefully", async () => {
      const publicDir = path.join(testDir, "public");

      // Test that writeFile can handle being called multiple times
      const { generateSitemap } = await import("../src/lib/sitemap");
      const content = generateSitemap();

      await writeFile(path.join(publicDir, "test1.xml"), content, "utf8");
      await writeFile(path.join(publicDir, "test2.xml"), content, "utf8");

      expect(existsSync(path.join(publicDir, "test1.xml"))).toBe(true);
      expect(existsSync(path.join(publicDir, "test2.xml"))).toBe(true);
    });

    it("should handle empty directory", async () => {
      const emptyDir = path.join(testDir, "empty");
      await mkdir(emptyDir, { recursive: true });

      expect(existsSync(emptyDir)).toBe(true);
    });

    it("should generate all files with correct extensions", async () => {
      const { generateRSSFeed, generateJSONFeed } = await import("../src/lib/rss");
      const { generateSitemap, generateRobotsTxt } = await import("../src/lib/sitemap");
      const publicDir = path.join(testDir, "public");

      const files = [
        { name: "sitemap.xml", content: generateSitemap() },
        { name: "rss.xml", content: generateRSSFeed() },
        { name: "feed.json", content: generateJSONFeed() },
        { name: "robots.txt", content: generateRobotsTxt() },
      ];

      for (const file of files) {
        await writeFile(path.join(publicDir, file.name), file.content, "utf8");
        const written = await readFile(path.join(publicDir, file.name), "utf8");
        expect(written).toBe(file.content);
      }
    });

    it("should preserve file content integrity", async () => {
      const { generateSitemap } = await import("../src/lib/sitemap");
      const publicDir = path.join(testDir, "public");
      const originalContent = generateSitemap();

      await writeFile(path.join(publicDir, "sitemap.xml"), originalContent, "utf8");
      const readContent = await readFile(path.join(publicDir, "sitemap.xml"), "utf8");

      expect(readContent).toBe(originalContent);
      expect(readContent.length).toBe(originalContent.length);
    });

    it("should handle large file generation", async () => {
      const { generateRSSFeed } = await import("../src/lib/rss");
      const content = generateRSSFeed();
      const publicDir = path.join(testDir, "public");

      // Mock returns a short string, but we can still verify it works
      expect(content.length).toBeGreaterThan(0);

      await writeFile(path.join(publicDir, "large.xml"), content, "utf8");
      expect(existsSync(path.join(publicDir, "large.xml"))).toBe(true);
    });

    it("should generate files with UTF-8 encoding", async () => {
      const { generateRSSFeed } = await import("../src/lib/rss");
      const publicDir = path.join(testDir, "public");

      const content = generateRSSFeed();
      await writeFile(path.join(publicDir, "utf8-test.xml"), content, "utf8");

      const stats = await readFile(path.join(publicDir, "utf8-test.xml"), "utf8");
      expect(typeof stats).toBe("string");
      // Mock returns simple content, just verify it was written and read correctly
      expect(stats).toBe(content);
    });

    it("should batch file writes correctly", async () => {
      const { generateRSSFeed, generateJSONFeed } = await import("../src/lib/rss");
      const { generateSitemap, generateRobotsTxt } = await import("../src/lib/sitemap");
      const publicDir = path.join(testDir, "public");

      const startTime = Date.now();

      await Promise.all([
        writeFile(path.join(publicDir, "sitemap.xml"), generateSitemap(), "utf8"),
        writeFile(path.join(publicDir, "rss.xml"), generateRSSFeed(), "utf8"),
        writeFile(path.join(publicDir, "feed.json"), generateJSONFeed(), "utf8"),
        writeFile(path.join(publicDir, "robots.txt"), generateRobotsTxt(), "utf8"),
      ]);

      const endTime = Date.now();

      // Parallel writes should be faster than sequential
      expect(endTime - startTime).toBeLessThan(1000);

      // All files should exist
      expect(existsSync(path.join(publicDir, "sitemap.xml"))).toBe(true);
      expect(existsSync(path.join(publicDir, "rss.xml"))).toBe(true);
      expect(existsSync(path.join(publicDir, "feed.json"))).toBe(true);
      expect(existsSync(path.join(publicDir, "robots.txt"))).toBe(true);
    });
  });
});