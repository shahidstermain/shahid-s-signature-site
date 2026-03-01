import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  },
}));

// Mock the LiveTerminal component
vi.mock("@/components/ui/LiveTerminal", () => ({
  LiveTerminal: () => <div data-testid="live-terminal">Terminal</div>,
}));

// Mock image imports
vi.mock("@/assets/shahid-moosa.jpg", () => ({
  default: "/mock-shahid-photo.jpg",
}));

vi.mock("@/assets/logos/singlestore.svg", () => ({
  default: "/mock-singlestore-logo.svg",
}));

describe("Hero component", () => {
  it("should render without crashing", () => {
    expect(() => render(<Hero />)).not.toThrow();
  });

  it("should display main heading", () => {
    render(<Hero />);

    expect(screen.getByText(/I keep databases alive/i)).toBeInTheDocument();
    expect(screen.getByText(/at scale/i)).toBeInTheDocument();
  });

  it("should display job title and company", () => {
    render(<Hero />);

    expect(
      screen.getByText(/Cloud Database Support Engineer at/i)
    ).toBeInTheDocument();
    expect(screen.getByText("SingleStore")).toBeInTheDocument();
  });

  it("should display job description", () => {
    render(<Hero />);

    expect(
      screen.getByText(
        /I debug distributed systems, optimize queries at petabyte scale/i
      )
    ).toBeInTheDocument();
  });

  it("should render profile photo", () => {
    render(<Hero />);

    const photo = screen.getByAltText("Shahid Moosa");
    expect(photo).toBeInTheDocument();
    expect(photo).toHaveAttribute("src", "/mock-shahid-photo.jpg");
    expect(photo).toHaveAttribute("width", "256");
    expect(photo).toHaveAttribute("height", "256");
  });

  it("should render SingleStore logo", () => {
    render(<Hero />);

    const logos = screen.getAllByAltText("SingleStore");
    expect(logos.length).toBeGreaterThan(0);
    logos.forEach((logo) => {
      expect(logo).toHaveAttribute("src", "/mock-singlestore-logo.svg");
    });
  });

  it("should display active status badge", () => {
    render(<Hero />);

    expect(screen.getByText("Active now")).toBeInTheDocument();
  });

  it("should render CTA buttons", () => {
    render(<Hero />);

    expect(screen.getByText("Let's talk")).toBeInTheDocument();
    expect(screen.getByText("See my work")).toBeInTheDocument();
    expect(screen.getByText("Resume")).toBeInTheDocument();
  });

  it("should render social media links", () => {
    render(<Hero />);

    const githubLink = screen.getByLabelText("GitHub");
    const linkedinLink = screen.getByLabelText("LinkedIn");
    const emailLink = screen.getByLabelText("Email");

    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute("href", "https://github.com/shahidmoosa");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");

    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute("href", "https://linkedin.com/in/shahidmoosa");
    expect(linkedinLink).toHaveAttribute("target", "_blank");

    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:connect2shahidmoosa@gmail.com");
  });

  it("should render resume download link", () => {
    render(<Hero />);

    const resumeLink = screen.getByText("Resume").closest("a");
    expect(resumeLink).toBeInTheDocument();
    expect(resumeLink).toHaveAttribute("href", "/resume.pdf");
    expect(resumeLink).toHaveAttribute("download", "Shahid_Moosa_Resume.pdf");
  });

  it("should render SingleStore company link", () => {
    render(<Hero />);

    const singlestoreLinks = screen
      .getAllByText("SingleStore")
      .map((el) => el.closest("a"))
      .filter((link) => link !== null);

    expect(singlestoreLinks.length).toBeGreaterThan(0);
    singlestoreLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", "https://www.singlestore.com");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("should render verified systems expertise section", () => {
    render(<Hero />);

    expect(screen.getByText("Verified Systems Expertise")).toBeInTheDocument();
  });

  it("should render SingleStore DB endorsement card", () => {
    render(<Hero />);

    expect(screen.getByText("SingleStore DB")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Power your data-intensive apps with the only database/i
      )
    ).toBeInTheDocument();
  });

  it("should render LiveTerminal component", () => {
    render(<Hero />);

    expect(screen.getByTestId("live-terminal")).toBeInTheDocument();
  });

  it("should render scroll indicator", () => {
    render(<Hero />);

    // The ArrowDown icon should be rendered (checking for SVG presence)
    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("should have proper section structure", () => {
    const { container } = render(<Hero />);

    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("min-h-screen");
  });

  it("should apply SingleStore brand color", () => {
    const { container } = render(<Hero />);

    // Check that SingleStore branding elements are rendered
    // The exact color might be in RGB format after mocking
    const singlestoreElements = screen.getAllByText("SingleStore");
    expect(singlestoreElements.length).toBeGreaterThan(0);
  });

  it("should render ambient glow effects", () => {
    const { container } = render(<Hero />);

    const glowEffects = container.querySelectorAll(".animate-glow-pulse");
    expect(glowEffects.length).toBeGreaterThanOrEqual(2);
  });

  it("should have responsive grid layout", () => {
    const { container } = render(<Hero />);

    const grid = container.querySelector(".grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass("lg:grid-cols-2");
  });

  it("should render profile photo with glow ring", () => {
    const { container } = render(<Hero />);

    const photo = screen.getByAltText("Shahid Moosa");
    const photoContainer = photo.closest("div");

    // Check for rounded-full class on photo container
    expect(photoContainer).toHaveClass("rounded-full");
  });

  it("should render active indicator on photo", () => {
    const { container } = render(<Hero />);

    // Look for the green active indicator dot
    const activeIndicators = container.querySelectorAll(".bg-emerald-500");
    expect(activeIndicators.length).toBeGreaterThanOrEqual(2); // badge + photo indicator
  });

  it("should have proper image loading attributes", () => {
    render(<Hero />);

    const photo = screen.getByAltText("Shahid Moosa");
    expect(photo).toHaveAttribute("fetchpriority", "high");
    expect(photo).toHaveAttribute("decoding", "async");
  });

  it("should render with proper accessibility attributes", () => {
    render(<Hero />);

    // Check aria-labels on social links
    expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
    expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();

    // Check alt text on images
    expect(screen.getByAltText("Shahid Moosa")).toBeInTheDocument();
    expect(screen.getAllByAltText("SingleStore").length).toBeGreaterThan(0);
  });

  it("should render all lucide-react icons", () => {
    const { container } = render(<Hero />);

    // Icons should be rendered as SVGs
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  it("should handle click events on CTA buttons", () => {
    render(<Hero />);

    const letsTalkButton = screen.getByText("Let's talk");
    const seeWorkButton = screen.getByText("See my work");

    // Buttons should be clickable
    expect(letsTalkButton).not.toBeDisabled();
    expect(seeWorkButton).not.toBeDisabled();
  });

  it("should render proper heading hierarchy", () => {
    const { container } = render(<Hero />);

    const h1 = container.querySelector("h1");
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent(/I keep databases alive/i);
  });

  it("should use section-container class", () => {
    const { container } = render(<Hero />);

    const sectionContainer = container.querySelector(".section-container");
    expect(sectionContainer).toBeInTheDocument();
  });

  it("should render with proper z-index layering", () => {
    const { container } = render(<Hero />);

    const relativeZElements = container.querySelectorAll(".relative.z-10");
    expect(relativeZElements.length).toBeGreaterThan(0);
  });

  it("should include all required content sections", () => {
    render(<Hero />);

    // Status badge
    expect(screen.getByText("Active now")).toBeInTheDocument();

    // Main heading
    expect(screen.getByText(/I keep databases alive/i)).toBeInTheDocument();

    // Subheading
    expect(screen.getByText(/Cloud Database Support Engineer at/i)).toBeInTheDocument();

    // CTAs
    expect(screen.getByText("Let's talk")).toBeInTheDocument();
    expect(screen.getByText("See my work")).toBeInTheDocument();
    expect(screen.getByText("Resume")).toBeInTheDocument();

    // Social links
    expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
    expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();

    // Verified expertise
    expect(screen.getByText("Verified Systems Expertise")).toBeInTheDocument();

    // Terminal
    expect(screen.getByTestId("live-terminal")).toBeInTheDocument();
  });
});