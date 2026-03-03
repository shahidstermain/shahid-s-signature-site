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
    it("should return absolute URL unchanged when starts with http://", () => {
      const url = "http://example.com/page";
      expect(toAbsoluteUrl(url)).toBe(url);
    });

    it("should return absolute URL unchanged when starts with https://", () => {
      const url = "https://example.com/page";
      expect(toAbsoluteUrl(url)).toBe(url);
    });

    it("should prepend site URL to relative path starting with /", () => {
      const path = "/blog/article";
      expect(toAbsoluteUrl(path)).toBe(`${siteConfig.siteUrl}/blog/article`);
    });

    it("should prepend site URL and / to relative path not starting with /", () => {
      const path = "blog/article";
      expect(toAbsoluteUrl(path)).toBe(`${siteConfig.siteUrl}/blog/article`);
    });

    it("should handle empty string by prepending site URL and /", () => {
      expect(toAbsoluteUrl("")).toBe(`${siteConfig.siteUrl}/`);
    });

    it("should handle root path", () => {
      expect(toAbsoluteUrl("/")).toBe(`${siteConfig.siteUrl}/`);
    });
  });

  describe("buildCanonicalUrl", () => {
    it("should return site URL when no path provided", () => {
      expect(buildCanonicalUrl()).toBe(siteConfig.siteUrl);
    });

    it("should return site URL when undefined path provided", () => {
      expect(buildCanonicalUrl(undefined)).toBe(siteConfig.siteUrl);
    });

    it("should build canonical URL from relative path", () => {
      expect(buildCanonicalUrl("/blog/post")).toBe(
        `${siteConfig.siteUrl}/blog/post`
      );
    });

    it("should handle path without leading slash", () => {
      expect(buildCanonicalUrl("about")).toBe(`${siteConfig.siteUrl}/about`);
    });

    it("should preserve absolute URLs", () => {
      const absoluteUrl = "https://other-site.com/page";
      expect(buildCanonicalUrl(absoluteUrl)).toBe(absoluteUrl);
    });
  });

  describe("parseArticleDate", () => {
    it("should parse valid month and year correctly", () => {
      const result = parseArticleDate("Nov 2025");
      expect(result.getUTCFullYear()).toBe(2025);
      expect(result.getUTCMonth()).toBe(10); // Nov is month 10 (0-indexed)
      expect(result.getUTCDate()).toBe(1);
    });

    it("should parse Jan correctly as month 0", () => {
      const result = parseArticleDate("Jan 2024");
      expect(result.getUTCMonth()).toBe(0);
      expect(result.getUTCFullYear()).toBe(2024);
    });

    it("should parse Dec correctly as month 11", () => {
      const result = parseArticleDate("Dec 2025");
      expect(result.getUTCMonth()).toBe(11);
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
        const result = parseArticleDate(`${month} 2025`);
        expect(result.getUTCMonth()).toBe(index);
      });
    });

    it("should use month 0 (January) for invalid month", () => {
      const result = parseArticleDate("Invalid 2025");
      // Invalid month defaults to 0 (January)
      expect(result.getUTCMonth()).toBe(0);
      expect(result.getUTCFullYear()).toBe(2025);
    });

    it("should return current date for invalid year", () => {
      const beforeCall = Date.now();
      const result = parseArticleDate("Nov NotAYear");
      const afterCall = Date.now();
      expect(result.getTime()).toBeGreaterThanOrEqual(beforeCall);
      expect(result.getTime()).toBeLessThanOrEqual(afterCall);
    });

    it("should return current date for malformed input", () => {
      const beforeCall = Date.now();
      const result = parseArticleDate("malformed");
      const afterCall = Date.now();
      expect(result.getTime()).toBeGreaterThanOrEqual(beforeCall);
      expect(result.getTime()).toBeLessThanOrEqual(afterCall);
    });

    it("should handle empty string by returning current date", () => {
      const beforeCall = Date.now();
      const result = parseArticleDate("");
      const afterCall = Date.now();
      expect(result.getTime()).toBeGreaterThanOrEqual(beforeCall);
      expect(result.getTime()).toBeLessThanOrEqual(afterCall);
    });

    it("should handle date with extra spaces", () => {
      const result = parseArticleDate("Nov  2025");
      // Split on space gives ["Nov", "", "2025"], where year[1] = ""
      // parseInt("") is NaN, so it returns new Date()
      const beforeCall = Date.now();
      const afterCall = Date.now() + 1000;
      expect(result.getTime()).toBeGreaterThanOrEqual(beforeCall - 1000);
      expect(result.getTime()).toBeLessThanOrEqual(afterCall);
    });
  });

  describe("formatArticleDateIso", () => {
    it("should format date as ISO 8601 string", () => {
      const result = formatArticleDateIso("Nov 2025");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(result).toBe("2025-11-01T00:00:00.000Z");
    });

    it("should format January correctly", () => {
      const result = formatArticleDateIso("Jan 2024");
      expect(result).toBe("2024-01-01T00:00:00.000Z");
    });

    it("should format December correctly", () => {
      const result = formatArticleDateIso("Dec 2025");
      expect(result).toBe("2025-12-01T00:00:00.000Z");
    });

    it("should handle invalid date gracefully", () => {
      const result = formatArticleDateIso("Invalid 2025");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe("formatArticleDateOnly", () => {
    it("should format date as YYYY-MM-DD", () => {
      const result = formatArticleDateOnly("Nov 2025");
      expect(result).toBe("2025-11-01");
    });

    it("should format January correctly", () => {
      const result = formatArticleDateOnly("Jan 2024");
      expect(result).toBe("2024-01-01");
    });

    it("should format December correctly", () => {
      const result = formatArticleDateOnly("Dec 2025");
      expect(result).toBe("2025-12-01");
    });

    it("should only include date portion without time", () => {
      const result = formatArticleDateOnly("Sep 2025");
      expect(result).not.toContain("T");
      expect(result.split("-")).toHaveLength(3);
    });

    it("should handle invalid date gracefully", () => {
      const result = formatArticleDateOnly("Invalid 2025");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("edge cases and integration", () => {
    it("should handle round-trip parsing and formatting", () => {
      const dateStr = "Nov 2025";
      const parsed = parseArticleDate(dateStr);
      const isoFormatted = parsed.toISOString();
      expect(isoFormatted).toBe("2025-11-01T00:00:00.000Z");
    });

    it("should maintain UTC timezone consistency", () => {
      const result = parseArticleDate("Jun 2025");
      expect(result.getUTCHours()).toBe(0);
      expect(result.getUTCMinutes()).toBe(0);
      expect(result.getUTCSeconds()).toBe(0);
    });

    it("should handle year boundaries correctly", () => {
      const dec2024 = parseArticleDate("Dec 2024");
      const jan2025 = parseArticleDate("Jan 2025");
      expect(dec2024.getTime()).toBeLessThan(jan2025.getTime());
    });
  });
});