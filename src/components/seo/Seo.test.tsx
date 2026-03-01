import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { Seo } from "./Seo";

// Mock the site config
vi.mock("@/lib/site-config", () => ({
  siteConfig: {
    title: "Shahid Moosa - Cloud Database Engineer",
    description: "Cloud Database Support Engineer at SingleStore",
    name: "Shahid Moosa",
    siteUrl: "https://shahidster.tech",
    ogImage: "/og-image.png",
    locale: "en_US",
    twitterHandle: "@shahidster_",
    titleTemplate: "%s | Shahid Moosa",
    author: {
      name: "Shahid Moosa",
    },
  },
}));

// Mock the seo-utils
vi.mock("@/lib/seo-utils", () => ({
  buildCanonicalUrl: (path?: string) =>
    path ? `https://shahidster.tech${path}` : "https://shahidster.tech",
  toAbsoluteUrl: (pathOrUrl: string) =>
    pathOrUrl.startsWith("http") ? pathOrUrl : `https://shahidster.tech${pathOrUrl}`,
}));

describe("Seo", () => {
  const renderWithHelmet = (ui: React.ReactElement) => {
    return render(<HelmetProvider>{ui}</HelmetProvider>);
  };

  describe("rendering", () => {
    it("should render without crashing", () => {
      expect(() => renderWithHelmet(<Seo />)).not.toThrow();
    });

    it("should render with title prop", () => {
      expect(() => renderWithHelmet(<Seo title="About" />)).not.toThrow();
    });

    it("should render with description prop", () => {
      expect(() => renderWithHelmet(<Seo description="Custom description" />)).not.toThrow();
    });

    it("should render with all props", () => {
      expect(() =>
        renderWithHelmet(
          <Seo
            title="My Blog Post"
            description="This is a blog post"
            path="/blog/my-post"
            type="article"
            publishedTime="2024-01-01T00:00:00Z"
            keywords={["blog", "post"]}
            image="/blog-image.png"
          />
        )
      ).not.toThrow();
    });
  });

  describe("props", () => {
    it("should accept title prop", () => {
      const { container } = renderWithHelmet(<Seo title="Test Title" />);
      expect(container).toBeInTheDocument();
    });

    it("should accept description prop", () => {
      const { container } = renderWithHelmet(<Seo description="Test Description" />);
      expect(container).toBeInTheDocument();
    });

    it("should accept path prop", () => {
      const { container } = renderWithHelmet(<Seo path="/about" />);
      expect(container).toBeInTheDocument();
    });

    it("should accept type prop", () => {
      const { container } = renderWithHelmet(<Seo type="article" />);
      expect(container).toBeInTheDocument();
    });

    it("should accept image prop", () => {
      const { container } = renderWithHelmet(<Seo image="/custom-image.png" />);
      expect(container).toBeInTheDocument();
    });

    it("should accept keywords prop", () => {
      const { container } = renderWithHelmet(<Seo keywords={["test", "keywords"]} />);
      expect(container).toBeInTheDocument();
    });

    it("should accept noindex prop", () => {
      const { container } = renderWithHelmet(<Seo noindex={true} />);
      expect(container).toBeInTheDocument();
    });

    it("should accept article date props", () => {
      const { container } = renderWithHelmet(
        <Seo
          type="article"
          publishedTime="2024-01-01T00:00:00Z"
          modifiedTime="2024-01-02T00:00:00Z"
        />
      );
      expect(container).toBeInTheDocument();
    });

    it("should accept jsonLd prop with object", () => {
      const jsonLd = { "@type": "Organization", name: "Test Org" };
      const { container } = renderWithHelmet(<Seo jsonLd={jsonLd} />);
      expect(container).toBeInTheDocument();
    });

    it("should accept jsonLd prop with array", () => {
      const jsonLd = [
        { "@type": "Organization", name: "Org 1" },
        { "@type": "Person", name: "Person 1" },
      ];
      const { container } = renderWithHelmet(<Seo jsonLd={jsonLd} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle empty keywords array", () => {
      expect(() => renderWithHelmet(<Seo keywords={[]} />)).not.toThrow();
    });

    it("should handle undefined props", () => {
      expect(() =>
        renderWithHelmet(
          <Seo
            title={undefined}
            description={undefined}
            path={undefined}
            image={undefined}
          />
        )
      ).not.toThrow();
    });

    it("should handle empty string title", () => {
      expect(() => renderWithHelmet(<Seo title="" />)).not.toThrow();
    });

    it("should handle absolute image URLs", () => {
      expect(() =>
        renderWithHelmet(<Seo image="https://cdn.example.com/image.png" />)
      ).not.toThrow();
    });

    it("should handle article with publishedTime only", () => {
      expect(() =>
        renderWithHelmet(<Seo type="article" publishedTime="2024-01-01T00:00:00Z" />)
      ).not.toThrow();
    });

    it("should handle article with modifiedTime only", () => {
      expect(() =>
        renderWithHelmet(<Seo type="article" modifiedTime="2024-01-02T00:00:00Z" />)
      ).not.toThrow();
    });

    it("should handle website type (default)", () => {
      expect(() => renderWithHelmet(<Seo type="website" />)).not.toThrow();
    });

    it("should handle jsonLd without @type", () => {
      const jsonLd = { name: "Test" };
      expect(() => renderWithHelmet(<Seo jsonLd={jsonLd} />)).not.toThrow();
    });
  });

  describe("combinations", () => {
    it("should handle blog post with all metadata", () => {
      expect(() =>
        renderWithHelmet(
          <Seo
            title="My Blog Post"
            description="This is a blog post about testing"
            path="/blog/my-post"
            type="article"
            publishedTime="2024-01-01T00:00:00Z"
            modifiedTime="2024-01-02T00:00:00Z"
            keywords={["blog", "testing", "react"]}
            image="/blog-image.png"
            jsonLd={{
              "@type": "Article",
              headline: "My Blog Post",
              datePublished: "2024-01-01T00:00:00Z",
            }}
          />
        )
      ).not.toThrow();
    });

    it("should handle homepage with minimal metadata", () => {
      expect(() => renderWithHelmet(<Seo />)).not.toThrow();
    });

    it("should handle noindex page", () => {
      expect(() =>
        renderWithHelmet(
          <Seo
            title="Private Page"
            description="This page should not be indexed"
            noindex={true}
          />
        )
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

    it("should handle article with dates", () => {
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
  });
});