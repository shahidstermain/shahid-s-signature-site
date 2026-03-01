import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { Seo } from "./Seo";

// Mock the config and utils
vi.mock("@/lib/site-config", () => ({
  siteConfig: {
    title: "Shahid Moosa - Cloud Database Engineer",
    titleTemplate: "%s | Shahid Moosa",
    description: "Cloud Database Support Engineer at SingleStore",
    siteUrl: "https://shahidster.tech",
    ogImage: "/og-image.png",
    name: "Shahid Moosa",
    locale: "en_US",
    twitterHandle: "@shahidster_",
    author: {
      name: "Shahid Moosa",
    },
  },
}));

vi.mock("@/lib/seo-utils", () => ({
  buildCanonicalUrl: (path?: string) =>
    path ? `https://shahidster.tech${path}` : "https://shahidster.tech",
  toAbsoluteUrl: (path: string) =>
    path.startsWith("http") ? path : `https://shahidster.tech${path}`,
}));

describe("Seo", () => {
  const renderWithHelmet = (component: React.ReactElement) => {
    return render(
      <HelmetProvider>
        {component}
      </HelmetProvider>
    );
  };

  describe("basic rendering", () => {
    it("should render without crashing", () => {
      expect(() => renderWithHelmet(<Seo />)).not.toThrow();
    });

    it("should render with custom title", () => {
      expect(() => renderWithHelmet(<Seo title="Blog Post" />)).not.toThrow();
    });

    it("should render with custom description", () => {
      expect(() =>
        renderWithHelmet(<Seo description="Custom description" />)
      ).not.toThrow();
    });

    it("should render with all props", () => {
      expect(() =>
        renderWithHelmet(
          <Seo
            title="Test Page"
            description="Test description"
            path="/test"
            image="/test-image.png"
            type="website"
            keywords={["test", "keywords"]}
          />
        )
      ).not.toThrow();
    });
  });

  describe("type variations", () => {
    it("should render with website type", () => {
      expect(() =>
        renderWithHelmet(<Seo type="website" />)
      ).not.toThrow();
    });

    it("should render with article type", () => {
      expect(() =>
        renderWithHelmet(<Seo type="article" />)
      ).not.toThrow();
    });

    it("should render article with published time", () => {
      expect(() =>
        renderWithHelmet(
          <Seo type="article" publishedTime="2024-01-15T10:00:00Z" />
        )
      ).not.toThrow();
    });

    it("should render article with modified time", () => {
      expect(() =>
        renderWithHelmet(
          <Seo type="article" modifiedTime="2024-02-15T10:00:00Z" />
        )
      ).not.toThrow();
    });

    it("should render article with both times", () => {
      expect(() =>
        renderWithHelmet(
          <Seo
            type="article"
            publishedTime="2024-01-15T10:00:00Z"
            modifiedTime="2024-02-15T10:00:00Z"
          />
        )
      ).not.toThrow();
    });
  });

  describe("keywords", () => {
    it("should render with keywords array", () => {
      expect(() =>
        renderWithHelmet(<Seo keywords={["database", "cloud", "engineering"]} />)
      ).not.toThrow();
    });

    it("should render without keywords", () => {
      expect(() => renderWithHelmet(<Seo />)).not.toThrow();
    });

    it("should render with empty keywords array", () => {
      expect(() => renderWithHelmet(<Seo keywords={[]} />)).not.toThrow();
    });
  });

  describe("noindex", () => {
    it("should render with noindex false", () => {
      expect(() => renderWithHelmet(<Seo noindex={false} />)).not.toThrow();
    });

    it("should render with noindex true", () => {
      expect(() => renderWithHelmet(<Seo noindex={true} />)).not.toThrow();
    });
  });

  describe("JSON-LD", () => {
    it("should render without jsonLd", () => {
      expect(() => renderWithHelmet(<Seo />)).not.toThrow();
    });

    it("should render with jsonLd object", () => {
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "John Doe",
      };

      expect(() => renderWithHelmet(<Seo jsonLd={jsonLd} />)).not.toThrow();
    });

    it("should render with jsonLd array", () => {
      const jsonLd = [
        {
          "@context": "https://schema.org",
          "@type": "Person",
          name: "John Doe",
        },
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Acme Corp",
        },
      ];

      expect(() => renderWithHelmet(<Seo jsonLd={jsonLd} />)).not.toThrow();
    });
  });

  describe("integration", () => {
    it("should render complete SEO metadata for a blog post", () => {
      expect(() =>
        renderWithHelmet(
          <Seo
            title="Understanding CAP Theorem"
            description="A deep dive into CAP theorem and distributed systems"
            path="/blog/cap-theorem"
            image="/images/cap-theorem.png"
            type="article"
            publishedTime="2024-01-15T10:00:00Z"
            modifiedTime="2024-01-20T15:30:00Z"
            keywords={["distributed systems", "CAP theorem", "databases"]}
            jsonLd={{
              "@context": "https://schema.org",
              "@type": "Article",
              headline: "Understanding CAP Theorem",
            }}
          />
        )
      ).not.toThrow();
    });

    it("should render homepage with minimal props", () => {
      expect(() => renderWithHelmet(<Seo />)).not.toThrow();
    });

    it("should handle path variations", () => {
      expect(() => renderWithHelmet(<Seo path="/blog/post" />)).not.toThrow();
      expect(() => renderWithHelmet(<Seo path="blog/post" />)).not.toThrow();
      expect(() => renderWithHelmet(<Seo path="" />)).not.toThrow();
    });

    it("should handle image variations", () => {
      expect(() => renderWithHelmet(<Seo image="/custom-image.jpg" />)).not.toThrow();
      expect(() =>
        renderWithHelmet(<Seo image="https://example.com/image.jpg" />)
      ).not.toThrow();
    });
  });

  describe("edge cases", () => {
    it("should handle very long title", () => {
      const longTitle = "A".repeat(200);
      expect(() => renderWithHelmet(<Seo title={longTitle} />)).not.toThrow();
    });

    it("should handle very long description", () => {
      const longDesc = "B".repeat(500);
      expect(() => renderWithHelmet(<Seo description={longDesc} />)).not.toThrow();
    });

    it("should handle many keywords", () => {
      const manyKeywords = Array.from({ length: 50 }, (_, i) => `keyword${i}`);
      expect(() => renderWithHelmet(<Seo keywords={manyKeywords} />)).not.toThrow();
    });

    it("should handle special characters in title", () => {
      expect(() =>
        renderWithHelmet(<Seo title="Test & <Title> with 'quotes'" />)
      ).not.toThrow();
    });

    it("should handle special characters in description", () => {
      expect(() =>
        renderWithHelmet(<Seo description='Description with "quotes" & <tags>' />)
      ).not.toThrow();
    });

    it("should handle complex JSON-LD with nested objects", () => {
      const complexJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        author: {
          "@type": "Person",
          name: "John Doe",
        },
        publisher: {
          "@type": "Organization",
          name: "Example Org",
          logo: {
            "@type": "ImageObject",
            url: "https://example.com/logo.png",
          },
        },
      };

      expect(() => renderWithHelmet(<Seo jsonLd={complexJsonLd} />)).not.toThrow();
    });
  });

  describe("prop combinations", () => {
    it("should render with article type but no times", () => {
      expect(() => renderWithHelmet(<Seo type="article" />)).not.toThrow();
    });

    it("should render with website type and times (should ignore times)", () => {
      expect(() =>
        renderWithHelmet(
          <Seo
            type="website"
            publishedTime="2024-01-15T10:00:00Z"
            modifiedTime="2024-02-15T10:00:00Z"
          />
        )
      ).not.toThrow();
    });

    it("should render with all optional props", () => {
      expect(() =>
        renderWithHelmet(
          <Seo
            title="Full Example"
            description="Complete description"
            path="/full/path"
            image="/full-image.png"
            type="article"
            noindex={true}
            keywords={["full", "example"]}
            publishedTime="2024-01-15T10:00:00Z"
            modifiedTime="2024-02-15T10:00:00Z"
            jsonLd={{
              "@context": "https://schema.org",
              "@type": "Article",
            }}
          />
        )
      ).not.toThrow();
    });
  });
});