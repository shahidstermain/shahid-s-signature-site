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

    it("should convert paths starting with slash to absolute URLs", () => {
      expect(toAbsoluteUrl("/blog/post")).toBe(
        "https://shahidster.tech/blog/post"
      );
    });

    it("should convert paths without slash to absolute URLs", () => {
      expect(toAbsoluteUrl("blog/post")).toBe(
        "https://shahidster.tech/blog/post"
      );
    });

    it("should handle empty string", () => {
      expect(toAbsoluteUrl("")).toBe("https://shahidster.tech/");
    });

    it("should handle root path", () => {
      expect(toAbsoluteUrl("/")).toBe("https://shahidster.tech/");
    });
  });

  describe("buildCanonicalUrl", () => {
    it("should return site URL when no path provided", () => {
      expect(buildCanonicalUrl()).toBe("https://shahidster.tech");
      expect(buildCanonicalUrl(undefined)).toBe("https://shahidster.tech");
    });

    it("should build canonical URL for paths", () => {
      expect(buildCanonicalUrl("/blog/post")).toBe(
        "https://shahidster.tech/blog/post"
      );
    });

    it("should handle paths without leading slash", () => {
      expect(buildCanonicalUrl("blog/post")).toBe(
        "https://shahidster.tech/blog/post"
      );
    });

    it("should handle absolute URLs", () => {
      expect(buildCanonicalUrl("https://example.com/page")).toBe(
        "https://example.com/page"
      );
    });
  });

  describe("parseArticleDate", () => {
    it("should parse valid month and year", () => {
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
        const date = parseArticleDate(`${month} 2024`);
        expect(date.getUTCMonth()).toBe(index);
      });
    });

    it("should handle different years", () => {
      expect(parseArticleDate("Dec 2025").getUTCFullYear()).toBe(2025);
      expect(parseArticleDate("Jan 2023").getUTCFullYear()).toBe(2023);
    });

    it("should return current date for invalid input", () => {
      const result = parseArticleDate("Invalid 2024");
      expect(result).toBeInstanceOf(Date);
    });

    it("should handle malformed date strings", () => {
      const result = parseArticleDate("NotAMonth");
      expect(result).toBeInstanceOf(Date);
    });

    it("should handle empty string", () => {
      const result = parseArticleDate("");
      expect(result).toBeInstanceOf(Date);
    });

    it("should handle year-only string", () => {
      const result = parseArticleDate("2024");
      expect(result).toBeInstanceOf(Date);
    });
  });

  describe("formatArticleDateIso", () => {
    it("should format date as ISO string", () => {
      const result = formatArticleDateIso("Jan 2024");
      expect(result).toBe("2024-01-01T00:00:00.000Z");
    });

    it("should handle different months", () => {
      expect(formatArticleDateIso("Dec 2025")).toBe("2025-12-01T00:00:00.000Z");
      expect(formatArticleDateIso("Jun 2023")).toBe("2023-06-01T00:00:00.000Z");
    });

    it("should produce valid ISO 8601 format", () => {
      const result = formatArticleDateIso("Mar 2024");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe("formatArticleDateOnly", () => {
    it("should format date as YYYY-MM-DD", () => {
      const result = formatArticleDateOnly("Jan 2024");
      expect(result).toBe("2024-01-01");
    });

    it("should handle different months", () => {
      expect(formatArticleDateOnly("Dec 2025")).toBe("2025-12-01");
      expect(formatArticleDateOnly("Jun 2023")).toBe("2023-06-01");
    });

    it("should produce valid date-only format", () => {
      const result = formatArticleDateOnly("Mar 2024");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(result.split("T")).toHaveLength(1);
    });

    it("should pad single-digit months with zero", () => {
      expect(formatArticleDateOnly("Jan 2024")).toContain("-01-");
      expect(formatArticleDateOnly("Sep 2024")).toContain("-09-");
    });
  });

  describe("edge cases and integration", () => {
    it("should handle date parsing consistency across functions", () => {
      const dateStr = "Nov 2025";
      const parsed = parseArticleDate(dateStr);
      const iso = formatArticleDateIso(dateStr);
      const dateOnly = formatArticleDateOnly(dateStr);

      expect(iso).toContain(dateOnly);
      expect(parsed.toISOString()).toBe(iso);
    });

    it("should handle URL building with special characters", () => {
      expect(toAbsoluteUrl("/blog/post?query=test")).toBe(
        "https://shahidster.tech/blog/post?query=test"
      );
    });

    it("should handle canonical URL for complex paths", () => {
      expect(buildCanonicalUrl("/blog/2024/01/post-title")).toBe(
        "https://shahidster.tech/blog/2024/01/post-title"
      );
    });
  });
});