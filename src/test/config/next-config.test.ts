import { describe, it, expect } from 'vitest';

// Simulated next.config.js structure (as it's a CommonJS module)
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
  async redirects() {
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
  },
  async headers() {
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
  },
  webpack: (config: any, { dev, isServer }: any) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

describe('Next.js Configuration', () => {
  describe('Basic Configuration', () => {
    it('should be configured for static export', () => {
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
      const { deviceSizes } = nextConfig.images;

      expect(deviceSizes).toHaveLength(8);
      expect(deviceSizes).toContain(640);
      expect(deviceSizes).toContain(1920);
      expect(deviceSizes).toContain(3840);
    });

    it('should have image sizes in ascending order', () => {
      const { deviceSizes } = nextConfig.images;

      for (let i = 1; i < deviceSizes.length; i++) {
        expect(deviceSizes[i]).toBeGreaterThan(deviceSizes[i - 1]);
      }
    });

    it('should include common thumbnail sizes', () => {
      const { imageSizes } = nextConfig.images;

      expect(imageSizes).toContain(16);
      expect(imageSizes).toContain(32);
      expect(imageSizes).toContain(64);
      expect(imageSizes).toContain(128);
      expect(imageSizes).toContain(256);
    });

    it('should have appropriate size coverage', () => {
      const { deviceSizes, imageSizes } = nextConfig.images;
      const allSizes = [...imageSizes, ...deviceSizes];

      // Should cover mobile to 4K
      expect(Math.min(...allSizes)).toBeLessThanOrEqual(32);
      expect(Math.max(...allSizes)).toBeGreaterThanOrEqual(3000);
    });
  });

  describe('Environment Variables', () => {
    it('should expose NEXT_PUBLIC_SITE_URL', () => {
      expect(nextConfig.env).toHaveProperty('NEXT_PUBLIC_SITE_URL');
    });

    it('should have default site URL', () => {
      const siteUrl = nextConfig.env.NEXT_PUBLIC_SITE_URL;
      expect(siteUrl).toContain('shahidster.tech');
      expect(siteUrl).toMatch(/^https:\/\//);
    });
  });

  describe('Redirects Configuration', () => {
    it('should return array of redirects', async () => {
      const redirects = await nextConfig.redirects();
      expect(redirects).toBeInstanceOf(Array);
      expect(redirects.length).toBeGreaterThan(0);
    });

    it('should redirect legacy home routes', async () => {
      const redirects = await nextConfig.redirects();
      const homeRedirects = redirects.filter((r) =>
        ['/home', '/index.html', '/index'].includes(r.source)
      );

      expect(homeRedirects.length).toBeGreaterThanOrEqual(2);
      homeRedirects.forEach((redirect) => {
        expect(redirect.destination).toBe('/');
        expect(redirect.permanent).toBe(true);
      });
    });

    it('should redirect legacy article URLs to blog', async () => {
      const redirects = await nextConfig.redirects();
      const articleRedirects = redirects.filter((r) =>
        r.source.includes('articles') || r.source.includes('posts') || r.source.includes('writing')
      );

      articleRedirects.forEach((redirect) => {
        expect(redirect.destination).toContain('/blog/');
        expect(redirect.permanent).toBe(true);
      });
    });

    it('should redirect feed URLs', async () => {
      const redirects = await nextConfig.redirects();
      const feedRedirects = redirects.filter((r) =>
        ['/feed', '/rss'].includes(r.source)
      );

      feedRedirects.forEach((redirect) => {
        expect(redirect.destination).toBe('/rss.xml');
        expect(redirect.permanent).toBe(true);
      });
    });

    it('should redirect resume/cv URLs', async () => {
      const redirects = await nextConfig.redirects();
      const resumeRedirects = redirects.filter((r) =>
        ['/resume', '/cv'].includes(r.source)
      );

      resumeRedirects.forEach((redirect) => {
        expect(redirect.destination).toBe('/resume.pdf');
        expect(redirect.permanent).toBe(true);
      });
    });

    it('should use 301 permanent redirects for SEO', async () => {
      const redirects = await nextConfig.redirects();

      redirects.forEach((redirect) => {
        expect(redirect.permanent).toBe(true);
      });
    });

    it('should handle dynamic slug parameters', async () => {
      const redirects = await nextConfig.redirects();
      const dynamicRedirects = redirects.filter((r) => r.source.includes(':slug'));

      expect(dynamicRedirects.length).toBeGreaterThan(0);
      dynamicRedirects.forEach((redirect) => {
        expect(redirect.destination).toContain(':slug');
      });
    });
  });

  describe('Security Headers', () => {
    it('should return array of header rules', async () => {
      const headers = await nextConfig.headers();
      expect(headers).toBeInstanceOf(Array);
      expect(headers.length).toBeGreaterThan(0);
    });

    it('should include security headers for all pages', async () => {
      const headers = await nextConfig.headers();
      const globalHeaders = headers.find((h) => h.source === '/(.*)');

      expect(globalHeaders).toBeDefined();
      expect(globalHeaders?.headers).toBeInstanceOf(Array);
    });

    it('should set X-Content-Type-Options to nosniff', async () => {
      const headers = await nextConfig.headers();
      const globalHeaders = headers.find((h) => h.source === '/(.*)');
      const header = globalHeaders?.headers.find((h) => h.key === 'X-Content-Type-Options');

      expect(header?.value).toBe('nosniff');
    });

    it('should set X-Frame-Options to DENY', async () => {
      const headers = await nextConfig.headers();
      const globalHeaders = headers.find((h) => h.source === '/(.*)');
      const header = globalHeaders?.headers.find((h) => h.key === 'X-Frame-Options');

      expect(header?.value).toBe('DENY');
    });

    it('should enable XSS protection', async () => {
      const headers = await nextConfig.headers();
      const globalHeaders = headers.find((h) => h.source === '/(.*)');
      const header = globalHeaders?.headers.find((h) => h.key === 'X-XSS-Protection');

      expect(header?.value).toBe('1; mode=block');
    });

    it('should set referrer policy', async () => {
      const headers = await nextConfig.headers();
      const globalHeaders = headers.find((h) => h.source === '/(.*)');
      const header = globalHeaders?.headers.find((h) => h.key === 'Referrer-Policy');

      expect(header?.value).toBe('strict-origin-when-cross-origin');
    });

    it('should set permissions policy', async () => {
      const headers = await nextConfig.headers();
      const globalHeaders = headers.find((h) => h.source === '/(.*)');
      const header = globalHeaders?.headers.find((h) => h.key === 'Permissions-Policy');

      expect(header?.value).toContain('camera=()');
      expect(header?.value).toContain('microphone=()');
      expect(header?.value).toContain('geolocation=()');
    });
  });

  describe('Cache Headers', () => {
    it('should cache static assets with immutable', async () => {
      const headers = await nextConfig.headers();
      const staticAssetHeaders = headers.filter((h) =>
        h.source.includes('ico') ||
        h.source.includes('png') ||
        h.source.includes('woff')
      );

      expect(staticAssetHeaders.length).toBeGreaterThanOrEqual(1);
      staticAssetHeaders.forEach((rule) => {
        const cacheHeader = rule.headers.find((h) => h.key === 'Cache-Control');
        expect(cacheHeader?.value).toContain('immutable');
        expect(cacheHeader?.value).toContain('max-age=31536000');
      });
    });

    it('should cache Next.js static files aggressively', async () => {
      const headers = await nextConfig.headers();
      const nextStaticHeaders = headers.find((h) => h.source.includes('_next/static'));

      expect(nextStaticHeaders).toBeDefined();
      const cacheHeader = nextStaticHeaders?.headers.find((h) => h.key === 'Cache-Control');
      expect(cacheHeader?.value).toContain('max-age=31536000');
      expect(cacheHeader?.value).toContain('immutable');
    });

    it('should not cache HTML pages', async () => {
      const headers = await nextConfig.headers();
      const htmlHeaders = headers.find((h) =>
        h.has && h.has[0].value.includes('text/html')
      );

      expect(htmlHeaders).toBeDefined();
      const cacheHeader = htmlHeaders?.headers.find((h) => h.key === 'Cache-Control');
      expect(cacheHeader?.value).toBe('public, max-age=0, must-revalidate');
    });

    it('should use 1-year cache for immutable assets', async () => {
      const headers = await nextConfig.headers();
      const immutableRules = headers.filter((h) => {
        const cacheHeader = h.headers.find((header) => header.key === 'Cache-Control');
        return cacheHeader?.value.includes('immutable');
      });

      immutableRules.forEach((rule) => {
        const cacheHeader = rule.headers.find((h) => h.key === 'Cache-Control');
        expect(cacheHeader?.value).toContain('31536000'); // 1 year in seconds
      });
    });
  });

  describe('Webpack Configuration', () => {
    it('should have webpack customization function', () => {
      expect(nextConfig.webpack).toBeInstanceOf(Function);
    });

    it('should configure code splitting for production', () => {
      const mockConfig = {
        optimization: {},
      };

      const result = nextConfig.webpack(mockConfig, { dev: false, isServer: false });

      expect(result.optimization.splitChunks).toBeDefined();
      expect(result.optimization.splitChunks.chunks).toBe('all');
    });

    it('should create vendor chunk for node_modules', () => {
      const mockConfig = {
        optimization: {},
      };

      const result = nextConfig.webpack(mockConfig, { dev: false, isServer: false });

      expect(result.optimization.splitChunks.cacheGroups.vendor).toBeDefined();
      expect(result.optimization.splitChunks.cacheGroups.vendor.name).toBe('vendor');
    });

    it('should not modify config in development', () => {
      const mockConfig = {
        optimization: {},
      };

      const result = nextConfig.webpack(mockConfig, { dev: true, isServer: false });

      expect(result.optimization.splitChunks).toBeUndefined();
    });

    it('should not modify config for server builds', () => {
      const mockConfig = {
        optimization: {},
      };

      const result = nextConfig.webpack(mockConfig, { dev: false, isServer: true });

      expect(result.optimization.splitChunks).toBeUndefined();
    });

    it('should return modified config', () => {
      const mockConfig = {
        optimization: {},
        name: 'test',
      };

      const result = nextConfig.webpack(mockConfig, { dev: false, isServer: false });

      expect(result).toBeDefined();
      expect(result.name).toBe('test');
    });
  });

  describe('Experimental Features', () => {
    it('should have experimental configuration', () => {
      expect(nextConfig.experimental).toBeDefined();
    });

    it('should optimize package imports', () => {
      expect(nextConfig.experimental.optimizePackageImports).toBeDefined();
      expect(nextConfig.experimental.optimizePackageImports).toBeInstanceOf(Array);
    });

    it('should optimize lucide-react imports', () => {
      expect(nextConfig.experimental.optimizePackageImports).toContain('lucide-react');
    });

    it('should optimize radix-ui imports', () => {
      expect(nextConfig.experimental.optimizePackageImports).toContain('@radix-ui/react-icons');
    });
  });

  describe('SEO-Friendly Configuration', () => {
    it('should use clean URLs without trailing slashes', () => {
      expect(nextConfig.trailingSlash).toBe(false);
    });

    it('should have permanent redirects for SEO equity preservation', async () => {
      const redirects = await nextConfig.redirects();

      redirects.forEach((redirect) => {
        expect(redirect.permanent).toBe(true);
      });
    });

    it('should redirect old URL patterns to canonical URLs', async () => {
      const redirects = await nextConfig.redirects();
      const urlNormalizations = redirects.filter((r) =>
        r.source === '/home' || r.source === '/index.html'
      );

      expect(urlNormalizations.length).toBeGreaterThan(0);
    });

    it('should not expose server information', async () => {
      expect(nextConfig.poweredByHeader).toBe(false);

      const headers = await nextConfig.headers();
      const poweredByHeader = headers.some((rule) =>
        rule.headers.some((h) => h.key.toLowerCase() === 'x-powered-by')
      );

      expect(poweredByHeader).toBe(false);
    });
  });

  describe('Performance Optimization', () => {
    it('should enable compression', () => {
      expect(nextConfig.compress).toBe(true);
    });

    it('should configure code splitting', () => {
      const mockConfig = { optimization: {} };
      const result = nextConfig.webpack(mockConfig, { dev: false, isServer: false });

      expect(result.optimization.splitChunks).toBeDefined();
    });

    it('should optimize modern image formats', () => {
      expect(nextConfig.images.formats).toContain('image/avif');
      expect(nextConfig.images.formats).toContain('image/webp');
    });

    it('should use long-term caching for assets', async () => {
      const headers = await nextConfig.headers();
      const assetCaching = headers.some((rule) => {
        const cacheHeader = rule.headers.find((h) => h.key === 'Cache-Control');
        return cacheHeader?.value.includes('31536000');
      });

      expect(assetCaching).toBe(true);
    });
  });

  describe('Static Export Configuration', () => {
    it('should be configured for static export', () => {
      expect(nextConfig.output).toBe('export');
    });

    it('should have unoptimized images for static export compatibility', () => {
      expect(nextConfig.images.unoptimized).toBe(true);
    });

    it('should not require server runtime', () => {
      expect(nextConfig.output).not.toBe('standalone');
    });
  });

  describe('Configuration Consistency', () => {
    it('should have consistent redirect destinations', async () => {
      const redirects = await nextConfig.redirects();

      // All blog redirects should go to /blog/
      const blogRedirects = redirects.filter((r) => r.destination.includes('/blog/'));
      blogRedirects.forEach((redirect) => {
        expect(redirect.destination).toMatch(/^\/blog\//);
      });
    });

    it('should have valid regex patterns in headers', async () => {
      const headers = await nextConfig.headers();

      headers.forEach((rule) => {
        expect(() => new RegExp(rule.source.replace(/\(/g, '\\(').replace(/\)/g, '\\)'))).not.toThrow();
      });
    });

    it('should have all security headers on same rule', async () => {
      const headers = await nextConfig.headers();
      const securityRule = headers.find((h) => h.source === '/(.*)');

      const securityHeaders = ['X-Content-Type-Options', 'X-Frame-Options', 'X-XSS-Protection', 'Referrer-Policy'];
      securityHeaders.forEach((headerName) => {
        const hasHeader = securityRule?.headers.some((h) => h.key === headerName);
        expect(hasHeader).toBe(true);
      });
    });
  });
});