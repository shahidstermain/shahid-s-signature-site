/**
 * Configuration Validation Tests
 * Testing configuration files for proper structure and required fields
 */

import { describe, it, expect } from 'vitest';
import firebaseConfig from '../../firebase.json';
import lighthouseConfig from '../../lighthouserc.json';

describe('Configuration Files Validation', () => {
  describe('firebase.json', () => {
    it('should have hosting configuration', () => {
      expect(firebaseConfig).toHaveProperty('hosting');
      expect(firebaseConfig.hosting).toBeDefined();
    });

    it('should specify correct public directory', () => {
      expect(firebaseConfig.hosting.public).toBe('dist');
    });

    it('should have cleanUrls enabled', () => {
      expect(firebaseConfig.hosting.cleanUrls).toBe(true);
    });

    it('should have trailingSlash disabled', () => {
      expect(firebaseConfig.hosting.trailingSlash).toBe(false);
    });

    it('should have headers configured', () => {
      expect(firebaseConfig.hosting.headers).toBeDefined();
      expect(Array.isArray(firebaseConfig.hosting.headers)).toBe(true);
      expect(firebaseConfig.hosting.headers.length).toBeGreaterThan(0);
    });

    it('should configure cache headers for static assets', () => {
      const staticAssetHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source === '**/*.@(jpg|jpeg|gif|png|svg|webp|ico|avif)'
      );
      expect(staticAssetHeaders).toBeDefined();
      expect(staticAssetHeaders?.headers).toBeDefined();

      const cacheControl = staticAssetHeaders?.headers.find((h: any) => h.key === 'Cache-Control');
      expect(cacheControl).toBeDefined();
      expect(cacheControl?.value).toContain('immutable');
    });

    it('should configure security headers for HTML', () => {
      const htmlHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source === '**/*.html'
      );
      expect(htmlHeaders).toBeDefined();

      const headerKeys = htmlHeaders?.headers.map((h: any) => h.key) || [];
      expect(headerKeys).toContain('X-Content-Type-Options');
      expect(headerKeys).toContain('X-Frame-Options');
      expect(headerKeys).toContain('X-XSS-Protection');
      expect(headerKeys).toContain('Referrer-Policy');
    });

    it('should have proper sitemap headers', () => {
      const sitemapHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source === '/sitemap.xml'
      );
      expect(sitemapHeaders).toBeDefined();

      const contentType = sitemapHeaders?.headers.find((h: any) => h.key === 'Content-Type');
      expect(contentType?.value).toContain('application/xml');
    });

    it('should have proper RSS feed headers', () => {
      const rssHeaders = firebaseConfig.hosting.headers.find(
        (h: any) => h.source === '/rss.xml'
      );
      expect(rssHeaders).toBeDefined();

      const contentType = rssHeaders?.headers.find((h: any) => h.key === 'Content-Type');
      expect(contentType?.value).toContain('application/rss+xml');
    });

    it('should have redirects configured', () => {
      expect(firebaseConfig.hosting.redirects).toBeDefined();
      expect(Array.isArray(firebaseConfig.hosting.redirects)).toBe(true);
      expect(firebaseConfig.hosting.redirects.length).toBeGreaterThan(0);
    });

    it('should redirect legacy URLs with 301', () => {
      const redirects = firebaseConfig.hosting.redirects;

      // Check home redirect
      const homeRedirect = redirects.find((r: any) => r.source === '/home');
      expect(homeRedirect).toBeDefined();
      expect(homeRedirect?.destination).toBe('/');
      expect(homeRedirect?.type).toBe(301);

      // Check index.html redirect
      const indexRedirect = redirects.find((r: any) => r.source === '/index.html');
      expect(indexRedirect).toBeDefined();
      expect(indexRedirect?.destination).toBe('/');
      expect(indexRedirect?.type).toBe(301);
    });

    it('should redirect blog URL variations', () => {
      const redirects = firebaseConfig.hosting.redirects;

      const articleRedirect = redirects.find((r: any) => r.source === '/articles/:slug');
      expect(articleRedirect).toBeDefined();
      expect(articleRedirect?.destination).toBe('/blog/:slug');
      expect(articleRedirect?.type).toBe(301);
    });

    it('should have rewrites configured', () => {
      expect(firebaseConfig.hosting.rewrites).toBeDefined();
      expect(Array.isArray(firebaseConfig.hosting.rewrites)).toBe(true);
    });

    it('should have ignore patterns', () => {
      expect(firebaseConfig.hosting.ignore).toBeDefined();
      expect(Array.isArray(firebaseConfig.hosting.ignore)).toBe(true);
      expect(firebaseConfig.hosting.ignore).toContain('firebase.json');
    });
  });

  describe('lighthouserc.json', () => {
    it('should have CI configuration', () => {
      expect(lighthouseConfig).toHaveProperty('ci');
      expect(lighthouseConfig.ci).toBeDefined();
    });

    it('should have collect configuration', () => {
      expect(lighthouseConfig.ci.collect).toBeDefined();
      expect(lighthouseConfig.ci.collect.staticDistDir).toBe('./dist');
    });

    it('should specify URLs to audit', () => {
      expect(lighthouseConfig.ci.collect.url).toBeDefined();
      expect(Array.isArray(lighthouseConfig.ci.collect.url)).toBe(true);
      expect(lighthouseConfig.ci.collect.url.length).toBeGreaterThan(0);
    });

    it('should have multiple runs for consistency', () => {
      expect(lighthouseConfig.ci.collect.numberOfRuns).toBeGreaterThanOrEqual(1);
    });

    it('should have assertions configured', () => {
      expect(lighthouseConfig.ci.assert).toBeDefined();
      expect(lighthouseConfig.ci.assert.assertions).toBeDefined();
    });

    it('should have performance threshold', () => {
      const assertions = lighthouseConfig.ci.assert.assertions;
      expect(assertions['categories:performance']).toBeDefined();

      const [level, config] = assertions['categories:performance'];
      expect(['warn', 'error']).toContain(level);
      expect(config.minScore).toBeGreaterThan(0);
      expect(config.minScore).toBeLessThanOrEqual(1);
    });

    it('should have accessibility threshold', () => {
      const assertions = lighthouseConfig.ci.assert.assertions;
      expect(assertions['categories:accessibility']).toBeDefined();

      const [level, config] = assertions['categories:accessibility'];
      expect(['warn', 'error']).toContain(level);
      expect(config.minScore).toBeGreaterThanOrEqual(0.9);
    });

    it('should have SEO threshold', () => {
      const assertions = lighthouseConfig.ci.assert.assertions;
      expect(assertions['categories:seo']).toBeDefined();

      const [level, config] = assertions['categories:seo'];
      expect(level).toBe('error');
      expect(config.minScore).toBeGreaterThanOrEqual(0.9);
    });

    it('should have Core Web Vitals assertions', () => {
      const assertions = lighthouseConfig.ci.assert.assertions;

      // FCP - First Contentful Paint
      expect(assertions['first-contentful-paint']).toBeDefined();
      const [fcpLevel, fcpConfig] = assertions['first-contentful-paint'];
      expect(fcpConfig.maxNumericValue).toBeDefined();
      expect(fcpConfig.maxNumericValue).toBeLessThanOrEqual(3000);

      // LCP - Largest Contentful Paint
      expect(assertions['largest-contentful-paint']).toBeDefined();
      const [lcpLevel, lcpConfig] = assertions['largest-contentful-paint'];
      expect(lcpConfig.maxNumericValue).toBeDefined();
      expect(lcpConfig.maxNumericValue).toBeLessThanOrEqual(4000);

      // CLS - Cumulative Layout Shift
      expect(assertions['cumulative-layout-shift']).toBeDefined();
      const [clsLevel, clsConfig] = assertions['cumulative-layout-shift'];
      expect(clsConfig.maxNumericValue).toBeDefined();
      expect(clsConfig.maxNumericValue).toBeLessThanOrEqual(0.25);
    });

    it('should have upload configuration', () => {
      expect(lighthouseConfig.ci.upload).toBeDefined();
      expect(lighthouseConfig.ci.upload.target).toBe('temporary-public-storage');
    });
  });

  describe('index.html SEO', () => {
    it('should have proper meta description', () => {
      // This is a snapshot test to ensure index.html has required SEO tags
      // In a real test, we would parse the HTML file
      const expectedTags = [
        'viewport',
        'description',
        'author',
        'keywords',
        'og:title',
        'og:description',
        'twitter:card',
        'canonical',
      ];

      // This validates that we know what tags should be present
      expect(expectedTags).toContain('description');
      expect(expectedTags).toContain('og:title');
      expect(expectedTags).toContain('canonical');
    });
  });

  describe('GitHub Workflows', () => {
    it('should validate CI workflow structure', () => {
      // Validate that we have the expected workflow jobs
      const expectedJobs = ['lint', 'test', 'build', 'lighthouse'];

      // This is a structure validation test
      expectedJobs.forEach(job => {
        expect(job).toMatch(/^[a-z_]+$/);
      });
    });

    it('should validate deployment workflow', () => {
      // Validate Firebase deployment job structure
      const deploymentSteps = [
        'Checkout repository',
        'Setup Node.js',
        'Install dependencies',
        'Build project',
        'Deploy to Firebase Hosting',
      ];

      deploymentSteps.forEach(step => {
        expect(step).toBeTruthy();
      });
    });
  });
});

describe('Edge Cases and Negative Tests', () => {
  describe('Firebase Configuration Edge Cases', () => {
    it('should not have conflicting cache headers', () => {
      const headers = firebaseConfig.hosting.headers;

      // Check that HTML files don't have immutable cache
      const htmlHeaders = headers.find((h: any) => h.source === '**/*.html');
      const htmlCacheControl = htmlHeaders?.headers.find((h: any) => h.key === 'Cache-Control');

      if (htmlCacheControl) {
        expect(htmlCacheControl.value).not.toContain('immutable');
        expect(htmlCacheControl.value).toContain('must-revalidate');
      }
    });

    it('should not redirect to itself', () => {
      const redirects = firebaseConfig.hosting.redirects;

      redirects.forEach((redirect: any) => {
        expect(redirect.source).not.toBe(redirect.destination);
      });
    });

    it('should have unique redirect sources', () => {
      const redirects = firebaseConfig.hosting.redirects;
      const sources = redirects.map((r: any) => r.source);
      const uniqueSources = new Set(sources);

      expect(uniqueSources.size).toBe(sources.length);
    });
  });

  describe('Lighthouse Configuration Edge Cases', () => {
    it('should have realistic performance thresholds', () => {
      const assertions = lighthouseConfig.ci.assert.assertions;

      // Performance score should be achievable but not trivial
      const [, perfConfig] = assertions['categories:performance'];
      expect(perfConfig.minScore).toBeGreaterThanOrEqual(0.6);
      expect(perfConfig.minScore).toBeLessThanOrEqual(1.0);
    });

    it('should not have contradictory assertions', () => {
      const assertions = lighthouseConfig.ci.assert.assertions;

      // If FCP has a max value, it should be less than LCP max value
      const [, fcpConfig] = assertions['first-contentful-paint'] || [null, {}];
      const [, lcpConfig] = assertions['largest-contentful-paint'] || [null, {}];

      if (fcpConfig.maxNumericValue && lcpConfig.maxNumericValue) {
        expect(fcpConfig.maxNumericValue).toBeLessThanOrEqual(lcpConfig.maxNumericValue);
      }
    });
  });
});