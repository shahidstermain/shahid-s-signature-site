import { siteConfig } from "./site-config";
import { formatArticleDateIso, toAbsoluteUrl } from "./seo-utils";
import type { Article } from "../data/articles";

const LANGUAGE = "en-US";

export const buildPersonJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.author.name,
  url: siteConfig.siteUrl,
  jobTitle: siteConfig.author.jobTitle,
  sameAs: siteConfig.author.sameAs,
});

export const buildWebsiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.title,
  url: siteConfig.siteUrl,
  description: siteConfig.description,
  inLanguage: LANGUAGE,
  publisher: {
    "@type": "Person",
    name: siteConfig.author.name,
    url: siteConfig.author.url,
  },
});

export const buildArticleJsonLd = (
  article: Article,
  options?: { currentIndex?: number; total?: number }
) => {
  const articleUrl = `${siteConfig.siteUrl}/blog/${article.slug}`;
  const wordCount = article.content.split(/\s+/).length;
  const isPartOf =
    options?.total && options?.currentIndex
      ? {
          "@type": "CreativeWorkSeries",
          name: article.category,
          position: options.currentIndex,
          numberOfItems: options.total,
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": articleUrl,
    headline: article.title,
    description: article.description,
    datePublished: formatArticleDateIso(article.date),
    dateModified: formatArticleDateIso(article.date),
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url,
      jobTitle: siteConfig.author.jobTitle,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    articleSection: article.category,
    keywords: article.seoKeywords?.join(", ") || article.category,
    wordCount,
    image: [toAbsoluteUrl(siteConfig.ogImage)],
    inLanguage: LANGUAGE,
    ...(isPartOf ? { isPartOf } : {}),
  };
};

export const buildBreadcrumbJsonLd = (article: Article) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteConfig.siteUrl,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Writing",
      item: `${siteConfig.siteUrl}/#writing`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: article.title,
      item: `${siteConfig.siteUrl}/blog/${article.slug}`,
    },
  ],
});
