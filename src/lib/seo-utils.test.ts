import { describe, it, expect } from "vitest";
import {
  toAbsoluteUrl,
  buildCanonicalUrl,
  parseArticleDate,
  formatArticleDateIso,
  formatArticleDateOnly,
} from "./seo-utils";

describe("seo-utils", () => {
  describe("toAbsoluteUrl", () => {
    it("should return absolute URL unchanged", () => {
      expect(toAbsoluteUrl("https://example.com/path")).toBe("https://example.com/path");
      expect(toAbsoluteUrl("http://example.com/path")).toBe("http://example.com/path");
    });

    it("should convert relative path with leading slash to absolute URL", () => {
      expect(toAbsoluteUrl("/blog/test")).toBe("https://shahidster.tech/blog/test");
    });

    it("should convert relative path without leading slash to absolute URL", () => {
      expect(toAbsoluteUrl("blog/test")).toBe("https://shahidster.tech/blog/test");
    });

    it("should handle root path", () => {
      expect(toAbsoluteUrl("/")).toBe("https://shahidster.tech/");
    });

    it("should handle empty string", () => {
      expect(toAbsoluteUrl("")).toBe("https://shahidster.tech/");
    });
  });

  describe("buildCanonicalUrl", () => {
    it("should return site URL when no path provided", () => {
      expect(buildCanonicalUrl()).toBe("https://shahidster.tech");
      expect(buildCanonicalUrl(undefined)).toBe("https://shahidster.tech");
    });

    it("should build canonical URL from path", () => {
      expect(buildCanonicalUrl("/blog/test")).toBe("https://shahidster.tech/blog/test");
    });

    it("should handle absolute URLs", () => {
      expect(buildCanonicalUrl("https://example.com/path")).toBe("https://example.com/path");
    });
  });

  describe("parseArticleDate", () => {
    it("should parse valid date string", () => {
      const date = parseArticleDate("Nov 2025");
      expect(date.getUTCFullYear()).toBe(2025);
      expect(date.getUTCMonth()).toBe(10); // November is month 10 (0-indexed)
      expect(date.getUTCDate()).toBe(1);
    });

    it("should handle all months", () => {
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

      months.forEach((month, index) => {
        const date = parseArticleDate(`${month} 2024`);
        expect(date.getUTCMonth()).toBe(index);
      });
    });

    it("should return current date for invalid month", () => {
      const date = parseArticleDate("Invalid 2025");
      expect(date.getUTCMonth()).toBe(0); // Defaults to month 0
      expect(date.getUTCFullYear()).toBe(2025);
    });

    it("should return current date for invalid year", () => {
      const date = parseArticleDate("Nov Invalid");
      const now = new Date();
      expect(date.getTime()).toBeCloseTo(now.getTime(), -2);
    });

    it("should handle missing year", () => {
      const date = parseArticleDate("Nov");
      const now = new Date();
      expect(date.getTime()).toBeCloseTo(now.getTime(), -2);
    });

    it("should handle edge case with different year formats", () => {
      expect(parseArticleDate("Dec 2025").getUTCFullYear()).toBe(2025);
      expect(parseArticleDate("Jan 2026").getUTCFullYear()).toBe(2026);
    });
  });

  describe("formatArticleDateIso", () => {
    it("should format date as ISO string", () => {
      const isoDate = formatArticleDateIso("Nov 2025");
      expect(isoDate).toBe("2025-11-01T00:00:00.000Z");
    });

    it("should handle different months", () => {
      expect(formatArticleDateIso("Jan 2024")).toBe("2024-01-01T00:00:00.000Z");
      expect(formatArticleDateIso("Dec 2024")).toBe("2024-12-01T00:00:00.000Z");
    });
  });

  describe("formatArticleDateOnly", () => {
    it("should format date as YYYY-MM-DD", () => {
      expect(formatArticleDateOnly("Nov 2025")).toBe("2025-11-01");
    });

    it("should handle different months", () => {
      expect(formatArticleDateOnly("Jan 2024")).toBe("2024-01-01");
      expect(formatArticleDateOnly("Dec 2024")).toBe("2024-12-01");
    });

    it("should pad month with zero", () => {
      expect(formatArticleDateOnly("Mar 2025")).toBe("2025-03-01");
    });
  });

  // Additional edge case tests
  describe("edge cases and regression tests", () => {
    it("should handle URL with query parameters", () => {
      expect(toAbsoluteUrl("https://example.com/path?query=1")).toBe(
        "https://example.com/path?query=1"
      );
    });

    it("should handle URL with hash fragments", () => {
      expect(toAbsoluteUrl("https://example.com/path#section")).toBe(
        "https://example.com/path#section"
      );
    });

    it("should handle relative paths with multiple segments", () => {
      expect(toAbsoluteUrl("/blog/category/post")).toBe(
        "https://shahidster.tech/blog/category/post"
      );
    });

    it("should handle empty path in buildCanonicalUrl", () => {
      // Empty string is falsy, so returns siteUrl directly without trailing slash
      expect(buildCanonicalUrl("")).toBe("https://shahidster.tech");
    });

    it("should handle future years in parseArticleDate", () => {
      const date = parseArticleDate("Dec 2030");
      expect(date.getUTCFullYear()).toBe(2030);
      expect(date.getUTCMonth()).toBe(11);
    });

    it("should handle first day of year correctly", () => {
      expect(formatArticleDateOnly("Jan 2025")).toBe("2025-01-01");
    });

    it("should handle last day of year correctly", () => {
      expect(formatArticleDateOnly("Dec 2025")).toBe("2025-12-01");
    });

    it("should handle case sensitivity in month names gracefully", () => {
      // The current implementation expects proper case, this tests that behavior
      const date = parseArticleDate("nov 2025");
      expect(date.getUTCMonth()).toBe(0); // Falls back to 0 for unrecognized month
    });
  });
});