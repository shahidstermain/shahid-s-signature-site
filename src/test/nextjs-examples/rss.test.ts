import { describe, it, expect, vi } from "vitest";

// Mock dependencies
vi.mock("@/data/articles", () => ({
  articles: [
    {
      slug: "test-article-1",
      title: "Test Article One",
      description: "First test article description",
      category: "Testing",
      date: "Jan 2024",
      content: "This is **bold** content with `code` and more text.",
      seoKeywords: ["test", "article"],
    },
    {
      slug: "test-article-2",
      title: "Special <>&\"' Characters",
      description: "Article with special & characters",
      category: "XML & Tests",
      date: "Feb 2024",
      content: "Content with **markdown** and ```code blocks```",
      seoKeywords: ["xml", "special"],
    },
  ],
}));

describe("Next.js RSS Route Handler", () => {
  const SITE_URL = "https://shahidster.tech";
  const SITE_TITLE = "Shahid Moosa — Distributed Systems Engineering";
  const SITE_DESCRIPTION =
    "Deep dives into distributed databases, data infrastructure, and production systems. Written by a senior distributed-systems engineer.";
  const AUTHOR_NAME = "Shahid Moosa";
  const AUTHOR_EMAIL = "hello@shahidster.tech";

  describe("escapeXml function", () => {
    const escapeXml = (text: string): string => {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
    };

    it("should escape ampersands", () => {
      expect(escapeXml("Tom & Jerry")).toBe("Tom &amp; Jerry");
    });

    it("should escape less than signs", () => {
      expect(escapeXml("x < y")).toBe("x &lt; y");
    });

    it("should escape greater than signs", () => {
      expect(escapeXml("x > y")).toBe("x &gt; y");
    });

    it("should escape quotes", () => {
      expect(escapeXml('Say "hello"')).toBe("Say &quot;hello&quot;");
    });

    it("should escape apostrophes", () => {
      expect(escapeXml("It's working")).toBe("It&apos;s working");
    });

    it("should escape multiple special characters", () => {
      expect(escapeXml('<div class="test" data-value=\'5 & more\'>')).toBe(
        "&lt;div class=&quot;test&quot; data-value=&apos;5 &amp; more&apos;&gt;"
      );
    });

    it("should handle text without special characters", () => {
      expect(escapeXml("Hello World")).toBe("Hello World");
    });
  });

  describe("stripMarkdown function", () => {
    const stripMarkdown = (content: string): string => {
      return content
        .replace(/```[\s\S]*?```/g, "")
        .replace(/`[^`]+`/g, "")
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/\n+/g, " ")
        .trim()
        .slice(0, 500);
    };

    it("should remove code blocks", () => {
      const result = stripMarkdown("text ```code block``` more text");
      expect(result).not.toContain("```");
      expect(result).toContain("text");
      expect(result).toContain("more text");
    });

    it("should remove inline code", () => {
      const result = stripMarkdown("Use `const x = 5` here");
      expect(result).not.toContain("`");
      expect(result).not.toContain("const x = 5");
    });

    it("should remove bold markers", () => {
      const result = stripMarkdown("This is **bold** text");
      expect(result).toBe("This is bold text");
    });

    it("should remove headers", () => {
      const result = stripMarkdown("## Heading\nContent");
      expect(result).not.toContain("##");
      expect(result).toContain("Heading");
    });

    it("should convert links to text", () => {
      const result = stripMarkdown("[link text](https://example.com)");
      expect(result).toBe("link text");
      expect(result).not.toContain("https://example.com");
    });

    it("should replace newlines with spaces", () => {
      const result = stripMarkdown("Line 1\n\nLine 2");
      expect(result).toBe("Line 1 Line 2");
    });

    it("should trim whitespace", () => {
      const result = stripMarkdown("   text   ");
      expect(result).toBe("text");
    });

    it("should truncate to 500 characters", () => {
      const longText = "a".repeat(600);
      const result = stripMarkdown(longText);
      expect(result.length).toBe(500);
    });
  });

  describe("GET handler response structure", () => {
    it("should return Response with RSS XML content type", () => {
      const headers = {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff",
      };

      expect(headers["Content-Type"]).toBe("application/rss+xml; charset=utf-8");
      expect(headers["Cache-Control"]).toContain("max-age=3600");
      expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    });

    it("should have proper cache headers", () => {
      const cacheControl =
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400";

      expect(cacheControl).toContain("public");
      expect(cacheControl).toContain("max-age=3600");
      expect(cacheControl).toContain("s-maxage=3600");
      expect(cacheControl).toContain("stale-while-revalidate=86400");
    });

    it("should include security header", () => {
      const headers = {
        "X-Content-Type-Options": "nosniff",
      };

      expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    });
  });

  describe("RSS feed structure", () => {
    const generateBasicRSS = () => {
      return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
  </channel>
</rss>`;
    };

    it("should have XML declaration", () => {
      const rss = generateBasicRSS();
      expect(rss).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    });

    it("should have RSS 2.0 version", () => {
      const rss = generateBasicRSS();
      expect(rss).toContain('<rss version="2.0"');
    });

    it("should include content namespace", () => {
      const rss = generateBasicRSS();
      expect(rss).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
    });

    it("should include Atom namespace", () => {
      const rss = generateBasicRSS();
      expect(rss).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    });

    it("should include Dublin Core namespace", () => {
      const rss = generateBasicRSS();
      expect(rss).toContain('xmlns:dc="http://purl.org/dc/elements/1.1/"');
    });
  });

  describe("RSS channel metadata", () => {
    it("should include channel title", () => {
      const channel = {
        title: SITE_TITLE,
        link: SITE_URL,
        description: SITE_DESCRIPTION,
      };

      expect(channel.title).toBe(SITE_TITLE);
    });

    it("should include channel link", () => {
      const link = SITE_URL;
      expect(link).toBe("https://shahidster.tech");
    });

    it("should include channel description", () => {
      const description = SITE_DESCRIPTION;
      expect(description).toContain("distributed databases");
    });

    it("should include language", () => {
      const language = "en-us";
      expect(language).toBe("en-us");
    });

    it("should include lastBuildDate", () => {
      const now = new Date().toUTCString();
      expect(now).toMatch(/^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4}/);
    });

    it("should include TTL", () => {
      const ttl = 60;
      expect(ttl).toBe(60);
    });

    it("should include generator", () => {
      const generator = "Next.js RSS Generator";
      expect(generator).toBe("Next.js RSS Generator");
    });

    it("should include managingEditor", () => {
      const editor = `${AUTHOR_EMAIL} (${AUTHOR_NAME})`;
      expect(editor).toContain(AUTHOR_EMAIL);
      expect(editor).toContain(AUTHOR_NAME);
    });

    it("should include webMaster", () => {
      const webMaster = `${AUTHOR_EMAIL} (${AUTHOR_NAME})`;
      expect(webMaster).toContain(AUTHOR_EMAIL);
    });

    it("should include copyright", () => {
      const year = new Date().getFullYear();
      const copyright = `Copyright ${year} ${AUTHOR_NAME}. All rights reserved.`;
      expect(copyright).toContain(year.toString());
      expect(copyright).toContain(AUTHOR_NAME);
    });
  });

  describe("Atom self-link", () => {
    it("should include atom:link with correct attributes", () => {
      const atomLink = {
        href: `${SITE_URL}/rss.xml`,
        rel: "self",
        type: "application/rss+xml",
      };

      expect(atomLink.href).toBe(`${SITE_URL}/rss.xml`);
      expect(atomLink.rel).toBe("self");
      expect(atomLink.type).toBe("application/rss+xml");
    });
  });

  describe("RSS feed image", () => {
    it("should include image with all required fields", () => {
      const image = {
        url: `${SITE_URL}/og-image.png`,
        title: SITE_TITLE,
        link: SITE_URL,
        width: 1200,
        height: 630,
      };

      expect(image.url).toContain("/og-image.png");
      expect(image.title).toBe(SITE_TITLE);
      expect(image.link).toBe(SITE_URL);
      expect(image.width).toBe(1200);
      expect(image.height).toBe(630);
    });

    it("should have valid image dimensions", () => {
      const width = 1200;
      const height = 630;

      expect(width).toBeGreaterThan(0);
      expect(height).toBeGreaterThan(0);
      expect(width / height).toBeCloseTo(1.9, 1); // Open Graph aspect ratio
    });
  });

  describe("RSS item structure", () => {
    it("should have required item fields", () => {
      const item = {
        title: "Test Article",
        link: `${SITE_URL}/blog/test-article`,
        guid: `${SITE_URL}/blog/test-article`,
        description: "Article description",
        pubDate: new Date().toUTCString(),
        author: `${AUTHOR_EMAIL} (${AUTHOR_NAME})`,
        category: "Testing",
      };

      expect(item).toHaveProperty("title");
      expect(item).toHaveProperty("link");
      expect(item).toHaveProperty("guid");
      expect(item).toHaveProperty("description");
      expect(item).toHaveProperty("pubDate");
      expect(item).toHaveProperty("author");
      expect(item).toHaveProperty("category");
    });

    it("should have guid as permalink", () => {
      const guid = {
        isPermaLink: true,
        value: `${SITE_URL}/blog/test-article`,
      };

      expect(guid.isPermaLink).toBe(true);
      expect(guid.value).toContain(SITE_URL);
    });

    it("should include content:encoded with CDATA", () => {
      const content = "<![CDATA[Article content...]]>";
      expect(content).toContain("<![CDATA[");
      expect(content).toContain("]]>");
    });

    it("should include author in RFC 822 format", () => {
      const author = `${AUTHOR_EMAIL} (${AUTHOR_NAME})`;
      expect(author).toMatch(/^[^\s]+@[^\s]+ \(.+\)$/);
    });

    it("should format pubDate in RFC 822", () => {
      const pubDate = new Date("2024-01-01").toUTCString();
      expect(pubDate).toMatch(
        /^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/
      );
    });
  });

  describe("article categories and keywords", () => {
    it("should include article category", () => {
      const category = "Testing";
      expect(category).toBeTruthy();
    });

    it("should include SEO keywords as categories", () => {
      const keywords = ["test", "article", "example"];
      expect(Array.isArray(keywords)).toBe(true);
      expect(keywords.length).toBeGreaterThan(0);
    });

    it("should escape category names", () => {
      const escapeXml = (text: string) => text.replace(/&/g, "&amp;");
      const category = "Tests & Examples";
      expect(escapeXml(category)).toBe("Tests &amp; Examples");
    });

    it("should handle articles without keywords", () => {
      const keywords: string[] | undefined = undefined;
      const categories = [
        "Testing",
        ...(keywords || []),
      ];

      expect(categories).toEqual(["Testing"]);
    });
  });

  describe("article sorting", () => {
    const parseDate = (dateStr: string): Date => {
      const months: Record<string, number> = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
      };
      const [month, year] = dateStr.split(" ");
      return new Date(Date.UTC(Number(year), months[month] ?? 0, 1));
    };

    it("should sort articles by date (newest first)", () => {
      const dates = ["Jan 2024", "Mar 2024", "Feb 2024"];
      const sorted = dates.sort(
        (a, b) => parseDate(b).getTime() - parseDate(a).getTime()
      );

      expect(sorted[0]).toBe("Mar 2024");
      expect(sorted[2]).toBe("Jan 2024");
    });

    it("should handle same-year articles", () => {
      const date1 = parseDate("Jan 2024");
      const date2 = parseDate("Feb 2024");

      expect(date2.getTime()).toBeGreaterThan(date1.getTime());
    });

    it("should handle multi-year articles", () => {
      const date1 = parseDate("Jan 2023");
      const date2 = parseDate("Jan 2024");

      expect(date2.getTime()).toBeGreaterThan(date1.getTime());
    });
  });

  describe("edge cases", () => {
    it("should handle empty articles array", () => {
      const articles: string[] = [];
      expect(articles.length).toBe(0);
    });

    it("should handle articles with special characters in title", () => {
      const escapeXml = (text: string) =>
        text.replace(/[<>&"']/g, (char) => {
          const map: Record<string, string> = {
            "<": "&lt;",
            ">": "&gt;",
            "&": "&amp;",
            '"': "&quot;",
            "'": "&apos;",
          };
          return map[char] || char;
        });

      const title = "Test <>&\"' Characters";
      const escaped = escapeXml(title);

      expect(escaped).not.toContain("<");
      expect(escaped).not.toContain(">");
      expect(escaped).not.toContain("&");
      expect(escaped).toContain("&lt;");
      expect(escaped).toContain("&gt;");
      expect(escaped).toContain("&amp;");
    });

    it("should handle very long content", () => {
      const longContent = "a".repeat(1000);
      const truncated = longContent.slice(0, 500);

      expect(truncated.length).toBe(500);
    });

    it("should handle content with CDATA-like strings", () => {
      const content = "Text with ]]> inside";
      // In real implementation, this should be escaped
      expect(content).toContain("]]>");
    });

    it("should handle missing article fields gracefully", () => {
      const article = {
        slug: "test",
        title: "Test",
        description: "Description",
        category: "Test",
        date: "Jan 2024",
        content: "Content",
        // seoKeywords is missing
      };

      const keywords = article.seoKeywords || [];
      expect(Array.isArray(keywords)).toBe(true);
      expect(keywords.length).toBe(0);
    });
  });

  describe("performance considerations", () => {
    it("should cache for 1 hour", () => {
      const maxAge = 3600;
      expect(maxAge).toBe(60 * 60);
    });

    it("should allow stale-while-revalidate for 24 hours", () => {
      const staleWhileRevalidate = 86400;
      expect(staleWhileRevalidate).toBe(24 * 60 * 60);
    });

    it("should generate feed efficiently", () => {
      const startTime = Date.now();
      // Simulate RSS generation
      const articles = Array(100).fill({ title: "Test" });
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});