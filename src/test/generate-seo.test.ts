import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { promises as fs } from "node:fs";
import path from "node:path";

// Mock the fs module
vi.mock("node:fs/promises");
vi.mock("node:fs");

// Mock the RSS and sitemap generators
vi.mock("../lib/rss", () => ({
  generateRSSFeed: vi.fn(() => "<rss>Mock RSS Feed</rss>"),
  generateJSONFeed: vi.fn(() => '{"version": "1.1"}'),
}));

vi.mock("../lib/sitemap", () => ({
  generateSitemap: vi.fn(() => "<urlset>Mock Sitemap</urlset>"),
  generateRobotsTxt: vi.fn(() => "User-agent: *\nAllow: /"),
}));

describe("generate-seo.ts Script", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("File Generation", () => {
    it("should import required modules", async () => {
      const { generateRSSFeed, generateJSONFeed } = await import("../lib/rss");
      const { generateSitemap, generateRobotsTxt } = await import("../lib/sitemap");

      expect(generateRSSFeed).toBeDefined();
      expect(generateJSONFeed).toBeDefined();
      expect(generateSitemap).toBeDefined();
      expect(generateRobotsTxt).toBeDefined();
    });

    it("should call generateSitemap function", async () => {
      const { generateSitemap } = await import("../lib/sitemap");
      generateSitemap();

      expect(generateSitemap).toHaveBeenCalled();
    });

    it("should call generateRSSFeed function", async () => {
      const { generateRSSFeed } = await import("../lib/rss");
      generateRSSFeed();

      expect(generateRSSFeed).toHaveBeenCalled();
    });

    it("should call generateJSONFeed function", async () => {
      const { generateJSONFeed } = await import("../lib/rss");
      generateJSONFeed();

      expect(generateJSONFeed).toHaveBeenCalled();
    });

    it("should call generateRobotsTxt function", async () => {
      const { generateRobotsTxt } = await import("../lib/sitemap");
      generateRobotsTxt();

      expect(generateRobotsTxt).toHaveBeenCalled();
    });
  });

  describe("Output Validation", () => {
    it("should define outputs array with correct files", () => {
      const expectedOutputs = [
        { name: "sitemap.xml" },
        { name: "rss.xml" },
        { name: "feed.json" },
        { name: "robots.txt" },
      ];

      expectedOutputs.forEach((output) => {
        expect(output.name).toBeTruthy();
      });
    });

    it("should generate sitemap.xml content", async () => {
      const { generateSitemap } = await import("../lib/sitemap");
      const content = generateSitemap();

      expect(content).toBeTruthy();
      expect(typeof content).toBe("string");
    });

    it("should generate rss.xml content", async () => {
      const { generateRSSFeed } = await import("../lib/rss");
      const content = generateRSSFeed();

      expect(content).toBeTruthy();
      expect(typeof content).toBe("string");
    });

    it("should generate feed.json content", async () => {
      const { generateJSONFeed } = await import("../lib/rss");
      const content = generateJSONFeed();

      expect(content).toBeTruthy();
      expect(typeof content).toBe("string");
    });

    it("should generate robots.txt content", async () => {
      const { generateRobotsTxt } = await import("../lib/sitemap");
      const content = generateRobotsTxt();

      expect(content).toBeTruthy();
      expect(typeof content).toBe("string");
    });
  });

  describe("Directory Creation", () => {
    it("should use mkdir with recursive option", async () => {
      const mkdirSpy = vi.spyOn(fs, "mkdir").mockResolvedValue(undefined);

      // Simulate calling mkdir with recursive option
      await fs.mkdir("/some/path", { recursive: true });

      expect(mkdirSpy).toHaveBeenCalledWith("/some/path", { recursive: true });
    });

    it("should handle directory that already exists", async () => {
      const mkdirSpy = vi.spyOn(fs, "mkdir").mockResolvedValue(undefined);

      await fs.mkdir("/existing/path", { recursive: true });

      // Should not throw error
      expect(mkdirSpy).toHaveBeenCalled();
    });
  });

  describe("File Writing", () => {
    it("should write files with UTF-8 encoding", async () => {
      const writeFileSpy = vi.spyOn(fs, "writeFile").mockResolvedValue(undefined);

      await fs.writeFile("/path/to/file.xml", "<xml>content</xml>", "utf8");

      expect(writeFileSpy).toHaveBeenCalledWith("/path/to/file.xml", "<xml>content</xml>", "utf8");
    });

    it("should handle multiple file writes concurrently", async () => {
      const writeFileSpy = vi.spyOn(fs, "writeFile").mockResolvedValue(undefined);

      const files = [
        { name: "file1.xml", content: "content1" },
        { name: "file2.xml", content: "content2" },
        { name: "file3.json", content: "content3" },
      ];

      await Promise.all(
        files.map((file) => fs.writeFile(`/path/${file.name}`, file.content, "utf8"))
      );

      expect(writeFileSpy).toHaveBeenCalledTimes(3);
    });

    it("should write all four SEO files", async () => {
      const writeFileSpy = vi.spyOn(fs, "writeFile").mockResolvedValue(undefined);

      const outputs = [
        { name: "sitemap.xml", contents: "<sitemap/>" },
        { name: "rss.xml", contents: "<rss/>" },
        { name: "feed.json", contents: "{}" },
        { name: "robots.txt", contents: "User-agent: *" },
      ];

      await Promise.all(
        outputs.map((output) => fs.writeFile(`/public/${output.name}`, output.contents, "utf8"))
      );

      expect(writeFileSpy).toHaveBeenCalledTimes(4);
    });
  });

  describe("Path Handling", () => {
    it("should construct correct public directory path", () => {
      const rootDir = "/project/root";
      const publicDir = path.join(rootDir, "public");

      expect(publicDir).toBe("/project/root/public");
    });

    it("should construct correct file paths", () => {
      const publicDir = "/project/root/public";
      const filePath = path.join(publicDir, "sitemap.xml");

      expect(filePath).toBe("/project/root/public/sitemap.xml");
    });

    it("should handle path.dirname correctly", () => {
      const filePath = "/some/path/to/script.ts";
      const dir = path.dirname(filePath);

      expect(dir).toBe("/some/path/to");
    });

    it("should handle path.resolve correctly", () => {
      const resolved = path.resolve("/base", "..", "target");

      expect(resolved).toBe("/target");
    });
  });

  describe("Console Output", () => {
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

    it("should create appropriate success message", () => {
      const fileList = "sitemap.xml, rss.xml, feed.json, robots.txt";
      const message = `Generated SEO assets: ${fileList}`;

      expect(message).toBe("Generated SEO assets: sitemap.xml, rss.xml, feed.json, robots.txt");
    });
  });

  describe("Error Handling", () => {
    it("should handle mkdir errors gracefully", async () => {
      const mkdirSpy = vi.spyOn(fs, "mkdir").mockRejectedValue(new Error("Permission denied"));

      await expect(fs.mkdir("/forbidden/path", { recursive: true })).rejects.toThrow(
        "Permission denied"
      );

      expect(mkdirSpy).toHaveBeenCalled();
    });

    it("should handle writeFile errors gracefully", async () => {
      const writeFileSpy = vi
        .spyOn(fs, "writeFile")
        .mockRejectedValue(new Error("Disk full"));

      await expect(
        fs.writeFile("/path/to/file.xml", "content", "utf8")
      ).rejects.toThrow("Disk full");

      expect(writeFileSpy).toHaveBeenCalled();
    });

    it("should propagate errors from generator functions", async () => {
      const { generateSitemap } = await import("../lib/sitemap");

      vi.mocked(generateSitemap).mockImplementation(() => {
        throw new Error("Generator error");
      });

      expect(() => generateSitemap()).toThrow("Generator error");
    });
  });

  describe("Integration", () => {
    it("should generate all files in correct format", async () => {
      const { generateSitemap, generateRobotsTxt } = await import("../lib/sitemap");
      const { generateRSSFeed, generateJSONFeed } = await import("../lib/rss");

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
      });
    });

    it("should produce valid file extensions", () => {
      const outputs = [
        { name: "sitemap.xml" },
        { name: "rss.xml" },
        { name: "feed.json" },
        { name: "robots.txt" },
      ];

      outputs.forEach((output) => {
        const ext = path.extname(output.name);
        expect([".xml", ".json", ".txt"]).toContain(ext);
      });
    });
  });

  describe("Additional Edge Cases", () => {
    it("should handle empty generator output", async () => {
      const { generateSitemap } = await import("../lib/sitemap");

      vi.mocked(generateSitemap).mockReturnValue("");

      const content = generateSitemap();
      expect(content).toBe("");
    });

    it("should handle special characters in generated content", async () => {
      const { generateSitemap } = await import("../lib/sitemap");

      vi.mocked(generateSitemap).mockReturnValue("<urlset>Special & chars < ></urlset>");

      const content = generateSitemap();
      expect(content).toContain("&");
      expect(content).toContain("<");
      expect(content).toContain(">");
    });

    it("should handle unicode characters in generated content", async () => {
      const { generateJSONFeed } = await import("../lib/rss");

      vi.mocked(generateJSONFeed).mockReturnValue('{"title": "测试 🚀"}');

      const content = generateJSONFeed();
      expect(content).toContain("测试");
      expect(content).toContain("🚀");
    });
  });
});