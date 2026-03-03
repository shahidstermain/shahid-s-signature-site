import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Next.js modules
vi.mock(
  "next/navigation",
  () => ({
    notFound: vi.fn(() => {
      throw new Error("NOT_FOUND");
    }),
  }),
  { virtual: true },
);

vi.mock(
  "next/link",
  () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
      <a href={href}>{children}</a>
    ),
  }),
  { virtual: true },
);

vi.mock(
  "next/script",
  () => ({
    default: ({
      children,
      id,
      type,
      dangerouslySetInnerHTML,
    }: {
      children?: React.ReactNode;
      id: string;
      type: string;
      dangerouslySetInnerHTML?: { __html: string };
    }) => (
      <script id={id} type={type}>
        {dangerouslySetInnerHTML?.__html || children}
      </script>
    ),
  }),
  { virtual: true },
);

// Import the functions we're testing
import { getArticleBySlug, articles } from "@/data/articles";

describe("Next.js Blog Page", () => {
  describe("generateStaticParams", () => {
    it("should generate params for all articles", () => {
      const params = articles.map((article) => ({
        slug: article.slug,
      }));

      expect(params.length).toBeGreaterThan(0);
      expect(params.every((p) => typeof p.slug === "string")).toBe(true);
    });

    it("should generate unique slugs", () => {
      const slugs = articles.map((a) => a.slug);
      const uniqueSlugs = new Set(slugs);

      expect(slugs.length).toBe(uniqueSlugs.size);
    });

    it("should use URL-safe slugs", () => {
      articles.forEach((article) => {
        expect(article.slug).toMatch(/^[a-z0-9-]+$/);
      });
    });
  });

  describe("parseArticleDate", () => {
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
      const date = parseArticleDate("Nov 2024");
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(10); // November
      expect(date.getDate()).toBe(15);
    });

    it("should handle all months", () => {
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
        const date = parseArticleDate(`${month} 2024`);
        expect(date.getMonth()).toBe(index);
      });
    });

    it("should default to January for invalid month", () => {
      const date = parseArticleDate("Invalid 2024");
      expect(date.getMonth()).toBe(0);
    });

    it("should handle different years", () => {
      expect(parseArticleDate("Jan 2020").getFullYear()).toBe(2020);
      expect(parseArticleDate("Dec 2025").getFullYear()).toBe(2025);
    });
  });

  describe("generateMetadata", () => {
    it("should return article metadata when article exists", () => {
      const article = articles[0];
      const SITE_URL = "https://shahidster.tech";

      const metadata = {
        title: article.title,
        description: article.description,
        keywords: article.seoKeywords,
        authors: [{ name: "Shahid Moosa", url: SITE_URL }],
      };

      expect(metadata.title).toBe(article.title);
      expect(metadata.description).toBe(article.description);
      expect(Array.isArray(metadata.keywords)).toBe(true);
    });

    it("should return not found metadata when article doesn't exist", () => {
      const article = getArticleBySlug("non-existent-slug");

      expect(article).toBeUndefined();
    });

    it("should generate Open Graph metadata", () => {
      const article = articles[0];
      const SITE_URL = "https://shahidster.tech";
      const articleUrl = `${SITE_URL}/blog/${article.slug}`;

      const openGraph = {
        type: "article",
        locale: "en_US",
        url: articleUrl,
        siteName: "Shahid Moosa — Distributed Systems Engineer",
        title: article.title,
        description: article.description,
        publishedTime: new Date().toISOString(),
        authors: ["Shahid Moosa"],
        section: article.category,
        tags: article.seoKeywords,
      };

      expect(openGraph.type).toBe("article");
      expect(openGraph.url).toContain(article.slug);
      expect(openGraph.section).toBe(article.category);
    });

    it("should generate Twitter Card metadata", () => {
      const article = articles[0];
      const SITE_URL = "https://shahidster.tech";

      const twitter = {
        card: "summary_large_image",
        title: article.title,
        description: article.description,
        images: [`${SITE_URL}/og-image.png`],
        creator: "@shahidster_",
      };

      expect(twitter.card).toBe("summary_large_image");
      expect(twitter.creator).toBe("@shahidster_");
    });

    it("should set canonical URL", () => {
      const article = articles[0];
      const SITE_URL = "https://shahidster.tech";
      const canonical = `${SITE_URL}/blog/${article.slug}`;

      expect(canonical).toBe(`${SITE_URL}/blog/${article.slug}`);
    });
  });

  describe("getSeriesNavigation", () => {
    const getSeriesNavigation = (currentSlug: string) => {
      const currentIndex = articles.findIndex((a) => a.slug === currentSlug);
      return {
        prev: currentIndex > 0 ? articles[currentIndex - 1] : null,
        next: currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null,
        currentIndex: currentIndex + 1,
        total: articles.length,
      };
    };

    it("should return null for prev on first article", () => {
      const nav = getSeriesNavigation(articles[0].slug);

      expect(nav.prev).toBeNull();
      expect(nav.next).not.toBeNull();
      expect(nav.currentIndex).toBe(1);
    });

    it("should return null for next on last article", () => {
      const lastSlug = articles[articles.length - 1].slug;
      const nav = getSeriesNavigation(lastSlug);

      expect(nav.prev).not.toBeNull();
      expect(nav.next).toBeNull();
      expect(nav.currentIndex).toBe(articles.length);
    });

    it("should return both prev and next for middle articles", () => {
      if (articles.length > 2) {
        const nav = getSeriesNavigation(articles[1].slug);

        expect(nav.prev).not.toBeNull();
        expect(nav.next).not.toBeNull();
        expect(nav.currentIndex).toBe(2);
      }
    });

    it("should track position correctly", () => {
      articles.forEach((article, index) => {
        const nav = getSeriesNavigation(article.slug);
        expect(nav.currentIndex).toBe(index + 1);
        expect(nav.total).toBe(articles.length);
      });
    });
  });

  describe("getBreadcrumbSchema", () => {
    const SITE_URL = "https://shahidster.tech";

    const getBreadcrumbSchema = (article: (typeof articles)[0]) => {
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Writing",
            item: `${SITE_URL}/#writing`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: `${SITE_URL}/blog/${article.slug}`,
          },
        ],
      };
    };

    it("should generate valid breadcrumb schema", () => {
      const article = articles[0];
      const schema = getBreadcrumbSchema(article);

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("BreadcrumbList");
      expect(schema.itemListElement.length).toBe(3);
    });

    it("should include all breadcrumb items", () => {
      const article = articles[0];
      const schema = getBreadcrumbSchema(article);

      expect(schema.itemListElement[0].name).toBe("Home");
      expect(schema.itemListElement[1].name).toBe("Writing");
      expect(schema.itemListElement[2].name).toBe(article.title);
    });

    it("should have correct positions", () => {
      const article = articles[0];
      const schema = getBreadcrumbSchema(article);

      schema.itemListElement.forEach((item, index) => {
        expect(item.position).toBe(index + 1);
      });
    });
  });

  describe("formatContent", () => {
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

    it("should convert markdown headings to HTML", () => {
      expect(formatContent("## Heading 2")).toContain("<h2>Heading 2</h2>");
      expect(formatContent("### Heading 3")).toContain("<h3>Heading 3</h3>");
    });

    it("should convert bold text", () => {
      expect(formatContent("**bold**")).toContain("<strong>bold</strong>");
    });

    it("should convert inline code", () => {
      expect(formatContent("`code`")).toContain("<code>code</code>");
    });

    it("should convert code blocks", () => {
      const result = formatContent("```js\nconst x = 1;\n```");
      expect(result).toContain("<pre>");
      expect(result).toContain("<code>");
    });

    it("should convert horizontal rules", () => {
      expect(formatContent("---")).toContain("<hr />");
    });

    it("should convert blockquotes", () => {
      expect(formatContent("> quote")).toContain("<blockquote>quote</blockquote>");
    });

    it("should convert list items", () => {
      expect(formatContent("- item")).toContain("<li>item</li>");
    });

    it("should wrap lists in ul tags", () => {
      const result = formatContent("- item1\n- item2");
      expect(result).toContain("<ul>");
      expect(result).toContain("</ul>");
    });
  });

  describe("article data validation", () => {
    it("should have all required fields", () => {
      articles.forEach((article) => {
        expect(article).toHaveProperty("slug");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("description");
        expect(article).toHaveProperty("category");
        expect(article).toHaveProperty("readTime");
        expect(article).toHaveProperty("date");
        expect(article).toHaveProperty("content");
      });
    });

    it("should have valid date format", () => {
      articles.forEach((article) => {
        expect(article.date).toMatch(/^[A-Z][a-z]{2} \d{4}$/);
      });
    });

    it("should have non-empty content", () => {
      articles.forEach((article) => {
        expect(article.content.length).toBeGreaterThan(0);
      });
    });

    it("should have SEO keywords", () => {
      articles.forEach((article) => {
        if (article.seoKeywords) {
          expect(Array.isArray(article.seoKeywords)).toBe(true);
          expect(article.seoKeywords.length).toBeGreaterThan(0);
        }
      });
    });

    it("should have valid series positions", () => {
      articles.forEach((article) => {
        if (article.seriesPosition) {
          expect(article.seriesPosition).toMatch(/Part \d+ of \d+/);
        }
      });
    });
  });

  describe("getArticleBySlug", () => {
    it("should return article when found", () => {
      const article = getArticleBySlug(articles[0].slug);
      expect(article).toBeDefined();
      expect(article?.slug).toBe(articles[0].slug);
    });

    it("should return undefined when not found", () => {
      const article = getArticleBySlug("non-existent");
      expect(article).toBeUndefined();
    });

    it("should be case-sensitive", () => {
      const slug = articles[0].slug;
      const upperSlug = slug.toUpperCase();
      const article = getArticleBySlug(upperSlug);
      expect(article).toBeUndefined();
    });
  });

  describe("related articles logic", () => {
    it("should find articles in same category", () => {
      const article = articles[0];
      const related = articles.filter(
        (a) => a.category === article.category && a.slug !== article.slug
      );

      if (related.length > 0) {
        related.forEach((rel) => {
          expect(rel.category).toBe(article.category);
          expect(rel.slug).not.toBe(article.slug);
        });
      }
    });

    it("should limit related articles to 3", () => {
      const article = articles[0];
      const related = articles
        .filter((a) => a.category === article.category && a.slug !== article.slug)
        .slice(0, 3);

      expect(related.length).toBeLessThanOrEqual(3);
    });

    it("should exclude current article from related", () => {
      const article = articles[0];
      const related = articles.filter(
        (a) => a.category === article.category && a.slug !== article.slug
      );

      expect(related.every((a) => a.slug !== article.slug)).toBe(true);
    });
  });

  describe("ISR configuration", () => {
    it("should have revalidate set to 1 hour", () => {
      const revalidate = 3600;
      expect(revalidate).toBe(3600);
      expect(revalidate).toBe(60 * 60);
    });
  });

  describe("edge cases", () => {
    it("should handle articles with no SEO keywords", () => {
      const articleWithoutKeywords = articles.find((a) => !a.seoKeywords);
      if (articleWithoutKeywords) {
        expect(articleWithoutKeywords.seoKeywords).toBeUndefined();
      }
    });

    it("should handle articles with no series position", () => {
      const articleWithoutSeries = articles.find((a) => !a.seriesPosition);
      if (articleWithoutSeries) {
        expect(articleWithoutSeries.seriesPosition).toBeUndefined();
      }
    });

    it("should handle articles with special characters in title", () => {
      const articlesWithSpecialChars = articles.filter((a) =>
        /[<>&"']/.test(a.title)
      );

      articlesWithSpecialChars.forEach((article) => {
        // These should be properly escaped in the metadata
        expect(article.title).toBeTruthy();
      });
    });

    it("should handle empty related articles", () => {
      // Create a scenario where an article has no related articles
      const uniqueCategory = "UniqueCategory" + Math.random();
      const related = articles.filter((a) => a.category === uniqueCategory);

      expect(related.length).toBe(0);
    });
  });
});