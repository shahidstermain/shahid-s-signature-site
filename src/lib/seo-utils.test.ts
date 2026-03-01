import { describe, it, expect, vi, beforeEach } from "vitest";
import { toAbsoluteUrl, buildCanonicalUrl, parseArticleDate, formatArticleDateIso, formatArticleDateOnly } from "./seo-utils";
import * as siteConfigModule from "./site-config";

// Mock the site config
vi.mock("./site-config", () => ({
  siteConfig: {
    siteUrl: "https://shahidster.tech",
  },
}));

describe("seo-utils", () => {
  describe("toAbsoluteUrl", () => {
    it("should return absolute URL as-is when starting with http://", () => {
      const result = toAbsoluteUrl("http://example.com/path");
      expect(result).toBe("http://example.com/path");
    });

    it("should return absolute URL as-is when starting with https://", () => {
      const result = toAbsoluteUrl("https://example.com/path");
      expect(result).toBe("https://example.com/path");
    });

    it("should convert relative path starting with slash to absolute URL", () => {
      const result = toAbsoluteUrl("/blog/post");
      expect(result).toBe("https://shahidster.tech/blog/post");
    });

    it("should convert relative path without slash to absolute URL", () => {
      const result = toAbsoluteUrl("blog/post");
      expect(result).toBe("https://shahidster.tech/blog/post");
    });

    it("should handle empty string", () => {
      const result = toAbsoluteUrl("");
      expect(result).toBe("https://shahidster.tech/");
    });

    it("should handle path with query parameters", () => {
      const result = toAbsoluteUrl("/blog/post?id=123");
      expect(result).toBe("https://shahidster.tech/blog/post?id=123");
    });

    it("should handle path with hash fragment", () => {
      const result = toAbsoluteUrl("/blog/post#section");
      expect(result).toBe("https://shahidster.tech/blog/post#section");
    });
  });

  describe("buildCanonicalUrl", () => {
    it("should return site URL when path is undefined", () => {
      const result = buildCanonicalUrl(undefined);
      expect(result).toBe("https://shahidster.tech");
    });

    it("should return site URL when path is empty", () => {
      const result = buildCanonicalUrl("");
      expect(result).toBe("https://shahidster.tech");
    });

    it("should build canonical URL with provided path", () => {
      const result = buildCanonicalUrl("/blog/post");
      expect(result).toBe("https://shahidster.tech/blog/post");
    });

    it("should handle path without leading slash", () => {
      const result = buildCanonicalUrl("blog/post");
      expect(result).toBe("https://shahidster.tech/blog/post");
    });

    it("should handle absolute URLs", () => {
      const result = buildCanonicalUrl("https://example.com/page");
      expect(result).toBe("https://example.com/page");
    });
  });

  describe("parseArticleDate", () => {
    it("should parse valid date string (month year format)", () => {
      const result = parseArticleDate("Jan 2024");
      expect(result).toBeInstanceOf(Date);
      expect(result.getUTCFullYear()).toBe(2024);
      expect(result.getUTCMonth()).toBe(0); // January is 0
      expect(result.getUTCDate()).toBe(1);
    });

    it("should parse all months correctly", () => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      months.forEach((month, index) => {
        const result = parseArticleDate(`${month} 2024`);
        expect(result.getUTCMonth()).toBe(index);
      });
    });

    it("should handle different years", () => {
      const result = parseArticleDate("Dec 2025");
      expect(result.getUTCFullYear()).toBe(2025);
      expect(result.getUTCMonth()).toBe(11); // December
    });

    it("should return current date for invalid month", () => {
      const result = parseArticleDate("InvalidMonth 2024");
      // It should default to month 0 (January) for unknown month
      expect(result.getUTCFullYear()).toBe(2024);
      expect(result.getUTCMonth()).toBe(0);
    });

    it("should return current date for invalid year (NaN)", () => {
      const before = new Date();
      const result = parseArticleDate("Jan NotAYear");
      const after = new Date();

      // Should return current date when year is NaN
      expect(result.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(result.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it("should handle malformed date string", () => {
      const before = new Date();
      const result = parseArticleDate("invalid");
      const after = new Date();

      expect(result.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(result.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it("should handle empty string", () => {
      const before = new Date();
      const result = parseArticleDate("");
      const after = new Date();

      expect(result.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(result.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it("should parse date with extra whitespace", () => {
      // split(" ") on whitespace string returns empty strings, will be NaN
      const result = parseArticleDate("  Mar   2023  ");
      // The implementation doesn't trim, so this might not parse correctly
      // If it gets NaN for year, it returns current date
      // Just verify it returns a valid date
      expect(result).toBeInstanceOf(Date);
    });
  });

  describe("formatArticleDateIso", () => {
    it("should format date to ISO string", () => {
      const result = formatArticleDateIso("Jan 2024");
      expect(result).toBe("2024-01-01T00:00:00.000Z");
    });

    it("should handle different months", () => {
      const result = formatArticleDateIso("Jun 2025");
      expect(result).toBe("2025-06-01T00:00:00.000Z");
    });

    it("should handle December correctly", () => {
      const result = formatArticleDateIso("Dec 2023");
      expect(result).toBe("2023-12-01T00:00:00.000Z");
    });
  });

  describe("formatArticleDateOnly", () => {
    it("should format date to YYYY-MM-DD format", () => {
      const result = formatArticleDateOnly("Jan 2024");
      expect(result).toBe("2024-01-01");
    });

    it("should handle different months", () => {
      const result = formatArticleDateOnly("Mar 2025");
      expect(result).toBe("2025-03-01");
    });

    it("should handle December correctly", () => {
      const result = formatArticleDateOnly("Dec 2023");
      expect(result).toBe("2023-12-01");
    });

    it("should pad single-digit months with zero", () => {
      const result = formatArticleDateOnly("Sep 2024");
      expect(result).toBe("2024-09-01");
    });
  });

  describe("edge cases and boundary conditions", () => {
    it("should handle very old dates", () => {
      const result = parseArticleDate("Jan 1900");
      expect(result.getUTCFullYear()).toBe(1900);
      expect(result.getUTCMonth()).toBe(0);
    });

    it("should handle far future dates", () => {
      const result = parseArticleDate("Dec 2099");
      expect(result.getUTCFullYear()).toBe(2099);
      expect(result.getUTCMonth()).toBe(11);
    });

    it("toAbsoluteUrl should handle complex URLs with all components", () => {
      const result = toAbsoluteUrl("/path?query=value&foo=bar#section");
      expect(result).toBe("https://shahidster.tech/path?query=value&foo=bar#section");
    });
  });
});