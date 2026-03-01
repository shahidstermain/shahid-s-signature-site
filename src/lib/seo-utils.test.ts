import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  toAbsoluteUrl,
  buildCanonicalUrl,
  parseArticleDate,
  formatArticleDateIso,
  formatArticleDateOnly,
} from "./seo-utils";
import { siteConfig } from "./site-config";

describe("seo-utils", () => {
  describe("toAbsoluteUrl", () => {
    it("should return URL as-is if already absolute with https", () => {
      const url = "https://example.com/page";
      expect(toAbsoluteUrl(url)).toBe(url);
    });

    it("should return URL as-is if already absolute with http", () => {
      const url = "http://example.com/page";
      expect(toAbsoluteUrl(url)).toBe(url);
    });

    it("should prepend site URL to relative path starting with slash", () => {
      const path = "/blog/test";
      expect(toAbsoluteUrl(path)).toBe(`${siteConfig.siteUrl}/blog/test`);
    });

    it("should prepend site URL and slash to relative path without slash", () => {
      const path = "blog/test";
      expect(toAbsoluteUrl(path)).toBe(`${siteConfig.siteUrl}/blog/test`);
    });

    it("should handle empty string", () => {
      expect(toAbsoluteUrl("")).toBe(`${siteConfig.siteUrl}/`);
    });

    it("should handle root path", () => {
      expect(toAbsoluteUrl("/")).toBe(`${siteConfig.siteUrl}/`);
    });

    it("should handle image paths", () => {
      expect(toAbsoluteUrl("/images/og.png")).toBe(
        `${siteConfig.siteUrl}/images/og.png`
      );
    });
  });

  describe("buildCanonicalUrl", () => {
    it("should return site URL when path is undefined", () => {
      expect(buildCanonicalUrl()).toBe(siteConfig.siteUrl);
    });

    it("should return site URL when path is empty string", () => {
      expect(buildCanonicalUrl("")).toBe(siteConfig.siteUrl);
    });

    it("should build absolute URL for relative path", () => {
      expect(buildCanonicalUrl("/blog/test")).toBe(
        `${siteConfig.siteUrl}/blog/test`
      );
    });

    it("should handle paths without leading slash", () => {
      expect(buildCanonicalUrl("about")).toBe(`${siteConfig.siteUrl}/about`);
    });

    it("should handle absolute URLs", () => {
      const absoluteUrl = "https://other.com/page";
      expect(buildCanonicalUrl(absoluteUrl)).toBe(absoluteUrl);
    });
  });

  describe("parseArticleDate", () => {
    it("should parse valid month and year correctly", () => {
      const date = parseArticleDate("Jan 2024");
      expect(date.getUTCFullYear()).toBe(2024);
      expect(date.getUTCMonth()).toBe(0); // January is 0
      expect(date.getUTCDate()).toBe(1);
    });

    it("should parse all months correctly", () => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      months.forEach((month, index) => {
        const date = parseArticleDate(`${month} 2025`);
        expect(date.getUTCMonth()).toBe(index);
        expect(date.getUTCFullYear()).toBe(2025);
      });
    });

    it("should handle different years", () => {
      expect(parseArticleDate("Jun 2020").getUTCFullYear()).toBe(2020);
      expect(parseArticleDate("Jun 2025").getUTCFullYear()).toBe(2025);
      expect(parseArticleDate("Jun 2030").getUTCFullYear()).toBe(2030);
    });

    it("should return current date for invalid month", () => {
      const result = parseArticleDate("Invalid 2024");
      expect(result).toBeInstanceOf(Date);
      // Should return a valid date (current date as fallback)
    });

    it("should return current date for invalid year", () => {
      const result = parseArticleDate("Jan NotAYear");
      expect(result).toBeInstanceOf(Date);
    });

    it("should return current date for malformed input", () => {
      const result = parseArticleDate("malformed");
      expect(result).toBeInstanceOf(Date);
    });

    it("should return current date for empty string", () => {
      const result = parseArticleDate("");
      expect(result).toBeInstanceOf(Date);
    });

    it("should set day to 1st of month", () => {
      const date = parseArticleDate("Mar 2024");
      expect(date.getUTCDate()).toBe(1);
    });

    it("should handle edge case years", () => {
      expect(parseArticleDate("Jan 1970").getUTCFullYear()).toBe(1970);
      expect(parseArticleDate("Dec 9999").getUTCFullYear()).toBe(9999);
    });
  });

  describe("formatArticleDateIso", () => {
    it("should format date as ISO string", () => {
      const result = formatArticleDateIso("Jan 2024");
      expect(result).toBe("2024-01-01T00:00:00.000Z");
    });

    it("should handle different months", () => {
      expect(formatArticleDateIso("Jun 2025")).toBe("2025-06-01T00:00:00.000Z");
      expect(formatArticleDateIso("Dec 2023")).toBe("2023-12-01T00:00:00.000Z");
    });

    it("should return valid ISO string for invalid input", () => {
      const result = formatArticleDateIso("invalid");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe("formatArticleDateOnly", () => {
    it("should format date as YYYY-MM-DD", () => {
      const result = formatArticleDateOnly("Jan 2024");
      expect(result).toBe("2024-01-01");
    });

    it("should handle different months and years", () => {
      expect(formatArticleDateOnly("Feb 2023")).toBe("2023-02-01");
      expect(formatArticleDateOnly("Dec 2025")).toBe("2025-12-01");
      expect(formatArticleDateOnly("Jul 2020")).toBe("2020-07-01");
    });

    it("should not include time component", () => {
      const result = formatArticleDateOnly("Jun 2024");
      expect(result).not.toContain("T");
      expect(result).not.toContain(":");
    });

    it("should return valid date string for invalid input", () => {
      const result = formatArticleDateOnly("invalid");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should pad single digit months", () => {
      const result = formatArticleDateOnly("Jan 2024");
      expect(result).toBe("2024-01-01");
    });
  });

  describe("edge cases and integration", () => {
    it("should handle round-trip conversion", () => {
      const originalDate = "Mar 2024";
      const parsed = parseArticleDate(originalDate);
      const formatted = formatArticleDateOnly(originalDate);
      const reparsed = new Date(formatted);

      expect(reparsed.getUTCFullYear()).toBe(parsed.getUTCFullYear());
      expect(reparsed.getUTCMonth()).toBe(parsed.getUTCMonth());
    });

    it("should produce consistent results", () => {
      const date = "Jun 2025";
      expect(formatArticleDateIso(date)).toBe(
        parseArticleDate(date).toISOString()
      );
      expect(formatArticleDateOnly(date)).toBe(
        parseArticleDate(date).toISOString().split("T")[0]
      );
    });

    it("should handle URLs with query parameters", () => {
      const url = "/blog/post?id=123&ref=home";
      const absolute = toAbsoluteUrl(url);
      expect(absolute).toBe(`${siteConfig.siteUrl}/blog/post?id=123&ref=home`);
    });

    it("should handle URLs with fragments", () => {
      const url = "/blog/post#section-1";
      const absolute = toAbsoluteUrl(url);
      expect(absolute).toBe(`${siteConfig.siteUrl}/blog/post#section-1`);
    });

    it("should handle absolute URLs from different protocols", () => {
      expect(toAbsoluteUrl("https://example.com")).toBe("https://example.com");
      expect(toAbsoluteUrl("http://example.com")).toBe("http://example.com");
    });

    it("should not double-add leading slash", () => {
      const url1 = toAbsoluteUrl("/path");
      const url2 = toAbsoluteUrl("path");
      expect(url1).toBe(url2);
    });

    it("should handle dates at year boundaries", () => {
      const dec = parseArticleDate("Dec 2024");
      const jan = parseArticleDate("Jan 2025");
      expect(dec.getUTCFullYear()).toBe(2024);
      expect(jan.getUTCFullYear()).toBe(2025);
      expect(dec.getUTCMonth()).toBe(11);
      expect(jan.getUTCMonth()).toBe(0);
    });

    it("should return current date for whitespace-only input", () => {
      const result = parseArticleDate("   ");
      expect(result).toBeInstanceOf(Date);
    });

    it("should handle null-like string inputs gracefully", () => {
      expect(() => parseArticleDate("null")).not.toThrow();
      expect(() => parseArticleDate("undefined")).not.toThrow();
    });

    it("should format all months with zero-padding", () => {
      const dates = [
        "Jan 2024",
        "Feb 2024",
        "Mar 2024",
        "Apr 2024",
        "May 2024",
        "Jun 2024",
        "Jul 2024",
        "Aug 2024",
        "Sep 2024",
        "Oct 2024",
        "Nov 2024",
        "Dec 2024",
      ];

      dates.forEach((date, index) => {
        const formatted = formatArticleDateOnly(date);
        const month = (index + 1).toString().padStart(2, "0");
        expect(formatted).toBe(`2024-${month}-01`);
      });
    });

    it("should handle mixed case month names", () => {
      // Implementation uses exact case matching, so this tests robustness
      const result = parseArticleDate("jan 2024");
      // Should fallback to current date since "jan" doesn't match "Jan"
      expect(result).toBeInstanceOf(Date);
    });

    it("should preserve UTC timezone in all operations", () => {
      const date = parseArticleDate("Jun 2024");
      expect(date.getUTCHours()).toBe(0);
      expect(date.getUTCMinutes()).toBe(0);
      expect(date.getUTCSeconds()).toBe(0);
    });

    it("should handle canonical URL building for nested paths", () => {
      const url = buildCanonicalUrl("/blog/category/post");
      expect(url).toBe(`${siteConfig.siteUrl}/blog/category/post`);
    });

    it("should handle image paths consistently", () => {
      const relativeImage = toAbsoluteUrl("/images/og-image.png");
      const absoluteImage = toAbsoluteUrl("https://cdn.example.com/image.png");

      expect(relativeImage).toContain(siteConfig.siteUrl);
      expect(absoluteImage).not.toContain(siteConfig.siteUrl);
    });
  });
});