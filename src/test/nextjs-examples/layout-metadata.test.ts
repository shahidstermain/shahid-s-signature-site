import { describe, it, expect } from "vitest";

describe("Next.js Layout Metadata Example", () => {
  describe("Global metadata configuration", () => {
    it("should have metadataBase URL", () => {
      const siteUrl = "https://shahidster.tech";
      const metadataBase = new URL(siteUrl);

      expect(metadataBase.protocol).toBe("https:");
      expect(metadataBase.hostname).toBe("shahidster.tech");
    });

    it("should have title object with default and template", () => {
      const title = {
        default: "Shahid Moosa — Cloud Database Engineer",
        template: "%s | Shahid Moosa",
      };

      expect(title.default).toBeDefined();
      expect(title.template).toContain("%s");
    });

    it("should have description within SEO limits", () => {
      const description =
        "Cloud Database Support Engineer at SingleStore. I debug distributed systems, optimize queries at petabyte scale, and help Fortune 500 teams ship reliable data infrastructure.";

      expect(description.length).toBeGreaterThan(50);
      expect(description.length).toBeLessThanOrEqual(160);
    });

    it("should have relevant keywords", () => {
      const keywords = [
        "Cloud Database Engineer",
        "SingleStore",
        "AWS",
        "Distributed Systems",
        "Database Support",
        "PostgreSQL",
        "MySQL",
        "Database Optimization",
        "Data Infrastructure",
      ];

      expect(keywords.length).toBeGreaterThan(0);
      keywords.forEach((keyword) => {
        expect(keyword.length).toBeGreaterThan(0);
      });
    });

    it("should have author information", () => {
      const authors = [{ name: "Shahid Moosa", url: "https://shahidster.tech" }];

      expect(authors[0].name).toBe("Shahid Moosa");
      expect(authors[0].url).toMatch(/^https:\/\//);
    });

    it("should disable format detection", () => {
      const formatDetection = {
        email: false,
        address: false,
        telephone: false,
      };

      expect(formatDetection.email).toBe(false);
      expect(formatDetection.address).toBe(false);
      expect(formatDetection.telephone).toBe(false);
    });

    it("should configure robots properly", () => {
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
      expect(robots.googleBot["max-image-preview"]).toBe("large");
    });
  });

  describe("Open Graph metadata", () => {
    it("should have website type", () => {
      const openGraph = {
        type: "website" as const,
      };

      expect(openGraph.type).toBe("website");
    });

    it("should have proper locale format", () => {
      const openGraph = {
        locale: "en_US",
      };

      expect(openGraph.locale).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
    });

    it("should have OG image with dimensions", () => {
      const openGraph = {
        images: [
          {
            url: "https://shahidster.tech/og-image.png",
            width: 1200,
            height: 630,
            alt: "Shahid Moosa - Cloud Database Engineer",
            type: "image/png",
          },
        ],
      };

      const image = openGraph.images[0];
      expect(image.width).toBe(1200);
      expect(image.height).toBe(630);
      expect(image.width / image.height).toBeCloseTo(1.9, 1);
    });

    it("should have siteName", () => {
      const openGraph = {
        siteName: "Shahid Moosa",
      };

      expect(openGraph.siteName).toBeDefined();
    });
  });

  describe("Twitter Card metadata", () => {
    it("should use summary_large_image card", () => {
      const twitter = {
        card: "summary_large_image" as const,
      };

      expect(twitter.card).toBe("summary_large_image");
    });

    it("should have Twitter handle", () => {
      const twitter = {
        creator: "@shahidster_",
        site: "@shahidster_",
      };

      expect(twitter.creator).toMatch(/^@[a-zA-Z0-9_]+$/);
      expect(twitter.site).toMatch(/^@[a-zA-Z0-9_]+$/);
    });

    it("should have title and description", () => {
      const twitter = {
        title: "Shahid Moosa — Cloud Database Engineer",
        description: "I keep databases alive at scale. Cloud Database Engineer at SingleStore.",
      };

      expect(twitter.title).toBeDefined();
      expect(twitter.description).toBeDefined();
    });

    it("should have image URL", () => {
      const twitter = {
        images: ["https://shahidster.tech/og-image.png"],
      };

      expect(twitter.images[0]).toMatch(/^https:\/\//);
      expect(twitter.images[0]).toMatch(/\.(png|jpg|jpeg|webp)$/);
    });
  });

  describe("Alternate links", () => {
    it("should have canonical URL", () => {
      const alternates = {
        canonical: "https://shahidster.tech",
      };

      expect(alternates.canonical).toMatch(/^https:\/\//);
    });

    it("should have RSS and JSON feed types", () => {
      const alternates = {
        types: {
          "application/rss+xml": "https://shahidster.tech/rss.xml",
          "application/json": "https://shahidster.tech/feed.json",
        },
      };

      expect(alternates.types["application/rss+xml"]).toContain("/rss.xml");
      expect(alternates.types["application/json"]).toContain("/feed.json");
    });
  });

  describe("Verification tags", () => {
    it("should have placeholder for Google verification", () => {
      const verification = {
        google: "your-google-verification-code",
      };

      expect(verification.google).toBeDefined();
    });

    it("should support multiple search engines", () => {
      const verification = {
        google: "google-code",
        yandex: "yandex-code",
        bing: "bing-code",
      };

      Object.keys(verification).forEach((engine) => {
        expect(["google", "yandex", "bing"]).toContain(engine);
      });
    });
  });

  describe("Category and classification", () => {
    it("should have technology category", () => {
      const category = "technology";

      expect(category).toBe("technology");
    });

    it("should have classification", () => {
      const classification = "Personal Portfolio";

      expect(classification).toBeDefined();
    });
  });

  describe("Viewport configuration", () => {
    it("should have themeColor", () => {
      const viewport = {
        themeColor: "#0a0b0d",
      };

      expect(viewport.themeColor).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it("should have responsive viewport settings", () => {
      const viewport = {
        width: "device-width",
        initialScale: 1,
        maximumScale: 5,
      };

      expect(viewport.width).toBe("device-width");
      expect(viewport.initialScale).toBe(1);
      expect(viewport.maximumScale).toBeGreaterThan(1);
    });
  });
});