/**
 * Next.js App Router RSS Feed Route Handler
 * 
 * This file generates an RSS 2.0 feed for blog articles.
 * Features:
 * - Full RSS 2.0 compatibility
 * - Atom self-link for feed readers
 * - Content namespace for full article content
 * - Proper XML escaping
 * - Cache headers for performance
 * 
 * The feed is served at /rss.xml
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/route-handlers
 */

import { articles } from '@/data/articles';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shahidster.tech';
const SITE_TITLE = 'Shahid Moosa — Distributed Systems Engineering';
const SITE_DESCRIPTION = 'Deep dives into distributed databases, data infrastructure, and production systems. Written by a senior distributed-systems engineer.';
const AUTHOR_NAME = 'Shahid Moosa';
const AUTHOR_EMAIL = 'hello@shahidster.tech';

/**
 * Escapes characters significant in XML so the text can be safely embedded in XML.
 *
 * @param text - The string to escape for safe inclusion in XML
 * @returns The input string with `&`, `<`, `>`, `"` and `'` replaced by their corresponding XML entities
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Converts a "Mon YYYY" date string (e.g., "Nov 2025") to a Date set to the 15th of that month.
 *
 * @param dateStr - Three-letter English month abbreviation followed by the four-digit year.
 * @returns A Date for the 15th day of the specified month and year; uses January if the month abbreviation is unrecognized.
 */

/**
 * Produce a plain-text excerpt from Markdown or HTML suitable for summaries and RSS descriptions.
 *
 * @param content - Markdown or HTML input to extract plain text from.
 * @returns Plain-text excerpt with code and formatting removed, links replaced by their link text, consecutive whitespace collapsed, trimmed, and truncated to 500 characters.
 */
function stripMarkdown(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/^#{1,6}\s+/gm, '') // Remove headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 500);
}

/**
 * Generate the site's RSS 2.0 feed XML for all blog articles.
 *
 * The feed includes channel metadata (title, link, description, language, dates, ttl, generator,
 * managing editor, web master, copyright), an Atom self-link, an image block, and one <item> per
 * article. Each item contains title, link/guid, description, CDATA-wrapped content:encoded excerpt,
 * publication date, author, and category elements derived from the article's category and SEO keywords.
 *
 * @returns An HTTP Response whose body is the RSS 2.0 XML document and which includes Content-Type and cache-related headers.
 */
export async function GET() {
  const now = new Date().toUTCString();

  // Sort articles by date (newest first)
  const sortedArticles = [...articles].sort((a, b) => {
    return parseDate(b.date).getTime() - parseDate(a.date).getTime();
  });

  // Generate RSS items
  const items = sortedArticles
    .map((article) => {
      const pubDate = parseDate(article.date).toUTCString();
      const articleUrl = `${SITE_URL}/blog/${article.slug}`;
      const summary = stripMarkdown(article.content);

      // Categories (article category + SEO keywords)
      const categories = [
        article.category,
        ...(article.seoKeywords || []),
      ]
        .map((cat) => `      <category>${escapeXml(cat)}</category>`)
        .join('\n');

      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description>${escapeXml(article.description)}</description>
      <content:encoded><![CDATA[${summary}...]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <author>${AUTHOR_EMAIL} (${AUTHOR_NAME})</author>
${categories}
    </item>`;
    })
    .join('');

  // Build the complete RSS feed
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <ttl>60</ttl>
    <generator>Next.js RSS Generator</generator>
    <managingEditor>${AUTHOR_EMAIL} (${AUTHOR_NAME})</managingEditor>
    <webMaster>${AUTHOR_EMAIL} (${AUTHOR_NAME})</webMaster>
    <copyright>Copyright ${new Date().getFullYear()} ${AUTHOR_NAME}. All rights reserved.</copyright>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/og-image.png</url>
      <title>${escapeXml(SITE_TITLE)}</title>
      <link>${SITE_URL}</link>
      <width>1200</width>
      <height>630</height>
    </image>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

/**
 * Revalidation Configuration
 * 
 * The feed is cached for 1 hour (3600 seconds) and can be revalidated
 * using Next.js on-demand revalidation when new articles are published.
 * 
 * To trigger revalidation programmatically:
 * 
 * // app/api/revalidate/route.ts
 * import { revalidatePath } from 'next/cache';
 * 
 * export async function POST(request: Request) {
 *   revalidatePath('/rss.xml');
 *   return Response.json({ revalidated: true });
 * }
 */