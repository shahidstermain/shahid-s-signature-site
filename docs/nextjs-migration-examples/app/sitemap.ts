/**
 * Next.js App Router Dynamic Sitemap
 * 
 * This file generates a dynamic XML sitemap that includes:
 * - All static pages
 * - All blog posts from the articles data
 * - Proper lastModified, changeFrequency, and priority values
 * 
 * The sitemap is automatically served at /sitemap.xml
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import { MetadataRoute } from 'next';
import { articles } from '@/data/articles';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shahidster.tech';

/**
 * Convert a date string like "Nov 2025" into a Date set to the 15th of that month and year.
 *
 * @param dateStr - A string in the format "Mon YYYY" where `Mon` is a three-letter month abbreviation (e.g., "Jan", "Feb").
 * @returns A Date representing the 15th day of the parsed month and year. If the month abbreviation is unrecognized, January is used. If the input does not match "Mon YYYY", returns the current date.
 */
function parseArticleDate(dateStr: string): Date {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const parts = dateStr.split(' ');
  if (parts.length === 2) {
    const month = months[parts[0]] || 0;
    const year = parseInt(parts[1]);
    return new Date(year, month, 15);
  }
  return new Date();
}

/**
 * Generate the site's sitemap including the homepage and blog posts.
 *
 * @returns An array of sitemap entries where the first entry is the homepage (weekly, priority 1.0) and subsequent entries are blog posts under `/blog/{slug}` with `lastModified` derived from each article's `date`, `changeFrequency` set to `monthly`, priority `0.9` for featured posts and `0.8` otherwise; blog post entries are sorted by `lastModified` in descending order (newest first).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Current date for homepage
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  // Blog posts - sorted by date (newest first)
  const blogPosts: MetadataRoute.Sitemap = articles
    .map((article) => ({
      url: `${SITE_URL}/blog/${article.slug}`,
      lastModified: parseArticleDate(article.date),
      changeFrequency: 'monthly' as const,
      priority: article.featured ? 0.9 : 0.8,
    }))
    .sort((a, b) => {
      const dateA = a.lastModified instanceof Date ? a.lastModified : new Date(a.lastModified);
      const dateB = b.lastModified instanceof Date ? b.lastModified : new Date(b.lastModified);
      return dateB.getTime() - dateA.getTime();
    });

  return [...staticPages, ...blogPosts];
}

/**
 * Alternative: Sitemap Index for Large Sites
 * 
 * If your site has thousands of pages, you should use a sitemap index
 * that references multiple sitemaps (max 50,000 URLs per sitemap).
 * 
 * Example:
 * 
 * export default function sitemap(): MetadataRoute.Sitemap {
 *   return [
 *     {
 *       url: `${SITE_URL}/sitemap-main.xml`,
 *       lastModified: new Date(),
 *     },
 *     {
 *       url: `${SITE_URL}/sitemap-blog-1.xml`,
 *       lastModified: new Date(),
 *     },
 *     {
 *       url: `${SITE_URL}/sitemap-blog-2.xml`,
 *       lastModified: new Date(),
 *     },
 *   ];
 * }
 */