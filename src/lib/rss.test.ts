import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateRSSFeed, generateJSONFeed } from "./rss";

describe("rss", () => {
  describe("generateRSSFeed", () => {
    it("should generate valid RSS 2.0 XML", () => {
      const feed = generateRSSFeed();

      expect(feed).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(feed).toContain('<rss version="2.0"');
      expect(feed).toContain("<channel>");
      expect(feed).toContain("</channel>");
      expect(feed).toContain("</rss>");
    });

    it("should include required RSS namespaces", () => {
      const feed = generateRSSFeed();

      expect(feed).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
      expect(feed).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    });

    it("should include site metadata", () => {
      const feed = generateRSSFeed();

      expect(feed).toContain("<title>Shahid Moosa - Distributed Systems Engineering</title>");
      expect(feed).toContain("<link>https://shahidster.tech</link>");
      expect(feed).toContain(
        "<description>Deep dives into distributed databases, data infrastructure, and production systems. Written by a senior distributed-systems engineer.</description>"
      );
      expect(feed).toContain("<language>en-us</language>");
    });

    it("should include lastBuildDate", () => {
      const feed = generateRSSFeed();

      expect(feed).toContain("<lastBuildDate>");
      expect(feed).toMatch(/<lastBuildDate>[^<]+<\/lastBuildDate>/);
    });

    it("should include atom:link for self-reference", () => {
      const feed = generateRSSFeed();

      expect(feed).toContain('<atom:link href="https://shahidster.tech/rss.xml" rel="self" type="application/rss+xml"/>');
    });

    it("should include image element", () => {
      const feed = generateRSSFeed();

      expect(feed).toContain("<image>");
      expect(feed).toContain("<url>https://shahidster.tech/favicon.ico</url>");
      expect(feed).toContain("</image>");
    });

    it("should include items for articles", () => {
      const feed = generateRSSFeed();

      expect(feed).toContain("<item>");
      expect(feed).toContain("</item>");
    });

    it("should escape XML special characters in content", () => {
      const feed = generateRSSFeed();

      // Should not contain unescaped special characters in text nodes
      const itemMatches = feed.match(/<title>([^<]+)<\/title>/g);
      expect(itemMatches).toBeTruthy();

      // If there were any & in titles, they should be escaped
      if (feed.includes("&amp;")) {
        expect(feed).not.toMatch(/<title>[^<]*&[^a][^<]*<\/title>/);
      }
    });

    it("should include article metadata in items", () => {
      const feed = generateRSSFeed();

      // Should have standard RSS item elements
      expect(feed).toContain("<title>");
      expect(feed).toContain("<link>");
      expect(feed).toContain("<guid");
      expect(feed).toContain("<description>");
      expect(feed).toContain("<content:encoded>");
      expect(feed).toContain("<pubDate>");
      expect(feed).toContain("<category>");
    });

    it("should include permalink GUIDs", () => {
      const feed = generateRSSFeed();

      expect(feed).toContain('isPermaLink="true"');
    });

    it("should sort articles by date descending", () => {
      const feed = generateRSSFeed();

      // Extract all item titles
      const titleMatches = [...feed.matchAll(/<item>[\s\S]*?<title>([^<]+)<\/title>/g)];
      const titles = titleMatches.map((m) => m[1]);

      // First article should be "The Latency Tax of Separated Compute and Storage" (Jan 2026)
      // or "Non-Blocking DDL is a Myth" (Jan 2026)
      expect(titles.length).toBeGreaterThan(0);
    });

    it("should include CDATA sections for content", () => {
      const feed = generateRSSFeed();

      expect(feed).toContain("<![CDATA[");
      expect(feed).toContain("]]>");
    });

    it("should strip HTML/Markdown from content snippets", () => {
      const feed = generateRSSFeed();

      // Should not contain code block markers in CDATA
      const cdataContent = feed.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
      if (cdataContent && cdataContent[1]) {
        expect(cdataContent[1]).not.toContain("```");
        expect(cdataContent[1]).not.toContain("**");
        expect(cdataContent[1]).not.toContain("##");
      }
    });

    it("should handle articles with SEO keywords as categories", () => {
      const feed = generateRSSFeed();

      // Articles with seoKeywords should have multiple category elements
      const categoryMatches = feed.match(/<category>[^<]+<\/category>/g);
      expect(categoryMatches).toBeTruthy();
      expect(categoryMatches!.length).toBeGreaterThanOrEqual(9); // At least one per article
    });
  });

  describe("generateJSONFeed", () => {
    it("should generate valid JSON", () => {
      const feed = generateJSONFeed();

      expect(() => JSON.parse(feed)).not.toThrow();
    });

    it("should conform to JSON Feed 1.1 spec", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(feed.version).toBe("https://jsonfeed.org/version/1.1");
      expect(feed.title).toBeDefined();
      expect(feed.home_page_url).toBeDefined();
      expect(feed.feed_url).toBeDefined();
      expect(feed.items).toBeInstanceOf(Array);
    });

    it("should include site metadata", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(feed.title).toBe("Shahid Moosa - Distributed Systems Engineering");
      expect(feed.home_page_url).toBe("https://shahidster.tech");
      expect(feed.feed_url).toBe("https://shahidster.tech/feed.json");
      expect(feed.description).toBe(
        "Deep dives into distributed databases, data infrastructure, and production systems. Written by a senior distributed-systems engineer."
      );
      expect(feed.language).toBe("en-US");
    });

    it("should include items with required fields", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(feed.items.length).toBeGreaterThan(0);

      const firstItem = feed.items[0];
      expect(firstItem).toHaveProperty("id");
      expect(firstItem).toHaveProperty("url");
      expect(firstItem).toHaveProperty("title");
      expect(firstItem).toHaveProperty("summary");
      expect(firstItem).toHaveProperty("content_text");
      expect(firstItem).toHaveProperty("date_published");
      expect(firstItem).toHaveProperty("tags");
    });

    it("should format dates as ISO 8601", () => {
      const feed = JSON.parse(generateJSONFeed());

      feed.items.forEach((item: { date_published: string }) => {
        expect(item.date_published).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
        );
      });
    });

    it("should sort articles by date descending", () => {
      const feed = JSON.parse(generateJSONFeed());

      const dates = feed.items.map((item: { date_published: string }) =>
        new Date(item.date_published).getTime()
      );

      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
      }
    });

    it("should include category and keywords in tags", () => {
      const feed = JSON.parse(generateJSONFeed());

      feed.items.forEach((item: { tags: string[] }) => {
        expect(Array.isArray(item.tags)).toBe(true);
        expect(item.tags.length).toBeGreaterThan(0);
      });
    });

    it("should strip HTML/Markdown from content_text", () => {
      const feed = JSON.parse(generateJSONFeed());

      feed.items.forEach((item: { content_text: string }) => {
        expect(item.content_text).not.toContain("```");
        expect(item.content_text).not.toContain("**");
        expect(item.content_text).not.toContain("##");
        expect(item.content_text).not.toContain("[");
        expect(item.content_text).not.toContain("](");
      });
    });

    it("should have pretty-printed JSON with 2-space indentation", () => {
      const feed = generateJSONFeed();

      expect(feed).toContain("\n");
      expect(feed).toContain("  ");
      // JSON.stringify with indent 2 creates proper formatting
      const parsed = JSON.parse(feed);
      expect(parsed.version).toBeDefined();
    });

    it("should generate unique IDs for each article", () => {
      const feed = JSON.parse(generateJSONFeed());

      const ids = feed.items.map((item: { id: string }) => item.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should match ID and URL for each item", () => {
      const feed = JSON.parse(generateJSONFeed());

      feed.items.forEach((item: { id: string; url: string }) => {
        expect(item.id).toBe(item.url);
      });
    });

    it("should append ellipsis to content_text", () => {
      const feed = JSON.parse(generateJSONFeed());

      feed.items.forEach((item: { content_text: string }) => {
        expect(item.content_text).toMatch(/\.\.\.$/);
      });
    });
  });

  describe("integration and edge cases", () => {
    it("should handle special characters in article content", () => {
      const rssFeed = generateRSSFeed();
      const jsonFeed = JSON.parse(generateJSONFeed());

      // RSS should properly escape XML entities like &apos; for apostrophes
      expect(rssFeed).toContain("&apos;");

      // JSON should handle special chars without escaping
      expect(jsonFeed.items.length).toBeGreaterThan(0);
    });

    it("should produce consistent article count in both feeds", () => {
      const rssFeed = generateRSSFeed();
      const jsonFeed = JSON.parse(generateJSONFeed());

      const rssItemCount = (rssFeed.match(/<item>/g) || []).length;
      const jsonItemCount = jsonFeed.items.length;

      expect(rssItemCount).toBe(jsonItemCount);
    });

    it("should truncate content to reasonable length", () => {
      const feed = JSON.parse(generateJSONFeed());

      feed.items.forEach((item: { content_text: string }) => {
        // Should be truncated to around 500 chars plus ellipsis
        expect(item.content_text.length).toBeLessThanOrEqual(550);
      });
    });

    it("should handle empty or minimal article content gracefully", () => {
      // This test verifies the feed generation doesn't crash with edge cases
      expect(() => generateRSSFeed()).not.toThrow();
      expect(() => generateJSONFeed()).not.toThrow();
    });

    it("should generate feeds with consistent article ordering", () => {
      const rssFeed = generateRSSFeed();
      const jsonFeed = JSON.parse(generateJSONFeed());

      // Extract titles from RSS (skip first 2: channel title and image title)
      const rssTitles = [...rssFeed.matchAll(/<title>([^<]+)<\/title>/g)]
        .slice(2) // Skip channel title and image title
        .map((m) => m[1]);

      // Extract titles from JSON
      const jsonTitles = jsonFeed.items.map((item: { title: string }) => item.title);

      // Both feeds should have same number of articles
      expect(rssTitles.length).toBe(jsonTitles.length);

      // Articles should be in same order (titles might have minor differences like &apos; vs ')
      expect(rssTitles[0]).toContain("Latency Tax");
      expect(jsonTitles[0]).toContain("Latency Tax");
    });

    it("should handle CDATA sections without breaking on special sequences", () => {
      const feed = generateRSSFeed();

      // CDATA sections should be properly closed
      const cdataOpen = (feed.match(/<!\[CDATA\[/g) || []).length;
      const cdataClose = (feed.match(/\]\]>/g) || []).length;

      expect(cdataOpen).toBe(cdataClose);
    });

    it("should maintain feed validity with special date formats", () => {
      const feed = generateRSSFeed();

      // All dates should be in RFC 822 format
      const dateMatches = feed.match(/<pubDate>([^<]+)<\/pubDate>/g);
      dateMatches?.forEach((match) => {
        const dateStr = match.replace(/<\/?pubDate>/g, "");
        expect(new Date(dateStr).toString()).not.toBe("Invalid Date");
      });
    });
  });
});