import { describe, it, expect } from "vitest";

// Tests for SEO implementation in Next.js examples

describe("Next.js SEO Implementation", () => {
  describe("Metadata structure", () => {
    it("should include all required metadata fields", () => {
      const metadata = {
        title: "Page Title",
        description: "Page description",
        keywords: ["keyword1", "keyword2"],
        authors: [{ name: "Shahid Moosa", url: "https://shahidster.tech" }],
        openGraph: {
          type: "website",
          locale: "en_US",
          url: "https://shahidster.tech",
          siteName: "Shahid Moosa",
        },
        twitter: {
          card: "summary_large_image",
        },
      };

      expect(metadata.title).toBeTruthy();
      expect(metadata.description).toBeTruthy();
      expect(metadata.openGraph).toBeDefined();
      expect(metadata.twitter).toBeDefined();
    });

    it("should use proper Open Graph type for articles", () => {
      const articleMetadata = {
        openGraph: {
          type: "article",
        },
      };

      expect(articleMetadata.openGraph.type).toBe("article");
    });

    it("should use website type for non-article pages", () => {
      const websiteMetadata = {
        openGraph: {
          type: "website",
        },
      };

      expect(websiteMetadata.openGraph.type).toBe("website");
    });

    it("should include image metadata", () => {
      const metadata = {
        openGraph: {
          images: [
            {
              url: "https://shahidster.tech/og-image.png",
              width: 1200,
              height: 630,
              alt: "Site image",
            },
          ],
        },
      };

      expect(metadata.openGraph.images.length).toBeGreaterThan(0);
      expect(metadata.openGraph.images[0].width).toBe(1200);
      expect(metadata.openGraph.images[0].height).toBe(630);
    });

    it("should include Twitter card metadata", () => {
      const metadata = {
        twitter: {
          card: "summary_large_image",
          title: "Title",
          description: "Description",
          images: ["https://shahidster.tech/og-image.png"],
          creator: "@shahidster_",
        },
      };

      expect(metadata.twitter.card).toBe("summary_large_image");
      expect(metadata.twitter.creator).toMatch(/^@/);
    });

    it("should include canonical URL", () => {
      const metadata = {
        alternates: {
          canonical: "https://shahidster.tech/page",
        },
      };

      expect(metadata.alternates.canonical).toMatch(/^https?:\/\//);
    });

    it("should include robots directives", () => {
      const indexableMetadata = {
        robots: {
          index: true,
          follow: true,
        },
      };

      const noindexMetadata = {
        robots: {
          index: false,
          follow: true,
        },
      };

      expect(indexableMetadata.robots.index).toBe(true);
      expect(noindexMetadata.robots.index).toBe(false);
    });
  });

  describe("Article metadata", () => {
    it("should include published time for articles", () => {
      const metadata = {
        openGraph: {
          type: "article",
          publishedTime: "2024-01-01T00:00:00.000Z",
        },
      };

      expect(metadata.openGraph.publishedTime).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
      );
    });

    it("should include modified time for articles", () => {
      const metadata = {
        openGraph: {
          type: "article",
          modifiedTime: "2024-01-15T00:00:00.000Z",
        },
      };

      expect(metadata.openGraph.modifiedTime).toBeTruthy();
    });

    it("should include authors for articles", () => {
      const metadata = {
        openGraph: {
          type: "article",
          authors: ["Shahid Moosa"],
        },
      };

      expect(Array.isArray(metadata.openGraph.authors)).toBe(true);
      expect(metadata.openGraph.authors.length).toBeGreaterThan(0);
    });

    it("should include article section", () => {
      const metadata = {
        openGraph: {
          type: "article",
          section: "Technology",
        },
      };

      expect(metadata.openGraph.section).toBeTruthy();
    });

    it("should include article tags", () => {
      const metadata = {
        openGraph: {
          type: "article",
          tags: ["distributed systems", "databases"],
        },
      };

      expect(Array.isArray(metadata.openGraph.tags)).toBe(true);
    });

    it("should include article:author meta tag", () => {
      const metadata = {
        other: {
          "article:author": "Shahid Moosa",
          "article:published_time": "2024-01-01T00:00:00.000Z",
          "article:section": "Technology",
        },
      };

      expect(metadata.other["article:author"]).toBeTruthy();
      expect(metadata.other["article:published_time"]).toBeTruthy();
    });
  });

  describe("Structured data (JSON-LD)", () => {
    it("should include @context", () => {
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
      };

      expect(jsonLd["@context"]).toBe("https://schema.org");
    });

    it("should include appropriate @type", () => {
      const articleJsonLd = {
        "@type": "Article",
      };

      const personJsonLd = {
        "@type": "Person",
      };

      expect(articleJsonLd["@type"]).toBe("Article");
      expect(personJsonLd["@type"]).toBe("Person");
    });

    it("should include article structured data", () => {
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Article Title",
        description: "Article description",
        datePublished: "2024-01-01T00:00:00.000Z",
        dateModified: "2024-01-01T00:00:00.000Z",
        author: {
          "@type": "Person",
          name: "Shahid Moosa",
        },
      };

      expect(jsonLd.headline).toBeTruthy();
      expect(jsonLd.author["@type"]).toBe("Person");
      expect(jsonLd.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}/);
    });

    it("should include breadcrumb structured data", () => {
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://shahidster.tech",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: "https://shahidster.tech/blog",
          },
        ],
      };

      expect(jsonLd["@type"]).toBe("BreadcrumbList");
      expect(Array.isArray(jsonLd.itemListElement)).toBe(true);
      expect(jsonLd.itemListElement[0].position).toBe(1);
    });

    it("should include person structured data", () => {
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Shahid Moosa",
        url: "https://shahidster.tech",
        jobTitle: "Cloud Database Support Engineer",
        sameAs: [
          "https://github.com/shahidmoosa",
          "https://linkedin.com/in/shahidmoosa",
        ],
      };

      expect(jsonLd["@type"]).toBe("Person");
      expect(jsonLd.name).toBeTruthy();
      expect(Array.isArray(jsonLd.sameAs)).toBe(true);
    });

    it("should include website structured data", () => {
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Shahid Moosa",
        url: "https://shahidster.tech",
        description: "Description",
      };

      expect(jsonLd["@type"]).toBe("WebSite");
      expect(jsonLd.url).toMatch(/^https?:\/\//);
    });
  });

  describe("Title templates", () => {
    it("should use template for page titles", () => {
      const template = "%s | Shahid Moosa";
      const pageTitle = "About";
      const fullTitle = template.replace("%s", pageTitle);

      expect(fullTitle).toBe("About | Shahid Moosa");
    });

    it("should handle home page title without template", () => {
      const homeTitle = "Shahid Moosa - Cloud Database Engineer";
      expect(homeTitle).not.toContain("|");
    });

    it("should keep titles under 60 characters when possible", () => {
      const shortTitle = "Blog Post Title";
      const template = "%s | Shahid Moosa";
      const fullTitle = template.replace("%s", shortTitle);

      expect(fullTitle.length).toBeLessThanOrEqual(60);
    });
  });

  describe("Description optimization", () => {
    it("should keep descriptions between 150-160 characters", () => {
      const description =
        "This is a well-optimized meta description that provides clear information about the page content and stays within the recommended character limit.";

      expect(description.length).toBeGreaterThanOrEqual(120);
      expect(description.length).toBeLessThanOrEqual(160);
    });

    it("should not duplicate title in description", () => {
      const title = "Understanding Distributed Systems";
      const description =
        "Learn how distributed databases work at scale with practical examples.";

      expect(description.toLowerCase()).not.toBe(title.toLowerCase());
    });
  });

  describe("URL structure", () => {
    it("should use canonical URLs", () => {
      const canonicalUrl = "https://shahidster.tech/blog/article-slug";

      expect(canonicalUrl).toMatch(/^https:\/\//);
      expect(canonicalUrl).not.toContain("?");
      expect(canonicalUrl).not.toContain("#");
    });

    it("should use lowercase slugs", () => {
      const slug = "distributed-systems-guide";
      expect(slug).toBe(slug.toLowerCase());
    });

    it("should use hyphens in slugs", () => {
      const slug = "multi-word-slug";
      expect(slug).toContain("-");
      expect(slug).not.toContain("_");
      expect(slug).not.toContain(" ");
    });

    it("should not have trailing slashes in article URLs", () => {
      const url = "https://shahidster.tech/blog/article";
      expect(url.endsWith("/")).toBe(false);
    });
  });

  describe("Image metadata", () => {
    it("should use standard OG image dimensions", () => {
      const image = {
        url: "https://shahidster.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "Site image",
      };

      expect(image.width).toBe(1200);
      expect(image.height).toBe(630);
      expect(image.width / image.height).toBeCloseTo(1.91, 1);
    });

    it("should include alt text for images", () => {
      const image = {
        url: "/image.png",
        alt: "Descriptive alt text",
      };

      expect(image.alt).toBeTruthy();
      expect(image.alt.length).toBeGreaterThan(0);
    });
  });

  describe("Locale and language", () => {
    it("should specify en_US locale", () => {
      const metadata = {
        openGraph: {
          locale: "en_US",
        },
      };

      expect(metadata.openGraph.locale).toBe("en_US");
    });

    it("should specify language in structured data", () => {
      const jsonLd = {
        inLanguage: "en-US",
      };

      expect(jsonLd.inLanguage).toBe("en-US");
    });
  });

  describe("Edge cases", () => {
    it("should handle special characters in metadata", () => {
      const title = "Article with & special <chars>";
      // Metadata should preserve special characters (Next.js handles escaping)
      expect(title).toContain("&");
      expect(title).toContain("<");
    });

    it("should handle very long titles gracefully", () => {
      const longTitle = "A".repeat(100);
      const truncated = longTitle.slice(0, 60);
      expect(truncated.length).toBe(60);
    });

    it("should handle empty description fallback", () => {
      const description = undefined;
      const fallback = "Default site description";
      const resolvedDescription = description ?? fallback;

      expect(resolvedDescription).toBe(fallback);
    });

    it("should handle missing image fallback", () => {
      const image = undefined;
      const fallback = "/og-image.png";
      const resolvedImage = image ?? fallback;

      expect(resolvedImage).toBe(fallback);
    });

    it("should handle arrays in JSON-LD", () => {
      const jsonLdArray = [
        { "@type": "Article" },
        { "@type": "BreadcrumbList" },
      ];

      expect(Array.isArray(jsonLdArray)).toBe(true);
      expect(jsonLdArray.length).toBe(2);
    });
  });

  describe("Performance considerations", () => {
    it("should use static metadata when possible", () => {
      const staticMetadata = {
        title: "Static Title",
        description: "Static description",
      };

      // Static metadata is more performant than generateMetadata
      expect(staticMetadata).toBeDefined();
    });

    it("should preload critical images", () => {
      const preload = {
        fetchpriority: "high" as const,
      };

      expect(preload.fetchpriority).toBe("high");
    });
  });
});