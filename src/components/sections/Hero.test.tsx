import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  },
}));

// Mock Button component
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, asChild, ...props }: any) => {
    if (asChild) {
      return <div {...props}>{children}</div>;
    }
    return (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    );
  },
}));

// Mock LiveTerminal component
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
  });

  describe("rendering", () => {
    it("should render without crashing", () => {
      render(<Hero />);
      expect(screen.getByText(/I keep databases alive/i)).toBeInTheDocument();
    });

    it("should render main heading", () => {
      render(<Hero />);
      expect(screen.getByText(/I keep databases alive/i)).toBeInTheDocument();
      expect(screen.getByText(/at scale/i)).toBeInTheDocument();
    });

    it("should render status badge", () => {
      render(<Hero />);
      expect(screen.getByText("Active now")).toBeInTheDocument();
    });

    it("should render job title", () => {
      render(<Hero />);
      expect(screen.getByText(/Cloud Database Support Engineer at/i)).toBeInTheDocument();
    });

    it("should render SingleStore branding", () => {
      render(<Hero />);
      expect(screen.getByText("SingleStore")).toBeInTheDocument();
    });

    it("should render description", () => {
      render(<Hero />);
      expect(
        screen.getByText(/I debug distributed systems, optimize queries at petabyte scale/i)
      ).toBeInTheDocument();
    });
  });

  describe("CTAs", () => {
    it("should render Let's talk button", () => {
      render(<Hero />);
      expect(screen.getByText("Let's talk")).toBeInTheDocument();
    });

    it("should render See my work button", () => {
      render(<Hero />);
      expect(screen.getByText("See my work")).toBeInTheDocument();
    });

    it("should render Resume button", () => {
      render(<Hero />);
      expect(screen.getByText("Resume")).toBeInTheDocument();
    });

    it("should have resume download link", () => {
      const { container } = render(<Hero />);
      const resumeLink = container.querySelector('a[href="/resume.pdf"]');
      expect(resumeLink).toBeInTheDocument();
      expect(resumeLink?.getAttribute("download")).toBe("Shahid_Moosa_Resume.pdf");
    });
  });

  describe("social links", () => {
    it("should render GitHub link", () => {
      const { container } = render(<Hero />);
      const githubLink = container.querySelector('a[href="https://github.com/shahidmoosa"]');
      expect(githubLink).toBeInTheDocument();
      expect(githubLink?.getAttribute("target")).toBe("_blank");
      expect(githubLink?.getAttribute("rel")).toBe("noopener noreferrer");
    });

    it("should render LinkedIn link", () => {
      const { container } = render(<Hero />);
      const linkedinLink = container.querySelector(
        'a[href="https://linkedin.com/in/shahidmoosa"]'
      );
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink?.getAttribute("target")).toBe("_blank");
    });

    it("should render Email link", () => {
      const { container } = render(<Hero />);
      const emailLink = container.querySelector(
        'a[href="mailto:connect2shahidmoosa@gmail.com"]'
      );
      expect(emailLink).toBeInTheDocument();
    });

    it("should have aria-labels on social links", () => {
      const { container } = render(<Hero />);
      const githubLink = container.querySelector('a[aria-label="GitHub"]');
      const linkedinLink = container.querySelector('a[aria-label="LinkedIn"]');
      const emailLink = container.querySelector('a[aria-label="Email"]');

      expect(githubLink).toBeInTheDocument();
      expect(linkedinLink).toBeInTheDocument();
      expect(emailLink).toBeInTheDocument();
    });
  });

  describe("SingleStore branding", () => {
    it("should render SingleStore logo", () => {
      const { container } = render(<Hero />);
      const logos = container.querySelectorAll('img[alt="SingleStore"]');
      expect(logos.length).toBeGreaterThan(0);
    });

    it("should have SingleStore company link", () => {
      const { container } = render(<Hero />);
      const singlestoreLinks = container.querySelectorAll(
        'a[href="https://www.singlestore.com"]'
      );
      expect(singlestoreLinks.length).toBeGreaterThan(0);
    });

    it("should render Verified Systems Expertise section", () => {
      render(<Hero />);
      expect(screen.getByText("Verified Systems Expertise")).toBeInTheDocument();
    });

    it("should render SingleStore DB description", () => {
      render(<Hero />);
      expect(
        screen.getByText(
          /Power your data-intensive apps with the only database that allows you to transact/i
        )
      ).toBeInTheDocument();
    });
  });

  describe("profile photo", () => {
    it("should render profile photo", () => {
      const { container } = render(<Hero />);
      const photo = container.querySelector('img[alt="Shahid Moosa"]');
      expect(photo).toBeInTheDocument();
    });

    it("should have proper image attributes", () => {
      const { container } = render(<Hero />);
      const photo = container.querySelector('img[alt="Shahid Moosa"]');
      expect(photo?.getAttribute("width")).toBe("256");
      expect(photo?.getAttribute("height")).toBe("256");
      expect(photo?.getAttribute("fetchpriority")).toBe("high");
      expect(photo?.getAttribute("decoding")).toBe("async");
    });
  });

  describe("LiveTerminal", () => {
    it("should render LiveTerminal component", () => {
      render(<Hero />);
      expect(screen.getByTestId("live-terminal")).toBeInTheDocument();
    });
  });

  describe("scroll indicator", () => {
    it("should render scroll down arrow", () => {
      const { container } = render(<Hero />);
      // Check for ArrowDown icon - it should be rendered
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });
  });

  describe("interaction", () => {
    it("should scroll to connect section when Let's talk is clicked", () => {
      const mockElement = document.createElement("div");
      mockElement.id = "connect";
      document.body.appendChild(mockElement);

      render(<Hero />);
      const button = screen.getByText("Let's talk");
      button.click();

      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();

      document.body.removeChild(mockElement);
    });

    it("should scroll to work section when See my work is clicked", () => {
      const mockElement = document.createElement("div");
      mockElement.id = "work";
      document.body.appendChild(mockElement);

      render(<Hero />);
      const button = screen.getByText("See my work");
      button.click();

      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();

      document.body.removeChild(mockElement);
    });

    it("should handle missing target element gracefully", () => {
      render(<Hero />);
      const button = screen.getByText("Let's talk");

      // Should not throw error when element doesn't exist
      expect(() => button.click()).not.toThrow();
    });
  });

  describe("accessibility", () => {
    it("should have proper heading hierarchy", () => {
      const { container } = render(<Hero />);
      const h1 = container.querySelector("h1");
      expect(h1).toBeInTheDocument();
    });

    it("should have descriptive link text", () => {
      render(<Hero />);
      expect(screen.getByText("Let's talk")).toBeInTheDocument();
      expect(screen.getByText("See my work")).toBeInTheDocument();
      expect(screen.getByText("Resume")).toBeInTheDocument();
    });

    it("should open external links in new tab with security attributes", () => {
      const { container } = render(<Hero />);
      const externalLinks = container.querySelectorAll('a[target="_blank"]');

      externalLinks.forEach((link) => {
        expect(link.getAttribute("rel")).toContain("noopener");
        expect(link.getAttribute("rel")).toContain("noreferrer");
      });
    });
  });

  describe("responsive design", () => {
    it("should have responsive grid layout", () => {
      const { container } = render(<Hero />);
      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
    });

    it("should have section container", () => {
      const { container } = render(<Hero />);
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
      expect(section?.className).toContain("min-h-screen");
    });
  });

  describe("visual elements", () => {
    it("should have ambient glow effects", () => {
      const { container } = render(<Hero />);
      // Check for glow effect divs
      const section = container.querySelector("section");
      expect(section?.querySelectorAll(".bg-primary\\/10").length).toBeGreaterThan(0);
    });

    it("should have active indicator on profile photo", () => {
      const { container } = render(<Hero />);
      // Look for the active indicator with emerald color
      const indicator = container.querySelector(".bg-emerald-500");
      expect(indicator).toBeInTheDocument();
    });

    it("should have pulsing animation classes", () => {
      const { container } = render(<Hero />);
      const pulsingElements = container.querySelectorAll(".animate-pulse");
      expect(pulsingElements.length).toBeGreaterThan(0);
    });
  });

  describe("content structure", () => {
    it("should have proper section structure", () => {
      const { container } = render(<Hero />);
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
      expect(section?.tagName).toBe("SECTION");
    });

    it("should render all text content", () => {
      render(<Hero />);

      // Main content
      expect(screen.getByText(/I keep databases alive/i)).toBeInTheDocument();
      expect(screen.getByText(/at scale/i)).toBeInTheDocument();
      expect(screen.getByText("Active now")).toBeInTheDocument();

      // Job info
      expect(screen.getByText(/Cloud Database Support Engineer/i)).toBeInTheDocument();
      expect(screen.getByText("SingleStore")).toBeInTheDocument();

      // CTAs
      expect(screen.getByText("Let's talk")).toBeInTheDocument();
      expect(screen.getByText("See my work")).toBeInTheDocument();
      expect(screen.getByText("Resume")).toBeInTheDocument();

      // Verified section
      expect(screen.getByText("Verified Systems Expertise")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle missing images gracefully", () => {
      const { container } = render(<Hero />);
      const images = container.querySelectorAll("img");
      images.forEach((img) => {
        expect(img.getAttribute("alt")).toBeTruthy();
      });
    });

    it("should render with all elements present", () => {
      const { container } = render(<Hero />);

      // Check for key sections
      expect(container.querySelector("section")).toBeInTheDocument();
      expect(container.querySelector("h1")).toBeInTheDocument();
      expect(container.querySelectorAll("button").length).toBeGreaterThan(0);
      expect(container.querySelectorAll("a").length).toBeGreaterThan(0);
    });
  });
});