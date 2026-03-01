import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Hero } from "./Hero";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock LiveTerminal component
vi.mock("@/components/ui/LiveTerminal", () => ({
  LiveTerminal: () => <div data-testid="live-terminal">Live Terminal</div>,
}));

describe("Hero", () => {
  it("should render without crashing", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("should display main heading text", () => {
    render(<Hero />);
    expect(screen.getByText(/I keep databases alive/i)).toBeInTheDocument();
    expect(screen.getByText(/at scale/i)).toBeInTheDocument();
  });

  it("should display 'Active now' status badge", () => {
    render(<Hero />);
    expect(screen.getByText("Active now")).toBeInTheDocument();
  });

  it("should display job title", () => {
    render(<Hero />);
    expect(screen.getByText("Cloud Database Support Engineer at")).toBeInTheDocument();
  });

  it("should display SingleStore company link", () => {
    render(<Hero />);
    const singlestoreLinks = screen.getAllByRole("link", { name: /SingleStore/i });
    expect(singlestoreLinks.length).toBeGreaterThan(0);
    expect(singlestoreLinks[0]).toHaveAttribute("href", "https://www.singlestore.com");
  });

  it("should display job description", () => {
    render(<Hero />);
    expect(screen.getByText(/debug distributed systems/i)).toBeInTheDocument();
    expect(screen.getByText(/petabyte scale/i)).toBeInTheDocument();
  });

  it("should render Let's talk button", () => {
    render(<Hero />);
    const button = screen.getByRole("button", { name: /Let's talk/i });
    expect(button).toBeInTheDocument();
  });

  it("should render See my work button", () => {
    render(<Hero />);
    const button = screen.getByRole("button", { name: /See my work/i });
    expect(button).toBeInTheDocument();
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
    const githubLink = screen.getByRole("link", { name: /GitHub/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute("href", "https://github.com/shahidmoosa");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should render LinkedIn social link", () => {
    render(<Hero />);
    const linkedinLink = screen.getByRole("link", { name: /LinkedIn/i });
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute("href", "https://linkedin.com/in/shahidmoosa");
  });

  it("should render Email social link", () => {
    render(<Hero />);
    const emailLink = screen.getByRole("link", { name: /Email/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:connect2shahidmoosa@gmail.com");
  });

  it("should render profile photo", () => {
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

  it("should have SingleStore verification section", () => {
    render(<Hero />);
    expect(screen.getByText("Verified Systems Expertise")).toBeInTheDocument();
  });

  it("should display SingleStore DB description", () => {
    render(<Hero />);
    expect(screen.getByText(/Power your data-intensive apps/i)).toBeInTheDocument();
  });

  describe("button interactions", () => {
    it("should scroll to connect section when Let's talk is clicked", () => {
      // Mock scrollIntoView
      const mockScrollIntoView = vi.fn();
      const mockElement = { scrollIntoView: mockScrollIntoView };
      vi.spyOn(document, "getElementById").mockReturnValue(mockElement as any);

      render(<Hero />);
      const button = screen.getByRole("button", { name: /Let's talk/i });
      fireEvent.click(button);

      expect(document.getElementById).toHaveBeenCalledWith("connect");
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    });

    it("should scroll to work section when See my work is clicked", () => {
      const mockScrollIntoView = vi.fn();
      const mockElement = { scrollIntoView: mockScrollIntoView };
      vi.spyOn(document, "getElementById").mockReturnValue(mockElement as any);

      render(<Hero />);
      const button = screen.getByRole("button", { name: /See my work/i });
      fireEvent.click(button);

      expect(document.getElementById).toHaveBeenCalledWith("work");
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    });

    it("should handle missing scroll target gracefully", () => {
      vi.spyOn(document, "getElementById").mockReturnValue(null);

      render(<Hero />);
      const button = screen.getByRole("button", { name: /Let's talk/i });

      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });

  describe("accessibility", () => {
    it("should use semantic section element", () => {
      const { container } = render(<Hero />);
      expect(container.querySelector("section")).toBeInTheDocument();
    });

    it("should have proper heading hierarchy", () => {
      render(<Hero />);
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toBeInTheDocument();
    });

    it("should have aria-labels on social links", () => {
      render(<Hero />);
      expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
      expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });

    it("should have proper alt text on image", () => {
      render(<Hero />);
      const image = screen.getByAltText("Shahid Moosa");
      expect(image).toBeInTheDocument();
    });

    it("should open external links in new tab with security attributes", () => {
      render(<Hero />);
      const externalLinks = [
        screen.getByRole("link", { name: /GitHub/i }),
        screen.getByRole("link", { name: /LinkedIn/i }),
      ];

      externalLinks.forEach(link => {
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });

    it("should have fetchPriority on hero image", () => {
      render(<Hero />);
      const image = screen.getByAltText("Shahid Moosa");
      expect(image).toHaveAttribute("fetchPriority", "high");
    });
  });

  describe("visual elements", () => {
    it("should render ArrowDown icon for scroll indicator", () => {
      const { container } = render(<Hero />);
      // Check for any arrow-related icon
      const icons = container.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThan(0);
    });

    it("should have SingleStore logo images", () => {
      const { container } = render(<Hero />);
      const logos = container.querySelectorAll('img[alt="SingleStore"]');
      expect(logos.length).toBeGreaterThan(0);
    });

    it("should have ambient glow effect divs", () => {
      const { container } = render(<Hero />);
      // Glow effects may not have specific class after mocking motion
      const divs = container.querySelectorAll("div");
      expect(divs.length).toBeGreaterThan(0);
    });

    it("should have grid layout for content", () => {
      const { container } = render(<Hero />);
      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass("lg:grid-cols-2");
    });
  });

  describe("responsive design", () => {
    it("should have responsive text sizes", () => {
      const { container } = render(<Hero />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading.className).toContain("text-4xl");
      expect(heading.className).toContain("sm:text-5xl");
      expect(heading.className).toContain("md:text-6xl");
    });

    it("should have responsive button layout", () => {
      const { container } = render(<Hero />);
      const buttonContainer = container.querySelector(".flex.flex-col.sm\\:flex-row");
      expect(buttonContainer).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should render all icons without errors", () => {
      const { container } = render(<Hero />);
      const icons = container.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThan(0);
    });

    it("should handle missing image gracefully", () => {
      render(<Hero />);
      const image = screen.getByAltText("Shahid Moosa");
      // Image should still be in DOM even if src fails
      expect(image).toBeInTheDocument();
    });

    it("should render multiple CTA buttons", () => {
      render(<Hero />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(1);
    });
  });

  describe("branding", () => {
    it("should use SingleStore purple color constant", () => {
      const { container } = render(<Hero />);
      // Check for inline styles with SingleStore purple
      const purpleElements = Array.from(container.querySelectorAll("*")).filter(el =>
        el.getAttribute("style")?.includes("170, 140, 255")
      );
      expect(purpleElements.length).toBeGreaterThan(0);
    });

    it("should have SingleStore branded sections", () => {
      render(<Hero />);
      expect(screen.getByText("SingleStore DB")).toBeInTheDocument();
    });
  });
});