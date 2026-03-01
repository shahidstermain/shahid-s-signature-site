import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock environment variables
const mockEnv = {
  NODE_ENV: 'production',
  NEXT_PUBLIC_SITE_URL: 'https://shahidster.tech',
};

// Robots.txt generator function (from the example)
function generateRobots(env: typeof mockEnv) {
  const SITE_URL = env.NEXT_PUBLIC_SITE_URL || 'https://shahidster.tech';
  const isProduction = env.NODE_ENV === 'production';
  const isProductionDomain = SITE_URL.includes('shahidster.tech');

  if (!isProduction || !isProductionDomain) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
      {
        userAgent: 'Twitterbot',
        allow: '/',
      },
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
      {
        userAgent: 'LinkedInBot',
        allow: '/',
      },
      {
        userAgent: 'Slackbot',
        allow: '/',
      },
      {
        userAgent: 'Discordbot',
        allow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/private/', '*.json$'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

describe('Robots.txt Generation', () => {
  describe('Production Environment', () => {
    it('should generate robots.txt for production', () => {
      const robots = generateRobots({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: 'https://shahidster.tech',
      });

      expect(robots.rules).toBeInstanceOf(Array);
      expect(robots.sitemap).toBe('https://shahidster.tech/sitemap.xml');
      expect(robots.host).toBe('https://shahidster.tech');
    });

    it('should include Googlebot rules', () => {
      const robots = generateRobots({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: 'https://shahidster.tech',
      });

      const googlebotRule = Array.isArray(robots.rules)
        ? robots.rules.find((r) => r.userAgent === 'Googlebot')
        : null;

      expect(googlebotRule).toBeDefined();
      expect(googlebotRule?.allow).toBe('/');
      expect(googlebotRule?.disallow).toContain('/api/');
      expect(googlebotRule?.disallow).toContain('/admin/');
    });

    it('should include social media crawlers', () => {
      const robots = generateRobots({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: 'https://shahidster.tech',
      });

      if (Array.isArray(robots.rules)) {
        const twitterBot = robots.rules.find((r) => r.userAgent === 'Twitterbot');
        const facebookBot = robots.rules.find((r) => r.userAgent === 'facebookexternalhit');
        const linkedinBot = robots.rules.find((r) => r.userAgent === 'LinkedInBot');

        expect(twitterBot).toBeDefined();
        expect(facebookBot).toBeDefined();
        expect(linkedinBot).toBeDefined();
      }
    });

    it('should include wildcard rule with restrictions', () => {
      const robots = generateRobots({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: 'https://shahidster.tech',
      });

      if (Array.isArray(robots.rules)) {
        const wildcardRule = robots.rules.find((r) => r.userAgent === '*');

        expect(wildcardRule).toBeDefined();
        expect(wildcardRule?.allow).toBe('/');
        expect(wildcardRule?.disallow).toContain('/api/');
        expect(wildcardRule?.disallow).toContain('/admin/');
        expect(wildcardRule?.disallow).toContain('*.json$');
      }
    });

    it('should reference sitemap correctly', () => {
      const robots = generateRobots({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: 'https://shahidster.tech',
      });

      expect(robots.sitemap).toBe('https://shahidster.tech/sitemap.xml');
    });

    it('should set host directive', () => {
      const robots = generateRobots({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: 'https://shahidster.tech',
      });

      expect(robots.host).toBe('https://shahidster.tech');
    });
  });

  describe('Development Environment', () => {
    it('should block all crawlers in development', () => {
      const robots = generateRobots({
        NODE_ENV: 'development',
        NEXT_PUBLIC_SITE_URL: 'https://shahidster.tech',
      });

      expect(robots.rules).toEqual({
        userAgent: '*',
        disallow: '/',
      });
    });

    it('should block all crawlers on non-production domain', () => {
      const robots = generateRobots({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: 'https://staging.example.com',
      });

      expect(robots.rules).toEqual({
        userAgent: '*',
        disallow: '/',
      });
    });

    it('should not have sitemap in non-production', () => {
      const robots = generateRobots({
        NODE_ENV: 'development',
        NEXT_PUBLIC_SITE_URL: 'https://shahidster.tech',
      });

      expect(robots.sitemap).toBeUndefined();
      expect(robots.host).toBeUndefined();
    });
  });

  describe('Bot-Specific Rules', () => {
    it('should allow Googlebot-Image to crawl images', () => {
      const robots = generateRobots({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: 'https://shahidster.tech',
      });

      if (Array.isArray(robots.rules)) {
        const imageBotRule = robots.rules.find((r) => r.userAgent === 'Googlebot-Image');
        expect(imageBotRule?.allow).toBe('/');
        expect(imageBotRule?.disallow).not.toContain('/_next/');
      }
    });

    it('should allow Bingbot with restrictions', () => {
      const robots = generateRobots({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: 'https://shahidster.tech',
      });

      if (Array.isArray(robots.rules)) {
        const bingbotRule = robots.rules.find((r) => r.userAgent === 'Bingbot');
        expect(bingbotRule?.allow).toBe('/');
        expect(bingbotRule?.disallow).toContain('/api/');
      }
    });

    it('should allow social media bots unrestricted access', () => {
      const robots = generateRobots({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: 'https://shahidster.tech',
      });

      if (Array.isArray(robots.rules)) {
        const socialBots = ['Twitterbot', 'facebookexternalhit', 'Slackbot', 'Discordbot'];

        socialBots.forEach((botName) => {
          const botRule = robots.rules.find((r: any) => r.userAgent === botName);
          expect(botRule?.allow).toBe('/');
          expect(botRule?.disallow).toBeUndefined();
        });
      }
    });
  });

  describe('Disallow Patterns', () => {
    it('should block API routes for general bots', () => {
      const robots = generateRobots({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: 'https://shahidster.tech',
      });

      if (Array.isArray(robots.rules)) {
        const wildcardRule = robots.rules.find((r) => r.userAgent === '*');
        expect(wildcardRule?.disallow).toContain('/api/');
      }
    });

    it('should block admin routes', () => {
      const robots = generateRobots({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: 'https://shahidster.tech',
      });

      if (Array.isArray(robots.rules)) {
        const wildcardRule = robots.rules.find((r) => r.userAgent === '*');
        expect(wildcardRule?.disallow).toContain('/admin/');
      }
    });

    it('should block Next.js internal routes', () => {
      const robots = generateRobots({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: 'https://shahidster.tech',
      });

      if (Array.isArray(robots.rules)) {
        const googlebotRule = robots.rules.find((r) => r.userAgent === 'Googlebot');
        expect(googlebotRule?.disallow).toContain('/_next/');
      }
    });

    it('should block JSON files with pattern', () => {
      const robots = generateRobots({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: 'https://shahidster.tech',
      });

      if (Array.isArray(robots.rules)) {
        const wildcardRule = robots.rules.find((r) => r.userAgent === '*');
        expect(wildcardRule?.disallow).toContain('*.json$');
      }
    });

    it('should block private directory', () => {
      const robots = generateRobots({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: 'https://shahidster.tech',
      });

      if (Array.isArray(robots.rules)) {
        const wildcardRule = robots.rules.find((r) => r.userAgent === '*');
        expect(wildcardRule?.disallow).toContain('/private/');
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing SITE_URL environment variable', () => {
      const robots = generateRobots({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: '',
      });

      // Should fall back to default
      expect(robots.sitemap || robots.host).toBeDefined();
    });

    it('should handle custom domain', () => {
      const customDomain = 'https://custom.shahidster.tech';
      const robots = generateRobots({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: customDomain,
      });

      expect(robots.sitemap).toBe(`${customDomain}/sitemap.xml`);
      expect(robots.host).toBe(customDomain);
    });

    it('should handle test environment', () => {
      const robots = generateRobots({
        NODE_ENV: 'test',
        NEXT_PUBLIC_SITE_URL: 'https://shahidster.tech',
      });

      expect(robots.rules).toEqual({
        userAgent: '*',
        disallow: '/',
      });
    });
  });

  describe('Security Considerations', () => {
    it('should not expose sensitive paths', () => {
      const robots = generateRobots({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: 'https://shahidster.tech',
      });

      if (Array.isArray(robots.rules)) {
        const wildcardRule = robots.rules.find((r) => r.userAgent === '*');
        const sensitivePatterns = ['/api/', '/admin/', '/private/'];

        sensitivePatterns.forEach((pattern) => {
          expect(wildcardRule?.disallow).toContain(pattern);
        });
      }
    });

    it('should allow public content paths', () => {
      const robots = generateRobots({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: 'https://shahidster.tech',
      });

      if (Array.isArray(robots.rules)) {
        const googlebotRule = robots.rules.find((r) => r.userAgent === 'Googlebot');
        expect(googlebotRule?.allow).toBe('/');
      }
    });
  });
});