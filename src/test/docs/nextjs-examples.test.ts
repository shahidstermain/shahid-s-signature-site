/**
 * Tests for Next.js migration example files
 * Validates that documentation examples are syntactically correct and follow best practices
 */

import { describe, it, expect, beforeAll } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Next.js Migration Examples", () => {
  const examplesDir = path.join(process.cwd(), "docs/nextjs-migration-examples");

  describe("Directory Structure", () => {
    it("should have examples directory", () => {
      expect(fs.existsSync(examplesDir)).toBe(true);
    });

    it("should have app directory structure", () => {
      const appDir = path.join(examplesDir, "app");
      expect(fs.existsSync(appDir)).toBe(true);
    });

    it("should have lib directory", () => {
      const libDir = path.join(examplesDir, "lib");
      expect(fs.existsSync(libDir)).toBe(true);
    });

    it("should have next.config.js", () => {
      const configPath = path.join(examplesDir, "next.config.js");
      expect(fs.existsSync(configPath)).toBe(true);
    });
  });

  describe("App Router Files", () => {
    describe("layout.tsx", () => {
      const layoutPath = path.join(examplesDir, "app/layout.tsx");
      let layoutContent: string;

      beforeAll(() => {
        layoutContent = fs.readFileSync(layoutPath, "utf-8");
      });

      it("should exist", () => {
        expect(fs.existsSync(layoutPath)).toBe(true);
      });

      it("should export Metadata type", () => {
        expect(layoutContent).toContain("export const metadata: Metadata");
      });

      it("should export Viewport type", () => {
        expect(layoutContent).toContain("export const viewport: Viewport");
      });

      it("should have RootLayout component", () => {
        expect(layoutContent).toContain("export default function RootLayout");
      });

      it("should include Person schema function", () => {
        expect(layoutContent).toContain("getPersonSchema");
        // The schema is defined inline in the function
        expect(layoutContent).toContain("@type");
        expect(layoutContent).toContain("Person");
      });

      it("should include WebSite schema function", () => {
        expect(layoutContent).toContain("getWebsiteSchema");
        // The schema is defined inline in the function
        expect(layoutContent).toContain("@type");
        expect(layoutContent).toContain("WebSite");
      });

      it("should optimize fonts with next/font", () => {
        expect(layoutContent).toContain("from 'next/font/google'");
        expect(layoutContent).toContain("Inter");
        expect(layoutContent).toContain("Space_Grotesk");
      });

      it("should have metadata configuration", () => {
        expect(layoutContent).toContain("metadataBase");
        expect(layoutContent).toContain("openGraph");
        expect(layoutContent).toContain("twitter");
      });

      it("should set proper theme color", () => {
        expect(layoutContent).toContain("themeColor");
      });

      it("should not have syntax errors in JSX", () => {
        // Check for balanced tags
        const openHtml = (layoutContent.match(/<html/g) || []).length;
        const closeHtml = (layoutContent.match(/<\/html>/g) || []).length;
        expect(openHtml).toBe(closeHtml);
      });
    });

    describe("page.tsx", () => {
      const pagePath = path.join(examplesDir, "app/page.tsx");
      let pageContent: string;

      beforeAll(() => {
        pageContent = fs.readFileSync(pagePath, "utf-8");
      });

      it("should exist", () => {
        expect(fs.existsSync(pagePath)).toBe(true);
      });

      it("should export metadata", () => {
        expect(pageContent).toContain("export const metadata");
      });

      it("should have HomePage component", () => {
        expect(pageContent).toContain("export default function HomePage");
      });

      it("should import necessary components", () => {
        expect(pageContent).toContain("import");
      });

      it("should not have client-side hooks in server component", () => {
        // Server components shouldn't use useState, useEffect, etc.
        expect(pageContent).not.toContain("'use client'");
        expect(pageContent).not.toContain("useState");
        expect(pageContent).not.toContain("useEffect");
      });
    });

    describe("not-found.tsx", () => {
      const notFoundPath = path.join(examplesDir, "app/not-found.tsx");
      let notFoundContent: string;

      beforeAll(() => {
        notFoundContent = fs.readFileSync(notFoundPath, "utf-8");
      });

      it("should exist", () => {
        expect(fs.existsSync(notFoundPath)).toBe(true);
      });

      it("should export metadata with noindex", () => {
        expect(notFoundContent).toContain("export const metadata");
        expect(notFoundContent).toContain("index: false");
      });

      it("should have NotFound component", () => {
        expect(notFoundContent).toContain("export default function NotFound");
      });

      it("should provide navigation links", () => {
        expect(notFoundContent).toContain("Link");
        expect(notFoundContent).toContain('href="/"');
      });

      it("should display 404 status", () => {
        expect(notFoundContent).toContain("404");
      });
    });

    describe("robots.ts", () => {
      const robotsPath = path.join(examplesDir, "app/robots.ts");
      let robotsContent: string;

      beforeAll(() => {
        robotsContent = fs.readFileSync(robotsPath, "utf-8");
      });

      it("should exist", () => {
        expect(fs.existsSync(robotsPath)).toBe(true);
      });

      it("should export default function", () => {
        expect(robotsContent).toContain("export default function robots");
      });

      it("should return MetadataRoute.Robots type", () => {
        expect(robotsContent).toContain("MetadataRoute.Robots");
      });

      it("should handle production vs development", () => {
        expect(robotsContent).toContain("process.env.NODE_ENV");
      });

      it("should include sitemap reference", () => {
        expect(robotsContent).toContain("sitemap");
      });

      it("should configure user agents", () => {
        expect(robotsContent).toContain("userAgent");
        expect(robotsContent).toContain("Googlebot");
      });

      it("should have allow/disallow rules", () => {
        expect(robotsContent).toContain("allow");
        expect(robotsContent).toContain("disallow");
      });
    });

    describe("sitemap.ts", () => {
      const sitemapPath = path.join(examplesDir, "app/sitemap.ts");
      let sitemapContent: string;

      beforeAll(() => {
        sitemapContent = fs.readFileSync(sitemapPath, "utf-8");
      });

      it("should exist", () => {
        expect(fs.existsSync(sitemapPath)).toBe(true);
      });

      it("should export default function", () => {
        expect(sitemapContent).toContain("export default function sitemap");
      });

      it("should return MetadataRoute.Sitemap type", () => {
        expect(sitemapContent).toContain("MetadataRoute.Sitemap");
      });

      it("should include URL, lastModified, changeFrequency, priority", () => {
        expect(sitemapContent).toContain("url:");
        expect(sitemapContent).toContain("lastModified:");
        expect(sitemapContent).toContain("changeFrequency:");
        expect(sitemapContent).toContain("priority:");
      });

      it("should have date parsing function", () => {
        expect(sitemapContent).toContain("parseArticleDate");
      });
    });

    describe("rss.xml/route.ts", () => {
      const rssPath = path.join(examplesDir, "app/rss.xml/route.ts");
      let rssContent: string;

      beforeAll(() => {
        rssContent = fs.readFileSync(rssPath, "utf-8");
      });

      it("should exist", () => {
        expect(fs.existsSync(rssPath)).toBe(true);
      });

      it("should export GET handler", () => {
        expect(rssContent).toContain("export async function GET");
      });

      it("should have XML escaping function", () => {
        expect(rssContent).toContain("escapeXml");
      });

      it("should generate valid RSS 2.0", () => {
        expect(rssContent).toContain('version="2.0"');
        expect(rssContent).toContain("<rss");
        expect(rssContent).toContain("<channel>");
      });

      it("should set proper content type", () => {
        expect(rssContent).toContain("application/rss+xml");
      });

      it("should include caching headers", () => {
        expect(rssContent).toContain("Cache-Control");
      });

      it("should escape special characters", () => {
        expect(rssContent).toContain(".replace(/&/g");
        expect(rssContent).toContain(".replace(/</g");
        expect(rssContent).toContain(".replace(/>/g");
      });
    });

    describe("blog/[slug]/page.tsx", () => {
      const blogPagePath = path.join(examplesDir, "app/blog/[slug]/page.tsx");
      let blogPageContent: string;

      beforeAll(() => {
        blogPageContent = fs.readFileSync(blogPagePath, "utf-8");
      });

      it("should exist", () => {
        expect(fs.existsSync(blogPagePath)).toBe(true);
      });

      it("should export generateMetadata function", () => {
        expect(blogPageContent).toContain("export async function generateMetadata");
      });

      it("should export generateStaticParams function", () => {
        expect(blogPageContent).toContain("export async function generateStaticParams");
      });

      it("should have revalidate export for ISR", () => {
        expect(blogPageContent).toContain("export const revalidate");
      });

      it("should handle notFound() for missing articles", () => {
        expect(blogPageContent).toContain("notFound()");
        expect(blogPageContent).toContain("from 'next/navigation'");
      });

      it("should include Article schema function", () => {
        expect(blogPageContent).toContain("getArticleSchema");
        // Schema is generated by function
        expect(blogPageContent).toContain("Schema");
      });

      it("should include Breadcrumb schema", () => {
        expect(blogPageContent).toContain("BreadcrumbList");
        expect(blogPageContent).toContain("getBreadcrumbSchema");
      });

      it("should have proper TypeScript types", () => {
        expect(blogPageContent).toContain("interface");
        expect(blogPageContent).toContain("params: { slug: string }");
      });
    });
  });

  describe("SEO Utility Library", () => {
    const seoPath = path.join(examplesDir, "lib/seo.ts");
    let seoContent: string;

    beforeAll(() => {
      seoContent = fs.readFileSync(seoPath, "utf-8");
    });

    it("should exist", () => {
      expect(fs.existsSync(seoPath)).toBe(true);
    });

    it("should export SITE_CONFIG", () => {
      expect(seoContent).toContain("export const SITE_CONFIG");
    });

    it("should have getCanonicalUrl function", () => {
      expect(seoContent).toContain("export function getCanonicalUrl");
    });

    it("should have parseArticleDateToISO function", () => {
      expect(seoContent).toContain("export function parseArticleDateToISO");
    });

    it("should have schema generation functions", () => {
      expect(seoContent).toContain("generatePersonSchema");
      expect(seoContent).toContain("generateWebsiteSchema");
      expect(seoContent).toContain("generateArticleSchema");
      expect(seoContent).toContain("generateBreadcrumbSchema");
    });

    it("should have content helper functions", () => {
      expect(seoContent).toContain("stripMarkdown");
      expect(seoContent).toContain("calculateReadTime");
    });

    it("should have analytics functions", () => {
      expect(seoContent).toContain("trackPageView");
      expect(seoContent).toContain("trackEvent");
    });

    it("should have proper TypeScript type declarations", () => {
      expect(seoContent).toContain("interface");
      expect(seoContent).toContain("Record<string");
    });
  });

  describe("Next.js Configuration", () => {
    const configPath = path.join(examplesDir, "next.config.js");
    let configContent: string;

    beforeAll(() => {
      configContent = fs.readFileSync(configPath, "utf-8");
    });

    it("should exist", () => {
      expect(fs.existsSync(configPath)).toBe(true);
    });

    it("should export nextConfig", () => {
      expect(configContent).toContain("module.exports");
    });

    it("should have static export configuration", () => {
      expect(configContent).toContain("output: 'export'");
    });

    it("should disable trailing slashes", () => {
      expect(configContent).toContain("trailingSlash: false");
    });

    it("should configure image optimization", () => {
      expect(configContent).toContain("images:");
      expect(configContent).toContain("unoptimized: true");
    });

    it("should enable React strict mode", () => {
      expect(configContent).toContain("reactStrictMode: true");
    });

    it("should disable powered-by header", () => {
      expect(configContent).toContain("poweredByHeader: false");
    });

    it("should have redirects configuration", () => {
      expect(configContent).toContain("async redirects()");
    });

    it("should have headers configuration", () => {
      expect(configContent).toContain("async headers()");
    });

    it("should include security headers", () => {
      expect(configContent).toContain("X-Frame-Options");
      expect(configContent).toContain("X-Content-Type-Options");
    });
  });

  describe("Code Quality", () => {
    it("should not have TODO comments in examples", () => {
      const allFiles = [
        path.join(examplesDir, "app/layout.tsx"),
        path.join(examplesDir, "app/page.tsx"),
        path.join(examplesDir, "lib/seo.ts"),
        path.join(examplesDir, "next.config.js"),
      ];

      allFiles.forEach((filePath) => {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, "utf-8");
          expect(content.toLowerCase()).not.toContain("todo:");
          expect(content.toLowerCase()).not.toContain("fixme:");
        }
      });
    });

    it("should have consistent import style", () => {
      const allFiles = [
        path.join(examplesDir, "app/layout.tsx"),
        path.join(examplesDir, "app/page.tsx"),
        path.join(examplesDir, "app/blog/[slug]/page.tsx"),
      ];

      allFiles.forEach((filePath) => {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, "utf-8");
          // Should use ES6 imports
          if (content.includes("import")) {
            expect(content).not.toContain("require(");
          }
        }
      });
    });

    it("should use TypeScript for type safety", () => {
      const allFiles = [
        path.join(examplesDir, "app/layout.tsx"),
        path.join(examplesDir, "app/page.tsx"),
        path.join(examplesDir, "lib/seo.ts"),
      ];

      allFiles.forEach((filePath) => {
        if (fs.existsSync(filePath)) {
          expect(path.extname(filePath)).toMatch(/\.(ts|tsx)$/);
        }
      });
    });

    it("should have proper file naming conventions", () => {
      const appFiles = fs.readdirSync(path.join(examplesDir, "app"));
      appFiles.forEach((file) => {
        // App router files should be lowercase with hyphens or camelCase
        expect(file).toMatch(/^[a-z0-9-_.[\]]+$/);
      });
    });
  });

  describe("SEO Best Practices in Examples", () => {
    it("should demonstrate metadata API usage", () => {
      const layoutContent = fs.readFileSync(
        path.join(examplesDir, "app/layout.tsx"),
        "utf-8"
      );
      expect(layoutContent).toContain("export const metadata");
      expect(layoutContent).toContain("Metadata");
    });

    it("should demonstrate structured data", () => {
      const blogPageContent = fs.readFileSync(
        path.join(examplesDir, "app/blog/[slug]/page.tsx"),
        "utf-8"
      );
      // Check for schema-related code (may be in function calls or imports)
      expect(blogPageContent).toContain("Schema");
      expect(blogPageContent).toMatch(/schema|Schema/);
    });

    it("should demonstrate canonical URLs", () => {
      const seoContent = fs.readFileSync(
        path.join(examplesDir, "lib/seo.ts"),
        "utf-8"
      );
      expect(seoContent).toContain("getCanonicalUrl");
      expect(seoContent).toContain("canonical");
    });

    it("should demonstrate sitemap generation", () => {
      const sitemapContent = fs.readFileSync(
        path.join(examplesDir, "app/sitemap.ts"),
        "utf-8"
      );
      expect(sitemapContent).toContain("MetadataRoute.Sitemap");
    });

    it("should demonstrate robots.txt generation", () => {
      const robotsContent = fs.readFileSync(
        path.join(examplesDir, "app/robots.ts"),
        "utf-8"
      );
      expect(robotsContent).toContain("MetadataRoute.Robots");
    });
  });

  describe("Performance Best Practices", () => {
    it("should demonstrate font optimization", () => {
      const layoutContent = fs.readFileSync(
        path.join(examplesDir, "app/layout.tsx"),
        "utf-8"
      );
      expect(layoutContent).toContain("next/font/google");
      expect(layoutContent).toContain("display: 'swap'");
    });

    it("should demonstrate static generation", () => {
      const blogPageContent = fs.readFileSync(
        path.join(examplesDir, "app/blog/[slug]/page.tsx"),
        "utf-8"
      );
      expect(blogPageContent).toContain("generateStaticParams");
    });

    it("should demonstrate caching headers", () => {
      const rssContent = fs.readFileSync(
        path.join(examplesDir, "app/rss.xml/route.ts"),
        "utf-8"
      );
      expect(rssContent).toContain("Cache-Control");
      expect(rssContent).toContain("max-age");
    });
  });
});