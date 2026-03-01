import { articles } from "../data/articles";
import { siteConfig } from "./site-config";
import { parseArticleDate } from "./seo-utils";

/**
 * Escape XML special characters in a string.
 *
 * @param text - The input string to escape
 * @returns The input with `&`, `<`, `>`, `"` and `'` replaced by their corresponding XML entities
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
 * Produce a plain-text summary from Markdown/HTML-like content by removing formatting and truncating.
 *
 * @param content - The input string containing Markdown or HTML-like markup
 * @returns A plain-text string with code blocks, inline code, bold markers, headers, and link markup removed, consecutive newlines collapsed to spaces, trimmed, and limited to the first 500 characters
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
 * Generate an RSS 2.0 XML feed for the site's blog articles.
 *
 * @returns A string containing the complete RSS 2.0 XML document for the blog, where each article is represented as an `<item>` including title, link, guid, description, content:encoded, pubDate, and category elements. Items are sorted newest-first.
 */
export function generateRSSFeed(): string {
  const now = new Date().toUTCString();

  const sortedArticles = [...articles].sort(
    (a, b) => parseArticleDate(b.date).getTime() - parseArticleDate(a.date).getTime()
  );

  const items = sortedArticles
    .map(article => {
      const pubDate = parseArticleDate(article.date).toUTCString();
      const description = stripHtml(article.content);
      
      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${siteConfig.siteUrl}/blog/${article.slug}</link>
      <guid isPermaLink="true">${siteConfig.siteUrl}/blog/${article.slug}</guid>
      <description>${escapeXml(article.description)}</description>
      <content:encoded><![CDATA[${description}...]]></content:encoded>
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
 * Generate a JSON Feed 1.1 document representing the site's blog articles.
 *
 * @returns A pretty-printed JSON string (2-space indentation) conforming to JSON Feed 1.1 containing feed metadata and an item for each article. Each item includes id, url, title, summary, plain-text content, ISO 8601 publish date, and tags.
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
