import { describe, it, expect } from "vitest";
import { generateRSSFeed, generateJSONFeed } from "./rss";

describe("rss", () => {
  describe("generateRSSFeed", () => {
    it("should generate valid RSS XML", () => {
      const rss = generateRSSFeed();

      // Check XML declaration
      expect(rss).toContain('<?xml version="1.0" encoding="UTF-8"?>');

      // Check RSS version
      expect(rss).toContain('<rss version="2.0"');

      // Check namespaces
      expect(rss).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
      expect(rss).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    });

    it("should include channel metadata", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain('<channel>');
      expect(rss).toContain('<title>Shahid Moosa - Distributed Systems Engineering</title>');
      expect(rss).toContain('<link>https://shahidster.tech</link>');
      expect(rss).toContain('<description>Deep dives into distributed databases');
      expect(rss).toContain('<language>en-us</language>');
    });

    it("should include atom:link self-reference", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain('<atom:link href="https://shahidster.tech/rss.xml" rel="self" type="application/rss+xml"/>');
    });

    it("should include favicon image", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain('<image>');
      expect(rss).toContain('<url>https://shahidster.tech/favicon.ico</url>');
    });

    it("should include article items", () => {
      const rss = generateRSSFeed();

      // Should have multiple items
      const itemCount = (rss.match(/<item>/g) || []).length;
      expect(itemCount).toBeGreaterThan(0);

      // Check item structure
      expect(rss).toContain('<title>');
      expect(rss).toContain('<guid isPermaLink="true">');
      expect(rss).toContain('<pubDate>');
      expect(rss).toContain('<category>');
      expect(rss).toContain('<content:encoded>');
    });

    it("should escape XML special characters in titles", () => {
      const rss = generateRSSFeed();

      // Should not contain unescaped special chars
      // The actual titles don't have special chars, but checking escaping works
      expect(rss).not.toMatch(/<title>[^<]*&[^a][^m][^p]/);
    });

    it("should include article categories and keywords", () => {
      const rss = generateRSSFeed();

      // Check that categories are present
      expect(rss).toContain('<category>Fundamentals</category>');
      expect(rss).toContain('<category>Architecture</category>');
      expect(rss).toContain('<category>Performance</category>');
    });

    it("should sort articles by date descending", () => {
      const rss = generateRSSFeed();

      // Extract pub dates
      const pubDateMatches = rss.matchAll(/<pubDate>([^<]+)<\/pubDate>/g);
      const pubDates = Array.from(pubDateMatches).map(m => new Date(m[1]));

      // Verify they're in descending order
      for (let i = 1; i < pubDates.length; i++) {
        expect(pubDates[i - 1].getTime()).toBeGreaterThanOrEqual(pubDates[i].getTime());
      }
    });

    it("should include lastBuildDate", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain('<lastBuildDate>');
    });

    it("should include content:encoded with CDATA", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain('<content:encoded><![CDATA[');
      expect(rss).toContain(']]></content:encoded>');
    });
  });

  describe("generateJSONFeed", () => {
    it("should generate valid JSON", () => {
      const jsonString = generateJSONFeed();

      // Should parse without errors
      const feed = JSON.parse(jsonString);
      expect(feed).toBeDefined();
    });

    it("should include JSON Feed version", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(feed.version).toBe("https://jsonfeed.org/version/1.1");
    });

    it("should include feed metadata", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(feed.title).toBe("Shahid Moosa - Distributed Systems Engineering");
      expect(feed.home_page_url).toBe("https://shahidster.tech");
      expect(feed.feed_url).toBe("https://shahidster.tech/feed.json");
      expect(feed.description).toContain("Deep dives into distributed databases");
      expect(feed.language).toBe("en-US");
    });

    it("should include items array", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(Array.isArray(feed.items)).toBe(true);
      expect(feed.items.length).toBeGreaterThan(0);
    });

    it("should include item properties", () => {
      const feed = JSON.parse(generateJSONFeed());
      const item = feed.items[0];

      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("url");
      expect(item).toHaveProperty("title");
      expect(item).toHaveProperty("summary");
      expect(item).toHaveProperty("content_text");
      expect(item).toHaveProperty("date_published");
      expect(item).toHaveProperty("tags");
    });

    it("should format item URLs correctly", () => {
      const feed = JSON.parse(generateJSONFeed());
      const item = feed.items[0];

      expect(item.id).toMatch(/^https:\/\/shahidster\.tech\/blog\//);
      expect(item.url).toMatch(/^https:\/\/shahidster\.tech\/blog\//);
    });

    it("should include date in ISO 8601 format", () => {
      const feed = JSON.parse(generateJSONFeed());
      const item = feed.items[0];

      expect(item.date_published).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it("should include tags from category and keywords", () => {
      const feed = JSON.parse(generateJSONFeed());
      const item = feed.items[0];

      expect(Array.isArray(item.tags)).toBe(true);
      expect(item.tags.length).toBeGreaterThan(0);
    });

    it("should strip HTML from content", () => {
      const feed = JSON.parse(generateJSONFeed());
      const item = feed.items[0];

      // Should not contain markdown code blocks
      expect(item.content_text).not.toContain("```");

      // Should not contain markdown headers
      expect(item.content_text).not.toContain("##");
    });

    it("should be pretty-printed with 2-space indentation", () => {
      const jsonString = generateJSONFeed();

      // Should have newlines and spaces for formatting
      expect(jsonString).toContain("\n");
      expect(jsonString).toMatch(/\n  "/);
    });

    it("should truncate content to reasonable length", () => {
      const feed = JSON.parse(generateJSONFeed());

      feed.items.forEach((item: { content_text: string }) => {
        // Content should end with "..." and be truncated
        expect(item.content_text).toContain("...");
        // Base content is limited to 500 chars, plus "..."
        expect(item.content_text.length).toBeLessThanOrEqual(510);
      });
    });

    // Additional edge case tests
    it("should handle multiple categories per item", () => {
      const rss = generateRSSFeed();

      // Should have category tags
      const categoryMatches = rss.match(/<category>/g);
      expect(categoryMatches).toBeTruthy();
      expect(categoryMatches!.length).toBeGreaterThan(0);
    });

    it("should maintain valid XML with nested CDATA sections", () => {
      const rss = generateRSSFeed();

      // CDATA should be properly closed
      expect(rss).toContain("<![CDATA[");
      expect(rss).toContain("]]>");

      const cdataOpens = (rss.match(/<!\[CDATA\[/g) || []).length;
      const cdataCloses = (rss.match(/\]\]>/g) || []).length;

      expect(cdataOpens).toBe(cdataCloses);
    });

    it("should generate consistent JSON structure", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(feed).toHaveProperty("version");
      expect(feed).toHaveProperty("title");
      expect(feed).toHaveProperty("home_page_url");
      expect(feed).toHaveProperty("feed_url");
      expect(feed).toHaveProperty("description");
      expect(feed).toHaveProperty("language");
      expect(feed).toHaveProperty("items");
    });
  });
});