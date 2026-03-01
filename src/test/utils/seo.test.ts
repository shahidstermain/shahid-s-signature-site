/**
 * Tests for SEO utility functions
 * Based on docs/nextjs-migration-examples/lib/seo.ts
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Replicate the SEO utility functions for testing
const SITE_CONFIG = {
  url: "https://shahidster.tech",
  name: "Shahid Moosa",
  title: "Shahid Moosa — Cloud Database Engineer",
  description: "Cloud Database Support Engineer at SingleStore.",
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
};

function getCanonicalUrl(path: string = ""): string {
  const cleanPath = path === "/" ? "" : path.replace(/\/$/, "");
  return `${SITE_CONFIG.url}${cleanPath}`;
}

function parseArticleDateToISO(dateStr: string): string {
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
  const parts = dateStr.split(" ");
  if (parts.length === 2) {
    const month = months[parts[0]] || "01";
    const year = parts[1];
    return `${year}-${month}-15T00:00:00.000Z`;
  }
  return new Date().toISOString();
}

function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_CONFIG.url}/#person`,
    name: SITE_CONFIG.author.name,
    jobTitle: SITE_CONFIG.author.jobTitle,
    email: `mailto:${SITE_CONFIG.author.email}`,
    url: SITE_CONFIG.url,
    worksFor: {
      "@type": "Organization",
      name: SITE_CONFIG.organization.name,
      url: SITE_CONFIG.organization.url,
    },
    sameAs: Object.values(SITE_CONFIG.social),
    knowsAbout: [
      "Distributed Systems",
      "Database Engineering",
      "Cloud Infrastructure",
      "AWS",
      "PostgreSQL",
      "MySQL",
      "SingleStore",
    ],
  };
}

function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.url}/#website`,
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    publisher: {
      "@id": `${SITE_CONFIG.url}/#person`,
    },
    inLanguage: "en-US",
  };
}

function generateArticleSchema(
  article: {
    title: string;
    description: string;
    slug: string;
    date: string;
    category: string;
    content: string;
    seoKeywords?: string[];
  },
  seriesInfo?: { currentIndex: number; total: number }
) {
  const articleUrl = getCanonicalUrl(`/blog/${article.slug}`);
  const publishDate = parseArticleDateToISO(article.date);
  const wordCount = article.content.split(/\s+/).length;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": articleUrl,
    headline: article.title,
    description: article.description,
    datePublished: publishDate,
    dateModified: publishDate,
    author: {
      "@type": "Person",
      "@id": `${SITE_CONFIG.url}/#person`,
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      "@type": "Person",
      "@id": `${SITE_CONFIG.url}/#person`,
      name: SITE_CONFIG.author.name,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    articleSection: article.category,
    keywords: article.seoKeywords?.join(", ") || article.category,
    wordCount,
    proficiencyLevel: "Expert",
    inLanguage: "en-US",
  };

  if (seriesInfo) {
    schema.isPartOf = {
      "@type": "CreativeWorkSeries",
      name: "Distributed Systems Series",
      position: seriesInfo.currentIndex,
      numberOfItems: seriesInfo.total,
    };
  }

  return schema;
}

function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function stripMarkdown(content: string, maxLength: number = 160): string {
  const plain = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\n+/g, " ")
    .trim();

  if (plain.length <= maxLength) {
    return plain;
  }

  return plain.slice(0, maxLength - 3) + "...";
}

function calculateReadTime(content: string, wordsPerMinute: number = 200): string {
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

describe("SEO Utility Functions", () => {
  describe("getCanonicalUrl", () => {
    it("should return base URL for empty path", () => {
      expect(getCanonicalUrl("")).toBe("https://shahidster.tech");
    });

    it("should return base URL for root path", () => {
      expect(getCanonicalUrl("/")).toBe("https://shahidster.tech");
    });

    it("should append path without trailing slash", () => {
      expect(getCanonicalUrl("/blog/my-post")).toBe("https://shahidster.tech/blog/my-post");
    });

    it("should remove trailing slash from path", () => {
      expect(getCanonicalUrl("/blog/my-post/")).toBe("https://shahidster.tech/blog/my-post");
    });

    it("should handle nested paths", () => {
      expect(getCanonicalUrl("/blog/category/post")).toBe(
        "https://shahidster.tech/blog/category/post"
      );
    });

    it("should not have double-slash in path", () => {
      const url = getCanonicalUrl("/about");
      // Should have https:// but not // in the path portion
      expect(url).toBe("https://shahidster.tech/about");
      expect(url.replace("https://", "")).not.toContain("//");
    });
  });

  describe("parseArticleDateToISO", () => {
    it("should parse Nov 2025 format to ISO", () => {
      const iso = parseArticleDateToISO("Nov 2025");
      expect(iso).toBe("2025-11-15T00:00:00.000Z");
    });

    it("should parse Jan 2024 format to ISO", () => {
      const iso = parseArticleDateToISO("Jan 2024");
      expect(iso).toBe("2024-01-15T00:00:00.000Z");
    });

    it("should parse Dec 2026 format to ISO", () => {
      const iso = parseArticleDateToISO("Dec 2026");
      expect(iso).toBe("2026-12-15T00:00:00.000Z");
    });

    it("should handle all month abbreviations", () => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      months.forEach((month, index) => {
        const iso = parseArticleDateToISO(`${month} 2025`);
        const expectedMonth = String(index + 1).padStart(2, "0");
        expect(iso).toContain(`2025-${expectedMonth}-15`);
      });
    });

    it("should return valid ISO format for invalid input", () => {
      const iso = parseArticleDateToISO("invalid");
      expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it("should use 15th as default day", () => {
      const iso = parseArticleDateToISO("Jun 2025");
      expect(iso).toContain("-15T");
    });
  });

  describe("generatePersonSchema", () => {
    it("should generate valid schema.org Person schema", () => {
      const schema = generatePersonSchema();
      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("Person");
    });

    it("should include person ID", () => {
      const schema = generatePersonSchema();
      expect(schema["@id"]).toBe("https://shahidster.tech/#person");
    });

    it("should include name and job title", () => {
      const schema = generatePersonSchema();
      expect(schema.name).toBe("Shahid Moosa");
      expect(schema.jobTitle).toBe("Cloud Database Support Engineer");
    });

    it("should include work organization", () => {
      const schema = generatePersonSchema();
      expect(schema.worksFor).toBeDefined();
      expect(schema.worksFor["@type"]).toBe("Organization");
      expect(schema.worksFor.name).toBe("SingleStore");
    });

    it("should include social profiles", () => {
      const schema = generatePersonSchema();
      expect(schema.sameAs).toBeDefined();
      expect(Array.isArray(schema.sameAs)).toBe(true);
      expect(schema.sameAs.length).toBeGreaterThan(0);
    });

    it("should include knowledge areas", () => {
      const schema = generatePersonSchema();
      expect(schema.knowsAbout).toBeDefined();
      expect(Array.isArray(schema.knowsAbout)).toBe(true);
      expect(schema.knowsAbout).toContain("Distributed Systems");
    });

    it("should include contact email", () => {
      const schema = generatePersonSchema();
      expect(schema.email).toContain("mailto:");
    });
  });

  describe("generateWebsiteSchema", () => {
    it("should generate valid schema.org WebSite schema", () => {
      const schema = generateWebsiteSchema();
      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("WebSite");
    });

    it("should include website ID", () => {
      const schema = generateWebsiteSchema();
      expect(schema["@id"]).toBe("https://shahidster.tech/#website");
    });

    it("should include site name and description", () => {
      const schema = generateWebsiteSchema();
      expect(schema.name).toBe("Shahid Moosa — Cloud Database Engineer");
      expect(schema.description).toBeDefined();
    });

    it("should reference person as publisher", () => {
      const schema = generateWebsiteSchema();
      expect(schema.publisher).toBeDefined();
      expect(schema.publisher["@id"]).toBe("https://shahidster.tech/#person");
    });

    it("should specify language", () => {
      const schema = generateWebsiteSchema();
      expect(schema.inLanguage).toBe("en-US");
    });
  });

  describe("generateArticleSchema", () => {
    const mockArticle = {
      title: "Understanding CAP Theorem",
      description: "A deep dive into CAP theorem",
      slug: "cap-theorem",
      date: "Nov 2025",
      category: "Fundamentals",
      content: "This is a test article with some content here. ".repeat(50),
      seoKeywords: ["CAP theorem", "distributed systems", "consistency"],
    };

    it("should generate valid schema.org TechArticle schema", () => {
      const schema = generateArticleSchema(mockArticle);
      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("TechArticle");
    });

    it("should include article URL as ID", () => {
      const schema = generateArticleSchema(mockArticle);
      expect(schema["@id"]).toBe("https://shahidster.tech/blog/cap-theorem");
    });

    it("should include title and description", () => {
      const schema = generateArticleSchema(mockArticle);
      expect(schema.headline).toBe("Understanding CAP Theorem");
      expect(schema.description).toBe("A deep dive into CAP theorem");
    });

    it("should include publication date in ISO format", () => {
      const schema = generateArticleSchema(mockArticle);
      expect(schema.datePublished).toBe("2025-11-15T00:00:00.000Z");
      expect(schema.dateModified).toBe("2025-11-15T00:00:00.000Z");
    });

    it("should include author information", () => {
      const schema = generateArticleSchema(mockArticle);
      expect(schema.author).toBeDefined();
      expect((schema.author as any)["@type"]).toBe("Person");
      expect((schema.author as any).name).toBe("Shahid Moosa");
    });

    it("should include publisher information", () => {
      const schema = generateArticleSchema(mockArticle);
      expect(schema.publisher).toBeDefined();
      expect((schema.publisher as any)["@type"]).toBe("Person");
    });

    it("should include article section", () => {
      const schema = generateArticleSchema(mockArticle);
      expect(schema.articleSection).toBe("Fundamentals");
    });

    it("should include keywords", () => {
      const schema = generateArticleSchema(mockArticle);
      expect(schema.keywords).toContain("CAP theorem");
      expect(schema.keywords).toContain("distributed systems");
    });

    it("should calculate word count", () => {
      const schema = generateArticleSchema(mockArticle);
      expect(schema.wordCount).toBeGreaterThan(0);
      expect(typeof schema.wordCount).toBe("number");
    });

    it("should include proficiency level", () => {
      const schema = generateArticleSchema(mockArticle);
      expect(schema.proficiencyLevel).toBe("Expert");
    });

    it("should include language", () => {
      const schema = generateArticleSchema(mockArticle);
      expect(schema.inLanguage).toBe("en-US");
    });

    it("should include series information when provided", () => {
      const schema = generateArticleSchema(mockArticle, { currentIndex: 2, total: 9 });
      expect(schema.isPartOf).toBeDefined();
      expect((schema.isPartOf as any)["@type"]).toBe("CreativeWorkSeries");
      expect((schema.isPartOf as any).position).toBe(2);
      expect((schema.isPartOf as any).numberOfItems).toBe(9);
    });

    it("should not include series information when not provided", () => {
      const schema = generateArticleSchema(mockArticle);
      expect(schema.isPartOf).toBeUndefined();
    });
  });

  describe("generateBreadcrumbSchema", () => {
    it("should generate valid schema.org BreadcrumbList schema", () => {
      const items = [
        { name: "Home", url: "https://shahidster.tech" },
        { name: "Blog", url: "https://shahidster.tech/blog" },
        { name: "Article", url: "https://shahidster.tech/blog/my-post" },
      ];
      const schema = generateBreadcrumbSchema(items);
      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("BreadcrumbList");
    });

    it("should create list items with correct positions", () => {
      const items = [
        { name: "Home", url: "https://shahidster.tech" },
        { name: "Blog", url: "https://shahidster.tech/blog" },
      ];
      const schema = generateBreadcrumbSchema(items);
      expect(schema.itemListElement).toHaveLength(2);
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[1].position).toBe(2);
    });

    it("should include name and URL for each item", () => {
      const items = [{ name: "Home", url: "https://shahidster.tech" }];
      const schema = generateBreadcrumbSchema(items);
      expect(schema.itemListElement[0].name).toBe("Home");
      expect(schema.itemListElement[0].item).toBe("https://shahidster.tech");
    });

    it("should handle empty breadcrumb list", () => {
      const schema = generateBreadcrumbSchema([]);
      expect(schema.itemListElement).toHaveLength(0);
    });

    it("should maintain order of items", () => {
      const items = [
        { name: "First", url: "/first" },
        { name: "Second", url: "/second" },
        { name: "Third", url: "/third" },
      ];
      const schema = generateBreadcrumbSchema(items);
      expect(schema.itemListElement[0].name).toBe("First");
      expect(schema.itemListElement[1].name).toBe("Second");
      expect(schema.itemListElement[2].name).toBe("Third");
    });
  });

  describe("stripMarkdown", () => {
    it("should remove code blocks", () => {
      const markdown = "Text before ```code here``` text after";
      const result = stripMarkdown(markdown);
      expect(result).not.toContain("```");
      expect(result).toContain("Text before");
      expect(result).toContain("text after");
    });

    it("should remove inline code", () => {
      const markdown = "Text with `inline code` here";
      const result = stripMarkdown(markdown);
      expect(result).not.toContain("`");
      expect(result).toContain("Text with");
    });

    it("should remove bold formatting", () => {
      const markdown = "Text with **bold text** here";
      const result = stripMarkdown(markdown);
      expect(result).not.toContain("**");
      expect(result).toContain("bold text");
    });

    it("should remove italic formatting", () => {
      const markdown = "Text with *italic* here";
      const result = stripMarkdown(markdown);
      expect(result).toBe("Text with italic here");
    });

    it("should remove headers", () => {
      const markdown = "## Header\nContent";
      const result = stripMarkdown(markdown);
      expect(result).not.toContain("##");
      expect(result).toContain("Header");
    });

    it("should convert links to text", () => {
      const markdown = "Click [here](https://example.com) to visit";
      const result = stripMarkdown(markdown);
      expect(result).not.toContain("[");
      expect(result).not.toContain("]");
      expect(result).toContain("here");
      expect(result).not.toContain("https://");
    });

    it("should replace newlines with spaces", () => {
      const markdown = "Line one\nLine two\nLine three";
      const result = stripMarkdown(markdown);
      expect(result).toBe("Line one Line two Line three");
    });

    it("should truncate to max length", () => {
      const longText = "a".repeat(200);
      const result = stripMarkdown(longText, 50);
      expect(result.length).toBe(50);
      expect(result).toContain("...");
    });

    it("should not truncate if under max length", () => {
      const shortText = "Short text";
      const result = stripMarkdown(shortText, 160);
      expect(result).toBe("Short text");
      expect(result).not.toContain("...");
    });

    it("should use default max length of 160", () => {
      const longText = "a".repeat(200);
      const result = stripMarkdown(longText);
      expect(result.length).toBe(160);
    });
  });

  describe("calculateReadTime", () => {
    it("should calculate reading time for short content", () => {
      const content = Array(100).fill("word").join(" "); // Exactly 100 words
      const result = calculateReadTime(content);
      expect(result).toBe("1 min read");
    });

    it("should calculate reading time for medium content", () => {
      const content = Array(500).fill("word").join(" "); // Exactly 500 words
      const result = calculateReadTime(content);
      expect(result).toBe("3 min read");
    });

    it("should calculate reading time for long content", () => {
      const content = Array(1000).fill("word").join(" "); // Exactly 1000 words
      const result = calculateReadTime(content);
      expect(result).toBe("5 min read");
    });

    it("should round up fractional minutes", () => {
      const content = Array(250).fill("word").join(" "); // Exactly 250 words = 1.25 min
      const result = calculateReadTime(content);
      expect(result).toBe("2 min read");
    });

    it("should use custom words per minute", () => {
      const content = Array(100).fill("word").join(" "); // Exactly 100 words
      const result = calculateReadTime(content, 100); // 100 wpm
      expect(result).toBe("1 min read");
    });

    it("should handle empty content", () => {
      const result = calculateReadTime("");
      expect(result).toMatch(/\d+ min read/);
    });

    it("should use default 200 words per minute", () => {
      const content = Array(200).fill("word").join(" "); // Exactly 200 words
      const result = calculateReadTime(content);
      expect(result).toBe("1 min read");
    });
  });
});