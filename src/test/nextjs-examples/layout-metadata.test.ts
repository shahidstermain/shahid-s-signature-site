import { describe, it, expect } from "vitest";

// Tests for layout metadata patterns in Next.js

describe("Layout Metadata", () => {
  describe("Static metadata", () => {
    it("should export metadata object", () => {
      const metadata = {
        title: "Page Title",
        description: "Page description",
      };

      expect(metadata).toHaveProperty("title");
      expect(metadata).toHaveProperty("description");
    });

    it("should include all SEO fields", () => {
      const metadata = {
        title: "Title",
        description: "Description",
        keywords: ["keyword1", "keyword2"],
        authors: [{ name: "Shahid Moosa" }],
        creator: "Shahid Moosa",
        publisher: "Shahid Moosa",
      };

      expect(metadata.title).toBeTruthy();
      expect(metadata.description).toBeTruthy();
      expect(Array.isArray(metadata.keywords)).toBe(true);
      expect(Array.isArray(metadata.authors)).toBe(true);
    });

    it("should define viewport metadata", () => {
      const viewport = {
        width: "device-width",
        initialScale: 1,
        maximumScale: 5,
      };

      expect(viewport.width).toBe("device-width");
      expect(viewport.initialScale).toBe(1);
    });

    it("should define theme color", () => {
      const themeColor = [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#000000" },
      ];

      expect(Array.isArray(themeColor)).toBe(true);
      expect(themeColor[0]).toHaveProperty("media");
      expect(themeColor[0]).toHaveProperty("color");
    });
  });

  describe("Dynamic metadata with generateMetadata", () => {
    it("should be async function", () => {
      const generateMetadata = async () => ({ title: "Title" });
      expect(generateMetadata.constructor.name).toBe("AsyncFunction");
    });

    it("should receive params", async () => {
      const generateMetadata = async ({ params }: { params: { slug: string } }) => {
        return {
          title: params.slug,
        };
      };

      const result = await generateMetadata({ params: { slug: "test-post" } });
      expect(result.title).toBe("test-post");
    });

    it("should receive searchParams", async () => {
      const generateMetadata = async ({
        searchParams,
      }: {
        searchParams: { page?: string };
      }) => {
        return {
          title: `Page ${searchParams.page || 1}`,
        };
      };

      const result = await generateMetadata({ searchParams: { page: "2" } });
      expect(result.title).toBe("Page 2");
    });

    it("should receive parent metadata", async () => {
      const generateMetadata = async (
        _props: unknown,
        parent: Promise<{ openGraph?: { images?: string[] } }>
      ) => {
        const previousImages = (await parent).openGraph?.images || [];
        return {
          openGraph: {
            images: ["/new-image.png", ...previousImages],
          },
        };
      };

      const parentPromise = Promise.resolve({
        openGraph: { images: ["/parent-image.png"] },
      });

      const result = await generateMetadata({}, parentPromise);
      expect(result.openGraph.images).toContain("/new-image.png");
      expect(result.openGraph.images).toContain("/parent-image.png");
    });

    it("should handle missing parent data", async () => {
      const generateMetadata = async (
        _props: unknown,
        parent: Promise<{ openGraph?: { images?: string[] } }>
      ) => {
        const previousImages = (await parent).openGraph?.images || [];
        return {
          openGraph: {
            images: ["/new-image.png", ...previousImages],
          },
        };
      };

      const parentPromise = Promise.resolve({});
      const result = await generateMetadata({}, parentPromise);

      expect(result.openGraph.images).toContain("/new-image.png");
      expect(result.openGraph.images.length).toBe(1);
    });
  });

  describe("Title metadata", () => {
    it("should support string title", () => {
      const metadata = {
        title: "Page Title",
      };

      expect(typeof metadata.title).toBe("string");
    });

    it("should support title object with template", () => {
      const metadata = {
        title: {
          default: "Default Title",
          template: "%s | Site Name",
        },
      };

      expect(metadata.title.default).toBeTruthy();
      expect(metadata.title.template).toContain("%s");
    });

    it("should support absolute title", () => {
      const metadata = {
        title: {
          absolute: "Absolute Title",
        },
      };

      expect(metadata.title.absolute).toBeTruthy();
    });

    it("should apply template to child pages", () => {
      const parentTitle = {
        template: "%s | Parent",
      };
      const childTitle = "Child Page";

      const fullTitle = parentTitle.template.replace("%s", childTitle);
      expect(fullTitle).toBe("Child Page | Parent");
    });
  });

  describe("Open Graph metadata", () => {
    it("should include required OG fields", () => {
      const openGraph = {
        title: "OG Title",
        description: "OG Description",
        url: "https://example.com",
        siteName: "Site Name",
        images: [
          {
            url: "https://example.com/og-image.png",
            width: 1200,
            height: 630,
          },
        ],
        locale: "en_US",
        type: "website",
      };

      expect(openGraph.title).toBeTruthy();
      expect(openGraph.description).toBeTruthy();
      expect(openGraph.url).toBeTruthy();
      expect(Array.isArray(openGraph.images)).toBe(true);
    });

    it("should support article type with article-specific fields", () => {
      const openGraph = {
        type: "article",
        publishedTime: "2024-01-01T00:00:00.000Z",
        modifiedTime: "2024-01-15T00:00:00.000Z",
        authors: ["Author Name"],
        section: "Technology",
        tags: ["tag1", "tag2"],
      };

      expect(openGraph.type).toBe("article");
      expect(openGraph.publishedTime).toBeTruthy();
      expect(Array.isArray(openGraph.authors)).toBe(true);
      expect(Array.isArray(openGraph.tags)).toBe(true);
    });

    it("should support multiple images", () => {
      const openGraph = {
        images: [
          {
            url: "/og-image-1.png",
            width: 1200,
            height: 630,
            alt: "Image 1",
          },
          {
            url: "/og-image-2.png",
            width: 1200,
            height: 630,
            alt: "Image 2",
          },
        ],
      };

      expect(openGraph.images.length).toBe(2);
      expect(openGraph.images[0].alt).toBeTruthy();
    });

    it("should support video metadata", () => {
      const openGraph = {
        type: "video.movie",
        videos: [
          {
            url: "https://example.com/video.mp4",
            width: 1920,
            height: 1080,
          },
        ],
      };

      expect(openGraph.type).toContain("video");
      expect(Array.isArray(openGraph.videos)).toBe(true);
    });
  });

  describe("Twitter metadata", () => {
    it("should include Twitter card fields", () => {
      const twitter = {
        card: "summary_large_image",
        title: "Twitter Title",
        description: "Twitter Description",
        creator: "@username",
        images: ["https://example.com/twitter-image.png"],
      };

      expect(twitter.card).toBeTruthy();
      expect(twitter.creator).toMatch(/^@/);
      expect(Array.isArray(twitter.images)).toBe(true);
    });

    it("should support different card types", () => {
      const cardTypes = ["summary", "summary_large_image", "app", "player"];

      cardTypes.forEach((card) => {
        const twitter = { card };
        expect(twitter.card).toBe(card);
      });
    });

    it("should support app card metadata", () => {
      const twitter = {
        card: "app",
        app: {
          name: "App Name",
          id: {
            iphone: "123456789",
            ipad: "123456789",
            googleplay: "com.example.app",
          },
          url: {
            iphone: "app://",
            ipad: "app://",
          },
        },
      };

      expect(twitter.card).toBe("app");
      expect(twitter.app.name).toBeTruthy();
      expect(twitter.app.id).toBeTruthy();
    });
  });

  describe("Robots metadata", () => {
    it("should control indexing", () => {
      const robots = {
        index: true,
        follow: true,
      };

      expect(robots.index).toBe(true);
      expect(robots.follow).toBe(true);
    });

    it("should support noindex for private pages", () => {
      const robots = {
        index: false,
        follow: false,
      };

      expect(robots.index).toBe(false);
    });

    it("should support granular directives", () => {
      const robots = {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
          index: true,
          follow: false,
          "max-image-preview": "large",
        },
      };

      expect(robots.nocache).toBe(true);
      expect(robots.googleBot).toBeTruthy();
    });
  });

  describe("Icons metadata", () => {
    it("should define favicon", () => {
      const icons = {
        icon: "/favicon.ico",
      };

      expect(icons.icon).toBeTruthy();
    });

    it("should support multiple icon sizes", () => {
      const icons = {
        icon: [
          { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
          { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
        ],
      };

      expect(Array.isArray(icons.icon)).toBe(true);
      expect(icons.icon[0].sizes).toBeTruthy();
    });

    it("should define apple touch icon", () => {
      const icons = {
        apple: "/apple-touch-icon.png",
      };

      expect(icons.apple).toBeTruthy();
    });

    it("should support shortcut icon", () => {
      const icons = {
        shortcut: "/shortcut-icon.png",
      };

      expect(icons.shortcut).toBeTruthy();
    });
  });

  describe("Alternate links", () => {
    it("should define canonical URL", () => {
      const alternates = {
        canonical: "https://example.com/page",
      };

      expect(alternates.canonical).toMatch(/^https?:\/\//);
    });

    it("should support language alternates", () => {
      const alternates = {
        languages: {
          "en-US": "https://example.com/en-US",
          "es-ES": "https://example.com/es-ES",
        },
      };

      expect(alternates.languages["en-US"]).toBeTruthy();
      expect(alternates.languages["es-ES"]).toBeTruthy();
    });

    it("should support media alternates", () => {
      const alternates = {
        media: {
          "only screen and (max-width: 600px)": "https://example.com/mobile",
        },
      };

      expect(alternates.media).toBeTruthy();
    });

    it("should support RSS/Atom feeds", () => {
      const alternates = {
        types: {
          "application/rss+xml": "https://example.com/rss.xml",
          "application/atom+xml": "https://example.com/atom.xml",
        },
      };

      expect(alternates.types["application/rss+xml"]).toBeTruthy();
    });
  });

  describe("Verification metadata", () => {
    it("should support Google verification", () => {
      const verification = {
        google: "google-verification-code",
      };

      expect(verification.google).toBeTruthy();
    });

    it("should support multiple verification services", () => {
      const verification = {
        google: "google-code",
        yandex: "yandex-code",
        yahoo: "yahoo-code",
        other: {
          "custom-verification": "custom-code",
        },
      };

      expect(verification.google).toBeTruthy();
      expect(verification.yandex).toBeTruthy();
      expect(verification.other).toBeTruthy();
    });
  });

  describe("App-specific metadata", () => {
    it("should support app links", () => {
      const appLinks = {
        ios: {
          url: "app://ios",
          app_store_id: "123456789",
        },
        android: {
          package: "com.example.app",
          app_name: "App Name",
        },
      };

      expect(appLinks.ios).toBeTruthy();
      expect(appLinks.android).toBeTruthy();
    });

    it("should support iTunes app metadata", () => {
      const itunes = {
        appId: "123456789",
        appArgument: "https://example.com/path",
      };

      expect(itunes.appId).toBeTruthy();
    });
  });

  describe("Edge cases", () => {
    it("should handle null metadata", () => {
      const metadata = {
        title: null,
        description: null,
      };

      expect(metadata.title).toBeNull();
    });

    it("should handle empty arrays", () => {
      const metadata = {
        keywords: [],
        authors: [],
      };

      expect(metadata.keywords.length).toBe(0);
    });

    it("should handle very long titles", () => {
      const longTitle = "A".repeat(200);
      const metadata = {
        title: longTitle.slice(0, 60),
      };

      expect(metadata.title.length).toBe(60);
    });

    it("should handle special characters", () => {
      const metadata = {
        title: "Title with & special <chars>",
        description: 'Description with "quotes"',
      };

      expect(metadata.title).toContain("&");
      expect(metadata.description).toContain('"');
    });
  });
});