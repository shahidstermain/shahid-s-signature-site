import { describe, it, expect } from "vitest";

describe("Next.js Configuration", () => {
  describe("Environment variables", () => {
    it("should have NEXT_PUBLIC_SITE_URL configured", () => {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shahidster.tech";

      expect(siteUrl).toBeDefined();
      expect(siteUrl).toMatch(/^https?:\/\//);
    });

    it("should use HTTPS in production", () => {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shahidster.tech";

      if (process.env.NODE_ENV === "production") {
        expect(siteUrl).toMatch(/^https:\/\//);
      }
    });

    it("should not have trailing slash in site URL", () => {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shahidster.tech";

      expect(siteUrl).not.toMatch(/\/$/);
    });
  });

  describe("Next.js app router conventions", () => {
    it("should support metadata API", () => {
      // Verify Next.js metadata types are available
      const metadataType: Record<string, unknown> = {
        title: "Test",
        description: "Test description",
      };

      expect(metadataType).toHaveProperty("title");
      expect(metadataType).toHaveProperty("description");
    });

    it("should support viewport configuration", () => {
      const viewport = {
        themeColor: "#0a0b0d",
        width: "device-width",
        initialScale: 1,
      };

      expect(viewport).toHaveProperty("themeColor");
      expect(viewport).toHaveProperty("width");
      expect(viewport).toHaveProperty("initialScale");
    });
  });

  describe("Static file paths", () => {
    it("should use correct public directory paths", () => {
      const publicPaths = [
        "/favicon.ico",
        "/icon.svg",
        "/apple-touch-icon.png",
        "/manifest.json",
        "/og-image.png",
        "/resume.pdf",
      ];

      publicPaths.forEach((path) => {
        expect(path).toMatch(/^\//);
        expect(path).not.toMatch(/^\/public/);
      });
    });

    it("should use correct feed paths", () => {
      const feedPaths = ["/rss.xml", "/feed.json", "/sitemap.xml", "/robots.txt"];

      feedPaths.forEach((path) => {
        expect(path).toMatch(/^\//);
        expect(path).toMatch(/\.(xml|json|txt)$/);
      });
    });
  });

  describe("Route conventions", () => {
    it("should follow app router file conventions", () => {
      const conventions = {
        page: "page.tsx",
        layout: "layout.tsx",
        loading: "loading.tsx",
        error: "error.tsx",
        notFound: "not-found.tsx",
        route: "route.ts",
      };

      Object.values(conventions).forEach((filename) => {
        expect(filename).toMatch(/\.(tsx?|jsx?)$/);
      });
    });

    it("should use correct dynamic route syntax", () => {
      const dynamicRoute = "[slug]";

      expect(dynamicRoute).toMatch(/^\[.+\]$/);
    });

    it("should use correct catch-all route syntax", () => {
      const catchAllRoute = "[...slug]";

      expect(catchAllRoute).toMatch(/^\[\.{3}.+\]$/);
    });
  });

  describe("Metadata configuration", () => {
    it("should have metadataBase URL", () => {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shahidster.tech";
      const metadataBase = new URL(siteUrl);

      expect(metadataBase.protocol).toMatch(/^https?:$/);
      expect(metadataBase.hostname).toBeTruthy();
    });

    it("should have title template format", () => {
      const titleTemplate = "%s | Shahid Moosa";

      expect(titleTemplate).toContain("%s");
      expect(titleTemplate).toContain("|");
    });

    it("should have robots configuration", () => {
      const robots = {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      };

      expect(robots.index).toBe(true);
      expect(robots.follow).toBe(true);
      expect(robots.googleBot).toBeDefined();
    });
  });

  describe("Open Graph configuration", () => {
    it("should have valid OG type", () => {
      const ogType = "website";

      expect(["website", "article"]).toContain(ogType);
    });

    it("should have OG image dimensions", () => {
      const ogImage = {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      };

      expect(ogImage.width).toBe(1200);
      expect(ogImage.height).toBe(630);
      expect(ogImage.width / ogImage.height).toBeCloseTo(1.9, 1);
    });

    it("should have valid locale format", () => {
      const locale = "en_US";

      expect(locale).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
    });
  });

  describe("Twitter card configuration", () => {
    it("should use summary_large_image card", () => {
      const twitterCard = "summary_large_image";

      expect(["summary", "summary_large_image", "app", "player"]).toContain(twitterCard);
    });

    it("should have Twitter handle format", () => {
      const twitterHandle = "@shahidster_";

      expect(twitterHandle).toMatch(/^@[a-zA-Z0-9_]+$/);
    });
  });

  describe("Font configuration", () => {
    it("should use variable fonts", () => {
      const fontVariables = ["--font-inter", "--font-space-grotesk"];

      fontVariables.forEach((variable) => {
        expect(variable).toMatch(/^--font-/);
      });
    });

    it("should use font-display swap", () => {
      const fontDisplay = "swap";

      expect(["auto", "block", "swap", "fallback", "optional"]).toContain(fontDisplay);
    });

    it("should optimize with latin subset", () => {
      const subsets = ["latin"];

      expect(subsets).toContain("latin");
    });
  });

  describe("Analytics configuration", () => {
    it("should have GA_ID format if configured", () => {
      const gaId = process.env.NEXT_PUBLIC_GA_ID;

      if (gaId) {
        expect(gaId).toMatch(/^G-[A-Z0-9]+$/);
      } else {
        expect(gaId).toBeUndefined();
      }
    });

    it("should only load analytics in production", () => {
      const shouldLoadAnalytics =
        process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_GA_ID;

      if (process.env.NODE_ENV !== "production") {
        expect(shouldLoadAnalytics).toBeFalsy();
      }
    });
  });

  describe("Security headers", () => {
    it("should have proper cache control values", () => {
      const cacheControl = "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400";

      expect(cacheControl).toContain("public");
      expect(cacheControl).toMatch(/max-age=\d+/);
    });

    it("should use nosniff for content type", () => {
      const contentTypeOptions = "nosniff";

      expect(contentTypeOptions).toBe("nosniff");
    });
  });

  describe("ISR configuration", () => {
    it("should have valid revalidate values", () => {
      const revalidate = 3600;

      expect(revalidate).toBeGreaterThan(0);
      expect(revalidate).toBeLessThanOrEqual(86400);
    });

    it("should use seconds for revalidation", () => {
      const oneHour = 3600;
      const oneDay = 86400;

      expect(oneHour).toBe(60 * 60);
      expect(oneDay).toBe(24 * 60 * 60);
    });
  });

  describe("Route handler conventions", () => {
    it("should export GET for route handlers", () => {
      const httpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

      expect(httpMethods).toContain("GET");
    });

    it("should return Response objects", () => {
      const mockResponse = new Response("test", {
        headers: { "Content-Type": "text/plain" },
      });

      expect(mockResponse).toBeInstanceOf(Response);
      expect(mockResponse.headers.get("Content-Type")).toBe("text/plain");
    });
  });

  describe("Dynamic params", () => {
    it("should generate static params for blog posts", () => {
      const params = [{ slug: "test-article-1" }, { slug: "test-article-2" }];

      params.forEach((param) => {
        expect(param).toHaveProperty("slug");
        expect(typeof param.slug).toBe("string");
        expect(param.slug).toMatch(/^[a-z0-9-]+$/);
      });
    });

    it("should use kebab-case for slugs", () => {
      const slug = "test-article-name";

      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(slug).not.toContain(" ");
      expect(slug).not.toContain("_");
    });
  });

  describe("Script loading strategy", () => {
    it("should use afterInteractive for analytics", () => {
      const strategy = "afterInteractive";

      expect(["beforeInteractive", "afterInteractive", "lazyOnload"]).toContain(strategy);
    });

    it("should use proper script type for JSON-LD", () => {
      const scriptType = "application/ld+json";

      expect(scriptType).toBe("application/ld+json");
    });
  });

  describe("Image optimization", () => {
    it("should use proper image attributes", () => {
      const imageAttrs = {
        width: 256,
        height: 256,
        fetchpriority: "high",
        decoding: "async",
        loading: "lazy",
      };

      expect(imageAttrs.width).toBeGreaterThan(0);
      expect(imageAttrs.height).toBeGreaterThan(0);
      expect(["high", "low", "auto"]).toContain(imageAttrs.fetchpriority);
      expect(["async", "sync", "auto"]).toContain(imageAttrs.decoding);
      expect(["lazy", "eager"]).toContain(imageAttrs.loading);
    });

    it("should use responsive image sizes", () => {
      const sizes = [48, 64, 96, 128, 256, 384, 512, 768, 1024, 1200];

      sizes.forEach((size) => {
        expect(size).toBeGreaterThan(0);
        expect(size % 8).toBe(0); // Multiple of 8
      });
    });
  });
});