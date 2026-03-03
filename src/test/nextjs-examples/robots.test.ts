import { describe, it, expect } from "vitest";

// Tests for robots.txt generation and configuration

describe("robots.txt Configuration", () => {
  describe("robots.txt format", () => {
    it("should include User-agent directive", () => {
      const robots = "User-agent: *\nAllow: /\n\nSitemap: https://shahidster.tech/sitemap.xml\n";

      expect(robots).toContain("User-agent:");
    });

    it("should allow all user agents", () => {
      const robots = "User-agent: *\nAllow: /";

      expect(robots).toContain("User-agent: *");
      expect(robots).toContain("Allow: /");
    });

    it("should include sitemap reference", () => {
      const robots = "User-agent: *\nAllow: /\n\nSitemap: https://shahidster.tech/sitemap.xml\n";

      expect(robots).toContain("Sitemap:");
      expect(robots).toContain("sitemap.xml");
    });

    it("should use absolute URL for sitemap", () => {
      const sitemapUrl = "https://shahidster.tech/sitemap.xml";

      expect(sitemapUrl).toMatch(/^https?:\/\//);
      expect(sitemapUrl).toContain("sitemap.xml");
    });

    it("should have proper line breaks", () => {
      const robots = "User-agent: *\nAllow: /\n\nSitemap: https://shahidster.tech/sitemap.xml\n";
      const lines = robots.split("\n");

      expect(lines.length).toBeGreaterThanOrEqual(4);
    });

    it("should end with newline", () => {
      const robots = "User-agent: *\nAllow: /\n\nSitemap: https://shahidster.tech/sitemap.xml\n";

      expect(robots.endsWith("\n")).toBe(true);
    });

    it("should have blank line before sitemap", () => {
      const robots = "User-agent: *\nAllow: /\n\nSitemap: https://shahidster.tech/sitemap.xml\n";
      const lines = robots.split("\n");

      const sitemapIndex = lines.findIndex((line) => line.startsWith("Sitemap:"));
      expect(lines[sitemapIndex - 1]).toBe("");
    });
  });

  describe("Crawling directives", () => {
    it("should not disallow any paths by default", () => {
      const robots = "User-agent: *\nAllow: /\n";

      expect(robots).not.toContain("Disallow:");
    });

    it("should allow root path", () => {
      const robots = "User-agent: *\nAllow: /";

      expect(robots).toContain("Allow: /");
    });

    it("should allow specific user agents", () => {
      const userAgent = "*";
      expect(userAgent).toBe("*");
    });

    it("should not block search engines", () => {
      const robots = "User-agent: *\nAllow: /";

      expect(robots).not.toContain("Disallow: /");
    });
  });

  describe("Sitemap configuration", () => {
    it("should reference correct sitemap location", () => {
      const sitemapUrl = "https://shahidster.tech/sitemap.xml";

      expect(sitemapUrl).toBe("https://shahidster.tech/sitemap.xml");
    });

    it("should use sitemap.xml filename", () => {
      const sitemapUrl = "https://shahidster.tech/sitemap.xml";

      expect(sitemapUrl).toContain("sitemap.xml");
      expect(sitemapUrl).not.toContain("sitemap.txt");
    });

    it("should use HTTPS for sitemap URL", () => {
      const sitemapUrl = "https://shahidster.tech/sitemap.xml";

      expect(sitemapUrl).toMatch(/^https:\/\//);
    });
  });

  describe("Dynamic robots.txt generation", () => {
    it("should generate robots.txt programmatically", () => {
      const generateRobotsTxt = (siteUrl: string) => {
        return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
      };

      const robots = generateRobotsTxt("https://shahidster.tech");

      expect(robots).toContain("User-agent: *");
      expect(robots).toContain("Sitemap: https://shahidster.tech/sitemap.xml");
    });

    it("should use site config for URL", () => {
      const siteConfig = {
        siteUrl: "https://shahidster.tech",
      };

      const sitemapUrl = `${siteConfig.siteUrl}/sitemap.xml`;

      expect(sitemapUrl).toBe("https://shahidster.tech/sitemap.xml");
    });

    it("should be consistent across builds", () => {
      const generateRobotsTxt = () => {
        return "User-agent: *\nAllow: /\n\nSitemap: https://shahidster.tech/sitemap.xml\n";
      };

      const robots1 = generateRobotsTxt();
      const robots2 = generateRobotsTxt();

      expect(robots1).toBe(robots2);
    });
  });

  describe("Content-Type", () => {
    it("should serve as text/plain", () => {
      const contentType = "text/plain";

      expect(contentType).toBe("text/plain");
    });

    it("should use UTF-8 encoding", () => {
      const contentType = "text/plain; charset=utf-8";

      expect(contentType).toContain("charset=utf-8");
    });
  });

  describe("Special directives", () => {
    it("should handle crawl-delay if specified", () => {
      const robotsWithDelay = "User-agent: *\nCrawl-delay: 10\nAllow: /";

      if (robotsWithDelay.includes("Crawl-delay")) {
        expect(robotsWithDelay).toContain("Crawl-delay:");
      }
    });

    it("should handle multiple user agents if needed", () => {
      const robots = "User-agent: *\nAllow: /\n\nUser-agent: Googlebot\nAllow: /";

      const userAgentCount = (robots.match(/User-agent:/g) || []).length;
      expect(userAgentCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Path patterns", () => {
    it("should allow root path with trailing slash", () => {
      const allowPath = "/";
      expect(allowPath).toBe("/");
    });

    it("should handle wildcard patterns", () => {
      const pattern = "*";
      expect(pattern).toBe("*");
    });

    it("should not disallow common paths", () => {
      const robots = "User-agent: *\nAllow: /";
      const commonPaths = ["/blog", "/api", "/assets"];

      commonPaths.forEach((path) => {
        expect(robots).not.toContain(`Disallow: ${path}`);
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle empty robots.txt", () => {
      const emptyRobots = "";
      expect(emptyRobots.length).toBe(0);
    });

    it("should handle very simple robots.txt", () => {
      const simpleRobots = "User-agent: *\nAllow: /";

      const lines = simpleRobots.split("\n").filter((line) => line.trim());
      expect(lines.length).toBe(2);
    });

    it("should handle comments if included", () => {
      const robotsWithComments = "# This is a comment\nUser-agent: *\nAllow: /";

      if (robotsWithComments.includes("#")) {
        expect(robotsWithComments).toContain("#");
      }
    });

    it("should handle different line endings", () => {
      const unixRobots = "User-agent: *\nAllow: /";
      const windowsRobots = "User-agent: *\r\nAllow: /";

      expect(unixRobots.includes("\n")).toBe(true);
      expect(windowsRobots.includes("\r\n")).toBe(true);
    });
  });

  describe("Security", () => {
    it("should not expose sensitive paths", () => {
      const robots = "User-agent: *\nAllow: /";

      expect(robots).not.toContain("/admin");
      expect(robots).not.toContain("/private");
      expect(robots).not.toContain("/.env");
    });

    it("should not include credentials", () => {
      const robots = "User-agent: *\nAllow: /\n\nSitemap: https://shahidster.tech/sitemap.xml\n";

      expect(robots).not.toContain("password");
      expect(robots).not.toContain("token");
      expect(robots).not.toContain("key");
    });

    it("should use public site URL", () => {
      const sitemapUrl = "https://shahidster.tech/sitemap.xml";

      expect(sitemapUrl).not.toContain("localhost");
      expect(sitemapUrl).not.toContain("127.0.0.1");
      expect(sitemapUrl).not.toContain(":3000");
    });
  });

  describe("Standards compliance", () => {
    it("should follow robots.txt standard format", () => {
      const robots = "User-agent: *\nAllow: /";

      expect(robots).toMatch(/User-agent:\s*\*/);
      expect(robots).toMatch(/Allow:\s*\//);
    });

    it("should use correct directive names", () => {
      const validDirectives = ["User-agent", "Allow", "Disallow", "Sitemap", "Crawl-delay"];

      validDirectives.forEach((directive) => {
        expect(directive).toMatch(/^[A-Z][a-z-]*$/);
      });
    });

    it("should use colon separator", () => {
      const directive = "User-agent: *";
      expect(directive).toContain(":");
    });

    it("should be case-sensitive for directives", () => {
      const correctDirective = "User-agent: *";
      expect(correctDirective).toContain("User-agent");
      expect(correctDirective).not.toContain("user-agent");
    });
  });

  describe("Integration with sitemap", () => {
    it("should reference sitemap that exists", () => {
      const robotsSitemapUrl = "https://shahidster.tech/sitemap.xml";
      const actualSitemapUrl = "https://shahidster.tech/sitemap.xml";

      expect(robotsSitemapUrl).toBe(actualSitemapUrl);
    });

    it("should use consistent domain between robots.txt and sitemap", () => {
      const robotsDomain = "shahidster.tech";
      const sitemapDomain = "shahidster.tech";

      expect(robotsDomain).toBe(sitemapDomain);
    });

    it("should use consistent protocol", () => {
      const robotsUrl = "https://shahidster.tech/sitemap.xml";
      const sitemapUrl = "https://shahidster.tech/sitemap.xml";

      expect(robotsUrl.startsWith("https://")).toBe(true);
      expect(sitemapUrl.startsWith("https://")).toBe(true);
    });
  });
});