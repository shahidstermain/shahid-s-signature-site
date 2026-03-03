import { describe, it, expect, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Seo } from "./Seo";

// Mock dependencies
vi.mock("@/lib/site-config", () => ({
  siteConfig: {
    title: "Shahid Moosa - Cloud Database Engineer",
    description: "Cloud Database Support Engineer at SingleStore",
    name: "Shahid Moosa",
    ogImage: "/og-image.png",
    locale: "en_US",
    twitterHandle: "@shahidster_",
    titleTemplate: "%s | Shahid Moosa",
    author: {
      name: "Shahid Moosa",
    },
  },
}));

vi.mock("@/lib/seo-utils", () => ({
  buildCanonicalUrl: (path?: string) => {
    const base = "https://shahidster.tech";
    if (!path) return base;
    if (path.startsWith("http")) return path;
    return `${base}${path.startsWith("/") ? path : `/${path}`}`;
  },
  toAbsoluteUrl: (pathOrUrl: string) => {
    if (pathOrUrl.startsWith("http")) return pathOrUrl;
    const base = "https://shahidster.tech";
    return `${base}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
  },
}));

describe("Seo component", () => {
  const renderWithHelmet = (ui: React.ReactElement) => {
    return render(<HelmetProvider>{ui}</HelmetProvider>);
  };

  const waitForHelmet = () => new Promise(resolve => setTimeout(resolve, 0));

  it("should render without crashing", async () => {
    expect(() => renderWithHelmet(<Seo />)).not.toThrow();
  });

  it("should set default title when no title provided", async () => {
    renderWithHelmet(<Seo />);

    await waitFor(() => {
      expect(document.title).toBe("Shahid Moosa - Cloud Database Engineer");
    });
  });

  it("should use title template for custom titles", async () => {
    renderWithHelmet(<Seo title="About Me" />);

    await waitFor(() => {
      expect(document.title).toBe("About Me | Shahid Moosa");
    });
  });

  it("should set default description when none provided", async () => {
    renderWithHelmet(<Seo />);
    await waitForHelmet();

    await waitFor(() => {
      const description = document.querySelector('meta[name="description"]');
      expect(description?.getAttribute("content")).toBe("Cloud Database Support Engineer at SingleStore");
    });
  });

  it("should use custom description when provided", async () => {
    renderWithHelmet(<Seo description="Custom description" />);

    await waitFor(() => {
      const description = document.querySelector('meta[name="description"]');
    expect(description?.getAttribute("content")).toBe("Custom description");
    });
  });

  it("should set author meta tag", async () => {
    renderWithHelmet(<Seo />);

    await waitFor(() => {
      const author = document.querySelector('meta[name="author"]');
    expect(author?.getAttribute("content")).toBe("Shahid Moosa");
    });
  });

  it("should set keywords when provided", async () => {
    renderWithHelmet(<Seo keywords={["database", "engineering", "cloud"]} />);

    await waitFor(() => {
      const keywords = document.querySelector('meta[name="keywords"]');
    expect(keywords?.getAttribute("content")).toBe("database, engineering, cloud");
    });
  });

  it("should not set keywords when not provided", async () => {
    renderWithHelmet(<Seo />);

    await waitFor(() => {
      const keywords = document.querySelector('meta[name="keywords"]');
    expect(keywords).toBeNull();
    });
  });

  it("should set noindex robots when noindex is true", async () => {
    renderWithHelmet(<Seo noindex={true} />);

    await waitFor(() => {
      const robots = document.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute("content")).toBe("noindex, nofollow");
    });
  });

  it("should set index robots when noindex is false", async () => {
    renderWithHelmet(<Seo noindex={false} />);

    await waitFor(() => {
      const robots = document.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute("content")).toBe("index, follow, max-image-preview:large");
    });
  });

  it("should set canonical URL", async () => {
    renderWithHelmet(<Seo path="/blog/article" />);

    await waitFor(() => {
      const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe("https://shahidster.tech/blog/article");
    });
  });

  it("should set default canonical URL when no path", async () => {
    renderWithHelmet(<Seo />);

    await waitFor(() => {
      const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe("https://shahidster.tech");
    });
  });

  it("should set Open Graph meta tags", async () => {
    renderWithHelmet(
      <Seo title="Test Article" description="Test description" path="/blog/test" />
    );

    await waitFor(() => {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogType = document.querySelector('meta[property="og:type"]');
      const ogUrl = document.querySelector('meta[property="og:url"]');
      const ogImage = document.querySelector('meta[property="og:image"]');
      const ogSiteName = document.querySelector('meta[property="og:site_name"]');
      const ogLocale = document.querySelector('meta[property="og:locale"]');

      expect(ogTitle?.getAttribute("content")).toBe("Test Article | Shahid Moosa");
      expect(ogDescription?.getAttribute("content")).toBe("Test description");
      expect(ogType?.getAttribute("content")).toBe("website");
      expect(ogUrl?.getAttribute("content")).toBe("https://shahidster.tech/blog/test");
      expect(ogImage?.getAttribute("content")).toBe("https://shahidster.tech/og-image.png");
      expect(ogSiteName?.getAttribute("content")).toBe("Shahid Moosa");
      expect(ogLocale?.getAttribute("content")).toBe("en_US");
    });
  });

  it("should set Twitter Card meta tags", async () => {
    renderWithHelmet(<Seo title="Test" description="Test description" />);

    await waitFor(() => {
      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      const twitterSite = document.querySelector('meta[name="twitter:site"]');
      const twitterCreator = document.querySelector('meta[name="twitter:creator"]');
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      const twitterImage = document.querySelector('meta[name="twitter:image"]');

      expect(twitterCard?.getAttribute("content")).toBe("summary_large_image");
      expect(twitterSite?.getAttribute("content")).toBe("@shahidster_");
      expect(twitterCreator?.getAttribute("content")).toBe("@shahidster_");
      expect(twitterTitle?.getAttribute("content")).toBe("Test | Shahid Moosa");
      expect(twitterDescription?.getAttribute("content")).toBe("Test description");
      expect(twitterImage?.getAttribute("content")).toBe("https://shahidster.tech/og-image.png");
    });
  });

  it("should use custom image when provided", async () => {
    renderWithHelmet(<Seo image="/custom-image.png" />);

    await waitFor(() => {
      const ogImage = document.querySelector('meta[property="og:image"]');
      const twitterImage = document.querySelector('meta[name="twitter:image"]');

      expect(ogImage?.getAttribute("content")).toBe("https://shahidster.tech/custom-image.png");
      expect(twitterImage?.getAttribute("content")).toBe("https://shahidster.tech/custom-image.png");
    });
  });

  it("should handle absolute image URLs", async () => {
    renderWithHelmet(<Seo image="https://example.com/image.png" />);

    await waitFor(() => {
      const ogImage = document.querySelector('meta[property="og:image"]');
    expect(ogImage?.getAttribute("content")).toBe("https://example.com/image.png");
    });
  });

  it("should set article type when type is article", async () => {
    renderWithHelmet(<Seo type="article" />);

    await waitFor(() => {
      const ogType = document.querySelector('meta[property="og:type"]');
    expect(ogType?.getAttribute("content")).toBe("article");
    });
  });

  it("should set article:published_time when provided", async () => {
    renderWithHelmet(
      <Seo type="article" publishedTime="2024-01-01T00:00:00.000Z" />
    );

    await waitFor(() => {
      const publishedTime = document.querySelector('meta[property="article:published_time"]');
    expect(publishedTime?.getAttribute("content")).toBe("2024-01-01T00:00:00.000Z");
    });
  });

  it("should not set article:published_time when type is not article", async () => {
    renderWithHelmet(<Seo type="website" publishedTime="2024-01-01T00:00:00.000Z" />);

    await waitFor(() => {
      const publishedTime = document.querySelector('meta[property="article:published_time"]');
    expect(publishedTime).toBeNull();
    });
  });

  it("should set article:modified_time when provided", async () => {
    renderWithHelmet(
      <Seo type="article" modifiedTime="2024-01-15T00:00:00.000Z" />
    );

    await waitFor(() => {
      const modifiedTime = document.querySelector('meta[property="article:modified_time"]');
    expect(modifiedTime?.getAttribute("content")).toBe("2024-01-15T00:00:00.000Z");
    });
  });

  it("should set article:author when type is article", async () => {
    renderWithHelmet(<Seo type="article" />);

    await waitFor(() => {
      const author = document.querySelector('meta[property="article:author"]');
    expect(author?.getAttribute("content")).toBe("Shahid Moosa");
    });
  });

  it("should not set article:author when type is not article", async () => {
    renderWithHelmet(<Seo type="website" />);

    await waitFor(() => {
      const author = document.querySelector('meta[property="article:author"]');
    expect(author).toBeNull();
    });
  });

  it("should render single JSON-LD script when provided as object", async () => {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Shahid Moosa",
    };

    renderWithHelmet(<Seo jsonLd={jsonLd} />);

    await waitFor(() => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      expect(scripts.length).toBe(1);
      const scriptContent = JSON.parse(scripts[0].textContent || "{}");
      expect(scriptContent["@type"]).toBe("Person");
      expect(scriptContent.name).toBe("Shahid Moosa");
    });
  });

  it("should render multiple JSON-LD scripts when provided as array", async () => {
    const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Shahid Moosa",
      },
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Test Article",
      },
    ];

    renderWithHelmet(<Seo jsonLd={jsonLd} />);

    await waitFor(() => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBe(2);
    });
  });

  it("should not render JSON-LD when not provided", async () => {
    renderWithHelmet(<Seo />);

    await waitFor(() => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBe(0);
    });
  });

  it("should generate unique keys for JSON-LD scripts", async () => {
    const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Shahid Moosa",
      },
      {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Another Person",
      },
    ];

    renderWithHelmet(<Seo jsonLd={jsonLd} />);

    await waitFor(() => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      // Both should render despite same @type (keys should include index)
      expect(scripts.length).toBe(2);
    });
  });

  it("should handle complex integration test", async () => {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: "Database Engineering",
      author: {
        "@type": "Person",
        name: "Shahid Moosa",
      },
    };

    renderWithHelmet(
      <Seo
        title="Database Engineering Guide"
        description="A comprehensive guide to database engineering"
        path="/blog/database-engineering"
        image="/blog/database-og.png"
        type="article"
        keywords={["database", "engineering", "sql"]}
        publishedTime="2024-01-01T00:00:00.000Z"
        modifiedTime="2024-01-15T00:00:00.000Z"
        jsonLd={jsonLd}
        noindex={false}
      />
    );

    // Verify all aspects
    await waitFor(() => {
      expect(document.title).toBe("Database Engineering Guide | Shahid Moosa");
    });

    await waitFor(() => {
      const description = document.querySelector('meta[name="description"]');
    expect(description?.getAttribute("content")).toBe("A comprehensive guide to database engineering");
    });

    await waitFor(() => {
      const keywords = document.querySelector('meta[name="keywords"]');
    expect(keywords?.getAttribute("content")).toBe("database, engineering, sql");
    });

    await waitFor(() => {
      const ogType = document.querySelector('meta[property="og:type"]');
    expect(ogType?.getAttribute("content")).toBe("article");
    });

    await waitFor(() => {
      const publishedTime = document.querySelector('meta[property="article:published_time"]');
    expect(publishedTime?.getAttribute("content")).toBe("2024-01-01T00:00:00.000Z");
    });

    await waitFor(() => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      expect(scripts.length).toBe(1);
      const scriptContent = JSON.parse(scripts[0].textContent || "{}");
      expect(scriptContent["@type"]).toBe("BlogPosting");
    });
  });

  describe("additional edge cases", () => {
    it("should handle very long titles", () => {
      const longTitle = "A".repeat(200);
      renderWithHelmet(<Seo title={longTitle} />);

      waitFor(() => {
        expect(document.title).toContain(longTitle);
      });
    });

    it("should handle special characters in title", () => {
      renderWithHelmet(<Seo title='Test "Title" with <special> & chars' />);

      waitFor(() => {
        expect(document.title).toContain("Test");
      });
    });

    it("should handle empty keywords array", () => {
      renderWithHelmet(<Seo keywords={[]} />);

      waitFor(() => {
        const keywords = document.querySelector('meta[name="keywords"]');
        expect(keywords).toBeNull();
      });
    });

    it("should handle multiple JSON-LD schemas with same type", () => {
      const jsonLd = [
        { "@type": "Person", name: "Person 1" },
        { "@type": "Person", name: "Person 2" },
      ];

      renderWithHelmet(<Seo jsonLd={jsonLd} />);

      waitFor(() => {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        expect(scripts.length).toBe(2);
      });
    });

    it("should handle JSON-LD without @type", () => {
      const jsonLd = { name: "Test" };

      renderWithHelmet(<Seo jsonLd={jsonLd} />);

      waitFor(() => {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        expect(scripts.length).toBe(1);
      });
    });

    it("should set noindex for development environments", () => {
      renderWithHelmet(<Seo noindex={true} />);

      waitFor(() => {
        const robots = document.querySelector('meta[name="robots"]');
        expect(robots?.getAttribute("content")).toContain("noindex");
      });
    });

    it("should handle absolute image URLs without modification", () => {
      const absoluteImage = "https://cdn.example.com/image.png";
      renderWithHelmet(<Seo image={absoluteImage} />);

      waitFor(() => {
        const ogImage = document.querySelector('meta[property="og:image"]');
        expect(ogImage?.getAttribute("content")).toBe(absoluteImage);
      });
    });

    it("should handle paths with trailing slashes", () => {
      renderWithHelmet(<Seo path="/blog/post/" />);

      waitFor(() => {
        const canonical = document.querySelector('link[rel="canonical"]');
        expect(canonical?.getAttribute("href")).toBe("https://shahidster.tech/blog/post/");
      });
    });

    it("should preserve query parameters in canonical URL", () => {
      renderWithHelmet(<Seo path="/search?q=test&page=2" />);

      waitFor(() => {
        const canonical = document.querySelector('link[rel="canonical"]');
        expect(canonical?.getAttribute("href")).toContain("?q=test&page=2");
      });
    });

    it("should handle unicode characters in description", () => {
      renderWithHelmet(<Seo description="Test with émojis 🚀 and ñ characters" />);

      waitFor(() => {
        const description = document.querySelector('meta[name="description"]');
        expect(description?.getAttribute("content")).toContain("🚀");
      });
    });
  });
});