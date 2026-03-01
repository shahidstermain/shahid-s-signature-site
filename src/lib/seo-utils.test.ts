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
    it("should return URL unchanged if it starts with http://", () => {
      const url = "http://example.com/path";
      expect(toAbsoluteUrl(url)).toBe(url);
    });

    it("should return URL unchanged if it starts with https://", () => {
      const url = "https://example.com/path";
      expect(toAbsoluteUrl(url)).toBe(url);
    });

    it("should prepend siteUrl to relative path starting with /", () => {
      const path = "/blog/article";
      expect(toAbsoluteUrl(path)).toBe("https://shahidster.tech/blog/article");
    });

    it("should prepend siteUrl and / to relative path without leading /", () => {
      const path = "blog/article";
      expect(toAbsoluteUrl(path)).toBe("https://shahidster.tech/blog/article");
    });

    it("should handle empty string", () => {
      expect(toAbsoluteUrl("")).toBe("https://shahidster.tech/");
    });

    it("should handle root path", () => {
      expect(toAbsoluteUrl("/")).toBe("https://shahidster.tech/");
    });
  });

  describe("buildCanonicalUrl", () => {
    it("should return siteUrl when no path provided", () => {
      expect(buildCanonicalUrl()).toBe("https://shahidster.tech");
    });

    it("should return siteUrl when path is undefined", () => {
      expect(buildCanonicalUrl(undefined)).toBe("https://shahidster.tech");
    });

    it("should build absolute URL from relative path", () => {
      expect(buildCanonicalUrl("/about")).toBe("https://shahidster.tech/about");
    });

    it("should handle absolute URLs", () => {
      const absoluteUrl = "https://example.com/page";
      expect(buildCanonicalUrl(absoluteUrl)).toBe(absoluteUrl);
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
        { str: "Jan 2024", month: 0 },
        { str: "Feb 2024", month: 1 },
        { str: "Mar 2024", month: 2 },
        { str: "Apr 2024", month: 3 },
        { str: "May 2024", month: 4 },
        { str: "Jun 2024", month: 5 },
        { str: "Jul 2024", month: 6 },
        { str: "Aug 2024", month: 7 },
        { str: "Sep 2024", month: 8 },
        { str: "Oct 2024", month: 9 },
        { str: "Nov 2024", month: 10 },
        { str: "Dec 2024", month: 11 },
      ];

      months.forEach(({ str, month }) => {
        const date = parseArticleDate(str);
        expect(date.getUTCMonth()).toBe(month);
      });
    });

    it("should handle invalid month by defaulting to 0", () => {
      const date = parseArticleDate("Invalid 2024");
      expect(date.getUTCMonth()).toBe(0);
      expect(date.getUTCFullYear()).toBe(2024);
    });

    it("should return current date for invalid year", () => {
      const date = parseArticleDate("Jan invalid");
      expect(date).toBeInstanceOf(Date);
      expect(isNaN(date.getTime())).toBe(false);
    });

    it("should handle edge case years", () => {
      const date1 = parseArticleDate("Jan 2000");
      expect(date1.getUTCFullYear()).toBe(2000);

      const date2 = parseArticleDate("Dec 2099");
      expect(date2.getUTCFullYear()).toBe(2099);
    });

    it("should return valid Date for empty string", () => {
      const date = parseArticleDate("");
      expect(date).toBeInstanceOf(Date);
    });

    it("should handle missing year", () => {
      const date = parseArticleDate("Jan");
      expect(date).toBeInstanceOf(Date);
    });
  });

  describe("formatArticleDateIso", () => {
    it("should format date to ISO string", () => {
      const iso = formatArticleDateIso("Jan 2024");
      expect(iso).toBe("2024-01-01T00:00:00.000Z");
    });

    it("should handle different months", () => {
      const iso = formatArticleDateIso("Dec 2025");
      expect(iso).toBe("2025-12-01T00:00:00.000Z");
    });

    it("should return valid ISO string for invalid input", () => {
      const iso = formatArticleDateIso("Invalid");
      expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe("formatArticleDateOnly", () => {
    it("should format date to YYYY-MM-DD", () => {
      const dateOnly = formatArticleDateOnly("Jan 2024");
      expect(dateOnly).toBe("2024-01-01");
    });

    it("should handle different months and years", () => {
      const dateOnly = formatArticleDateOnly("Nov 2025");
      expect(dateOnly).toBe("2025-11-01");
    });

    it("should return valid date string for invalid input", () => {
      const dateOnly = formatArticleDateOnly("Invalid");
      expect(dateOnly).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should handle edge case: Feb in leap year", () => {
      const dateOnly = formatArticleDateOnly("Feb 2024");
      expect(dateOnly).toBe("2024-02-01");
    });
  });

  describe("edge cases and boundary conditions", () => {
    it("should handle special characters in paths", () => {
      const path = "/blog/article?query=test&sort=desc";
      expect(toAbsoluteUrl(path)).toBe(
        "https://shahidster.tech/blog/article?query=test&sort=desc"
      );
    });

    it("should handle paths with fragments", () => {
      const path = "/blog/article#section";
      expect(toAbsoluteUrl(path)).toBe("https://shahidster.tech/blog/article#section");
    });

    it("should handle multiple slashes in path", () => {
      const path = "///blog///article///";
      expect(toAbsoluteUrl(path)).toBe("https://shahidster.tech///blog///article///");
    });

    it("should handle date parsing with extra whitespace", () => {
      const date = parseArticleDate("Jan  2026");
      expect(date.getUTCFullYear()).toBe(2026);
    });
  });
});