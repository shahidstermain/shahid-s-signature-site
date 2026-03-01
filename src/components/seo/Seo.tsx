import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/lib/site-config";
import { buildCanonicalUrl, toAbsoluteUrl } from "@/lib/seo-utils";

type SeoProps = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
};

const normalizeTitle = (title?: string) => {
  if (!title) return siteConfig.title;
  return siteConfig.titleTemplate.replace("%s", title);
};

export const Seo = ({
  title,
  description,
  path,
  image,
  type = "website",
  noindex = false,
  keywords,
  publishedTime,
  modifiedTime,
  jsonLd,
}: SeoProps) => {
  const resolvedTitle = normalizeTitle(title);
  const resolvedDescription = description ?? siteConfig.description;
  const canonicalUrl = buildCanonicalUrl(path);
  const metaImage = toAbsoluteUrl(image ?? siteConfig.ogImage);
  const jsonLdItems = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <meta name="author" content={siteConfig.author.name} />
      {keywords?.length ? (
        <meta name="keywords" content={keywords.join(", ")} />
      ) : null}
      <meta
        name="robots"
        content={
          noindex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large"
        }
      />

      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content={siteConfig.locale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={siteConfig.twitterHandle} />
      <meta name="twitter:creator" content={siteConfig.twitterHandle} />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={metaImage} />

      {type === "article" && publishedTime ? (
        <meta property="article:published_time" content={publishedTime} />
      ) : null}
      {type === "article" && modifiedTime ? (
        <meta property="article:modified_time" content={modifiedTime} />
      ) : null}
      {type === "article" ? (
        <meta property="article:author" content={siteConfig.author.name} />
      ) : null}

      {jsonLdItems.map((item, index) => {
        const typeKey =
          typeof (item as { [key: string]: unknown })["@type"] === "string"
            ? ((item as { [key: string]: unknown })["@type"] as string)
            : "unknown";

        return (
          <script
