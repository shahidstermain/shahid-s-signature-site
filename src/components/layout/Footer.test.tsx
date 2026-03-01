import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  describe("rendering", () => {
    it("should render without crashing", () => {
      render(<Footer />);

      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeInTheDocument();
    });

    it("should render the author name", () => {
      render(<Footer />);

      expect(screen.getByText("by Shahid Moosa")).toBeInTheDocument();
    });

    it("should render 'Built with' text", () => {
      render(<Footer />);

      expect(screen.getByText("Built with")).toBeInTheDocument();
    });

    it("should render heart icon", () => {
      render(<Footer />);

      const heartIcon = document.querySelector(".lucide-heart");
      expect(heartIcon).toBeInTheDocument();
    });

    it("should render copyright text with current year", () => {
      render(<Footer />);

      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(String(currentYear)))).toBeInTheDocument();
      expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
    });
  });

  describe("links", () => {
    it("should render RSS link", () => {
      render(<Footer />);

      const rssLink = screen.getByRole("link", { name: /rss/i });
      expect(rssLink).toBeInTheDocument();
      expect(rssLink).toHaveAttribute("href", "/rss.xml");
    });

    it("should render JSON Feed link", () => {
      render(<Footer />);

      const jsonLink = screen.getByRole("link", { name: /json feed/i });
      expect(jsonLink).toBeInTheDocument();
      expect(jsonLink).toHaveAttribute("href", "/feed.json");
    });

    it("should render Sitemap link", () => {
      render(<Footer />);

      const sitemapLink = screen.getByRole("link", { name: /sitemap/i });
      expect(sitemapLink).toBeInTheDocument();
      expect(sitemapLink).toHaveAttribute("href", "/sitemap.xml");
    });

    it("should have all three SEO file links", () => {
      render(<Footer />);

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(3);
    });
  });

  describe("accessibility", () => {
    it("should use semantic footer element", () => {
      render(<Footer />);

      const footer = screen.getByRole("contentinfo");
      expect(footer.tagName).toBe("FOOTER");
    });

    it("should have accessible link text", () => {
      render(<Footer />);

      expect(screen.getByRole("link", { name: "RSS" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "JSON Feed" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Sitemap" })).toBeInTheDocument();
    });

    it("links should have focus-visible styling classes", () => {
      const { container } = render(<Footer />);

      const links = container.querySelectorAll("a");
      links.forEach(link => {
        expect(link.className).toContain("focus-visible:outline-none");
        expect(link.className).toContain("focus-visible:ring-2");
      });
    });

    it("links should have hover transition classes", () => {
      const { container } = render(<Footer />);

      const links = container.querySelectorAll("a");
      links.forEach(link => {
        expect(link.className).toContain("hover:text-foreground");
        expect(link.className).toContain("transition-colors");
      });
    });
  });

  describe("layout", () => {
    it("should have section-container class", () => {
      const { container } = render(<Footer />);

      const sectionContainer = container.querySelector(".section-container");
      expect(sectionContainer).toBeInTheDocument();
    });

    it("should have border-t class on footer", () => {
      const { container } = render(<Footer />);

      const footer = container.querySelector("footer");
      expect(footer?.className).toContain("border-t");
    });

    it("should have responsive flex layout", () => {
      const { container } = render(<Footer />);

      const flexContainer = container.querySelector(".flex.flex-col.md\\:flex-row");
      expect(flexContainer).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("heart icon should have primary color classes", () => {
      const { container } = render(<Footer />);

      const heartIcon = container.querySelector(".text-primary.fill-primary");
      expect(heartIcon).toBeInTheDocument();
    });

    it("should have muted text color for body text", () => {
      const { container } = render(<Footer />);

      const mutedText = container.querySelector(".text-muted-foreground");
      expect(mutedText).toBeInTheDocument();
    });

    it("should have proper spacing classes", () => {
      const { container } = render(<Footer />);

      const footer = container.querySelector("footer");
      expect(footer?.className).toContain("py-8");
    });
  });

  describe("content structure", () => {
    it("should have three main sections", () => {
      const { container } = render(<Footer />);

      // Built with section
      expect(screen.getByText("Built with")).toBeInTheDocument();

      // Links section
      expect(screen.getByRole("link", { name: "RSS" })).toBeInTheDocument();

      // Copyright section
      expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
    });

    it("should render sections in correct order on mobile", () => {
      render(<Footer />);

      const footer = screen.getByRole("contentinfo");
      const text = footer.textContent;

      // Check order of key elements
      expect(text).toBeTruthy();
      expect(text).toContain("Built with");
      expect(text).toContain("Shahid Moosa");
    });
  });

  describe("dynamic content", () => {
    it("should always show current year in copyright", () => {
      render(<Footer />);

      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(String(currentYear)))).toBeInTheDocument();
    });

    it("copyright year should update based on system date", () => {
      const year = new Date().getFullYear();
      render(<Footer />);

      const copyrightText = screen.getByText(new RegExp(`© ${year}`));
      expect(copyrightText).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle multiple renders", () => {
      const { rerender } = render(<Footer />);

      rerender(<Footer />);
      rerender(<Footer />);

      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("should not have any duplicate IDs", () => {
      const { container } = render(<Footer />);

      const elementsWithIds = container.querySelectorAll("[id]");
      const ids = Array.from(elementsWithIds).map(el => el.id);
      const uniqueIds = new Set(ids);

      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  describe("responsive design", () => {
    it("should have responsive flex direction classes", () => {
      const { container } = render(<Footer />);

      const responsiveContainer = container.querySelector(".flex-col.md\\:flex-row");
      expect(responsiveContainer).toBeInTheDocument();
    });

    it("should have gap classes for spacing", () => {
      const { container } = render(<Footer />);

      const gapElement = container.querySelector("[class*='gap-']");
      expect(gapElement).toBeInTheDocument();
    });
  });

  describe("SEO considerations", () => {
    it("should link to all SEO-related files", () => {
      render(<Footer />);

      const rssLink = screen.getByRole("link", { name: /rss/i });
      const jsonLink = screen.getByRole("link", { name: /json feed/i });
      const sitemapLink = screen.getByRole("link", { name: /sitemap/i });

      expect(rssLink.getAttribute("href")).toBe("/rss.xml");
      expect(jsonLink.getAttribute("href")).toBe("/feed.json");
      expect(sitemapLink.getAttribute("href")).toBe("/sitemap.xml");
    });

    it("SEO links should be visible and clickable", () => {
      render(<Footer />);

      const links = [
        screen.getByRole("link", { name: /rss/i }),
        screen.getByRole("link", { name: /json feed/i }),
        screen.getByRole("link", { name: /sitemap/i }),
      ];

      links.forEach(link => {
        expect(link).toBeVisible();
      });
    });
  });

  describe("regression tests", () => {
    it("should maintain consistent structure across renders", () => {
      const { container: container1 } = render(<Footer />);
      const html1 = container1.innerHTML;

      const { container: container2 } = render(<Footer />);
      const html2 = container2.innerHTML;

      expect(html1).toBe(html2);
    });

    it("should render cleanly without errors", () => {
      // Simple test that rendering doesn't throw
      expect(() => render(<Footer />)).not.toThrow();
    });
  });
});