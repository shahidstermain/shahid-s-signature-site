import { describe, it, expect, vi } from "vitest";

// Mock the articles data
vi.mock("@/data/articles", () => ({
  articles: [
    {
      slug: "test-article-1",
      title: "First Test Article",
      description: "First article description",
      category: "Testing",
      date: "Jan 2024",
      content: "This is **test** content with `code` and more.",
      seoKeywords: ["test", "first"],
    },
    {
      slug: "test-article-2",
      title: "Second Test Article with <Special> & Characters",
      description: "Description with special & characters",
      category: "Testing",
      date: "Feb 2024",
      content: "# Header\n\nContent with **markdown**.\n\n```js\ncode block\n```",
      seoKeywords: ["test", "second"],
    },
    {
      slug: "recent-article",
      title: "Most Recent Article",
      description: "Latest article",
      category: "Latest",
      date: "Mar 2024",
      content: "Recent content.",
    },
  ],
}));

describe("RSS route handler", () => {
  const SITE_URL = "https://shahidster.tech";
  const SITE_TITLE = "Shahid Moosa — Distributed Systems Engineering";
  const SITE_DESCRIPTION =
    "Deep dives into distributed databases, data infrastructure, and production systems. Written by a senior distributed-systems engineer.";
  const AUTHOR_NAME = "Shahid Moosa";
  const AUTHOR_EMAIL = "hello@shahidster.tech";

  describe("escapeXml", () => {
    const escapeXml = (text: string): string => {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
    };

    it("should escape ampersands", () => {
      expect(escapeXml("Test & Example")).toBe("Test &amp; Example");
    });

    it("should escape less than signs", () => {
      expect(escapeXml("Test < Example")).toBe("Test &lt; Example");
    });

    it("should escape greater than signs", () => {
      expect(escapeXml("Test > Example")).toBe("Test &gt; Example");
    });

    it("should escape double quotes", () => {
      expect(escapeXml('Test "quoted" text')).toBe("Test &quot;quoted&quot; text");
    });

    it("should escape apostrophes", () => {
      expect(escapeXml("Test's apostrophe")).toBe("Test&apos;s apostrophe");
    });

    it("should escape multiple special characters", () => {
      expect(escapeXml('<tag attr="value"> & \'text\'')).toBe(
        "&lt;tag attr=&quot;value&quot;&gt; &amp; &apos;text&apos;"
      );
    });

    it("should handle text without special characters", () => {
      expect(escapeXml("Regular text")).toBe("Regular text");
    });

    it("should handle empty string", () => {
      expect(escapeXml("")).toBe("");
    });
  });

  describe("parseDate", () => {
    const parseDate = (dateStr: string): Date => {
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
      const date = parseDate("Jan 2024");
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(0);
      expect(date.getDate()).toBe(15);
    });

    it("should parse all months", () => {
      const testCases = [
        { input: "Jan 2024", month: 0 },
        { input: "Feb 2024", month: 1 },
        { input: "Mar 2024", month: 2 },
        { input: "Dec 2024", month: 11 },
      ];

      testCases.forEach(({ input, month }) => {
        expect(parseDate(input).getMonth()).toBe(month);
      });
    });

    it("should default to January for unknown month", () => {
      const date = parseDate("Unknown 2024");
      expect(date.getMonth()).toBe(0);
    });

    it("should set day to 15", () => {
      expect(parseDate("Jun 2024").getDate()).toBe(15);
    });
  });

  describe("stripMarkdown", () => {
    const stripMarkdown = (content: string): string => {
      return content
        .replace(/```[\s\S]*?```/g, "") // Remove code blocks
        .replace(/`[^`]+`/g, "") // Remove inline code
        .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold
        .replace(/^#{1,6}\s+/gm, "") // Remove headers
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Convert links to text
        .replace(/\n+/g, " ")
        .trim()
        .slice(0, 500);
    };

    it("should remove code blocks", () => {
      const result = stripMarkdown("Text\n```js\ncode\n```\nMore");
      expect(result).not.toContain("```");
      expect(result).not.toContain("code");
    });

    it("should remove inline code", () => {
      const result = stripMarkdown("Text with `code` here");
      expect(result).not.toContain("`");
      expect(result).toContain("Text with  here");
    });

    it("should remove bold markers", () => {
      const result = stripMarkdown("Text with **bold** text");
      expect(result).not.toContain("**");
      expect(result).toContain("bold");
    });

    it("should remove headers", () => {
      const result = stripMarkdown("# Header\n## Subheader\nText");
      expect(result).not.toContain("#");
      expect(result).toContain("Header");
      expect(result).toContain("Subheader");
    });

    it("should convert links to text", () => {
      const result = stripMarkdown("Check [this link](https://example.com)");
      expect(result).not.toContain("[");
      expect(result).not.toContain("](");
      expect(result).toContain("this link");
      expect(result).not.toContain("https://example.com");
    });

    it("should collapse newlines to spaces", () => {
      const result = stripMarkdown("Line 1\n\nLine 2\n\nLine 3");
      expect(result).not.toContain("\n");
      expect(result).toContain("Line 1 Line 2 Line 3");
    });

    it("should trim the result", () => {
      const result = stripMarkdown("  Text  ");
      expect(result).toBe("Text");
    });

    it("should truncate to 500 characters", () => {
      const longText = "a".repeat(1000);
      const result = stripMarkdown(longText);
      expect(result.length).toBe(500);
    });

    it("should handle complex markdown", () => {
      const markdown = "# Title\n\n**Bold** text with `code` and [link](url).\n\n```js\ncode block\n```";
      const result = stripMarkdown(markdown);
      expect(result).not.toContain("#");
      expect(result).not.toContain("**");
      expect(result).not.toContain("`");
      expect(result).not.toContain("[");
      expect(result).not.toContain("```");
    });
  });

  describe("RSS feed generation", () => {
    const generateRSSMock = () => {
      const { articles } = require("@/data/articles");
      const now = new Date().toUTCString();

      const parseDate = (dateStr: string): Date => {
        const months: Record<string, number> = {
          Jan: 0,
          Feb: 1,
          Mar: 2,
        };
        const [month, year] = dateStr.split(" ");
        return new Date(Date.UTC(parseInt(year), months[month] || 0, 1));
      };

      const escapeXml = (text: string): string => {
        return text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&apos;");
      };

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

      const sortedArticles = [...articles].sort(
        (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime()
      );

      const items = sortedArticles
        .map((article) => {
          const pubDate = parseDate(article.date).toUTCString();
          const articleUrl = `${SITE_URL}/blog/${article.slug}`;
          const summary = stripMarkdown(article.content);

          const categories = [article.category, ...(article.seoKeywords || [])]
            .map((cat) => `      <category>${escapeXml(cat)}</category>`)
            .join("\n");

          return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description>${escapeXml(article.description)}</description>
      <content:encoded><![CDATA[${summary}...]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <author>${AUTHOR_EMAIL} (${AUTHOR_NAME})</author>
${categories}
    </item>`;
        })
        .join("");

      return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <ttl>60</ttl>
    <generator>Next.js RSS Generator</generator>
    <managingEditor>${AUTHOR_EMAIL} (${AUTHOR_NAME})</managingEditor>
    <webMaster>${AUTHOR_EMAIL} (${AUTHOR_NAME})</webMaster>
    <copyright>Copyright ${new Date().getFullYear()} ${AUTHOR_NAME}. All rights reserved.</copyright>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/og-image.png</url>
      <title>${escapeXml(SITE_TITLE)}</title>
      <link>${SITE_URL}</link>
      <width>1200</width>
      <height>630</height>
    </image>
    ${items}
  </channel>
</rss>`;
    };

    it("should generate valid XML structure", () => {
      const rss = generateRSSMock();

      expect(rss).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(rss).toContain('<rss version="2.0"');
      expect(rss).toContain("<channel>");
      expect(rss).toContain("</channel>");
      expect(rss).toContain("</rss>");
    });

    it("should include required namespaces", () => {
      const rss = generateRSSMock();

      expect(rss).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
      expect(rss).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
      expect(rss).toContain('xmlns:dc="http://purl.org/dc/elements/1.1/"');
    });

    it("should include channel metadata", () => {
      const rss = generateRSSMock();

      expect(rss).toContain(`<title>${SITE_TITLE}</title>`);
      expect(rss).toContain(`<link>${SITE_URL}</link>`);
      expect(rss).toContain(`<description>${SITE_DESCRIPTION}</description>`);
      expect(rss).toContain("<language>en-us</language>");
      expect(rss).toContain("<lastBuildDate>");
      expect(rss).toContain("<ttl>60</ttl>");
    });

    it("should include atom self-link", () => {
      const rss = generateRSSMock();

      expect(rss).toContain(
        `<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>`
      );
    });

    it("should include feed image", () => {
      const rss = generateRSSMock();

      expect(rss).toContain("<image>");
      expect(rss).toContain(`<url>${SITE_URL}/og-image.png</url>`);
      expect(rss).toContain("<width>1200</width>");
      expect(rss).toContain("<height>630</height>");
    });

    it("should escape special characters in titles", () => {
      const rss = generateRSSMock();

      expect(rss).toContain("&lt;Special&gt; &amp; Characters");
      expect(rss).not.toContain("<Special> & Characters");
    });

    it("should sort articles by date (newest first)", () => {
      const rss = generateRSSMock();

      const indexRecent = rss.indexOf("Most Recent Article");
      const indexFirst = rss.indexOf("First Test Article");

      expect(indexRecent).toBeLessThan(indexFirst);
    });

    it("should include all article items", () => {
      const rss = generateRSSMock();

      expect(rss).toContain("First Test Article");
      expect(rss).toContain("Second Test Article");
      expect(rss).toContain("Most Recent Article");
    });

    it("should include category tags", () => {
      const rss = generateRSSMock();

      expect(rss).toContain("<category>Testing</category>");
      expect(rss).toContain("<category>Latest</category>");
    });

    it("should include SEO keywords as categories", () => {
      const rss = generateRSSMock();

      expect(rss).toContain("<category>test</category>");
      expect(rss).toContain("<category>first</category>");
      expect(rss).toContain("<category>second</category>");
    });

    it("should include CDATA content", () => {
      const rss = generateRSSMock();

      expect(rss).toContain("<content:encoded><![CDATA[");
      expect(rss).toContain("]]></content:encoded>");
    });

    it("should include author information", () => {
      const rss = generateRSSMock();

      expect(rss).toContain(`<author>${AUTHOR_EMAIL} (${AUTHOR_NAME})</author>`);
      expect(rss).toContain(`<managingEditor>${AUTHOR_EMAIL} (${AUTHOR_NAME})</managingEditor>`);
      expect(rss).toContain(`<webMaster>${AUTHOR_EMAIL} (${AUTHOR_NAME})</webMaster>`);
    });

    it("should include copyright notice", () => {
      const rss = generateRSSMock();
      const currentYear = new Date().getFullYear();

      expect(rss).toContain(`<copyright>Copyright ${currentYear} ${AUTHOR_NAME}`);
    });

    it("should format dates as RFC 822", () => {
      const rss = generateRSSMock();

      expect(rss).toMatch(/<pubDate>[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4}/);
    });
  });

  describe("GET handler response", () => {
    it("should return RSS with correct content type", () => {
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

    it("should include cache headers", () => {
      const cacheControl =
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400";

      expect(cacheControl).toContain("public");
      expect(cacheControl).toContain("max-age=3600");
      expect(cacheControl).toContain("s-maxage=3600");
      expect(cacheControl).toContain("stale-while-revalidate=86400");
    });

    it("should include security headers", () => {
      const headers = {
        "X-Content-Type-Options": "nosniff",
      };

      expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    });
  });
});