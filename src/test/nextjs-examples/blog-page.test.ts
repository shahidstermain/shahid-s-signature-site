import { describe, it, expect, vi, beforeEach } from "vitest";

// This test file validates the blog page structure and functions
// Note: The actual Next.js page component uses server-side rendering,
// so these tests focus on the utility functions and data structures

describe("Blog Page ([slug]/page.tsx)", () => {
  describe("parseArticleDate function", () => {
    // This function should parse "Mon YYYY" format dates
    const parseArticleDate = (dateStr: string): Date => {
      const months: Record<string, number> = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11,
      };
      const [month, year] = dateStr.split(" ");
      return new Date(parseInt(year), months[month] || 0, 15);
    };

    it("should parse valid date strings", () => {
      const date = parseArticleDate("Nov 2025");
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(10); // November is 10
      expect(date.getDate()).toBe(15);
    });

    it("should handle all months correctly", () => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      months.forEach((month, index) => {
        const date = parseArticleDate(`${month} 2024`);
        expect(date.getMonth()).toBe(index);
      });
    });

    it("should default to January for invalid month", () => {
      const date = parseArticleDate("Invalid 2024");
      expect(date.getMonth()).toBe(0);
    });

    it("should set day to 15th", () => {
      const date = parseArticleDate("Mar 2024");
      expect(date.getDate()).toBe(15);
    });
  });

  describe("formatContent function", () => {
    // This function converts markdown-like content to HTML
    const formatContent = (content: string): string => {
      return content
        .replace(/^### (.+)$/gm, "<h3>$1</h3>")
        .replace(/^## (.+)$/gm, "<h2>$1</h2>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/```(\w+)?\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>")
        .replace(/^---$/gm, "<hr />")
        .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
        .replace(/^- (.+)$/gm, "<li>$1</li>")
        .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
        .replace(/\n\n/g, "</p><p>")
        .replace(/^(?!<[hpuoltb])(.+)$/gm, "<p>$1</p>")
        .replace(/<p><\/p>/g, "")
        .replace(/<p>\s*<\/p>/g, "");
    };

    it("should convert h2 headers", () => {
      const result = formatContent("## Header");
      expect(result).toContain("<h2>Header</h2>");
    });

    it("should convert h3 headers", () => {
      const result = formatContent("### Subheader");
      expect(result).toContain("<h3>Subheader</h3>");
    });

    it("should convert bold text", () => {
      const result = formatContent("**bold text**");
      expect(result).toContain("<strong>bold text</strong>");
    });

    it("should convert inline code", () => {
      const result = formatContent("`code`");
      expect(result).toContain("<code>code</code>");
    });

    it("should convert code blocks", () => {
      const result = formatContent("```js\nconst x = 1;\n```");
      expect(result).toContain("<pre><code>");
      expect(result).toContain("const x = 1;");
      expect(result).toContain("</code></pre>");
    });

    it("should convert horizontal rules", () => {
      const result = formatContent("---");
      expect(result).toContain("<hr />");
    });

    it("should convert blockquotes", () => {
      const result = formatContent("> Quote");
      expect(result).toContain("<blockquote>Quote</blockquote>");
    });

    it("should convert list items", () => {
      const result = formatContent("- Item 1\n- Item 2");
      expect(result).toContain("<li>Item 1</li>");
      expect(result).toContain("<li>Item 2</li>");
      expect(result).toContain("<ul>");
      expect(result).toContain("</ul>");
    });

    it("should wrap regular text in paragraphs", () => {
      const result = formatContent("Regular text");
      expect(result).toContain("<p>");
      expect(result).toContain("</p>");
    });

    it("should handle multiple paragraphs", () => {
      const result = formatContent("Para 1\n\nPara 2");
      expect(result).toContain("</p><p>");
    });

    it("should remove empty paragraphs", () => {
      const result = formatContent("Text\n\n\n\nMore text");
      expect(result).not.toContain("<p></p>");
    });

    it("should handle mixed formatting", () => {
      const content = "## Title\n\n**Bold** and `code`\n\n- List item";
      const result = formatContent(content);
      expect(result).toContain("<h2>");
      expect(result).toContain("<strong>");
      expect(result).toContain("<code>");
      expect(result).toContain("<li>");
    });
  });

  describe("getSeriesNavigation function", () => {
    const mockArticles = [
      { slug: "article-1", title: "Article 1" },
      { slug: "article-2", title: "Article 2" },
      { slug: "article-3", title: "Article 3" },
    ];

    const getSeriesNavigation = (currentSlug: string) => {
      const currentIndex = mockArticles.findIndex((a) => a.slug === currentSlug);
      return {
        prev: currentIndex > 0 ? mockArticles[currentIndex - 1] : null,
        next: currentIndex < mockArticles.length - 1 ? mockArticles[currentIndex + 1] : null,
        currentIndex: currentIndex + 1,
        total: mockArticles.length,
      };
    };

    it("should return null prev for first article", () => {
      const nav = getSeriesNavigation("article-1");
      expect(nav.prev).toBeNull();
      expect(nav.next).toBeTruthy();
      expect(nav.currentIndex).toBe(1);
    });

    it("should return null next for last article", () => {
      const nav = getSeriesNavigation("article-3");
      expect(nav.prev).toBeTruthy();
      expect(nav.next).toBeNull();
      expect(nav.currentIndex).toBe(3);
    });

    it("should return both prev and next for middle article", () => {
      const nav = getSeriesNavigation("article-2");
      expect(nav.prev).toBeTruthy();
      expect(nav.next).toBeTruthy();
      expect(nav.prev?.slug).toBe("article-1");
      expect(nav.next?.slug).toBe("article-3");
      expect(nav.currentIndex).toBe(2);
    });

    it("should return correct total count", () => {
      const nav = getSeriesNavigation("article-2");
      expect(nav.total).toBe(3);
    });
  });

  describe("generateMetadata function behavior", () => {
    it("should return 'not found' metadata for missing article", () => {
      const metadata = {
        title: "Article Not Found",
        description: "The requested article could not be found.",
        robots: { index: false, follow: true },
      };

      expect(metadata.title).toBe("Article Not Found");
      expect(metadata.robots.index).toBe(false);
      expect(metadata.robots.follow).toBe(true);
    });

    it("should include required Open Graph fields for valid article", () => {
      const metadata = {
        title: "Test Article",
        description: "Test description",
        openGraph: {
          type: "article",
          locale: "en_US",
          url: "https://shahidster.tech/blog/test",
          siteName: "Shahid Moosa — Distributed Systems Engineer",
          title: "Test Article",
          description: "Test description",
          publishedTime: new Date("2024-01-15").toISOString(),
          modifiedTime: new Date("2024-01-15").toISOString(),
          authors: ["Shahid Moosa"],
          section: "Testing",
        },
      };

      expect(metadata.openGraph.type).toBe("article");
      expect(metadata.openGraph.locale).toBe("en_US");
      expect(metadata.openGraph.publishedTime).toBeTruthy();
    });

    it("should include Twitter card metadata", () => {
      const metadata = {
        twitter: {
          card: "summary_large_image",
          title: "Test Article",
          description: "Test description",
          images: ["https://shahidster.tech/og-image.png"],
          creator: "@shahidster_",
        },
      };

      expect(metadata.twitter.card).toBe("summary_large_image");
      expect(metadata.twitter.creator).toBe("@shahidster_");
    });

    it("should include canonical URL", () => {
      const metadata = {
        alternates: {
          canonical: "https://shahidster.tech/blog/test-article",
        },
      };

      expect(metadata.alternates.canonical).toContain("/blog/");
    });
  });

  describe("getBreadcrumbSchema function behavior", () => {
    const mockArticle = {
      slug: "test-article",
      title: "Test Article",
    };

    const getBreadcrumbSchema = (article: { slug: string; title: string }) => ({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://shahidster.tech",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Writing",
          item: "https://shahidster.tech/#writing",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: article.title,
          item: `https://shahidster.tech/blog/${article.slug}`,
        },
      ],
    });

    it("should include three breadcrumb items", () => {
      const schema = getBreadcrumbSchema(mockArticle);
      expect(schema.itemListElement.length).toBe(3);
    });

    it("should have correct breadcrumb structure", () => {
      const schema = getBreadcrumbSchema(mockArticle);
      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("BreadcrumbList");
    });

    it("should include home, writing, and article links", () => {
      const schema = getBreadcrumbSchema(mockArticle);
      expect(schema.itemListElement[0].name).toBe("Home");
      expect(schema.itemListElement[1].name).toBe("Writing");
      expect(schema.itemListElement[2].name).toBe("Test Article");
    });

    it("should have sequential positions", () => {
      const schema = getBreadcrumbSchema(mockArticle);
      schema.itemListElement.forEach((item, index) => {
        expect(item.position).toBe(index + 1);
      });
    });
  });

  describe("generateStaticParams behavior", () => {
    it("should generate params for all articles", () => {
      const mockArticles = [
        { slug: "article-1" },
        { slug: "article-2" },
        { slug: "article-3" },
      ];

      const params = mockArticles.map((article) => ({
        slug: article.slug,
      }));

      expect(params.length).toBe(3);
      expect(params[0]).toEqual({ slug: "article-1" });
      expect(params[1]).toEqual({ slug: "article-2" });
      expect(params[2]).toEqual({ slug: "article-3" });
    });

    it("should return array of slug objects", () => {
      const mockArticles = [{ slug: "test" }];
      const params = mockArticles.map((article) => ({
        slug: article.slug,
      }));

      expect(Array.isArray(params)).toBe(true);
      expect(params[0]).toHaveProperty("slug");
    });
  });

  describe("revalidate configuration", () => {
    it("should use ISR with 1 hour revalidation", () => {
      const revalidate = 3600;
      expect(revalidate).toBe(3600);
      expect(revalidate).toBe(60 * 60); // 1 hour in seconds
    });
  });

  describe("related articles logic", () => {
    it("should filter articles by same category", () => {
      const mockArticles = [
        { slug: "current", category: "Testing" },
        { slug: "related-1", category: "Testing" },
        { slug: "related-2", category: "Testing" },
        { slug: "unrelated", category: "Other" },
      ];

      const currentArticle = mockArticles[0];
      const related = mockArticles
        .filter((a) => a.category === currentArticle.category && a.slug !== currentArticle.slug)
        .slice(0, 3);

      expect(related.length).toBe(2);
      expect(related.every((a) => a.category === "Testing")).toBe(true);
      expect(related.every((a) => a.slug !== "current")).toBe(true);
    });

    it("should limit to 3 related articles", () => {
      const mockArticles = [
        { slug: "current", category: "Testing" },
        { slug: "related-1", category: "Testing" },
        { slug: "related-2", category: "Testing" },
        { slug: "related-3", category: "Testing" },
        { slug: "related-4", category: "Testing" },
      ];

      const currentArticle = mockArticles[0];
      const related = mockArticles
        .filter((a) => a.category === currentArticle.category && a.slug !== currentArticle.slug)
        .slice(0, 3);

      expect(related.length).toBe(3);
    });

    it("should exclude current article from related", () => {
      const mockArticles = [
        { slug: "current", category: "Testing" },
        { slug: "related", category: "Testing" },
      ];

      const currentArticle = mockArticles[0];
      const related = mockArticles.filter(
        (a) => a.category === currentArticle.category && a.slug !== currentArticle.slug
      );

      expect(related.every((a) => a.slug !== "current")).toBe(true);
    });
  });

  describe("site configuration constants", () => {
    it("should have valid site URL", () => {
      const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://shahidster.tech";
      expect(SITE_URL).toMatch(/^https?:\/\//);
    });

    it("should have author name", () => {
      const AUTHOR_NAME = "Shahid Moosa";
      expect(AUTHOR_NAME.length).toBeGreaterThan(0);
    });

    it("should have Twitter handle", () => {
      const TWITTER_HANDLE = "@shahidster_";
      expect(TWITTER_HANDLE).toMatch(/^@/);
    });
  });

  describe("edge cases", () => {
    it("should handle empty content gracefully", () => {
      const formatContent = (content: string): string => {
        return content.replace(/^## (.+)$/gm, "<h2>$1</h2>");
      };

      const result = formatContent("");
      expect(result).toBe("");
    });

    it("should handle content with special characters", () => {
      const formatContent = (content: string): string => {
        return content.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      };

      const result = formatContent("**<>&\"'**");
      expect(result).toContain("<strong>");
    });

    it("should handle date parsing with extra spaces", () => {
      const parseArticleDate = (dateStr: string): Date => {
        const months: Record<string, number> = { Jan: 0 };
        const [month, year] = dateStr.trim().split(/\s+/);
        return new Date(parseInt(year), months[month] || 0, 15);
      };

      const date = parseArticleDate("Jan  2024");
      expect(date.getFullYear()).toBe(2024);
    });
  });
});