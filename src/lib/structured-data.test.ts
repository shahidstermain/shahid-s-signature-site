import { describe, it, expect } from "vitest";
import {
  buildPersonJsonLd,
  buildWebsiteJsonLd,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "./structured-data";
import { siteConfig } from "./site-config";
import { articles } from "../data/articles";

describe("structured-data", () => {
  describe("buildPersonJsonLd", () => {
    it("should have correct @context and @type", () => {
      const person = buildPersonJsonLd();

      expect(person["@context"]).toBe("https://schema.org");
      expect(person["@type"]).toBe("Person");
    });

    it("should include author name", () => {
      const person = buildPersonJsonLd();

      expect(person.name).toBe(siteConfig.author.name);
    });

    it("should include author URL", () => {
      const person = buildPersonJsonLd();

      expect(person.url).toBe(siteConfig.author.url);
    });

    it("should include job title", () => {
      const person = buildPersonJsonLd();

      expect(person.jobTitle).toBe(siteConfig.author.jobTitle);
    });

    it("should include sameAs array", () => {
      const person = buildPersonJsonLd();

      expect(Array.isArray(person.sameAs)).toBe(true);
      expect(person.sameAs).toEqual(siteConfig.author.sameAs);
    });

    it("should be valid JSON-LD", () => {
      const person = buildPersonJsonLd();

      expect(() => JSON.stringify(person)).not.toThrow();
    });
  });

  describe("buildWebsiteJsonLd", () => {
    it("should have correct @context and @type", () => {
      const website = buildWebsiteJsonLd();

      expect(website["@context"]).toBe("https://schema.org");
      expect(website["@type"]).toBe("WebSite");
    });

    it("should include site name", () => {
      const website = buildWebsiteJsonLd();

      expect(website.name).toBe(siteConfig.title);
    });

    it("should include site URL", () => {
      const website = buildWebsiteJsonLd();

      expect(website.url).toBe(siteConfig.siteUrl);
    });

    it("should include description", () => {
      const website = buildWebsiteJsonLd();

      expect(website.description).toBe(siteConfig.description);
    });

    it("should include language", () => {
      const website = buildWebsiteJsonLd();

      expect(website.inLanguage).toBe("en-US");
    });

    it("should include publisher information", () => {
      const website = buildWebsiteJsonLd();

      expect(website.publisher).toBeDefined();
      expect(website.publisher["@type"]).toBe("Person");
      expect(website.publisher.name).toBe(siteConfig.author.name);
      expect(website.publisher.url).toBe(siteConfig.author.url);
    });

    it("should be valid JSON-LD", () => {
      const website = buildWebsiteJsonLd();

      expect(() => JSON.stringify(website)).not.toThrow();
    });
  });

  describe("buildArticleJsonLd", () => {
    const testArticle = articles[0];

    it("should have correct @context and @type", () => {
      const article = buildArticleJsonLd(testArticle);

      expect(article["@context"]).toBe("https://schema.org");
      expect(article["@type"]).toBe("Article");
    });

    it("should include article ID", () => {
      const article = buildArticleJsonLd(testArticle);

      expect(article["@id"]).toBe(`${siteConfig.siteUrl}/blog/${testArticle.slug}`);
    });

    it("should include headline", () => {
      const article = buildArticleJsonLd(testArticle);

      expect(article.headline).toBe(testArticle.title);
    });

    it("should include description", () => {
      const article = buildArticleJsonLd(testArticle);

      expect(article.description).toBe(testArticle.description);
    });

    it("should include ISO 8601 datePublished", () => {
      const article = buildArticleJsonLd(testArticle);

      expect(article.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it("should include author with all fields", () => {
      const article = buildArticleJsonLd(testArticle);

      expect(article.author["@type"]).toBe("Person");
      expect(article.author.name).toBe(siteConfig.author.name);
      expect(article.author.url).toBe(siteConfig.author.url);
      expect(article.author.jobTitle).toBe(siteConfig.author.jobTitle);
    });

    it("should include publisher", () => {
      const article = buildArticleJsonLd(testArticle);

      expect(article.publisher["@type"]).toBe("Person");
      expect(article.publisher.name).toBe(siteConfig.author.name);
      expect(article.publisher.url).toBe(siteConfig.author.url);
    });

    it("should include mainEntityOfPage", () => {
      const article = buildArticleJsonLd(testArticle);

      expect(article.mainEntityOfPage["@type"]).toBe("WebPage");
      expect(article.mainEntityOfPage["@id"]).toBe(`${siteConfig.siteUrl}/blog/${testArticle.slug}`);
    });

    it("should include articleSection", () => {
      const article = buildArticleJsonLd(testArticle);

      expect(article.articleSection).toBe(testArticle.category);
    });

    it("should include keywords", () => {
      const article = buildArticleJsonLd(testArticle);

      expect(article.keywords).toBeDefined();
      expect(typeof article.keywords).toBe("string");
    });

    it("should use seoKeywords if available", () => {
      const articleWithKeywords = articles.find(a => a.seoKeywords && a.seoKeywords.length > 0);

      if (articleWithKeywords) {
        const article = buildArticleJsonLd(articleWithKeywords);
        expect(article.keywords).toBe(articleWithKeywords.seoKeywords?.join(", "));
      }
    });

    it("should fallback to category if no seoKeywords", () => {
      const articleWithoutKeywords = { ...testArticle, seoKeywords: undefined };
      const article = buildArticleJsonLd(articleWithoutKeywords);

      expect(article.keywords).toBe(testArticle.category);
    });

    it("should calculate wordCount", () => {
      const article = buildArticleJsonLd(testArticle);

      expect(article.wordCount).toBeGreaterThan(0);
      expect(typeof article.wordCount).toBe("number");
    });

    it("should include image array", () => {
      const article = buildArticleJsonLd(testArticle);

      expect(Array.isArray(article.image)).toBe(true);
      expect(article.image.length).toBeGreaterThan(0);
      expect(article.image[0]).toContain(siteConfig.siteUrl);
    });

    it("should include language", () => {
      const article = buildArticleJsonLd(testArticle);

      expect(article.inLanguage).toBe("en-US");
    });

    it("should not include isPartOf when no options provided", () => {
      const article = buildArticleJsonLd(testArticle);

      expect(article.isPartOf).toBeUndefined();
    });

    it("should not include isPartOf when currentIndex is 0", () => {
      const article = buildArticleJsonLd(testArticle, {
        currentIndex: 0,
        total: 10,
      });

      expect(article.isPartOf).toBeUndefined();
    });

    it("should include isPartOf when currentIndex > 0", () => {
      const article = buildArticleJsonLd(testArticle, {
        currentIndex: 2,
        total: 10,
      });

      expect(article.isPartOf).toBeDefined();
      expect(article.isPartOf["@type"]).toBe("CreativeWorkSeries");
      expect(article.isPartOf.name).toBe(testArticle.category);
      expect(article.isPartOf.position).toBe(2);
      expect(article.isPartOf.numberOfItems).toBe(10);
    });

    it("should be valid JSON-LD", () => {
      const article = buildArticleJsonLd(testArticle);

      expect(() => JSON.stringify(article)).not.toThrow();
    });
  });

  describe("buildBreadcrumbJsonLd", () => {
    const testArticle = articles[0];

    it("should have correct @context and @type", () => {
      const breadcrumb = buildBreadcrumbJsonLd(testArticle);

      expect(breadcrumb["@context"]).toBe("https://schema.org");
      expect(breadcrumb["@type"]).toBe("BreadcrumbList");
    });

    it("should have itemListElement array", () => {
      const breadcrumb = buildBreadcrumbJsonLd(testArticle);

      expect(Array.isArray(breadcrumb.itemListElement)).toBe(true);
    });

    it("should have 3 items (Home, Writing, Article)", () => {
      const breadcrumb = buildBreadcrumbJsonLd(testArticle);

      expect(breadcrumb.itemListElement.length).toBe(3);
    });

    it("should have Home as first item", () => {
      const breadcrumb = buildBreadcrumbJsonLd(testArticle);
      const firstItem = breadcrumb.itemListElement[0];

      expect(firstItem["@type"]).toBe("ListItem");
      expect(firstItem.position).toBe(1);
      expect(firstItem.name).toBe("Home");
      expect(firstItem.item).toBe(siteConfig.siteUrl);
    });

    it("should have Writing as second item", () => {
      const breadcrumb = buildBreadcrumbJsonLd(testArticle);
      const secondItem = breadcrumb.itemListElement[1];

      expect(secondItem["@type"]).toBe("ListItem");
      expect(secondItem.position).toBe(2);
      expect(secondItem.name).toBe("Writing");
      expect(secondItem.item).toBe(`${siteConfig.siteUrl}/#writing`);
    });

    it("should have article title as third item", () => {
      const breadcrumb = buildBreadcrumbJsonLd(testArticle);
      const thirdItem = breadcrumb.itemListElement[2];

      expect(thirdItem["@type"]).toBe("ListItem");
      expect(thirdItem.position).toBe(3);
      expect(thirdItem.name).toBe(testArticle.title);
      expect(thirdItem.item).toBe(`${siteConfig.siteUrl}/blog/${testArticle.slug}`);
    });

    it("should have sequential positions", () => {
      const breadcrumb = buildBreadcrumbJsonLd(testArticle);

      breadcrumb.itemListElement.forEach((item, index) => {
        expect(item.position).toBe(index + 1);
      });
    });

    it("should be valid JSON-LD", () => {
      const breadcrumb = buildBreadcrumbJsonLd(testArticle);

      expect(() => JSON.stringify(breadcrumb)).not.toThrow();
    });
  });

  // Integration tests
  describe("integration tests", () => {
    it("all structured data should reference the same site URL", () => {
      const person = buildPersonJsonLd();
      const website = buildWebsiteJsonLd();
      const article = buildArticleJsonLd(articles[0]);
      const breadcrumb = buildBreadcrumbJsonLd(articles[0]);

      expect(person.url).toBe(siteConfig.author.url);
      expect(website.url).toBe(siteConfig.siteUrl);
      expect(article["@id"]).toContain(siteConfig.siteUrl);
      expect(breadcrumb.itemListElement[0].item).toBe(siteConfig.siteUrl);
    });

    it("all structured data should reference the same author", () => {
      const person = buildPersonJsonLd();
      const website = buildWebsiteJsonLd();
      const article = buildArticleJsonLd(articles[0]);

      expect(person.name).toBe(siteConfig.author.name);
      expect(website.publisher.name).toBe(siteConfig.author.name);
      expect(article.author.name).toBe(siteConfig.author.name);
      expect(article.publisher.name).toBe(siteConfig.author.name);
    });

    it("should work with all articles", () => {
      articles.forEach(article => {
        expect(() => buildArticleJsonLd(article)).not.toThrow();
        expect(() => buildBreadcrumbJsonLd(article)).not.toThrow();
      });
    });
  });

  // Edge cases
  describe("edge cases", () => {
    it("should handle article without seoKeywords", () => {
      const article = { ...articles[0], seoKeywords: undefined };
      const result = buildArticleJsonLd(article);

      expect(result.keywords).toBe(article.category);
    });

    it("should handle article with empty seoKeywords array", () => {
      const article = { ...articles[0], seoKeywords: [] };
      const result = buildArticleJsonLd(article);

      // Empty array joins to "", which is falsy, so falls back to category
      expect(result.keywords).toBe(article.category);
    });

    it("should calculate word count for short content", () => {
      const article = { ...articles[0], content: "Hello world test" };
      const result = buildArticleJsonLd(article);

      expect(result.wordCount).toBe(3);
    });

    it("should calculate word count for empty content", () => {
      const article = { ...articles[0], content: "" };
      const result = buildArticleJsonLd(article);

      // Empty string split by whitespace returns [""] with length 1
      expect(result.wordCount).toBe(1);
    });

    it("should handle article with special characters in title", () => {
      const article = { ...articles[0], title: "Test & <Special> Characters" };
      const result = buildArticleJsonLd(article);

      expect(result.headline).toBe(article.title);
    });
  });

  // Validation tests
  describe("validation tests", () => {
    it("all functions should produce valid JSON-LD", () => {
      const person = buildPersonJsonLd();
      const website = buildWebsiteJsonLd();
      const article = buildArticleJsonLd(articles[0]);
      const breadcrumb = buildBreadcrumbJsonLd(articles[0]);

      expect(() => JSON.stringify(person)).not.toThrow();
      expect(() => JSON.stringify(website)).not.toThrow();
      expect(() => JSON.stringify(article)).not.toThrow();
      expect(() => JSON.stringify(breadcrumb)).not.toThrow();
    });

    it("all schema.org types should be properly capitalized", () => {
      const person = buildPersonJsonLd();
      const website = buildWebsiteJsonLd();
      const article = buildArticleJsonLd(articles[0]);
      const breadcrumb = buildBreadcrumbJsonLd(articles[0]);

      // Types should start with uppercase
      expect(person["@type"]).toMatch(/^[A-Z]/);
      expect(website["@type"]).toMatch(/^[A-Z]/);
      expect(article["@type"]).toMatch(/^[A-Z]/);
      expect(breadcrumb["@type"]).toMatch(/^[A-Z]/);
    });

    it("all @context should be schema.org", () => {
      const person = buildPersonJsonLd();
      const website = buildWebsiteJsonLd();
      const article = buildArticleJsonLd(articles[0]);
      const breadcrumb = buildBreadcrumbJsonLd(articles[0]);

      expect(person["@context"]).toBe("https://schema.org");
      expect(website["@context"]).toBe("https://schema.org");
      expect(article["@context"]).toBe("https://schema.org");
      expect(breadcrumb["@context"]).toBe("https://schema.org");
    });
  });

  // Negative tests
  describe("negative tests", () => {
    it("should not include undefined fields in output", () => {
      const article = buildArticleJsonLd(articles[0]);

      Object.values(article).forEach(value => {
        expect(value).not.toBeUndefined();
      });
    });

    it("should not include null fields in output", () => {
      const article = buildArticleJsonLd(articles[0]);

      Object.values(article).forEach(value => {
        expect(value).not.toBeNull();
      });
    });
  });

  // Performance tests
  describe("performance tests", () => {
    it("should generate structured data quickly", () => {
      const start = Date.now();

      buildPersonJsonLd();
      buildWebsiteJsonLd();
      buildArticleJsonLd(articles[0]);
      buildBreadcrumbJsonLd(articles[0]);

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(10);
    });

    it("should handle batch generation efficiently", () => {
      const start = Date.now();

      articles.forEach(article => {
        buildArticleJsonLd(article);
        buildBreadcrumbJsonLd(article);
      });

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(50);
    });
  });
});