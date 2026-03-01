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
    it("should return URL as-is if it starts with http://", () => {
      const url = "http://example.com/path";
      expect(toAbsoluteUrl(url)).toBe(url);
    });

    it("should return URL as-is if it starts with https://", () => {
      const url = "https://example.com/path";
      expect(toAbsoluteUrl(url)).toBe(url);
    });

    it("should prepend site URL to relative path starting with /", () => {
      const result = toAbsoluteUrl("/blog/post");
      expect(result).toBe("https://shahidster.tech/blog/post");
    });

    it("should prepend site URL and / to path not starting with /", () => {
      const result = toAbsoluteUrl("blog/post");
      expect(result).toBe("https://shahidster.tech/blog/post");
    });

    it("should handle empty string", () => {
      const result = toAbsoluteUrl("");
      expect(result).toBe("https://shahidster.tech/");
    });

    it("should handle root path", () => {
      const result = toAbsoluteUrl("/");
      expect(result).toBe("https://shahidster.tech/");
    });
  });

  describe("buildCanonicalUrl", () => {
    it("should return site URL when path is undefined", () => {
      const result = buildCanonicalUrl();
      expect(result).toBe("https://shahidster.tech");
    });

    it("should return site URL when path is empty string", () => {
      const result = buildCanonicalUrl("");
      expect(result).toBe("https://shahidster.tech");
    });

    it("should build absolute URL from relative path", () => {
      const result = buildCanonicalUrl("/about");
      expect(result).toBe("https://shahidster.tech/about");
    });

    it("should handle absolute URLs", () => {
      const result = buildCanonicalUrl("https://other.com/page");
      expect(result).toBe("https://other.com/page");
    });
  });

  describe("parseArticleDate", () => {
    it("should parse valid month and year", () => {
      const result = parseArticleDate("Jan 2024");
      expect(result).toEqual(new Date(Date.UTC(2024, 0, 1)));
    });

    it("should parse all months correctly", () => {
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

      months.forEach((month, index) => {
        const result = parseArticleDate(`${month} 2024`);
        expect(result.getUTCMonth()).toBe(index);
        expect(result.getUTCFullYear()).toBe(2024);
      });
    });

    it("should handle different years", () => {
      const result = parseArticleDate("Dec 2025");
      expect(result.getUTCFullYear()).toBe(2025);
      expect(result.getUTCMonth()).toBe(11);
    });

    it("should return current date for invalid month", () => {
      const result = parseArticleDate("Invalid 2024");
      expect(result).toBeInstanceOf(Date);
    });

    it("should return current date for invalid year", () => {
      const result = parseArticleDate("Jan invalid");
      const now = new Date();
      expect(result.getFullYear()).toBe(now.getFullYear());
    });

    it("should return current date for empty string", () => {
      const result = parseArticleDate("");
      expect(result).toBeInstanceOf(Date);
    });

    it("should handle edge case with only month", () => {
      const result = parseArticleDate("Mar");
      expect(result).toBeInstanceOf(Date);
    });
  });

  describe("formatArticleDateIso", () => {
    it("should format date as ISO string", () => {
      const result = formatArticleDateIso("Jan 2024");
      expect(result).toBe("2024-01-01T00:00:00.000Z");
    });

    it("should handle different months", () => {
      const result = formatArticleDateIso("Dec 2025");
      expect(result).toBe("2025-12-01T00:00:00.000Z");
    });

    it("should return valid ISO format", () => {
      const result = formatArticleDateIso("Jun 2023");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe("formatArticleDateOnly", () => {
    it("should format date as YYYY-MM-DD", () => {
      const result = formatArticleDateOnly("Jan 2024");
      expect(result).toBe("2024-01-01");
    });

    it("should handle different dates", () => {
      const result = formatArticleDateOnly("Nov 2025");
      expect(result).toBe("2025-11-01");
    });

    it("should not include time portion", () => {
      const result = formatArticleDateOnly("Mar 2023");
      expect(result).not.toContain("T");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should handle leap year edge case", () => {
      const result = formatArticleDateOnly("Feb 2024");
      expect(result).toBe("2024-02-01");
    });
  });
});