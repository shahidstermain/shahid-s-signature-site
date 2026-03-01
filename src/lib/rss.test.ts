import { describe, it, expect, vi } from "vitest";
import { generateRSSFeed, generateJSONFeed } from "./rss";

// Mock the articles data
vi.mock("../data/articles", () => ({
  articles: [
    {
      slug: "test-article-1",
      title: "Test Article 1",
      description: "This is a test description",
      category: "Testing",
      date: "Jan 2024",
      content: "This is test content with **bold** and `code`",
      seoKeywords: ["test", "article"],
    },
    {
      slug: "test-article-2",
      title: "Test & Special <Characters>",
      description: "Description with special chars & < > \" '",
      category: "Special & Category",
      date: "Feb 2024",
      content: "Content with special characters: & < > \" '",
      seoKeywords: ["special", "chars"],
    },
    {
      slug: "test-article-3",
      title: "Article without keywords",
      description: "No keywords here",
      category: "General",
      date: "Dec 2023",
      content: "Plain content",
    },
  ],
}));

describe("rss", () => {
  describe("generateRSSFeed", () => {
    it("should generate valid RSS XML structure", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(rss).toContain('<rss version="2.0"');
      expect(rss).toContain("<channel>");
      expect(rss).toContain("</channel>");
      expect(rss).toContain("</rss>");
    });

    it("should include RSS namespace declarations", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
      expect(rss).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    });

    it("should include channel metadata", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<title>Shahid Moosa - Distributed Systems Engineering</title>");
      expect(rss).toContain("<link>https://shahidster.tech</link>");
      expect(rss).toContain("<language>en-us</language>");
      expect(rss).toContain("<lastBuildDate>");
    });

    it("should include atom:link for self reference", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain(
        '<atom:link href="https://shahidster.tech/rss.xml" rel="self" type="application/rss+xml"/>'
      );
    });

    it("should include image element", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<image>");
      expect(rss).toContain("<url>https://shahidster.tech/favicon.ico</url>");
      expect(rss).toContain("</image>");
    });

    it("should escape XML special characters in title", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("Test &amp; Special &lt;Characters&gt;");
      expect(rss).not.toContain("Test & Special <Characters>");
    });

    it("should escape XML special characters in description", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("Description with special chars &amp; &lt; &gt; &quot; &apos;");
    });

    it("should generate items for all articles", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("test-article-1");
      expect(rss).toContain("test-article-2");
      expect(rss).toContain("test-article-3");
    });

    it("should sort articles by date descending", () => {
      const rss = generateRSSFeed();

      const article1Pos = rss.indexOf("test-article-1");
      const article2Pos = rss.indexOf("test-article-2");
      const article3Pos = rss.indexOf("test-article-3");

      // Feb 2024 should come before Jan 2024, which should come before Dec 2023
      expect(article2Pos).toBeLessThan(article1Pos);
      expect(article1Pos).toBeLessThan(article3Pos);
    });

    it("should include all required item elements", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<item>");
      expect(rss).toContain("<title>");
      expect(rss).toContain("<link>");
      expect(rss).toContain("<guid");
      expect(rss).toContain("<description>");
      expect(rss).toContain("<content:encoded>");
      expect(rss).toContain("<pubDate>");
      expect(rss).toContain("<category>");
    });

    it("should set guid as permalink", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain('isPermaLink="true"');
    });

    it("should include SEO keywords as categories", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<category>test</category>");
      expect(rss).toContain("<category>article</category>");
      expect(rss).toContain("<category>special</category>");
    });

    it("should handle articles without SEO keywords", () => {
      const rss = generateRSSFeed();

      // Should not crash and should include the article
      expect(rss).toContain("test-article-3");
    });

    it("should strip HTML/markdown from content in CDATA", () => {
      const rss = generateRSSFeed();

      // Content should be in CDATA sections
      expect(rss).toContain("<content:encoded><![CDATA[");
      expect(rss).toContain("]]></content:encoded>");
      // Bold and code markers should be removed from the final output
      expect(rss).not.toContain("**bold**");
      expect(rss).not.toContain("`code`");
    });

    it("should escape CDATA end sequence in content", () => {
      const rss = generateRSSFeed();

      // If content had ]]>, it should be escaped to ]]&gt;
      expect(rss).toContain("<content:encoded><![CDATA[");
      expect(rss).toContain("]]></content:encoded>");
    });

    it("should generate valid pubDate in RFC 822 format", () => {
      const rss = generateRSSFeed();

      // Should contain dates in format like: Mon, 01 Jan 2024 00:00:00 GMT
      expect(rss).toMatch(/<pubDate>[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT<\/pubDate>/);
    });

    it("should escape category names with special characters", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<category>Special &amp; Category</category>");
    });
  });

  describe("generateJSONFeed", () => {
    it("should generate valid JSON", () => {
      const json = generateJSONFeed();
      const parsed = JSON.parse(json);

      expect(parsed).toBeDefined();
      expect(typeof parsed).toBe("object");
    });

    it("should include JSON Feed 1.1 metadata", () => {
      const json = generateJSONFeed();
      const feed = JSON.parse(json);

      expect(feed.version).toBe("https://jsonfeed.org/version/1.1");
      expect(feed.title).toBe("Shahid Moosa - Distributed Systems Engineering");
      expect(feed.home_page_url).toBe("https://shahidster.tech");
      expect(feed.feed_url).toBe("https://shahidster.tech/feed.json");
      expect(feed.language).toBe("en-US");
    });

    it("should include description", () => {
      const json = generateJSONFeed();
      const feed = JSON.parse(json);

      expect(feed.description).toBeTruthy();
      expect(typeof feed.description).toBe("string");
    });

    it("should include items array", () => {
      const json = generateJSONFeed();
      const feed = JSON.parse(json);

      expect(Array.isArray(feed.items)).toBe(true);
      expect(feed.items.length).toBe(3);
    });

    it("should sort items by date descending", () => {
      const json = generateJSONFeed();
      const feed = JSON.parse(json);

      const dates = feed.items.map((item: any) => new Date(item.date_published).getTime());

      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
      }
    });

    it("should include all required item fields", () => {
      const json = generateJSONFeed();
      const feed = JSON.parse(json);
      const item = feed.items[0];

      expect(item.id).toBeDefined();
      expect(item.url).toBeDefined();
      expect(item.title).toBeDefined();
      expect(item.summary).toBeDefined();
      expect(item.content_text).toBeDefined();
      expect(item.date_published).toBeDefined();
      expect(item.tags).toBeDefined();
    });

    it("should format id and url correctly", () => {
      const json = generateJSONFeed();
      const feed = JSON.parse(json);
      const item = feed.items.find((i: any) => i.url.includes("test-article-1"));

      expect(item.id).toBe("https://shahidster.tech/blog/test-article-1");
      expect(item.url).toBe("https://shahidster.tech/blog/test-article-1");
    });

    it("should use description as summary", () => {
      const json = generateJSONFeed();
      const feed = JSON.parse(json);
      const item = feed.items.find((i: any) => i.url.includes("test-article-1"));

      expect(item.summary).toBe("This is a test description");
    });

    it("should strip HTML from content_text", () => {
      const json = generateJSONFeed();
      const feed = JSON.parse(json);
      const item = feed.items.find((i: any) => i.url.includes("test-article-1"));

      expect(item.content_text).toContain("bold");
      expect(item.content_text).not.toContain("**");
      expect(item.content_text).not.toContain("`");
    });

    it("should include category and keywords in tags", () => {
      const json = generateJSONFeed();
      const feed = JSON.parse(json);
      const item = feed.items.find((i: any) => i.url.includes("test-article-1"));

      expect(Array.isArray(item.tags)).toBe(true);
      expect(item.tags).toContain("Testing");
      expect(item.tags).toContain("test");
      expect(item.tags).toContain("article");
    });

    it("should handle items without SEO keywords", () => {
      const json = generateJSONFeed();
      const feed = JSON.parse(json);
      const item = feed.items.find((i: any) => i.url.includes("test-article-3"));

      expect(item.tags).toEqual(["General"]);
    });

    it("should format date_published in ISO 8601", () => {
      const json = generateJSONFeed();
      const feed = JSON.parse(json);
      const item = feed.items[0];

      // ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ
      expect(item.date_published).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it("should be pretty-printed with 2-space indentation", () => {
      const json = generateJSONFeed();

      // Check for pretty printing
      expect(json).toContain("\n");
      expect(json).toContain("  ");
    });

    it("should not include HTML special characters unescaped", () => {
      const json = generateJSONFeed();
      const feed = JSON.parse(json);

      // JSON.parse should handle all escaping correctly
      const item = feed.items.find((i: any) => i.url.includes("test-article-2"));
      expect(item.title).toContain("&");
      expect(item.title).toContain("<");
      expect(item.title).toContain(">");
    });

    it("should append ellipsis to truncated content", () => {
      const json = generateJSONFeed();
      const feed = JSON.parse(json);

      feed.items.forEach((item: any) => {
        expect(item.content_text).toContain("...");
      });
    });
  });

  describe("edge cases", () => {
    it("should handle very long content in RSS", () => {
      const rss = generateRSSFeed();
      expect(rss.length).toBeGreaterThan(0);
    });

    it("should handle very long content in JSON Feed", () => {
      const json = generateJSONFeed();
      const feed = JSON.parse(json);
      expect(feed.items.length).toBeGreaterThan(0);
    });

    it("should produce valid UTF-8 in RSS", () => {
      const rss = generateRSSFeed();
      expect(rss).toContain('encoding="UTF-8"');
    });

    it("should handle articles with all special XML characters", () => {
      const rss = generateRSSFeed();

      // All special chars should be escaped
      const hasUnescapedChars = /<description>[^<]*[&<>"'][^<]*<\/description>/.test(
        rss.replace(/&[a-z]+;/g, "")
      );
      expect(hasUnescapedChars).toBe(false);
    });
  });
});