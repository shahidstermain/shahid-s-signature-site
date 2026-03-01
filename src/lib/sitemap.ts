import { articles } from "../data/articles";
import { siteConfig } from "./site-config";
import { formatArticleDateOnly } from "./seo-utils";

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

/**
 * Generate an XML sitemap containing the site homepage and all blog post URLs.
 *
 * The sitemap includes each entry's location, last modification date, change frequency, and priority; URL locations are XML-escaped.
 *
 * @returns A complete sitemap XML string conforming to the sitemaps.org schema (`<urlset>`), ready to be written to sitemap.xml.
 */
export function generateSitemap(): string {
  const urls: SitemapUrl[] = [
    // Homepage
    {
      loc: siteConfig.siteUrl,
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "weekly",
      priority: 1.0,
    },
    // Blog posts
    ...articles.map((article) => ({
      loc: `${siteConfig.siteUrl}/blog/${article.slug}`,
      lastmod: formatArticleDateOnly(article.date),
      changefreq: "monthly" as const,
      priority: 0.8,
    })),
  ];

  const urlsXml = urls
    .map(
      (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
    ${url.priority !== undefined ? `<priority>${url.priority.toFixed(1)}</priority>` : ""}
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
}

/**
 * Produces a robots.txt content that allows all crawlers and points to the sitemap.
 *
 * @returns The robots.txt text containing "User-agent: *", "Allow: /", a blank line, and a "Sitemap: {siteUrl}/sitemap.xml" entry where `{siteUrl}` is taken from siteConfig.siteUrl.
 */
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

Sitemap: ${siteConfig.siteUrl}/sitemap.xml
`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
