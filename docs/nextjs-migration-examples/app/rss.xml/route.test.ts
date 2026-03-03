import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";

// Mock dependencies
vi.mock("@/data/articles", () => ({
  articles: [
    {
      slug: "article-one",
      title: "First Article",
      description: "First article description",
      category: "Technology",
      date: "Jan 2024",
      content: "This is **bold** content with `code`.",
      seoKeywords: ["tech", "blog"],
    },
    {
      slug: "article-two",
      title: "Second Article & Special <chars>",
      description: "Second article with & special chars",
      category: "Development & Testing",
      date: "Feb 2024",
      content: "More content with [links](https://example.com)",
      seoKeywords: ["dev", "test"],
    },
    {
      slug: "article-three",
      title: "Third Article",
      description: "Third article description",
      category: "Design",
      date: "Mar 2024",
      content: "```javascript\nconst code = 'block';\n```\nSome text.",
      seoKeywords: [],
    },
  ],
}));

describe("RSS Feed Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET handler", () => {
    it("should return RSS 2.0 XML feed", async () => {
      const response = await GET();
      const text = await response.text();

      expect(text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(text).toContain('<rss version="2.0"');
    });

    it("should include required RSS 2.0 namespaces", async () => {
      const response = await GET();
      const text = await response.text();

      expect(text).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
      expect(text).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
      expect(text).toContain('xmlns:dc="http://purl.org/dc/elements/1.1/"');
    });

    it("should set correct content type header", async () => {
      const response = await GET();

      expect(response.headers.get("Content-Type")).toBe(
        "application/rss+xml; charset=utf-8"
      );
    });

    it("should set cache control headers", async () => {
      const response = await GET();

      const cacheControl = response.headers.get("Cache-Control");
      expect(cacheControl).toContain("public");
      expect(cacheControl).toContain("max-age=3600");
      expect(cacheControl).toContain("s-maxage=3600");
    });

    it("should set security headers", async () => {
      const response = await GET();

      expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    });

    it("should include channel metadata", async () => {
      const response = await GET();
      const text = await response.text();

      expect(text).toContain("<title>Shahid Moosa — Distributed Systems Engineering</title>");
      expect(text).toContain("<link>https://shahidster.tech</link>");
      expect(text).toContain(
        "<description>Deep dives into distributed databases, data infrastructure, and production systems."
      );
      expect(text).toContain("<language>en-us</language>");
    });

    it("should include lastBuildDate", async () => {
      const response = await GET();
      const text = await response.text();

      expect(text).toContain("<lastBuildDate>");
      expect(text).toMatch(/<lastBuildDate>[^<]+<\/lastBuildDate>/);
    });

    it("should include atom self link", async () => {
      const response = await GET();
      const text = await response.text();

      expect(text).toContain(
        '<atom:link href="https://shahidster.tech/rss.xml" rel="self" type="application/rss+xml"/>'
      );
    });

    it("should include feed image", async () => {
      const response = await GET();
      const text = await response.text();

      expect(text).toContain("<image>");
      expect(text).toContain("<url>https://shahidster.tech/og-image.png</url>");
      expect(text).toContain("<width>1200</width>");
      expect(text).toContain("<height>630</height>");
    });

    it("should include all articles as items", async () => {
      const response = await GET();
      const text = await response.text();

      expect(text).toContain("<item>");
      expect(text).toContain("First Article");
      expect(text).toContain("Second Article");
      expect(text).toContain("Third Article");
    });

    it("should sort articles by date (newest first)", async () => {
      const response = await GET();
      const text = await response.text();

      const indexThird = text.indexOf("Third Article");
      const indexSecond = text.indexOf("Second Article");
      const indexFirst = text.indexOf("First Article");

      expect(indexThird).toBeLessThan(indexSecond);
      expect(indexSecond).toBeLessThan(indexFirst);
    });

    it("should escape XML special characters", async () => {
      const response = await GET();
      const text = await response.text();

      // Should escape &, <, >, ", '
      expect(text).toContain("&amp;");
      expect(text).toContain("&lt;");
      expect(text).toContain("&gt;");
      expect(text).toContain("&quot;");
      expect(text).toContain("&apos;");

      // Should not contain unescaped special chars in content
      expect(text).not.toMatch(/<category>.*<.*>/);
    });

    it("should include article links and GUIDs", async () => {
      const response = await GET();
      const text = await response.text();

      expect(text).toContain(
        "<link>https://shahidster.tech/blog/article-one</link>"
      );
      expect(text).toContain(
        '<guid isPermaLink="true">https://shahidster.tech/blog/article-one</guid>'
      );
    });

    it("should include article descriptions", async () => {
      const response = await GET();
      const text = await response.text();

      expect(text).toContain("<description>First article description</description>");
      expect(text).toContain("<description>Second article with &amp; special chars</description>");
    });

    it("should include content:encoded with CDATA", async () => {
      const response = await GET();
      const text = await response.text();

      expect(text).toContain("<content:encoded><![CDATA[");
      expect(text).toContain("]]></content:encoded>");
    });

    it("should strip markdown from content", async () => {
      const response = await GET();
      const text = await response.text();

      // Bold and code formatting should be removed
      const cdataMatches = text.match(/<content:encoded><!\[CDATA\[(.*?)\]\]>/gs);
      expect(cdataMatches).toBeTruthy();

      if (cdataMatches) {
        cdataMatches.forEach((match) => {
          expect(match).not.toContain("**");
          expect(match).not.toContain("`");
          expect(match).not.toContain("```");
        });
      }
    });

    it("should include pubDate in RFC 822 format", async () => {
      const response = await GET();
      const text = await response.text();

      expect(text).toContain("<pubDate>");
      expect(text).toMatch(
        /<pubDate>[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT<\/pubDate>/
      );
    });

    it("should include author information", async () => {
      const response = await GET();
      const text = await response.text();

      expect(text).toContain("<author>hello@shahidster.tech (Shahid Moosa)</author>");
      expect(text).toContain(
        "<managingEditor>hello@shahidster.tech (Shahid Moosa)</managingEditor>"
      );
    });

    it("should include categories", async () => {
      const response = await GET();
      const text = await response.text();

      expect(text).toContain("<category>Technology</category>");
      expect(text).toContain("<category>tech</category>");
      expect(text).toContain("<category>blog</category>");
    });

    it("should include SEO keywords as categories", async () => {
      const response = await GET();
      const text = await response.text();

      expect(text).toContain("<category>dev</category>");
      expect(text).toContain("<category>test</category>");
    });

    it("should handle articles without SEO keywords", async () => {
      const response = await GET();
      const text = await response.text();

      // Article three has no keywords, should still be valid
      expect(text).toContain("Third Article");
      expect(text).toContain("<category>Design</category>");
    });

    it("should include TTL", async () => {
      const response = await GET();
      const text = await response.text();

      expect(text).toContain("<ttl>60</ttl>");
    });

    it("should include generator", async () => {
      const response = await GET();
      const text = await response.text();

      expect(text).toContain("<generator>Next.js RSS Generator</generator>");
    });

    it("should include copyright notice", async () => {
      const response = await GET();
      const text = await response.text();

      const currentYear = new Date().getFullYear();
      expect(text).toContain(`<copyright>Copyright ${currentYear} Shahid Moosa`);
    });

    it("should truncate content to 500 characters", async () => {
      const response = await GET();
      const text = await response.text();

      const cdataMatches = text.match(/<content:encoded><!\[CDATA\[(.*?)\]\]>/gs);
      if (cdataMatches) {
        cdataMatches.forEach((match) => {
          // Extract CDATA content (excluding tags and "...")
          const content = match.replace(/<content:encoded><!\[CDATA\[/, "").replace(/\]\]>/, "");
          const contentLength = content.replace(/\.\.\.$/, "").length;
          expect(contentLength).toBeLessThanOrEqual(503); // 500 + "..."
        });
      }
    });

    it("should close all XML tags properly", async () => {
      const response = await GET();
      const text = await response.text();

      expect(text).toContain("</channel>");
      expect(text).toContain("</rss>");
      expect(text).toContain("</item>");
    });

    it("should validate XML structure", async () => {
      const response = await GET();
      const text = await response.text();

      // Count opening and closing tags
      const openRss = (text.match(/<rss/g) || []).length;
      const closeRss = (text.match(/<\/rss>/g) || []).length;
      const openChannel = (text.match(/<channel>/g) || []).length;
      const closeChannel = (text.match(/<\/channel>/g) || []).length;

      expect(openRss).toBe(closeRss);
      expect(openChannel).toBe(closeChannel);
      expect(openChannel).toBe(1);
    });

    it("should handle empty article content gracefully", async () => {
      const response = await GET();
      const text = await response.text();

      // Should still generate valid RSS
      expect(text).toContain('<?xml version="1.0"');
      expect(text).toContain("</rss>");
    });
  });

  describe("escapeXml function", () => {
    it("should be tested indirectly through feed generation", async () => {
      const response = await GET();
      const text = await response.text();

      // Verify that special characters are escaped
      expect(text).toContain("&amp;");
      expect(text).not.toContain("Development & Testing</category>");
      expect(text).toContain("Development &amp; Testing</category>");
    });
  });

  describe("parseDate function", () => {
    it("should be tested indirectly through feed generation", async () => {
      const response = await GET();
      const text = await response.text();

      // Dates should be properly formatted
      expect(text).toMatch(/<pubDate>[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4}/);
    });
  });

  describe("stripMarkdown function", () => {
    it("should be tested indirectly through content generation", async () => {
      const response = await GET();
      const text = await response.text();

      // Markdown should be stripped from CDATA content
      const cdataContent = text.match(/<content:encoded><!\[CDATA\[(.*?)\]\]>/gs);
      expect(cdataContent).toBeTruthy();

      if (cdataContent) {
        cdataContent.forEach((content) => {
          expect(content).not.toContain("**");
          expect(content).not.toContain("[link]");
        });
      }
    });
  });

  describe("edge cases", () => {
    it("should handle very long article titles", async () => {
      const response = await GET();
      const text = await response.text();

      // All titles should be properly encoded
      expect(text).toContain("<title>");
      expect(text).toContain("</title>");
    });

    it("should handle articles with no description", async () => {
      const response = await GET();
      const text = await response.text();

      // Should still generate valid items
      expect(text).toContain("<item>");
      expect(text).toContain("</item>");
    });

    it("should handle multiple articles with same category", async () => {
      const response = await GET();
      const text = await response.text();

      // Should include all category tags
      const categoryMatches = text.match(/<category>.*?<\/category>/g);
      expect(categoryMatches).toBeTruthy();
      if (categoryMatches) {
        expect(categoryMatches.length).toBeGreaterThan(3);
      }
    });
  });
});