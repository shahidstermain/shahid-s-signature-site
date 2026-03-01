import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("should render footer element", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");

    expect(footer).toBeInTheDocument();
  });

  it("should display author name", () => {
    render(<Footer />);

    expect(screen.getByText("by Shahid Moosa")).toBeInTheDocument();
  });

  it("should display 'Built with' text", () => {
    render(<Footer />);

    expect(screen.getByText("Built with")).toBeInTheDocument();
  });

  it("should render heart icon", () => {
    const { container } = render(<Footer />);
    const heartIcon = container.querySelector('svg.lucide-heart');

    expect(heartIcon).toBeInTheDocument();
  });

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

  it("should display current year in copyright", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();

    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
  });

  it("should display 'All rights reserved' text", () => {
    render(<Footer />);

    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
  });

  it("should have proper link accessibility attributes", () => {
    render(<Footer />);
    const rssLink = screen.getByRole("link", { name: /rss/i });

    // Should have focus-visible styles
    expect(rssLink.className).toContain("focus-visible:outline-none");
    expect(rssLink.className).toContain("focus-visible:ring-2");
  });

  it("should have hover styles on links", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");

    links.forEach(link => {
      expect(link.className).toContain("hover:text-foreground");
    });
  });

  it("should render all three feed links", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");

    // RSS, JSON Feed, Sitemap
    expect(links).toHaveLength(3);
  });

  it("should have responsive layout classes", () => {
    const { container } = render(<Footer />);
    const innerDiv = container.querySelector(".flex");

    expect(innerDiv?.className).toContain("flex-col");
    expect(innerDiv?.className).toContain("md:flex-row");
  });

  it("should have border top styling", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");

    expect(footer?.className).toContain("border-t");
  });

  it("should have section-container class", () => {
    const { container } = render(<Footer />);
    const containerDiv = container.querySelector(".section-container");

    expect(containerDiv).toBeInTheDocument();
  });

  it("should render year dynamically based on current date", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();

    // The year should be the current year (this test verifies dynamic rendering)
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
  });

  // Additional edge case and accessibility tests
  it("should have semantic HTML structure", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");

    expect(footer).toBeInTheDocument();
    expect(footer?.tagName).toBe("FOOTER");
  });

  it("should render links in correct order", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");

    expect(links[0]).toHaveAttribute("href", "/rss.xml");
    expect(links[1]).toHaveAttribute("href", "/feed.json");
    expect(links[2]).toHaveAttribute("href", "/sitemap.xml");
  });

  it("should not have any broken internal links", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");

    links.forEach(link => {
      const href = link.getAttribute("href");
      expect(href).toBeTruthy();
      expect(href).not.toBe("");
    });
  });
});