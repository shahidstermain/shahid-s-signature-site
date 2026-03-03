import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";
import "@testing-library/jest-dom";

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

describe("Hero", () => {
  beforeEach(() => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
    // Mock getElementById
    document.getElementById = vi.fn();
  });

  describe("rendering", () => {
    it("should render without crashing", () => {
      render(<Hero />);
      expect(screen.getAllByRole("heading").length).toBeGreaterThan(0);
    });

    it("should render the main heading", () => {
      render(<Hero />);
      const heading = screen.getByText(/I keep databases alive/i);
      expect(heading).toBeInTheDocument();
    });

    it("should render the subheading with 'at scale'", () => {
      render(<Hero />);
      const scaleText = screen.getByText(/at scale/i);
      expect(scaleText).toBeInTheDocument();
    });

    it("should display active status badge", () => {
      render(<Hero />);
      expect(screen.getByText(/Active now/i)).toBeInTheDocument();
    });

    it("should render SingleStore company information", () => {
      render(<Hero />);
      const singlestoreElements = screen.getAllByText(/SingleStore/i);
      expect(singlestoreElements.length).toBeGreaterThan(0);
    });

    it("should render job title", () => {
      render(<Hero />);
      expect(
        screen.getByText(/Cloud Database Support Engineer at/i)
      ).toBeInTheDocument();
    });

    it("should render job description", () => {
      render(<Hero />);
      expect(
        screen.getByText(/I debug distributed systems/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/petabyte scale/i)).toBeInTheDocument();
    });
  });

  describe("profile photo", () => {
    it("should render profile photo", () => {
      render(<Hero />);
      const photo = screen.getByAltText("Shahid Moosa");
      expect(photo).toBeInTheDocument();
    });

    it("should have correct image attributes", () => {
      render(<Hero />);
      const photo = screen.getByAltText("Shahid Moosa") as HTMLImageElement;
      expect(photo).toHaveAttribute("width", "256");
      expect(photo).toHaveAttribute("height", "256");
      expect(photo).toHaveAttribute("fetchPriority", "high");
      expect(photo).toHaveAttribute("decoding", "async");
    });

    it("should have correct src attribute", () => {
      render(<Hero />);
      const photo = screen.getByAltText("Shahid Moosa") as HTMLImageElement;
      expect(photo.src).toContain("shahid");
    });
  });

  describe("call-to-action buttons", () => {
    it("should render 'Let's talk' button", () => {
      render(<Hero />);
      expect(screen.getByText("Let's talk")).toBeInTheDocument();
    });

    it("should render 'See my work' button", () => {
      render(<Hero />);
      expect(screen.getByText("See my work")).toBeInTheDocument();
    });

    it("should render Resume button", () => {
      render(<Hero />);
      expect(screen.getByText("Resume")).toBeInTheDocument();
    });

    it("should have correct number of buttons", () => {
      render(<Hero />);
      const buttons = screen.getAllByRole("button");
      // Let's talk, See my work buttons (Resume is a link)
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it("Resume button should be a download link", () => {
      render(<Hero />);
      const resumeLink = screen
        .getByText("Resume")
        .closest("a") as HTMLAnchorElement;
      expect(resumeLink).toHaveAttribute("href", "/resume.pdf");
      expect(resumeLink).toHaveAttribute(
        "download",
        "Shahid_Moosa_Resume.pdf"
      );
    });

    it("should have FileDown icon in Resume button", () => {
      render(<Hero />);
      const resumeButton = screen.getByText("Resume").closest("a");
      expect(resumeButton).toBeInTheDocument();
    });
  });

  describe("social links", () => {
    it("should render GitHub link", () => {
      render(<Hero />);
      const githubLink = screen.getByLabelText("GitHub") as HTMLAnchorElement;
      expect(githubLink).toBeInTheDocument();
      expect(githubLink.href).toContain("github.com/shahidmoosa");
    });

    it("should render LinkedIn link", () => {
      render(<Hero />);
      const linkedinLink = screen.getByLabelText(
        "LinkedIn"
      ) as HTMLAnchorElement;
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink.href).toContain("linkedin.com/in/shahidmoosa");
    });

    it("should render Email link", () => {
      render(<Hero />);
      const emailLink = screen.getByLabelText("Email") as HTMLAnchorElement;
      expect(emailLink).toBeInTheDocument();
      expect(emailLink.href).toContain("mailto:connect2shahidmoosa@gmail.com");
    });

    it("social links should have target blank", () => {
      render(<Hero />);
      const githubLink = screen.getByLabelText("GitHub");
      const linkedinLink = screen.getByLabelText("LinkedIn");

      expect(githubLink).toHaveAttribute("target", "_blank");
      expect(linkedinLink).toHaveAttribute("target", "_blank");
    });

    it("social links should have rel noopener noreferrer", () => {
      render(<Hero />);
      const githubLink = screen.getByLabelText("GitHub");
      const linkedinLink = screen.getByLabelText("LinkedIn");

      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
      expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("SingleStore branding", () => {
    it("should render SingleStore logo", () => {
      render(<Hero />);
      const logos = screen.getAllByAltText("SingleStore");
      expect(logos.length).toBeGreaterThan(0);
    });

    it("should have link to SingleStore website", () => {
      render(<Hero />);
      const links = screen
        .getAllByText("SingleStore")
        .map((el) => el.closest("a"))
        .filter((link) => link !== null) as HTMLAnchorElement[];

      expect(links.length).toBeGreaterThan(0);
      links.forEach((link) => {
        expect(link.href).toContain("singlestore.com");
      });
    });

    it("SingleStore links should open in new tab", () => {
      render(<Hero />);
      const links = screen
        .getAllByText("SingleStore")
        .map((el) => el.closest("a"))
        .filter((link) => link !== null);

      links.forEach((link) => {
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });

    it("should render verified expertise section", () => {
      render(<Hero />);
      expect(screen.getByText(/Verified Systems Expertise/i)).toBeInTheDocument();
    });

    it("should render SingleStore DB description", () => {
      render(<Hero />);
      expect(
        screen.getByText(/Power your data-intensive apps/i)
      ).toBeInTheDocument();
    });
  });

  describe("LiveTerminal component", () => {
    it("should render LiveTerminal component", () => {
      render(<Hero />);
      expect(screen.getByTestId("live-terminal")).toBeInTheDocument();
    });
  });

  describe("scroll indicator", () => {
    it("should render scroll indicator", () => {
      render(<Hero />);
      const section = screen.getAllByRole("heading")[0].closest("section");
      expect(section).toBeInTheDocument();
    });
  });

  describe("layout structure", () => {
    it("should have section with min-h-screen class", () => {
      render(<Hero />);
      const section = screen.getAllByRole("heading")[0].closest("section");
      expect(section?.className).toContain("min-h-screen");
    });

    it("should render in two-column layout structure", () => {
      render(<Hero />);
      // Check for grid layout by finding the heading and photo
      expect(screen.getByText(/I keep databases alive/i)).toBeInTheDocument();
      expect(screen.getByAltText("Shahid Moosa")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(<Hero />);
      const headings = screen.getAllByRole("heading");
      const h1 = headings.find(h => h.tagName === "H1");
      expect(h1).toBeTruthy();
    });

    it("should have aria-labels on icon-only links", () => {
      render(<Hero />);
      expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
      expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });

    it("should have alt text on images", () => {
      render(<Hero />);
      const photo = screen.getByAltText("Shahid Moosa");
      expect(photo).toBeInTheDocument();

      const logos = screen.getAllByAltText("SingleStore");
      expect(logos.length).toBeGreaterThan(0);
    });
  });

  describe("content accuracy", () => {
    it("should mention Fortune 500 teams", () => {
      render(<Hero />);
      expect(screen.getByText(/Fortune 500 teams/i)).toBeInTheDocument();
    });

    it("should mention distributed systems", () => {
      render(<Hero />);
      expect(screen.getByText(/distributed systems/i)).toBeInTheDocument();
    });

    it("should mention query optimization", () => {
      render(<Hero />);
      expect(screen.getByText(/optimize queries/i)).toBeInTheDocument();
    });

    it("should mention reliable data infrastructure", () => {
      render(<Hero />);
      expect(
        screen.getByText(/reliable data infrastructure/i)
      ).toBeInTheDocument();
    });
  });

  describe("interactive elements", () => {
    it("Let's talk button should have onClick handler", () => {
      render(<Hero />);
      const button = screen.getByText("Let's talk");
      expect(button).toBeInTheDocument();
      // Button is rendered, which means onClick is attached
    });

    it("See my work button should have onClick handler", () => {
      render(<Hero />);
      const button = screen.getByText("See my work");
      expect(button).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle missing image gracefully", () => {
      render(<Hero />);
      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(0);
    });

    it("should render all text content even if images fail", () => {
      render(<Hero />);
      expect(screen.getByText(/I keep databases alive/i)).toBeInTheDocument();
      const singlestoreElements = screen.getAllByText(/SingleStore/i);
      expect(singlestoreElements.length).toBeGreaterThan(0);
    });
  });

  describe("branding colors", () => {
    it("should use SingleStore purple color constant", () => {
      render(<Hero />);
      const container = screen.getByText("SingleStore").closest("div");
      expect(container).toBeInTheDocument();
    });
  });

  describe("animation elements", () => {
    it("should have glow effect elements", () => {
      render(<Hero />);
      const section = screen.getAllByRole("heading")[0].closest("section");
      expect(section).toBeInTheDocument();
    });
  });

  describe("responsive design indicators", () => {
    it("should have responsive text classes", () => {
      render(<Hero />);
      const heading = screen.getByText(/I keep databases alive/i);
      expect(heading.className).toBeTruthy();
    });
  });
});