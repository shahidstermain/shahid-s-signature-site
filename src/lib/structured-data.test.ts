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
      jobTitle: "Cloud Database Support Engineer",
      url: "https://shahidster.tech",
      sameAs: [
        "https://github.com/shahidmoosa",
        "https://linkedin.com/in/shahidmoosa",
      ],
    },
  },
}));

vi.mock("./seo-utils", () => ({
  formatArticleDateIso: (dateStr: string) => {
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
    const [month, year] = dateStr.split(" ");
    return `${year}-${months[month]}-01T00:00:00.000Z`;
  },
  toAbsoluteUrl: (pathOrUrl: string) => {
    if (pathOrUrl.startsWith("http")) return pathOrUrl;
    return `https://shahidster.tech${pathOrUrl}`;
  },
}));

describe("structured-data", () => {
  const mockArticle: Article = {
    slug: "test-article",
    title: "Test Article Title",
    description: "Test article description",
    date: "Jan 2024",
    category: "Testing",
    readTime: "5 min",
    content: "This is test content with many words to test word count functionality.",
    seoKeywords: ["test", "article", "keywords"],
  };

  describe("buildPersonJsonLd", () => {
    it("should build valid Person schema", () => {
      const result = buildPersonJsonLd();

      expect(result["@context"]).toBe("https://schema.org");
      expect(result["@type"]).toBe("Person");
      expect(result.name).toBe("Shahid Moosa");
      expect(result.url).toBe("https://shahidster.tech");
      expect(result.jobTitle).toBe("Cloud Database Support Engineer");
    });

    it("should include sameAs links", () => {
      const result = buildPersonJsonLd();

      expect(Array.isArray(result.sameAs)).toBe(true);
      expect(result.sameAs).toContain("https://github.com/shahidmoosa");
      expect(result.sameAs).toContain("https://linkedin.com/in/shahidmoosa");
    });

    it("should return valid JSON-LD object", () => {
      const result = buildPersonJsonLd();

      expect(() => JSON.stringify(result)).not.toThrow();
    });

    it("should have all required Person schema properties", () => {
      const result = buildPersonJsonLd();

      expect(result).toHaveProperty("@context");
      expect(result).toHaveProperty("@type");
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("url");
      expect(result).toHaveProperty("jobTitle");
      expect(result).toHaveProperty("sameAs");
    });
  });

  describe("buildWebsiteJsonLd", () => {
    it("should build valid WebSite schema", () => {
      const result = buildWebsiteJsonLd();

      expect(result["@context"]).toBe("https://schema.org");
      expect(result["@type"]).toBe("WebSite");
      expect(result.name).toBe("Shahid Moosa - Cloud Database Engineer");
      expect(result.url).toBe("https://shahidster.tech");
      expect(result.description).toBe("Cloud Database Support Engineer at SingleStore");
    });

    it("should include language", () => {
      const result = buildWebsiteJsonLd();

      expect(result.inLanguage).toBe("en-US");
    });

    it("should include publisher information", () => {
      const result = buildWebsiteJsonLd();

      expect(result.publisher).toBeDefined();
      expect(result.publisher["@type"]).toBe("Person");
      expect(result.publisher.name).toBe("Shahid Moosa");
      expect(result.publisher.url).toBe("https://shahidster.tech");
    });

    it("should return valid JSON-LD object", () => {
      const result = buildWebsiteJsonLd();

      expect(() => JSON.stringify(result)).not.toThrow();
    });

    it("should have all required WebSite schema properties", () => {
      const result = buildWebsiteJsonLd();

      expect(result).toHaveProperty("@context");
      expect(result).toHaveProperty("@type");
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("url");
      expect(result).toHaveProperty("description");
      expect(result).toHaveProperty("inLanguage");
      expect(result).toHaveProperty("publisher");
    });
  });

  describe("buildArticleJsonLd", () => {
    it("should build valid Article schema", () => {
      const result = buildArticleJsonLd(mockArticle);

      expect(result["@context"]).toBe("https://schema.org");
      expect(result["@type"]).toBe("Article");
      expect(result["@id"]).toBe("https://shahidster.tech/blog/test-article");
      expect(result.headline).toBe("Test Article Title");
      expect(result.description).toBe("Test article description");
    });

    it("should include author information", () => {
      const result = buildArticleJsonLd(mockArticle);

      expect(result.author).toBeDefined();
      expect(result.author["@type"]).toBe("Person");
      expect(result.author.name).toBe("Shahid Moosa");
      expect(result.author.url).toBe("https://shahidster.tech");
      expect(result.author.jobTitle).toBe("Cloud Database Support Engineer");
    });

    it("should include publisher information", () => {
      const result = buildArticleJsonLd(mockArticle);

      expect(result.publisher).toBeDefined();
      expect(result.publisher["@type"]).toBe("Person");
      expect(result.publisher.name).toBe("Shahid Moosa");
      expect(result.publisher.url).toBe("https://shahidster.tech");
    });

    it("should include mainEntityOfPage", () => {
      const result = buildArticleJsonLd(mockArticle);

      expect(result.mainEntityOfPage).toBeDefined();
      expect(result.mainEntityOfPage["@type"]).toBe("WebPage");
      expect(result.mainEntityOfPage["@id"]).toBe(
        "https://shahidster.tech/blog/test-article"
      );
    });

    it("should format dates as ISO strings", () => {
      const result = buildArticleJsonLd(mockArticle);

      expect(result.datePublished).toBe("2024-01-01T00:00:00.000Z");
      expect(result.dateModified).toBe("2024-01-01T00:00:00.000Z");
    });

    it("should include article section from category", () => {
      const result = buildArticleJsonLd(mockArticle);

      expect(result.articleSection).toBe("Testing");
    });

    it("should include keywords", () => {
      const result = buildArticleJsonLd(mockArticle);

      expect(result.keywords).toBe("test, article, keywords");
    });

    it("should use category as keywords fallback when no seoKeywords", () => {
      const articleWithoutKeywords = { ...mockArticle, seoKeywords: undefined };
      const result = buildArticleJsonLd(articleWithoutKeywords);

      expect(result.keywords).toBe("Testing");
    });

    it("should calculate word count", () => {
      const result = buildArticleJsonLd(mockArticle);

      expect(result.wordCount).toBeGreaterThan(0);
      // "This is test content with many words to test word count functionality." = 12 words
      expect(result.wordCount).toBe(12);
    });

    it("should include image", () => {
      const result = buildArticleJsonLd(mockArticle);

      expect(Array.isArray(result.image)).toBe(true);
      expect(result.image[0]).toBe("https://shahidster.tech/og-image.png");
    });

    it("should include language", () => {
      const result = buildArticleJsonLd(mockArticle);

      expect(result.inLanguage).toBe("en-US");
    });

    it("should include isPartOf when series position provided", () => {
      const result = buildArticleJsonLd(mockArticle, {
        currentIndex: 2,
        total: 5,
      });

      expect(result.isPartOf).toBeDefined();
      expect(result.isPartOf?.["@type"]).toBe("CreativeWorkSeries");
      expect(result.isPartOf?.name).toBe("Distributed Systems Series");
      expect(result.isPartOf?.position).toBe(2);
      expect(result.isPartOf?.numberOfItems).toBe(5);
    });

    it("should not include isPartOf when currentIndex is 0", () => {
      const result = buildArticleJsonLd(mockArticle, {
        currentIndex: 0,
        total: 5,
      });

      expect(result.isPartOf).toBeUndefined();
    });

    it("should not include isPartOf when no options provided", () => {
      const result = buildArticleJsonLd(mockArticle);

      expect(result.isPartOf).toBeUndefined();
    });

    it("should not include isPartOf when only total provided", () => {
      const result = buildArticleJsonLd(mockArticle, { total: 5 });

      expect(result.isPartOf).toBeUndefined();
    });

    it("should return valid JSON-LD object", () => {
      const result = buildArticleJsonLd(mockArticle);

      expect(() => JSON.stringify(result)).not.toThrow();
    });

    it("should handle article with long content", () => {
      const longArticle = {
        ...mockArticle,
        content: new Array(1000).fill("word").join(" "),
      };
      const result = buildArticleJsonLd(longArticle);

      expect(result.wordCount).toBe(1000);
    });

    it("should handle article with special characters in content", () => {
      const specialArticle = {
        ...mockArticle,
        content: "Content with <special> & characters",
      };
      const result = buildArticleJsonLd(specialArticle);

      expect(result.wordCount).toBeGreaterThan(0);
    });

    it("should handle different date formats", () => {
      const decArticle = { ...mockArticle, date: "Dec 2025" };
      const result = buildArticleJsonLd(decArticle);

      expect(result.datePublished).toBe("2025-12-01T00:00:00.000Z");
    });
  });

  describe("buildBreadcrumbJsonLd", () => {
    it("should build valid BreadcrumbList schema", () => {
      const result = buildBreadcrumbJsonLd(mockArticle);

      expect(result["@context"]).toBe("https://schema.org");
      expect(result["@type"]).toBe("BreadcrumbList");
      expect(Array.isArray(result.itemListElement)).toBe(true);
    });

    it("should have three breadcrumb items", () => {
      const result = buildBreadcrumbJsonLd(mockArticle);

      expect(result.itemListElement.length).toBe(3);
    });

    it("should have Home as first item", () => {
      const result = buildBreadcrumbJsonLd(mockArticle);
      const firstItem = result.itemListElement[0];

      expect(firstItem["@type"]).toBe("ListItem");
      expect(firstItem.position).toBe(1);
      expect(firstItem.name).toBe("Home");
      expect(firstItem.item).toBe("https://shahidster.tech");
    });

    it("should have Writing as second item", () => {
      const result = buildBreadcrumbJsonLd(mockArticle);
      const secondItem = result.itemListElement[1];

      expect(secondItem["@type"]).toBe("ListItem");
      expect(secondItem.position).toBe(2);
      expect(secondItem.name).toBe("Writing");
      expect(secondItem.item).toBe("https://shahidster.tech/#writing");
    });

    it("should have article as third item", () => {
      const result = buildBreadcrumbJsonLd(mockArticle);
      const thirdItem = result.itemListElement[2];

      expect(thirdItem["@type"]).toBe("ListItem");
      expect(thirdItem.position).toBe(3);
      expect(thirdItem.name).toBe("Test Article Title");
      expect(thirdItem.item).toBe(
        "https://shahidster.tech/blog/test-article"
      );
    });

    it("should return valid JSON-LD object", () => {
      const result = buildBreadcrumbJsonLd(mockArticle);

      expect(() => JSON.stringify(result)).not.toThrow();
    });

    it("should handle article with special characters in title", () => {
      const specialArticle = {
        ...mockArticle,
        title: "Article with <special> & characters",
      };
      const result = buildBreadcrumbJsonLd(specialArticle);

      expect(result.itemListElement[2].name).toBe(
        "Article with <special> & characters"
      );
    });

    it("should have sequential positions", () => {
      const result = buildBreadcrumbJsonLd(mockArticle);

      result.itemListElement.forEach((item, index) => {
        expect(item.position).toBe(index + 1);
      });
    });

    it("should have all required ListItem properties", () => {
      const result = buildBreadcrumbJsonLd(mockArticle);

      result.itemListElement.forEach((item) => {
        expect(item).toHaveProperty("@type");
        expect(item).toHaveProperty("position");
        expect(item).toHaveProperty("name");
        expect(item).toHaveProperty("item");
      });
    });
  });

  describe("integration tests", () => {
    it("should generate all schemas for a complete article page", () => {
      const personSchema = buildPersonJsonLd();
      const websiteSchema = buildWebsiteJsonLd();
      const articleSchema = buildArticleJsonLd(mockArticle, {
        currentIndex: 1,
        total: 3,
      });
      const breadcrumbSchema = buildBreadcrumbJsonLd(mockArticle);

      expect(personSchema["@type"]).toBe("Person");
      expect(websiteSchema["@type"]).toBe("WebSite");
      expect(articleSchema["@type"]).toBe("Article");
      expect(breadcrumbSchema["@type"]).toBe("BreadcrumbList");
    });

    it("should have consistent URLs across schemas", () => {
      const articleSchema = buildArticleJsonLd(mockArticle);
      const breadcrumbSchema = buildBreadcrumbJsonLd(mockArticle);

      const articleUrl = "https://shahidster.tech/blog/test-article";
      expect(articleSchema["@id"]).toBe(articleUrl);
      expect(breadcrumbSchema.itemListElement[2].item).toBe(articleUrl);
    });

    it("should have consistent author information", () => {
      const personSchema = buildPersonJsonLd();
      const articleSchema = buildArticleJsonLd(mockArticle);

      expect(personSchema.name).toBe(articleSchema.author.name);
      expect(personSchema.url).toBe(articleSchema.author.url);
    });

    it("should generate valid JSON for all schemas", () => {
      const schemas = [
        buildPersonJsonLd(),
        buildWebsiteJsonLd(),
        buildArticleJsonLd(mockArticle),
        buildBreadcrumbJsonLd(mockArticle),
      ];

      schemas.forEach((schema) => {
        expect(() => JSON.stringify(schema)).not.toThrow();
        const json = JSON.stringify(schema);
        expect(() => JSON.parse(json)).not.toThrow();
      });
    });
  });

  describe("edge cases", () => {
    it("should handle empty article content", () => {
      const emptyArticle = { ...mockArticle, content: "" };
      const result = buildArticleJsonLd(emptyArticle);

      // Empty string split by whitespace still produces array with 1 element
      expect(result.wordCount).toBe(1);
    });

    it("should handle article with only whitespace content", () => {
      const whitespaceArticle = { ...mockArticle, content: "   \n\t  " };
      const result = buildArticleJsonLd(whitespaceArticle);

      expect(result.wordCount).toBeGreaterThanOrEqual(0);
    });

    it("should handle article with very long slug", () => {
      const longSlugArticle = {
        ...mockArticle,
        slug: "a".repeat(200),
      };
      const result = buildArticleJsonLd(longSlugArticle);

      expect(result["@id"]).toContain("a".repeat(200));
    });

    it("should handle article without description", () => {
      const noDescArticle = { ...mockArticle, description: "" };
      const result = buildArticleJsonLd(noDescArticle);

      expect(result.description).toBe("");
    });

    it("should handle article series with large numbers", () => {
      const result = buildArticleJsonLd(mockArticle, {
        currentIndex: 999,
        total: 1000,
      });

      expect(result.isPartOf?.position).toBe(999);
      expect(result.isPartOf?.numberOfItems).toBe(1000);
    });
  });
});