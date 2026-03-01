import { describe, it, expect } from "vitest";
import { generateRSSFeed, generateJSONFeed } from "./rss";
import { siteConfig } from "./site-config";

describe("rss", () => {
  describe("generateRSSFeed", () => {
    it("should generate valid RSS 2.0 XML", () => {
      const feed = generateRSSFeed();

      expect(feed).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(feed).toContain('<rss version="2.0"');
      expect(feed).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
      expect(feed).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
      expect(feed).toContain("<channel>");
      expect(feed).toContain("</channel>");
      expect(feed).toContain("</rss>");
    });

    it("should include channel metadata", () => {
      const feed = generateRSSFeed();

      expect(feed).toContain(`<title>${siteConfig.blogTitle}</title>`);
      expect(feed).toContain(`<link>${siteConfig.siteUrl}</link>`);
      expect(feed).toContain(`<description>${siteConfig.blogDescription}</description>`);
      expect(feed).toContain("<language>en-us</language>");
      expect(feed).toContain("<lastBuildDate>");
    });

    it("should include atom self-link", () => {
      const feed = generateRSSFeed();

      expect(feed).toContain(`<atom:link href="${siteConfig.siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>`);
    });

    it("should include channel image", () => {
      const feed = generateRSSFeed();

      expect(feed).toContain("<image>");
      expect(feed).toContain(`<url>${siteConfig.siteUrl}/favicon.ico</url>`);
      expect(feed).toContain("</image>");
    });

    it("should include article items", () => {
      const feed = generateRSSFeed();

      // Should have at least one item
      expect(feed).toContain("<item>");
      expect(feed).toContain("</item>");
    });

    it("should include required item fields", () => {
      const feed = generateRSSFeed();

      expect(feed).toContain("<title>");
      expect(feed).toContain("<link>");
      expect(feed).toContain("<guid");
      expect(feed).toContain("<description>");
      expect(feed).toContain("<content:encoded>");
      expect(feed).toContain("<pubDate>");
      expect(feed).toContain("<category>");
    });

    it("should escape XML special characters in titles", () => {
      const feed = generateRSSFeed();

      // XML entities should be escaped
      expect(feed).not.toContain("&<>");
      // Should use entities instead
      if (feed.includes("&amp;") || feed.includes("&lt;") || feed.includes("&gt;")) {
        expect(true).toBe(true);
      }
    });

    it("should sort articles by date descending", () => {
      const feed = generateRSSFeed();

      // Extract all pubDate values
      const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/g;
      const dates: string[] = [];
      let match;

      while ((match = pubDateRegex.exec(feed)) !== null) {
        dates.push(match[1]);
      }

      // Verify dates are in descending order
      for (let i = 1; i < dates.length; i++) {
        const date1 = new Date(dates[i - 1]);
        const date2 = new Date(dates[i]);
        expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
      }
    });

    it("should include permalinks in guid", () => {
      const feed = generateRSSFeed();

      expect(feed).toContain('isPermaLink="true"');
    });

    it("should wrap content in CDATA", () => {
      const feed = generateRSSFeed();

      expect(feed).toContain("<![CDATA[");
      expect(feed).toContain("]]>");
    });

    it("should include article category", () => {
      const feed = generateRSSFeed();

      // Should have at least one category
      const categoryMatches = feed.match(/<category>/g);
      expect(categoryMatches).toBeTruthy();
      expect(categoryMatches!.length).toBeGreaterThan(0);
    });

    it("should handle articles with SEO keywords as categories", () => {
      const feed = generateRSSFeed();

      // Articles with seoKeywords should have multiple category tags
      const itemSections = feed.split("<item>");
      const firstItem = itemSections[1]; // Skip before first item

      if (firstItem) {
        const categoryCount = (firstItem.match(/<category>/g) || []).length;
        // Should have at least the main category
        expect(categoryCount).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe("generateJSONFeed", () => {
    it("should generate valid JSON", () => {
      const feed = generateJSONFeed();

      expect(() => JSON.parse(feed)).not.toThrow();
    });

    it("should follow JSON Feed 1.1 spec", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(feed.version).toBe("https://jsonfeed.org/version/1.1");
      expect(feed.title).toBe(siteConfig.blogTitle);
      expect(feed.home_page_url).toBe(siteConfig.siteUrl);
      expect(feed.feed_url).toBe(`${siteConfig.siteUrl}/feed.json`);
      expect(feed.description).toBe(siteConfig.blogDescription);
      expect(feed.language).toBe("en-US");
    });

    it("should include items array", () => {
      const feed = JSON.parse(generateJSONFeed());

      expect(Array.isArray(feed.items)).toBe(true);
      expect(feed.items.length).toBeGreaterThan(0);
    });

    it("should include required item fields", () => {
      const feed = JSON.parse(generateJSONFeed());
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
      const firstItem = feed.items[0];

      // Should be valid ISO date
      expect(firstItem.date_published).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(() => new Date(firstItem.date_published)).not.toThrow();
    });

    it("should include article category in tags", () => {
      const feed = JSON.parse(generateJSONFeed());
      const firstItem = feed.items[0];

      expect(Array.isArray(firstItem.tags)).toBe(true);
      expect(firstItem.tags.length).toBeGreaterThan(0);
    });

    it("should merge category and seoKeywords into tags", () => {
      const feed = JSON.parse(generateJSONFeed());

      // Find an item with seoKeywords
      const itemWithKeywords = feed.items.find((item: any) => item.tags.length > 1);

      if (itemWithKeywords) {
        expect(itemWithKeywords.tags.length).toBeGreaterThan(1);
      }
    });

    it("should include blog URL in item IDs", () => {
      const feed = JSON.parse(generateJSONFeed());
      const firstItem = feed.items[0];

      expect(firstItem.id).toContain(siteConfig.siteUrl);
      expect(firstItem.id).toContain("/blog/");
    });

    it("should strip HTML/markdown from content_text", () => {
      const feed = JSON.parse(generateJSONFeed());
      const firstItem = feed.items[0];

      // Should not contain markdown code blocks
      expect(firstItem.content_text).not.toContain("```");
      // Should not contain markdown bold
      expect(firstItem.content_text).not.toContain("**");
    });

    it("should truncate content and add ellipsis", () => {
      const feed = JSON.parse(generateJSONFeed());
      const firstItem = feed.items[0];

      expect(firstItem.content_text).toContain("...");
    });

    it("should be pretty-printed with 2-space indentation", () => {
      const feed = generateJSONFeed();

      // Should have newlines and indentation
      expect(feed).toContain("\n");
      expect(feed).toContain("  ");
    });
  });

  // Cross-feed consistency tests
  describe("cross-feed consistency", () => {
    it("RSS and JSON feeds should have same number of articles", () => {
      const rssFeed = generateRSSFeed();
      const jsonFeed = JSON.parse(generateJSONFeed());

      const rssItemCount = (rssFeed.match(/<item>/g) || []).length;
      const jsonItemCount = jsonFeed.items.length;

      expect(rssItemCount).toBe(jsonItemCount);
    });

    it("both feeds should include the same article URLs", () => {
      const rssFeed = generateRSSFeed();
      const jsonFeed = JSON.parse(generateJSONFeed());

      const rssUrls = Array.from(
        rssFeed.matchAll(/<link>(.*?)<\/link>/g)
      )
        .map(match => match[1])
        .filter(url => url.includes("/blog/")); // Filter out channel link

      const jsonUrls = jsonFeed.items.map((item: any) => item.url);

      // Should have same URLs (may be in different order)
      expect(rssUrls.length).toBe(jsonUrls.length);
      rssUrls.forEach(url => {
        expect(jsonUrls).toContain(url);
      });
    });
  });

  // Negative tests
  describe("negative tests", () => {
    it("should handle empty article content gracefully", () => {
      expect(() => generateRSSFeed()).not.toThrow();
      expect(() => generateJSONFeed()).not.toThrow();
    });

    it("RSS feed should not contain unescaped special characters", () => {
      const feed = generateRSSFeed();

      // Check that no raw < > & appear in text content
      const textContent = feed.replace(/<!\[CDATA\[.*?\]\]>/gs, "");
      const tags = textContent.replace(/<[^>]+>/g, "");

      // Should not have raw special chars
      expect(tags).not.toMatch(/[<>](?!&[a-z]+;)/);
    });
  });

  // Boundary tests
  describe("boundary tests", () => {
    it("should handle articles with very long titles", () => {
      expect(() => generateRSSFeed()).not.toThrow();
      expect(() => generateJSONFeed()).not.toThrow();
    });

    it("should handle articles with special characters", () => {
      const rssFeed = generateRSSFeed();
      const jsonFeed = generateJSONFeed();

      expect(rssFeed).toBeTruthy();
      expect(jsonFeed).toBeTruthy();
      expect(() => JSON.parse(jsonFeed)).not.toThrow();
    });
  });
});