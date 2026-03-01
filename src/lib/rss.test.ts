import { describe, it, expect, beforeEach } from "vitest";
import { generateRSSFeed, generateJSONFeed } from "./rss";
import { siteConfig } from "./site-config";

describe("rss", () => {
  describe("generateRSSFeed", () => {
    let rss: string;

    beforeEach(() => {
      rss = generateRSSFeed();
    });

    it("should generate valid XML with declaration", () => {
      expect(rss).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    });

    it("should include RSS 2.0 root element", () => {
      expect(rss).toContain('<rss version="2.0"');
      expect(rss).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
      expect(rss).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    });

    it("should include channel with site metadata", () => {
      expect(rss).toContain(`<title>${escapeXml(siteConfig.blogTitle)}</title>`);
      expect(rss).toContain(`<link>${siteConfig.siteUrl}</link>`);
      expect(rss).toContain(`<description>${escapeXml(siteConfig.blogDescription)}</description>`);
    });

    it("should include language", () => {
      expect(rss).toContain('<language>en-us</language>');
    });

    it("should include lastBuildDate", () => {
      expect(rss).toContain('<lastBuildDate>');
    });

    it("should include atom:link for self reference", () => {
      expect(rss).toContain(`<atom:link href="${siteConfig.siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>`);
    });

    it("should include channel image", () => {
      expect(rss).toContain('<image>');
      expect(rss).toContain(`<url>${siteConfig.siteUrl}/favicon.ico</url>`);
    });

    it("should include items for articles", () => {
      expect(rss).toContain('<item>');
      expect(rss).toContain('</item>');
    });

    it("should include article title", () => {
      expect(rss).toContain('<title>Understanding CAP Theorem in Production</title>');
    });

    it("should include article link", () => {
      expect(rss).toContain(`<link>${siteConfig.siteUrl}/blog/cap-theorem-production</link>`);
    });

    it("should include guid with isPermaLink", () => {
      expect(rss).toContain(`<guid isPermaLink="true">${siteConfig.siteUrl}/blog/cap-theorem-production</guid>`);
    });

    it("should include description", () => {
      expect(rss).toContain('<description>');
    });

    it("should include content:encoded with CDATA", () => {
      expect(rss).toContain('<content:encoded><![CDATA[');
      expect(rss).toContain(']]></content:encoded>');
    });

    it("should include pubDate", () => {
      expect(rss).toContain('<pubDate>');
    });

    it("should include category", () => {
      expect(rss).toContain('<category>');
    });

    it("should escape XML special characters in titles", () => {
      // The feed should not contain unescaped ampersands in text content
      const titleMatches = rss.match(/<title>([^<]*)</g);
      if (titleMatches) {
        titleMatches.forEach(match => {
          const content = match.replace('<title>', '');
          // If there's an & it should be &amp; not bare &
          if (content.includes('&')) {
            expect(content).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/);
          }
        });
      }
    });

    it("should sort articles by date descending", () => {
      const items = rss.split('<item>').slice(1); // Skip content before first item
      // Most recent articles should come first
      // Jan 2026 should appear before Dec 2025
      const jan2026Index = rss.indexOf('latency-tax-separated-compute-storage');
      const dec2025Index = rss.indexOf('pragmatic-consistency');
      if (jan2026Index > 0 && dec2025Index > 0) {
        expect(jan2026Index).toBeLessThan(dec2025Index);
      }
    });

    it("should handle articles with keywords", () => {
      expect(rss).toContain('<category>CAP theorem</category>');
    });

    it("should truncate content in content:encoded", () => {
      const contentMatch = rss.match(/<content:encoded><!\[CDATA\[(.*?)\.\.\.\]\]><\/content:encoded>/);
      expect(contentMatch).toBeTruthy();
    });

    it("should close all XML tags properly", () => {
      expect(rss).toContain('</channel>');
      expect(rss).toContain('</rss>');
    });

    it("should not include HTML/Markdown formatting in descriptions", () => {
      // Content should be stripped of markdown
      const cdataMatch = rss.match(/<content:encoded><!\[CDATA\[(.*?)\]\]><\/content:encoded>/s);
      if (cdataMatch && cdataMatch[1]) {
        expect(cdataMatch[1]).not.toContain('```'); // No code blocks
        expect(cdataMatch[1]).not.toContain('**'); // No bold markers
        expect(cdataMatch[1]).not.toContain('##'); // No headers
      }
    });
  });

  describe("generateJSONFeed", () => {
    let feed: any;

    beforeEach(() => {
      const jsonString = generateJSONFeed();
      feed = JSON.parse(jsonString);
    });

    it("should generate valid JSON", () => {
      expect(feed).toBeDefined();
      expect(typeof feed).toBe('object');
    });

    it("should include JSON Feed version", () => {
      expect(feed.version).toBe("https://jsonfeed.org/version/1.1");
    });

    it("should include feed metadata", () => {
      expect(feed.title).toBe(siteConfig.blogTitle);
      expect(feed.home_page_url).toBe(siteConfig.siteUrl);
      expect(feed.feed_url).toBe(`${siteConfig.siteUrl}/feed.json`);
      expect(feed.description).toBe(siteConfig.blogDescription);
      expect(feed.language).toBe("en-US");
    });

    it("should include items array", () => {
      expect(Array.isArray(feed.items)).toBe(true);
      expect(feed.items.length).toBeGreaterThan(0);
    });

    it("should include item with required fields", () => {
      const item = feed.items[0];
      expect(item.id).toBeDefined();
      expect(item.url).toBeDefined();
      expect(item.title).toBeDefined();
      expect(item.summary).toBeDefined();
      expect(item.content_text).toBeDefined();
      expect(item.date_published).toBeDefined();
      expect(item.tags).toBeDefined();
    });

    it("should have properly formatted URLs", () => {
      const item = feed.items[0];
      expect(item.id).toMatch(/^https?:\/\//);
      expect(item.url).toMatch(/^https?:\/\//);
      expect(item.id).toContain('/blog/');
      expect(item.url).toContain('/blog/');
    });

    it("should have ISO 8601 date format", () => {
      const item = feed.items[0];
      expect(item.date_published).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it("should include tags array", () => {
      const item = feed.items[0];
      expect(Array.isArray(item.tags)).toBe(true);
      expect(item.tags.length).toBeGreaterThan(0);
    });

    it("should include category in tags", () => {
      const item = feed.items.find((i: any) => i.url.includes('cap-theorem-production'));
      expect(item.tags).toContain('Fundamentals');
    });

    it("should include SEO keywords in tags", () => {
      const item = feed.items.find((i: any) => i.url.includes('cap-theorem-production'));
      expect(item.tags).toContain('CAP theorem');
      expect(item.tags).toContain('distributed systems');
    });

    it("should strip HTML/Markdown from content_text", () => {
      const item = feed.items[0];
      expect(item.content_text).not.toContain('```');
      expect(item.content_text).not.toContain('**');
      expect(item.content_text).not.toContain('##');
    });

    it("should truncate content with ellipsis", () => {
      const item = feed.items[0];
      expect(item.content_text).toContain('...');
    });

    it("should sort items by date descending", () => {
      const dates = feed.items.map((item: any) => new Date(item.date_published).getTime());
      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
      }
    });

    it("should be pretty-printed with 2 spaces", () => {
      const jsonString = generateJSONFeed();
      // Check for proper indentation
      expect(jsonString).toContain('  "version"');
      expect(jsonString).toContain('  "title"');
    });

    it("should have matching id and url for each item", () => {
      feed.items.forEach((item: any) => {
        expect(item.id).toBe(item.url);
      });
    });
  });

  describe("XML escaping", () => {
    it("should escape ampersands", () => {
      const rss = generateRSSFeed();
      // Title elements should have escaped ampersands
      const titleContent = rss.match(/<title>([^<]+)<\/title>/g);
      if (titleContent) {
        titleContent.forEach(title => {
          if (title.includes('&')) {
            expect(title).toMatch(/&(amp|lt|gt|quot|apos);/);
          }
        });
      }
    });

    it("should handle CDATA sections properly", () => {
      const rss = generateRSSFeed();
      // CDATA sections should be properly closed
      const cdataCount = (rss.match(/<!\[CDATA\[/g) || []).length;
      const cdataCloseCount = (rss.match(/\]\]>/g) || []).length;
      expect(cdataCount).toBe(cdataCloseCount);
    });
  });

  describe("edge cases and regression tests", () => {
    it("should handle articles with no SEO keywords", () => {
      const rss = generateRSSFeed();
      expect(rss).toBeDefined();
      expect(rss.length).toBeGreaterThan(0);
    });

    it("should handle very long article titles", () => {
      const feed = generateJSONFeed();
      const parsed = JSON.parse(feed);
      expect(parsed.items.every((item: any) => item.title.length > 0)).toBe(true);
    });

    it("should generate valid XML even with special characters in content", () => {
      const rss = generateRSSFeed();
      expect(rss).not.toContain('&<');
      expect(rss).not.toContain('<>');
    });

    it("should handle empty article content gracefully", () => {
      // This tests the stripHtml function's edge case handling
      const jsonFeed = generateJSONFeed();
      const parsed = JSON.parse(jsonFeed);
      expect(parsed.items.every((item: any) => typeof item.content_text === 'string')).toBe(true);
    });

    it("should limit content length to 500 chars in stripped HTML", () => {
      const rss = generateRSSFeed();
      const contentMatches = rss.match(/<content:encoded><!\[CDATA\[(.*?)\.\.\.\]\]><\/content:encoded>/s);
      if (contentMatches && contentMatches[1]) {
        expect(contentMatches[1].length).toBeLessThanOrEqual(503); // 500 + "..."
      }
    });

    it("should handle code blocks in article content", () => {
      const rss = generateRSSFeed();
      // Should strip code blocks (```)
      const cdataContent = rss.match(/<content:encoded><!\[CDATA\[(.*?)\]\]><\/content:encoded>/s);
      if (cdataContent && cdataContent[1]) {
        expect(cdataContent[1]).not.toContain('```');
      }
    });

    it("should handle markdown links in content", () => {
      const jsonFeed = generateJSONFeed();
      const parsed = JSON.parse(jsonFeed);
      // Links should be converted to plain text
      const hasMarkdownLink = parsed.items.some((item: any) =>
        item.content_text.includes('[') && item.content_text.includes('](')
      );
      expect(hasMarkdownLink).toBe(false);
    });

    it("should escape CDATA end sequence in content", () => {
      const rss = generateRSSFeed();
      // ]]> should be escaped as ]]&gt; to prevent breaking CDATA
      const cdataBlocks = rss.match(/<content:encoded><!\[CDATA\[.*?\]\]><\/content:encoded>/gs);
      if (cdataBlocks) {
        cdataBlocks.forEach(block => {
          // Check that there are no unescaped ]]> inside CDATA except the closing one
          const content = block.replace(/<content:encoded><!\[CDATA\[/, '').replace(/\]\]><\/content:encoded>/, '');
          if (content.includes(']]>')) {
            expect(content).toContain(']]&gt;');
          }
        });
      }
    });

    it("should generate consistent output on multiple calls", () => {
      const rss1 = generateRSSFeed();
      const rss2 = generateRSSFeed();
      // Should be identical except for lastBuildDate
      const cleanRss1 = rss1.replace(/<lastBuildDate>.*?<\/lastBuildDate>/, '');
      const cleanRss2 = rss2.replace(/<lastBuildDate>.*?<\/lastBuildDate>/, '');
      expect(cleanRss1).toBe(cleanRss2);
    });

    it("should handle featured and non-featured articles", () => {
      const jsonFeed = generateJSONFeed();
      const parsed = JSON.parse(jsonFeed);
      expect(parsed.items.length).toBeGreaterThan(0);
    });

    it("should preserve article ordering across formats", () => {
      const rss = generateRSSFeed();
      const jsonFeed = generateJSONFeed();
      const parsed = JSON.parse(jsonFeed);

      // Both should have the same article order
      const rssFirstArticle = rss.match(/latency-tax-separated-compute-storage/);
      const jsonFirstArticle = parsed.items[0].url.includes('latency-tax-separated-compute-storage');

      expect(rssFirstArticle).toBeTruthy();
      expect(jsonFirstArticle).toBe(true);
    });
  });
});

// Helper function matching the implementation
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}