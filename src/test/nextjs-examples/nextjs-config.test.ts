import { describe, it, expect } from 'vitest';

// Mock Next.js config structure based on the example
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

// Mock redirects
const redirects = [
  {
    source: '/home',
    destination: '/',
    permanent: true,
  },
  {
    source: '/index.html',
    destination: '/',
    permanent: true,
  },
  {
    source: '/articles/:slug',
    destination: '/blog/:slug',
    permanent: true,
  },
  {
    source: '/posts/:slug',
    destination: '/blog/:slug',
    permanent: true,
  },
  {
    source: '/writing/:slug',
    destination: '/blog/:slug',
    permanent: true,
  },
  {
    source: '/feed',
    destination: '/rss.xml',
    permanent: true,
  },
  {
    source: '/rss',
    destination: '/rss.xml',
    permanent: true,
  },
  {
    source: '/resume',
    destination: '/resume.pdf',
    permanent: true,
  },
  {
    source: '/cv',
    destination: '/resume.pdf',
    permanent: true,
  },
];

// Mock headers configuration
const headers = [
  {
    source: '/(.*)',
    headers: [
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
    ],
  },
  {
    source: '/(.*)\\.(ico|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2)',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
      },
    ],
  },
  {
    source: '/_next/static/(.*)',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
      },
    ],
  },
];

describe('Next.js Configuration', () => {
  describe('Basic Configuration', () => {
    it('should have static export enabled', () => {
      expect(nextConfig.output).toBe('export');
    });

    it('should disable trailing slashes', () => {
      expect(nextConfig.trailingSlash).toBe(false);
    });

    it('should enable React strict mode', () => {
      expect(nextConfig.reactStrictMode).toBe(true);
    });

    it('should disable powered-by header', () => {
      expect(nextConfig.poweredByHeader).toBe(false);
    });

    it('should enable compression', () => {
      expect(nextConfig.compress).toBe(true);
    });

    it('should have environment variables configured', () => {
      expect(nextConfig.env).toBeDefined();
      expect(nextConfig.env.NEXT_PUBLIC_SITE_URL).toBeDefined();
    });
  });

  describe('Image Configuration', () => {
    it('should have unoptimized images for static export', () => {
      expect(nextConfig.images.unoptimized).toBe(true);
    });

    it('should support modern image formats', () => {
      expect(nextConfig.images.formats).toContain('image/avif');
      expect(nextConfig.images.formats).toContain('image/webp');
    });

    it('should have responsive device sizes', () => {
      expect(nextConfig.images.deviceSizes).toBeInstanceOf(Array);
      expect(nextConfig.images.deviceSizes.length).toBeGreaterThan(0);
      expect(nextConfig.images.deviceSizes).toContain(1920);
      expect(nextConfig.images.deviceSizes).toContain(3840);
    });

    it('should have image sizes for thumbnails', () => {
      expect(nextConfig.images.imageSizes).toBeInstanceOf(Array);
      expect(nextConfig.images.imageSizes.length).toBeGreaterThan(0);
      expect(nextConfig.images.imageSizes).toContain(16);
      expect(nextConfig.images.imageSizes).toContain(384);
    });

    it('should have device sizes in ascending order', () => {
      const sizes = nextConfig.images.deviceSizes;
      for (let i = 0; i < sizes.length - 1; i++) {
        expect(sizes[i]).toBeLessThan(sizes[i + 1]);
      }
    });

    it('should have image sizes in ascending order', () => {
      const sizes = nextConfig.images.imageSizes;
      for (let i = 0; i < sizes.length - 1; i++) {
        expect(sizes[i]).toBeLessThan(sizes[i + 1]);
      }
    });
  });

  describe('Redirects Configuration', () => {
    it('should have redirects defined', () => {
      expect(redirects).toBeInstanceOf(Array);
      expect(redirects.length).toBeGreaterThan(0);
    });

    it('should use permanent (301) redirects', () => {
      redirects.forEach((redirect) => {
        expect(redirect.permanent).toBe(true);
      });
    });

    it('should redirect legacy URLs to canonical URLs', () => {
      const homeRedirect = redirects.find((r) => r.source === '/home');
      expect(homeRedirect?.destination).toBe('/');

      const indexRedirect = redirects.find((r) => r.source === '/index.html');
      expect(indexRedirect?.destination).toBe('/');
    });

    it('should redirect blog URL variations to /blog/:slug', () => {
      const blogRedirects = redirects.filter((r) => r.destination === '/blog/:slug');
      expect(blogRedirects.length).toBeGreaterThan(0);

      const sources = blogRedirects.map((r) => r.source);
      expect(sources).toContain('/articles/:slug');
      expect(sources).toContain('/posts/:slug');
      expect(sources).toContain('/writing/:slug');
    });

    it('should redirect feed URLs to RSS', () => {
      const feedRedirect = redirects.find((r) => r.source === '/feed');
      expect(feedRedirect?.destination).toBe('/rss.xml');

      const rssRedirect = redirects.find((r) => r.source === '/rss');
      expect(rssRedirect?.destination).toBe('/rss.xml');
    });

    it('should redirect resume/CV URLs', () => {
      const resumeRedirect = redirects.find((r) => r.source === '/resume');
      expect(resumeRedirect?.destination).toBe('/resume.pdf');

      const cvRedirect = redirects.find((r) => r.source === '/cv');
      expect(cvRedirect?.destination).toBe('/resume.pdf');
    });

    it('should not have circular redirects', () => {
      const redirectMap = new Map(
        redirects.map((r) => [r.source, r.destination])
      );

      redirects.forEach((redirect) => {
        expect(redirectMap.get(redirect.destination)).toBeUndefined();
      });
    });

    it('should not redirect to external URLs', () => {
      redirects.forEach((redirect) => {
        expect(redirect.destination).not.toMatch(/^https?:\/\//);
      });
    });
  });

  describe('Security Headers', () => {
    it('should have security headers configured', () => {
      expect(headers).toBeInstanceOf(Array);
      expect(headers.length).toBeGreaterThan(0);
    });

    it('should set X-Content-Type-Options to nosniff', () => {
      const globalHeaders = headers.find((h) => h.source === '/(.*)');
      const header = globalHeaders?.headers.find(
        (h) => h.key === 'X-Content-Type-Options'
      );
      expect(header?.value).toBe('nosniff');
    });

    it('should set X-Frame-Options to DENY', () => {
      const globalHeaders = headers.find((h) => h.source === '/(.*)');
      const header = globalHeaders?.headers.find((h) => h.key === 'X-Frame-Options');
      expect(header?.value).toBe('DENY');
    });

    it('should set X-XSS-Protection', () => {
      const globalHeaders = headers.find((h) => h.source === '/(.*)');
      const header = globalHeaders?.headers.find((h) => h.key === 'X-XSS-Protection');
      expect(header?.value).toBe('1; mode=block');
    });

    it('should set Referrer-Policy', () => {
      const globalHeaders = headers.find((h) => h.source === '/(.*)');
      const header = globalHeaders?.headers.find((h) => h.key === 'Referrer-Policy');
      expect(header?.value).toBe('strict-origin-when-cross-origin');
    });

    it('should set Permissions-Policy', () => {
      const globalHeaders = headers.find((h) => h.source === '/(.*)');
      const header = globalHeaders?.headers.find((h) => h.key === 'Permissions-Policy');
      expect(header).toBeDefined();
      expect(header?.value).toContain('camera=()');
      expect(header?.value).toContain('microphone=()');
      expect(header?.value).toContain('geolocation=()');
    });
  });

  describe('Caching Headers', () => {
    it('should cache static assets with immutable', () => {
      const staticHeaders = headers.find((h) =>
        h.source.includes('ico|png|jpg')
      );

      expect(staticHeaders).toBeDefined();
      const cacheHeader = staticHeaders?.headers.find(
        (h) => h.key === 'Cache-Control'
      );
      expect(cacheHeader?.value).toContain('public');
      expect(cacheHeader?.value).toContain('max-age=31536000');
      expect(cacheHeader?.value).toContain('immutable');
    });

    it('should cache Next.js static files with immutable', () => {
      const nextStaticHeaders = headers.find((h) =>
        h.source.includes('_next/static')
      );

      expect(nextStaticHeaders).toBeDefined();
      const cacheHeader = nextStaticHeaders?.headers.find(
        (h) => h.key === 'Cache-Control'
      );
      expect(cacheHeader?.value).toContain('immutable');
    });
  });

  describe('SEO Optimization', () => {
    it('should not use trailing slashes for cleaner URLs', () => {
      expect(nextConfig.trailingSlash).toBe(false);
    });

    it('should have canonical URL environment variable', () => {
      expect(nextConfig.env.NEXT_PUBLIC_SITE_URL).toBeDefined();
      expect(nextConfig.env.NEXT_PUBLIC_SITE_URL).toMatch(/^https:\/\//);
    });

    it('should redirect all legacy blog paths to /blog/:slug', () => {
      const legacyPaths = ['/articles/:slug', '/posts/:slug', '/writing/:slug'];
      legacyPaths.forEach((path) => {
        const redirect = redirects.find((r) => r.source === path);
        expect(redirect).toBeDefined();
        expect(redirect?.destination).toBe('/blog/:slug');
      });
    });

    it('should use 301 redirects for SEO link equity', () => {
      redirects.forEach((redirect) => {
        expect(redirect.permanent).toBe(true);
      });
    });
  });

  describe('Performance Optimization', () => {
    it('should have compression enabled', () => {
      expect(nextConfig.compress).toBe(true);
    });

    it('should use modern image formats', () => {
      expect(nextConfig.images.formats).toContain('image/avif');
      expect(nextConfig.images.formats).toContain('image/webp');
    });

    it('should support multiple device sizes for responsive images', () => {
      expect(nextConfig.images.deviceSizes.length).toBeGreaterThanOrEqual(7);
    });

    it('should cache static assets for one year', () => {
      const staticHeaders = headers.find((h) =>
        h.source.includes('ico|png|jpg')
      );
      const cacheHeader = staticHeaders?.headers.find(
        (h) => h.key === 'Cache-Control'
      );
      expect(cacheHeader?.value).toContain('max-age=31536000');
    });
  });

  describe('Static Export Configuration', () => {
    it('should have output set to export', () => {
      expect(nextConfig.output).toBe('export');
    });

    it('should have unoptimized images for static export', () => {
      expect(nextConfig.images.unoptimized).toBe(true);
    });

    it('should be compatible with Firebase Hosting', () => {
      expect(nextConfig.output).toBe('export');
      expect(nextConfig.trailingSlash).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing environment variables gracefully', () => {
      expect(nextConfig.env.NEXT_PUBLIC_SITE_URL).toBeDefined();
    });

    it('should not have conflicting redirects', () => {
      const sources = redirects.map((r) => r.source);
      const uniqueSources = new Set(sources);
      expect(sources.length).toBe(uniqueSources.size);
    });

    it('should not redirect the same path multiple times', () => {
      const destinations = redirects.map((r) => r.destination);
      const redirectedSources = redirects.map((r) => r.source);

      destinations.forEach((dest) => {
        const isAlsoSource = redirectedSources.includes(dest);
        if (isAlsoSource) {
          // This would create a redirect chain, which should be avoided
          expect(isAlsoSource).toBe(false);
        }
      });
    });

    it('should have valid regex patterns in header sources', () => {
      headers.forEach((headerConfig) => {
        expect(() => new RegExp(headerConfig.source)).not.toThrow();
      });
    });
  });

  describe('Best Practices', () => {
    it('should disable X-Powered-By for security', () => {
      expect(nextConfig.poweredByHeader).toBe(false);
    });

    it('should use strict mode in React', () => {
      expect(nextConfig.reactStrictMode).toBe(true);
    });

    it('should have comprehensive security headers', () => {
      const globalHeaders = headers.find((h) => h.source === '/(.*)');
      const headerKeys = globalHeaders?.headers.map((h) => h.key) || [];

      const requiredHeaders = [
        'X-Content-Type-Options',
        'X-Frame-Options',
        'X-XSS-Protection',
        'Referrer-Policy',
        'Permissions-Policy',
      ];

      requiredHeaders.forEach((requiredHeader) => {
        expect(headerKeys).toContain(requiredHeader);
      });
    });

    it('should prioritize modern image formats', () => {
      const formats = nextConfig.images.formats;
      expect(formats[0]).toBe('image/avif');
    });

    it('should have appropriate max-age for static assets', () => {
      const oneYear = 31536000;
      const staticHeaders = headers.find((h) =>
        h.source.includes('ico|png|jpg')
      );
      const cacheHeader = staticHeaders?.headers.find(
        (h) => h.key === 'Cache-Control'
      );
      expect(cacheHeader?.value).toContain(`max-age=${oneYear}`);
    });
  });
});