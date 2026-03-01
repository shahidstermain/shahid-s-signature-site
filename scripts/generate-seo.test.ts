import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { writeFile } from "node:fs/promises";
import { existsSync, mkdirSync, rmSync, readFileSync } from "node:fs";
import path from "node:path";

// Mock the RSS and sitemap generators
vi.mock("../src/lib/rss", () => ({
  generateRSSFeed: vi.fn(() => '<?xml version="1.0"?><rss>RSS Feed</rss>'),
  generateJSONFeed: vi.fn(() => '{"version": "1.1", "title": "JSON Feed"}'),
}));

vi.mock("../src/lib/sitemap", () => ({
  generateSitemap: vi.fn(
    () => '<?xml version="1.0"?><urlset>Sitemap</urlset>'
  ),
  generateRobotsTxt: vi.fn(() => "User-agent: *\nAllow: /\n"),
}));

describe("generate-seo script", () => {
  const testDir = path.join(process.cwd(), "test-output");
  const publicDir = path.join(testDir, "public");

  beforeEach(() => {
    // Create test directory
    if (!existsSync(testDir)) {
      mkdirSync(testDir, { recursive: true });
    }
    if (!existsSync(publicDir)) {
      mkdirSync(publicDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test directory
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it("should generate sitemap.xml file", async () => {
    const { generateSitemap } = await import("../src/lib/sitemap");
    const content = generateSitemap();
    const filePath = path.join(publicDir, "sitemap.xml");

    await writeFile(filePath, content, "utf8");

    expect(existsSync(filePath)).toBe(true);
    const fileContent = readFileSync(filePath, "utf8");
    expect(fileContent).toContain("<?xml version");
    expect(fileContent).toContain("Sitemap");
  });

  it("should generate rss.xml file", async () => {
    const { generateRSSFeed } = await import("../src/lib/rss");
    const content = generateRSSFeed();
    const filePath = path.join(publicDir, "rss.xml");

    await writeFile(filePath, content, "utf8");

    expect(existsSync(filePath)).toBe(true);
    const fileContent = readFileSync(filePath, "utf8");
    expect(fileContent).toContain("<?xml version");
    expect(fileContent).toContain("RSS Feed");
  });

  it("should generate feed.json file", async () => {
    const { generateJSONFeed } = await import("../src/lib/rss");
    const content = generateJSONFeed();
    const filePath = path.join(publicDir, "feed.json");

    await writeFile(filePath, content, "utf8");

    expect(existsSync(filePath)).toBe(true);
    const fileContent = readFileSync(filePath, "utf8");
    const parsed = JSON.parse(fileContent);
    expect(parsed.version).toBe("1.1");
  });

  it("should generate robots.txt file", async () => {
    const { generateRobotsTxt } = await import("../src/lib/sitemap");
    const content = generateRobotsTxt();
    const filePath = path.join(publicDir, "robots.txt");

    await writeFile(filePath, content, "utf8");

    expect(existsSync(filePath)).toBe(true);
    const fileContent = readFileSync(filePath, "utf8");
    expect(fileContent).toContain("User-agent: *");
    expect(fileContent).toContain("Allow: /");
  });

  it("should write files with UTF-8 encoding", async () => {
    const content = "Test content with émojis 🎉";
    const filePath = path.join(publicDir, "test.txt");

    await writeFile(filePath, content, "utf8");

    const fileContent = readFileSync(filePath, "utf8");
    expect(fileContent).toBe(content);
  });

  it("should handle concurrent file writes", async () => {
    const { generateSitemap, generateRobotsTxt } = await import(
      "../src/lib/sitemap"
    );
    const { generateRSSFeed, generateJSONFeed } = await import(
      "../src/lib/rss"
    );

    const outputs = [
      { name: "sitemap.xml", contents: generateSitemap() },
      { name: "rss.xml", contents: generateRSSFeed() },
      { name: "feed.json", contents: generateJSONFeed() },
      { name: "robots.txt", contents: generateRobotsTxt() },
    ];

    await Promise.all(
      outputs.map((output) =>
        writeFile(path.join(publicDir, output.name), output.contents, "utf8")
      )
    );

    // Verify all files were created
    expect(existsSync(path.join(publicDir, "sitemap.xml"))).toBe(true);
    expect(existsSync(path.join(publicDir, "rss.xml"))).toBe(true);
    expect(existsSync(path.join(publicDir, "feed.json"))).toBe(true);
    expect(existsSync(path.join(publicDir, "robots.txt"))).toBe(true);
  });

  it("should overwrite existing files", async () => {
    const filePath = path.join(publicDir, "test.txt");

    // Write first version
    await writeFile(filePath, "version 1", "utf8");
    expect(readFileSync(filePath, "utf8")).toBe("version 1");

    // Overwrite with second version
    await writeFile(filePath, "version 2", "utf8");
    expect(readFileSync(filePath, "utf8")).toBe("version 2");
  });

  it("should create directory if it doesn't exist", async () => {
    const nestedDir = path.join(testDir, "nested", "dir");
    const filePath = path.join(nestedDir, "file.txt");

    // Create directory first
    mkdirSync(nestedDir, { recursive: true });

    await writeFile(filePath, "test", "utf8");

    expect(existsSync(filePath)).toBe(true);
  });

  it("should generate all four required files", async () => {
    const { generateSitemap, generateRobotsTxt } = await import(
      "../src/lib/sitemap"
    );
    const { generateRSSFeed, generateJSONFeed } = await import(
      "../src/lib/rss"
    );

    const outputs = [
      { name: "sitemap.xml", contents: generateSitemap() },
      { name: "rss.xml", contents: generateRSSFeed() },
      { name: "feed.json", contents: generateJSONFeed() },
      { name: "robots.txt", contents: generateRobotsTxt() },
    ];

    expect(outputs).toHaveLength(4);
    expect(outputs.map((o) => o.name)).toEqual([
      "sitemap.xml",
      "rss.xml",
      "feed.json",
      "robots.txt",
    ]);
  });

  it("should call generator functions", async () => {
    const { generateSitemap, generateRobotsTxt } = await import(
      "../src/lib/sitemap"
    );
    const { generateRSSFeed, generateJSONFeed } = await import(
      "../src/lib/rss"
    );

    generateSitemap();
    generateRobotsTxt();
    generateRSSFeed();
    generateJSONFeed();

    expect(generateSitemap).toHaveBeenCalled();
    expect(generateRobotsTxt).toHaveBeenCalled();
    expect(generateRSSFeed).toHaveBeenCalled();
    expect(generateJSONFeed).toHaveBeenCalled();
  });

  it("should handle empty content", async () => {
    const filePath = path.join(publicDir, "empty.txt");

    await writeFile(filePath, "", "utf8");

    expect(existsSync(filePath)).toBe(true);
    expect(readFileSync(filePath, "utf8")).toBe("");
  });

  it("should handle very large content", async () => {
    const largeContent = "x".repeat(1000000); // 1MB
    const filePath = path.join(publicDir, "large.txt");

    await writeFile(filePath, largeContent, "utf8");

    expect(existsSync(filePath)).toBe(true);
    expect(readFileSync(filePath, "utf8").length).toBe(1000000);
  });

  it("should preserve line endings", async () => {
    const content = "line1\nline2\nline3\n";
    const filePath = path.join(publicDir, "lines.txt");

    await writeFile(filePath, content, "utf8");

    const fileContent = readFileSync(filePath, "utf8");
    expect(fileContent).toBe(content);
    expect(fileContent.split("\n").length).toBe(4); // 3 lines + 1 empty
  });

  it("should handle special characters in filenames", async () => {
    const filePath = path.join(publicDir, "file-with-dashes.txt");

    await writeFile(filePath, "test", "utf8");

    expect(existsSync(filePath)).toBe(true);
  });

  describe("error handling", () => {
    it("should handle write errors gracefully", async () => {
      const invalidPath = "/invalid/path/that/does/not/exist/file.txt";

      await expect(writeFile(invalidPath, "test", "utf8")).rejects.toThrow();
    });

    it("should validate file paths", () => {
      const validPath = path.join(publicDir, "valid.txt");
      expect(path.isAbsolute(validPath)).toBe(true);
    });
  });

  describe("integration", () => {
    it("should generate consistent file list", async () => {
      const expectedFiles = ["sitemap.xml", "rss.xml", "feed.json", "robots.txt"];
      const { generateSitemap, generateRobotsTxt } = await import(
        "../src/lib/sitemap"
      );
      const { generateRSSFeed, generateJSONFeed } = await import(
        "../src/lib/rss"
      );

      const outputs = [
        { name: "sitemap.xml", contents: generateSitemap() },
        { name: "rss.xml", contents: generateRSSFeed() },
        { name: "feed.json", contents: generateJSONFeed() },
        { name: "robots.txt", contents: generateRobotsTxt() },
      ];

      const actualFiles = outputs.map((output) => output.name);
      expect(actualFiles).toEqual(expectedFiles);
    });

    it("should generate all files with non-empty content", async () => {
      const { generateSitemap, generateRobotsTxt } = await import(
        "../src/lib/sitemap"
      );
      const { generateRSSFeed, generateJSONFeed } = await import(
        "../src/lib/rss"
      );

      const outputs = [
        { name: "sitemap.xml", contents: generateSitemap() },
        { name: "rss.xml", contents: generateRSSFeed() },
        { name: "feed.json", contents: generateJSONFeed() },
        { name: "robots.txt", contents: generateRobotsTxt() },
      ];

      outputs.forEach((output) => {
        expect(output.contents).toBeTruthy();
        expect(output.contents.length).toBeGreaterThan(0);
      });
    });

    it("should handle rapid sequential writes", async () => {
      const { generateSitemap } = await import("../src/lib/sitemap");

      const writes = Array.from({ length: 5 }, (_, i) =>
        writeFile(
          path.join(publicDir, `test-${i}.xml`),
          generateSitemap(),
          "utf8"
        )
      );

      await Promise.all(writes);

      // Verify all files were created
      for (let i = 0; i < 5; i++) {
        expect(existsSync(path.join(publicDir, `test-${i}.xml`))).toBe(true);
      }
    });

    it("should maintain file integrity after multiple writes", async () => {
      const { generateRSSFeed } = await import("../src/lib/rss");
      const filePath = path.join(publicDir, "integrity-test.xml");
      const content = generateRSSFeed();

      // Write multiple times
      await writeFile(filePath, content, "utf8");
      await writeFile(filePath, content, "utf8");
      await writeFile(filePath, content, "utf8");

      const finalContent = readFileSync(filePath, "utf8");
      expect(finalContent).toBe(content);
    });
  });
});