import { describe, it, expect } from "vitest";
import { generateRSSFeed, generateJSONFeed } from "./rss";

describe("rss", () => {
  describe("generateRSSFeed", () => {
    it("should generate valid RSS 2.0 XML", () => {
      const feed = generateRSSFeed();

      expect(feed).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(feed).toContain('<rss version="2.0"');
      expect(feed).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
      expect(feed).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    });

    it("should include channel metadata", () => {
      const feed = generateRSSFeed();

      expect(feed).toContain("<channel>");
      expect(feed).toContain("<title>Shahid Moosa - Distributed Systems Engineering</title>");
      expect(feed).toContain("<link>https://shahidster.tech</link>");
      expect(feed).toContain("<description>Deep dives into distributed databases");
      expect(feed).toContain("<language>en-us</language>");
      expect(feed).toContain("<lastBuildDate>");
    });

    it("should include atom:link self-reference", () => {
      const feed = generateRSSFeed();

      expect(feed).toContain('<atom:link href="https://shahidster.tech/rss.xml" rel="self" type="application/rss+xml"/>');
    });

    it("should include channel image", () => {
      const feed = generateRSSFeed();

      expect(feed).toContain("<image>");
      expect(feed).toContain("<url>https://shahidster.tech/favicon.ico</url>");
    });

    it("should include article items", () => {
      const feed = generateRSSFeed();

      // Should have items from articles
      expect(feed).toContain("<item>");
      expect(feed).toContain("<title>");
      expect(feed).toContain("<link>");
      expect(feed).toContain("<guid");
      expect(feed).toContain("<description>");
      expect(feed).toContain("<pubDate>");
      expect(feed).toContain("<category>");
    });

    it("should escape XML special characters in titles", () => {
      const feed = generateRSSFeed();

      // Check that ampersands are escaped if they exist
      expect(feed).not.toMatch(/<title>[^<]*&[^a&][^<]*<\/title>/);
      // Feed should be valid XML (no unescaped special chars)
      expect(feed).toContain("<title>");
    });

    it("should include article URLs with blog slug", () => {
      const feed = generateRSSFeed();

      expect(feed).toContain("https://shahidster.tech/blog/");
    });

    it("should include content:encoded for article content", () => {
      const feed = generateRSSFeed();

      expect(feed).toContain("<content:encoded>");
      expect(feed).toContain("<![CDATA[");
      expect(feed).toContain("]]></content:encoded>");
    });

    it("should include article categories", () => {
      const feed = generateRSSFeed();

      // Articles should have categories
      expect(feed).toMatch(/<category>.*<\/category>/);
    });

    it("should include SEO keywords as categories", () => {
      const feed = generateRSSFeed();

      // Check for keywords from articles
      expect(feed).toContain("CAP theorem");
      expect(feed).toContain("distributed systems");
    });

    it("should sort articles by date descending", () => {
      const feed = generateRSSFeed();

      // Most recent articles should appear first
      // Jan 2026 articles should come before 2025 articles
      const latencyTaxPos = feed.indexOf("The Latency Tax");
      const capTheoremPos = feed.indexOf("Understanding CAP Theorem");

      expect(latencyTaxPos).toBeGreaterThan(0);
      expect(capTheoremPos).toBeGreaterThan(0);
      expect(latencyTaxPos).toBeLessThan(capTheoremPos);
    });

    it("should have valid pubDate format", () => {
      const feed = generateRSSFeed();

      // Should match RFC 822 date format (e.g., "Mon, 01 Jan 2024 00:00:00 GMT")
      expect(feed).toMatch(/<pubDate>[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4}/);
    });

    it("should strip HTML from content", () => {
      const feed = generateRSSFeed();

      // Content should not contain markdown formatting
      expect(feed).not.toContain("```");
      expect(feed).not.toContain("##");
    });

    it("should truncate content to reasonable length", () => {
      const feed = generateRSSFeed();

      // Content should be truncated (max 500 chars in stripHtml)
      const contentMatches = feed.match(/<content:encoded><!\[CDATA\[(.*?)\.\.\.\]\]><\/content:encoded>/gs);

      if (contentMatches) {
        contentMatches.forEach(match => {
          const content = match.replace(/<content:encoded><!\[CDATA\[/, "").replace(/\.\.\.\]\]><\/content:encoded>/, "");
          expect(content.length).toBeLessThanOrEqual(500);
        });
      }
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

    it("should include correct feed metadata", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(feed.title).toBe("Shahid Moosa - Distributed Systems Engineering");
      expect(feed.home_page_url).toBe("https://shahidster.tech");
      expect(feed.feed_url).toBe("https://shahidster.tech/feed.json");
      expect(feed.description).toContain("Deep dives into distributed databases");
      expect(feed.language).toBe("en-US");
    });

    it("should include all articles as items", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(feed.items.length).toBeGreaterThan(0);
      expect(feed.items.length).toBe(9); // We have 9 articles in the data
    });

    it("should have required item fields", () => {
      const feed = JSON.parse(generateJSONFeed());

      feed.items.forEach((item: any) => {
        expect(item.id).toBeDefined();
        expect(item.url).toBeDefined();
        expect(item.title).toBeDefined();
        expect(item.summary).toBeDefined();
        expect(item.content_text).toBeDefined();
        expect(item.date_published).toBeDefined();
        expect(item.tags).toBeInstanceOf(Array);
      });
    });

    it("should format item URLs correctly", () => {
      const feed = JSON.parse(generateJSONFeed());

      feed.items.forEach((item: any) => {
        expect(item.id).toMatch(/^https:\/\/shahidster\.tech\/blog\//);
        expect(item.url).toMatch(/^https:\/\/shahidster\.tech\/blog\//);
        expect(item.id).toBe(item.url); // id and url should be the same
      });
    });

    it("should include ISO 8601 formatted dates", () => {
      const feed = JSON.parse(generateJSONFeed());

      feed.items.forEach((item: any) => {
        expect(item.date_published).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(new Date(item.date_published)).toBeInstanceOf(Date);
      });
    });

    it("should include category and keywords as tags", () => {
      const feed = JSON.parse(generateJSONFeed());

      feed.items.forEach((item: any) => {
        expect(item.tags.length).toBeGreaterThan(0);
        // First tag should be the category
        expect(typeof item.tags[0]).toBe("string");
      });
    });

    it("should strip markdown from content_text", () => {
      const feed = JSON.parse(generateJSONFeed());

      feed.items.forEach((item: any) => {
        expect(item.content_text).not.toContain("```");
        expect(item.content_text).not.toContain("##");
        expect(item.content_text).not.toContain("**");
      });
    });

    it("should truncate content_text", () => {
      const feed = JSON.parse(generateJSONFeed());

      feed.items.forEach((item: any) => {
        // Content should end with "..."
        expect(item.content_text).toMatch(/\.\.\.$/);
      });
    });

    it("should be pretty-printed with 2-space indentation", () => {
      const feed = generateJSONFeed();

      expect(feed).toContain("\n  ");
      expect(feed).not.toContain("\n    \n"); // No unnecessary whitespace
    });

    it("should handle special characters in article content", () => {
      const feed = JSON.parse(generateJSONFeed());

      // JSON should properly encode special characters
      expect(() => {
        feed.items.forEach((item: any) => {
          expect(typeof item.title).toBe("string");
          expect(typeof item.summary).toBe("string");
        });
      }).not.toThrow();
    });
  });

  describe("edge cases", () => {
    it("RSS feed should handle empty SEO keywords", () => {
      const feed = generateRSSFeed();

      // Should not throw and should still be valid XML
      expect(feed).toContain("<?xml");
      expect(feed).toContain("</rss>");
    });

    it("JSON feed should handle all article properties", () => {
      const feed = JSON.parse(generateJSONFeed());

      const capTheorem = feed.items.find((item: any) =>
        item.url.includes("cap-theorem-production")
      );

      expect(capTheorem).toBeDefined();
      expect(capTheorem.tags).toContain("Fundamentals");
      expect(capTheorem.tags).toContain("CAP theorem");
    });

    it("should not break on articles with special characters", () => {
      expect(() => generateRSSFeed()).not.toThrow();
      expect(() => generateJSONFeed()).not.toThrow();
    });
  });
});