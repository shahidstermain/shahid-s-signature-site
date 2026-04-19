import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "../components/layout/Footer";

describe("Footer Component", () => {
  it("should render without crashing", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });

  it("should display the author name", () => {
    render(<Footer />);
    expect(screen.getByText(/Shahid Moosa/i)).toBeInTheDocument();
  });

  it("should display 'Built with' text", () => {
    render(<Footer />);
    expect(screen.getByText(/Built with/i)).toBeInTheDocument();
  });

  it("should render Heart icon", () => {
    const { container } = render(<Footer />);
    // Heart icon should be present
    const heartIcon = container.querySelector('svg');
    expect(heartIcon).toBeInTheDocument();
  });

  it("should display RSS link", () => {
    render(<Footer />);
    const rssLink = screen.getByRole("link", { name: /RSS/i });
    expect(rssLink).toBeInTheDocument();
    expect(rssLink).toHaveAttribute("href", "/rss.xml");
  });

  it("should display JSON Feed link", () => {
    render(<Footer />);
    const jsonFeedLink = screen.getByRole("link", { name: /JSON Feed/i });
    expect(jsonFeedLink).toBeInTheDocument();
    expect(jsonFeedLink).toHaveAttribute("href", "/feed.json");
  });

  it("should display Sitemap link", () => {
    render(<Footer />);
    const sitemapLink = screen.getByRole("link", { name: /Sitemap/i });
    expect(sitemapLink).toBeInTheDocument();
    expect(sitemapLink).toHaveAttribute("href", "/sitemap.xml");
  });

  it("should display copyright text", () => {
    render(<Footer />);
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
  });

  it("should display current year in copyright", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
  });

  it("should have proper semantic HTML structure", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });

  it("should apply border-t class for visual separation", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");
    expect(footer).toHaveClass("border-t");
  });

  it("should have hover effects on links", () => {
    render(<Footer />);
    const rssLink = screen.getByRole("link", { name: /RSS/i });
    expect(rssLink).toHaveClass("hover:text-foreground");
  });

  it("should have focus-visible styles for accessibility", () => {
    render(<Footer />);
    const rssLink = screen.getByRole("link", { name: /RSS/i });
    expect(rssLink.className).toContain("focus-visible");
  });

  it("should render all three feed links", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");
    const feedLinks = links.filter((link) =>
      ["/rss.xml", "/feed.json", "/sitemap.xml"].includes(
        link.getAttribute("href") || ""
      )
    );
    expect(feedLinks).toHaveLength(3);
  });

  it("should have consistent spacing classes", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");
    expect(footer).toHaveClass("py-8");
  });

  it("should use section-container for width constraint", () => {
    const { container } = render(<Footer />);
    const sectionContainer = container.querySelector(".section-container");
    expect(sectionContainer).toBeInTheDocument();
  });

  it("should be responsive with flex layout", () => {
    const { container } = render(<Footer />);
    const flexContainer = container.querySelector(".flex.flex-col");
    expect(flexContainer).toBeInTheDocument();
  });

  it("should display components in correct order", () => {
    const { container } = render(<Footer />);
    const text = container.textContent || "";

    // "Built with" should come before "All rights reserved"
    const builtWithIndex = text.indexOf("Built with");
    const copyrightIndex = text.indexOf("All rights reserved");

    expect(builtWithIndex).toBeLessThan(copyrightIndex);
  });

  it("should render Heart icon with primary color fill", () => {
    const { container } = render(<Footer />);
    const heartIcon = container.querySelector(".text-primary.fill-primary");
    expect(heartIcon).toBeInTheDocument();
  });

  it("should have muted foreground color for text", () => {
    const { container } = render(<Footer />);
    const mutedText = container.querySelector(".text-muted-foreground");
    expect(mutedText).toBeInTheDocument();
  });

  // Additional edge case tests for strengthening confidence
  it("should handle multiple renders without errors", () => {
    const { rerender } = render(<Footer />);
    expect(() => rerender(<Footer />)).not.toThrow();
    expect(() => rerender(<Footer />)).not.toThrow();
  });

  it("should maintain accessibility with proper link context", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      // Each link should have text content or aria-label
      expect(link.textContent || link.getAttribute("aria-label")).toBeTruthy();
    });
  });

  it("should render within a bounded container", () => {
    const { container } = render(<Footer />);
    const sectionContainer = container.querySelector(".section-container");
    expect(sectionContainer?.parentElement?.tagName).toBe("FOOTER");
  });

  it("should not have any broken external links", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      const href = link.getAttribute("href");
      expect(href).toBeTruthy();
      expect(href?.startsWith("/")).toBe(true);
    });
  });
});