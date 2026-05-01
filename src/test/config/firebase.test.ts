import { describe, it, expect } from "vitest";
import firebaseConfig from "../../../firebase.json";

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
        (h: any) => h.source.includes(".@(jpg|jpeg|gif|png|svg|webp|ico|avif)")
      );
      expect(imageHeaders).toBeDefined();
      expect(imageHeaders?.headers).toBeDefined();
      const cacheControl = imageHeaders?.headers.find((h: any) => h.key === "Cache-Control");
      expect(cacheControl?.value).toContain("max-age=31536000");
      expect(cacheControl?.value).toContain("immutable");
    });

    it("should configure cache headers for JS and CSS", () => {
      const jsHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source.includes(".@(js|css)")
      );
      expect(jsHeaders).toBeDefined();
      const cacheControl = jsHeaders?.headers.find((h: any) => h.key === "Cache-Control");
      expect(cacheControl?.value).toContain("max-age=31536000");
    });

    it("should configure security headers for HTML", () => {
      const htmlHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source === "**/*.html"
      );
      expect(htmlHeaders).toBeDefined();

      const headers = htmlHeaders?.headers;
      const securityHeaders = headers?.map((h: any) => h.key);

      expect(securityHeaders).toContain("X-Content-Type-Options");
      expect(securityHeaders).toContain("X-Frame-Options");
      expect(securityHeaders).toContain("X-XSS-Protection");
      expect(securityHeaders).toContain("Referrer-Policy");
      expect(securityHeaders).toContain("Permissions-Policy");
    });

    it("should set X-Frame-Options to DENY for HTML", () => {
      const htmlHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source === "**/*.html"
      );
      const xFrameOptions = htmlHeaders?.headers.find((h: any) => h.key === "X-Frame-Options");
      expect(xFrameOptions?.value).toBe("DENY");
    });

    it("should configure sitemap.xml headers", () => {
      const sitemapHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source === "/sitemap.xml"
      );
      expect(sitemapHeaders).toBeDefined();

      const contentType = sitemapHeaders?.headers.find((h: any) => h.key === "Content-Type");
      expect(contentType?.value).toContain("application/xml");
    });

    it("should configure RSS feed headers", () => {
      const rssHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source === "/rss.xml"
      );
      expect(rssHeaders).toBeDefined();

      const contentType = rssHeaders?.headers.find((h: any) => h.key === "Content-Type");
      expect(contentType?.value).toContain("application/rss+xml");
    });

    it("should configure robots.txt headers", () => {
      const robotsHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source === "/robots.txt"
      );
      expect(robotsHeaders).toBeDefined();

      const contentType = robotsHeaders?.headers.find((h: any) => h.key === "Content-Type");
      expect(contentType?.value).toContain("text/plain");
    });
  });

  describe("Redirects Configuration", () => {
    it("should have redirects array", () => {
      expect(firebaseConfig.hosting.redirects).toBeDefined();
      expect(Array.isArray(firebaseConfig.hosting.redirects)).toBe(true);
    });

    it("should redirect /home to root with 301", () => {
      const homeRedirect = firebaseConfig.hosting.redirects.find(
        (r: any) => r.source === "/home"
      );
      expect(homeRedirect).toBeDefined();
      expect(homeRedirect?.destination).toBe("/");
      expect(homeRedirect?.type).toBe(301);
    });

    it("should redirect /index.html to root", () => {
      const indexRedirect = firebaseConfig.hosting.redirects.find(
        (r: any) => r.source === "/index.html"
      );
      expect(indexRedirect).toBeDefined();
      expect(indexRedirect?.destination).toBe("/");
      expect(indexRedirect?.type).toBe(301);
    });

    it("should redirect legacy article URLs to blog", () => {
      const articleRedirect = firebaseConfig.hosting.redirects.find(
        (r: any) => r.source === "/articles/:slug"
      );
      expect(articleRedirect).toBeDefined();
      expect(articleRedirect?.destination).toBe("/blog/:slug");
      expect(articleRedirect?.type).toBe(301);
    });

    it("should redirect /feed to /rss.xml", () => {
      const feedRedirect = firebaseConfig.hosting.redirects.find(
        (r: any) => r.source === "/feed"
      );
      expect(feedRedirect).toBeDefined();
      expect(feedRedirect?.destination).toBe("/rss.xml");
      expect(feedRedirect?.type).toBe(301);
    });

    it("should redirect /resume and /cv to /resume.pdf", () => {
      const resumeRedirect = firebaseConfig.hosting.redirects.find(
        (r: any) => r.source === "/resume"
      );
      const cvRedirect = firebaseConfig.hosting.redirects.find(
        (r: any) => r.source === "/cv"
      );

      expect(resumeRedirect?.destination).toBe("/resume.pdf");
      expect(cvRedirect?.destination).toBe("/resume.pdf");
    });

    it("should use 301 (permanent) redirects for SEO", () => {
      const allRedirects = firebaseConfig.hosting.redirects;
      const all301 = allRedirects.every((r: any) => r.type === 301);
      expect(all301).toBe(true);
    });
  });

  describe("Rewrites Configuration", () => {
    it("should have rewrites array", () => {
      expect(firebaseConfig.hosting.rewrites).toBeDefined();
      expect(Array.isArray(firebaseConfig.hosting.rewrites)).toBe(true);
    });

    it("should rewrite blog routes to dynamic page", () => {
      const blogRewrite = firebaseConfig.hosting.rewrites.find(
        (r: any) => r.source === "/blog/**"
      );
      expect(blogRewrite).toBeDefined();
      expect(blogRewrite?.destination).toBe("/blog/[slug].html");
    });

    it("should have catch-all rewrite to index.html for SPA", () => {
      const catchAll = firebaseConfig.hosting.rewrites.find(
        (r: any) => r.source === "**"
      );
      expect(catchAll).toBeDefined();
      expect(catchAll?.destination).toBe("/index.html");
    });
  });

  describe("SEO Best Practices", () => {
    it("should not cache HTML files (for fresh content)", () => {
      const htmlHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source === "**/*.html"
      );
      const cacheControl = htmlHeaders?.headers.find((h: any) => h.key === "Cache-Control");
      expect(cacheControl?.value).toContain("must-revalidate");
    });

    it("should cache static assets aggressively", () => {
      const imageHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source.includes(".@(jpg|jpeg|gif|png|svg|webp|ico|avif)")
      );
      const cacheControl = imageHeaders?.headers.find((h: any) => h.key === "Cache-Control");
      // One year in seconds
      expect(cacheControl?.value).toContain("31536000");
    });

    it("should have proper Content-Type for feeds", () => {
      const rssHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source === "/rss.xml"
      );
      const sitemapHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source === "/sitemap.xml"
      );

      expect(rssHeaders?.headers.find((h: any) => h.key === "Content-Type")).toBeDefined();
      expect(sitemapHeaders?.headers.find((h: any) => h.key === "Content-Type")).toBeDefined();
    });
  });

  describe("Security Configuration", () => {
    it("should prevent clickjacking with X-Frame-Options", () => {
      const htmlHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source === "**/*.html"
      );
      const xFrameOptions = htmlHeaders?.headers.find((h: any) => h.key === "X-Frame-Options");
      expect(xFrameOptions).toBeDefined();
    });

    it("should prevent MIME type sniffing", () => {
      const htmlHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source === "**/*.html"
      );
      const xContentType = htmlHeaders?.headers.find((h: any) => h.key === "X-Content-Type-Options");
      expect(xContentType?.value).toBe("nosniff");
    });

    it("should enable XSS protection", () => {
      const htmlHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source === "**/*.html"
      );
      const xssProtection = htmlHeaders?.headers.find((h: any) => h.key === "X-XSS-Protection");
      expect(xssProtection?.value).toBe("1; mode=block");
    });

    it("should set Referrer-Policy", () => {
      const htmlHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source === "**/*.html"
      );
      const referrerPolicy = htmlHeaders?.headers.find((h: any) => h.key === "Referrer-Policy");
      expect(referrerPolicy).toBeDefined();
      expect(referrerPolicy?.value).toBe("strict-origin-when-cross-origin");
    });

    it("should restrict permissions with Permissions-Policy", () => {
      const htmlHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source === "**/*.html"
      );
      const permissionsPolicy = htmlHeaders?.headers.find((h: any) => h.key === "Permissions-Policy");
      expect(permissionsPolicy).toBeDefined();
      expect(permissionsPolicy?.value).toContain("camera=()");
      expect(permissionsPolicy?.value).toContain("microphone=()");
    });
  });

  describe("Edge Cases and Boundary Tests", () => {
    it("should have valid JSON structure", () => {
      expect(firebaseConfig).toBeDefined();
      expect(typeof firebaseConfig).toBe("object");
    });

    it("should not have empty headers array", () => {
      expect(firebaseConfig.hosting.headers.length).toBeGreaterThan(0);
    });

    it("should not have empty redirects array", () => {
      expect(firebaseConfig.hosting.redirects.length).toBeGreaterThan(0);
    });

    it("should not have duplicate redirect sources", () => {
      const sources = firebaseConfig.hosting.redirects.map((r: any) => r.source);
      const uniqueSources = new Set(sources);
      expect(sources.length).toBe(uniqueSources.size);
    });

    it("should have all redirects with valid destinations", () => {
      firebaseConfig.hosting.redirects.forEach((redirect: any) => {
        expect(redirect.destination).toBeDefined();
        expect(redirect.destination.length).toBeGreaterThan(0);
      });
    });

    it("should not redirect to itself", () => {
      firebaseConfig.hosting.redirects.forEach((redirect: any) => {
        expect(redirect.source).not.toBe(redirect.destination);
      });
    });

    it("should have font cache headers", () => {
      const fontHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source.includes("woff")
      );
      expect(fontHeaders).toBeDefined();
      const cacheControl = fontHeaders?.headers.find((h: any) => h.key === "Cache-Control");
      expect(cacheControl?.value).toContain("max-age=31536000");
    });

    it("should configure feed.json headers", () => {
      const feedHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source === "/feed.json"
      );
      expect(feedHeaders).toBeDefined();
      const contentType = feedHeaders?.headers.find((h: any) => h.key === "Content-Type");
      expect(contentType?.value).toContain("application/feed+json");
    });

    it("should redirect /sitemap to /sitemap.xml", () => {
      const sitemapRedirect = firebaseConfig.hosting.redirects.find(
        (r: any) => r.source === "/sitemap"
      );
      expect(sitemapRedirect?.destination).toBe("/sitemap.xml");
    });

    it("should have blog URL pattern rewrites", () => {
      const blogRewrite = firebaseConfig.hosting.rewrites.find(
        (r: any) => r.source === "/blog/**"
      );
      expect(blogRewrite).toBeDefined();
      expect(blogRewrite?.destination).toContain("[slug]");
    });

    it("should ignore source files and docs", () => {
      expect(firebaseConfig.hosting.ignore).toContain("**/*.md");
      expect(firebaseConfig.hosting.ignore).toContain("**/*.ts");
      expect(firebaseConfig.hosting.ignore).toContain("**/*.tsx");
      expect(firebaseConfig.hosting.ignore).toContain("src/**");
      expect(firebaseConfig.hosting.ignore).toContain("docs/**");
    });
  });
});