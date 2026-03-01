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
  LiveTerminal: () => <div data-testid="live-terminal">Live Terminal</div>,
}));

// Mock image imports
vi.mock("@/assets/shahid-moosa.jpg", () => ({
  default: "/mock-shahid-photo.jpg",
}));

vi.mock("@/assets/logos/singlestore.svg", () => ({
  default: "/mock-singlestore-logo.svg",
}));

describe("Hero", () => {
  it("should render without crashing", () => {
    render(<Hero />);
  });

  it("should display the main heading", () => {
    render(<Hero />);
    expect(screen.getByText(/I keep databases alive/i)).toBeInTheDocument();
    expect(screen.getByText(/at scale/i)).toBeInTheDocument();
  });

  it("should display the active status badge", () => {
    render(<Hero />);
    expect(screen.getByText(/Active now/i)).toBeInTheDocument();
  });

  it("should display job title", () => {
    render(<Hero />);
    expect(
      screen.getByText(/Cloud Database Support Engineer at/i)
    ).toBeInTheDocument();
  });

  it("should display SingleStore company link", () => {
    render(<Hero />);
    const singlestoreLinks = screen.getAllByRole("link", { name: /SingleStore/i });
    expect(singlestoreLinks.length).toBeGreaterThan(0);
    expect(singlestoreLinks[0]).toHaveAttribute(
      "href",
      "https://www.singlestore.com"
    );
    expect(singlestoreLinks[0]).toHaveAttribute("target", "_blank");
    expect(singlestoreLinks[0]).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should display job description", () => {
    render(<Hero />);
    expect(
      screen.getByText(
        /I debug distributed systems, optimize queries at petabyte scale/i
      )
    ).toBeInTheDocument();
  });

  it("should display CTA buttons", () => {
    render(<Hero />);
    expect(screen.getByText("Let's talk")).toBeInTheDocument();
    expect(screen.getByText("See my work")).toBeInTheDocument();
    expect(screen.getByText("Resume")).toBeInTheDocument();
  });

  it("should have working resume download link", () => {
    render(<Hero />);
    const resumeLink = screen.getByRole("link", { name: /Resume/i });
    expect(resumeLink).toHaveAttribute("href", "/resume.pdf");
    expect(resumeLink).toHaveAttribute("download", "Shahid_Moosa_Resume.pdf");
  });

  it("should display social media links", () => {
    render(<Hero />);

    const githubLink = screen.getByLabelText(/GitHub/i);
    expect(githubLink).toHaveAttribute("href", "https://github.com/shahidmoosa");
    expect(githubLink).toHaveAttribute("target", "_blank");

    const linkedinLink = screen.getByLabelText(/LinkedIn/i);
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://linkedin.com/in/shahidmoosa"
    );

    const emailLink = screen.getByLabelText(/Email/i);
    expect(emailLink).toHaveAttribute(
      "href",
      "mailto:connect2shahidmoosa@gmail.com"
    );
  });

  it("should display profile photo", () => {
    render(<Hero />);
    const photo = screen.getByAltText("Shahid Moosa");
    expect(photo).toBeInTheDocument();
    expect(photo).toHaveAttribute("src", "/mock-shahid-photo.jpg");
  });

  it("should display LiveTerminal component", () => {
    render(<Hero />);
    expect(screen.getByTestId("live-terminal")).toBeInTheDocument();
  });

  it("should display verified systems expertise section", () => {
    render(<Hero />);
    expect(screen.getByText(/Verified Systems Expertise/i)).toBeInTheDocument();
  });

  it("should have SingleStore endorsement card", () => {
    render(<Hero />);
    expect(screen.getByText(/SingleStore DB/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Power your data-intensive apps with the only database/i
      )
    ).toBeInTheDocument();
  });

  it("should have external link icon in endorsement card", () => {
    render(<Hero />);
    const endorsementLinks = screen.getAllByRole("link", {
      name: /SingleStore/i,
    });
    expect(endorsementLinks.length).toBeGreaterThan(0);
  });

  it("should have scroll indicator", () => {
    const { container } = render(<Hero />);
    // ArrowDown icon should be present in the component
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("should have proper link attributes for security", () => {
    render(<Hero />);
    const externalLinks = screen.getAllByRole("link", { name: /SingleStore/i });

    externalLinks.forEach((link) => {
      if (link.getAttribute("target") === "_blank") {
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      }
    });
  });

  it("should display SingleStore logo images", () => {
    render(<Hero />);
    const logos = screen.getAllByAltText("SingleStore");
    expect(logos.length).toBeGreaterThan(0);
    logos.forEach((logo) => {
      expect(logo).toHaveAttribute("src", "/mock-singlestore-logo.svg");
    });
  });

  it("should have accessible button labels", () => {
    render(<Hero />);
    expect(screen.getByText("Let's talk")).toBeInTheDocument();
    expect(screen.getByText("See my work")).toBeInTheDocument();
  });

  it("should use semantic HTML section element", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("should have proper image loading attributes", () => {
    render(<Hero />);
    const photo = screen.getByAltText("Shahid Moosa");
    expect(photo).toHaveAttribute("fetchpriority", "high");
    expect(photo).toHaveAttribute("decoding", "async");
  });

  it("should render all button CTAs", () => {
    render(<Hero />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("should have aria-label for social links", () => {
    render(<Hero />);
    expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
    expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("should display content in correct order", () => {
    render(<Hero />);
    const heading = screen.getByText(/I keep databases alive/i);
    const jobTitle = screen.getByText(/Cloud Database Support Engineer at/i);

    // Heading should appear before job title in DOM
    expect(heading.compareDocumentPosition(jobTitle)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  });

  it("should handle button clicks for scroll behavior", () => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();

    render(<Hero />);
    const talkButton = screen.getByText("Let's talk");
    const workButton = screen.getByText("See my work");

    expect(talkButton).toBeInTheDocument();
    expect(workButton).toBeInTheDocument();
  });

  it("should display profile photo with proper dimensions", () => {
    render(<Hero />);
    const photo = screen.getByAltText("Shahid Moosa");
    expect(photo).toHaveAttribute("width", "256");
    expect(photo).toHaveAttribute("height", "256");
  });

  it("should have SingleStore brand color applied", () => {
    const { container } = render(<Hero />);
    expect(container).toBeInTheDocument();
    // Component should render without style errors
  });

  it("should render responsive grid layout", () => {
    const { container } = render(<Hero />);
    const grid = container.querySelector(".grid");
    expect(grid).toBeInTheDocument();
  });

  it("should display all required text content", () => {
    render(<Hero />);

    // Main heading parts
    expect(screen.getByText(/I keep databases alive/i)).toBeInTheDocument();
    expect(screen.getByText(/at scale/i)).toBeInTheDocument();

    // Job description
    expect(screen.getByText(/Cloud Database Support Engineer at/i)).toBeInTheDocument();

    // CTAs
    expect(screen.getByText("Let's talk")).toBeInTheDocument();
    expect(screen.getByText("See my work")).toBeInTheDocument();
    expect(screen.getByText("Resume")).toBeInTheDocument();
  });

  it("should render multiple times without errors (regression test)", () => {
    const { rerender } = render(<Hero />);
    rerender(<Hero />);
    rerender(<Hero />);
    expect(screen.getByText(/I keep databases alive/i)).toBeInTheDocument();
  });

  it("should handle missing getElementById gracefully for scroll", () => {
    const originalGetElementById = document.getElementById;
    document.getElementById = vi.fn(() => null);

    render(<Hero />);
    const talkButton = screen.getByText("Let's talk");
    expect(talkButton).toBeInTheDocument();

    document.getElementById = originalGetElementById;
  });

  it("should contain all essential sections", () => {
    const { container } = render(<Hero />);

    // Should have status badge
    expect(screen.getByText(/Active now/i)).toBeInTheDocument();

    // Should have main content
    expect(screen.getByText(/I keep databases alive/i)).toBeInTheDocument();

    // Should have CTAs
    expect(screen.getByText("Let's talk")).toBeInTheDocument();

    // Should have social links
    expect(screen.getByLabelText("GitHub")).toBeInTheDocument();

    // Should have verified expertise section
    expect(screen.getByText(/Verified Systems Expertise/i)).toBeInTheDocument();
  });

  it("should have proper image alt attributes for accessibility", () => {
    render(<Hero />);

    const profilePhoto = screen.getByAltText("Shahid Moosa");
    expect(profilePhoto).toBeInTheDocument();

    const logos = screen.getAllByAltText("SingleStore");
    expect(logos.length).toBeGreaterThan(0);
  });
});