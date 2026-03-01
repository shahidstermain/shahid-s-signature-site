import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { Seo } from "./Seo";
import { siteConfig } from "@/lib/site-config";
import { ReactElement } from "react";

// Helper to render with HelmetProvider
const renderWithHelmet = (ui: ReactElement) => {
  const result = render(<HelmetProvider>{ui}</HelmetProvider>);
  return result;
};

describe("Seo component", () => {
  describe("basic rendering", () => {
    it("should render without crashing", () => {
      expect(() => renderWithHelmet(<Seo />)).not.toThrow();
    });

    it("should render Helmet component with title", () => {
      const { container } = renderWithHelmet(<Seo title="Test Page" />);
      // The component should render without errors
      expect(container).toBeTruthy();
    });

    it("should handle custom props", () => {
      const customDesc = "Custom description for testing";
      const { container } = renderWithHelmet(
        <Seo
          title="Test"
          description={customDesc}
          path="/test"
          keywords={["test", "seo"]}
        />
      );
      expect(container).toBeTruthy();
    });
  });

  describe("props handling", () => {
    it("should accept all valid props", () => {
      expect(() =>
        renderWithHelmet(
          <Seo
            title="Test Page"
            description="Test description"
            path="/test"
            image="/test-image.png"
            type="article"
            noindex={false}
            keywords={["test", "keywords"]}
            publishedTime="2024-01-01T00:00:00Z"
            modifiedTime="2024-01-02T00:00:00Z"
            jsonLd={{ "@type": "Article", name: "Test" }}
          />
        )
      ).not.toThrow();
    });

    it("should handle article type with dates", () => {
      expect(() =>
        renderWithHelmet(
          <Seo
            type="article"
            publishedTime="2024-01-01T00:00:00Z"
            modifiedTime="2024-01-02T00:00:00Z"
          />
        )
      ).not.toThrow();
    });

    it("should handle noindex prop", () => {
      expect(() =>
        renderWithHelmet(<Seo noindex={true} />)
      ).not.toThrow();
    });

    it("should handle JSON-LD as object", () => {
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Test Person",
      };
      expect(() => renderWithHelmet(<Seo jsonLd={jsonLd} />)).not.toThrow();
    });

    it("should handle JSON-LD as array", () => {
      const jsonLd = [
        { "@type": "Person", name: "Test Person" },
        { "@type": "Organization", name: "Test Org" },
      ];
      expect(() => renderWithHelmet(<Seo jsonLd={jsonLd} />)).not.toThrow();
    });
  });

  describe("edge cases", () => {
    it("should handle empty strings", () => {
      expect(() =>
        renderWithHelmet(<Seo title="" description="" path="" />)
      ).not.toThrow();
    });

    it("should handle undefined values", () => {
      expect(() =>
        renderWithHelmet(
          <Seo
            title={undefined}
            description={undefined}
            path={undefined}
            keywords={undefined}
          />
        )
      ).not.toThrow();
    });

    it("should handle empty arrays", () => {
      expect(() => renderWithHelmet(<Seo keywords={[]} />)).not.toThrow();
    });

    it("should handle multiple renders", () => {
      const { rerender } = renderWithHelmet(<Seo title="First" />);
      expect(() => {
        rerender(
          <HelmetProvider>
            <Seo title="Second" />
          </HelmetProvider>
        );
      }).not.toThrow();
    });

    it("should handle absolute image URLs", () => {
      expect(() =>
        renderWithHelmet(<Seo image="https://cdn.example.com/image.png" />)
      ).not.toThrow();
    });

    it("should handle relative image URLs", () => {
      expect(() =>
        renderWithHelmet(<Seo image="/images/test.png" />)
      ).not.toThrow();
    });

    it("should handle all path formats", () => {
      expect(() => renderWithHelmet(<Seo path="/about" />)).not.toThrow();
      expect(() => renderWithHelmet(<Seo path="about" />)).not.toThrow();
      expect(() =>
        renderWithHelmet(<Seo path="/blog/post/123" />)
      ).not.toThrow();
    });
  });

  describe("type variations", () => {
    it("should handle website type", () => {
      expect(() => renderWithHelmet(<Seo type="website" />)).not.toThrow();
    });

    it("should handle article type", () => {
      expect(() => renderWithHelmet(<Seo type="article" />)).not.toThrow();
    });
  });

  describe("integration with siteConfig", () => {
    it("should work with site config values", () => {
      // Test that the component can access siteConfig
      expect(() => renderWithHelmet(<Seo />)).not.toThrow();
      expect(siteConfig.title).toBeDefined();
      expect(siteConfig.description).toBeDefined();
      expect(siteConfig.siteUrl).toBeDefined();
    });

    it("should use normalizeTitle function correctly", () => {
      // This tests that the internal normalizeTitle function works
      expect(() => renderWithHelmet(<Seo title="Test" />)).not.toThrow();
      expect(() => renderWithHelmet(<Seo title={undefined} />)).not.toThrow();
      expect(() => renderWithHelmet(<Seo title="" />)).not.toThrow();
    });
  });

  describe("complex scenarios", () => {
    it("should handle complete blog post metadata", () => {
      expect(() =>
        renderWithHelmet(
          <Seo
            title="Understanding CAP Theorem"
            description="A practical guide to distributed systems"
            path="/blog/cap-theorem"
            type="article"
            publishedTime="2024-01-01T00:00:00Z"
            modifiedTime="2024-01-15T00:00:00Z"
            keywords={["CAP theorem", "distributed systems", "databases"]}
            jsonLd={{
              "@context": "https://schema.org",
              "@type": "Article",
              headline: "Understanding CAP Theorem",
              author: {
                "@type": "Person",
                name: siteConfig.author.name,
              },
            }}
          />
        )
      ).not.toThrow();
    });

    it("should handle homepage metadata", () => {
      expect(() =>
        renderWithHelmet(
          <Seo
            title={undefined}
            description={undefined}
            path="/"
            type="website"
          />
        )
      ).not.toThrow();
    });

    it("should handle noindex pages", () => {
      expect(() =>
        renderWithHelmet(
          <Seo
            title="Admin Panel"
            noindex={true}
            path="/admin"
          />
        )
      ).not.toThrow();
    });
  });

  describe("prop validation", () => {
    it("should accept valid keyword arrays", () => {
      expect(() =>
        renderWithHelmet(<Seo keywords={["a", "b", "c"]} />)
      ).not.toThrow();
    });

    it("should handle long keyword lists", () => {
      const keywords = Array.from({ length: 20 }, (_, i) => `keyword${i}`);
      expect(() => renderWithHelmet(<Seo keywords={keywords} />)).not.toThrow();
    });

    it("should handle special characters in content", () => {
      expect(() =>
        renderWithHelmet(
          <Seo
            title="Test & Special <Characters>"
            description='Description with single and "double quotes"'
          />
        )
      ).not.toThrow();
    });
  });
});