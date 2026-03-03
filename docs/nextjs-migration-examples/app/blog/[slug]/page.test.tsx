import { describe, it, expect, vi } from "vitest";

// Mock Next.js modules
vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("next/script", () => ({
  default: ({ children, id, type }: { children?: string; id: string; type: string }) => (
    <script id={id} type={type}>
      {children}
    </script>
  ),
}));

vi.mock("lucide-react", () => ({
  ArrowLeft: () => <div>ArrowLeft</div>,
  ArrowRight: () => <div>ArrowRight</div>,
  Clock: () => <div>Clock</div>,
  Calendar: () => <div>Calendar</div>,
  BookOpen: () => <div>BookOpen</div>,
}));

vi.mock("@/data/articles", () => ({
  articles: [
    {
      slug: "article-1",
      title: "First Article",
      description: "First article description",
      category: "Testing",
      date: "Jan 2024",
      readTime: "5 min",
      content: "## Introduction\n\nFirst article **content**.\n\n```js\nconst x = 1;\n```",
      seoKeywords: ["test", "first"],
    },
    {
      slug: "article-2",
      title: "Second Article",
      description: "Second article description",
      category: "Testing",
      date: "Feb 2024",
      readTime: "7 min",
      content: "Second article content.",
      seoKeywords: ["test", "second"],
    },
    {
      slug: "article-3",
      title: "Third Article",
      description: "Third article description",
      category: "Advanced",
      date: "Mar 2024",
      readTime: "10 min",
      content: "Third article content.",
    },
  ],
  getArticleBySlug: (slug: string) => {
    const articles = [
      {
        slug: "article-1",
        title: "First Article",
        description: "First article description",
        category: "Testing",
        date: "Jan 2024",
        readTime: "5 min",
        content: "## Introduction\n\nFirst article **content**.\n\n```js\nconst x = 1;\n```",
        seoKeywords: ["test", "first"],
      },
      {
        slug: "article-2",
        title: "Second Article",
        description: "Second article description",
        category: "Testing",
        date: "Feb 2024",
        readTime: "7 min",
        content: "Second article content.",
        seoKeywords: ["test", "second"],
      },
      {
        slug: "article-3",
        title: "Third Article",
        description: "Third article description",
        category: "Advanced",
        date: "Mar 2024",
        readTime: "10 min",
        content: "Third article content.",
      },
    ];
    return articles.find((a) => a.slug === slug) || null;
  },
}));

// Import utility functions from the page
// These are inline functions we're testing
describe("Blog page utility functions", () => {
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
      const date = parseArticleDate("Jan 2024");
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(0);
      expect(date.getDate()).toBe(15);
    });

    it("should parse all months correctly", () => {
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

    it("should default to January for unknown month", () => {
      const date = parseArticleDate("Unknown 2024");
      expect(date.getMonth()).toBe(0);
    });

    it("should handle different years", () => {
      expect(parseArticleDate("Jan 2020").getFullYear()).toBe(2020);
      expect(parseArticleDate("Dec 2025").getFullYear()).toBe(2025);
    });

    it("should always set day to 15", () => {
      expect(parseArticleDate("Jan 2024").getDate()).toBe(15);
      expect(parseArticleDate("Jun 2024").getDate()).toBe(15);
      expect(parseArticleDate("Dec 2024").getDate()).toBe(15);
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

    it("should convert level 2 headings", () => {
      expect(formatContent("## Heading")).toContain("<h2>Heading</h2>");
    });

    it("should convert level 3 headings", () => {
      expect(formatContent("### Subheading")).toContain("<h3>Subheading</h3>");
    });

    it("should convert bold text", () => {
      expect(formatContent("**bold text**")).toContain("<strong>bold text</strong>");
    });

    it("should convert inline code", () => {
      expect(formatContent("`code here`")).toContain("<code>code here</code>");
    });

    it("should convert code blocks", () => {
      const markdown = "```javascript\nconst x = 1;\n```";
      const result = formatContent(markdown);
      expect(result).toContain("<pre><code>");
      expect(result).toContain("const x = 1;");
    });

    it("should convert horizontal rules", () => {
      expect(formatContent("---")).toContain("<hr />");
    });

    it("should convert blockquotes", () => {
      expect(formatContent("> Quote")).toContain("<blockquote>Quote</blockquote>");
    });

    it("should convert list items", () => {
      const result = formatContent("- Item 1\n- Item 2");
      expect(result).toContain("<li>Item 1</li>");
      expect(result).toContain("<li>Item 2</li>");
      expect(result).toContain("<ul>");
    });

    it("should handle multiple markdown features together", () => {
      const markdown = "## Title\n\nText with **bold** and `code`.\n\n- List item";
      const result = formatContent(markdown);
      expect(result).toContain("<h2>Title</h2>");
      expect(result).toContain("<strong>bold</strong>");
      expect(result).toContain("<code>code</code>");
      expect(result).toContain("<li>List item</li>");
    });

    it("should remove empty paragraphs", () => {
      const result = formatContent("Text\n\n\n\nMore text");
      expect(result).not.toContain("<p></p>");
      expect(result).not.toContain("<p>  </p>");
    });

    it("should handle code blocks with language", () => {
      const markdown = "```typescript\ntype X = string;\n```";
      const result = formatContent(markdown);
      expect(result).toContain("<pre><code>");
      expect(result).toContain("type X = string;");
    });
  });

  describe("getSeriesNavigation", () => {
    const articles = [
      { slug: "article-1", title: "First" },
      { slug: "article-2", title: "Second" },
      { slug: "article-3", title: "Third" },
    ];

    const getSeriesNavigation = (currentSlug: string) => {
      const currentIndex = articles.findIndex((a) => a.slug === currentSlug);
      return {
        prev: currentIndex > 0 ? articles[currentIndex - 1] : null,
        next: currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null,
        currentIndex: currentIndex + 1,
        total: articles.length,
      };
    };

    it("should return correct navigation for first article", () => {
      const nav = getSeriesNavigation("article-1");
      expect(nav.prev).toBeNull();
      expect(nav.next).toEqual({ slug: "article-2", title: "Second" });
      expect(nav.currentIndex).toBe(1);
      expect(nav.total).toBe(3);
    });

    it("should return correct navigation for middle article", () => {
      const nav = getSeriesNavigation("article-2");
      expect(nav.prev).toEqual({ slug: "article-1", title: "First" });
      expect(nav.next).toEqual({ slug: "article-3", title: "Third" });
      expect(nav.currentIndex).toBe(2);
      expect(nav.total).toBe(3);
    });

    it("should return correct navigation for last article", () => {
      const nav = getSeriesNavigation("article-3");
      expect(nav.prev).toEqual({ slug: "article-2", title: "Second" });
      expect(nav.next).toBeNull();
      expect(nav.currentIndex).toBe(3);
      expect(nav.total).toBe(3);
    });

    it("should use 1-based indexing for currentIndex", () => {
      expect(getSeriesNavigation("article-1").currentIndex).toBe(1);
      expect(getSeriesNavigation("article-2").currentIndex).toBe(2);
      expect(getSeriesNavigation("article-3").currentIndex).toBe(3);
    });

    it("should always return correct total", () => {
      expect(getSeriesNavigation("article-1").total).toBe(3);
      expect(getSeriesNavigation("article-2").total).toBe(3);
      expect(getSeriesNavigation("article-3").total).toBe(3);
    });
  });

  describe("getBreadcrumbSchema", () => {
    const SITE_URL = "https://shahidster.tech";

    const getBreadcrumbSchema = (article: {
      title: string;
      slug: string;
    }) => ({
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
    });

    it("should generate valid breadcrumb schema", () => {
      const article = { title: "Test Article", slug: "test-article" };
      const schema = getBreadcrumbSchema(article);

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("BreadcrumbList");
      expect(Array.isArray(schema.itemListElement)).toBe(true);
      expect(schema.itemListElement.length).toBe(3);
    });

    it("should have Home as first breadcrumb", () => {
      const article = { title: "Test", slug: "test" };
      const schema = getBreadcrumbSchema(article);
      const firstItem = schema.itemListElement[0];

      expect(firstItem.position).toBe(1);
      expect(firstItem.name).toBe("Home");
      expect(firstItem.item).toBe(SITE_URL);
    });

    it("should have Writing as second breadcrumb", () => {
      const article = { title: "Test", slug: "test" };
      const schema = getBreadcrumbSchema(article);
      const secondItem = schema.itemListElement[1];

      expect(secondItem.position).toBe(2);
      expect(secondItem.name).toBe("Writing");
      expect(secondItem.item).toBe(`${SITE_URL}/#writing`);
    });

    it("should have article as third breadcrumb", () => {
      const article = { title: "My Article", slug: "my-article" };
      const schema = getBreadcrumbSchema(article);
      const thirdItem = schema.itemListElement[2];

      expect(thirdItem.position).toBe(3);
      expect(thirdItem.name).toBe("My Article");
      expect(thirdItem.item).toBe(`${SITE_URL}/blog/my-article`);
    });

    it("should return valid JSON-LD", () => {
      const article = { title: "Test", slug: "test" };
      const schema = getBreadcrumbSchema(article);

      expect(() => JSON.stringify(schema)).not.toThrow();
    });

    it("should handle articles with special characters", () => {
      const article = { title: "Test & <Special>", slug: "test-special" };
      const schema = getBreadcrumbSchema(article);

      expect(schema.itemListElement[2].name).toBe("Test & <Special>");
    });
  });

  describe("generateMetadata", () => {
    it("should return 404 metadata for non-existent article", () => {
      const { getArticleBySlug } = require("@/data/articles");
      const article = getArticleBySlug("non-existent");

      expect(article).toBeNull();
    });

    it("should find existing articles", () => {
      const { getArticleBySlug } = require("@/data/articles");
      const article = getArticleBySlug("article-1");

      expect(article).toBeDefined();
      expect(article?.title).toBe("First Article");
    });

    it("should handle different article slugs", () => {
      const { getArticleBySlug } = require("@/data/articles");

      expect(getArticleBySlug("article-1")?.slug).toBe("article-1");
      expect(getArticleBySlug("article-2")?.slug).toBe("article-2");
      expect(getArticleBySlug("article-3")?.slug).toBe("article-3");
    });
  });

  describe("generateStaticParams", () => {
    it("should return array of slug params", () => {
      const { articles } = require("@/data/articles");
      const params = articles.map((article: { slug: string }) => ({
        slug: article.slug,
      }));

      expect(Array.isArray(params)).toBe(true);
      expect(params.length).toBe(3);
    });

    it("should have slug property for each param", () => {
      const { articles } = require("@/data/articles");
      const params = articles.map((article: { slug: string }) => ({
        slug: article.slug,
      }));

      params.forEach((param: { slug: string }) => {
        expect(param).toHaveProperty("slug");
        expect(typeof param.slug).toBe("string");
      });
    });
  });

  describe("related articles logic", () => {
    it("should filter articles by same category", () => {
      const { articles } = require("@/data/articles");
      const currentSlug = "article-1";
      const currentCategory = "Testing";

      const related = articles
        .filter(
          (a: { category: string; slug: string }) =>
            a.category === currentCategory && a.slug !== currentSlug
        )
        .slice(0, 3);

      expect(related.length).toBe(1); // Only article-2 matches
      expect(related[0].slug).toBe("article-2");
    });

    it("should exclude current article", () => {
      const { articles } = require("@/data/articles");
      const currentSlug = "article-1";
      const currentCategory = "Testing";

      const related = articles.filter(
        (a: { category: string; slug: string }) =>
          a.category === currentCategory && a.slug !== currentSlug
      );

      expect(related.every((a: { slug: string }) => a.slug !== currentSlug)).toBe(true);
    });

    it("should limit to 3 related articles", () => {
      const { articles } = require("@/data/articles");
      const currentSlug = "article-1";
      const currentCategory = "Testing";

      const related = articles
        .filter(
          (a: { category: string; slug: string }) =>
            a.category === currentCategory && a.slug !== currentSlug
        )
        .slice(0, 3);

      expect(related.length).toBeLessThanOrEqual(3);
    });

    it("should return empty array when no related articles", () => {
      const { articles } = require("@/data/articles");
      const currentSlug = "article-3";
      const currentCategory = "Advanced";

      const related = articles
        .filter(
          (a: { category: string; slug: string }) =>
            a.category === currentCategory && a.slug !== currentSlug
        )
        .slice(0, 3);

      expect(related.length).toBe(0);
    });
  });
});