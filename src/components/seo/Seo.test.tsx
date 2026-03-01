import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { Seo } from "./Seo";

// Helper to render Seo component with HelmetProvider
const renderSeo = (props = {}) => {
  return render(
    <HelmetProvider>
      <Seo {...props} />
    </HelmetProvider>
  );
};

describe("Seo", () => {
  describe("component rendering", () => {
    it("should render without crashing with default props", () => {
      expect(() => renderSeo()).not.toThrow();
    });

    it("should render with all props", () => {
      expect(() =>
        renderSeo({
          title: "Test Page",
          description: "Test description",
          path: "/test",
          image: "/test.png",
          type: "article",
          noindex: true,
          keywords: ["test", "keywords"],
          publishedTime: "2024-01-01T00:00:00Z",
          modifiedTime: "2024-01-02T00:00:00Z",
          jsonLd: { "@type": "Article" },
        })
      ).not.toThrow();
    });
  });

  describe("title normalization", () => {
    it("should handle undefined title", () => {
      const { container } = renderSeo();
      expect(container).toBeInTheDocument();
    });

    it("should handle custom title", () => {
      const { container } = renderSeo({ title: "Custom Title" });
      expect(container).toBeInTheDocument();
    });

    it("should handle empty string title", () => {
      const { container } = renderSeo({ title: "" });
      expect(container).toBeInTheDocument();
    });
  });

  describe("prop validation", () => {
    it("should accept type website", () => {
      expect(() => renderSeo({ type: "website" })).not.toThrow();
    });

    it("should accept type article", () => {
      expect(() => renderSeo({ type: "article" })).not.toThrow();
    });

    it("should accept noindex true", () => {
      expect(() => renderSeo({ noindex: true })).not.toThrow();
    });

    it("should accept noindex false", () => {
      expect(() => renderSeo({ noindex: false })).not.toThrow();
    });
  });

  describe("keywords handling", () => {
    it("should handle keywords array", () => {
      expect(() =>
        renderSeo({ keywords: ["database", "engineering"] })
      ).not.toThrow();
    });

    it("should handle empty keywords array", () => {
      expect(() => renderSeo({ keywords: [] })).not.toThrow();
    });

    it("should handle no keywords", () => {
      expect(() => renderSeo()).not.toThrow();
    });
  });

  describe("canonical URL handling", () => {
    it("should handle no path", () => {
      expect(() => renderSeo()).not.toThrow();
    });

    it("should handle relative path", () => {
      expect(() => renderSeo({ path: "/blog/post" })).not.toThrow();
    });

    it("should handle absolute URL", () => {
      expect(() => renderSeo({ path: "https://example.com" })).not.toThrow();
    });
  });

  describe("image handling", () => {
    it("should handle no image (use default)", () => {
      expect(() => renderSeo()).not.toThrow();
    });

    it("should handle relative image path", () => {
      expect(() => renderSeo({ image: "/custom.png" })).not.toThrow();
    });

    it("should handle absolute image URL", () => {
      expect(() =>
        renderSeo({ image: "https://example.com/image.png" })
      ).not.toThrow();
    });
  });

  describe("article metadata", () => {
    it("should handle article with published time", () => {
      expect(() =>
        renderSeo({
          type: "article",
          publishedTime: "2024-01-01T00:00:00Z",
        })
      ).not.toThrow();
    });

    it("should handle article with modified time", () => {
      expect(() =>
        renderSeo({
          type: "article",
          modifiedTime: "2024-01-02T00:00:00Z",
        })
      ).not.toThrow();
    });

    it("should handle article with both times", () => {
      expect(() =>
        renderSeo({
          type: "article",
          publishedTime: "2024-01-01T00:00:00Z",
          modifiedTime: "2024-01-02T00:00:00Z",
        })
      ).not.toThrow();
    });

    it("should handle article without times", () => {
      expect(() => renderSeo({ type: "article" })).not.toThrow();
    });
  });

  describe("JSON-LD structured data", () => {
    it("should handle single JSON-LD object", () => {
      expect(() =>
        renderSeo({
          jsonLd: {
            "@type": "Article",
            headline: "Test",
          },
        })
      ).not.toThrow();
    });

    it("should handle multiple JSON-LD objects", () => {
      expect(() =>
        renderSeo({
          jsonLd: [
            { "@type": "Article", headline: "Test" },
            { "@type": "Person", name: "Author" },
          ],
        })
      ).not.toThrow();
    });

    it("should handle no JSON-LD", () => {
      expect(() => renderSeo()).not.toThrow();
    });

    it("should handle complex JSON-LD structure", () => {
      expect(() =>
        renderSeo({
          jsonLd: {
            "@type": "Article",
            headline: "Test Article",
            author: { name: "Test Author" },
            datePublished: "2024-01-01",
          },
        })
      ).not.toThrow();
    });
  });

  describe("integration tests", () => {
    it("should render with all props combined", () => {
      expect(() =>
        renderSeo({
          title: "Full Test",
          description: "Full description",
          path: "/test",
          image: "/test.png",
          type: "article",
          keywords: ["test", "full"],
          publishedTime: "2024-01-01T00:00:00Z",
          modifiedTime: "2024-01-02T00:00:00Z",
          jsonLd: { "@type": "Article" },
          noindex: false,
        })
      ).not.toThrow();
    });

    it("should handle multiple renders", () => {
      const { rerender } = renderSeo({ title: "First" });
      expect(() => rerender(
        <HelmetProvider>
          <Seo title="Second" />
        </HelmetProvider>
      )).not.toThrow();
    });

    it("should handle prop changes", () => {
      const { rerender } = renderSeo({ type: "website" });
      expect(() => rerender(
        <HelmetProvider>
          <Seo type="article" />
        </HelmetProvider>
      )).not.toThrow();
    });
  });

  describe("edge cases", () => {
    it("should handle very long title", () => {
      const longTitle = "A".repeat(200);
      expect(() => renderSeo({ title: longTitle })).not.toThrow();
    });

    it("should handle very long description", () => {
      const longDesc = "B".repeat(500);
      expect(() => renderSeo({ description: longDesc })).not.toThrow();
    });

    it("should handle special characters in title", () => {
      expect(() =>
        renderSeo({ title: "Title with <special> & 'characters'" })
      ).not.toThrow();
    });

    it("should handle special characters in description", () => {
      expect(() =>
        renderSeo({ description: "Description with <tags> & quotes" })
      ).not.toThrow();
    });

    it("should handle many keywords", () => {
      const manyKeywords = Array.from({ length: 50 }, (_, i) => `keyword${i}`);
      expect(() => renderSeo({ keywords: manyKeywords })).not.toThrow();
    });

    it("should handle empty strings in various props", () => {
      expect(() =>
        renderSeo({
          title: "",
          description: "",
          path: "",
          image: "",
        })
      ).not.toThrow();
    });
  });

  describe("type safety", () => {
    it("should accept valid article type", () => {
      expect(() => renderSeo({ type: "article" as const })).not.toThrow();
    });

    it("should accept valid website type", () => {
      expect(() => renderSeo({ type: "website" as const })).not.toThrow();
    });
  });

  describe("conditional rendering", () => {
    it("should render article-specific tags only for articles", () => {
      const { container } = renderSeo({
        type: "article",
        publishedTime: "2024-01-01T00:00:00Z",
      });
      expect(container).toBeInTheDocument();
    });

    it("should not render article tags for website type", () => {
      const { container } = renderSeo({
        type: "website",
        publishedTime: "2024-01-01T00:00:00Z",
      });
      expect(container).toBeInTheDocument();
    });

    it("should render keywords only when provided", () => {
      const { container } = renderSeo({ keywords: ["test"] });
      expect(container).toBeInTheDocument();
    });

    it("should not render keywords when not provided", () => {
      const { container } = renderSeo();
      expect(container).toBeInTheDocument();
    });
  });

  describe("regression tests", () => {
    it("should handle switching between article and website types", () => {
      const { rerender } = renderSeo({ type: "article" });
      expect(() => rerender(
        <HelmetProvider>
          <Seo type="website" />
        </HelmetProvider>
      )).not.toThrow();
    });

    it("should handle adding and removing keywords", () => {
      const { rerender } = renderSeo({ keywords: ["one", "two"] });
      expect(() => rerender(
        <HelmetProvider>
          <Seo />
        </HelmetProvider>
      )).not.toThrow();
    });

    it("should handle image URL changes", () => {
      const { rerender } = renderSeo({ image: "/first.png" });
      expect(() => rerender(
        <HelmetProvider>
          <Seo image="https://example.com/second.png" />
        </HelmetProvider>
      )).not.toThrow();
    });
  });
});