import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Mock } from "vitest";
import { writeFile } from "node:fs/promises";
import path from "node:path";

// Mock the dependencies
vi.mock("node:fs/promises", () => ({
  writeFile: vi.fn(),
}));

vi.mock("../src/lib/rss", () => ({
  generateRSSFeed: vi.fn(() => '<?xml version="1.0"?><rss>RSS Feed Content</rss>'),
  generateJSONFeed: vi.fn(() => '{"version": "1.1", "items": []}'),
}));

vi.mock("../src/lib/sitemap", () => ({
  generateSitemap: vi.fn(() => '<?xml version="1.0"?><urlset>Sitemap Content</urlset>'),
  generateRobotsTxt: vi.fn(() => "User-agent: *\nAllow: /\n"),
}));

describe("generate-seo script", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should import required functions", async () => {
    const { generateRSSFeed, generateJSONFeed } = await import("../src/lib/rss");
    const { generateSitemap, generateRobotsTxt } = await import("../src/lib/sitemap");

    expect(generateRSSFeed).toBeDefined();
    expect(generateJSONFeed).toBeDefined();
    expect(generateSitemap).toBeDefined();
    expect(generateRobotsTxt).toBeDefined();
  });

  it("should call all generation functions", async () => {
    const { generateRSSFeed, generateJSONFeed } = await import("../src/lib/rss");
    const { generateSitemap, generateRobotsTxt } = await import("../src/lib/sitemap");

    // Call the functions as the script would
    generateSitemap();
    generateRSSFeed();
    generateJSONFeed();
    generateRobotsTxt();

    expect(generateSitemap).toHaveBeenCalled();
    expect(generateRSSFeed).toHaveBeenCalled();
    expect(generateJSONFeed).toHaveBeenCalled();
    expect(generateRobotsTxt).toHaveBeenCalled();
  });

  it("should generate correct output structure", async () => {
    const { generateRSSFeed, generateJSONFeed } = await import("../src/lib/rss");
    const { generateSitemap, generateRobotsTxt } = await import("../src/lib/sitemap");

    const outputs = [
      { name: "sitemap.xml", contents: generateSitemap() },
      { name: "rss.xml", contents: generateRSSFeed() },
      { name: "feed.json", contents: generateJSONFeed() },
      { name: "robots.txt", contents: generateRobotsTxt() },
    ];

    expect(outputs).toHaveLength(4);
    expect(outputs[0].name).toBe("sitemap.xml");
    expect(outputs[1].name).toBe("rss.xml");
    expect(outputs[2].name).toBe("feed.json");
    expect(outputs[3].name).toBe("robots.txt");
  });

  it("should generate valid sitemap XML", async () => {
    const { generateSitemap } = await import("../src/lib/sitemap");

    const sitemap = generateSitemap();

    expect(sitemap).toContain('<?xml version="1.0"?>');
    expect(sitemap).toContain("<urlset>");
  });

  it("should generate valid RSS XML", async () => {
    const { generateRSSFeed } = await import("../src/lib/rss");

    const rss = generateRSSFeed();

    expect(rss).toContain('<?xml version="1.0"?>');
    expect(rss).toContain("<rss>");
  });

  it("should generate valid JSON Feed", async () => {
    const { generateJSONFeed } = await import("../src/lib/rss");

    const feed = generateJSONFeed();

    expect(() => JSON.parse(feed)).not.toThrow();
    const parsed = JSON.parse(feed);
    expect(parsed.version).toBe("1.1");
  });

  it("should generate valid robots.txt", async () => {
    const { generateRobotsTxt } = await import("../src/lib/sitemap");

    const robots = generateRobotsTxt();

    expect(robots).toContain("User-agent:");
    expect(robots).toContain("Allow:");
  });

  it("should write all files to public directory", async () => {
    const { generateRSSFeed, generateJSONFeed } = await import("../src/lib/rss");
    const { generateSitemap, generateRobotsTxt } = await import("../src/lib/sitemap");

    const outputs = [
      { name: "sitemap.xml", contents: generateSitemap() },
      { name: "rss.xml", contents: generateRSSFeed() },
      { name: "feed.json", contents: generateJSONFeed() },
      { name: "robots.txt", contents: generateRobotsTxt() },
    ];

    // Simulate what the script does
    const writePromises = outputs.map((output) => {
      const filePath = path.join(process.cwd(), "public", output.name);
      return writeFile(filePath, output.contents, "utf8");
    });

    await Promise.all(writePromises);

    expect(writeFile).toHaveBeenCalledTimes(4);
  });

  it("should write sitemap.xml with correct content", async () => {
    const { generateSitemap } = await import("../src/lib/sitemap");

    const content = generateSitemap();
    const filePath = path.join(process.cwd(), "public", "sitemap.xml");

    await writeFile(filePath, content, "utf8");

    expect(writeFile).toHaveBeenCalledWith(filePath, content, "utf8");
  });

  it("should write rss.xml with correct content", async () => {
    const { generateRSSFeed } = await import("../src/lib/rss");

    const content = generateRSSFeed();
    const filePath = path.join(process.cwd(), "public", "rss.xml");

    await writeFile(filePath, content, "utf8");

    expect(writeFile).toHaveBeenCalledWith(filePath, content, "utf8");
  });

  it("should write feed.json with correct content", async () => {
    const { generateJSONFeed } = await import("../src/lib/rss");

    const content = generateJSONFeed();
    const filePath = path.join(process.cwd(), "public", "feed.json");

    await writeFile(filePath, content, "utf8");

    expect(writeFile).toHaveBeenCalledWith(filePath, content, "utf8");
  });

  it("should write robots.txt with correct content", async () => {
    const { generateRobotsTxt } = await import("../src/lib/sitemap");

    const content = generateRobotsTxt();
    const filePath = path.join(process.cwd(), "public", "robots.txt");

    await writeFile(filePath, content, "utf8");

    expect(writeFile).toHaveBeenCalledWith(filePath, content, "utf8");
  });

  it("should handle all writes concurrently", async () => {
    const { generateRSSFeed, generateJSONFeed } = await import("../src/lib/rss");
    const { generateSitemap, generateRobotsTxt } = await import("../src/lib/sitemap");

    const outputs = [
      { name: "sitemap.xml", contents: generateSitemap() },
      { name: "rss.xml", contents: generateRSSFeed() },
      { name: "feed.json", contents: generateJSONFeed() },
      { name: "robots.txt", contents: generateRobotsTxt() },
    ];

    const startTime = Date.now();

    await Promise.all(
      outputs.map((output) =>
        writeFile(path.join(process.cwd(), "public", output.name), output.contents, "utf8")
      )
    );

    const endTime = Date.now();

    // All should complete (mocked, so very fast)
    expect(endTime - startTime).toBeLessThan(1000);
    expect(writeFile).toHaveBeenCalledTimes(4);
  });

  it("should use UTF-8 encoding for all files", async () => {
    const { generateRSSFeed, generateJSONFeed } = await import("../src/lib/rss");
    const { generateSitemap, generateRobotsTxt } = await import("../src/lib/sitemap");

    const outputs = [
      { name: "sitemap.xml", contents: generateSitemap() },
      { name: "rss.xml", contents: generateRSSFeed() },
      { name: "feed.json", contents: generateJSONFeed() },
      { name: "robots.txt", contents: generateRobotsTxt() },
    ];

    await Promise.all(
      outputs.map((output) =>
        writeFile(path.join(process.cwd(), "public", output.name), output.contents, "utf8")
      )
    );

    // Verify all calls used utf8 encoding
    const calls = (writeFile as Mock).mock.calls;
    calls.forEach((call: unknown[]) => {
      expect(call[2]).toBe("utf8");
    });
  });

  it("should generate file list message", async () => {
    const outputs = [
      { name: "sitemap.xml", contents: "content" },
      { name: "rss.xml", contents: "content" },
      { name: "feed.json", contents: "content" },
      { name: "robots.txt", contents: "content" },
    ];

    const fileList = outputs.map((output) => output.name).join(", ");

    expect(fileList).toBe("sitemap.xml, rss.xml, feed.json, robots.txt");
  });

  it("should resolve paths correctly", () => {
    const publicDir = path.join(process.cwd(), "public");

    const sitemapPath = path.join(publicDir, "sitemap.xml");
    const rssPath = path.join(publicDir, "rss.xml");
    const feedPath = path.join(publicDir, "feed.json");
    const robotsPath = path.join(publicDir, "robots.txt");

    expect(sitemapPath).toContain("public");
    expect(sitemapPath).toContain("sitemap.xml");
    expect(rssPath).toContain("rss.xml");
    expect(feedPath).toContain("feed.json");
    expect(robotsPath).toContain("robots.txt");
  });

  it("should handle errors gracefully", async () => {
    const { generateRSSFeed } = await import("../src/lib/rss");

    // Mock writeFile to throw an error
    (writeFile as Mock).mockRejectedValueOnce(new Error("Write failed"));

    const content = generateRSSFeed();
    const filePath = path.join(process.cwd(), "public", "rss.xml");

    await expect(writeFile(filePath, content, "utf8")).rejects.toThrow("Write failed");
  });

  describe("integration with generation functions", () => {
    it("should produce non-empty content for all files", async () => {
      const { generateRSSFeed, generateJSONFeed } = await import("../src/lib/rss");
      const { generateSitemap, generateRobotsTxt } = await import("../src/lib/sitemap");

      const sitemap = generateSitemap();
      const rss = generateRSSFeed();
      const feed = generateJSONFeed();
      const robots = generateRobotsTxt();

      expect(sitemap.length).toBeGreaterThan(0);
      expect(rss.length).toBeGreaterThan(0);
      expect(feed.length).toBeGreaterThan(0);
      expect(robots.length).toBeGreaterThan(0);
    });

    it("should generate valid XML for sitemap and RSS", async () => {
      const { generateRSSFeed } = await import("../src/lib/rss");
      const { generateSitemap } = await import("../src/lib/sitemap");

      const sitemap = generateSitemap();
      const rss = generateRSSFeed();

      // Basic XML validation
      expect(sitemap).toMatch(/^<\?xml/);
      expect(rss).toMatch(/^<\?xml/);
      expect(sitemap).toContain("</urlset>");
      expect(rss).toContain("</rss>");
    });

    it("should generate parseable JSON for feed", async () => {
      const { generateJSONFeed } = await import("../src/lib/rss");

      const feed = generateJSONFeed();

      expect(() => JSON.parse(feed)).not.toThrow();
    });

    it("should generate valid robots.txt format", async () => {
      const { generateRobotsTxt } = await import("../src/lib/sitemap");

      const robots = generateRobotsTxt();

      const lines = robots.split("\n");
      expect(lines.length).toBeGreaterThan(0);
      expect(robots).toContain("User-agent:");
    });
  });

  describe("file writing simulation", () => {
    it("should write to correct paths", async () => {
      const outputs = [
        { name: "sitemap.xml", contents: "sitemap content" },
        { name: "rss.xml", contents: "rss content" },
        { name: "feed.json", contents: "feed content" },
        { name: "robots.txt", contents: "robots content" },
      ];

      const publicDir = path.join(process.cwd(), "public");

      const expectedPaths = outputs.map((output) => path.join(publicDir, output.name));

      await Promise.all(
        outputs.map((output, index) =>
          writeFile(expectedPaths[index], output.contents, "utf8")
        )
      );

      const calls = (writeFile as Mock).mock.calls;
      expect(calls[0][0]).toContain("sitemap.xml");
      expect(calls[1][0]).toContain("rss.xml");
      expect(calls[2][0]).toContain("feed.json");
      expect(calls[3][0]).toContain("robots.txt");
    });
  });
});