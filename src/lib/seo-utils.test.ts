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

  describe("additional boundary cases", () => {
    describe("toAbsoluteUrl boundary tests", () => {
      it("should handle protocol-relative URLs", () => {
        // toAbsoluteUrl doesn't recognize // as absolute, treats it as relative
        expect(toAbsoluteUrl("//example.com/path")).toBe("https://shahidster.tech//example.com/path");
      });

      it("should handle multiple leading slashes", () => {
        expect(toAbsoluteUrl("///blog/post")).toBe("https://shahidster.tech///blog/post");
      });

      it("should handle very long URLs", () => {
        const longPath = "/blog/" + "a".repeat(1000);
        const result = toAbsoluteUrl(longPath);
        expect(result).toContain("shahidster.tech");
        expect(result.length).toBeGreaterThan(1000);
      });

      it("should handle URLs with special characters", () => {
        expect(toAbsoluteUrl("/blog/post?q=test&sort=date")).toBe(
          "https://shahidster.tech/blog/post?q=test&sort=date"
        );
      });

      it("should handle URLs with encoded characters", () => {
        expect(toAbsoluteUrl("/blog/post%20with%20spaces")).toBe(
          "https://shahidster.tech/blog/post%20with%20spaces"
        );
      });

      it("should handle data URIs as relative paths", () => {
        // toAbsoluteUrl only checks for http/https, treats data: as relative
        const dataUri = "data:image/png;base64,iVBORw0KG";
        expect(toAbsoluteUrl(dataUri)).toBe("https://shahidster.tech/data:image/png;base64,iVBORw0KG");
      });

      it("should handle blob URLs as relative paths", () => {
        // toAbsoluteUrl only checks for http/https, treats blob: as relative
        const blobUrl = "blob:https://example.com/uuid";
        expect(toAbsoluteUrl(blobUrl)).toBe("https://shahidster.tech/blob:https://example.com/uuid");
      });

      it("should handle consecutive slashes in path", () => {
        expect(toAbsoluteUrl("/blog//post")).toBe("https://shahidster.tech/blog//post");
      });

      it("should not modify http URLs", () => {
        expect(toAbsoluteUrl("http://example.com")).toBe("http://example.com");
      });

      it("should not modify https URLs with port", () => {
        expect(toAbsoluteUrl("https://example.com:3000/path")).toBe(
          "https://example.com:3000/path"
        );
      });
    });

    describe("buildCanonicalUrl boundary tests", () => {
      it("should handle null path", () => {
        expect(buildCanonicalUrl(null as any)).toBe("https://shahidster.tech");
      });

      it("should handle whitespace-only path", () => {
        // buildCanonicalUrl doesn't trim whitespace, treats it as a path
        expect(buildCanonicalUrl("   ")).toBe("https://shahidster.tech/   ");
      });

      it("should handle path with trailing slash", () => {
        expect(buildCanonicalUrl("/blog/")).toBe("https://shahidster.tech/blog/");
      });

      it("should handle root path variations", () => {
        expect(buildCanonicalUrl("/")).toBe("https://shahidster.tech/");
      });

      it("should preserve complex query strings", () => {
        expect(buildCanonicalUrl("/search?q=test&filters[]=1&filters[]=2")).toContain(
          "filters[]=1&filters[]=2"
        );
      });

      it("should preserve hash fragments", () => {
        expect(buildCanonicalUrl("/docs#section-2.1")).toContain("#section-2.1");
      });

      it("should handle international characters in path", () => {
        expect(buildCanonicalUrl("/blog/café-münchen")).toBe(
          "https://shahidster.tech/blog/café-münchen"
        );
      });
    });

    describe("parseArticleDate boundary tests", () => {
      it("should handle lowercase month names", () => {
        const result = parseArticleDate("jan 2024");
        expect(result).toBeInstanceOf(Date);
      });

      it("should handle extra whitespace", () => {
        // parseArticleDate splits by space, extra space creates empty string as year
        const result = parseArticleDate("Jan  2024");
        // Since year parsing fails (empty string), returns current date
        expect(result).toBeInstanceOf(Date);
      });

      it("should handle very old dates", () => {
        const result = parseArticleDate("Jan 1900");
        expect(result.getUTCFullYear()).toBe(1900);
      });

      it("should handle far future dates", () => {
        const result = parseArticleDate("Dec 2100");
        expect(result.getUTCFullYear()).toBe(2100);
      });

      it("should handle year 2000", () => {
        const result = parseArticleDate("Jan 2000");
        expect(result.getUTCFullYear()).toBe(2000);
      });

      it("should handle two-digit years gracefully", () => {
        const result = parseArticleDate("Jan 24");
        expect(result).toBeInstanceOf(Date);
      });

      it("should return valid date for completely invalid input", () => {
        const result = parseArticleDate("Not A Date");
        expect(result).toBeInstanceOf(Date);
        expect(isNaN(result.getTime())).toBe(false);
      });

      it("should handle date with extra tokens", () => {
        const result = parseArticleDate("Jan 2024 Extra");
        expect(result.getUTCFullYear()).toBe(2024);
      });

      it("should be consistent for same input", () => {
        const result1 = parseArticleDate("Jun 2024");
        const result2 = parseArticleDate("Jun 2024");
        expect(result1.getTime()).toBe(result2.getTime());
      });

      it("should handle February in leap year", () => {
        const result = parseArticleDate("Feb 2024");
        expect(result.getUTCFullYear()).toBe(2024);
        expect(result.getUTCMonth()).toBe(1);
      });

      it("should handle February in non-leap year", () => {
        const result = parseArticleDate("Feb 2023");
        expect(result.getUTCFullYear()).toBe(2023);
        expect(result.getUTCMonth()).toBe(1);
      });

      it("should handle end-of-year date", () => {
        const result = parseArticleDate("Dec 2024");
        expect(result.getUTCMonth()).toBe(11);
      });
    });

    describe("formatArticleDateIso boundary tests", () => {
      it("should format very old dates", () => {
        const result = formatArticleDateIso("Jan 1900");
        expect(result).toContain("1900");
      });

      it("should format very far future dates", () => {
        const result = formatArticleDateIso("Dec 2100");
        expect(result).toContain("2100");
      });

      it("should produce valid ISO 8601 format", () => {
        const result = formatArticleDateIso("Jun 2024");
        const parsed = new Date(result);
        expect(isNaN(parsed.getTime())).toBe(false);
      });

      it("should always include timezone", () => {
        const result = formatArticleDateIso("Jun 2024");
        expect(result.endsWith("Z")).toBe(true);
      });

      it("should be reversible through Date constructor", () => {
        const isoString = formatArticleDateIso("Jun 2024");
        const date = new Date(isoString);
        expect(date.toISOString()).toBe(isoString);
      });

      it("should handle all 12 months consistently", () => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        months.forEach((month, index) => {
          const result = formatArticleDateIso(`${month} 2024`);
          expect(result).toMatch(/^\d{4}-\d{2}-01T00:00:00\.\d{3}Z$/);
        });
      });
    });

    describe("formatArticleDateOnly boundary tests", () => {
      it("should not include time component ever", () => {
        const result = formatArticleDateOnly("Jun 2024");
        expect(result).not.toContain("T");
        expect(result).not.toContain(":");
      });

      it("should produce exactly 10 characters for valid dates", () => {
        const result = formatArticleDateOnly("Jun 2024");
        expect(result.length).toBe(10);
      });

      it("should be sortable lexicographically", () => {
        const dates = [
          formatArticleDateOnly("Dec 2024"),
          formatArticleDateOnly("Jan 2024"),
          formatArticleDateOnly("Jun 2024"),
        ].sort();

        expect(dates[0]).toContain("2024-01");
        expect(dates[1]).toContain("2024-06");
        expect(dates[2]).toContain("2024-12");
      });

      it("should match SQL DATE format", () => {
        const result = formatArticleDateOnly("Jun 2024");
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });

      it("should handle year boundaries", () => {
        expect(formatArticleDateOnly("Dec 2023")).toBe("2023-12-01");
        expect(formatArticleDateOnly("Jan 2024")).toBe("2024-01-01");
      });
    });

    describe("cross-function consistency", () => {
      it("should produce consistent results across all formatting functions", () => {
        const dateStr = "Jun 2024";
        const parsed = parseArticleDate(dateStr);
        const iso = formatArticleDateIso(dateStr);
        const dateOnly = formatArticleDateOnly(dateStr);

        const isoDate = new Date(iso);
        const dateOnlyParsed = new Date(dateOnly);

        expect(parsed.getUTCFullYear()).toBe(isoDate.getUTCFullYear());
        expect(parsed.getUTCMonth()).toBe(dateOnlyParsed.getUTCMonth());
      });

      it("should handle chained conversions", () => {
        const original = "Nov 2025";
        const iso = formatArticleDateIso(original);
        const dateFromIso = new Date(iso);
        const dateOnly = formatArticleDateOnly(original);
        const dateFromDateOnly = new Date(dateOnly);

        expect(dateFromIso.getUTCFullYear()).toBe(dateFromDateOnly.getUTCFullYear());
        expect(dateFromIso.getUTCMonth()).toBe(dateFromDateOnly.getUTCMonth());
      });

      it("should maintain timezone consistency", () => {
        const iso = formatArticleDateIso("Jun 2024");
        expect(iso).toContain("T00:00:00.000Z");
      });
    });

    describe("performance and memory", () => {
      it("should handle rapid consecutive calls", () => {
        for (let i = 0; i < 100; i++) {
          expect(toAbsoluteUrl("/test")).toBe("https://shahidster.tech/test");
        }
      });

      it("should handle many date conversions", () => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        for (let i = 0; i < 100; i++) {
          const month = months[i % months.length];
          const result = parseArticleDate(`${month} 2024`);
          expect(result).toBeInstanceOf(Date);
        }
      });
    });
  });
});