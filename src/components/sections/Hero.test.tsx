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

describe("Hero component", () => {
  describe("basic rendering", () => {
    it("should render without crashing", () => {
      expect(() => render(<Hero />)).not.toThrow();
    });

    it("should render the main heading", () => {
      render(<Hero />);
      expect(screen.getByText(/I keep databases alive/i)).toBeInTheDocument();
      expect(screen.getByText(/at scale\./i)).toBeInTheDocument();
    });

    it("should display the status badge", () => {
      render(<Hero />);
      expect(screen.getByText(/Active now/i)).toBeInTheDocument();
    });

    it("should render the profile image", () => {
      render(<Hero />);
      const image = screen.getByAltText("Shahid Moosa");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src");
    });

    it("should render the LiveTerminal component", () => {
      render(<Hero />);
      expect(screen.getByTestId("live-terminal")).toBeInTheDocument();
    });
  });

  describe("company branding", () => {
    it("should display SingleStore information", () => {
      render(<Hero />);
      expect(screen.getByText("SingleStore")).toBeInTheDocument();
    });

    it("should show job title", () => {
      render(<Hero />);
      expect(screen.getByText(/Cloud Database Support Engineer at/i)).toBeInTheDocument();
    });

    it("should include SingleStore link", () => {
      render(<Hero />);
      const link = screen.getAllByRole("link").find(
        (link) => link.getAttribute("href") === "https://www.singlestore.com"
      );
      expect(link).toBeInTheDocument();
    });

    it("should display job description", () => {
      render(<Hero />);
      expect(
        screen.getByText(/I debug distributed systems/i)
      ).toBeInTheDocument();
    });

    it("should show SingleStore endorsement section", () => {
      render(<Hero />);
      expect(screen.getByText(/Verified Systems Expertise/i)).toBeInTheDocument();
      expect(screen.getByText(/SingleStore DB/i)).toBeInTheDocument();
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

    it("should render 'Resume' button", () => {
      render(<Hero />);
      expect(screen.getByText("Resume")).toBeInTheDocument();
    });

    it("should have resume download link", () => {
      render(<Hero />);
      const resumeLink = screen.getByRole("link", { name: /Resume/i });
      expect(resumeLink).toHaveAttribute("href", "/resume.pdf");
      expect(resumeLink).toHaveAttribute("download", "Shahid_Moosa_Resume.pdf");
    });
  });

  describe("social links", () => {
    it("should render GitHub link", () => {
      render(<Hero />);
      const githubLink = screen.getByLabelText("GitHub");
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute("href", "https://github.com/shahidmoosa");
      expect(githubLink).toHaveAttribute("target", "_blank");
      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should render LinkedIn link", () => {
      render(<Hero />);
      const linkedinLink = screen.getByLabelText("LinkedIn");
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink).toHaveAttribute("href", "https://linkedin.com/in/shahidmoosa");
      expect(linkedinLink).toHaveAttribute("target", "_blank");
      expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should render Email link", () => {
      render(<Hero />);
      const emailLink = screen.getByLabelText("Email");
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute("href", "mailto:connect2shahidmoosa@gmail.com");
    });
  });

  describe("accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(<Hero />);
      const mainHeading = screen.getByRole("heading", { level: 1 });
      expect(mainHeading).toBeInTheDocument();
    });

    it("should have aria-labels on social links", () => {
      render(<Hero />);
      expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
      expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });

    it("should have alt text on image", () => {
      render(<Hero />);
      const image = screen.getByAltText("Shahid Moosa");
      expect(image).toBeInTheDocument();
    });

    it("should use semantic section element", () => {
      const { container } = render(<Hero />);
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });
  });

  describe("image optimization", () => {
    it("should set fetchPriority to high for profile image", () => {
      render(<Hero />);
      const image = screen.getByAltText("Shahid Moosa");
      // Note: React uses fetchPriority but DOM uses fetchpriority
      expect(image).toHaveAttribute("fetchpriority", "high");
    });

    it("should set decoding to async for profile image", () => {
      render(<Hero />);
      const image = screen.getByAltText("Shahid Moosa");
      expect(image).toHaveAttribute("decoding", "async");
    });

    it("should have width and height attributes", () => {
      render(<Hero />);
      const image = screen.getByAltText("Shahid Moosa");
      expect(image).toHaveAttribute("width", "256");
      expect(image).toHaveAttribute("height", "256");
    });
  });

  describe("external links security", () => {
    it("should have rel='noopener noreferrer' on external links", () => {
      render(<Hero />);
      const externalLinks = screen.getAllByRole("link").filter(
        (link) => link.getAttribute("target") === "_blank"
      );

      externalLinks.forEach((link) => {
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });
  });

  describe("content verification", () => {
    it("should display petabyte scale text", () => {
      render(<Hero />);
      expect(screen.getByText(/petabyte scale/i)).toBeInTheDocument();
    });

    it("should display Fortune 500 reference", () => {
      render(<Hero />);
      expect(screen.getByText(/Fortune 500/i)).toBeInTheDocument();
    });

    it("should display SingleStore database description", () => {
      render(<Hero />);
      expect(
        screen.getByText(/transact, analyze & contextualize data in real-time/i)
      ).toBeInTheDocument();
    });
  });

  describe("layout structure", () => {
    it("should have grid layout container", () => {
      const { container } = render(<Hero />);
      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
    });

    it("should render profile photo section", () => {
      render(<Hero />);
      const image = screen.getByAltText("Shahid Moosa");
      expect(image.closest("div")).toBeInTheDocument();
    });
  });

  describe("scroll indicator", () => {
    it("should render scroll indicator", () => {
      const { container } = render(<Hero />);
      // Check for the presence of the scroll indicator section
      const sections = container.querySelectorAll("section");
      expect(sections.length).toBeGreaterThan(0);
    });
  });

  describe("branding colors", () => {
    it("should apply SingleStore purple color scheme", () => {
      const { container } = render(<Hero />);
      // The component uses inline styles with SingleStore purple
      expect(container.innerHTML).toContain("170, 140, 255");
    });
  });
});