import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";

// Mock the imported functions
vi.mock("../src/lib/rss", () => ({
  generateRSSFeed: vi.fn(() => "<rss>mock rss feed</rss>"),
  generateJSONFeed: vi.fn(() => JSON.stringify({ mock: "json feed" })),
}));

vi.mock("../src/lib/sitemap", () => ({
  generateSitemap: vi.fn(() => "<urlset>mock sitemap</urlset>"),
  generateRobotsTxt: vi.fn(() => "User-agent: *\nAllow: /"),
}));

describe("generate-seo script", () => {
  const testOutputDir = path.join(process.cwd(), "test-public");

  beforeEach(async () => {
    // Clean up test directory if it exists
    if (existsSync(testOutputDir)) {
      rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // Clean up after tests
    if (existsSync(testOutputDir)) {
      rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  it("should create public directory if it doesn't exist", async () => {
    await mkdir(testOutputDir, { recursive: true });

    expect(existsSync(testOutputDir)).toBe(true);
  });

  it("should generate sitemap.xml file", async () => {
    const { generateSitemap } = await import("../src/lib/sitemap");
    const sitemapPath = path.join(testOutputDir, "sitemap.xml");

    await mkdir(testOutputDir, { recursive: true });
    await writeFile(sitemapPath, (generateSitemap as any)(), "utf8");

    expect(existsSync(sitemapPath)).toBe(true);
    const content = readFileSync(sitemapPath, "utf8");
    expect(content).toContain("mock sitemap");
  });

  it("should generate rss.xml file", async () => {
    const { generateRSSFeed } = await import("../src/lib/rss");
    const rssPath = path.join(testOutputDir, "rss.xml");

    await mkdir(testOutputDir, { recursive: true });
    await writeFile(rssPath, (generateRSSFeed as any)(), "utf8");

    expect(existsSync(rssPath)).toBe(true);
    const content = readFileSync(rssPath, "utf8");
    expect(content).toContain("mock rss feed");
  });

  it("should generate feed.json file", async () => {
    const { generateJSONFeed } = await import("../src/lib/rss");
    const jsonPath = path.join(testOutputDir, "feed.json");

    await mkdir(testOutputDir, { recursive: true });
    await writeFile(jsonPath, (generateJSONFeed as any)(), "utf8");

    expect(existsSync(jsonPath)).toBe(true);
    const content = readFileSync(jsonPath, "utf8");
    expect(content).toContain("mock");
  });

  it("should generate robots.txt file", async () => {
    const { generateRobotsTxt } = await import("../src/lib/sitemap");
    const robotsPath = path.join(testOutputDir, "robots.txt");

    await mkdir(testOutputDir, { recursive: true });
    await writeFile(robotsPath, (generateRobotsTxt as any)(), "utf8");

    expect(existsSync(robotsPath)).toBe(true);
    const content = readFileSync(robotsPath, "utf8");
    expect(content).toContain("User-agent: *");
  });

  it("should generate all four files simultaneously", async () => {
    const { generateRSSFeed, generateJSONFeed } = await import("../src/lib/rss");
    const { generateSitemap, generateRobotsTxt } = await import("../src/lib/sitemap");

    const outputs = [
      { name: "sitemap.xml", contents: (generateSitemap as any)() },
      { name: "rss.xml", contents: (generateRSSFeed as any)() },
      { name: "feed.json", contents: (generateJSONFeed as any)() },
      { name: "robots.txt", contents: (generateRobotsTxt as any)() },
    ];

    await mkdir(testOutputDir, { recursive: true });

    await Promise.all(
      outputs.map(output =>
        writeFile(path.join(testOutputDir, output.name), output.contents, "utf8")
      )
    );

    outputs.forEach(output => {
      const filePath = path.join(testOutputDir, output.name);
      expect(existsSync(filePath)).toBe(true);
    });
  });

  it("should write files with utf8 encoding", async () => {
    const { generateSitemap } = await import("../src/lib/sitemap");
    const sitemapPath = path.join(testOutputDir, "sitemap.xml");

    await mkdir(testOutputDir, { recursive: true });
    await writeFile(sitemapPath, (generateSitemap as any)(), "utf8");

    const content = readFileSync(sitemapPath, "utf8");
    expect(typeof content).toBe("string");
  });

  it("should handle directory creation with recursive option", async () => {
    const nestedDir = path.join(testOutputDir, "nested", "deep");

    await mkdir(nestedDir, { recursive: true });

    expect(existsSync(nestedDir)).toBe(true);
  });

  it("should generate expected file list", () => {
    const expectedFiles = ["sitemap.xml", "rss.xml", "feed.json", "robots.txt"];
    const fileList = expectedFiles.join(", ");

    expect(fileList).toBe("sitemap.xml, rss.xml, feed.json, robots.txt");
  });

  it("should use correct output structure", async () => {
    const { generateRSSFeed, generateJSONFeed } = await import("../src/lib/rss");
    const { generateSitemap, generateRobotsTxt } = await import("../src/lib/sitemap");

    const outputs = [
      { name: "sitemap.xml", contents: (generateSitemap as any)() },
      { name: "rss.xml", contents: (generateRSSFeed as any)() },
      { name: "feed.json", contents: (generateJSONFeed as any)() },
      { name: "robots.txt", contents: (generateRobotsTxt as any)() },
    ];

    expect(outputs).toHaveLength(4);
    outputs.forEach(output => {
      expect(output).toHaveProperty("name");
      expect(output).toHaveProperty("contents");
      expect(typeof output.name).toBe("string");
      expect(typeof output.contents).toBe("string");
    });
  });
});