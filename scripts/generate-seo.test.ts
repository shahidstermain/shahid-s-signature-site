import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { writeFile, mkdir, rm } from "node:fs/promises";
import { readFile, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const readFileAsync = promisify(readFile);

// Import the functions being tested
import { generateRSSFeed, generateJSONFeed } from "../src/lib/rss";
import { generateSitemap, generateRobotsTxt } from "../src/lib/sitemap";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const testPublicDir = path.join(rootDir, "public-test");

describe("generate-seo script", () => {
  beforeEach(async () => {
    // Create test directory
    await mkdir(testPublicDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up test directory
    if (existsSync(testPublicDir)) {
      await rm(testPublicDir, { recursive: true, force: true });
    }
  });

  describe("file generation", () => {
    it("should generate sitemap.xml file", async () => {
      const sitemap = generateSitemap();
      const filePath = path.join(testPublicDir, "sitemap.xml");

      await writeFile(filePath, sitemap, "utf8");

      expect(existsSync(filePath)).toBe(true);
      const content = await readFileAsync(filePath, "utf8");
      expect(content).toContain('<?xml version="1.0"');
      expect(content).toContain("<urlset");
    });

    it("should generate rss.xml file", async () => {
      const rss = generateRSSFeed();
      const filePath = path.join(testPublicDir, "rss.xml");

      await writeFile(filePath, rss, "utf8");

      expect(existsSync(filePath)).toBe(true);
      const content = await readFileAsync(filePath, "utf8");
      expect(content).toContain('<?xml version="1.0"');
      expect(content).toContain("<rss");
    });

    it("should generate feed.json file", async () => {
      const feed = generateJSONFeed();
      const filePath = path.join(testPublicDir, "feed.json");

      await writeFile(filePath, feed, "utf8");

      expect(existsSync(filePath)).toBe(true);
      const content = await readFileAsync(filePath, "utf8");
      const parsed = JSON.parse(content);
      expect(parsed.version).toBe("https://jsonfeed.org/version/1.1");
    });

    it("should generate robots.txt file", async () => {
      const robots = generateRobotsTxt();
      const filePath = path.join(testPublicDir, "robots.txt");

      await writeFile(filePath, robots, "utf8");

      expect(existsSync(filePath)).toBe(true);
      const content = await readFileAsync(filePath, "utf8");
      expect(content).toContain("User-agent: *");
      expect(content).toContain("Sitemap:");
    });
  });

  describe("content validation", () => {
    it("should generate valid XML for sitemap", async () => {
      const sitemap = generateSitemap();
      const filePath = path.join(testPublicDir, "sitemap.xml");

      await writeFile(filePath, sitemap, "utf8");

      const content = await readFileAsync(filePath, "utf8");

      // Basic XML validation
      expect(content.startsWith('<?xml version="1.0"')).toBe(true);
      expect(content).toContain("<urlset");
      expect(content).toContain("</urlset>");

      // Check for valid structure
      const urlCount = (content.match(/<url>/g) || []).length;
      const urlCloseCount = (content.match(/<\/url>/g) || []).length;
      expect(urlCount).toBe(urlCloseCount);
    });

    it("should generate valid XML for RSS", async () => {
      const rss = generateRSSFeed();
      const filePath = path.join(testPublicDir, "rss.xml");

      await writeFile(filePath, rss, "utf8");

      const content = await readFileAsync(filePath, "utf8");

      expect(content.startsWith('<?xml version="1.0"')).toBe(true);
      expect(content).toContain("<rss");
      expect(content).toContain("</rss>");
      expect(content).toContain("<channel>");
      expect(content).toContain("</channel>");
    });

    it("should generate valid JSON for feed", async () => {
      const feed = generateJSONFeed();
      const filePath = path.join(testPublicDir, "feed.json");

      await writeFile(filePath, feed, "utf8");

      const content = await readFileAsync(filePath, "utf8");

      // Should be valid JSON
      expect(() => JSON.parse(content)).not.toThrow();

      const parsed = JSON.parse(content);
      expect(parsed).toHaveProperty("version");
      expect(parsed).toHaveProperty("title");
      expect(parsed).toHaveProperty("items");
      expect(Array.isArray(parsed.items)).toBe(true);
    });

    it("should generate valid robots.txt format", async () => {
      const robots = generateRobotsTxt();
      const filePath = path.join(testPublicDir, "robots.txt");

      await writeFile(filePath, robots, "utf8");

      const content = await readFileAsync(filePath, "utf8");
      const lines = content.split("\n");

      expect(lines[0]).toBe("User-agent: *");
      expect(lines[1]).toBe("Allow: /");
      expect(lines[3]).toContain("Sitemap:");
    });
  });

  describe("concurrent file generation", () => {
    it("should generate all files concurrently", async () => {
      const outputs = [
        { name: "sitemap.xml", contents: generateSitemap() },
        { name: "rss.xml", contents: generateRSSFeed() },
        { name: "feed.json", contents: generateJSONFeed() },
        { name: "robots.txt", contents: generateRobotsTxt() },
      ];

      await Promise.all(
        outputs.map((output) =>
          writeFile(path.join(testPublicDir, output.name), output.contents, "utf8")
        )
      );

      // Verify all files exist
      outputs.forEach((output) => {
        expect(existsSync(path.join(testPublicDir, output.name))).toBe(true);
      });
    });

    it("should create directory if it doesn't exist", async () => {
      const nestedDir = path.join(testPublicDir, "nested", "deep");
      await mkdir(nestedDir, { recursive: true });

      expect(existsSync(nestedDir)).toBe(true);
    });
  });

  describe("integration test", () => {
    it("should complete full SEO asset generation workflow", async () => {
      // Simulate the main script workflow
      const outputs = [
        { name: "sitemap.xml", contents: generateSitemap() },
        { name: "rss.xml", contents: generateRSSFeed() },
        { name: "feed.json", contents: generateJSONFeed() },
        { name: "robots.txt", contents: generateRobotsTxt() },
      ];

      await mkdir(testPublicDir, { recursive: true });

      await Promise.all(
        outputs.map((output) =>
          writeFile(path.join(testPublicDir, output.name), output.contents, "utf8")
        )
      );

      // Verify all files were created
      const fileList = outputs.map((output) => output.name);
      fileList.forEach((filename) => {
        const filePath = path.join(testPublicDir, filename);
        expect(existsSync(filePath)).toBe(true);
      });

      // Verify content is not empty
      for (const output of outputs) {
        const filePath = path.join(testPublicDir, output.name);
        const content = await readFileAsync(filePath, "utf8");
        expect(content.length).toBeGreaterThan(0);
      }
    });

    it("should generate files with correct encoding", async () => {
      const sitemap = generateSitemap();
      const filePath = path.join(testPublicDir, "sitemap.xml");

      await writeFile(filePath, sitemap, "utf8");

      const content = await readFileAsync(filePath, "utf8");
      expect(content).toContain('encoding="UTF-8"');
    });
  });

  describe("error handling", () => {
    it("should handle writeFile errors gracefully", async () => {
      // Try to write to an invalid path
      const invalidPath = "/root/invalid-path/file.xml";

      await expect(
        writeFile(invalidPath, "content", "utf8")
      ).rejects.toThrow();
    });

    it("should create parent directories recursively", async () => {
      const nestedPath = path.join(testPublicDir, "a", "b", "c");
      await mkdir(nestedPath, { recursive: true });

      expect(existsSync(nestedPath)).toBe(true);
    });
  });

  describe("output format validation", () => {
    it("should generate sitemap with all required URLs", async () => {
      const sitemap = generateSitemap();

      // Should include homepage
      expect(sitemap).toContain("https://shahidster.tech");

      // Should include blog posts
      expect(sitemap).toContain("/blog/");
    });

    it("should generate RSS with proper namespaces", async () => {
      const rss = generateRSSFeed();

      expect(rss).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
      expect(rss).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    });

    it("should generate JSON feed with correct version", async () => {
      const feed = generateJSONFeed();
      const parsed = JSON.parse(feed);

      expect(parsed.version).toBe("https://jsonfeed.org/version/1.1");
    });

    it("should generate robots.txt with sitemap reference", async () => {
      const robots = generateRobotsTxt();

      expect(robots).toContain("Sitemap: https://shahidster.tech/sitemap.xml");
    });
  });

  describe("performance", () => {
    it("should generate all files quickly", async () => {
      const startTime = Date.now();

      const outputs = [
        { name: "sitemap.xml", contents: generateSitemap() },
        { name: "rss.xml", contents: generateRSSFeed() },
        { name: "feed.json", contents: generateJSONFeed() },
        { name: "robots.txt", contents: generateRobotsTxt() },
      ];

      await Promise.all(
        outputs.map((output) =>
          writeFile(path.join(testPublicDir, output.name), output.contents, "utf8")
        )
      );

      const duration = Date.now() - startTime;

      // Should complete in reasonable time (under 1 second for small dataset)
      expect(duration).toBeLessThan(1000);
    });
  });
});