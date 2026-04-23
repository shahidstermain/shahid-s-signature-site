import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Hero } from "../components/sections/Hero";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  },
}));

// Mock the LiveTerminal component
vi.mock("@/components/ui/LiveTerminal", () => ({
  LiveTerminal: () => <div data-testid="live-terminal">Live Terminal</div>,
}));

describe("Hero Component", () => {
  it("should render without crashing", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("should display the main heading", () => {
    render(<Hero />);
    expect(screen.getByText(/I keep databases alive/i)).toBeInTheDocument();
    expect(screen.getByText(/at scale/i)).toBeInTheDocument();
  });

  it("should display job title with SingleStore", () => {
    render(<Hero />);
    expect(screen.getByText(/Cloud Database Support Engineer/i)).toBeInTheDocument();
  });

  it("should display SingleStore company link", () => {
    render(<Hero />);
    const singleStoreLinks = screen.getAllByRole("link", { name: /SingleStore/i });
    expect(singleStoreLinks.length).toBeGreaterThan(0);
    // Check the first link has correct attributes
    expect(singleStoreLinks[0]).toHaveAttribute("href", "https://www.singlestore.com");
    expect(singleStoreLinks[0]).toHaveAttribute("target", "_blank");
    expect(singleStoreLinks[0]).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should display job description", () => {
    render(<Hero />);
    expect(
      screen.getByText(/I debug distributed systems, optimize queries at petabyte scale/i)
    ).toBeInTheDocument();
  });

  it("should display Active now status badge", () => {
    render(<Hero />);
    expect(screen.getByText(/Active now/i)).toBeInTheDocument();
  });

  it("should render profile image with proper attributes", () => {
    render(<Hero />);
    const image = screen.getByAltText("Shahid Moosa");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("width", "256");
    expect(image).toHaveAttribute("height", "256");
  });

  it("should render SingleStore logo image", () => {
    render(<Hero />);
    const logos = screen.getAllByAltText("SingleStore");
    expect(logos.length).toBeGreaterThan(0);
  });

  it("should render Let's talk button", () => {
    render(<Hero />);
    const talkButton = screen.getByRole("button", { name: /Let's talk/i });
    expect(talkButton).toBeInTheDocument();
  });

  it("should render See my work button", () => {
    render(<Hero />);
    const workButton = screen.getByRole("button", { name: /See my work/i });
    expect(workButton).toBeInTheDocument();
  });

  it("should render Resume download link", () => {
    render(<Hero />);
    const resumeLink = screen.getByRole("link", { name: /Resume/i });
    expect(resumeLink).toBeInTheDocument();
    expect(resumeLink).toHaveAttribute("href", "/resume.pdf");
    expect(resumeLink).toHaveAttribute("download", "Shahid_Moosa_Resume.pdf");
  });

  it("should render GitHub social link", () => {
    render(<Hero />);
    const githubLink = screen.getByLabelText("GitHub");
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute("href", "https://github.com/shahidmoosa");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should render LinkedIn social link", () => {
    render(<Hero />);
    const linkedinLink = screen.getByLabelText("LinkedIn");
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute("href", "https://linkedin.com/in/shahidmoosa");
    expect(linkedinLink).toHaveAttribute("target", "_blank");
    expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should render Email social link", () => {
    render(<Hero />);
    const emailLink = screen.getByLabelText("Email");
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:connect2shahidmoosa@gmail.com");
  });

  it("should render three social links", () => {
    render(<Hero />);
    const githubLink = screen.getByLabelText("GitHub");
    const linkedinLink = screen.getByLabelText("LinkedIn");
    const emailLink = screen.getByLabelText("Email");

    expect(githubLink).toBeInTheDocument();
    expect(linkedinLink).toBeInTheDocument();
    expect(emailLink).toBeInTheDocument();
  });

  it("should render LiveTerminal component", () => {
    render(<Hero />);
    expect(screen.getByTestId("live-terminal")).toBeInTheDocument();
  });

  it("should render Verified Systems Expertise section", () => {
    render(<Hero />);
    expect(screen.getByText(/Verified Systems Expertise/i)).toBeInTheDocument();
  });

  it("should have semantic HTML structure with section", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("should have scroll indicator with ArrowDown icon", () => {
    const { container } = render(<Hero />);
    // ArrowDown icon should be present in the scroll indicator
    const arrowIcon = container.querySelector('svg');
    expect(arrowIcon).toBeInTheDocument();
  });

  it("should handle Let's talk button click", () => {
    // Mock scrollIntoView
    const mockScrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = mockScrollIntoView;

    // Create a mock element
    const mockElement = document.createElement("div");
    mockElement.id = "connect";
    document.body.appendChild(mockElement);

    render(<Hero />);

    const talkButton = screen.getByRole("button", { name: /Let's talk/i });
    fireEvent.click(talkButton);

    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });

    // Cleanup
    document.body.removeChild(mockElement);
  });

  it("should handle See my work button click", () => {
    // Mock scrollIntoView
    const mockScrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = mockScrollIntoView;

    // Create a mock element
    const mockElement = document.createElement("div");
    mockElement.id = "work";
    document.body.appendChild(mockElement);

    render(<Hero />);

    const workButton = screen.getByRole("button", { name: /See my work/i });
    fireEvent.click(workButton);

    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });

    // Cleanup
    document.body.removeChild(mockElement);
  });

  it("should display SingleStore DB endorsement card", () => {
    render(<Hero />);
    expect(screen.getByText(/SingleStore DB/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Power your data-intensive apps/i)
    ).toBeInTheDocument();
  });

  it("should have responsive grid layout classes", () => {
    const { container } = render(<Hero />);
    const grid = container.querySelector(".grid.lg\\:grid-cols-2");
    expect(grid).toBeInTheDocument();
  });

  it("should have proper minimum height for hero section", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("min-h-screen");
  });

  it("should render ambient glow effects", () => {
    const { container } = render(<Hero />);
    const glows = container.querySelectorAll(".animate-glow-pulse");
    expect(glows.length).toBeGreaterThanOrEqual(2);
  });

  it("should have proper image priority and loading attributes", () => {
    render(<Hero />);
    const image = screen.getByAltText("Shahid Moosa");
    expect(image).toHaveAttribute("fetchpriority", "high");
    expect(image).toHaveAttribute("decoding", "async");
  });

  it("should render all CTA buttons in correct order", () => {
    const { container } = render(<Hero />);
    const text = container.textContent || "";

    const talkIndex = text.indexOf("Let's talk");
    const workIndex = text.indexOf("See my work");
    const resumeIndex = text.indexOf("Resume");

    expect(talkIndex).toBeLessThan(workIndex);
    expect(workIndex).toBeLessThan(resumeIndex);
  });

  it("should handle missing scroll target gracefully", () => {
    // Mock scrollIntoView
    const mockScrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = mockScrollIntoView;

    render(<Hero />);

    const talkButton = screen.getByRole("button", { name: /Let's talk/i });
    fireEvent.click(talkButton);

    // Should not throw error when element doesn't exist
    expect(() => fireEvent.click(talkButton)).not.toThrow();
  });

  it("should render profile photo with glow effect wrapper", () => {
    const { container } = render(<Hero />);
    const glowRing = container.querySelector(".blur-md.opacity-60");
    expect(glowRing).toBeInTheDocument();
  });

  it("should display active indicator dot", () => {
    const { container } = render(<Hero />);
    const activeIndicators = container.querySelectorAll(".bg-emerald-500.animate-pulse");
    expect(activeIndicators.length).toBeGreaterThan(0);
  });

  it("should have proper link styling with transitions", () => {
    render(<Hero />);
    const githubLink = screen.getByLabelText("GitHub");
    expect(githubLink.className).toContain("transition-colors");
  });
});