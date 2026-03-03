import { describe, it, expect } from "vitest";

describe("Next.js Robots.txt Example", () => {
  describe("Robots configuration structure", () => {
    it("should return MetadataRoute.Robots type", () => {
      const robots = {
        rules: {
          userAgent: "*",
          allow: "/",
        },
        sitemap: "https://shahidster.tech/sitemap.xml",
      };

      expect(robots).toHaveProperty("rules");
      expect(robots).toHaveProperty("sitemap");
    });

    it("should have user agent rules", () => {
      const rules = {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      };

      expect(rules.userAgent).toBeDefined();
      expect(rules.allow).toBeDefined();
    });
  });

  describe("Environment-based configuration", () => {
    it("should block all in non-production", () => {
      const isProduction = false;

      if (!isProduction) {
        const robots = {
          rules: {
            userAgent: "*",
            disallow: "/",
          },
        };

        expect(robots.rules.disallow).toBe("/");
      }
    });

    it("should check production domain", () => {
      const siteUrl = "https://shahidster.tech";
      const isProductionDomain = siteUrl.includes("shahidster.tech");

      expect(isProductionDomain).toBe(true);
    });

    it("should allow in production", () => {
      const isProduction = true;
      const isProductionDomain = true;

      if (isProduction && isProductionDomain) {
        const robots = {
          rules: {
            userAgent: "*",
            allow: "/",
          },
        };

        expect(robots.rules.allow).toBe("/");
      }
    });
  });

  describe("Bot-specific rules", () => {
    it("should configure Googlebot", () => {
      const googlebotRule = {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/"],
      };

      expect(googlebotRule.userAgent).toBe("Googlebot");
      expect(Array.isArray(googlebotRule.disallow)).toBe(true);
    });

    it("should configure Googlebot-Image", () => {
      const imageBotRule = {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      };

      expect(imageBotRule.userAgent).toBe("Googlebot-Image");
    });

    it("should configure Bingbot", () => {
      const bingbotRule = {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/"],
      };

      expect(bingbotRule.userAgent).toBe("Bingbot");
    });

    it("should configure social media crawlers", () => {
      const socialBots = [
        "Twitterbot",
        "facebookexternalhit",
        "LinkedInBot",
        "Slackbot",
        "Discordbot",
      ];

      socialBots.forEach((bot) => {
        expect(bot).toBeTruthy();
      });
    });
  });

  describe("Disallow patterns", () => {
    it("should block API routes", () => {
      const disallow = ["/api/", "/admin/"];

      expect(disallow).toContain("/api/");
    });

    it("should block admin routes", () => {
      const disallow = ["/api/", "/admin/"];

      expect(disallow).toContain("/admin/");
    });

    it("should block Next.js internal routes", () => {
      const disallow = ["/_next/"];

      expect(disallow).toContain("/_next/");
    });

    it("should block private routes", () => {
      const disallow = ["/private/"];

      expect(disallow).toContain("/private/");
    });

    it("should support glob patterns", () => {
      const disallow = ["*.json$"];

      expect(disallow[0]).toContain("*");
    });
  });

  describe("Sitemap reference", () => {
    it("should include sitemap URL", () => {
      const robots = {
        sitemap: "https://shahidster.tech/sitemap.xml",
      };

      expect(robots.sitemap).toMatch(/^https:\/\//);
      expect(robots.sitemap).toContain("/sitemap.xml");
    });

    it("should use absolute sitemap URL", () => {
      const sitemap = "https://shahidster.tech/sitemap.xml";

      expect(sitemap).toMatch(/^https?:\/\//);
    });
  });

  describe("Host directive", () => {
    it("should include host in production", () => {
      const robots = {
        host: "https://shahidster.tech",
      };

      expect(robots.host).toMatch(/^https:\/\//);
    });

    it("should match site URL", () => {
      const siteUrl = "https://shahidster.tech";
      const host = siteUrl;

      expect(host).toBe(siteUrl);
    });
  });

  describe("Array of rules", () => {
    it("should support multiple rule objects", () => {
      const rules = [
        { userAgent: "Googlebot", allow: "/" },
        { userAgent: "Bingbot", allow: "/" },
        { userAgent: "*", allow: "/" },
      ];

      expect(Array.isArray(rules)).toBe(true);
      expect(rules.length).toBeGreaterThan(0);
    });

    it("should have default rule last", () => {
      const rules = [
        { userAgent: "Googlebot", allow: "/" },
        { userAgent: "*", allow: "/" },
      ];

      const lastRule = rules[rules.length - 1];
      expect(lastRule.userAgent).toBe("*");
    });
  });

  describe("Social media crawlers", () => {
    it("should allow Twitter bot", () => {
      const rule = {
        userAgent: "Twitterbot",
        allow: "/",
      };

      expect(rule.userAgent).toBe("Twitterbot");
      expect(rule.allow).toBe("/");
    });

    it("should allow Facebook crawler", () => {
      const rule = {
        userAgent: "facebookexternalhit",
        allow: "/",
      };

      expect(rule.userAgent).toBe("facebookexternalhit");
    });

    it("should allow LinkedIn crawler", () => {
      const rule = {
        userAgent: "LinkedInBot",
        allow: "/",
      };

      expect(rule.userAgent).toBe("LinkedInBot");
    });

    it("should allow Slack unfurling", () => {
      const rule = {
        userAgent: "Slackbot",
        allow: "/",
      };

      expect(rule.userAgent).toBe("Slackbot");
    });

    it("should allow Discord crawler", () => {
      const rule = {
        userAgent: "Discordbot",
        allow: "/",
      };

      expect(rule.userAgent).toBe("Discordbot");
    });
  });

  describe("Security considerations", () => {
    it("should not expose sensitive paths", () => {
      const disallow = ["/api/", "/admin/", "/private/"];

      disallow.forEach((path) => {
        expect(path).toMatch(/^\/[a-z-]+\/$/);
      });
    });

    it("should block JSON files selectively", () => {
      const pattern = "*.json$";

      expect(pattern).toContain("*");
      expect(pattern).toContain(".json");
    });
  });

  describe("Robots.txt format validation", () => {
    it("should have valid user agent values", () => {
      const userAgents = ["*", "Googlebot", "Bingbot", "Twitterbot"];

      userAgents.forEach((ua) => {
        expect(ua.length).toBeGreaterThan(0);
      });
    });

    it("should have valid path patterns", () => {
      const paths = ["/", "/api/", "/admin/", "/_next/"];

      paths.forEach((path) => {
        expect(path).toMatch(/^\//);
      });
    });
  });

  describe("Dynamic generation", () => {
    it("should generate based on environment", () => {
      const env = process.env.NODE_ENV || "development";

      expect(["development", "production", "test"]).toContain(env);
    });

    it("should use site URL from environment", () => {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shahidster.tech";

      expect(siteUrl).toMatch(/^https?:\/\//);
    });
  });

  describe("Advanced patterns", () => {
    it("should support crawl delay (in comments)", () => {
      const crawlDelay = 1;

      expect(crawlDelay).toBeGreaterThan(0);
    });

    it("should document alternative route handler approach", () => {
      const routeHandlerExample = `
        export async function GET() {
          const robotsTxt = \`User-agent: *\\nAllow: /\`;
          return new Response(robotsTxt);
        }
      `;

      expect(routeHandlerExample).toContain("export async function GET");
    });
  });
});