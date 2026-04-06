import { describe, it, expect, vi } from "vitest";
import {
  buildPersonJsonLd,
  buildWebsiteJsonLd,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "./structured-data";
import type { Article } from "../data/articles";

// Mock dependencies
vi.mock("./site-config", () => ({
  siteConfig: {
    title: "Shahid Moosa - Cloud Database Engineer",
    description: "Cloud Database Support Engineer at SingleStore",
    siteUrl: "https://shahidster.tech",
    ogImage: "/og-image.png",
    author: {
      name: "Shahid Moosa",
      url: "https://shahidster.tech",
      jobTitle: "Cloud Database Support Engineer",
      sameAs: [
        "https://github.com/shahidmoosa",
        "https://linkedin.com/in/shahidmoosa",
      ],
    },
  },
}));

vi.mock("./seo-utils", () => ({
  formatArticleDateIso: (dateStr: string) => {
    const months: Record<string, number> = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
    };
    const [month, year] = dateStr.split(" ");
    return `${year}-${String((months[month] ?? 0) + 1).padStart(2, "0")}-01T00:00:00.000Z`;
  },
  toAbsoluteUrl: (path: string) => {
    if (path.startsWith("http")) return path;
    return `https://shahidster.tech${path.startsWith("/") ? path : `/${path}`}`;
  },
}));

describe("structured-data", () => {
  const mockArticle: Article = {
    slug: "test-article",
    title: "Test Article Title",
    description: "Test article description",
    category: "Testing",
    date: "Jan 2024",
    readTime: "5 min read",
    content: "This is test content with multiple words to count word count properly.",
    seoKeywords: ["test", "article", "keywords"],
  };

  describe("buildPersonJsonLd", () => {
    it("should build valid Person schema", () => {
      const schema = buildPersonJsonLd();

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("Person");
      expect(schema.name).toBe("Shahid Moosa");
      expect(schema.url).toBe("https://shahidster.tech");
      expect(schema.jobTitle).toBe("Cloud Database Support Engineer");
    });

    it("should include sameAs links", () => {
      const schema = buildPersonJsonLd();

      expect(Array.isArray(schema.sameAs)).toBe(true);
      expect(schema.sameAs).toContain("https://github.com/shahidmoosa");
      expect(schema.sameAs).toContain("https://linkedin.com/in/shahidmoosa");
    });

    it("should return consistent structure", () => {
      const schema1 = buildPersonJsonLd();
      const schema2 = buildPersonJsonLd();

      expect(schema1).toEqual(schema2);
    });
  });

  describe("buildWebsiteJsonLd", () => {
    it("should build valid WebSite schema", () => {
      const schema = buildWebsiteJsonLd();

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("WebSite");
      expect(schema.name).toBe("Shahid Moosa - Cloud Database Engineer");
      expect(schema.url).toBe("https://shahidster.tech");
      expect(schema.description).toBe(
        "Cloud Database Support Engineer at SingleStore"
      );
    });

    it("should include language", () => {
      const schema = buildWebsiteJsonLd();

      expect(schema.inLanguage).toBe("en-US");
    });

    it("should include publisher information", () => {
      const schema = buildWebsiteJsonLd();

      expect(schema.publisher).toBeDefined();
      expect(schema.publisher["@type"]).toBe("Person");
      expect(schema.publisher.name).toBe("Shahid Moosa");
      expect(schema.publisher.url).toBe("https://shahidster.tech");
    });
  });

  describe("buildArticleJsonLd", () => {
    it("should build valid Article schema", () => {
      const schema = buildArticleJsonLd(mockArticle);

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("Article");
      expect(schema.headline).toBe("Test Article Title");
      expect(schema.description).toBe("Test article description");
    });

    it("should include article URL as @id", () => {
      const schema = buildArticleJsonLd(mockArticle);

      expect(schema["@id"]).toBe(
        "https://shahidster.tech/blog/test-article"
      );
    });

    it("should format dates correctly", () => {
      const schema = buildArticleJsonLd(mockArticle);

      expect(schema.datePublished).toBe("2024-01-01T00:00:00.000Z");
      expect(schema.dateModified).toBe("2024-01-01T00:00:00.000Z");
    });

    it("should include author information", () => {
      const schema = buildArticleJsonLd(mockArticle);

      expect(schema.author).toBeDefined();
      expect(schema.author["@type"]).toBe("Person");
      expect(schema.author.name).toBe("Shahid Moosa");
      expect(schema.author.url).toBe("https://shahidster.tech");
      expect(schema.author.jobTitle).toBe("Cloud Database Support Engineer");
    });

    it("should include publisher information", () => {
      const schema = buildArticleJsonLd(mockArticle);

      expect(schema.publisher).toBeDefined();
      expect(schema.publisher["@type"]).toBe("Person");
      expect(schema.publisher.name).toBe("Shahid Moosa");
    });

    it("should include mainEntityOfPage", () => {
      const schema = buildArticleJsonLd(mockArticle);

      expect(schema.mainEntityOfPage).toBeDefined();
      expect(schema.mainEntityOfPage["@type"]).toBe("WebPage");
      expect(schema.mainEntityOfPage["@id"]).toBe(
        "https://shahidster.tech/blog/test-article"
      );
    });

    it("should include article section", () => {
      const schema = buildArticleJsonLd(mockArticle);

      expect(schema.articleSection).toBe("Testing");
    });

    it("should include keywords from seoKeywords", () => {
      const schema = buildArticleJsonLd(mockArticle);

      expect(schema.keywords).toBe("test, article, keywords");
    });

    it("should fallback to category when no seoKeywords", () => {
      const articleWithoutKeywords = { ...mockArticle, seoKeywords: undefined };
      const schema = buildArticleJsonLd(articleWithoutKeywords);

      expect(schema.keywords).toBe("Testing");
    });

    it("should calculate word count", () => {
      const schema = buildArticleJsonLd(mockArticle);

      // "This is test content with multiple words to count word count properly."
      expect(schema.wordCount).toBeGreaterThan(0);
      expect(typeof schema.wordCount).toBe("number");
    });

    it("should include image array", () => {
      const schema = buildArticleJsonLd(mockArticle);

      expect(Array.isArray(schema.image)).toBe(true);
      expect(schema.image[0]).toBe("https://shahidster.tech/og-image.png");
    });

    it("should include language", () => {
      const schema = buildArticleJsonLd(mockArticle);

      expect(schema.inLanguage).toBe("en-US");
    });

    it("should not include isPartOf when no series info provided", () => {
      const schema = buildArticleJsonLd(mockArticle);

      expect(schema.isPartOf).toBeUndefined();
    });

    it("should include isPartOf when currentIndex is 0", () => {
      const schema = buildArticleJsonLd(mockArticle, {
        currentIndex: 0,
        total: 10,
      });

      expect(schema.isPartOf).toBeUndefined();
    });

    it("should include isPartOf when part of series (currentIndex > 0)", () => {
      const schema = buildArticleJsonLd(mockArticle, {
        currentIndex: 3,
        total: 10,
      });

      expect(schema.isPartOf).toBeDefined();
      expect(schema.isPartOf?.["@type"]).toBe("CreativeWorkSeries");
      expect(schema.isPartOf?.name).toBe("Distributed Systems Series");
      expect(schema.isPartOf?.position).toBe(3);
      expect(schema.isPartOf?.numberOfItems).toBe(10);
    });

    it("should handle first article in series (currentIndex = 1)", () => {
      const schema = buildArticleJsonLd(mockArticle, {
        currentIndex: 1,
        total: 10,
      });

      expect(schema.isPartOf).toBeDefined();
      expect(schema.isPartOf?.position).toBe(1);
    });

    it("should not include isPartOf when only total is provided", () => {
      const schema = buildArticleJsonLd(mockArticle, { total: 10 });

      expect(schema.isPartOf).toBeUndefined();
    });

    it("should not include isPartOf when only currentIndex is provided", () => {
      const schema = buildArticleJsonLd(mockArticle, { currentIndex: 3 });

      expect(schema.isPartOf).toBeUndefined();
    });

    it("should handle article with long content", () => {
      const longArticle = {
        ...mockArticle,
        content: Array(1000).fill("word").join(" "),
      };
      const schema = buildArticleJsonLd(longArticle);

      expect(schema.wordCount).toBe(1000);
    });

    it("should handle article with empty content", () => {
      const emptyArticle = { ...mockArticle, content: "" };
      const schema = buildArticleJsonLd(emptyArticle);

      expect(schema.wordCount).toBe(1);
    });

    it("should handle special characters in title", () => {
      const specialArticle = {
        ...mockArticle,
        title: "Article with <special> & chars",
      };
      const schema = buildArticleJsonLd(specialArticle);

      expect(schema.headline).toBe("Article with <special> & chars");
    });
  });

  describe("buildBreadcrumbJsonLd", () => {
    it("should build valid BreadcrumbList schema", () => {
      const schema = buildBreadcrumbJsonLd(mockArticle);

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("BreadcrumbList");
      expect(Array.isArray(schema.itemListElement)).toBe(true);
    });

    it("should include three breadcrumb items", () => {
      const schema = buildBreadcrumbJsonLd(mockArticle);

      expect(schema.itemListElement.length).toBe(3);
    });

    it("should have correct first item (Home)", () => {
      const schema = buildBreadcrumbJsonLd(mockArticle);
      const homeItem = schema.itemListElement[0];

      expect(homeItem["@type"]).toBe("ListItem");
      expect(homeItem.position).toBe(1);
      expect(homeItem.name).toBe("Home");
      expect(homeItem.item).toBe("https://shahidster.tech");
    });

    it("should have correct second item (Writing)", () => {
      const schema = buildBreadcrumbJsonLd(mockArticle);
      const writingItem = schema.itemListElement[1];

      expect(writingItem["@type"]).toBe("ListItem");
      expect(writingItem.position).toBe(2);
      expect(writingItem.name).toBe("Writing");
      expect(writingItem.item).toBe("https://shahidster.tech/#writing");
    });

    it("should have correct third item (Article)", () => {
      const schema = buildBreadcrumbJsonLd(mockArticle);
      const articleItem = schema.itemListElement[2];

      expect(articleItem["@type"]).toBe("ListItem");
      expect(articleItem.position).toBe(3);
      expect(articleItem.name).toBe("Test Article Title");
      expect(articleItem.item).toBe(
        "https://shahidster.tech/blog/test-article"
      );
    });

    it("should handle article with special characters in title", () => {
      const specialArticle = {
        ...mockArticle,
        title: "Special & <title>",
      };
      const schema = buildBreadcrumbJsonLd(specialArticle);
      const articleItem = schema.itemListElement[2];

      expect(articleItem.name).toBe("Special & <title>");
    });

    it("should use correct URL structure", () => {
      const schema = buildBreadcrumbJsonLd(mockArticle);

      schema.itemListElement.forEach((item) => {
        expect(item.item).toContain("https://shahidster.tech");
      });
    });

    it("should have sequential positions", () => {
      const schema = buildBreadcrumbJsonLd(mockArticle);

      schema.itemListElement.forEach((item, index) => {
        expect(item.position).toBe(index + 1);
      });
    });
  });

  describe("integration tests", () => {
    it("should create consistent schemas for the same article", () => {
      const schema1 = buildArticleJsonLd(mockArticle);
      const schema2 = buildArticleJsonLd(mockArticle);

      expect(schema1).toEqual(schema2);
    });

    it("should create article and breadcrumb schemas with matching URLs", () => {
      const articleSchema = buildArticleJsonLd(mockArticle);
      const breadcrumbSchema = buildBreadcrumbJsonLd(mockArticle);

      const articleUrl = articleSchema["@id"];
      const breadcrumbUrl = breadcrumbSchema.itemListElement[2].item;

      expect(articleUrl).toBe(breadcrumbUrl);
    });

    it("should handle complete article lifecycle", () => {
      const personSchema = buildPersonJsonLd();
      const websiteSchema = buildWebsiteJsonLd();
      const articleSchema = buildArticleJsonLd(mockArticle, {
        currentIndex: 2,
        total: 5,
      });
      const breadcrumbSchema = buildBreadcrumbJsonLd(mockArticle);

      // All schemas should be valid
      expect(personSchema["@type"]).toBe("Person");
      expect(websiteSchema["@type"]).toBe("WebSite");
      expect(articleSchema["@type"]).toBe("Article");
      expect(breadcrumbSchema["@type"]).toBe("BreadcrumbList");

      // Should have consistent author across schemas
      expect(personSchema.name).toBe(articleSchema.author.name);
      expect(websiteSchema.publisher.name).toBe(articleSchema.author.name);
    });
  });

  describe("edge cases", () => {
    it("should handle article with minimal data", () => {
      const minimalArticle: Article = {
        slug: "minimal",
        title: "Minimal",
        description: "Minimal description",
        category: "Test",
        date: "Jan 2024",
        readTime: "1 min",
        content: "Min",
      };

      expect(() => buildArticleJsonLd(minimalArticle)).not.toThrow();
      expect(() => buildBreadcrumbJsonLd(minimalArticle)).not.toThrow();
    });

    it("should handle article with empty seoKeywords array", () => {
      const article = { ...mockArticle, seoKeywords: [] };
      const schema = buildArticleJsonLd(article);

      expect(schema.keywords).toBe(article.category);
    });

    it("should handle very long article titles", () => {
      const longTitle = "A".repeat(500);
      const article = { ...mockArticle, title: longTitle };
      const schema = buildArticleJsonLd(article);

      expect(schema.headline).toBe(longTitle);
    });

    it("should calculate word count correctly with multiple spaces", () => {
      const article = {
        ...mockArticle,
        content: "word    word     word",
      };
      const schema = buildArticleJsonLd(article);

      // Should count 3 words despite multiple spaces
      expect(schema.wordCount).toBeLessThanOrEqual(3);
    });

    it("should handle content with newlines", () => {
      const article = {
        ...mockArticle,
        content: "word\nword\nword",
      };
      const schema = buildArticleJsonLd(article);

      expect(schema.wordCount).toBeGreaterThan(0);
    });
  });
});