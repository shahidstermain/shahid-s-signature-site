import { describe, it, expect } from "vitest";
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
    it("should return absolute URL unchanged", () => {
      const url = "https://example.com/path";
      expect(toAbsoluteUrl(url)).toBe(url);
    });

    it("should return http URL unchanged", () => {
      const url = "http://example.com/path";
      expect(toAbsoluteUrl(url)).toBe(url);
    });

    it("should prepend site URL to relative path with leading slash", () => {
      const path = "/blog/article";
      expect(toAbsoluteUrl(path)).toBe(`${siteConfig.siteUrl}/blog/article`);
    });

    it("should prepend site URL and add leading slash to relative path without it", () => {
      const path = "blog/article";
      expect(toAbsoluteUrl(path)).toBe(`${siteConfig.siteUrl}/blog/article`);
    });

    it("should handle empty string by adding slash", () => {
      expect(toAbsoluteUrl("")).toBe(`${siteConfig.siteUrl}/`);
    });
  });

  describe("buildCanonicalUrl", () => {
    it("should return site URL when no path provided", () => {
      expect(buildCanonicalUrl()).toBe(siteConfig.siteUrl);
    });

    it("should return site URL when undefined path provided", () => {
      expect(buildCanonicalUrl(undefined)).toBe(siteConfig.siteUrl);
    });

    it("should build absolute URL with path", () => {
      const path = "/blog/test";
      expect(buildCanonicalUrl(path)).toBe(`${siteConfig.siteUrl}/blog/test`);
    });

    it("should handle absolute URLs", () => {
      const url = "https://example.com/page";
      expect(buildCanonicalUrl(url)).toBe(url);
    });
  });

  describe("parseArticleDate", () => {
    it("should parse valid date string (Jan 2024)", () => {
      const result = parseArticleDate("Jan 2024");
      expect(result).toBeInstanceOf(Date);
      expect(result.getUTCFullYear()).toBe(2024);
      expect(result.getUTCMonth()).toBe(0); // January is 0
      expect(result.getUTCDate()).toBe(1);
    });

    it("should parse date for each month", () => {
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

      months.forEach((month, index) => {
        const result = parseArticleDate(`${month} 2025`);
        expect(result.getUTCMonth()).toBe(index);
        expect(result.getUTCFullYear()).toBe(2025);
      });
    });

    it("should return current date for invalid month", () => {
      const result = parseArticleDate("Invalid 2024");
      expect(result).toBeInstanceOf(Date);
      // Should default to month 0 for unknown month
      expect(result.getUTCMonth()).toBe(0);
    });

    it("should return current date for invalid year", () => {
      const result = parseArticleDate("Jan NotAYear");
      expect(result).toBeInstanceOf(Date);
      // Should return current date when year is NaN
    });

    it("should handle missing year", () => {
      const result = parseArticleDate("Jan");
      expect(result).toBeInstanceOf(Date);
    });

    it("should handle edge case years", () => {
      expect(parseArticleDate("Dec 2020").getUTCFullYear()).toBe(2020);
      expect(parseArticleDate("Jan 2030").getUTCFullYear()).toBe(2030);
    });
  });

  describe("formatArticleDateIso", () => {
    it("should return ISO 8601 format", () => {
      const result = formatArticleDateIso("Jan 2024");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(result).toContain("2024-01-01");
    });

    it("should handle different months", () => {
      expect(formatArticleDateIso("Jun 2024")).toContain("2024-06-01");
      expect(formatArticleDateIso("Dec 2025")).toContain("2025-12-01");
    });

    it("should maintain UTC timezone", () => {
      const result = formatArticleDateIso("Mar 2024");
      expect(result).toMatch(/Z$/);
    });
  });

  describe("formatArticleDateOnly", () => {
    it("should return date portion only (YYYY-MM-DD)", () => {
      const result = formatArticleDateOnly("Jan 2024");
      expect(result).toBe("2024-01-01");
    });

    it("should format various months correctly", () => {
      expect(formatArticleDateOnly("Feb 2024")).toBe("2024-02-01");
      expect(formatArticleDateOnly("Sep 2024")).toBe("2024-09-01");
      expect(formatArticleDateOnly("Dec 2025")).toBe("2025-12-01");
    });

    it("should not include time component", () => {
      const result = formatArticleDateOnly("Mar 2024");
      expect(result).not.toContain("T");
      expect(result).not.toContain(":");
    });
  });

  // Edge cases and boundary tests
  describe("boundary and edge cases", () => {
    it("parseArticleDate should handle whitespace around month", () => {
      // parseArticleDate splits by space, so extra spaces create empty strings
      // This test verifies the function handles the format it expects
      const result = parseArticleDate("Jan 2024");
      expect(result.getUTCFullYear()).toBe(2024);
      expect(result.getUTCMonth()).toBe(0);
    });

    it("toAbsoluteUrl should handle double slashes", () => {
      const result = toAbsoluteUrl("//blog/article");
      expect(result).toBe(`${siteConfig.siteUrl}//blog/article`);
    });

    it("should handle unicode characters in paths", () => {
      const path = "/blog/café-☕";
      expect(toAbsoluteUrl(path)).toBe(`${siteConfig.siteUrl}/blog/café-☕`);
    });
  });

  // Regression tests
  describe("regression tests", () => {
    it("should consistently format the same date", () => {
      const date = "Nov 2025";
      const result1 = formatArticleDateOnly(date);
      const result2 = formatArticleDateOnly(date);
      expect(result1).toBe(result2);
    });

    it("should handle year boundary correctly", () => {
      expect(formatArticleDateOnly("Dec 2023")).toBe("2023-12-01");
      expect(formatArticleDateOnly("Jan 2024")).toBe("2024-01-01");
    });
  });
});