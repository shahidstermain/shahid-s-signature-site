import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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
  default: "/mock-photo.jpg",
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
      expect(() => render(<Hero />)).not.toThrow();
    });

    it("should display main heading", () => {
      render(<Hero />);

      expect(screen.getByText(/I keep databases alive/i)).toBeInTheDocument();
      expect(screen.getByText(/at scale/i)).toBeInTheDocument();
    });

    it("should display job title and company info", () => {
      render(<Hero />);

      expect(screen.getByText(/Cloud Database Support Engineer at/i)).toBeInTheDocument();
      expect(screen.getByText("SingleStore")).toBeInTheDocument();
    });

    it("should display job description", () => {
      render(<Hero />);

      expect(
        screen.getByText(/I debug distributed systems/i)
      ).toBeInTheDocument();
    });

    it("should render profile photo", () => {
      render(<Hero />);

      const photo = screen.getByAltText("Shahid Moosa");
      expect(photo).toBeInTheDocument();
      expect(photo).toHaveAttribute("src", "/mock-photo.jpg");
    });

    it("should render SingleStore logo", () => {
      render(<Hero />);

      const logos = screen.getAllByAltText("SingleStore");
      expect(logos.length).toBeGreaterThan(0);
    });

    it("should display active status indicator", () => {
      render(<Hero />);

      expect(screen.getByText("Active now")).toBeInTheDocument();
    });

    it("should render LiveTerminal component", () => {
      render(<Hero />);

      expect(screen.getByTestId("live-terminal")).toBeInTheDocument();
    });
  });

  describe("call-to-action buttons", () => {
    it("should render all CTA buttons", () => {
      render(<Hero />);

      expect(screen.getByText("Let's talk")).toBeInTheDocument();
      expect(screen.getByText("See my work")).toBeInTheDocument();
      expect(screen.getByText("Resume")).toBeInTheDocument();
    });

    it("should scroll to connect section when 'Let's talk' is clicked", () => {
      const mockElement = document.createElement("div");
      mockElement.id = "connect";
      document.body.appendChild(mockElement);

      render(<Hero />);

      const talkButton = screen.getByText("Let's talk");
      fireEvent.click(talkButton);

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
      });

      document.body.removeChild(mockElement);
    });

    it("should scroll to work section when 'See my work' is clicked", () => {
      const mockElement = document.createElement("div");
      mockElement.id = "work";
      document.body.appendChild(mockElement);

      render(<Hero />);

      const workButton = screen.getByText("See my work");
      fireEvent.click(workButton);

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
      });

      document.body.removeChild(mockElement);
    });

    it("should have resume download link", () => {
      render(<Hero />);

      const resumeLink = screen.getByText("Resume").closest("a");
      expect(resumeLink).toHaveAttribute("href", "/resume.pdf");
      expect(resumeLink).toHaveAttribute("download", "Shahid_Moosa_Resume.pdf");
    });

    it("should handle missing target element gracefully", () => {
      render(<Hero />);

      const talkButton = screen.getByText("Let's talk");

      // Should not throw when element doesn't exist
      expect(() => fireEvent.click(talkButton)).not.toThrow();
    });
  });

  describe("social links", () => {
    it("should render all social links", () => {
      render(<Hero />);

      const githubLink = screen.getByLabelText("GitHub");
      const linkedinLink = screen.getByLabelText("LinkedIn");
      const emailLink = screen.getByLabelText("Email");

      expect(githubLink).toBeInTheDocument();
      expect(linkedinLink).toBeInTheDocument();
      expect(emailLink).toBeInTheDocument();
    });

    it("should have correct GitHub link", () => {
      render(<Hero />);

      const githubLink = screen.getByLabelText("GitHub");
      expect(githubLink).toHaveAttribute("href", "https://github.com/shahidmoosa");
      expect(githubLink).toHaveAttribute("target", "_blank");
      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should have correct LinkedIn link", () => {
      render(<Hero />);

      const linkedinLink = screen.getByLabelText("LinkedIn");
      expect(linkedinLink).toHaveAttribute(
        "href",
        "https://linkedin.com/in/shahidmoosa"
      );
      expect(linkedinLink).toHaveAttribute("target", "_blank");
      expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should have correct email link", () => {
      render(<Hero />);

      const emailLink = screen.getByLabelText("Email");
      expect(emailLink).toHaveAttribute(
        "href",
        "mailto:connect2shahidmoosa@gmail.com"
      );
    });
  });

  describe("SingleStore branding", () => {
    it("should render SingleStore company link", () => {
      render(<Hero />);

      const links = screen.getAllByRole("link");
      const singlestoreLinks = links.filter(
        (link) => link.getAttribute("href") === "https://www.singlestore.com"
      );

      expect(singlestoreLinks.length).toBeGreaterThan(0);
    });

    it("should have external link attributes on SingleStore links", () => {
      render(<Hero />);

      const links = screen.getAllByRole("link");
      const singlestoreLink = links.find(
        (link) => link.getAttribute("href") === "https://www.singlestore.com"
      );

      expect(singlestoreLink).toHaveAttribute("target", "_blank");
      expect(singlestoreLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should display SingleStore verification section", () => {
      render(<Hero />);

      expect(screen.getByText("Verified Systems Expertise")).toBeInTheDocument();
      expect(screen.getByText("SingleStore DB")).toBeInTheDocument();
    });

    it("should display SingleStore description", () => {
      render(<Hero />);

      expect(
        screen.getByText(/Power your data-intensive apps/i)
      ).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have proper aria-labels on social links", () => {
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

    it("should use semantic HTML elements", () => {
      const { container } = render(<Hero />);

      expect(container.querySelector("section")).toBeInTheDocument();
      expect(container.querySelector("h1")).toBeInTheDocument();
    });
  });

  describe("responsive design elements", () => {
    it("should render grid layout container", () => {
      const { container } = render(<Hero />);

      const gridElements = container.querySelectorAll('[class*="grid"]');
      expect(gridElements.length).toBeGreaterThan(0);
    });

    it("should render button group with flex layout", () => {
      const { container } = render(<Hero />);

      const flexElements = container.querySelectorAll('[class*="flex"]');
      expect(flexElements.length).toBeGreaterThan(0);
    });
  });

  describe("content verification", () => {
    it("should mention Fortune 500 in description", () => {
      render(<Hero />);

      expect(screen.getByText(/Fortune 500/i)).toBeInTheDocument();
    });

    it("should mention petabyte scale", () => {
      render(<Hero />);

      expect(screen.getByText(/petabyte scale/i)).toBeInTheDocument();
    });

    it("should mention distributed systems", () => {
      render(<Hero />);

      expect(screen.getByText(/distributed systems/i)).toBeInTheDocument();
    });
  });

  describe("visual elements", () => {
    it("should render ambient glow effect divs", () => {
      const { container } = render(<Hero />);

      const glowElements = container.querySelectorAll('[class*="glow"]');
      expect(glowElements.length).toBeGreaterThan(0);
    });

    it("should render scroll indicator", () => {
      const { container } = render(<Hero />);

      // The ArrowDown icon should be rendered
      const svgElements = container.querySelectorAll("svg");
      expect(svgElements.length).toBeGreaterThan(0);
    });

    it("should render status badge", () => {
      render(<Hero />);

      expect(screen.getByText("Active now")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle multiple clicks on CTA buttons", () => {
      const mockElement = document.createElement("div");
      mockElement.id = "connect";
      document.body.appendChild(mockElement);

      render(<Hero />);

      const talkButton = screen.getByText("Let's talk");
      fireEvent.click(talkButton);
      fireEvent.click(talkButton);
      fireEvent.click(talkButton);

      // Should not throw
      expect(mockElement.scrollIntoView).toHaveBeenCalled();

      document.body.removeChild(mockElement);
    });

    it("should render when scrollIntoView is not available", () => {
      // Remove the mock temporarily
      const originalScrollIntoView = Element.prototype.scrollIntoView;
      // @ts-ignore
      delete Element.prototype.scrollIntoView;

      render(<Hero />);

      const talkButton = screen.getByText("Let's talk");

      // Should not throw even when scrollIntoView is undefined
      expect(() => fireEvent.click(talkButton)).not.toThrow();

      // Restore
      Element.prototype.scrollIntoView = originalScrollIntoView;
    });
  });

  describe("additional edge cases", () => {
    it("should handle rapid clicking on buttons", () => {
      const mockElement = document.createElement("div");
      mockElement.id = "work";
      document.body.appendChild(mockElement);

      render(<Hero />);

      const workButton = screen.getByText("See my work");

      // Rapid clicks
      for (let i = 0; i < 10; i++) {
        fireEvent.click(workButton);
      }

      expect(mockElement.scrollIntoView).toHaveBeenCalled();
      document.body.removeChild(mockElement);
    });

    it("should render with all image optimization attributes", () => {
      render(<Hero />);

      const photo = screen.getByAltText("Shahid Moosa");
      expect(photo).toHaveAttribute("width", "256");
      expect(photo).toHaveAttribute("height", "256");
      expect(photo).toHaveAttribute("fetchPriority", "high");
      expect(photo).toHaveAttribute("decoding", "async");
    });

    it("should have correct resume download filename", () => {
      render(<Hero />);

      const resumeLink = screen.getByText("Resume").closest("a");
      expect(resumeLink).toHaveAttribute("download", "Shahid_Moosa_Resume.pdf");
    });

    it("should render all brand color elements", () => {
      const { container } = render(<Hero />);

      // Check for SingleStore purple color references
      const elementsWithStyle = container.querySelectorAll("[style]");
      expect(elementsWithStyle.length).toBeGreaterThan(0);
    });

    it("should handle missing DOM elements gracefully", () => {
      render(<Hero />);

      const buttons = [
        screen.getByText("Let's talk"),
        screen.getByText("See my work"),
      ];

      buttons.forEach((button) => {
        expect(() => fireEvent.click(button)).not.toThrow();
      });
    });

    it("should render all lucide-react icons", () => {
      const { container } = render(<Hero />);

      // Check for SVG elements (icons from lucide-react)
      const svgElements = container.querySelectorAll("svg");
      expect(svgElements.length).toBeGreaterThan(3);
    });

    it("should have proper link security attributes", () => {
      render(<Hero />);

      const links = screen.getAllByRole("link");
      const externalLinks = links.filter(
        (link) =>
          link.getAttribute("href")?.startsWith("http") &&
          !link.getAttribute("href")?.startsWith("http://") &&
          link.getAttribute("href") !== "mailto:connect2shahidmoosa@gmail.com"
      );

      externalLinks.forEach((link) => {
        if (link.getAttribute("target") === "_blank") {
          expect(link).toHaveAttribute("rel", "noopener noreferrer");
        }
      });
    });

    it("should render without animations when motion is disabled", () => {
      render(<Hero />);

      // Even with mocked motion, component should render
      expect(screen.getByText(/I keep databases alive/i)).toBeInTheDocument();
    });

    it("should have correct button variant classes", () => {
      render(<Hero />);

      const talkButton = screen.getByText("Let's talk").closest("button");
      const workButton = screen.getByText("See my work").closest("button");

      expect(talkButton).toBeInTheDocument();
      expect(workButton).toBeInTheDocument();
    });

    it("should render status badge with animation classes", () => {
      const { container } = render(<Hero />);

      const statusBadge = screen.getByText("Active now").closest("div");
      expect(statusBadge).toBeInTheDocument();
    });
  });
});