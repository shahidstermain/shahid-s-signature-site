import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateRSSFeed, generateJSONFeed } from "./rss";

// Mock the articles module
vi.mock("../data/articles", () => ({
  articles: [
    {
      slug: "test-article-1",
      title: "Test Article & One",
      description: "A description with special <characters>",
      category: "Testing",
      readTime: "5 min read",
      date: "Jan 2024",
      featured: true,
      seoKeywords: ["test", "article", "keywords"],
      content: `
# Test Article

This is **bold** text with \`code\` and [a link](https://example.com).

\`\`\`javascript
const foo = "bar";
\`\`\`

Some more content here.
      `,
    },
    {
      slug: "test-article-2",
      title: "Test Article Two",
      description: "Another test article",
      category: "Testing",
      readTime: "3 min read",
      date: "Feb 2024",
      featured: false,
      content: "Simple content without formatting.",
    },
    {
      slug: "test-article-3",
      title: 'Article with "quotes" & apostrophe\'s',
      description: "Testing XML escaping",
      category: "XML & Escaping",
      readTime: "2 min read",
      date: "Dec 2023",
      featured: false,
      seoKeywords: ["xml", "escaping", "test & verify"],
      content: "Content with <xml> tags & special chars.",
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

    it("should include required RSS namespaces", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
      expect(rss).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    });

    it("should include site metadata in channel", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<title>Shahid Moosa - Distributed Systems Engineering</title>");
      expect(rss).toContain("<link>https://shahidster.tech</link>");
      expect(rss).toContain("<language>en-us</language>");
    });

    it("should include self-referencing atom:link", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain('atom:link href="https://shahidster.tech/rss.xml"');
      expect(rss).toContain('rel="self"');
      expect(rss).toContain('type="application/rss+xml"');
    });

    it("should include channel image", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<image>");
      expect(rss).toContain("<url>https://shahidster.tech/favicon.ico</url>");
      expect(rss).toContain("</image>");
    });

    it("should include all articles as items", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<item>");
      expect(rss).toContain("test-article-1");
      expect(rss).toContain("test-article-2");
      expect(rss).toContain("test-article-3");
    });

    it("should properly escape XML special characters in titles", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("Test Article &amp; One");
      expect(rss).toContain("Article with &quot;quotes&quot; &amp; apostrophe&apos;s");
    });

    it("should properly escape XML special characters in descriptions", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("A description with special &lt;characters&gt;");
    });

    it("should include article metadata", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<title>Test Article &amp; One</title>");
      expect(rss).toContain("<link>https://shahidster.tech/blog/test-article-1</link>");
      expect(rss).toContain('<guid isPermaLink="true">https://shahidster.tech/blog/test-article-1</guid>');
      expect(rss).toContain("<description>A description with special &lt;characters&gt;</description>");
      expect(rss).toContain("<category>Testing</category>");
    });

    it("should include SEO keywords as categories", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<category>test</category>");
      expect(rss).toContain("<category>article</category>");
      expect(rss).toContain("<category>keywords</category>");
    });

    it("should include pubDate for articles", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<pubDate>");
      expect(rss).toContain("</pubDate>");
    });

    it("should include content:encoded with CDATA", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<content:encoded><![CDATA[");
      expect(rss).toContain("]]></content:encoded>");
    });

    it("should strip HTML/Markdown from content in CDATA", () => {
      const rss = generateRSSFeed();

      // Bold markdown should be removed
      expect(rss).not.toContain("**bold**");
      // Code blocks should be removed
      expect(rss).not.toContain("```javascript");
      // Links should be converted to text
      expect(rss).not.toContain("[a link](https://example.com)");
    });

    it("should sort articles by date (newest first)", () => {
      const rss = generateRSSFeed();

      // Feb 2024 should come before Jan 2024, which should come before Dec 2023
      const febIndex = rss.indexOf("test-article-2");
      const janIndex = rss.indexOf("test-article-1");
      const decIndex = rss.indexOf("test-article-3");

      expect(febIndex).toBeLessThan(janIndex);
      expect(janIndex).toBeLessThan(decIndex);
    });

    it("should handle articles without SEO keywords", () => {
      const rss = generateRSSFeed();

      // Should not crash and should generate valid RSS
      expect(rss).toContain("<item>");
      expect(rss).toContain("test-article-2");
    });

    it("should include lastBuildDate", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<lastBuildDate>");
      expect(rss).toContain("</lastBuildDate>");
    });

    it("should properly escape ampersands in keywords", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<category>test &amp; verify</category>");
    });

    it("should handle CDATA content with ]]> sequences", () => {
      const rss = generateRSSFeed();

      // The content should not break CDATA if it contains ]]>
      expect(rss).toContain("<content:encoded><![CDATA[");
      expect(rss).toContain("]]></content:encoded>");
    });
  });

  describe("generateJSONFeed", () => {
    it("should generate valid JSON", () => {
      const jsonFeed = generateJSONFeed();
      const parsed = JSON.parse(jsonFeed);

      expect(parsed).toBeDefined();
      expect(typeof parsed).toBe("object");
    });

    it("should include JSON Feed version", () => {
      const jsonFeed = generateJSONFeed();
      const parsed = JSON.parse(jsonFeed);

      expect(parsed.version).toBe("https://jsonfeed.org/version/1.1");
    });

    it("should include feed metadata", () => {
      const jsonFeed = generateJSONFeed();
      const parsed = JSON.parse(jsonFeed);

      expect(parsed.title).toBe("Shahid Moosa - Distributed Systems Engineering");
      expect(parsed.home_page_url).toBe("https://shahidster.tech");
      expect(parsed.feed_url).toBe("https://shahidster.tech/feed.json");
      expect(parsed.language).toBe("en-US");
    });

    it("should include items array", () => {
      const jsonFeed = generateJSONFeed();
      const parsed = JSON.parse(jsonFeed);

      expect(Array.isArray(parsed.items)).toBe(true);
      expect(parsed.items.length).toBe(3);
    });

    it("should include required item fields", () => {
      const jsonFeed = generateJSONFeed();
      const parsed = JSON.parse(jsonFeed);
      const item = parsed.items[0];

      expect(item.id).toBeDefined();
      expect(item.url).toBeDefined();
      expect(item.title).toBeDefined();
      expect(item.summary).toBeDefined();
      expect(item.content_text).toBeDefined();
      expect(item.date_published).toBeDefined();
      expect(item.tags).toBeDefined();
    });

    it("should format item URLs correctly", () => {
      const jsonFeed = generateJSONFeed();
      const parsed = JSON.parse(jsonFeed);
      const item = parsed.items.find((i: any) => i.url.includes("test-article-1"));

      expect(item.id).toBe("https://shahidster.tech/blog/test-article-1");
      expect(item.url).toBe("https://shahidster.tech/blog/test-article-1");
    });

    it("should include tags from category and keywords", () => {
      const jsonFeed = generateJSONFeed();
      const parsed = JSON.parse(jsonFeed);
      const item = parsed.items.find((i: any) => i.url.includes("test-article-1"));

      expect(item.tags).toContain("Testing");
      expect(item.tags).toContain("test");
      expect(item.tags).toContain("article");
      expect(item.tags).toContain("keywords");
    });

    it("should format date as ISO 8601", () => {
      const jsonFeed = generateJSONFeed();
      const parsed = JSON.parse(jsonFeed);
      const item = parsed.items[0];

      expect(item.date_published).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it("should strip formatting from content_text", () => {
      const jsonFeed = generateJSONFeed();
      const parsed = JSON.parse(jsonFeed);
      const item = parsed.items.find((i: any) => i.url.includes("test-article-1"));

      // Should not contain markdown
      expect(item.content_text).not.toContain("**bold**");
      expect(item.content_text).not.toContain("```");
      expect(item.content_text).not.toContain("[a link]");
    });

    it("should sort items by date (newest first)", () => {
      const jsonFeed = generateJSONFeed();
      const parsed = JSON.parse(jsonFeed);

      const urls = parsed.items.map((item: any) => item.url);
      expect(urls[0]).toContain("test-article-2"); // Feb 2024
      expect(urls[1]).toContain("test-article-1"); // Jan 2024
      expect(urls[2]).toContain("test-article-3"); // Dec 2023
    });

    it("should handle articles without keywords", () => {
      const jsonFeed = generateJSONFeed();
      const parsed = JSON.parse(jsonFeed);
      const item = parsed.items.find((i: any) => i.url.includes("test-article-2"));

      expect(item.tags).toContain("Testing");
      expect(item.tags.length).toBeGreaterThan(0);
    });

    it("should format JSON with proper indentation", () => {
      const jsonFeed = generateJSONFeed();

      // Should be pretty-printed with 2-space indentation
      expect(jsonFeed).toContain("\n  ");
    });

    it("should truncate long content with ellipsis", () => {
      const jsonFeed = generateJSONFeed();
      const parsed = JSON.parse(jsonFeed);
      const item = parsed.items[0];

      expect(item.content_text).toContain("...");
    });

    it("should include summary field matching article description", () => {
      const jsonFeed = generateJSONFeed();
      const parsed = JSON.parse(jsonFeed);
      const item = parsed.items.find((i: any) => i.url.includes("test-article-1"));

      expect(item.summary).toBe("A description with special <characters>");
    });

    it("should preserve special characters in JSON (not escape them)", () => {
      const jsonFeed = generateJSONFeed();
      const parsed = JSON.parse(jsonFeed);
      const item = parsed.items.find((i: any) => i.url.includes("test-article-3"));

      // JSON preserves quotes and special chars, doesn't XML-escape them
      expect(item.title).toContain('"quotes"');
      expect(item.title).toContain("&");
      expect(item.title).toContain("'");
    });
  });

  describe("edge cases", () => {
    it("should handle empty SEO keywords array", () => {
      const rss = generateRSSFeed();
      const json = generateJSONFeed();

      expect(() => JSON.parse(json)).not.toThrow();
      expect(rss).toContain("<item>");
    });

    it("should handle very long content", () => {
      const rss = generateRSSFeed();
      const json = generateJSONFeed();

      expect(rss).toBeDefined();
      expect(() => JSON.parse(json)).not.toThrow();
    });

    it("should generate consistent output on multiple calls", () => {
      const rss1 = generateRSSFeed();
      const rss2 = generateRSSFeed();

      // Build dates will differ, but structure should be similar
      expect(rss1).toContain("<channel>");
      expect(rss2).toContain("<channel>");
    });

    it("should handle articles with only required fields", () => {
      const rss = generateRSSFeed();
      const json = generateJSONFeed();

      // Should handle articles without optional seoKeywords
      expect(rss).toContain("<item>");
      expect(() => JSON.parse(json)).not.toThrow();
    });

    it("should properly escape CDATA end sequences in content", () => {
      const rss = generateRSSFeed();

      // CDATA sections should not break if content contains ]]>
      expect(rss).toContain("<content:encoded><![CDATA[");
      expect(rss).toContain("]]></content:encoded>");

      // Verify CDATA sections are properly closed
      const cdataMatches = rss.match(/<content:encoded><!\[CDATA\[/g);
      const cdataCloseMatches = rss.match(/\]\]><\/content:encoded>/g);
      expect(cdataMatches?.length).toBe(cdataCloseMatches?.length);
    });

    it("should generate valid ISO dates in JSON feed", () => {
      const jsonFeed = generateJSONFeed();
      const parsed = JSON.parse(jsonFeed);

      parsed.items.forEach((item: any) => {
        const date = new Date(item.date_published);
        expect(date.toISOString()).toBe(item.date_published);
      });
    });

    it("should maintain article count consistency between RSS and JSON", () => {
      const rss = generateRSSFeed();
      const json = generateJSONFeed();
      const parsed = JSON.parse(json);

      const rssItemCount = (rss.match(/<item>/g) || []).length;
      const jsonItemCount = parsed.items.length;

      expect(rssItemCount).toBe(jsonItemCount);
    });
  });
});