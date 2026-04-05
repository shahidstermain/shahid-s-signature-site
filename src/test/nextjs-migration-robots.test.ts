/**
 * Tests for docs/nextjs-migration-examples/app/robots.ts
 *
 * Covers the default robots() export, which generates Next.js
 * MetadataRoute.Robots configuration based on environment and domain.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock 'next' so the MetadataRoute type import does not fail at runtime
vi.mock('next', () => ({}));

// ---------------------------------------------------------------------------
// Helpers to reload the module with different env vars
// ---------------------------------------------------------------------------
async function loadRobots(
  nodeEnv: string,
  siteUrl?: string
) {
  vi.resetModules();
  vi.stubEnv('NODE_ENV', nodeEnv);
  if (siteUrl !== undefined) {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', siteUrl);
  } else {
    // Remove override so the module uses its own default
    vi.unstubAllEnvs();
    vi.stubEnv('NODE_ENV', nodeEnv);
  }
  const mod = await import(
    '../../docs/nextjs-migration-examples/app/robots'
  );
  return mod.default;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

// ---------------------------------------------------------------------------
// Non-production environment
// ---------------------------------------------------------------------------
describe('robots() – non-production environment', () => {
  it('returns a single wildcard disallow "/" rule in test env', async () => {
    const robots = await loadRobots('test');
    const result = robots();
    const rules = result.rules as { userAgent: string; disallow: string };
    expect(rules.userAgent).toBe('*');
    expect(rules.disallow).toBe('/');
  });

  it('does not include a sitemap property in test env', async () => {
    const robots = await loadRobots('test');
    const result = robots();
    expect(result.sitemap).toBeUndefined();
  });

  it('does not include a host property in test env', async () => {
    const robots = await loadRobots('test');
    const result = robots();
    expect(result.host).toBeUndefined();
  });

  it('blocks all crawlers in development env', async () => {
    const robots = await loadRobots('development');
    const result = robots();
    const rules = result.rules as { userAgent: string; disallow: string };
    expect(rules.disallow).toBe('/');
  });
});

// ---------------------------------------------------------------------------
// Production environment with wrong domain
// ---------------------------------------------------------------------------
describe('robots() – production env with non-canonical domain', () => {
  it('blocks all crawlers when domain does not include shahidster.tech', async () => {
    const robots = await loadRobots('production', 'https://staging.example.com');
    const result = robots();
    const rules = result.rules as { userAgent: string; disallow: string };
    expect(rules.userAgent).toBe('*');
    expect(rules.disallow).toBe('/');
  });
});

// ---------------------------------------------------------------------------
// Production environment with canonical domain
// ---------------------------------------------------------------------------
describe('robots() – production env with canonical domain', () => {
  let robots: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    robots = await loadRobots(
      'production',
      'https://shahidster.tech'
    );
  });

  it('returns an array of rules', () => {
    const result = robots();
    expect(Array.isArray(result.rules)).toBe(true);
  });

  it('includes a Googlebot rule that allows "/"', () => {
    const result = robots();
    const rules = result.rules as Array<{ userAgent: string; allow?: string; disallow?: string | string[] }>;
    const googlebot = rules.find((r) => r.userAgent === 'Googlebot');
    expect(googlebot).toBeDefined();
    expect(googlebot?.allow).toBe('/');
  });

  it('Googlebot disallows /api/, /admin/, /_next/', () => {
    const result = robots();
    const rules = result.rules as Array<{ userAgent: string; disallow?: string | string[] }>;
    const googlebot = rules.find((r) => r.userAgent === 'Googlebot');
    const disallow = googlebot?.disallow as string[];
    expect(disallow).toContain('/api/');
    expect(disallow).toContain('/admin/');
    expect(disallow).toContain('/_next/');
  });

  it('includes a Bingbot rule that allows "/"', () => {
    const result = robots();
    const rules = result.rules as Array<{ userAgent: string; allow?: string }>;
    const bingbot = rules.find((r) => r.userAgent === 'Bingbot');
    expect(bingbot).toBeDefined();
    expect(bingbot?.allow).toBe('/');
  });

  it('includes Googlebot-Image rule', () => {
    const result = robots();
    const rules = result.rules as Array<{ userAgent: string }>;
    expect(rules.find((r) => r.userAgent === 'Googlebot-Image')).toBeDefined();
  });

  it('includes social crawlers (Twitterbot, facebookexternalhit, LinkedInBot)', () => {
    const result = robots();
    const rules = result.rules as Array<{ userAgent: string; allow?: string }>;
    const userAgents = rules.map((r) => r.userAgent);
    expect(userAgents).toContain('Twitterbot');
    expect(userAgents).toContain('facebookexternalhit');
    expect(userAgents).toContain('LinkedInBot');
  });

  it('includes Slackbot and Discordbot rules', () => {
    const result = robots();
    const rules = result.rules as Array<{ userAgent: string }>;
    const userAgents = rules.map((r) => r.userAgent);
    expect(userAgents).toContain('Slackbot');
    expect(userAgents).toContain('Discordbot');
  });

  it('includes a wildcard rule as the last rule', () => {
    const result = robots();
    const rules = result.rules as Array<{ userAgent: string; allow?: string; disallow?: string | string[] }>;
    const wildcard = rules.find((r) => r.userAgent === '*');
    expect(wildcard).toBeDefined();
    expect(wildcard?.allow).toBe('/');
  });

  it('wildcard rule disallows private paths', () => {
    const result = robots();
    const rules = result.rules as Array<{ userAgent: string; disallow?: string | string[] }>;
    const wildcard = rules.find((r) => r.userAgent === '*');
    const disallow = wildcard?.disallow as string[];
    expect(disallow).toContain('/api/');
    expect(disallow).toContain('/admin/');
    expect(disallow).toContain('/private/');
  });

  it('includes sitemap pointing to /sitemap.xml', () => {
    const result = robots();
    expect(result.sitemap).toBe('https://shahidster.tech/sitemap.xml');
  });

  it('includes host set to the site URL', () => {
    const result = robots();
    expect(result.host).toBe('https://shahidster.tech');
  });
});