import { articles } from "../data/articles";
import { siteConfig } from "./site-config";
import { parseArticleDate } from "./seo-utils";

/**
 * Escape special XML characters so a string can be safely included in XML content.
 *
 * @param text - The input string to escape
 * @returns The input with `&`, `<`, `>`, `"` and `'` replaced by their XML entities
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
 * Convert Markdown/HTML content into a plain-text preview suitable for feeds.
 *
 * Produces a sanitized single-line snippet by removing fenced code blocks, inline code, bold markers, level 1–3 headers, converting Markdown links to their link text, collapsing consecutive newlines to spaces, trimming whitespace, and truncating the result to 500 characters.
 *
 * @param content - The source content (Markdown or HTML) to sanitize.
 * @returns A plain-text preview derived from `content`, truncated to at most 500 characters.
 */
function stripHtml(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/^#{1,3}\s+/gm, '') // Remove headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 500);
}

/**
 * Generate an RSS 2.0 feed XML string for the site's blog using the current articles and site configuration.
 *
 * @returns A complete RSS 2.0 XML document as a string containing channel metadata (title, link, description, language, lastBuildDate, atom self-link, image) and an <item> entry for each article (title, link, guid, description, content:encoded, pubDate, and category elements).
 */
export function generateRSSFeed(): string {
  const now = new Date().toUTCString();
  
  const items = articles
    .map(article => {
      const pubDate = parseArticleDate(article.date).toUTCString();
      const description = stripHtml(article.content);
      
      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${siteConfig.siteUrl}/blog/${article.slug}</link>
      <guid isPermaLink="true">${siteConfig.siteUrl}/blog/${article.slug}</guid>
      <description>${escapeXml(article.description)}</description>
      <content:encoded><![CDATA[${escapeXml(description)}...]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(article.category)}</category>
      ${article.seoKeywords?.map(kw => `<category>${escapeXml(kw)}</category>`).join('\n      ') || ''}
    </item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.blogTitle)}</title>
    <link>${siteConfig.siteUrl}</link>
    <description>${escapeXml(siteConfig.blogDescription)}</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${siteConfig.siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteConfig.siteUrl}/favicon.ico</url>
      <title>${escapeXml(siteConfig.blogTitle)}</title>
      <link>${siteConfig.siteUrl}</link>
    </image>
    ${items}
  </channel>
</rss>`;
}

/**
 * Builds a JSON Feed 1.1 document representing the site's blog posts.
 *
 * The feed contains site metadata from `siteConfig` and one item per article:
 * each item includes `id`, `url`, `title`, `summary`, `content_text` (plain-text excerpt),
 * `date_published` (ISO 8601), and `tags` (category plus any `seoKeywords`).
 *
 * @returns A JSON string of the JSON Feed 1.1 object, pretty-printed with two-space indentation.
 */
export function generateJSONFeed(): string {
  const items = articles.map(article => ({
    id: `${siteConfig.siteUrl}/blog/${article.slug}`,
    url: `${siteConfig.siteUrl}/blog/${article.slug}`,
    title: article.title,
    summary: article.description,
    content_text: stripHtml(article.content) + "...",
    date_published: parseArticleDate(article.date).toISOString(),
    tags: [article.category, ...(article.seoKeywords || [])]
  }));

  return JSON.stringify({
    version: "https://jsonfeed.org/version/1.1",
    title: siteConfig.blogTitle,
    home_page_url: siteConfig.siteUrl,
    feed_url: `${siteConfig.siteUrl}/feed.json`,
    description: siteConfig.blogDescription,
    language: "en-US",
    items
  }, null, 2);
}
