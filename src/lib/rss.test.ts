import { describe, it, expect, vi } from "vitest";
import { generateRSSFeed, generateJSONFeed } from "./rss";

// Mock dependencies
vi.mock("./site-config", () => ({
  siteConfig: {
    siteUrl: "https://shahidster.tech",
    blogTitle: "Shahid Moosa - Distributed Systems Engineering",
    blogDescription: "Deep dives into distributed databases, data infrastructure, and production systems.",
  },
}));

vi.mock("../data/articles", () => ({
  articles: [
    {
      slug: "test-article-1",
      title: "Test Article 1",
      description: "This is test article 1",
      category: "Testing",
      date: "Jan 2024",
      content: "# Header\n\nThis is **bold** and this is `code`. [Link](https://example.com)\n\n```js\nconsole.log('test');\n```",
      seoKeywords: ["keyword1", "keyword2"],
    },
    {
      slug: "test-article-2",
      title: "Article with Special Chars & <tags>",
      description: 'Article with "quotes" and \'apostrophes\'',
      category: "Test & Dev",
      date: "Feb 2024",
      content: "Simple content",
      seoKeywords: [],
    },
    {
      slug: "old-article",
      title: "Old Article",
      description: "From the past",
      category: "Archive",
      date: "Dec 2023",
      content: "Old content here",
    },
  ],
}));

describe("rss", () => {
  describe("generateRSSFeed", () => {
    it("should generate valid RSS XML structure", () => {
      const result = generateRSSFeed();

      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(result).toContain('<rss version="2.0"');
      expect(result).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
      expect(result).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
      expect(result).toContain("<channel>");
      expect(result).toContain("</channel>");
      expect(result).toContain("</rss>");
    });

    it("should include channel metadata", () => {
      const result = generateRSSFeed();

      expect(result).toContain("<title>Shahid Moosa - Distributed Systems Engineering</title>");
      expect(result).toContain("<link>https://shahidster.tech</link>");
      expect(result).toContain("<description>Deep dives into distributed databases, data infrastructure, and production systems.</description>");
      expect(result).toContain("<language>en-us</language>");
    });

    it("should include lastBuildDate", () => {
      const result = generateRSSFeed();

      expect(result).toContain("<lastBuildDate>");
      expect(result).toMatch(/<lastBuildDate>[^<]+<\/lastBuildDate>/);
    });

    it("should include atom:link for self-reference", () => {
      const result = generateRSSFeed();

      expect(result).toContain('<atom:link href="https://shahidster.tech/rss.xml" rel="self" type="application/rss+xml"/>');
    });

    it("should include channel image", () => {
      const result = generateRSSFeed();

      expect(result).toContain("<image>");
      expect(result).toContain("<url>https://shahidster.tech/favicon.ico</url>");
      expect(result).toContain("</image>");
    });

    it("should include all articles as items", () => {
      const result = generateRSSFeed();

      expect(result).toContain("<item>");
      expect(result).toContain("Test Article 1");
      expect(result).toContain("Article with Special Chars &amp; &lt;tags&gt;");
      expect(result).toContain("Old Article");
    });

    it("should sort articles by date descending (newest first)", () => {
      const result = generateRSSFeed();

      // Feb 2024 should come before Jan 2024, which should come before Dec 2023
      const feb2024Index = result.indexOf("test-article-2");
      const jan2024Index = result.indexOf("test-article-1");
      const dec2023Index = result.indexOf("old-article");

      expect(feb2024Index).toBeLessThan(jan2024Index);
      expect(jan2024Index).toBeLessThan(dec2023Index);
    });

    it("should escape XML special characters in title", () => {
      const result = generateRSSFeed();

      expect(result).toContain("Article with Special Chars &amp; &lt;tags&gt;");
      expect(result).not.toContain("<tags>");
    });

    it("should escape XML special characters in description", () => {
      const result = generateRSSFeed();

      expect(result).toContain("Article with &quot;quotes&quot; and &apos;apostrophes&apos;");
    });

    it("should include article link and guid", () => {
      const result = generateRSSFeed();

      expect(result).toContain("<link>https://shahidster.tech/blog/test-article-1</link>");
      expect(result).toContain('<guid isPermaLink="true">https://shahidster.tech/blog/test-article-1</guid>');
    });

    it("should include article description", () => {
      const result = generateRSSFeed();

      expect(result).toContain("<description>This is test article 1</description>");
    });

    it("should include content:encoded with CDATA and stripped HTML", () => {
      const result = generateRSSFeed();

      expect(result).toContain("<content:encoded><![CDATA[");
      expect(result).toContain("]]></content:encoded>");
      // Content should be stripped of markdown/code blocks
      expect(result).not.toContain("```js");
      expect(result).not.toContain("console.log");
    });

    it("should include pubDate in UTC format", () => {
      const result = generateRSSFeed();

      expect(result).toMatch(/<pubDate>[^<]+GMT<\/pubDate>/);
    });

    it("should include category", () => {
      const result = generateRSSFeed();

      expect(result).toContain("<category>Testing</category>");
      expect(result).toContain("<category>Test &amp; Dev</category>");
    });

    it("should include SEO keywords as categories when present", () => {
      const result = generateRSSFeed();

      expect(result).toContain("<category>keyword1</category>");
      expect(result).toContain("<category>keyword2</category>");
    });

    it("should handle articles without SEO keywords", () => {
      const result = generateRSSFeed();

      // Should not crash and should include the article
      expect(result).toContain("Old Article");
    });

    it("should strip markdown formatting from content", () => {
      const result = generateRSSFeed();

      // The content should not contain markdown syntax
      const itemMatch = result.match(/<item>[\s\S]*?test-article-1[\s\S]*?<\/item>/);
      expect(itemMatch).toBeTruthy();

      const item = itemMatch![0];
      expect(item).not.toContain("**bold**");
      expect(item).not.toContain("`code`");
      expect(item).not.toContain("[Link]");
    });

    it("should handle CDATA end sequence in content", () => {
      const result = generateRSSFeed();

      // The ]]> sequence should be escaped to ]]&gt;
      // This test assumes stripHtml might leave this sequence
      expect(result).not.toMatch(/<content:encoded><!\[CDATA\[.*?\]\]>.*?\]\]>/);
    });
  });

  describe("generateJSONFeed", () => {
    it("should generate valid JSON", () => {
      const result = generateJSONFeed();

      expect(() => JSON.parse(result)).not.toThrow();
    });

    it("should conform to JSON Feed 1.1 structure", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(feed.version).toBe("https://jsonfeed.org/version/1.1");
      expect(feed.title).toBe("Shahid Moosa - Distributed Systems Engineering");
      expect(feed.home_page_url).toBe("https://shahidster.tech");
      expect(feed.feed_url).toBe("https://shahidster.tech/feed.json");
      expect(feed.description).toBe("Deep dives into distributed databases, data infrastructure, and production systems.");
      expect(feed.language).toBe("en-US");
    });

    it("should include items array", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(Array.isArray(feed.items)).toBe(true);
      expect(feed.items.length).toBe(3);
    });

    it("should sort items by date descending", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(feed.items[0].url).toContain("test-article-2"); // Feb 2024
      expect(feed.items[1].url).toContain("test-article-1"); // Jan 2024
      expect(feed.items[2].url).toContain("old-article"); // Dec 2023
    });

    it("should include all required item fields", () => {
      const feed = JSON.parse(generateJSONFeed());
      const item = feed.items[0];

      expect(item.id).toBe("https://shahidster.tech/blog/test-article-2");
      expect(item.url).toBe("https://shahidster.tech/blog/test-article-2");
      expect(item.title).toBeDefined();
      expect(item.summary).toBeDefined();
      expect(item.content_text).toBeDefined();
      expect(item.date_published).toBeDefined();
      expect(Array.isArray(item.tags)).toBe(true);
    });

    it("should format date_published as ISO 8601", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(feed.items[0].date_published).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it("should include category and keywords in tags", () => {
      const feed = JSON.parse(generateJSONFeed());
      const item = feed.items.find((i: any) => i.url.includes("test-article-1"));

      expect(item.tags).toContain("Testing");
      expect(item.tags).toContain("keyword1");
      expect(item.tags).toContain("keyword2");
    });

    it("should handle items without keywords", () => {
      const feed = JSON.parse(generateJSONFeed());
      const item = feed.items.find((i: any) => i.url.includes("old-article"));

      expect(item.tags).toEqual(["Archive"]);
    });

    it("should strip HTML/markdown from content_text", () => {
      const feed = JSON.parse(generateJSONFeed());
      const item = feed.items.find((i: any) => i.url.includes("test-article-1"));

      expect(item.content_text).not.toContain("```");
      expect(item.content_text).not.toContain("**");
      expect(item.content_text).not.toContain("`");
    });

    it("should be formatted with 2-space indentation", () => {
      const result = generateJSONFeed();

      // Check for 2-space indentation
      expect(result).toContain('  "version"');
      expect(result).toContain('    "id"');
    });

    it("should preserve special characters in JSON (not XML-escaped)", () => {
      const feed = JSON.parse(generateJSONFeed());
      const item = feed.items.find((i: any) => i.url.includes("test-article-2"));

      // In JSON, special chars should be preserved, not XML-escaped
      expect(item.title).toBe("Article with Special Chars & <tags>");
      expect(item.summary).toBe('Article with "quotes" and \'apostrophes\'');
    });
  });

  describe("edge cases", () => {
    it("should generate RSS feed without errors", () => {
      // Should not throw with mocked articles
      expect(() => generateRSSFeed()).not.toThrow();
      expect(() => generateJSONFeed()).not.toThrow();
    });

    it("should return non-empty strings", () => {
      const rss = generateRSSFeed();
      const json = generateJSONFeed();

      expect(rss.length).toBeGreaterThan(100);
      expect(json.length).toBeGreaterThan(50);
    });

    it("should include basic RSS structure", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<?xml");
      expect(rss).toContain("<rss");
      expect(rss).toContain("</rss>");
    });

    it("should include basic JSON Feed structure", () => {
      const json = JSON.parse(generateJSONFeed());

      expect(json.version).toBeDefined();
      expect(json.title).toBeDefined();
      expect(Array.isArray(json.items)).toBe(true);
    });

    it("should handle content stripping", () => {
      const json = JSON.parse(generateJSONFeed());

      // Content should be stripped of markdown
      if (json.items.length > 0) {
        const content = json.items[0].content_text;
        expect(content).toBeDefined();
        expect(typeof content).toBe("string");
      }
    });
  });
});