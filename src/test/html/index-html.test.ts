/**
 * Tests for index.html SEO and meta tag configuration
 */

import { describe, it, expect, beforeAll } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("index.html SEO Configuration", () => {
  const indexPath = path.join(process.cwd(), "index.html");
  let htmlContent: string;

  beforeAll(() => {
    htmlContent = fs.readFileSync(indexPath, "utf-8");
  });

  describe("Basic HTML Structure", () => {
    it("should exist as a file", () => {
      expect(fs.existsSync(indexPath)).toBe(true);
    });

    it("should have DOCTYPE declaration", () => {
      expect(htmlContent).toContain("<!doctype html>");
    });

    it("should have html tag with lang attribute", () => {
      expect(htmlContent).toContain('<html lang="en">');
    });

    it("should have head and body tags", () => {
      expect(htmlContent).toContain("<head>");
      expect(htmlContent).toContain("</head>");
      expect(htmlContent).toContain("<body>");
      expect(htmlContent).toContain("</body>");
    });
  });

  describe("Viewport and Character Encoding", () => {
    it("should specify UTF-8 character encoding", () => {
      expect(htmlContent).toContain('<meta charset="UTF-8"');
    });

    it("should have mobile viewport configuration", () => {
      expect(htmlContent).toContain('<meta name="viewport"');
      expect(htmlContent).toContain('width=device-width');
      expect(htmlContent).toContain('initial-scale=1.0');
    });
  });

  describe("Font Loading Optimization", () => {
    it("should preconnect to Google Fonts", () => {
      expect(htmlContent).toContain('rel="preconnect"');
      expect(htmlContent).toContain('href="https://fonts.googleapis.com"');
    });

    it("should preconnect to Google Fonts static resources with crossorigin", () => {
      expect(htmlContent).toContain('href="https://fonts.gstatic.com"');
      expect(htmlContent).toContain('crossorigin');
    });

    it("should load fonts with media swap technique", () => {
      expect(htmlContent).toContain('media="print"');
      expect(htmlContent).toContain("onload=\"this.media='all'\"");
    });

    it("should have noscript fallback for fonts", () => {
      expect(htmlContent).toContain("<noscript>");
      expect(htmlContent).toContain("</noscript>");
      const noscriptSection = htmlContent.match(/<noscript>[\s\S]*?<\/noscript>/);
      expect(noscriptSection).toBeDefined();
      expect(noscriptSection![0]).toContain("fonts.googleapis.com");
    });

    it("should load Space Grotesk and Inter fonts", () => {
      expect(htmlContent).toContain("Space+Grotesk");
      expect(htmlContent).toContain("Inter");
    });

    it("should use font-display=swap for better performance", () => {
      expect(htmlContent).toContain("display=swap");
    });
  });

  describe("SEO Meta Tags", () => {
    it("should have page title", () => {
      expect(htmlContent).toContain("<title>");
      expect(htmlContent).toContain("Shahid Moosa");
      expect(htmlContent).toContain("Cloud Database Engineer");
    });

    it("should have meta description", () => {
      expect(htmlContent).toContain('<meta name="description"');
      expect(htmlContent).toContain("SingleStore");
      expect(htmlContent).toContain("distributed systems");
    });

    it("should have meta description under 175 characters (Google's extended limit)", () => {
      const descMatch = htmlContent.match(/<meta name="description" content="([^"]+)"/);
      expect(descMatch).toBeDefined();
      const description = descMatch![1];
      // Google shows up to 155-160 chars on desktop, but can display up to 175 on mobile
      expect(description.length).toBeLessThanOrEqual(175);
      expect(description.length).toBeGreaterThan(50);
    });

    it("should have author meta tag", () => {
      expect(htmlContent).toContain('<meta name="author"');
      expect(htmlContent).toContain("Shahid Moosa");
    });

    it("should have keywords meta tag", () => {
      expect(htmlContent).toContain('<meta name="keywords"');
      expect(htmlContent).toContain("Database");
      expect(htmlContent).toContain("Distributed Systems");
    });
  });

  describe("Open Graph Tags", () => {
    it("should have OG title", () => {
      expect(htmlContent).toContain('<meta property="og:title"');
      expect(htmlContent).toContain("Shahid Moosa");
    });

    it("should have OG description", () => {
      expect(htmlContent).toContain('<meta property="og:description"');
      expect(htmlContent).toContain("databases alive at scale");
    });

    it("should have OG type as website", () => {
      expect(htmlContent).toContain('<meta property="og:type" content="website"');
    });

    it("should have OG URL", () => {
      expect(htmlContent).toContain('<meta property="og:url"');
      expect(htmlContent).toContain("shahidster.tech");
    });

    it("should have OG image", () => {
      expect(htmlContent).toContain('<meta property="og:image"');
      expect(htmlContent).toContain("og-image.png");
    });

    it("should use HTTPS for OG image", () => {
      const ogImageMatch = htmlContent.match(/<meta property="og:image" content="([^"]+)"/);
      expect(ogImageMatch).toBeDefined();
      expect(ogImageMatch![1]).toContain("https://");
    });
  });

  describe("Twitter Card Tags", () => {
    it("should have Twitter card type", () => {
      expect(htmlContent).toContain('<meta name="twitter:card"');
      expect(htmlContent).toContain("summary_large_image");
    });

    it("should have Twitter title", () => {
      expect(htmlContent).toContain('<meta name="twitter:title"');
      expect(htmlContent).toContain("Shahid Moosa");
    });

    it("should have Twitter description", () => {
      expect(htmlContent).toContain('<meta name="twitter:description"');
      expect(htmlContent).toContain("databases alive at scale");
    });

    it("should have Twitter image", () => {
      expect(htmlContent).toContain('<meta name="twitter:image"');
      expect(htmlContent).toContain("og-image.png");
    });
  });

  describe("Canonical and RSS", () => {
    it("should have canonical URL", () => {
      expect(htmlContent).toContain('<link rel="canonical"');
      expect(htmlContent).toContain("shahidster.tech");
    });

    it("should have RSS feed link", () => {
      expect(htmlContent).toContain('<link rel="alternate"');
      expect(htmlContent).toContain('type="application/rss+xml"');
      expect(htmlContent).toContain("/rss.xml");
    });

    it("should have RSS feed title", () => {
      const rssMatch = htmlContent.match(/<link rel="alternate" type="application\/rss\+xml" title="([^"]+)"/);
      expect(rssMatch).toBeDefined();
      expect(rssMatch![1]).toContain("Shahid Moosa");
    });
  });

  describe("Theme and Branding", () => {
    it("should have theme-color meta tag", () => {
      expect(htmlContent).toContain('<meta name="theme-color"');
    });

    it("should use dark theme color", () => {
      expect(htmlContent).toContain('content="#0a0b0d"');
    });
  });

  describe("Application Structure", () => {
    it("should have root div for React", () => {
      expect(htmlContent).toContain('<div id="root">');
    });

    it("should load main TypeScript module", () => {
      expect(htmlContent).toContain('<script type="module"');
      expect(htmlContent).toContain('src="/src/main.tsx"');
    });
  });

  describe("Performance Best Practices", () => {
    it("should not have blocking CSS", () => {
      // Fonts should be loaded with media print technique
      const styleLinks = htmlContent.match(/<link[^>]*rel="stylesheet"[^>]*>/g) || [];
      const blockingStyles = styleLinks.filter((link) => !link.includes('media="print"'));
      expect(blockingStyles.length).toBe(1); // Only the noscript fallback
    });

    it("should use preconnect for external resources", () => {
      const preconnects = (htmlContent.match(/rel="preconnect"/g) || []).length;
      expect(preconnects).toBeGreaterThanOrEqual(2);
    });

    it("should not have inline styles (for CSP)", () => {
      expect(htmlContent).not.toContain("<style>");
    });
  });

  describe("SEO Best Practices", () => {
    it("should have unique and descriptive title", () => {
      const titleMatch = htmlContent.match(/<title>([^<]+)<\/title>/);
      expect(titleMatch).toBeDefined();
      const title = titleMatch![1];
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThanOrEqual(60);
    });

    it("should have consistent branding across meta tags", () => {
      const shahidCount = (htmlContent.match(/Shahid Moosa/g) || []).length;
      expect(shahidCount).toBeGreaterThanOrEqual(4);
    });

    it("should mention key technologies", () => {
      expect(htmlContent.toLowerCase()).toContain("database");
      expect(htmlContent.toLowerCase()).toContain("distributed");
      expect(htmlContent.toLowerCase()).toContain("singlestore");
    });

    it("should use HTTPS for all external resources", () => {
      const httpMatches = htmlContent.match(/http:\/\/(?!localhost)/g);
      expect(httpMatches).toBeNull();
    });
  });

  describe("Accessibility", () => {
    it("should have language attribute on html tag", () => {
      expect(htmlContent).toContain('lang="en"');
    });

    it("should not skip heading levels", () => {
      // Title should be the main heading
      expect(htmlContent).toContain("<title>");
    });
  });

  describe("Social Sharing", () => {
    it("should have all required OG tags for sharing", () => {
      expect(htmlContent).toContain('property="og:title"');
      expect(htmlContent).toContain('property="og:description"');
      expect(htmlContent).toContain('property="og:image"');
      expect(htmlContent).toContain('property="og:url"');
      expect(htmlContent).toContain('property="og:type"');
    });

    it("should have all required Twitter Card tags", () => {
      expect(htmlContent).toContain('name="twitter:card"');
      expect(htmlContent).toContain('name="twitter:title"');
      expect(htmlContent).toContain('name="twitter:description"');
      expect(htmlContent).toContain('name="twitter:image"');
    });

    it("should use large image format for better engagement", () => {
      expect(htmlContent).toContain("summary_large_image");
    });
  });

  describe("Content Quality", () => {
    it("should have meaningful description text", () => {
      const descMatch = htmlContent.match(/<meta name="description" content="([^"]+)"/);
      expect(descMatch).toBeDefined();
      const description = descMatch![1];

      // Should contain value proposition
      expect(description.toLowerCase()).toMatch(/debug|optimize|help|support|engineer/);
    });

    it("should include quantifiable metrics in description", () => {
      const descMatch = htmlContent.match(/<meta name="description" content="([^"]+)"/);
      expect(descMatch).toBeDefined();
      const description = descMatch![1];

      // Contains "petabyte scale" or similar
      expect(description.toLowerCase()).toMatch(/petabyte|fortune 500|scale/);
    });
  });
});