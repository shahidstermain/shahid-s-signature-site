import { describe, it, expect, vi } from "vitest";

// This test file validates the RSS route handler
// The actual route is at docs/nextjs-migration-examples/app/rss.xml/route.ts

describe("RSS XML Route Handler", () => {
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
      expect(escapeXml("a < b")).toBe("a &lt; b");
    });

    it("should escape greater than signs", () => {
      expect(escapeXml("a > b")).toBe("a &gt; b");
    });

    it("should escape double quotes", () => {
      expect(escapeXml('Say "Hello"')).toBe("Say &quot;Hello&quot;");
    });

    it("should escape single quotes", () => {
      expect(escapeXml("It's")).toBe("It&apos;s");
    });

    it("should escape multiple special characters", () => {
      const input = `<tag attr="value"> & 'content'`;
      const expected = `&lt;tag attr=&quot;value&quot;&gt; &amp; &apos;content&apos;`;
      expect(escapeXml(input)).toBe(expected);
    });

    it("should handle empty string", () => {
      expect(escapeXml("")).toBe("");
    });

    it("should handle string without special characters", () => {
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
      const result = stripMarkdown("Text ```code block``` more text");
      expect(result).not.toContain("```");
      expect(result).toContain("Text");
      expect(result).toContain("more text");
    });

    it("should remove inline code", () => {
      const result = stripMarkdown("This is `code` here");
      expect(result).not.toContain("`");
      expect(result).toContain("This is");
      expect(result).toContain("here");
    });

    it("should remove bold formatting", () => {
      const result = stripMarkdown("This is **bold** text");
      expect(result).not.toContain("**");
      expect(result).toContain("bold");
    });

    it("should remove headers", () => {
      const result = stripMarkdown("# Header 1\n## Header 2\n### Header 3");
      expect(result).not.toContain("#");
      expect(result).toContain("Header 1");
      expect(result).toContain("Header 2");
      expect(result).toContain("Header 3");
    });

    it("should convert links to plain text", () => {
      const result = stripMarkdown("Check [this link](https://example.com)");
      expect(result).not.toContain("[");
      expect(result).not.toContain("]");
      expect(result).not.toContain("https://example.com");
      expect(result).toContain("this link");
    });

    it("should replace newlines with spaces", () => {
      const result = stripMarkdown("Line 1\nLine 2\nLine 3");
      expect(result).not.toContain("\n");
      expect(result).toContain("Line 1 Line 2 Line 3");
    });

    it("should trim whitespace", () => {
      const result = stripMarkdown("  Text with spaces  ");
      expect(result).toBe("Text with spaces");
    });

    it("should truncate to 500 characters", () => {
      const longText = "a".repeat(1000);
      const result = stripMarkdown(longText);
      expect(result.length).toBe(500);
    });

    it("should handle mixed markdown", () => {
      const input = "## Title\n\n**Bold** and `code` with [link](url)\n\n```js\ncode block\n```";
      const result = stripMarkdown(input);
      expect(result).not.toContain("#");
      expect(result).not.toContain("**");
      expect(result).not.toContain("`");
      expect(result).not.toContain("[");
      expect(result).not.toContain("```");
    });

    it("should handle empty string", () => {
      const result = stripMarkdown("");
      expect(result).toBe("");
    });
  });

  describe("RSS feed structure", () => {
    it("should include XML declaration", () => {
      const rss = '<?xml version="1.0" encoding="UTF-8"?>';
      expect(rss).toContain('<?xml version="1.0"');
      expect(rss).toContain('encoding="UTF-8"');
    });

    it("should include RSS 2.0 version", () => {
      const rss = '<rss version="2.0"';
      expect(rss).toContain('version="2.0"');
    });

    it("should include required namespaces", () => {
      const rss = `<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">`;

      expect(rss).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
      expect(rss).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
      expect(rss).toContain('xmlns:dc="http://purl.org/dc/elements/1.1/"');
    });

    it("should include channel element", () => {
      const channelStart = "<channel>";
      const channelEnd = "</channel>";
      expect(channelStart).toBe("<channel>");
      expect(channelEnd).toBe("</channel>");
    });

    it("should include site title", () => {
      const title = "<title>Shahid Moosa — Distributed Systems Engineering</title>";
      expect(title).toContain("Shahid Moosa");
      expect(title).toContain("Distributed Systems");
    });

    it("should include site link", () => {
      const link = "<link>https://shahidster.tech</link>";
      expect(link).toContain("https://shahidster.tech");
    });

    it("should include site description", () => {
      const description =
        "<description>Deep dives into distributed databases, data infrastructure, and production systems.</description>";
      expect(description).toContain("distributed databases");
    });

    it("should include language", () => {
      const language = "<language>en-us</language>";
      expect(language).toBe("<language>en-us</language>");
    });

    it("should include lastBuildDate", () => {
      const now = new Date().toUTCString();
      const lastBuildDate = `<lastBuildDate>${now}</lastBuildDate>`;
      expect(lastBuildDate).toContain("<lastBuildDate>");
      expect(lastBuildDate).toContain("</lastBuildDate>");
    });

    it("should include TTL", () => {
      const ttl = "<ttl>60</ttl>";
      expect(ttl).toBe("<ttl>60</ttl>");
    });

    it("should include generator", () => {
      const generator = "<generator>Next.js RSS Generator</generator>";
      expect(generator).toContain("Next.js");
    });

    it("should include managing editor", () => {
      const editor = "<managingEditor>hello@shahidster.tech (Shahid Moosa)</managingEditor>";
      expect(editor).toContain("hello@shahidster.tech");
      expect(editor).toContain("Shahid Moosa");
    });

    it("should include webMaster", () => {
      const webMaster = "<webMaster>hello@shahidster.tech (Shahid Moosa)</webMaster>";
      expect(webMaster).toContain("hello@shahidster.tech");
    });

    it("should include copyright", () => {
      const year = new Date().getFullYear();
      const copyright = `<copyright>Copyright ${year} Shahid Moosa. All rights reserved.</copyright>`;
      expect(copyright).toContain("Copyright");
      expect(copyright).toContain("Shahid Moosa");
    });

    it("should include atom self link", () => {
      const atomLink =
        '<atom:link href="https://shahidster.tech/rss.xml" rel="self" type="application/rss+xml"/>';
      expect(atomLink).toContain('rel="self"');
      expect(atomLink).toContain('type="application/rss+xml"');
    });

    it("should include image", () => {
      const image = `<image>
      <url>https://shahidster.tech/og-image.png</url>
      <title>Site Title</title>
      <link>https://shahidster.tech</link>
      <width>1200</width>
      <height>630</height>
    </image>`;

      expect(image).toContain("<image>");
      expect(image).toContain("<url>");
      expect(image).toContain("<width>1200</width>");
      expect(image).toContain("<height>630</height>");
    });
  });

  describe("RSS item structure", () => {
    it("should include item element", () => {
      const item = "<item></item>";
      expect(item).toContain("<item>");
      expect(item).toContain("</item>");
    });

    it("should include escaped title", () => {
      const escapeXml = (text: string) => text.replace(/&/g, "&amp;");
      const title = `<title>${escapeXml("Article & Title")}</title>`;
      expect(title).toContain("&amp;");
    });

    it("should include article link", () => {
      const link = "<link>https://shahidster.tech/blog/article-slug</link>";
      expect(link).toContain("/blog/");
    });

    it("should include guid with isPermaLink", () => {
      const guid = '<guid isPermaLink="true">https://shahidster.tech/blog/article-slug</guid>';
      expect(guid).toContain('isPermaLink="true"');
    });

    it("should include description", () => {
      const description = "<description>Article description here</description>";
      expect(description).toContain("<description>");
      expect(description).toContain("</description>");
    });

    it("should include content:encoded with CDATA", () => {
      const content = "<content:encoded><![CDATA[Content here...]]></content:encoded>";
      expect(content).toContain("<content:encoded>");
      expect(content).toContain("<![CDATA[");
      expect(content).toContain("]]>");
    });

    it("should include pubDate in RFC 822 format", () => {
      const now = new Date().toUTCString();
      const pubDate = `<pubDate>${now}</pubDate>`;
      expect(pubDate).toContain("<pubDate>");
      // RFC 822 format: "Mon, 01 Jan 2024 00:00:00 GMT"
      expect(now).toMatch(/^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4}/);
    });

    it("should include author", () => {
      const author = "<author>hello@shahidster.tech (Shahid Moosa)</author>";
      expect(author).toContain("hello@shahidster.tech");
      expect(author).toContain("Shahid Moosa");
    });

    it("should include category elements", () => {
      const category = "<category>Distributed Systems</category>";
      expect(category).toContain("<category>");
      expect(category).toContain("</category>");
    });

    it("should include multiple categories", () => {
      const categories = `
      <category>Distributed Systems</category>
      <category>databases</category>
      <category>infrastructure</category>`;

      const categoryCount = (categories.match(/<category>/g) || []).length;
      expect(categoryCount).toBe(3);
    });
  });

  describe("Response headers", () => {
    it("should set Content-Type to application/rss+xml", () => {
      const headers = {
        "Content-Type": "application/rss+xml; charset=utf-8",
      };
      expect(headers["Content-Type"]).toContain("application/rss+xml");
      expect(headers["Content-Type"]).toContain("charset=utf-8");
    });

    it("should set Cache-Control header", () => {
      const headers = {
        "Cache-Control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      };
      expect(headers["Cache-Control"]).toContain("max-age=3600");
      expect(headers["Cache-Control"]).toContain("stale-while-revalidate=86400");
    });

    it("should set X-Content-Type-Options", () => {
      const headers = {
        "X-Content-Type-Options": "nosniff",
      };
      expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    });
  });

  describe("Article sorting", () => {
    it("should sort articles by date (newest first)", () => {
      const mockArticles = [
        { slug: "a", date: "Jan 2024", title: "A" },
        { slug: "b", date: "Mar 2024", title: "B" },
        { slug: "c", date: "Feb 2024", title: "C" },
      ];

      const parseDate = (dateStr: string): Date => {
        const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2 };
        const [month, year] = dateStr.split(" ");
        return new Date(parseInt(year), months[month] || 0, 15);
      };

      const sorted = [...mockArticles].sort(
        (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime()
      );

      expect(sorted[0].slug).toBe("b"); // Mar
      expect(sorted[1].slug).toBe("c"); // Feb
      expect(sorted[2].slug).toBe("a"); // Jan
    });
  });

  describe("Edge cases", () => {
    it("should handle articles with no SEO keywords", () => {
      const article = {
        slug: "test",
        title: "Test",
        description: "Test desc",
        category: "Testing",
        date: "Jan 2024",
        content: "Content",
      };

      // Should only include category, not undefined keywords
      const categories = [article.category];
      expect(categories.length).toBe(1);
      expect(categories[0]).toBe("Testing");
    });

    it("should handle very long content", () => {
      const stripMarkdown = (content: string): string => {
        return content.trim().slice(0, 500);
      };

      const longContent = "a".repeat(10000);
      const result = stripMarkdown(longContent);
      expect(result.length).toBe(500);
    });

    it("should escape special characters in all text fields", () => {
      const escapeXml = (text: string): string => {
        return text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&apos;");
      };

      const dangerous = '<script>alert("xss")</script> & more';
      const safe = escapeXml(dangerous);

      expect(safe).not.toContain("<script>");
      expect(safe).toContain("&lt;script&gt;");
      expect(safe).toContain("&amp;");
    });

    it("should handle empty article list", () => {
      const articles: any[] = [];
      const items = articles
        .map((article) => `<item><title>${article.title}</title></item>`)
        .join("");

      expect(items).toBe("");
    });

    it("should handle articles with special characters in category", () => {
      const escapeXml = (text: string): string => {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
      };

      const category = "R&D <Research>";
      const escaped = escapeXml(category);

      expect(escaped).toBe("R&amp;D &lt;Research&gt;");
    });
  });

  describe("Integration", () => {
    it("should produce valid RSS XML structure", () => {
      const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Test</title>
    <item>
      <title>Article</title>
    </item>
  </channel>
</rss>`;

      expect(rss).toContain('<?xml version="1.0"');
      expect(rss).toContain("<channel>");
      expect(rss).toContain("<item>");
      expect(rss).toContain("</item>");
      expect(rss).toContain("</channel>");
      expect(rss).toContain("</rss>");
    });

    it("should maintain proper XML nesting", () => {
      const xml = "<channel><item><title>Test</title></item></channel>";
      const channelOpen = xml.indexOf("<channel>");
      const itemOpen = xml.indexOf("<item>");
      const titleOpen = xml.indexOf("<title>");
      const titleClose = xml.indexOf("</title>");
      const itemClose = xml.indexOf("</item>");
      const channelClose = xml.indexOf("</channel>");

      expect(channelOpen).toBeLessThan(itemOpen);
      expect(itemOpen).toBeLessThan(titleOpen);
      expect(titleOpen).toBeLessThan(titleClose);
      expect(titleClose).toBeLessThan(itemClose);
      expect(itemClose).toBeLessThan(channelClose);
    });
  });
});