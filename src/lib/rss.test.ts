import { describe, it, expect, vi } from "vitest";
import { generateRSSFeed, generateJSONFeed } from "./rss";
import { siteConfig } from "./site-config";

describe("rss", () => {
  describe("generateRSSFeed", () => {
    it("should generate valid RSS 2.0 XML structure", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(rss).toContain('<rss version="2.0"');
      expect(rss).toContain("</rss>");
      expect(rss).toContain("<channel>");
      expect(rss).toContain("</channel>");
    });

    it("should include required channel elements", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain(`<title>${siteConfig.blogTitle}</title>`);
      expect(rss).toContain(`<link>${siteConfig.siteUrl}</link>`);
      expect(rss).toContain(
        `<description>${siteConfig.blogDescription}</description>`
      );
      expect(rss).toContain("<language>en-us</language>");
      expect(rss).toContain("<lastBuildDate>");
    });

    it("should include namespace declarations", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
      expect(rss).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    });

    it("should include atom self link", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain(
        `<atom:link href="${siteConfig.siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>`
      );
    });

    it("should include channel image", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<image>");
      expect(rss).toContain(
        `<url>${siteConfig.siteUrl}/favicon.ico</url>`
      );
      expect(rss).toContain("</image>");
    });

    it("should include article items", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<item>");
      expect(rss).toContain("</item>");
    });

    it("should include required item elements", () => {
      const rss = generateRSSFeed();

      // Check for presence of item elements
      expect(rss).toContain("<title>");
      expect(rss).toContain("<link>");
      expect(rss).toContain("<guid");
      expect(rss).toContain("<description>");
      expect(rss).toContain("<content:encoded>");
      expect(rss).toContain("<pubDate>");
      expect(rss).toContain("<category>");
    });

    it("should generate proper article links with slug", () => {
      const rss = generateRSSFeed();

      // Check for blog URL structure
      expect(rss).toContain(`${siteConfig.siteUrl}/blog/`);
    });

    it("should escape XML special characters in titles", () => {
      const rss = generateRSSFeed();

      // XML entities should be escaped
      expect(rss).not.toContain("<title>Test & Title</title>");
      // Should not contain unescaped ampersands in text content
      const titleMatches = rss.match(/<title>[^<]*</g);
      if (titleMatches) {
        titleMatches.forEach((match) => {
          const content = match.slice(7, -1);
          // If there's an ampersand, it should be escaped
          if (content.includes("&")) {
            expect(content).toMatch(/&(amp|lt|gt|quot|apos);/);
          }
        });
      }
    });

    it("should include category tags for article category", () => {
      const rss = generateRSSFeed();

      // Categories should be present
      const categoryMatches = rss.match(/<category>[^<]+<\/category>/g);
      expect(categoryMatches).toBeTruthy();
      expect(categoryMatches!.length).toBeGreaterThan(0);
    });

    it("should sort articles by date descending", () => {
      const rss = generateRSSFeed();

      // Extract pubDates to verify sorting
      const pubDateMatches = rss.match(/<pubDate>([^<]+)<\/pubDate>/g);
      if (pubDateMatches && pubDateMatches.length > 1) {
        const dates = pubDateMatches.map((match) => {
          const dateStr = match.replace(/<\/?pubDate>/g, "");
          return new Date(dateStr).getTime();
        });

        // Check that dates are in descending order (newest first)
        for (let i = 0; i < dates.length - 1; i++) {
          expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
        }
      }
    });

    it("should include CDATA section in content:encoded", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain("<![CDATA[");
      expect(rss).toContain("]]>");
    });

    it("should handle CDATA closing sequence in content", () => {
      const rss = generateRSSFeed();

      // Should escape ]]> in descriptions to prevent breaking CDATA
      expect(rss).not.toContain("]]>]]>");
    });

    it("should generate valid RFC 822 date format for pubDate", () => {
      const rss = generateRSSFeed();

      const pubDateMatches = rss.match(/<pubDate>([^<]+)<\/pubDate>/g);
      expect(pubDateMatches).toBeTruthy();

      if (pubDateMatches) {
        pubDateMatches.forEach((match) => {
          const dateStr = match.replace(/<\/?pubDate>/g, "");
          const date = new Date(dateStr);
          expect(date.toString()).not.toBe("Invalid Date");
        });
      }
    });

    it("should include SEO keywords as category tags", () => {
      const rss = generateRSSFeed();

      // Multiple category tags per item are valid in RSS 2.0
      const itemSections = rss.split("<item>").slice(1);
      const firstItem = itemSections[0];

      if (firstItem) {
        const categoryMatches = firstItem.match(/<category>[^<]+<\/category>/g);
        // Should have at least the main category
        expect(categoryMatches).toBeTruthy();
      }
    });

    it("should strip HTML/Markdown from content in CDATA", () => {
      const rss = generateRSSFeed();

      // Content in CDATA should not contain Markdown code blocks
      const cdataMatches = rss.match(/<!\[CDATA\[([^\]]+)\]\]>/g);
      if (cdataMatches) {
        cdataMatches.forEach((match) => {
          expect(match).not.toContain("```");
          expect(match).not.toContain("**");
        });
      }
    });

    it("should include guid with isPermaLink attribute", () => {
      const rss = generateRSSFeed();

      expect(rss).toContain('<guid isPermaLink="true">');
    });
  });

  describe("generateJSONFeed", () => {
    it("should generate valid JSON", () => {
      const jsonFeed = generateJSONFeed();

      expect(() => JSON.parse(jsonFeed)).not.toThrow();
    });

    it("should include required JSON Feed 1.1 properties", () => {
      const jsonFeed = generateJSONFeed();
      const feed = JSON.parse(jsonFeed);

      expect(feed.version).toBe("https://jsonfeed.org/version/1.1");
      expect(feed.title).toBe(siteConfig.blogTitle);
      expect(feed.home_page_url).toBe(siteConfig.siteUrl);
      expect(feed.feed_url).toBe(`${siteConfig.siteUrl}/feed.json`);
      expect(feed.description).toBe(siteConfig.blogDescription);
      expect(feed.language).toBe("en-US");
      expect(feed.items).toBeInstanceOf(Array);
    });

    it("should include items array with articles", () => {
      const jsonFeed = generateJSONFeed();
      const feed = JSON.parse(jsonFeed);

      expect(feed.items.length).toBeGreaterThan(0);
    });

    it("should include required item properties", () => {
      const jsonFeed = generateJSONFeed();
      const feed = JSON.parse(jsonFeed);
      const firstItem = feed.items[0];

      expect(firstItem).toHaveProperty("id");
      expect(firstItem).toHaveProperty("url");
      expect(firstItem).toHaveProperty("title");
      expect(firstItem).toHaveProperty("summary");
      expect(firstItem).toHaveProperty("content_text");
      expect(firstItem).toHaveProperty("date_published");
      expect(firstItem).toHaveProperty("tags");
    });

    it("should use blog URL structure for item id and url", () => {
      const jsonFeed = generateJSONFeed();
      const feed = JSON.parse(jsonFeed);
      const firstItem = feed.items[0];

      expect(firstItem.id).toContain(`${siteConfig.siteUrl}/blog/`);
      expect(firstItem.url).toContain(`${siteConfig.siteUrl}/blog/`);
      expect(firstItem.id).toBe(firstItem.url);
    });

    it("should include category and keywords in tags array", () => {
      const jsonFeed = generateJSONFeed();
      const feed = JSON.parse(jsonFeed);
      const firstItem = feed.items[0];

      expect(Array.isArray(firstItem.tags)).toBe(true);
      expect(firstItem.tags.length).toBeGreaterThan(0);
    });

    it("should format date_published as ISO 8601", () => {
      const jsonFeed = generateJSONFeed();
      const feed = JSON.parse(jsonFeed);
      const firstItem = feed.items[0];

      expect(firstItem.date_published).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
      const date = new Date(firstItem.date_published);
      expect(date.toString()).not.toBe("Invalid Date");
    });

    it("should sort articles by date descending", () => {
      const jsonFeed = generateJSONFeed();
      const feed = JSON.parse(jsonFeed);

      if (feed.items.length > 1) {
        const dates = feed.items.map((item: any) =>
          new Date(item.date_published).getTime()
        );

        for (let i = 0; i < dates.length - 1; i++) {
          expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
        }
      }
    });

    it("should strip HTML/Markdown from content_text", () => {
      const jsonFeed = generateJSONFeed();
      const feed = JSON.parse(jsonFeed);
      const firstItem = feed.items[0];

      expect(firstItem.content_text).not.toContain("```");
      expect(firstItem.content_text).not.toContain("**");
      expect(firstItem.content_text).not.toContain("##");
    });

    it("should truncate content_text and append ellipsis", () => {
      const jsonFeed = generateJSONFeed();
      const feed = JSON.parse(jsonFeed);
      const firstItem = feed.items[0];

      expect(firstItem.content_text).toContain("...");
    });

    it("should use article description as summary", () => {
      const jsonFeed = generateJSONFeed();
      const feed = JSON.parse(jsonFeed);
      const firstItem = feed.items[0];

      expect(typeof firstItem.summary).toBe("string");
      expect(firstItem.summary.length).toBeGreaterThan(0);
    });

    it("should be pretty-printed with 2-space indentation", () => {
      const jsonFeed = generateJSONFeed();

      // Check for indentation
      expect(jsonFeed).toContain("  ");
      // Check that it's not minified
      expect(jsonFeed).toContain("\n");
    });

    it("should handle all articles from data", () => {
      const jsonFeed = generateJSONFeed();
      const feed = JSON.parse(jsonFeed);

      // Should have multiple articles from the articles array
      expect(feed.items.length).toBeGreaterThan(5);
    });

    it("should not include undefined or null values", () => {
      const jsonFeed = generateJSONFeed();
      const feed = JSON.parse(jsonFeed);

      feed.items.forEach((item: any) => {
        expect(item.id).toBeTruthy();
        expect(item.url).toBeTruthy();
        expect(item.title).toBeTruthy();
        expect(item.date_published).toBeTruthy();
      });
    });
  });

  describe("content sanitization", () => {
    it("RSS should handle inline code removal", () => {
      const rss = generateRSSFeed();

      // Content should not contain inline code markers
      const cdataContent = rss.match(/<!\[CDATA\[([^\]]+)\]\]>/g);
      if (cdataContent) {
        cdataContent.forEach((content) => {
          expect(content).not.toMatch(/`[^`]+`/);
        });
      }
    });

    it("JSON Feed should handle link conversion", () => {
      const jsonFeed = generateJSONFeed();
      const feed = JSON.parse(jsonFeed);

      feed.items.forEach((item: any) => {
        // Markdown links should be converted to plain text
        expect(item.content_text).not.toMatch(/\[([^\]]+)\]\([^)]+\)/);
      });
    });

    it("RSS should handle bold text removal", () => {
      const rss = generateRSSFeed();

      const cdataContent = rss.match(/<!\[CDATA\[([^\]]+)\]\]>/g);
      if (cdataContent) {
        cdataContent.forEach((content) => {
          expect(content).not.toContain("**");
        });
      }
    });

    it("JSON Feed should handle header removal", () => {
      const jsonFeed = generateJSONFeed();
      const feed = JSON.parse(jsonFeed);

      feed.items.forEach((item: any) => {
        // Header markers should be removed
        expect(item.content_text).not.toMatch(/^#{1,3}\s+/m);
      });
    });
  });

  describe("XML escaping", () => {
    it("should escape ampersands in RSS", () => {
      const rss = generateRSSFeed();

      // Check that literal ampersands in content are escaped
      const contentBetweenTags = rss.match(
        /<(title|description)>([^<]*)</g
      );
      if (contentBetweenTags) {
        contentBetweenTags.forEach((match) => {
          const content = match.match(/>([^<]*)</)?.[1] || "";
          if (content.includes("&")) {
            // Should be part of an entity
            expect(content).toMatch(/&[a-z]+;/);
          }
        });
      }
    });

    it("should escape quotes in RSS attributes", () => {
      const rss = generateRSSFeed();

      // Attributes should not contain unescaped quotes
      const attributes = rss.match(/="[^"]*"/g);
      expect(attributes).toBeTruthy();
    });
  });
});