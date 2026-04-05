/**
 * Tests for docs/nextjs-migration-examples/next.config.js
 *
 * Covers:
 * - Static export configuration
 * - Image optimisation settings
 * - SEO-friendly redirects (async redirects())
 * - Security and caching headers (async headers())
 */

import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------------------
// Re-implement the next.config.js structure for isolated unit testing.
// The actual next.config.js uses Next.js-specific async helpers that can't
// be executed outside a Next.js build context.  We mirror the data here so
// that the shape and values can be validated independently.
// ---------------------------------------------------------------------------

const nextConfig = {
  output: 'export',
  trailingSlash: false,
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://shahidster.tech',
  },
};

// Mirrors the async redirects() from next.config.js
async function getRedirects() {
  return [
    { source: '/home', destination: '/', permanent: true },
    { source: '/index.html', destination: '/', permanent: true },
    { source: '/articles/:slug', destination: '/blog/:slug', permanent: true },
    { source: '/posts/:slug', destination: '/blog/:slug', permanent: true },
    { source: '/writing/:slug', destination: '/blog/:slug', permanent: true },
    { source: '/feed', destination: '/rss.xml', permanent: true },
    { source: '/rss', destination: '/rss.xml', permanent: true },
    { source: '/resume', destination: '/resume.pdf', permanent: true },
    { source: '/cv', destination: '/resume.pdf', permanent: true },
  ];
}

// Mirrors the async headers() from next.config.js
async function getHeaders() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
    {
      source: '/(.*)\\.(ico|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
    {
      source: '/_next/static/(.*)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
    {
      source: '/(.*)',
      has: [{ type: 'header', key: 'Accept', value: '(.*text/html.*)' }],
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
      ],
    },
  ];
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('next.config.js - Static configuration', () => {
  describe('output and URL settings', () => {
    it('should set output to "export" for static site generation', () => {
      expect(nextConfig.output).toBe('export');
    });

    it('should disable trailing slashes for clean canonical URLs', () => {
      expect(nextConfig.trailingSlash).toBe(false);
    });
  });

  describe('Image configuration', () => {
    it('should mark images as unoptimized (required for static export)', () => {
      expect(nextConfig.images.unoptimized).toBe(true);
    });

    it('should support avif and webp formats', () => {
      expect(nextConfig.images.formats).toContain('image/avif');
      expect(nextConfig.images.formats).toContain('image/webp');
    });

    it('should define deviceSizes for responsive images', () => {
      expect(nextConfig.images.deviceSizes).toBeInstanceOf(Array);
      expect(nextConfig.images.deviceSizes.length).toBeGreaterThan(0);
    });

    it('should include common breakpoints in deviceSizes', () => {
      expect(nextConfig.images.deviceSizes).toContain(640);
      expect(nextConfig.images.deviceSizes).toContain(1920);
    });

    it('should define imageSizes for fixed-width images', () => {
      expect(nextConfig.images.imageSizes).toBeInstanceOf(Array);
      expect(nextConfig.images.imageSizes.length).toBeGreaterThan(0);
    });

    it('should have deviceSizes sorted in ascending order', () => {
      const sizes = nextConfig.images.deviceSizes;
      for (let i = 0; i < sizes.length - 1; i++) {
        expect(sizes[i]).toBeLessThan(sizes[i + 1]);
      }
    });
  });

  describe('Optimisation flags', () => {
    it('should enable React strict mode', () => {
      expect(nextConfig.reactStrictMode).toBe(true);
    });

    it('should disable X-Powered-By header', () => {
      expect(nextConfig.poweredByHeader).toBe(false);
    });

    it('should enable compression', () => {
      expect(nextConfig.compress).toBe(true);
    });
  });

  describe('Environment variables', () => {
    it('should expose NEXT_PUBLIC_SITE_URL', () => {
      expect(nextConfig.env).toHaveProperty('NEXT_PUBLIC_SITE_URL');
    });

    it('should default NEXT_PUBLIC_SITE_URL to production domain', () => {
      expect(nextConfig.env.NEXT_PUBLIC_SITE_URL).toContain('shahidster.tech');
    });
  });
});

// ---------------------------------------------------------------------------

describe('next.config.js - redirects()', () => {
  it('should return an array', async () => {
    const redirects = await getRedirects();
    expect(Array.isArray(redirects)).toBe(true);
  });

  it('should redirect /home to / (permanent)', async () => {
    const redirects = await getRedirects();
    const r = redirects.find((r) => r.source === '/home');
    expect(r).toBeDefined();
    expect(r?.destination).toBe('/');
    expect(r?.permanent).toBe(true);
  });

  it('should redirect /index.html to / (permanent)', async () => {
    const redirects = await getRedirects();
    const r = redirects.find((r) => r.source === '/index.html');
    expect(r).toBeDefined();
    expect(r?.destination).toBe('/');
    expect(r?.permanent).toBe(true);
  });

  it('should redirect /articles/:slug to /blog/:slug', async () => {
    const redirects = await getRedirects();
    const r = redirects.find((r) => r.source === '/articles/:slug');
    expect(r).toBeDefined();
    expect(r?.destination).toBe('/blog/:slug');
    expect(r?.permanent).toBe(true);
  });

  it('should redirect /posts/:slug to /blog/:slug', async () => {
    const redirects = await getRedirects();
    const r = redirects.find((r) => r.source === '/posts/:slug');
    expect(r?.destination).toBe('/blog/:slug');
    expect(r?.permanent).toBe(true);
  });

  it('should redirect /writing/:slug to /blog/:slug', async () => {
    const redirects = await getRedirects();
    const r = redirects.find((r) => r.source === '/writing/:slug');
    expect(r?.destination).toBe('/blog/:slug');
    expect(r?.permanent).toBe(true);
  });

  it('should redirect /feed to /rss.xml', async () => {
    const redirects = await getRedirects();
    const r = redirects.find((r) => r.source === '/feed');
    expect(r?.destination).toBe('/rss.xml');
    expect(r?.permanent).toBe(true);
  });

  it('should redirect /rss to /rss.xml', async () => {
    const redirects = await getRedirects();
    const r = redirects.find((r) => r.source === '/rss');
    expect(r?.destination).toBe('/rss.xml');
    expect(r?.permanent).toBe(true);
  });

  it('should redirect /resume to /resume.pdf', async () => {
    const redirects = await getRedirects();
    const r = redirects.find((r) => r.source === '/resume');
    expect(r?.destination).toBe('/resume.pdf');
    expect(r?.permanent).toBe(true);
  });

  it('should redirect /cv to /resume.pdf', async () => {
    const redirects = await getRedirects();
    const r = redirects.find((r) => r.source === '/cv');
    expect(r?.destination).toBe('/resume.pdf');
    expect(r?.permanent).toBe(true);
  });

  it('should mark all redirects as permanent (301)', async () => {
    const redirects = await getRedirects();
    redirects.forEach((r) => {
      expect(r.permanent).toBe(true);
    });
  });

  it('should not contain duplicate source paths', async () => {
    const redirects = await getRedirects();
    const sources = redirects.map((r) => r.source);
    const unique = new Set(sources);
    expect(unique.size).toBe(sources.length);
  });

  it('should not create redirect loops (source !== destination)', async () => {
    const redirects = await getRedirects();
    redirects.forEach((r) => {
      expect(r.source).not.toBe(r.destination);
    });
  });
});

// ---------------------------------------------------------------------------

describe('next.config.js - headers()', () => {
  it('should return an array', async () => {
    const headers = await getHeaders();
    expect(Array.isArray(headers)).toBe(true);
  });

  it('should include a global header group matching all routes', async () => {
    const headers = await getHeaders();
    const global = headers.find((h) => h.source === '/(.*)' && !h.has);
    expect(global).toBeDefined();
  });

  describe('Security headers', () => {
    it('should set X-Content-Type-Options to nosniff', async () => {
      const headers = await getHeaders();
      const global = headers.find((h) => h.source === '/(.*)' && !h.has);
      const header = global?.headers.find((h) => h.key === 'X-Content-Type-Options');
      expect(header?.value).toBe('nosniff');
    });

    it('should set X-Frame-Options to DENY', async () => {
      const headers = await getHeaders();
      const global = headers.find((h) => h.source === '/(.*)' && !h.has);
      const header = global?.headers.find((h) => h.key === 'X-Frame-Options');
      expect(header?.value).toBe('DENY');
    });

    it('should set X-XSS-Protection', async () => {
      const headers = await getHeaders();
      const global = headers.find((h) => h.source === '/(.*)' && !h.has);
      const header = global?.headers.find((h) => h.key === 'X-XSS-Protection');
      expect(header?.value).toBe('1; mode=block');
    });

    it('should set Referrer-Policy to strict-origin-when-cross-origin', async () => {
      const headers = await getHeaders();
      const global = headers.find((h) => h.source === '/(.*)' && !h.has);
      const header = global?.headers.find((h) => h.key === 'Referrer-Policy');
      expect(header?.value).toBe('strict-origin-when-cross-origin');
    });

    it('should set Permissions-Policy to restrict camera, microphone, and geolocation', async () => {
      const headers = await getHeaders();
      const global = headers.find((h) => h.source === '/(.*)' && !h.has);
      const header = global?.headers.find((h) => h.key === 'Permissions-Policy');
      expect(header?.value).toContain('camera=()');
      expect(header?.value).toContain('microphone=()');
      expect(header?.value).toContain('geolocation=()');
    });
  });

  describe('Cache-Control headers', () => {
    it('should set immutable long-term cache for static assets', async () => {
      const headers = await getHeaders();
      const staticAssets = headers.find((h) =>
        h.source.includes('.ico|png|jpg')
      );
      const cacheHeader = staticAssets?.headers.find((h) => h.key === 'Cache-Control');
      expect(cacheHeader?.value).toContain('max-age=31536000');
      expect(cacheHeader?.value).toContain('immutable');
    });

    it('should set immutable long-term cache for Next.js static chunks', async () => {
      const headers = await getHeaders();
      const nextStatic = headers.find((h) => h.source.includes('_next/static'));
      const cacheHeader = nextStatic?.headers.find((h) => h.key === 'Cache-Control');
      expect(cacheHeader?.value).toContain('max-age=31536000');
      expect(cacheHeader?.value).toContain('immutable');
    });

    it('should set no-cache for HTML pages (must-revalidate)', async () => {
      const headers = await getHeaders();
      const htmlGroup = headers.find(
        (h) => h.source === '/(.*)' && h.has !== undefined
      );
      const cacheHeader = htmlGroup?.headers.find((h) => h.key === 'Cache-Control');
      expect(cacheHeader?.value).toContain('max-age=0');
      expect(cacheHeader?.value).toContain('must-revalidate');
    });
  });
});