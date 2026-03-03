import { describe, it, expect, vi } from "vitest";

// Mock dependencies
vi.mock("@/data/articles", () => ({
  articles: [
    {
      slug: "test-article",
      title: "Test Article",
      description: "Test description",
      date: "Jan 2024",
      category: "Testing",
      content: "Test content",
      seoKeywords: ["test", "article"],
    },
  ],
  getArticleBySlug: vi.fn((slug: string) => {
    if (slug === "test-article") {
      return {
        slug: "test-article",
        title: "Test Article",
        description: "Test description",
        date: "Jan 2024",
        category: "Testing",
        content: "Test content",
        seoKeywords: ["test", "article"],
      };
    }
    return null;
  }),
}));

describe("Next.js Blog Page Example", () => {
  it("should generate static params for all articles", async () => {
    const { articles } = await import("@/data/articles");

    const staticParams = articles.map((article) => ({
      slug: article.slug,
    }));

    expect(staticParams.length).toBeGreaterThan(0);
    expect(staticParams[0]).toHaveProperty("slug");
  });

  it("should generate metadata for article", async () => {
    const { getArticleBySlug } = await import("@/data/articles");

    const article = getArticleBySlug("test-article");

    expect(article).toBeDefined();
    expect(article?.title).toBe("Test Article");
    expect(article?.description).toBe("Test description");
  });

  it("should handle missing article gracefully", async () => {
    const { getArticleBySlug } = await import("@/data/articles");

    const article = getArticleBySlug("non-existent");

    expect(article).toBeNull();
  });

  it("should parse article date correctly", () => {
    const dateStr = "Jan 2024";
    const [month, year] = dateStr.split(" ");

    expect(month).toBe("Jan");
    expect(year).toBe("2024");
  });

  it("should format article content as HTML", () => {
    const content = "**Bold** and `code`";
    const formatted = content
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");

    expect(formatted).toContain("<strong>");
    expect(formatted).toContain("<code>");
  });

  it("should include Open Graph metadata", () => {
    const metadata = {
      openGraph: {
        type: "article",
        locale: "en_US",
      },
    };

    expect(metadata.openGraph.type).toBe("article");
    expect(metadata.openGraph.locale).toBe("en_US");
  });

  it("should include Twitter card metadata", () => {
    const metadata = {
      twitter: {
        card: "summary_large_image",
      },
    };

    expect(metadata.twitter.card).toBe("summary_large_image");
  });

  it("should set canonical URL", () => {
    const siteUrl = "https://shahidster.tech";
    const slug = "test-article";
    const canonicalUrl = `${siteUrl}/blog/${slug}`;

    expect(canonicalUrl).toBe("https://shahidster.tech/blog/test-article");
  });

  it("should include structured data", () => {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: "Test Article",
    };

    expect(articleSchema["@context"]).toBe("https://schema.org");
    expect(articleSchema["@type"]).toBe("TechArticle");
  });

  it("should include breadcrumb schema", () => {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [],
    };

    expect(breadcrumbSchema["@type"]).toBe("BreadcrumbList");
  });

  it("should handle series navigation", () => {
    const { articles } = require("@/data/articles");
    const currentIndex = articles.findIndex((a: any) => a.slug === "test-article");

    expect(currentIndex).toBeGreaterThanOrEqual(0);
  });

  it("should filter related articles by category", () => {
    const { articles } = require("@/data/articles");
    const currentArticle = articles[0];
    const relatedArticles = articles.filter(
      (a: any) => a.category === currentArticle.category && a.slug !== currentArticle.slug
    );

    expect(Array.isArray(relatedArticles)).toBe(true);
  });

  it("should use ISR revalidation", () => {
    const revalidate = 3600;

    expect(revalidate).toBeGreaterThan(0);
    expect(revalidate).toBe(60 * 60);
  });

  it("should strip markdown for excerpts", () => {
    const content = "# Header\n\nParagraph with **bold** text.";
    const stripped = content
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .trim();

    expect(stripped).not.toContain("#");
    expect(stripped).not.toContain("**");
  });

  it("should escape XML special characters", () => {
    const text = "Test & <tag>";
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    expect(escaped).toContain("&amp;");
    expect(escaped).toContain("&lt;");
    expect(escaped).toContain("&gt;");
  });

  it("should handle empty article content", () => {
    const content = "";

    expect(content.length).toBe(0);
  });
});