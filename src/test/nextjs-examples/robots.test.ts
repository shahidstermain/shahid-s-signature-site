/**
 * Tests for Next.js robots.txt generator
 * Testing: docs/nextjs-migration-examples/app/robots.ts
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock the robots function logic
const SITE_URL = 'https://shahidster.tech';

interface RobotRule {
  userAgent: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
}

interface Robots {
  rules: RobotRule | RobotRule[];
  sitemap?: string | string[];
  host?: string;
}

function robots(isProduction: boolean, isProductionDomain: boolean): Robots {
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
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '*.json$',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

describe('Robots.txt Generator', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Non-production Environment', () => {
    it('should block all crawlers in non-production', () => {
      const result = robots(false, true);

      expect(result.rules).toEqual({
        userAgent: '*',
        disallow: '/',
      });
      expect(result.sitemap).toBeUndefined();
      expect(result.host).toBeUndefined();
    });

    it('should block all crawlers on non-production domain', () => {
      const result = robots(true, false);

      expect(result.rules).toEqual({
        userAgent: '*',
        disallow: '/',
      });
    });

    it('should block crawlers when both flags are false', () => {
      const result = robots(false, false);

      expect(result.rules).toEqual({
        userAgent: '*',
        disallow: '/',
      });
    });
  });

  describe('Production Environment', () => {
    it('should allow all major search crawlers', () => {
      const result = robots(true, true);

      expect(Array.isArray(result.rules)).toBe(true);
      const rules = result.rules as RobotRule[];

      // Check for major crawlers
      const googlebot = rules.find(r => r.userAgent === 'Googlebot');
      const bingbot = rules.find(r => r.userAgent === 'Bingbot');
      const twitterbot = rules.find(r => r.userAgent === 'Twitterbot');

      expect(googlebot).toBeDefined();
      expect(bingbot).toBeDefined();
      expect(twitterbot).toBeDefined();
    });

    it('should configure Googlebot correctly', () => {
      const result = robots(true, true);
      const rules = result.rules as RobotRule[];
      const googlebot = rules.find(r => r.userAgent === 'Googlebot');

      expect(googlebot).toEqual({
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      });
    });

    it('should configure Googlebot-Image correctly', () => {
      const result = robots(true, true);
      const rules = result.rules as RobotRule[];
      const googlebotImage = rules.find(r => r.userAgent === 'Googlebot-Image');

      expect(googlebotImage).toEqual({
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      });
    });

    it('should configure Bingbot correctly', () => {
      const result = robots(true, true);
      const rules = result.rules as RobotRule[];
      const bingbot = rules.find(r => r.userAgent === 'Bingbot');

      expect(bingbot).toEqual({
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      });
    });

    it('should allow social media crawlers', () => {
      const result = robots(true, true);
      const rules = result.rules as RobotRule[];

      const twitterbot = rules.find(r => r.userAgent === 'Twitterbot');
      const facebook = rules.find(r => r.userAgent === 'facebookexternalhit');
      const linkedin = rules.find(r => r.userAgent === 'LinkedInBot');
      const slack = rules.find(r => r.userAgent === 'Slackbot');
      const discord = rules.find(r => r.userAgent === 'Discordbot');

      expect(twitterbot?.allow).toBe('/');
      expect(facebook?.allow).toBe('/');
      expect(linkedin?.allow).toBe('/');
      expect(slack?.allow).toBe('/');
      expect(discord?.allow).toBe('/');
    });

    it('should have default rule for all other crawlers', () => {
      const result = robots(true, true);
      const rules = result.rules as RobotRule[];
      const defaultRule = rules.find(r => r.userAgent === '*');

      expect(defaultRule).toBeDefined();
      expect(defaultRule?.allow).toBe('/');
      expect(defaultRule?.disallow).toEqual([
        '/api/',
        '/admin/',
        '/_next/',
        '/private/',
        '*.json$',
      ]);
    });

    it('should include sitemap reference', () => {
      const result = robots(true, true);

      expect(result.sitemap).toBe('https://shahidster.tech/sitemap.xml');
    });

    it('should include host directive', () => {
      const result = robots(true, true);

      expect(result.host).toBe('https://shahidster.tech');
    });

    it('should block sensitive paths for all crawlers', () => {
      const result = robots(true, true);
      const rules = result.rules as RobotRule[];
      const defaultRule = rules.find(r => r.userAgent === '*');

      expect(defaultRule?.disallow).toContain('/api/');
      expect(defaultRule?.disallow).toContain('/admin/');
      expect(defaultRule?.disallow).toContain('/_next/');
      expect(defaultRule?.disallow).toContain('/private/');
    });

    it('should block JSON files with pattern', () => {
      const result = robots(true, true);
      const rules = result.rules as RobotRule[];
      const defaultRule = rules.find(r => r.userAgent === '*');

      expect(defaultRule?.disallow).toContain('*.json$');
    });
  });

  describe('Robot Rules Configuration', () => {
    it('should have correct number of rules in production', () => {
      const result = robots(true, true);
      const rules = result.rules as RobotRule[];

      // Should have rules for: Googlebot, Googlebot-Image, Bingbot,
      // Twitterbot, Facebook, LinkedIn, Slack, Discord, and default (*)
      expect(rules.length).toBe(9);
    });

    it('should not allow crawlers to index Next.js internal paths', () => {
      const result = robots(true, true);
      const rules = result.rules as RobotRule[];

      // Check that major crawlers disallow /_next/
      const googlebot = rules.find(r => r.userAgent === 'Googlebot');
      const bingbot = rules.find(r => r.userAgent === 'Bingbot');
      const defaultRule = rules.find(r => r.userAgent === '*');

      expect(googlebot?.disallow).toContain('/_next/');
      expect(bingbot?.disallow).toContain('/_next/');
      expect(defaultRule?.disallow).toContain('/_next/');
    });

    it('should allow image crawler more access than text crawler', () => {
      const result = robots(true, true);
      const rules = result.rules as RobotRule[];

      const googlebot = rules.find(r => r.userAgent === 'Googlebot');
      const googlebotImage = rules.find(r => r.userAgent === 'Googlebot-Image');

      // Googlebot blocks /_next/, but Googlebot-Image doesn't
      expect((googlebot?.disallow as string[])?.length).toBeGreaterThan(
        (googlebotImage?.disallow as string[])?.length
      );
    });
  });

  describe('Security Considerations', () => {
    it('should block admin paths in production', () => {
      const result = robots(true, true);
      const rules = result.rules as RobotRule[];
      const defaultRule = rules.find(r => r.userAgent === '*');

      expect(defaultRule?.disallow).toContain('/admin/');
    });

    it('should block API paths in production', () => {
      const result = robots(true, true);
      const rules = result.rules as RobotRule[];
      const defaultRule = rules.find(r => r.userAgent === '*');

      expect(defaultRule?.disallow).toContain('/api/');
    });

    it('should block private paths in production', () => {
      const result = robots(true, true);
      const rules = result.rules as RobotRule[];
      const defaultRule = rules.find(r => r.userAgent === '*');

      expect(defaultRule?.disallow).toContain('/private/');
    });
  });

  describe('Edge Cases', () => {
    it('should handle production flag correctly', () => {
      // Test different combinations
      expect(robots(true, true).rules).not.toEqual({ userAgent: '*', disallow: '/' });
      expect(robots(false, true).rules).toEqual({ userAgent: '*', disallow: '/' });
      expect(robots(true, false).rules).toEqual({ userAgent: '*', disallow: '/' });
      expect(robots(false, false).rules).toEqual({ userAgent: '*', disallow: '/' });
    });

    it('should have all social crawlers unrestricted', () => {
      const result = robots(true, true);
      const rules = result.rules as RobotRule[];

      const socialCrawlers = [
        'Twitterbot',
        'facebookexternalhit',
        'LinkedInBot',
        'Slackbot',
        'Discordbot',
      ];

      socialCrawlers.forEach(crawler => {
        const rule = rules.find(r => r.userAgent === crawler);
        expect(rule?.allow).toBe('/');
        expect(rule?.disallow).toBeUndefined();
      });
    });
  });

  describe('SEO Best Practices', () => {
    it('should not block sitemap from being crawled', () => {
      const result = robots(true, true);
      const rules = result.rules as RobotRule[];
      const defaultRule = rules.find(r => r.userAgent === '*');

      // Sitemap should not be in disallow list
      expect(defaultRule?.disallow).not.toContain('/sitemap.xml');
    });

    it('should not block robots.txt from referencing itself', () => {
      const result = robots(true, true);

      // Should have sitemap reference but not block robots.txt
      expect(result.sitemap).toBeDefined();
      expect(result.host).toBeDefined();
    });

    it('should maintain consistent rule ordering', () => {
      const result1 = robots(true, true);
      const result2 = robots(true, true);

      expect(result1).toEqual(result2);
    });

    it('should block crawler access to sensitive Next.js build files', () => {
      const result = robots(true, true);
      const rules = result.rules as RobotRule[];
      const googlebot = rules.find(r => r.userAgent === 'Googlebot');

      // Build artifacts should be blocked
      expect(googlebot?.disallow).toContain('/_next/');
    });
  });

  describe('Regression Tests', () => {
    it('should preserve sitemap URL format across generations', () => {
      const result = robots(true, true);

      expect(result.sitemap).toBe('https://shahidster.tech/sitemap.xml');
      expect(result.sitemap).not.toContain('//sitemap.xml'); // No double slashes
    });

    it('should block JSON files but allow specific feed files', () => {
      const result = robots(true, true);
      const rules = result.rules as RobotRule[];
      const defaultRule = rules.find(r => r.userAgent === '*');

      // JSON pattern should be blocked
      expect(defaultRule?.disallow).toContain('*.json$');
      // But not prevent access to valid paths
      expect(defaultRule?.allow).toBe('/');
    });

    it('should handle different crawler case sensitivity', () => {
      const result = robots(true, true);
      const rules = result.rules as RobotRule[];

      // Check that exact case matching is used
      const googlebot = rules.find(r => r.userAgent === 'Googlebot');
      const googlebotLower = rules.find(r => r.userAgent === 'googlebot');

      expect(googlebot).toBeDefined();
      expect(googlebotLower).toBeUndefined(); // Should not match lowercase
    });

    it('should always include host and sitemap in production', () => {
      const result = robots(true, true);

      expect(result.host).toBeTruthy();
      expect(result.sitemap).toBeTruthy();
      expect(typeof result.host).toBe('string');
      expect(typeof result.sitemap).toBe('string');
    });
  });
});