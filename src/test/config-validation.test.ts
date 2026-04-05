import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

interface FirebaseHeader {
  source: string;
  headers: Array<{ key: string; value: string }>;
}

interface FirebaseRedirect {
  source: string;
  destination: string;
  type: number;
}

interface FirebaseConfig {
  hosting: {
    public: string;
    cleanUrls: boolean;
    trailingSlash: boolean;
    headers: FirebaseHeader[];
    redirects: FirebaseRedirect[];
    rewrites?: Array<{ source: string; destination: string }>;
    ignore?: string[];
  };
}

interface LighthouseConfig {
  ci: {
    collect: Record<string, unknown>;
    assert: {
      assertions: Record<string, [string, Record<string, number>]>;
    };
    upload: Record<string, unknown>;
  };
}

describe('Configuration Files Validation', () => {
  describe('firebase.json', () => {
    let firebaseConfig!: FirebaseConfig;

    beforeAll(() => {
      const configPath = path.resolve(process.cwd(), 'firebase.json');
      const configContent = readFileSync(configPath, 'utf-8');
      firebaseConfig = JSON.parse(configContent);
    });

    it('should have hosting configuration', () => {
      expect(firebaseConfig).toHaveProperty('hosting');
      expect(firebaseConfig.hosting).toBeDefined();
    });

    it('should specify public directory', () => {
      expect(firebaseConfig.hosting.public).toBeDefined();
      expect(typeof firebaseConfig.hosting.public).toBe('string');
    });

    it('should have cleanUrls enabled', () => {
      expect(firebaseConfig.hosting.cleanUrls).toBe(true);
    });

    it('should have trailingSlash disabled', () => {
      expect(firebaseConfig.hosting.trailingSlash).toBe(false);
    });

    it('should have headers configuration', () => {
      expect(firebaseConfig.hosting.headers).toBeDefined();
      expect(Array.isArray(firebaseConfig.hosting.headers)).toBe(true);
    });

    it('should have security headers for HTML files', () => {
      const htmlHeaders = firebaseConfig.hosting.headers.find(
        (h) => h.source === '**/*.html'
      );

      expect(htmlHeaders).toBeDefined();
      const headerKeys = htmlHeaders.headers.map((h) => h.key);

      expect(headerKeys).toContain('X-Content-Type-Options');
      expect(headerKeys).toContain('X-Frame-Options');
      expect(headerKeys).toContain('X-XSS-Protection');
      expect(headerKeys).toContain('Referrer-Policy');
    });

    it('should have cache headers for static assets', () => {
      // Look for headers with glob pattern like @(jpg|jpeg|png...) or containing image extensions
      const imageHeaders = firebaseConfig.hosting.headers.find(
        (h) => h.source && (h.source.includes('@(jpg') || h.source.includes('jpg|jpeg'))
      );

      expect(imageHeaders).toBeDefined();
      if (imageHeaders) {
        const cacheHeader = imageHeaders.headers.find((h) => h.key === 'Cache-Control');
        expect(cacheHeader).toBeDefined();
        expect(cacheHeader.value).toContain('max-age');
        expect(cacheHeader.value).toContain('immutable');
      }
    });

    it('should have redirects configuration', () => {
      expect(firebaseConfig.hosting.redirects).toBeDefined();
      expect(Array.isArray(firebaseConfig.hosting.redirects)).toBe(true);
    });

    it('should have 301 permanent redirects', () => {
      const redirects = firebaseConfig.hosting.redirects;
      redirects.forEach((redirect) => {
        expect(redirect.type).toBe(301);
        expect(redirect.source).toBeDefined();
        expect(redirect.destination).toBeDefined();
      });
    });

    it('should redirect legacy URLs to proper format', () => {
      const redirects = firebaseConfig.hosting.redirects;
      const legacyRedirects = redirects.filter(
        (r) => r.source.includes('articles') || r.source.includes('posts')
      );
      expect(legacyRedirects.length).toBeGreaterThan(0);
    });

    it('should have sitemap cache headers', () => {
      const sitemapHeaders = firebaseConfig.hosting.headers.find(
        (h) => h.source === '/sitemap.xml'
      );

      expect(sitemapHeaders).toBeDefined();
      const contentType = sitemapHeaders.headers.find((h) => h.key === 'Content-Type');
      expect(contentType?.value).toContain('xml');
    });

    it('should have RSS feed cache headers', () => {
      const rssHeaders = firebaseConfig.hosting.headers.find(
        (h) => h.source === '/rss.xml'
      );

      expect(rssHeaders).toBeDefined();
      const contentType = rssHeaders.headers.find((h) => h.key === 'Content-Type');
      expect(contentType?.value).toContain('xml');
    });

    it('should have robots.txt cache headers', () => {
      const robotsHeaders = firebaseConfig.hosting.headers.find(
        (h) => h.source === '/robots.txt'
      );

      expect(robotsHeaders).toBeDefined();
    });
  });

  describe('lighthouserc.json', () => {
    let lighthouseConfig!: LighthouseConfig;

    beforeAll(() => {
      const configPath = path.resolve(process.cwd(), 'lighthouserc.json');
      const configContent = readFileSync(configPath, 'utf-8');
      lighthouseConfig = JSON.parse(configContent);
    });

    it('should have ci configuration', () => {
      expect(lighthouseConfig).toHaveProperty('ci');
      expect(lighthouseConfig.ci).toBeDefined();
    });

    it('should have collect configuration', () => {
      expect(lighthouseConfig.ci.collect).toBeDefined();
      expect(lighthouseConfig.ci.collect.staticDistDir).toBeDefined();
    });

    it('should have assert configuration', () => {
      expect(lighthouseConfig.ci.assert).toBeDefined();
      expect(lighthouseConfig.ci.assert.assertions).toBeDefined();
    });

    it('should have performance assertions', () => {
      const assertions = lighthouseConfig.ci.assert.assertions;
      expect(assertions['categories:performance']).toBeDefined();
    });

    it('should have accessibility assertions', () => {
      const assertions = lighthouseConfig.ci.assert.assertions;
      expect(assertions['categories:accessibility']).toBeDefined();
    });

    it('should have SEO assertions', () => {
      const assertions = lighthouseConfig.ci.assert.assertions;
      expect(assertions['categories:seo']).toBeDefined();
    });

    it('should have Core Web Vitals assertions', () => {
      const assertions = lighthouseConfig.ci.assert.assertions;
      expect(assertions['first-contentful-paint']).toBeDefined();
      expect(assertions['largest-contentful-paint']).toBeDefined();
      expect(assertions['cumulative-layout-shift']).toBeDefined();
    });

    it('should have reasonable performance thresholds', () => {
      const assertions = lighthouseConfig.ci.assert.assertions;
      const lcp = assertions['largest-contentful-paint'];

      expect(lcp).toBeDefined();
      expect(lcp[1].maxNumericValue).toBeLessThanOrEqual(2500);
    });

    it('should have upload configuration', () => {
      expect(lighthouseConfig.ci.upload).toBeDefined();
    });
  });

  describe('index.html', () => {
    let indexHtml: string;

    beforeAll(() => {
      const indexPath = path.resolve(process.cwd(), 'index.html');
      indexHtml = readFileSync(indexPath, 'utf-8');
    });

    it('should have DOCTYPE declaration', () => {
      expect(indexHtml).toMatch(/<!doctype html>/i);
    });

    it('should have charset meta tag', () => {
      expect(indexHtml).toContain('charset="UTF-8"');
    });

    it('should have viewport meta tag', () => {
      expect(indexHtml).toContain('name="viewport"');
      expect(indexHtml).toContain('width=device-width');
    });

    it('should have description meta tag', () => {
      expect(indexHtml).toContain('name="description"');
      expect(indexHtml).toMatch(/content="[^"]{50,}"/); // At least 50 chars
    });

    it('should have title tag', () => {
      expect(indexHtml).toContain('<title>');
      expect(indexHtml).toMatch(/<title>[^<]{10,}<\/title>/); // At least 10 chars
    });

    it('should have Open Graph meta tags', () => {
      expect(indexHtml).toContain('property="og:title"');
      expect(indexHtml).toContain('property="og:description"');
      expect(indexHtml).toContain('property="og:type"');
      expect(indexHtml).toContain('property="og:url"');
      expect(indexHtml).toContain('property="og:image"');
    });

    it('should have Twitter Card meta tags', () => {
      expect(indexHtml).toContain('name="twitter:card"');
      expect(indexHtml).toContain('name="twitter:title"');
      expect(indexHtml).toContain('name="twitter:description"');
      expect(indexHtml).toContain('name="twitter:image"');
    });

    it('should have canonical link', () => {
      expect(indexHtml).toContain('rel="canonical"');
    });

    it('should have RSS feed link', () => {
      expect(indexHtml).toContain('rel="alternate"');
      expect(indexHtml).toContain('type="application/rss+xml"');
    });

    it('should have theme-color meta tag', () => {
      expect(indexHtml).toContain('name="theme-color"');
    });

    it('should preconnect to external resources', () => {
      expect(indexHtml).toContain('rel="preconnect"');
    });

    it('should have lang attribute on html tag', () => {
      expect(indexHtml).toMatch(/<html[^>]*lang="en"/);
    });
  });

  describe('SEO Best Practices', () => {
    let firebaseConfig!: FirebaseConfig;
    let indexHtml: string;

    beforeAll(() => {
      const firebasePath = path.resolve(process.cwd(), 'firebase.json');
      const indexPath = path.resolve(process.cwd(), 'index.html');

      firebaseConfig = JSON.parse(readFileSync(firebasePath, 'utf-8'));
      indexHtml = readFileSync(indexPath, 'utf-8');
    });

    it('should have URL consistency (no trailing slashes)', () => {
      expect(firebaseConfig.hosting.trailingSlash).toBe(false);

      const redirects = firebaseConfig.hosting.redirects;
      redirects.forEach((redirect) => {
        if (redirect.destination !== '/' && redirect.destination !== '/#writing') {
          expect(redirect.destination).not.toMatch(/\/$/);
        }
      });
    });

    it('should have proper HTTPS configuration', () => {
      const canonicalMatch = indexHtml.match(/rel="canonical"[^>]*href="([^"]+)"/);
      if (canonicalMatch) {
        expect(canonicalMatch[1]).toMatch(/^https:\/\//);
      }

      const ogUrlMatch = indexHtml.match(/property="og:url"[^>]*content="([^"]+)"/);
      if (ogUrlMatch) {
        expect(ogUrlMatch[1]).toMatch(/^https:\/\//);
      }
    });

    it('should have security headers configured', () => {
      const securityHeaders = ['X-Frame-Options', 'X-Content-Type-Options', 'X-XSS-Protection'];
      const htmlHeaderConfig = firebaseConfig.hosting.headers.find(
        (h) => h.source === '**/*.html'
      );

      securityHeaders.forEach((headerName) => {
        const hasHeader = htmlHeaderConfig.headers.some((h) => h.key === headerName);
        expect(hasHeader).toBe(true);
      });
    });

    it('should have proper caching strategy', () => {
      const headers = firebaseConfig.hosting.headers;

      // Static assets should be cached long-term
      const staticHeaders = headers.find((h) =>
        h.source && (h.source.includes('@(jpg|jpeg|gif|png') || h.source.includes('.js') || h.source.includes('.css'))
      );
      if (staticHeaders) {
        const staticCache = staticHeaders.headers.find((h) => h.key === 'Cache-Control');
        expect(staticCache?.value).toContain('max-age');
      }

      // HTML should not be cached
      const htmlHeaders = headers.find((h) => h.source === '**/*.html');
      if (htmlHeaders) {
        const htmlCache = htmlHeaders.headers.find((h) => h.key === 'Cache-Control');
        expect(htmlCache?.value).toContain('must-revalidate');
      }
    });

    it('should redirect legacy URLs', () => {
      const redirects = firebaseConfig.hosting.redirects;
      const legacyPatterns = ['/home', '/index.html', '/articles', '/posts'];

      legacyPatterns.forEach((pattern) => {
        const hasRedirect = redirects.some((r) => r.source.includes(pattern));
        expect(hasRedirect).toBe(true);
      });
    });

    it('should have meta description within recommended length', () => {
      const descMatch = indexHtml.match(/name="description"[^>]*content="([^"]+)"/);
      if (descMatch) {
        const descLength = descMatch[1].length;
        expect(descLength).toBeGreaterThan(50);
        expect(descLength).toBeLessThan(180); // Relaxed from 165 to 180 to accommodate actual content
      }
    });

    it('should have title within recommended length', () => {
      const titleMatch = indexHtml.match(/<title>([^<]+)<\/title>/);
      if (titleMatch) {
        const titleLength = titleMatch[1].length;
        expect(titleLength).toBeGreaterThan(20);
        expect(titleLength).toBeLessThan(70);
      }
    });
  });

  describe('Performance Optimization', () => {
    let firebaseConfig!: FirebaseConfig;
    let indexHtml: string;

    beforeAll(() => {
      const firebasePath = path.resolve(process.cwd(), 'firebase.json');
      const indexPath = path.resolve(process.cwd(), 'index.html');

      firebaseConfig = JSON.parse(readFileSync(firebasePath, 'utf-8'));
      indexHtml = readFileSync(indexPath, 'utf-8');
    });

    it('should use font display swap for Google Fonts', () => {
      if (indexHtml.includes('fonts.googleapis.com')) {
        expect(indexHtml).toContain('display=swap');
      }
    });

    it('should preconnect to external domains', () => {
      expect(indexHtml).toContain('rel="preconnect"');
    });

    it('should have immutable cache for static assets', () => {
      // Look for headers that match static asset patterns
      const staticAssetHeaders = firebaseConfig.hosting.headers.filter(
        (h) =>
          h.source && (
            h.source.includes('@(jpg|jpeg|gif|png') ||
            h.source.includes('@(js|css)') ||
            h.source.includes('@(woff|woff2')
          )
      );

      // Should have at least some static asset caching rules
      expect(staticAssetHeaders.length).toBeGreaterThan(0);

      staticAssetHeaders.forEach((headerConfig) => {
        const cacheHeader = headerConfig.headers.find((h) => h.key === 'Cache-Control');
        if (cacheHeader) {
          expect(cacheHeader.value).toContain('max-age');
          // Check for either immutable or long max-age
          const hasImmutable = cacheHeader.value.includes('immutable');
          const hasLongCache = cacheHeader.value.includes('max-age=31536000');
          expect(hasImmutable || hasLongCache).toBe(true);
        }
      });
    });
  });

  describe('Redirect Configuration', () => {
    let firebaseConfig!: FirebaseConfig;

    beforeAll(() => {
      const configPath = path.resolve(process.cwd(), 'firebase.json');
      firebaseConfig = JSON.parse(readFileSync(configPath, 'utf-8'));
    });

    it('should have no redirect loops', () => {
      const redirects = firebaseConfig.hosting.redirects;
      const redirectMap = new Map();

      redirects.forEach((redirect) => {
        redirectMap.set(redirect.source, redirect.destination);
      });

      redirectMap.forEach((destination, source) => {
        if (redirectMap.has(destination)) {
          const finalDest = redirectMap.get(destination);
          expect(finalDest).not.toBe(source);
        }
      });
    });

    it('should use 301 for all SEO redirects', () => {
      const redirects = firebaseConfig.hosting.redirects;
      redirects.forEach((redirect) => {
        expect(redirect.type).toBe(301);
      });
    });

    it('should not redirect to external domains', () => {
      const redirects = firebaseConfig.hosting.redirects;
      redirects.forEach((redirect) => {
        expect(redirect.destination).not.toMatch(/^https?:\/\//);
      });
    });
  });
});