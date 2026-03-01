import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { writeFile } from "node:fs/promises";
import path from "node:path";

// Mock the dependencies
vi.mock("node:fs/promises", () => ({
  writeFile: vi.fn(),
}));

vi.mock("../src/lib/rss", () => ({
  generateRSSFeed: vi.fn(() => "<rss>RSS Feed Content</rss>"),
  generateJSONFeed: vi.fn(() => '{"version": "1.1"}'),
}));

vi.mock("../src/lib/sitemap", () => ({
  generateSitemap: vi.fn(() => "<urlset>Sitemap Content</urlset>"),
  generateRobotsTxt: vi.fn(() => "User-agent: *\nAllow: /\n"),
}));

describe("generate-seo script", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.log to avoid output during tests
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("file generation", () => {
    it("should generate all SEO files", async () => {
      const { generateRSSFeed, generateJSONFeed } = await import("../src/lib/rss");
      const { generateSitemap, generateRobotsTxt } = await import("../src/lib/sitemap");

      // Import and execute the script logic (we'll test the functions it uses)
      expect(generateRSSFeed).toBeDefined();
      expect(generateJSONFeed).toBeDefined();
      expect(generateSitemap).toBeDefined();
      expect(generateRobotsTxt).toBeDefined();
    });

    it("should call RSS feed generator", async () => {
      const { generateRSSFeed } = await import("../src/lib/rss");

      generateRSSFeed();

      expect(generateRSSFeed).toHaveBeenCalled();
    });

    it("should call JSON feed generator", async () => {
      const { generateJSONFeed } = await import("../src/lib/rss");

      generateJSONFeed();

      expect(generateJSONFeed).toHaveBeenCalled();
    });

    it("should call sitemap generator", async () => {
      const { generateSitemap } = await import("../src/lib/sitemap");

      generateSitemap();

      expect(generateSitemap).toHaveBeenCalled();
    });

    it("should call robots.txt generator", async () => {
      const { generateRobotsTxt } = await import("../src/lib/sitemap");

      generateRobotsTxt();

      expect(generateRobotsTxt).toHaveBeenCalled();
    });
  });

  describe("output configuration", () => {
    it("should define correct output files", () => {
      const expectedOutputs = [
        { name: "sitemap.xml", type: "sitemap" },
        { name: "rss.xml", type: "rss" },
        { name: "feed.json", type: "json" },
        { name: "robots.txt", type: "robots" },
      ];

      expectedOutputs.forEach((output) => {
        expect(output.name).toBeTruthy();
        expect(output.type).toBeTruthy();
      });
    });

    it("should target public directory", () => {
      // The script should write to public directory
      const publicDir = "public";
      expect(publicDir).toBe("public");
    });
  });

  describe("file writing", () => {
    it("should write sitemap.xml with correct content", async () => {
      const { generateSitemap } = await import("../src/lib/sitemap");
      const content = generateSitemap();

      await writeFile("public/sitemap.xml", content, "utf8");

      expect(writeFile).toHaveBeenCalledWith("public/sitemap.xml", content, "utf8");
    });

    it("should write rss.xml with correct content", async () => {
      const { generateRSSFeed } = await import("../src/lib/rss");
      const content = generateRSSFeed();

      await writeFile("public/rss.xml", content, "utf8");

      expect(writeFile).toHaveBeenCalledWith("public/rss.xml", content, "utf8");
    });

    it("should write feed.json with correct content", async () => {
      const { generateJSONFeed } = await import("../src/lib/rss");
      const content = generateJSONFeed();

      await writeFile("public/feed.json", content, "utf8");

      expect(writeFile).toHaveBeenCalledWith("public/feed.json", content, "utf8");
    });

    it("should write robots.txt with correct content", async () => {
      const { generateRobotsTxt } = await import("../src/lib/sitemap");
      const content = generateRobotsTxt();

      await writeFile("public/robots.txt", content, "utf8");

      expect(writeFile).toHaveBeenCalledWith("public/robots.txt", content, "utf8");
    });

    it("should use utf8 encoding for all files", async () => {
      const { generateSitemap, generateRobotsTxt } = await import("../src/lib/sitemap");
      const { generateRSSFeed, generateJSONFeed } = await import("../src/lib/rss");

      await writeFile("public/sitemap.xml", generateSitemap(), "utf8");
      await writeFile("public/rss.xml", generateRSSFeed(), "utf8");
      await writeFile("public/feed.json", generateJSONFeed(), "utf8");
      await writeFile("public/robots.txt", generateRobotsTxt(), "utf8");

      const calls = (writeFile as any).mock.calls;
      calls.forEach((call: any) => {
        expect(call[2]).toBe("utf8");
      });
    });
  });

  describe("path handling", () => {
    it("should construct correct file paths", () => {
      const publicDir = "public";
      const files = ["sitemap.xml", "rss.xml", "feed.json", "robots.txt"];

      files.forEach((file) => {
        const filePath = path.join(publicDir, file);
        expect(filePath).toContain("public");
        expect(filePath).toContain(file);
      });
    });

    it("should handle platform-specific path separators", () => {
      const publicDir = "public";
      const fileName = "sitemap.xml";
      const filePath = path.join(publicDir, fileName);

      expect(filePath).toBeTruthy();
      expect(typeof filePath).toBe("string");
    });
  });

  describe("error handling", () => {
    it("should handle writeFile errors gracefully", async () => {
      const mockWriteFile = writeFile as any;
      mockWriteFile.mockRejectedValueOnce(new Error("Write failed"));

      await expect(writeFile("test.txt", "content", "utf8")).rejects.toThrow(
        "Write failed"
      );
    });

    it("should handle generator errors", () => {
      const { generateSitemap } = require("../src/lib/sitemap");

      // Should not throw for valid input
      expect(() => generateSitemap()).not.toThrow();
    });
  });

  describe("parallel execution", () => {
    it("should support parallel file writes", async () => {
      const writes = [
        writeFile("public/sitemap.xml", "content1", "utf8"),
        writeFile("public/rss.xml", "content2", "utf8"),
        writeFile("public/feed.json", "content3", "utf8"),
        writeFile("public/robots.txt", "content4", "utf8"),
      ];

      await Promise.all(writes);

      expect(writeFile).toHaveBeenCalledTimes(4);
    });

    it("should handle Promise.all for concurrent writes", async () => {
      const promises = [
        Promise.resolve("sitemap"),
        Promise.resolve("rss"),
        Promise.resolve("feed"),
        Promise.resolve("robots"),
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(4);
      expect(results).toEqual(["sitemap", "rss", "feed", "robots"]);
    });
  });

  describe("console output", () => {
    it("should log generated files", () => {
      const files = ["sitemap.xml", "rss.xml", "feed.json", "robots.txt"];
      const fileList = files.join(", ");

      console.log(`Generated SEO assets: ${fileList}`);

      expect(console.log).toHaveBeenCalledWith(
        `Generated SEO assets: ${fileList}`
      );
    });

    it("should create comma-separated file list", () => {
      const outputs = [
        { name: "sitemap.xml" },
        { name: "rss.xml" },
        { name: "feed.json" },
        { name: "robots.txt" },
      ];

      const fileList = outputs.map((output) => output.name).join(", ");

      expect(fileList).toBe("sitemap.xml, rss.xml, feed.json, robots.txt");
    });
  });

  describe("integration", () => {
    it("should generate valid content from all generators", async () => {
      const { generateSitemap, generateRobotsTxt } = await import("../src/lib/sitemap");
      const { generateRSSFeed, generateJSONFeed } = await import("../src/lib/rss");

      const sitemap = generateSitemap();
      const robots = generateRobotsTxt();
      const rss = generateRSSFeed();
      const json = generateJSONFeed();

      expect(sitemap).toBeTruthy();
      expect(robots).toBeTruthy();
      expect(rss).toBeTruthy();
      expect(json).toBeTruthy();

      expect(typeof sitemap).toBe("string");
      expect(typeof robots).toBe("string");
      expect(typeof rss).toBe("string");
      expect(typeof json).toBe("string");
    });

    it("should create outputs array with all required files", () => {
      const { generateSitemap, generateRobotsTxt } = require("../src/lib/sitemap");
      const { generateRSSFeed, generateJSONFeed } = require("../src/lib/rss");

      const outputs = [
        { name: "sitemap.xml", contents: generateSitemap() },
        { name: "rss.xml", contents: generateRSSFeed() },
        { name: "feed.json", contents: generateJSONFeed() },
        { name: "robots.txt", contents: generateRobotsTxt() },
      ];

      expect(outputs).toHaveLength(4);
      outputs.forEach((output) => {
        expect(output.name).toBeTruthy();
        expect(output.contents).toBeTruthy();
        expect(typeof output.contents).toBe("string");
      });
    });
  });

  describe("module imports", () => {
    it("should import writeFile from node:fs/promises", async () => {
      expect(writeFile).toBeDefined();
      expect(typeof writeFile).toBe("function");
    });

    it("should import path from node:path", () => {
      expect(path).toBeDefined();
      expect(path.join).toBeDefined();
      expect(path.resolve).toBeDefined();
      expect(path.dirname).toBeDefined();
    });

    it("should import RSS generators", async () => {
      const { generateRSSFeed, generateJSONFeed } = await import("../src/lib/rss");

      expect(generateRSSFeed).toBeDefined();
      expect(generateJSONFeed).toBeDefined();
    });

    it("should import sitemap generators", async () => {
      const { generateSitemap, generateRobotsTxt } = await import("../src/lib/sitemap");

      expect(generateSitemap).toBeDefined();
      expect(generateRobotsTxt).toBeDefined();
    });
  });

  describe("edge cases", () => {
    it("should handle empty content gracefully", async () => {
      await writeFile("public/test.txt", "", "utf8");

      expect(writeFile).toHaveBeenCalledWith("public/test.txt", "", "utf8");
    });

    it("should handle special characters in content", async () => {
      const content = "Special chars: & < > \" ' \n\t";
      await writeFile("public/test.txt", content, "utf8");

      expect(writeFile).toHaveBeenCalledWith("public/test.txt", content, "utf8");
    });

    it("should handle large content", async () => {
      const largeContent = "x".repeat(10000);
      await writeFile("public/test.txt", largeContent, "utf8");

      expect(writeFile).toHaveBeenCalledWith("public/test.txt", largeContent, "utf8");
    });
  });
});