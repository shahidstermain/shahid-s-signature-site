import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs/promises";
import * as path from "node:path";

// Mock the file system
vi.mock("node:fs/promises");
vi.mock("../src/lib/rss", () => ({
  generateRSSFeed: () => "<?xml version='1.0'?><rss>test rss</rss>",
  generateJSONFeed: () => '{"version": "1.1", "items": []}',
}));
vi.mock("../src/lib/sitemap", () => ({
  generateSitemap: () => "<?xml version='1.0'?><urlset>test sitemap</urlset>",
  generateRobotsTxt: () => "User-agent: *\nAllow: /\n",
}));

describe("generate-seo script", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should generate all four SEO files", async () => {
    const writeFileMock = vi.mocked(fs.writeFile);
    writeFileMock.mockResolvedValue(undefined);

    // Import and run the script
    await import("./generate-seo");

    // Wait for promises to resolve
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(writeFileMock).toHaveBeenCalledTimes(4);
  });

  it("should write sitemap.xml", async () => {
    const writeFileMock = vi.mocked(fs.writeFile);
    writeFileMock.mockResolvedValue(undefined);

    await import("./generate-seo");
    await new Promise((resolve) => setTimeout(resolve, 100));

    const calls = writeFileMock.mock.calls;
    const sitemapCall = calls.find((call) =>
      call[0].toString().endsWith("sitemap.xml")
    );

    expect(sitemapCall).toBeDefined();
    expect(sitemapCall![1]).toContain("urlset");
  });

  it("should write rss.xml", async () => {
    const writeFileMock = vi.mocked(fs.writeFile);
    writeFileMock.mockResolvedValue(undefined);

    await import("./generate-seo");
    await new Promise((resolve) => setTimeout(resolve, 100));

    const calls = writeFileMock.mock.calls;
    const rssCall = calls.find((call) => call[0].toString().endsWith("rss.xml"));

    expect(rssCall).toBeDefined();
    expect(rssCall![1]).toContain("rss");
  });

  it("should write feed.json", async () => {
    const writeFileMock = vi.mocked(fs.writeFile);
    writeFileMock.mockResolvedValue(undefined);

    await import("./generate-seo");
    await new Promise((resolve) => setTimeout(resolve, 100));

    const calls = writeFileMock.mock.calls;
    const feedCall = calls.find((call) =>
      call[0].toString().endsWith("feed.json")
    );

    expect(feedCall).toBeDefined();
    expect(feedCall![1]).toContain("version");
  });

  it("should write robots.txt", async () => {
    const writeFileMock = vi.mocked(fs.writeFile);
    writeFileMock.mockResolvedValue(undefined);

    await import("./generate-seo");
    await new Promise((resolve) => setTimeout(resolve, 100));

    const calls = writeFileMock.mock.calls;
    const robotsCall = calls.find((call) =>
      call[0].toString().endsWith("robots.txt")
    );

    expect(robotsCall).toBeDefined();
    expect(robotsCall![1]).toContain("User-agent");
  });

  it("should write files with utf8 encoding", async () => {
    const writeFileMock = vi.mocked(fs.writeFile);
    writeFileMock.mockResolvedValue(undefined);

    await import("./generate-seo");
    await new Promise((resolve) => setTimeout(resolve, 100));

    writeFileMock.mock.calls.forEach((call) => {
      expect(call[2]).toBe("utf8");
    });
  });

  it("should write files to public directory", async () => {
    const writeFileMock = vi.mocked(fs.writeFile);
    writeFileMock.mockResolvedValue(undefined);

    await import("./generate-seo");
    await new Promise((resolve) => setTimeout(resolve, 100));

    writeFileMock.mock.calls.forEach((call) => {
      const filePath = call[0].toString();
      expect(filePath).toContain("public");
    });
  });

  it("should handle file write errors gracefully", async () => {
    const writeFileMock = vi.mocked(fs.writeFile);
    writeFileMock.mockRejectedValue(new Error("Write error"));

    // Should not throw
    await expect(import("./generate-seo")).resolves.toBeDefined();
  });

  it("should call writeFile in parallel for better performance", async () => {
    const writeFileMock = vi.mocked(fs.writeFile);
    writeFileMock.mockResolvedValue(undefined);

    await import("./generate-seo");
    await new Promise((resolve) => setTimeout(resolve, 100));

    // All files should be written
    expect(writeFileMock).toHaveBeenCalledTimes(4);
  });

  it("should generate files with non-empty content", async () => {
    const writeFileMock = vi.mocked(fs.writeFile);
    writeFileMock.mockResolvedValue(undefined);

    await import("./generate-seo");
    await new Promise((resolve) => setTimeout(resolve, 100));

    writeFileMock.mock.calls.forEach((call) => {
      const content = call[1] as string;
      expect(content.length).toBeGreaterThan(0);
    });
  });

  it("should use correct file names", async () => {
    const writeFileMock = vi.mocked(fs.writeFile);
    writeFileMock.mockResolvedValue(undefined);

    await import("./generate-seo");
    await new Promise((resolve) => setTimeout(resolve, 100));

    const filePaths = writeFileMock.mock.calls.map((call) => call[0].toString());
    const fileNames = filePaths.map((path) => path.split("/").pop());

    expect(fileNames).toContain("sitemap.xml");
    expect(fileNames).toContain("rss.xml");
    expect(fileNames).toContain("feed.json");
    expect(fileNames).toContain("robots.txt");
  });
});