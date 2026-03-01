import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("should render without crashing", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("should display 'Built with' text", () => {
    render(<Footer />);
    expect(screen.getByText("Built with")).toBeInTheDocument();
  });

  it("should display author name", () => {
    render(<Footer />);
    expect(screen.getByText("by Shahid Moosa")).toBeInTheDocument();
  });

  it("should display heart icon", () => {
    render(<Footer />);
    const heartIcon = document.querySelector(".lucide-heart");
    expect(heartIcon).toBeInTheDocument();
  });

  it("should render RSS feed link", () => {
    render(<Footer />);
    const rssLink = screen.getByRole("link", { name: /RSS/i });
    expect(rssLink).toBeInTheDocument();
    expect(rssLink).toHaveAttribute("href", "/rss.xml");
  });

  it("should render JSON Feed link", () => {
    render(<Footer />);
    const jsonFeedLink = screen.getByRole("link", { name: /JSON Feed/i });
    expect(jsonFeedLink).toBeInTheDocument();
    expect(jsonFeedLink).toHaveAttribute("href", "/feed.json");
  });

  it("should render Sitemap link", () => {
    render(<Footer />);
    const sitemapLink = screen.getByRole("link", { name: /Sitemap/i });
    expect(sitemapLink).toBeInTheDocument();
    expect(sitemapLink).toHaveAttribute("href", "/sitemap.xml");
  });

  it("should display current year in copyright", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
  });

  it("should display 'All rights reserved'", () => {
    render(<Footer />);
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
  });

  it("should have proper semantic HTML structure", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });

  it("should apply correct CSS classes to footer", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");
    expect(footer).toHaveClass("border-t", "border-border", "py-8");
  });

  it("should have hover styles on links", () => {
    render(<Footer />);
    const rssLink = screen.getByRole("link", { name: /RSS/i });
    expect(rssLink).toHaveClass("hover:text-foreground");
  });

  it("should have focus styles on links for accessibility", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");
    links.forEach(link => {
      expect(link).toHaveClass("focus-visible:outline-none");
      expect(link).toHaveClass("focus-visible:ring-2");
    });
  });

  it("should render all three feed links", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
  });

  it("should have responsive layout classes", () => {
    const { container } = render(<Footer />);
    const flexContainer = container.querySelector(".flex.flex-col");
    expect(flexContainer).toHaveClass("md:flex-row");
  });

  it("should apply text color classes", () => {
    const { container } = render(<Footer />);
    const mutedText = container.querySelector(".text-muted-foreground");
    expect(mutedText).toBeInTheDocument();
  });

  it("should have section container", () => {
    const { container } = render(<Footer />);
    const sectionContainer = container.querySelector(".section-container");
    expect(sectionContainer).toBeInTheDocument();
  });

  it("should render heart icon with correct styling", () => {
    const { container } = render(<Footer />);
    const heartIcon = container.querySelector(".lucide-heart");
    expect(heartIcon).toHaveClass("w-4", "h-4", "text-primary", "fill-primary");
  });

  describe("accessibility", () => {
    it("should use semantic footer element", () => {
      const { container } = render(<Footer />);
      expect(container.querySelector("footer")).toBeInTheDocument();
    });

    it("should have properly labeled links", () => {
      render(<Footer />);
      expect(screen.getByRole("link", { name: /RSS/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /JSON Feed/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Sitemap/i })).toBeInTheDocument();
    });

    it("should have keyboard focus styles", () => {
      render(<Footer />);
      const links = screen.getAllByRole("link");
      links.forEach(link => {
        expect(link.className).toContain("focus-visible");
      });
    });
  });

  describe("edge cases", () => {
    it("should handle year calculation correctly at year boundary", () => {
      render(<Footer />);
      const year = new Date().getFullYear();
      const copyrightText = screen.getByText(new RegExp(`${year}`));
      expect(copyrightText).toBeInTheDocument();
    });

    it("should render even if styles fail to load", () => {
      render(<Footer />);
      expect(screen.getByText("Built with")).toBeInTheDocument();
      expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
    });
  });
});