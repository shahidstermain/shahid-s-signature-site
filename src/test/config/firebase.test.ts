import { describe, it, expect } from "vitest";
import firebaseConfig from "../../../firebase.json";

interface FirebaseHeaderEntry {
  key: string;
  value: string;
}

interface FirebaseHeaderGroup {
  source: string;
  headers: FirebaseHeaderEntry[];
}

interface FirebaseRedirect {
  source: string;
  destination: string;
  type: number;
}

interface FirebaseRewrite {
  source: string;
  destination: string;
}

describe("firebase.json Configuration", () => {
  describe("Basic Structure", () => {
    it("should have hosting configuration", () => {
      expect(firebaseConfig).toHaveProperty("hosting");
      expect(firebaseConfig.hosting).toBeDefined();
    });

    it("should specify dist as public directory", () => {
      expect(firebaseConfig.hosting.public).toBe("dist");
    });

    it("should enable cleanUrls", () => {
      expect(firebaseConfig.hosting.cleanUrls).toBe(true);
    });

    it("should disable trailingSlash", () => {
      expect(firebaseConfig.hosting.trailingSlash).toBe(false);
    });

    it("should have ignore patterns", () => {
      expect(firebaseConfig.hosting.ignore).toBeDefined();
      expect(Array.isArray(firebaseConfig.hosting.ignore)).toBe(true);
    });
  });

  describe("Headers Configuration", () => {
    it("should have headers array", () => {
      expect(firebaseConfig.hosting.headers).toBeDefined();
      expect(Array.isArray(firebaseConfig.hosting.headers)).toBe(true);
    });

    it("should configure cache headers for images", () => {
      const imageHeaders = firebaseConfig.hosting.headers.find(
        (h) => h.source === "@(jpg|jpeg|gif|png|svg|ico|webp)"
      );
      expect(imageHeaders).toBeDefined();
      expect(imageHeaders?.headers).toBeDefined();
      const cacheControl = imageHeaders?.headers.find((h) => h.key === "Cache-Control");
      expect(cacheControl?.value).toContain("max-age=31536000");
      expect(cacheControl?.value).toContain("immutable");
    });

    it("should configure cache headers for JS and CSS", () => {
      const jsHeaders = firebaseConfig.hosting.headers.find(
        (h: FirebaseHeaderGroup) => h.source === "@(js|css)"
      );
      expect(jsHeaders).toBeDefined();
      const cacheControl = jsHeaders?.headers.find((h: FirebaseHeaderEntry) => h.key === "Cache-Control");
      expect(cacheControl?.value).toContain("max-age=31536000");
    });

    it("should configure security headers for HTML", () => {
      const htmlHeaders = firebaseConfig.hosting.headers.find(
        (h: FirebaseHeaderGroup) => h.source === "**/*.html"
      );
      expect(htmlHeaders).toBeDefined();

      const headers = htmlHeaders?.headers;
      const securityHeaders = headers?.map((h: FirebaseHeaderEntry) => h.key);

      expect(securityHeaders).toContain("X-Content-Type-Options");
      expect(securityHeaders).toContain("X-Frame-Options");
      expect(securityHeaders).toContain("X-XSS-Protection");
      expect(securityHeaders).toContain("Referrer-Policy");
    });

    it("should set X-Frame-Options to SAMEORIGIN for HTML", () => {
      const htmlHeaders = firebaseConfig.hosting.headers.find(
        (h: FirebaseHeaderGroup) => h.source === "**/*.html"
      );
      const xFrameOptions = htmlHeaders?.headers.find((h: FirebaseHeaderEntry) => h.key === "X-Frame-Options");
      expect(xFrameOptions?.value).toBe("SAMEORIGIN");
    });

    it("should configure sitemap.xml headers", () => {
      const sitemapHeaders = firebaseConfig.hosting.headers.find(
        (h: FirebaseHeaderGroup) => h.source === "/sitemap.xml"
      );
      expect(sitemapHeaders).toBeDefined();

      const contentType = sitemapHeaders?.headers.find((h: FirebaseHeaderEntry) => h.key === "Content-Type");
      expect(contentType?.value).toContain("application/xml");
    });

    it("should configure RSS feed headers", () => {
      const rssHeaders = firebaseConfig.hosting.headers.find(
        (h: FirebaseHeaderGroup) => h.source === "/rss.xml"
      );
      expect(rssHeaders).toBeDefined();

      const contentType = rssHeaders?.headers.find((h: FirebaseHeaderEntry) => h.key === "Content-Type");
      expect(contentType?.value).toContain("application/rss+xml");
    });

    it("should configure robots.txt headers", () => {
      const robotsHeaders = firebaseConfig.hosting.headers.find(
        (h: FirebaseHeaderGroup) => h.source === "/robots.txt"
      );
      expect(robotsHeaders).toBeDefined();

      const cacheControl = robotsHeaders?.headers.find(
        (h: FirebaseHeaderEntry) => h.key === "Cache-Control"
      );
      expect(cacheControl).toBeDefined();
    });
  });

  describe("Redirects Configuration", () => {
    it("should have redirects array", () => {
      expect(firebaseConfig.hosting.redirects).toBeDefined();
      expect(Array.isArray(firebaseConfig.hosting.redirects)).toBe(true);
    });

    it("should redirect /home to root with 301", () => {
      const homeRedirect = firebaseConfig.hosting.redirects.find(
        (r) => r.source === "/home"
      );
      expect(homeRedirect).toBeDefined();
      expect(homeRedirect?.destination).toBe("/");
      expect(homeRedirect?.type).toBe(301);
    });

    it("should redirect /index.html to root", () => {
      const indexRedirect = firebaseConfig.hosting.redirects.find(
        (r: FirebaseRedirect) => r.source === "/index.html"
      );
      expect(indexRedirect).toBeDefined();
      expect(indexRedirect?.destination).toBe("/");
      expect(indexRedirect?.type).toBe(301);
    });

    it("should redirect legacy article URLs to blog", () => {
      const articleRedirect = firebaseConfig.hosting.redirects.find(
        (r) => r.source === "/articles/**"
      );
      expect(articleRedirect).toBeDefined();
      expect(articleRedirect?.destination).toBe("/blog/:splat");
      expect(articleRedirect?.type).toBe(301);
    });

    it("should redirect /feed to /feed.json", () => {
      const feedRedirect = firebaseConfig.hosting.redirects.find(
        (r) => r.source === "/feed"
      );
      expect(feedRedirect).toBeDefined();
      expect(feedRedirect?.destination).toBe("/feed.json");
      expect(feedRedirect?.type).toBe(301);
    });

    it("should redirect /rss to /rss.xml", () => {
      const rssRedirect = firebaseConfig.hosting.redirects.find(
        (r) => r.source === "/rss"
      );
      expect(rssRedirect).toBeDefined();
      expect(rssRedirect?.destination).toBe("/rss.xml");
      expect(rssRedirect?.type).toBe(301);
    });

    it("should use 301 (permanent) redirects for SEO", () => {
      const allRedirects = firebaseConfig.hosting.redirects;
      const all301 = allRedirects.every((r) => r.type === 301);
      expect(all301).toBe(true);
    });
  });

  describe("Rewrites Configuration", () => {
    it("should have rewrites array", () => {
      expect(firebaseConfig.hosting.rewrites).toBeDefined();
      expect(Array.isArray(firebaseConfig.hosting.rewrites)).toBe(true);
    });

    it("should have catch-all rewrite to index.html for SPA", () => {
      const catchAll = firebaseConfig.hosting.rewrites.find(
        (r) => r.source === "**"
      );
      expect(catchAll).toBeDefined();
      expect(catchAll?.destination).toBe("/index.html");
    });
  });

  describe("SEO Best Practices", () => {
    it("should not cache HTML files (for fresh content)", () => {
      const htmlHeaders = firebaseConfig.hosting.headers.find(
        (h) => h.source === "**/*.html"
      );
      const cacheControl = htmlHeaders?.headers.find((h) => h.key === "Cache-Control");
      expect(cacheControl?.value).toContain("must-revalidate");
    });

    it("should cache static assets aggressively", () => {
      const imageHeaders = firebaseConfig.hosting.headers.find(
        (h) => h.source === "@(jpg|jpeg|gif|png|svg|ico|webp)"
      );
      const cacheControl = imageHeaders?.headers.find((h) => h.key === "Cache-Control");
      // One year in seconds
      expect(cacheControl?.value).toContain("31536000");
    });

    it("should have proper Content-Type for feeds", () => {
      const rssHeaders = firebaseConfig.hosting.headers.find(
        (h) => h.source === "/rss.xml"
      );
      const sitemapHeaders = firebaseConfig.hosting.headers.find(
        (h) => h.source === "/sitemap.xml"
      );

      expect(rssHeaders?.headers.find((h) => h.key === "Content-Type")).toBeDefined();
      expect(sitemapHeaders?.headers.find((h) => h.key === "Content-Type")).toBeDefined();
    });
  });

  describe("Security Configuration", () => {
    it("should prevent clickjacking with X-Frame-Options", () => {
      const htmlHeaders = firebaseConfig.hosting.headers.find(
        (h) => h.source === "**/*.html"
      );
      const xFrameOptions = htmlHeaders?.headers.find((h) => h.key === "X-Frame-Options");
      expect(xFrameOptions).toBeDefined();
    });

    it("should prevent MIME type sniffing", () => {
      const htmlHeaders = firebaseConfig.hosting.headers.find(
        (h) => h.source === "**/*.html"
      );
      const xContentType = htmlHeaders?.headers.find((h) => h.key === "X-Content-Type-Options");
      expect(xContentType?.value).toBe("nosniff");
    });

    it("should enable XSS protection", () => {
      const htmlHeaders = firebaseConfig.hosting.headers.find(
        (h) => h.source === "**/*.html"
      );
      const xssProtection = htmlHeaders?.headers.find((h) => h.key === "X-XSS-Protection");
      expect(xssProtection?.value).toBe("1; mode=block");
    });

    it("should set Referrer-Policy", () => {
      const htmlHeaders = firebaseConfig.hosting.headers.find(
        (h) => h.source === "**/*.html"
      );
      const referrerPolicy = htmlHeaders?.headers.find((h) => h.key === "Referrer-Policy");
      expect(referrerPolicy).toBeDefined();
      expect(referrerPolicy?.value).toBe("strict-origin-when-cross-origin");
    });

    it("should have Cache-Control header for HTML (not indefinitely cached)", () => {
      const htmlHeaders = firebaseConfig.hosting.headers.find(
        (h) => h.source === "**/*.html"
      );
      const cacheControl = htmlHeaders?.headers.find((h) => h.key === "Cache-Control");
      expect(cacheControl).toBeDefined();
    });
  });
});