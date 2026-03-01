import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  toAbsoluteUrl,
  buildCanonicalUrl,
  parseArticleDate,
  formatArticleDateIso,
  formatArticleDateOnly,
} from "./seo-utils";

// Mock the site config
vi.mock("./site-config", () => ({
  siteConfig: {
    siteUrl: "https://shahidster.tech",
  },
}));

describe("seo-utils", () => {
  describe("toAbsoluteUrl", () => {
    it("should return absolute URL unchanged", () => {
      expect(toAbsoluteUrl("https://example.com/path")).toBe(
        "https://example.com/path"
      );
      expect(toAbsoluteUrl("http://example.com/path")).toBe(
        "http://example.com/path"
      );
    });

    it("should convert relative path to absolute URL", () => {
      expect(toAbsoluteUrl("/blog/post")).toBe(
        "https://shahidster.tech/blog/post"
      );
    });

    it("should add leading slash to path without it", () => {
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

    it("should handle paths with query strings", () => {
      expect(toAbsoluteUrl("/blog/post?page=1")).toBe(
        "https://shahidster.tech/blog/post?page=1"
      );
    });

    it("should handle paths with anchors", () => {
      expect(toAbsoluteUrl("/blog/post#section")).toBe(
        "https://shahidster.tech/blog/post#section"
      );
    });
  });

  describe("buildCanonicalUrl", () => {
    it("should return site URL when no path provided", () => {
      expect(buildCanonicalUrl()).toBe("https://shahidster.tech");
      expect(buildCanonicalUrl(undefined)).toBe("https://shahidster.tech");
    });

    it("should build canonical URL from path", () => {
      expect(buildCanonicalUrl("/blog/article")).toBe(
        "https://shahidster.tech/blog/article"
      );
    });

    it("should handle absolute URLs", () => {
      expect(buildCanonicalUrl("https://example.com/page")).toBe(
        "https://example.com/page"
      );
    });

    it("should handle empty string as no path", () => {
      expect(buildCanonicalUrl("")).toBe("https://shahidster.tech");
    });
  });

  describe("parseArticleDate", () => {
    it("should parse valid date strings correctly", () => {
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
      expect(parseArticleDate("Jan 2020").getUTCFullYear()).toBe(2020);
      expect(parseArticleDate("Dec 2025").getUTCFullYear()).toBe(2025);
      expect(parseArticleDate("Jun 2026").getUTCFullYear()).toBe(2026);
    });

    it("should return current date for invalid month", () => {
      const result = parseArticleDate("Invalid 2024");
      expect(result).toBeInstanceOf(Date);
      expect(result.getUTCFullYear()).toBe(2024);
      expect(result.getUTCMonth()).toBe(0); // defaults to January
    });

    it("should return current date for invalid year", () => {
      const result = parseArticleDate("Jan invalid");
      expect(result).toBeInstanceOf(Date);
      // Should return new Date() which is current date
    });

    it("should handle invalid date format gracefully", () => {
      const result = parseArticleDate("invalid");
      expect(result).toBeInstanceOf(Date);
    });

    it("should handle empty string", () => {
      const result = parseArticleDate("");
      expect(result).toBeInstanceOf(Date);
    });

    it("should set day to 1st of month", () => {
      const date = parseArticleDate("Mar 2024");
      expect(date.getUTCDate()).toBe(1);
    });
  });

  describe("formatArticleDateIso", () => {
    it("should format date as ISO string", () => {
      const result = formatArticleDateIso("Jan 2024");
      expect(result).toBe("2024-01-01T00:00:00.000Z");
    });

    it("should format different months correctly", () => {
      expect(formatArticleDateIso("Dec 2025")).toBe("2025-12-01T00:00:00.000Z");
      expect(formatArticleDateIso("Jun 2026")).toBe("2026-06-01T00:00:00.000Z");
    });

    it("should handle invalid dates", () => {
      const result = formatArticleDateIso("Invalid 2024");
      expect(result).toContain("2024-01-01"); // defaults to Jan 1
    });

    it("should return ISO format with Z timezone", () => {
      const result = formatArticleDateIso("Mar 2024");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe("formatArticleDateOnly", () => {
    it("should format date as YYYY-MM-DD", () => {
      const result = formatArticleDateOnly("Jan 2024");
      expect(result).toBe("2024-01-01");
    });

    it("should format different dates correctly", () => {
      expect(formatArticleDateOnly("Dec 2025")).toBe("2025-12-01");
      expect(formatArticleDateOnly("Jun 2026")).toBe("2026-06-01");
      expect(formatArticleDateOnly("Feb 2024")).toBe("2024-02-01");
    });

    it("should handle invalid dates", () => {
      const result = formatArticleDateOnly("Invalid 2024");
      expect(result).toContain("2024-01-01");
    });

    it("should not include time portion", () => {
      const result = formatArticleDateOnly("Mar 2024");
      expect(result).not.toContain("T");
      expect(result).not.toContain(":");
    });

    it("should use zero-padded format", () => {
      expect(formatArticleDateOnly("Jan 2024")).toBe("2024-01-01");
      expect(formatArticleDateOnly("Sep 2024")).toBe("2024-09-01");
    });
  });

  describe("edge cases and integration", () => {
    it("should handle round-trip through parse and format", () => {
      const original = "Nov 2025";
      const parsed = parseArticleDate(original);
      const iso = formatArticleDateIso(original);
      const dateOnly = formatArticleDateOnly(original);

      expect(iso).toBe("2025-11-01T00:00:00.000Z");
      expect(dateOnly).toBe("2025-11-01");
      expect(parsed.getUTCFullYear()).toBe(2025);
      expect(parsed.getUTCMonth()).toBe(10); // November
    });

    it("should handle leap years", () => {
      const feb2024 = parseArticleDate("Feb 2024");
      const feb2025 = parseArticleDate("Feb 2025");

      expect(feb2024.getUTCFullYear()).toBe(2024);
      expect(feb2025.getUTCFullYear()).toBe(2025);
    });

    it("should consistently handle UTC timezone", () => {
      const date = parseArticleDate("Jun 2024");
      // Verify it's midnight UTC
      expect(date.getUTCHours()).toBe(0);
      expect(date.getUTCMinutes()).toBe(0);
      expect(date.getUTCSeconds()).toBe(0);
      expect(date.getUTCMilliseconds()).toBe(0);
    });
  });
});