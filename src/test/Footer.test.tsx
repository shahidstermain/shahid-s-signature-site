import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Heart: ({ className }: { className?: string }) => (
    <svg data-testid="heart-icon" className={className}></svg>
  ),
}));

describe("Footer component", () => {
  it("should render without crashing", () => {
    expect(() => render(<Footer />)).not.toThrow();
  });

  it("should display the built with message", () => {
    render(<Footer />);

    expect(screen.getByText("Built with")).toBeInTheDocument();
    expect(screen.getByText("by Shahid Moosa")).toBeInTheDocument();
  });

  it("should render heart icon", () => {
    render(<Footer />);

    const heartIcon = screen.getByTestId("heart-icon");
    expect(heartIcon).toBeInTheDocument();
    expect(heartIcon).toHaveClass("text-primary");
    expect(heartIcon).toHaveClass("fill-primary");
  });

  it("should render RSS feed link", () => {
    render(<Footer />);

    const rssLink = screen.getByText("RSS").closest("a");
    expect(rssLink).toBeInTheDocument();
    expect(rssLink).toHaveAttribute("href", "/rss.xml");
  });

  it("should render JSON Feed link", () => {
    render(<Footer />);

    const jsonFeedLink = screen.getByText("JSON Feed").closest("a");
    expect(jsonFeedLink).toBeInTheDocument();
    expect(jsonFeedLink).toHaveAttribute("href", "/feed.json");
  });

  it("should render Sitemap link", () => {
    render(<Footer />);

    const sitemapLink = screen.getByText("Sitemap").closest("a");
    expect(sitemapLink).toBeInTheDocument();
    expect(sitemapLink).toHaveAttribute("href", "/sitemap.xml");
  });

  it("should display copyright with current year", () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} · All rights reserved`)).toBeInTheDocument();
  });

  it("should have proper footer semantic HTML", () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });

  it("should have border styling", () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector("footer");
    expect(footer).toHaveClass("border-t");
    expect(footer).toHaveClass("border-border");
  });

  it("should use section-container class", () => {
    const { container } = render(<Footer />);

    const sectionContainer = container.querySelector(".section-container");
    expect(sectionContainer).toBeInTheDocument();
  });

  it("should have hover effects on links", () => {
    render(<Footer />);

    const rssLink = screen.getByText("RSS").closest("a");
    expect(rssLink).toHaveClass("hover:text-foreground");
    expect(rssLink).toHaveClass("transition-colors");
  });

  it("should have responsive layout classes", () => {
    const { container } = render(<Footer />);

    const flexContainer = container.querySelector(".flex-col");
    expect(flexContainer).toHaveClass("md:flex-row");
  });

  it("should have muted text color", () => {
    const { container } = render(<Footer />);

    const textElement = container.querySelector(".text-muted-foreground");
    expect(textElement).toBeInTheDocument();
  });

  it("should render all three feed links", () => {
    render(<Footer />);

    expect(screen.getByText("RSS")).toBeInTheDocument();
    expect(screen.getByText("JSON Feed")).toBeInTheDocument();
    expect(screen.getByText("Sitemap")).toBeInTheDocument();
  });

  it("should have proper spacing between elements", () => {
    const { container } = render(<Footer />);

    const gapContainer = container.querySelector(".gap-4");
    expect(gapContainer).toBeInTheDocument();
  });

  it("should render all feed links as anchor tags", () => {
    const { container } = render(<Footer />);

    const links = container.querySelectorAll("a");
    expect(links.length).toBe(3);
  });

  it("should have proper padding on footer", () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector("footer");
    expect(footer).toHaveClass("py-8");
  });

  it("should center items on mobile", () => {
    const { container } = render(<Footer />);

    const flexContainer = container.querySelector(".items-center");
    expect(flexContainer).toBeInTheDocument();
  });

  it("should justify content between elements", () => {
    const { container } = render(<Footer />);

    const justifyContainer = container.querySelector(".justify-between");
    expect(justifyContainer).toBeInTheDocument();
  });

  it("should update copyright year dynamically", () => {
    const { rerender } = render(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();

    // Re-render to ensure year is dynamic
    rerender(<Footer />);
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
  });

  it("should have small text size", () => {
    const { container } = render(<Footer />);

    const smallText = container.querySelector(".text-sm");
    expect(smallText).toBeInTheDocument();
  });

  it("should group feed links together", () => {
    const { container } = render(<Footer />);

    const feedLinksContainer = Array.from(container.querySelectorAll(".flex.items-center.gap-4")).find(
      (el) => {
        const links = el.querySelectorAll("a");
        return links.length === 3;
      }
    );

    expect(feedLinksContainer).toBeInTheDocument();
  });

  it("should render heart icon with proper dimensions", () => {
    render(<Footer />);

    const heartIcon = screen.getByTestId("heart-icon");
    expect(heartIcon).toHaveClass("w-4");
    expect(heartIcon).toHaveClass("h-4");
  });

  it("should have proper structure for attribution section", () => {
    const { container } = render(<Footer />);

    const attribution = Array.from(container.querySelectorAll(".flex.items-center.gap-1")).find(
      (el) => el.textContent?.includes("Built with")
    );

    expect(attribution).toBeInTheDocument();
  });

  it("should render complete footer content", () => {
    render(<Footer />);

    // Check all major sections are present
    expect(screen.getByText("Built with")).toBeInTheDocument();
    expect(screen.getByText("RSS")).toBeInTheDocument();
    expect(screen.getByText("JSON Feed")).toBeInTheDocument();
    expect(screen.getByText("Sitemap")).toBeInTheDocument();
    expect(screen.getByText(/© \d{4}/)).toBeInTheDocument();
  });
});