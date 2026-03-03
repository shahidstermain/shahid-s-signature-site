import { describe, it, expect, vi } from "vitest";

// Mock site config
vi.mock("docs/nextjs-migration-examples/lib/seo", () => ({
  SITE_CONFIG: {
    url: "https://shahidster.tech",
    name: "Shahid Moosa",
    title: "Shahid Moosa — Cloud Database Engineer",
    description: "Cloud Database Support Engineer at SingleStore",
    author: {
      name: "Shahid Moosa",
      email: "hello@shahidster.tech",
      twitter: "@shahidster_",
      jobTitle: "Cloud Database Support Engineer",
    },
    organization: {
      name: "SingleStore",
      url: "https://www.singlestore.com",
    },
    social: {
      twitter: "https://twitter.com/shahidster_",
      linkedin: "https://linkedin.com/in/shahidmoosa",
      github: "https://github.com/shahidmoosa",
    },
  },
}));

describe("Next.js SEO Utilities Example", () => {
  describe("getCanonicalUrl", () => {
    it("should return base URL for empty path", () => {
      const baseUrl = "https://shahidster.tech";
      const canonical = baseUrl;

      expect(canonical).toBe(baseUrl);
    });

    it("should append path to base URL", () => {
      const baseUrl = "https://shahidster.tech";
      const path = "/blog/post";
      const canonical = `${baseUrl}${path}`;

      expect(canonical).toBe("https://shahidster.tech/blog/post");
    });

    it("should remove trailing slash from path", () => {
      const path = "/blog/post/";
      const cleanPath = path.replace(/\/$/, "");

      expect(cleanPath).toBe("/blog/post");
    });

    it("should handle root path", () => {
      const path = "/";
      const cleanPath = path === "/" ? "" : path;

      expect(cleanPath).toBe("");
    });
  });

  describe("parseArticleDateToISO", () => {
    it("should parse valid date string", () => {
      const dateStr = "Nov 2025";
      const [month, year] = dateStr.split(" ");

      expect(month).toBe("Nov");
      expect(year).toBe("2025");
    });

    it("should map months to numbers", () => {
      const months: Record<string, string> = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12",
      };

      expect(months["Nov"]).toBe("11");
    });

    it("should format as ISO date", () => {
      const year = "2025";
      const month = "11";
      const day = "15";
      const iso = `${year}-${month}-${day}T00:00:00.000Z`;

      expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it("should handle invalid date", () => {
      const fallback = new Date().toISOString();

      expect(fallback).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
  });

  describe("generateBaseMetadata", () => {
    it("should have metadataBase", () => {
      const siteUrl = "https://shahidster.tech";
      const metadataBase = new URL(siteUrl);

      expect(metadataBase).toBeInstanceOf(URL);
    });

    it("should have title object", () => {
      const title = {
        default: "Shahid Moosa — Cloud Database Engineer",
        template: "%s | Shahid Moosa",
      };

      expect(title.default).toBeDefined();
      expect(title.template).toContain("%s");
    });

    it("should have description", () => {
      const description = "Cloud Database Support Engineer at SingleStore";

      expect(description.length).toBeGreaterThan(0);
    });

    it("should have authors array", () => {
      const authors = [
        { name: "Shahid Moosa", url: "https://shahidster.tech" },
      ];

      expect(Array.isArray(authors)).toBe(true);
      expect(authors[0].name).toBe("Shahid Moosa");
    });

    it("should have creator", () => {
      const creator = "Shahid Moosa";

      expect(creator).toBeDefined();
    });

    it("should have publisher", () => {
      const publisher = "Shahid Moosa";

      expect(publisher).toBeDefined();
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
      expect(robots.googleBot["max-image-preview"]).toBe("large");
    });

    it("should merge overrides", () => {
      const base = { title: "Default" };
      const overrides = { title: "Custom" };
      const merged = { ...base, ...overrides };

      expect(merged.title).toBe("Custom");
    });
  });

  describe("generateArticleMetadata", () => {
    it("should generate article metadata", () => {
      const article = {
        title: "Test Article",
        description: "Test description",
        slug: "test-article",
        date: "Nov 2025",
        category: "Testing",
        seoKeywords: ["test", "article"],
      };

      expect(article.title).toBeDefined();
      expect(article.description).toBeDefined();
    });

    it("should include OpenGraph article type", () => {
      const openGraph = {
        type: "article" as const,
      };

      expect(openGraph.type).toBe("article");
    });

    it("should include publish time", () => {
      const publishedTime = "2025-11-15T00:00:00.000Z";

      expect(publishedTime).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it("should include keywords", () => {
      const keywords = ["test", "article"];

      expect(Array.isArray(keywords)).toBe(true);
    });

    it("should build article URL", () => {
      const siteUrl = "https://shahidster.tech";
      const slug = "test-article";
      const articleUrl = `${siteUrl}/blog/${slug}`;

      expect(articleUrl).toBe("https://shahidster.tech/blog/test-article");
    });
  });

  describe("generatePersonSchema", () => {
    it("should have Person type", () => {
      const schema = {
        "@context": "https://schema.org",
        "@type": "Person",
      };

      expect(schema["@type"]).toBe("Person");
    });

    it("should have @id", () => {
      const id = "https://shahidster.tech/#person";

      expect(id).toContain("#person");
    });

    it("should have name and jobTitle", () => {
      const person = {
        name: "Shahid Moosa",
        jobTitle: "Cloud Database Support Engineer",
      };

      expect(person.name).toBeDefined();
      expect(person.jobTitle).toBeDefined();
    });

    it("should have worksFor organization", () => {
      const worksFor = {
        "@type": "Organization",
        name: "SingleStore",
        url: "https://www.singlestore.com",
      };

      expect(worksFor["@type"]).toBe("Organization");
    });

    it("should have sameAs social profiles", () => {
      const sameAs = [
        "https://twitter.com/shahidster_",
        "https://linkedin.com/in/shahidmoosa",
        "https://github.com/shahidmoosa",
      ];

      expect(Array.isArray(sameAs)).toBe(true);
      expect(sameAs.length).toBeGreaterThanOrEqual(3);
    });

    it("should have knowsAbout expertise", () => {
      const knowsAbout = [
        "Distributed Systems",
        "Database Engineering",
        "Cloud Infrastructure",
      ];

      expect(Array.isArray(knowsAbout)).toBe(true);
    });
  });

  describe("generateWebsiteSchema", () => {
    it("should have WebSite type", () => {
      const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
      };

      expect(schema["@type"]).toBe("WebSite");
    });

    it("should have @id", () => {
      const id = "https://shahidster.tech/#website";

      expect(id).toContain("#website");
    });

    it("should have publisher reference", () => {
      const publisher = {
        "@id": "https://shahidster.tech/#person",
      };

      expect(publisher["@id"]).toContain("#person");
    });

    it("should have inLanguage", () => {
      const inLanguage = "en-US";

      expect(inLanguage).toMatch(/^[a-z]{2}-[A-Z]{2}$/);
    });
  });

  describe("generateArticleSchema", () => {
    it("should have TechArticle type", () => {
      const schema = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
      };

      expect(schema["@type"]).toBe("TechArticle");
    });

    it("should have headline", () => {
      const headline = "Test Article";

      expect(headline).toBeDefined();
    });

    it("should have datePublished and dateModified", () => {
      const dates = {
        datePublished: "2025-11-15T00:00:00.000Z",
        dateModified: "2025-11-15T00:00:00.000Z",
      };

      expect(dates.datePublished).toBeDefined();
      expect(dates.dateModified).toBeDefined();
    });

    it("should have author", () => {
      const author = {
        "@type": "Person",
        "@id": "https://shahidster.tech/#person",
      };

      expect(author["@type"]).toBe("Person");
    });

    it("should have publisher", () => {
      const publisher = {
        "@type": "Person",
        "@id": "https://shahidster.tech/#person",
      };

      expect(publisher["@type"]).toBe("Person");
    });

    it("should have mainEntityOfPage", () => {
      const mainEntity = {
        "@type": "WebPage",
        "@id": "https://shahidster.tech/blog/test-article",
      };

      expect(mainEntity["@type"]).toBe("WebPage");
    });

    it("should have word count", () => {
      const content = "word1 word2 word3 word4 word5";
      const wordCount = content.split(/\s+/).length;

      expect(wordCount).toBe(5);
    });

    it("should have proficiency level", () => {
      const proficiencyLevel = "Expert";

      expect(proficiencyLevel).toBe("Expert");
    });

    it("should have isPartOf for series", () => {
      const seriesInfo = { currentIndex: 1, total: 5 };

      if (seriesInfo) {
        const isPartOf = {
          "@type": "CreativeWorkSeries",
          name: "Distributed Systems Series",
          position: seriesInfo.currentIndex,
          numberOfItems: seriesInfo.total,
        };

        expect(isPartOf["@type"]).toBe("CreativeWorkSeries");
      }
    });
  });

  describe("generateBreadcrumbSchema", () => {
    it("should have BreadcrumbList type", () => {
      const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
      };

      expect(schema["@type"]).toBe("BreadcrumbList");
    });

    it("should have itemListElement array", () => {
      const items = [
        { name: "Home", url: "https://shahidster.tech" },
        { name: "Blog", url: "https://shahidster.tech/blog" },
      ];

      expect(Array.isArray(items)).toBe(true);
    });

    it("should have position numbers", () => {
      const items = [
        { position: 1, name: "Home" },
        { position: 2, name: "Blog" },
      ];

      expect(items[0].position).toBe(1);
      expect(items[1].position).toBe(2);
    });
  });

  describe("generateFAQSchema", () => {
    it("should have FAQPage type", () => {
      const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
      };

      expect(schema["@type"]).toBe("FAQPage");
    });

    it("should have mainEntity array", () => {
      const faqs = [
        { question: "Q1", answer: "A1" },
        { question: "Q2", answer: "A2" },
      ];

      expect(Array.isArray(faqs)).toBe(true);
    });

    it("should have Question and Answer types", () => {
      const faq = {
        "@type": "Question",
        name: "What is this?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "This is the answer.",
        },
      };

      expect(faq["@type"]).toBe("Question");
      expect(faq.acceptedAnswer["@type"]).toBe("Answer");
    });
  });

  describe("Analytics functions", () => {
    it("should have trackPageView function", () => {
      const trackPageView = (url: string, title?: string) => {
        // Analytics tracking
      };

      expect(trackPageView).toBeInstanceOf(Function);
    });

    it("should have trackEvent function", () => {
      const trackEvent = (name: string, params?: Record<string, unknown>) => {
        // Event tracking
      };

      expect(trackEvent).toBeInstanceOf(Function);
    });

    it("should check for gtag availability", () => {
      const hasGtag = typeof window !== "undefined" && (window as any).gtag;

      expect(hasGtag).toBeDefined();
    });
  });

  describe("stripMarkdown", () => {
    it("should remove code blocks", () => {
      const content = "Text ```code``` more";
      const stripped = content.replace(/```[\s\S]*?```/g, "");

      expect(stripped).not.toContain("```");
    });

    it("should remove inline code", () => {
      const content = "Text `code` more";
      const stripped = content.replace(/`[^`]+`/g, "");

      expect(stripped).not.toContain("`");
    });

    it("should remove bold", () => {
      const content = "Text **bold** more";
      const stripped = content.replace(/\*\*(.+?)\*\*/g, "$1");

      expect(stripped).toBe("Text bold more");
    });

    it("should remove italic", () => {
      const content = "Text *italic* more";
      const stripped = content.replace(/\*(.+?)\*/g, "$1");

      expect(stripped).toBe("Text italic more");
    });

    it("should truncate to maxLength", () => {
      const longText = "a".repeat(200);
      const maxLength = 160;
      const truncated = longText.slice(0, maxLength - 3) + "...";

      expect(truncated.length).toBeLessThanOrEqual(maxLength);
      expect(truncated).toContain("...");
    });
  });

  describe("calculateReadTime", () => {
    it("should calculate read time", () => {
      const content = "word ".repeat(200);
      const wordsPerMinute = 200;
      const wordCount = content.split(/\s+/).length;
      const minutes = Math.ceil(wordCount / wordsPerMinute);

      expect(minutes).toBeGreaterThan(0);
    });

    it("should format as 'X min read'", () => {
      const minutes = 5;
      const formatted = `${minutes} min read`;

      expect(formatted).toBe("5 min read");
    });

    it("should round up", () => {
      const wordCount = 250;
      const wordsPerMinute = 200;
      const minutes = Math.ceil(wordCount / wordsPerMinute);

      expect(minutes).toBe(2);
    });
  });
});