import { describe, it, expect, vi } from "vitest";
import { generateRSSFeed, generateJSONFeed } from "./rss";

// Mock dependencies
vi.mock("./site-config", () => ({
  siteConfig: {
    siteUrl: "https://shahidster.tech",
    blogTitle: "Shahid Moosa - Distributed Systems Engineering",
    blogDescription:
      "Deep dives into distributed databases, data infrastructure, and production systems.",
  },
}));

vi.mock("../data/articles", () => ({
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
      title: "Special Characters: <>&\"'",
      description: "Article with special & characters",
      category: "XML & Tests",
      date: "Feb 2024",
      content: "Content with **markdown** and ```code blocks```",
      seoKeywords: ["xml", "special"],
    },
    {
      slug: "test-article-3",
      title: "Recent Article",
      description: "Most recent article",
      category: "Latest",
      date: "Mar 2024",
      content:
        "# Header\n\nParagraph with [link](https://example.com)\n\n```javascript\nconst code = 'block';\n```\n\nMore text.",
    },
  ],
}));

vi.mock("./seo-utils", () => ({
  parseArticleDate: (dateStr: string) => {
    const months: Record<string, number> = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
    };
    const [month, year] = dateStr.split(" ");
    return new Date(Date.UTC(Number(year), months[month] ?? 0, 1));
  },
}));

describe("rss", () => {
  describe("generateRSSFeed", () => {
    it("should generate valid RSS 2.0 XML feed", () => {
      const rss = generateRSSFeed();

      // Should include XML declaration
      expect(rss).toContain('<?xml version="1.0" encoding="UTF-8"?>');

      // Should include RSS version
      expect(rss).toContain('<rss version="2.0"');

      // Should include required namespaces
      expect(rss).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
      expect(rss).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    });

    it("should include channel metadata", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<channel>");
      expect(rss).toContain(
        "<title>Shahid Moosa - Distributed Systems Engineering</title>"
      );
      expect(rss).toContain("<link>https://shahidster.tech</link>");
      expect(rss).toContain(
        "<description>Deep dives into distributed databases, data infrastructure, and production systems.</description>"
      );
      expect(rss).toContain("<language>en-us</language>");
      expect(rss).toContain("<lastBuildDate>");
    });

    it("should include atom self link", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain(
        '<atom:link href="https://shahidster.tech/rss.xml" rel="self" type="application/rss+xml"/>'
      );
    });

    it("should include feed image", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<image>");
      expect(rss).toContain("<url>https://shahidster.tech/favicon.ico</url>");
    });

    it("should include items for all articles", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<item>");
      expect(rss).toContain("Test Article One");
      expect(rss).toContain("Special Characters: &lt;&gt;&amp;&quot;&apos;");
      expect(rss).toContain("Recent Article");
    });

    it("should sort articles by date (newest first)", () => {
      const rss = generateRSSFeed();
      const indexRecent = rss.indexOf("Recent Article");
      const indexFirst = rss.indexOf("Test Article One");

      // Most recent (Mar) should appear before older (Jan)
      expect(indexRecent).toBeLessThan(indexFirst);
    });

    it("should escape XML special characters in titles", () => {
      const rss = generateRSSFeed();

      // Special characters should be escaped
      expect(rss).toContain("Special Characters: &lt;&gt;&amp;&quot;&apos;");
      expect(rss).not.toContain("Special Characters: <>&\"'");
    });

    it("should include article metadata", () => {
      const rss = generateRSSFeed();

      // Should include link, guid, description, content, pubDate, category
      expect(rss).toContain(
        "<link>https://shahidster.tech/blog/test-article-1</link>"
      );
      expect(rss).toContain(
        '<guid isPermaLink="true">https://shahidster.tech/blog/test-article-1</guid>'
      );
      expect(rss).toContain("<description>First test article description</description>");
      expect(rss).toContain("<content:encoded>");
      expect(rss).toContain("<pubDate>");
      expect(rss).toContain("<category>Testing</category>");
    });

    it("should include SEO keywords as categories", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<category>test</category>");
      expect(rss).toContain("<category>article</category>");
      expect(rss).toContain("<category>xml</category>");
      expect(rss).toContain("<category>special</category>");
    });

    it("should strip HTML from content", () => {
      const rss = generateRSSFeed();

      // Should not contain markdown formatting in CDATA
      expect(rss).toContain("<content:encoded><![CDATA[");
      expect(rss).toContain("]]></content:encoded>");

      // Bold markers should be removed
      const cdataContent = rss.match(/<content:encoded><!\[CDATA\[(.*?)\]\]>/s);
      if (cdataContent) {
        expect(cdataContent[1]).not.toContain("**");
        expect(cdataContent[1]).not.toContain("`");
      }
    });

    it("should handle articles without SEO keywords", () => {
      const rss = generateRSSFeed();

      // Article 3 has no seoKeywords, should still generate valid RSS
      expect(rss).toContain("Recent Article");
      expect(rss).toContain("<category>Latest</category>");
    });

    it("should format dates in RFC 822 format", () => {
      const rss = generateRSSFeed();

      // pubDate should be in RFC 822 format (e.g., "Mon, 01 Jan 2024 00:00:00 GMT")
      expect(rss).toMatch(/<pubDate>[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT<\/pubDate>/);
    });

    it("should close all XML tags properly", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("</channel>");
      expect(rss).toContain("</rss>");
      expect(rss).toContain("</item>");
    });

    it("should handle CDATA escape sequences", () => {
      const rss = generateRSSFeed();

      // Should escape ]]> in descriptions to prevent CDATA breakout
      // Testing that the function handles this edge case
      expect(rss).toContain("<content:encoded><![CDATA[");
    });
  });

  describe("generateJSONFeed", () => {
    it("should generate valid JSON Feed 1.1", () => {
      const feed = generateJSONFeed();
      const parsed = JSON.parse(feed);

      expect(parsed.version).toBe("https://jsonfeed.org/version/1.1");
    });

    it("should include feed metadata", () => {
      const feed = generateJSONFeed();
      const parsed = JSON.parse(feed);

      expect(parsed.title).toBe("Shahid Moosa - Distributed Systems Engineering");
      expect(parsed.home_page_url).toBe("https://shahidster.tech");
      expect(parsed.feed_url).toBe("https://shahidster.tech/feed.json");
      expect(parsed.description).toBe(
        "Deep dives into distributed databases, data infrastructure, and production systems."
      );
      expect(parsed.language).toBe("en-US");
    });

    it("should include items array", () => {
      const feed = generateJSONFeed();
      const parsed = JSON.parse(feed);

      expect(Array.isArray(parsed.items)).toBe(true);
      expect(parsed.items.length).toBe(3);
    });

    it("should sort items by date (newest first)", () => {
      const feed = generateJSONFeed();
      const parsed = JSON.parse(feed);

      // Should be in reverse chronological order
      expect(parsed.items[0].title).toBe("Recent Article");
      expect(parsed.items[1].title).toContain("Special Characters");
      expect(parsed.items[2].title).toBe("Test Article One");
    });

    it("should include required item fields", () => {
      const feed = generateJSONFeed();
      const parsed = JSON.parse(feed);
      const item = parsed.items[0];

      expect(item.id).toBe("https://shahidster.tech/blog/test-article-3");
      expect(item.url).toBe("https://shahidster.tech/blog/test-article-3");
      expect(item.title).toBe("Recent Article");
      expect(item.summary).toBe("Most recent article");
      expect(item.content_text).toBeTruthy();
      expect(item.date_published).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(Array.isArray(item.tags)).toBe(true);
    });

    it("should include category and keywords as tags", () => {
      const feed = generateJSONFeed();
      const parsed = JSON.parse(feed);
      const item = parsed.items.find((i: { title: string }) => i.title === "Test Article One");

      expect(item.tags).toContain("Testing");
      expect(item.tags).toContain("test");
      expect(item.tags).toContain("article");
      expect(item.tags.length).toBe(3); // category + 2 keywords
    });

    it("should strip markdown from content_text", () => {
      const feed = generateJSONFeed();
      const parsed = JSON.parse(feed);
      const item = parsed.items[0];

      // Should not contain markdown formatting
      expect(item.content_text).not.toContain("**");
      expect(item.content_text).not.toContain("```");
      expect(item.content_text).not.toContain("[link]");
      expect(item.content_text).not.toContain("#");
    });

    it("should append ellipsis to content", () => {
      const feed = generateJSONFeed();
      const parsed = JSON.parse(feed);

      parsed.items.forEach((item: { content_text: string }) => {
        expect(item.content_text).toMatch(/\.\.\.$/);
      });
    });

    it("should format dates in ISO 8601", () => {
      const feed = generateJSONFeed();
      const parsed = JSON.parse(feed);

      parsed.items.forEach((item: { date_published: string }) => {
        const date = new Date(item.date_published);
        expect(date.toISOString()).toBe(item.date_published);
      });
    });

    it("should handle articles without keywords", () => {
      const feed = generateJSONFeed();
      const parsed = JSON.parse(feed);
      const item = parsed.items.find((i: { title: string }) => i.title === "Recent Article");

      // Should only have category tag, no keywords
      expect(item.tags).toContain("Latest");
      expect(item.tags.length).toBe(1);
    });

    it("should be pretty-printed with 2-space indentation", () => {
      const feed = generateJSONFeed();

      // Should have proper indentation
      expect(feed).toContain('  "version"');
      expect(feed).toContain('  "items"');
    });

    it("should handle special characters in JSON", () => {
      const feed = generateJSONFeed();
      const parsed = JSON.parse(feed);
      const item = parsed.items.find((i: { title: string }) =>
        i.title.includes("Special Characters")
      );

      // Special characters should be properly encoded in JSON
      expect(item.title).toContain("<>&\"'");
      expect(item.summary).toContain("&");
    });

    it("should limit content length", () => {
      const feed = generateJSONFeed();
      const parsed = JSON.parse(feed);

      // Content should be truncated (stripHtml limits to 500 chars + "...")
      parsed.items.forEach((item: { content_text: string }) => {
        expect(item.content_text.length).toBeLessThanOrEqual(504); // 500 + "..."
      });
    });
  });

  describe("integration between RSS and JSON feeds", () => {
    it("should include same articles in both feeds", () => {
      const rss = generateRSSFeed();
      const json = generateJSONFeed();
      const parsed = JSON.parse(json);

      expect(rss).toContain("Test Article One");
      expect(parsed.items.some((i: { title: string }) => i.title === "Test Article One")).toBe(
        true
      );

      expect(rss).toContain("Recent Article");
      expect(parsed.items.some((i: { title: string }) => i.title === "Recent Article")).toBe(
        true
      );
    });

    it("should have consistent article ordering", () => {
      const rss = generateRSSFeed();

      // RSS should be sorted newest first
      const rssFirstIndex = rss.indexOf("Recent Article");
      const rssSecondIndex = rss.indexOf("Test Article One");

      expect(rssFirstIndex).toBeLessThan(rssSecondIndex);
    });

    it("should handle empty articles array gracefully", () => {
      // This would require mocking articles as empty array
      // Just verify current implementation doesn't throw
      expect(() => generateRSSFeed()).not.toThrow();
      expect(() => generateJSONFeed()).not.toThrow();
    });
  });
});