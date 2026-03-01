import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Hero } from "./Hero";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
}));

// Mock the LiveTerminal component
vi.mock("@/components/ui/LiveTerminal", () => ({
  LiveTerminal: () => <div data-testid="live-terminal">Terminal</div>,
}));

describe("Hero", () => {
  it("should render the hero section", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section");

    expect(section).toBeInTheDocument();
  });

  it("should display the main heading", () => {
    render(<Hero />);

    expect(screen.getByText(/I keep databases alive/i)).toBeInTheDocument();
    expect(screen.getByText(/at scale/i)).toBeInTheDocument();
  });

  it("should display job title", () => {
    render(<Hero />);

    expect(screen.getByText(/Cloud Database Support Engineer at/i)).toBeInTheDocument();
  });

  it("should display SingleStore company link", () => {
    render(<Hero />);
    const singlestoreLinks = screen.getAllByRole("link", { name: /singlestore/i });

    expect(singlestoreLinks.length).toBeGreaterThan(0);
    singlestoreLinks.forEach(link => {
      expect(link).toHaveAttribute("href", "https://www.singlestore.com");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("should display description text", () => {
    render(<Hero />);

    expect(
      screen.getByText(/I debug distributed systems, optimize queries at petabyte scale/i)
    ).toBeInTheDocument();
  });

  it("should render 'Let's talk' button", () => {
    render(<Hero />);
    const button = screen.getByRole("button", { name: /let's talk/i });

    expect(button).toBeInTheDocument();
  });

  it("should render 'See my work' button", () => {
    render(<Hero />);
    const button = screen.getByRole("button", { name: /see my work/i });

    expect(button).toBeInTheDocument();
  });

  it("should render Resume download link", () => {
    render(<Hero />);
    const resumeLink = screen.getByRole("link", { name: /resume/i });

    expect(resumeLink).toBeInTheDocument();
    expect(resumeLink).toHaveAttribute("href", "/resume.pdf");
    expect(resumeLink).toHaveAttribute("download", "Shahid_Moosa_Resume.pdf");
  });

  it("should render GitHub link with proper attributes", () => {
    render(<Hero />);
    const githubLink = screen.getByRole("link", { name: /github/i });

    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute("href", "https://github.com/shahidmoosa");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(githubLink).toHaveAttribute("aria-label", "GitHub");
  });

  it("should render LinkedIn link with proper attributes", () => {
    render(<Hero />);
    const linkedinLink = screen.getByRole("link", { name: /linkedin/i });

    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute("href", "https://linkedin.com/in/shahidmoosa");
    expect(linkedinLink).toHaveAttribute("target", "_blank");
    expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(linkedinLink).toHaveAttribute("aria-label", "LinkedIn");
  });

  it("should render Email link with proper attributes", () => {
    render(<Hero />);
    const emailLink = screen.getByRole("link", { name: /email/i });

    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:connect2shahidmoosa@gmail.com");
    expect(emailLink).toHaveAttribute("aria-label", "Email");
  });

  it("should render status badge with 'Active now' text", () => {
    render(<Hero />);

    expect(screen.getByText(/active now/i)).toBeInTheDocument();
  });

  it("should render profile photo with correct alt text", () => {
    render(<Hero />);
    const photo = screen.getByAltText("Shahid Moosa");

    expect(photo).toBeInTheDocument();
    expect(photo).toHaveAttribute("width", "256");
    expect(photo).toHaveAttribute("height", "256");
  });

  it("should render LiveTerminal component", () => {
    render(<Hero />);

    expect(screen.getByTestId("live-terminal")).toBeInTheDocument();
  });

  it("should have 'Let's talk' button scroll to connect section", () => {
    // Mock scrollIntoView
    const scrollIntoViewMock = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;

    // Create a mock element with id 'connect'
    const connectElement = document.createElement("div");
    connectElement.id = "connect";
    document.body.appendChild(connectElement);

    render(<Hero />);
    const talkButton = screen.getByRole("button", { name: /let's talk/i });

    fireEvent.click(talkButton);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });

    // Cleanup
    document.body.removeChild(connectElement);
  });

  it("should have 'See my work' button scroll to work section", () => {
    const scrollIntoViewMock = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;

    const workElement = document.createElement("div");
    workElement.id = "work";
    document.body.appendChild(workElement);

    render(<Hero />);
    const workButton = screen.getByRole("button", { name: /see my work/i });

    fireEvent.click(workButton);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });

    document.body.removeChild(workElement);
  });

  it("should display SingleStore endorsement card", () => {
    render(<Hero />);

    expect(screen.getByText(/Verified Systems Expertise/i)).toBeInTheDocument();
    expect(screen.getByText(/SingleStore DB/i)).toBeInTheDocument();
  });

  it("should render SingleStore description in endorsement", () => {
    render(<Hero />);

    expect(
      screen.getByText(/Power your data-intensive apps with the only database/i)
    ).toBeInTheDocument();
  });

  it("should render arrow down icon for scroll indicator", () => {
    const { container } = render(<Hero />);
    const arrowIcon = container.querySelector('svg.lucide-arrow-down');

    expect(arrowIcon).toBeInTheDocument();
  });

  it("should have responsive grid layout", () => {
    const { container } = render(<Hero />);
    const grid = container.querySelector(".grid");

    expect(grid?.className).toContain("lg:grid-cols-2");
  });

  it("should have all three call-to-action buttons", () => {
    render(<Hero />);

    expect(screen.getByRole("button", { name: /let's talk/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /see my work/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /resume/i })).toBeInTheDocument();
  });

  it("should handle missing connect element gracefully", () => {
    render(<Hero />);
    const talkButton = screen.getByRole("button", { name: /let's talk/i });

    // Should not throw error when element doesn't exist
    expect(() => fireEvent.click(talkButton)).not.toThrow();
  });

  it("should handle missing work element gracefully", () => {
    render(<Hero />);
    const workButton = screen.getByRole("button", { name: /see my work/i });

    // Should not throw error when element doesn't exist
    expect(() => fireEvent.click(workButton)).not.toThrow();
  });

  it("should render all social media links", () => {
    render(<Hero />);
    const githubLink = screen.getByRole("link", { name: /github/i });
    const linkedinLink = screen.getByRole("link", { name: /linkedin/i });
    const emailLink = screen.getByRole("link", { name: /email/i });

    expect(githubLink).toBeInTheDocument();
    expect(linkedinLink).toBeInTheDocument();
    expect(emailLink).toBeInTheDocument();
  });

  it("should have proper image loading attributes", () => {
    render(<Hero />);
    const photo = screen.getByAltText("Shahid Moosa");

    expect(photo).toHaveAttribute("fetchpriority", "high");
    expect(photo).toHaveAttribute("decoding", "async");
  });
});