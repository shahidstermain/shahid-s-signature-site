import { describe, it, expect } from "vitest";
import {
  toAbsoluteUrl,
  buildCanonicalUrl,
  parseArticleDate,
  formatArticleDateIso,
  formatArticleDateOnly,
} from "../lib/seo-utils";

describe("SEO Utils", () => {
  describe("toAbsoluteUrl", () => {
    it("should return absolute URL unchanged", () => {
      const url = "https://example.com/page";
      expect(toAbsoluteUrl(url)).toBe(url);
    });

    it("should convert relative URL starting with slash", () => {
      const path = "/blog/article";
      expect(toAbsoluteUrl(path)).toBe("https://shahidster.tech/blog/article");
    });

    it("should add leading slash to path without it", () => {
      const path = "blog/article";
      expect(toAbsoluteUrl(path)).toBe("https://shahidster.tech/blog/article");
    });

    it("should handle http URLs", () => {
      const url = "http://example.com/page";
      expect(toAbsoluteUrl(url)).toBe(url);
    });

    it("should handle empty string", () => {
      const path = "";
      expect(toAbsoluteUrl(path)).toBe("https://shahidster.tech/");
    });

    it("should handle root path", () => {
      const path = "/";
      expect(toAbsoluteUrl(path)).toBe("https://shahidster.tech/");
    });
  });

  describe("buildCanonicalUrl", () => {
    it("should return site URL when no path provided", () => {
      expect(buildCanonicalUrl()).toBe("https://shahidster.tech");
    });

    it("should build canonical URL with path", () => {
      expect(buildCanonicalUrl("/blog/article")).toBe("https://shahidster.tech/blog/article");
    });
  });

  describe("parseArticleDate", () => {
    it("should parse valid date string", () => {
      const date = parseArticleDate("Jan 2026");
      expect(date.getUTCFullYear()).toBe(2026);
      expect(date.getUTCMonth()).toBe(0);
    });

    it("should parse all months correctly", () => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      months.forEach((month, idx) => {
        const date = parseArticleDate(`${month} 2025`);
        expect(date.getUTCMonth()).toBe(idx);
      });
    });

    it("should handle invalid month gracefully", () => {
      const date = parseArticleDate("Xyz 2026");
      expect(date.getUTCMonth()).toBe(0);
    });

    it("should handle invalid year gracefully", () => {
      const date = parseArticleDate("Jan ABC");
      expect(date).toBeInstanceOf(Date);
    });
  });

  describe("formatArticleDateIso", () => {
    it("should format date in ISO 8601 format", () => {
      const iso = formatArticleDateIso("Jan 2026");
      expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe("formatArticleDateOnly", () => {
    it("should format date as YYYY-MM-DD", () => {
      const dateOnly = formatArticleDateOnly("Jan 2026");
      expect(dateOnly).toBe("2026-01-01");
    });

    it("should not include time component", () => {
      const dateOnly = formatArticleDateOnly("Jan 2026");
      expect(dateOnly).not.toContain("T");
    });
  });
});