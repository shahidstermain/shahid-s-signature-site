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
    it("should return absolute URLs unchanged", () => {
      expect(toAbsoluteUrl("https://example.com/path")).toBe(
        "https://example.com/path"
      );
      expect(toAbsoluteUrl("http://example.com/path")).toBe(
        "http://example.com/path"
      );
    });

    it("should convert relative paths starting with / to absolute URLs", () => {
      expect(toAbsoluteUrl("/blog/post")).toBe(
        "https://shahidster.tech/blog/post"
      );
    });

    it("should convert relative paths without / to absolute URLs", () => {
      expect(toAbsoluteUrl("blog/post")).toBe(
        "https://shahidster.tech/blog/post"
      );
    });

    it("should handle edge case of empty path", () => {
      expect(toAbsoluteUrl("")).toBe("https://shahidster.tech/");
    });

    it("should handle root path", () => {
      expect(toAbsoluteUrl("/")).toBe("https://shahidster.tech/");
    });

    it("should handle paths with query parameters", () => {
      expect(toAbsoluteUrl("/search?q=test")).toBe(
        "https://shahidster.tech/search?q=test"
      );
    });
  });

  describe("buildCanonicalUrl", () => {
    it("should return site URL when no path is provided", () => {
      expect(buildCanonicalUrl()).toBe("https://shahidster.tech");
    });

    it("should return site URL when path is undefined", () => {
      expect(buildCanonicalUrl(undefined)).toBe("https://shahidster.tech");
    });

    it("should build canonical URL for relative paths", () => {
      expect(buildCanonicalUrl("/blog/post-1")).toBe(
        "https://shahidster.tech/blog/post-1"
      );
    });

    it("should build canonical URL for paths without leading slash", () => {
      expect(buildCanonicalUrl("blog/post-1")).toBe(
        "https://shahidster.tech/blog/post-1"
      );
    });

    it("should handle absolute URLs", () => {
      expect(buildCanonicalUrl("https://example.com/path")).toBe(
        "https://example.com/path"
      );
    });
  });

  describe("parseArticleDate", () => {
    it("should parse valid month-year dates", () => {
      const date = parseArticleDate("Jan 2024");
      expect(date.getUTCFullYear()).toBe(2024);
      expect(date.getUTCMonth()).toBe(0); // January = 0
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
      });
    });

    it("should handle invalid month by defaulting to January", () => {
      const date = parseArticleDate("Invalid 2024");
      expect(date.getUTCMonth()).toBe(0); // January
    });

    it("should handle invalid year by returning current date", () => {
      const date = parseArticleDate("Jan Invalid");
      expect(date).toBeInstanceOf(Date);
      expect(isNaN(date.getTime())).toBe(false);
    });

    it("should handle completely invalid input", () => {
      const date = parseArticleDate("Invalid Input");
      expect(date).toBeInstanceOf(Date);
      expect(isNaN(date.getTime())).toBe(false);
    });

    it("should parse dates from different years", () => {
      const date2023 = parseArticleDate("Jun 2023");
      const date2024 = parseArticleDate("Jun 2024");
      const date2025 = parseArticleDate("Jun 2025");

      expect(date2023.getUTCFullYear()).toBe(2023);
      expect(date2024.getUTCFullYear()).toBe(2024);
      expect(date2025.getUTCFullYear()).toBe(2025);
    });

    it("should always set day to 1st of month", () => {
      const date = parseArticleDate("Dec 2025");
      expect(date.getUTCDate()).toBe(1);
    });
  });

  describe("formatArticleDateIso", () => {
    it("should format date to ISO string", () => {
      const isoDate = formatArticleDateIso("Jan 2024");
      expect(isoDate).toBe("2024-01-01T00:00:00.000Z");
    });

    it("should handle different months", () => {
      expect(formatArticleDateIso("Dec 2025")).toBe("2025-12-01T00:00:00.000Z");
      expect(formatArticleDateIso("Jun 2024")).toBe("2024-06-01T00:00:00.000Z");
    });

    it("should handle leap years correctly", () => {
      const isoDate = formatArticleDateIso("Feb 2024");
      expect(isoDate).toBe("2024-02-01T00:00:00.000Z");
    });
  });

  describe("formatArticleDateOnly", () => {
    it("should format date to YYYY-MM-DD format", () => {
      const dateOnly = formatArticleDateOnly("Jan 2024");
      expect(dateOnly).toBe("2024-01-01");
    });

    it("should handle different months correctly", () => {
      expect(formatArticleDateOnly("Mar 2025")).toBe("2025-03-01");
      expect(formatArticleDateOnly("Nov 2023")).toBe("2023-11-01");
    });

    it("should not include time component", () => {
      const dateOnly = formatArticleDateOnly("Jun 2024");
      expect(dateOnly).not.toContain("T");
      expect(dateOnly).not.toContain(":");
    });

    it("should pad single-digit months with zero", () => {
      const dateOnly = formatArticleDateOnly("Jan 2024");
      expect(dateOnly).toBe("2024-01-01");
    });

    it("should handle December correctly", () => {
      const dateOnly = formatArticleDateOnly("Dec 2025");
      expect(dateOnly).toBe("2025-12-01");
    });
  });

  describe("edge cases and integration", () => {
    it("should handle date parsing and formatting round trip", () => {
      const original = "May 2025";
      const parsed = parseArticleDate(original);
      const formatted = formatArticleDateIso(original);

      expect(formatted).toContain("2025-05-01");
    });

    it("should handle URL building with special characters", () => {
      const url = toAbsoluteUrl("/blog/post-with-dashes");
      expect(url).toBe("https://shahidster.tech/blog/post-with-dashes");
    });

    it("should maintain consistency between formatArticleDateIso and formatArticleDateOnly", () => {
      const dateStr = "Aug 2024";
      const iso = formatArticleDateIso(dateStr);
      const dateOnly = formatArticleDateOnly(dateStr);

      expect(iso).toContain(dateOnly);
    });

    it("should handle URLs with unicode characters", () => {
      const url = toAbsoluteUrl("/blog/post-café");
      expect(url).toBe("https://shahidster.tech/blog/post-café");
    });

    it("should parse dates consistently across multiple calls", () => {
      const date1 = parseArticleDate("Jan 2024");
      const date2 = parseArticleDate("Jan 2024");

      expect(date1.getTime()).toBe(date2.getTime());
    });

    it("should handle buildCanonicalUrl with already absolute URL", () => {
      const url = buildCanonicalUrl("https://example.com/page");
      expect(url).toBe("https://example.com/page");
    });

    it("should format dates in UTC timezone consistently", () => {
      const dateStr = "Mar 2024";
      const date = parseArticleDate(dateStr);

      // Should be UTC midnight
      expect(date.getUTCHours()).toBe(0);
      expect(date.getUTCMinutes()).toBe(0);
      expect(date.getUTCSeconds()).toBe(0);
    });

    it("should handle empty path consistently", () => {
      const url1 = buildCanonicalUrl("");
      const url2 = buildCanonicalUrl();

      expect(url1).toBe(url2);
      expect(url1).toBe("https://shahidster.tech");
    });

    it("should format date only without time component", () => {
      const dateOnly = formatArticleDateOnly("Dec 2025");

      // Should not contain T or time parts
      expect(dateOnly).not.toContain("T");
      expect(dateOnly).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});