/**
 * Next.js App Router robots.txt Generator
 * 
 * This file generates a dynamic robots.txt that:
 * - Allows all crawlers in production
 * - Blocks all crawlers in staging/development
 * - References the sitemap
 * - Includes bot-specific rules
 * 
 * The robots.txt is automatically served at /robots.txt
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shahidster.tech';

/**
 * Generate robots.txt metadata for the Next.js App Router based on environment and site URL.
 *
 * In non-production environments or when the configured SITE_URL does not include "shahidster.tech",
 * returns a directives set that blocks all crawlers. In production on the shahidster.tech domain,
 * returns production-optimized rules: per-bot allowances for Google, Google Images, and Bing; allowances
 * for social crawlers (Twitter, Facebook, LinkedIn, Slack, Discord); and a default rule that allows
 * the site root but disallows /api/, /admin/, /_next/, /private/, and JSON file patterns. Also sets
 * the sitemap and host to the configured SITE_URL.
 *
 * @returns A `MetadataRoute.Robots` object containing crawler rules, `sitemap`, and `host`.
 */
export default function robots(): MetadataRoute.Robots {
  // Block all crawlers on non-production environments
  const isProduction = process.env.NODE_ENV === 'production';
  const isProductionDomain = SITE_URL.includes('shahidster.tech');

  if (!isProduction || !isProductionDomain) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  // Production robots.txt
  return {
    rules: [
      // Google - main search crawler
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
      // Google Images
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      // Bing
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
      // Twitter/X card crawler
      {
        userAgent: 'Twitterbot',
        allow: '/',
      },
      // Facebook Open Graph crawler
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
      // LinkedIn crawler
      {
        userAgent: 'LinkedInBot',
        allow: '/',
      },
      // Slack unfurling
      {
        userAgent: 'Slackbot',
        allow: '/',
      },
      // Discord crawler
      {
        userAgent: 'Discordbot',
        allow: '/',
      },
      // Default rule for all other crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '*.json$', // Block JSON files except explicitly allowed
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

/**
 * Advanced: Crawl Delay and Additional Directives
 * 
 * Note: Next.js MetadataRoute.Robots doesn't support all directives natively.
 * For advanced use cases, use a route handler instead:
 * 
 * // app/robots.txt/route.ts
 * export async function GET() {
 *   const robotsTxt = `
 * User-agent: *
 * Allow: /
 * Disallow: /api/
 * Disallow: /admin/
 * Crawl-delay: 1
 * 
 * User-agent: Googlebot
 * Allow: /
 * 
 * Sitemap: https://shahidster.tech/sitemap.xml
 * Host: https://shahidster.tech
 * `;
 * 
 *   return new Response(robotsTxt, {
 *     headers: {
 *       'Content-Type': 'text/plain',
 *       'Cache-Control': 'public, max-age=86400',
 *     },
 *   });
 * }
 */
