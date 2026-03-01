import { describe, it, expect, beforeEach, vi } from "vitest";
import { generateRSSFeed, generateJSONFeed } from "../lib/rss";
import * as articlesModule from "../data/articles";

// Mock articles data for testing
const mockArticles = [
  {
    slug: "test-article-1",
    title: "Test Article & Special <Chars>",
    description: "A test article with special characters & symbols",
    category: "Testing",
    readTime: "5 min read",
    date: "Jan 2026",
    featured: true,
    seoKeywords: ["test", "article", "special-chars"],
    content: `
# Test Content

This is **bold** text with \`code\` blocks.

\`\`\`javascript
const test = "code block";
\`\`\`

[Link text](https://example.com)

More content here...
    `.repeat(20), // Make it longer to test stripHtml truncation
  },
  {
    slug: "test-article-2",
    title: "Another Test Article",
    description: "Second test article",
    category: "Development",
    readTime: "3 min read",
    date: "Dec 2025",
    featured: false,
    content: "Simple content without special formatting.",
  },
];

describe("RSS Feed Generation", () => {
  beforeEach(() => {
    // Mock the articles array
    vi.spyOn(articlesModule, "articles", "get").mockReturnValue(mockArticles as any);
  });

  describe("generateRSSFeed", () => {
    it("should generate valid RSS 2.0 XML", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(rss).toContain('<rss version="2.0"');
      expect(rss).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
      expect(rss).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    });

    it("should include channel metadata", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<title>Shahid Moosa - Distributed Systems Engineering</title>");
      expect(rss).toContain("<link>https://shahidster.tech</link>");
      expect(rss).toContain("<description>");
      expect(rss).toContain("<language>en-us</language>");
      expect(rss).toContain("<lastBuildDate>");
    });

    it("should include atom self-link", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain('<atom:link href="https://shahidster.tech/rss.xml" rel="self" type="application/rss+xml"/>');
    });

    it("should include channel image", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<image>");
      expect(rss).toContain("<url>https://shahidster.tech/favicon.ico</url>");
    });

    it("should include all articles as items", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<item>");
      expect(rss).toContain("test-article-1");
      expect(rss).toContain("test-article-2");
    });

    it("should escape XML special characters in article titles", () => {
      const rss = generateRSSFeed();

      // Should escape & < > " '
      expect(rss).toContain("Test Article &amp; Special &lt;Chars&gt;");
      expect(rss).not.toContain("Test Article & Special <Chars>");
    });

    it("should include article links with proper format", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<link>https://shahidster.tech/blog/test-article-1</link>");
      expect(rss).toContain('<guid isPermaLink="true">https://shahidster.tech/blog/test-article-1</guid>');
    });

    it("should include article description", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<description>A test article with special characters &amp; symbols</description>");
    });

    it("should include content:encoded with CDATA", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<content:encoded><![CDATA[");
      expect(rss).toContain("]]></content:encoded>");
    });

    it("should include pubDate in RFC 822 format", () => {
      const rss = generateRSSFeed();

      // Should contain date in format like "Sat, 01 Jan 2026 00:00:00 GMT"
      expect(rss).toMatch(/<pubDate>[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT<\/pubDate>/);
    });

    it("should include category from article", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<category>Testing</category>");
      expect(rss).toContain("<category>Development</category>");
    });

    it("should include seoKeywords as additional categories", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<category>test</category>");
      expect(rss).toContain("<category>article</category>");
      expect(rss).toContain("<category>special-chars</category>");
    });

    it("should sort articles by date descending (newest first)", () => {
      const rss = generateRSSFeed();

      // Jan 2026 should come before Dec 2025
      const jan2026Index = rss.indexOf("test-article-1");
      const dec2025Index = rss.indexOf("test-article-2");

      expect(jan2026Index).toBeLessThan(dec2025Index);
    });

    it("should strip HTML/Markdown from content", () => {
      const rss = generateRSSFeed();

      // Should not contain markdown formatting
      expect(rss).not.toContain("**bold**");
      expect(rss).not.toContain("`code`");
      expect(rss).not.toContain("```javascript");
      expect(rss).not.toContain("[Link text](https://example.com)");
    });

    it("should truncate long content to 500 characters", () => {
      const rss = generateRSSFeed();

      // Extract content:encoded for first article
      const contentMatch = rss.match(/<content:encoded><!\[CDATA\[(.*?)\.\.\.\]\]><\/content:encoded>/s);
      expect(contentMatch).toBeTruthy();

      if (contentMatch) {
        const content = contentMatch[1];
        expect(content.length).toBeLessThanOrEqual(500);
      }
    });

    it("should handle articles without seoKeywords", () => {
      const rss = generateRSSFeed();

      // Second article has no seoKeywords, should not cause errors
      expect(rss).toContain("test-article-2");
      expect(rss).toContain("<category>Development</category>");
    });
  });

  describe("generateJSONFeed", () => {
    it("should generate valid JSON", () => {
      const jsonFeed = generateJSONFeed();

      expect(() => JSON.parse(jsonFeed)).not.toThrow();
    });

    it("should conform to JSON Feed 1.1 spec", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(feed.version).toBe("https://jsonfeed.org/version/1.1");
    });

    it("should include feed metadata", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(feed.title).toBe("Shahid Moosa - Distributed Systems Engineering");
      expect(feed.home_page_url).toBe("https://shahidster.tech");
      expect(feed.feed_url).toBe("https://shahidster.tech/feed.json");
      expect(feed.description).toBeTruthy();
      expect(feed.language).toBe("en-US");
    });

    it("should include all articles as items", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(feed.items).toHaveLength(2);
      expect(feed.items[0].id).toBe("https://shahidster.tech/blog/test-article-1");
      expect(feed.items[1].id).toBe("https://shahidster.tech/blog/test-article-2");
    });

    it("should include article URLs", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(feed.items[0].url).toBe("https://shahidster.tech/blog/test-article-1");
    });

    it("should include article titles", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(feed.items[0].title).toBe("Test Article & Special <Chars>");
      // JSON doesn't need XML escaping
      expect(feed.items[0].title).not.toContain("&amp;");
    });

    it("should include article summaries", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(feed.items[0].summary).toBe("A test article with special characters & symbols");
    });

    it("should include plain text content", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(feed.items[0].content_text).toBeTruthy();
      // Should be plain text without markdown
      expect(feed.items[0].content_text).not.toContain("**");
      expect(feed.items[0].content_text).not.toContain("```");
    });

    it("should truncate content with ellipsis", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(feed.items[0].content_text).toContain("...");
    });

    it("should include ISO 8601 publish dates", () => {
      const feed = JSON.parse(generateJSONFeed());

      // Should match ISO format: 2026-01-01T00:00:00.000Z
      expect(feed.items[0].date_published).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it("should include tags from category and keywords", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(feed.items[0].tags).toEqual(["Testing", "test", "article", "special-chars"]);
      expect(feed.items[1].tags).toEqual(["Development"]); // No keywords
    });

    it("should be pretty-printed with 2-space indentation", () => {
      const jsonFeed = generateJSONFeed();

      // Check for proper indentation
      expect(jsonFeed).toContain('  "version"');
      expect(jsonFeed).toContain('    "id"');
    });

    it("should handle special characters in JSON without escaping HTML entities", () => {
      const feed = JSON.parse(generateJSONFeed());

      // JSON should contain raw characters, not HTML entities
      expect(feed.items[0].title).toContain("&");
      expect(feed.items[0].title).toContain("<");
      expect(feed.items[0].title).toContain(">");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty articles array", () => {
      vi.spyOn(articlesModule, "articles", "get").mockReturnValue([]);

      const rss = generateRSSFeed();
      expect(rss).toContain("<channel>");
      expect(rss).not.toContain("<item>");

      const feed = JSON.parse(generateJSONFeed());
      expect(feed.items).toEqual([]);
    });

    it("should handle article with apostrophes in title", () => {
      const articlesWithApostrophe = [{
        ...mockArticles[0],
        title: "It's a Test Article",
        slug: "its-a-test",
      }];

      vi.spyOn(articlesModule, "articles", "get").mockReturnValue(articlesWithApostrophe as any);

      const rss = generateRSSFeed();
      expect(rss).toContain("It&apos;s a Test Article");
    });

    it("should handle article with quotes in description", () => {
      const articlesWithQuotes = [{
        ...mockArticles[0],
        description: 'A "test" article',
        slug: "test-quotes",
      }];

      vi.spyOn(articlesModule, "articles", "get").mockReturnValue(articlesWithQuotes as any);

      const rss = generateRSSFeed();
      expect(rss).toContain("A &quot;test&quot; article");
    });

    it("should handle content with consecutive newlines", () => {
      const articlesWithNewlines = [{
        ...mockArticles[0],
        content: "Line 1\n\n\nLine 2\n\n\n\nLine 3",
        slug: "test-newlines",
      }];

      vi.spyOn(articlesModule, "articles", "get").mockReturnValue(articlesWithNewlines as any);

      const rss = generateRSSFeed();
      const feed = JSON.parse(generateJSONFeed());

      // Should collapse multiple newlines to single space
      expect(feed.items[0].content_text).not.toContain("\n\n");
    });

    it("should handle very short content", () => {
      const articlesWithShortContent = [{
        ...mockArticles[0],
        content: "Short",
        slug: "test-short",
      }];

      vi.spyOn(articlesModule, "articles", "get").mockReturnValue(articlesWithShortContent as any);

      const rss = generateRSSFeed();
      const feed = JSON.parse(generateJSONFeed());

      expect(feed.items[0].content_text).toBe("Short...");
    });
  });
});