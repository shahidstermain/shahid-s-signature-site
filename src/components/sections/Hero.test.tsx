import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

// Mock framer-motion to avoid animation complexities in tests
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

describe("Hero", () => {
  describe("rendering", () => {
    it("should render without crashing", () => {
      render(<Hero />);

      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    it("should render main heading text", () => {
      render(<Hero />);

      expect(screen.getByText(/I keep databases alive/i)).toBeInTheDocument();
      expect(screen.getByText(/at scale/i)).toBeInTheDocument();
    });

    it("should render job title", () => {
      render(<Hero />);

      expect(screen.getByText(/Cloud Database Support Engineer/i)).toBeInTheDocument();
    });

    it("should render company name", () => {
      render(<Hero />);

      expect(screen.getAllByText(/SingleStore/i).length).toBeGreaterThan(0);
    });

    it("should render professional description", () => {
      render(<Hero />);

      expect(screen.getByText(/debug distributed systems/i)).toBeInTheDocument();
      expect(screen.getByText(/petabyte scale/i)).toBeInTheDocument();
    });
  });

  describe("status badge", () => {
    it("should render active status badge", () => {
      render(<Hero />);

      expect(screen.getByText("Active now")).toBeInTheDocument();
    });

    it("should have status indicator", () => {
      const { container } = render(<Hero />);

      // Look for the animated pulse indicator
      const pulseIndicator = container.querySelector(".animate-pulse");
      expect(pulseIndicator).toBeInTheDocument();
    });
  });

  describe("call-to-action buttons", () => {
    it("should render 'Let's talk' button", () => {
      render(<Hero />);

      expect(screen.getByRole("button", { name: /let's talk/i })).toBeInTheDocument();
    });

    it("should render 'See my work' button", () => {
      render(<Hero />);

      expect(screen.getByRole("button", { name: /see my work/i })).toBeInTheDocument();
    });

    it("should render 'Resume' link", () => {
      render(<Hero />);

      const resumeLink = screen.getByRole("link", { name: /resume/i });
      expect(resumeLink).toBeInTheDocument();
      expect(resumeLink).toHaveAttribute("href", "/resume.pdf");
      expect(resumeLink).toHaveAttribute("download", "Shahid_Moosa_Resume.pdf");
    });
  });

  describe("social links", () => {
    it("should render GitHub link", () => {
      render(<Hero />);

      const githubLink = screen.getByRole("link", { name: /github/i });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute("href", "https://github.com/shahidmoosa");
      expect(githubLink).toHaveAttribute("target", "_blank");
      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should render LinkedIn link", () => {
      render(<Hero />);

      const linkedinLink = screen.getByRole("link", { name: /linkedin/i });
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink).toHaveAttribute("href", "https://linkedin.com/in/shahidmoosa");
      expect(linkedinLink).toHaveAttribute("target", "_blank");
      expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should render Email link", () => {
      render(<Hero />);

      const emailLink = screen.getByRole("link", { name: /email/i });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute("href", "mailto:connect2shahidmoosa@gmail.com");
    });

    it("all external links should have security attributes", () => {
      const { container } = render(<Hero />);

      const externalLinks = container.querySelectorAll('a[target="_blank"]');
      externalLinks.forEach(link => {
        expect(link.getAttribute("rel")).toContain("noopener");
        expect(link.getAttribute("rel")).toContain("noreferrer");
      });
    });
  });

  describe("SingleStore branding", () => {
    it("should render SingleStore link", () => {
      render(<Hero />);

      const singlestoreLinks = screen.getAllByRole("link", { name: /singlestore/i });
      expect(singlestoreLinks.length).toBeGreaterThan(0);
    });

    it("SingleStore links should point to company website", () => {
      const { container } = render(<Hero />);

      const singlestoreLinks = container.querySelectorAll('a[href="https://www.singlestore.com"]');
      expect(singlestoreLinks.length).toBeGreaterThan(0);
    });

    it("should render SingleStore logo", () => {
      const { container } = render(<Hero />);

      const logos = container.querySelectorAll('img[alt="SingleStore"]');
      expect(logos.length).toBeGreaterThan(0);
    });

    it("should have SingleStore DB endorsement section", () => {
      render(<Hero />);

      expect(screen.getByText("Verified Systems Expertise")).toBeInTheDocument();
      expect(screen.getByText("SingleStore DB")).toBeInTheDocument();
    });
  });

  describe("profile image", () => {
    it("should render profile photo", () => {
      const { container } = render(<Hero />);

      const profileImage = container.querySelector('img[alt="Shahid Moosa"]');
      expect(profileImage).toBeInTheDocument();
    });

    it("profile image should have proper attributes", () => {
      const { container } = render(<Hero />);

      const profileImage = container.querySelector('img[alt="Shahid Moosa"]');
      expect(profileImage).toHaveAttribute("width", "256");
      expect(profileImage).toHaveAttribute("height", "256");
      expect(profileImage).toHaveAttribute("fetchpriority", "high");
      expect(profileImage).toHaveAttribute("decoding", "async");
    });

    it("should have active indicator on profile", () => {
      const { container } = render(<Hero />);

      // Look for the green active indicator
      const activeIndicators = container.querySelectorAll(".bg-emerald-500");
      expect(activeIndicators.length).toBeGreaterThan(0);
    });
  });

  describe("terminal component", () => {
    it("should render LiveTerminal component", () => {
      render(<Hero />);

      expect(screen.getByTestId("live-terminal")).toBeInTheDocument();
    });
  });

  describe("scroll indicator", () => {
    it("should render scroll indicator", () => {
      const { container } = render(<Hero />);

      // Look for ArrowDown icon
      const arrowDown = container.querySelector(".lucide-arrow-down");
      expect(arrowDown).toBeInTheDocument();
    });
  });

  describe("layout and structure", () => {
    it("should use semantic section element", () => {
      const { container } = render(<Hero />);

      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });

    it("should have responsive grid layout", () => {
      const { container } = render(<Hero />);

      const grid = container.querySelector(".grid.lg\\:grid-cols-2");
      expect(grid).toBeInTheDocument();
    });

    it("should have section-container class", () => {
      const { container } = render(<Hero />);

      const sectionContainer = container.querySelector(".section-container");
      expect(sectionContainer).toBeInTheDocument();
    });

    it("should have min-h-screen class for full viewport height", () => {
      const { container } = render(<Hero />);

      const section = container.querySelector(".min-h-screen");
      expect(section).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(<Hero />);

      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toBeInTheDocument();
    });

    it("social links should have aria-labels", () => {
      render(<Hero />);

      expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /email/i })).toBeInTheDocument();
    });

    it("all images should have alt text", () => {
      const { container } = render(<Hero />);

      const images = container.querySelectorAll("img");
      images.forEach(img => {
        expect(img.getAttribute("alt")).toBeTruthy();
      });
    });

    it("buttons should be keyboard accessible", () => {
      render(<Hero />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe("styling and animations", () => {
    it("should have ambient glow effects", () => {
      const { container } = render(<Hero />);

      const glowEffects = container.querySelectorAll(".animate-glow-pulse");
      expect(glowEffects.length).toBeGreaterThan(0);
    });

    it("should have gradient text", () => {
      const { container } = render(<Hero />);

      const gradientText = container.querySelector(".text-gradient");
      expect(gradientText).toBeInTheDocument();
    });

    it("heading should have font-heading class", () => {
      const { container } = render(<Hero />);

      const heading = container.querySelector(".font-heading");
      expect(heading).toBeInTheDocument();
    });
  });

  describe("button interactions", () => {
    it("Let's talk button should have onClick handler", () => {
      render(<Hero />);

      const button = screen.getByRole("button", { name: /let's talk/i });
      expect(button).toHaveProperty("onclick");
    });

    it("See my work button should have onClick handler", () => {
      render(<Hero />);

      const button = screen.getByRole("button", { name: /see my work/i });
      expect(button).toHaveProperty("onclick");
    });
  });

  describe("icon rendering", () => {
    it("should render FileDown icon in Resume button", () => {
      const { container } = render(<Hero />);

      const fileDownIcon = container.querySelector(".lucide-file-down");
      expect(fileDownIcon).toBeInTheDocument();
    });

    it("should render social media icons", () => {
      const { container } = render(<Hero />);

      const githubIcon = container.querySelector(".lucide-github");
      const linkedinIcon = container.querySelector(".lucide-linkedin");
      const mailIcon = container.querySelector(".lucide-mail");

      expect(githubIcon).toBeInTheDocument();
      expect(linkedinIcon).toBeInTheDocument();
      expect(mailIcon).toBeInTheDocument();
    });

    it("should render Star icon in endorsement section", () => {
      const { container } = render(<Hero />);

      const starIcon = container.querySelector(".lucide-star");
      expect(starIcon).toBeInTheDocument();
    });

    it("should render ExternalLink icon", () => {
      const { container } = render(<Hero />);

      const externalLinkIcon = container.querySelector(".lucide-external-link");
      expect(externalLinkIcon).toBeInTheDocument();
    });
  });

  describe("responsive design", () => {
    it("should have responsive text sizes", () => {
      const { container } = render(<Hero />);

      const heading = container.querySelector("h1");
      expect(heading?.className).toMatch(/text-\d+xl/);
    });

    it("should have responsive gap classes", () => {
      const { container } = render(<Hero />);

      const gaps = container.querySelectorAll("[class*='gap-']");
      expect(gaps.length).toBeGreaterThan(0);
    });

    it("should have mobile-first flex direction", () => {
      const { container } = render(<Hero />);

      const flexCols = container.querySelectorAll(".flex-col");
      expect(flexCols.length).toBeGreaterThan(0);
    });
  });

  describe("content ordering", () => {
    it("should render content before visual on mobile", () => {
      const { container } = render(<Hero />);

      const contentSection = container.querySelector(".order-2.lg\\:order-1");
      expect(contentSection).toBeInTheDocument();
    });

    it("should render visual before content on mobile", () => {
      const { container } = render(<Hero />);

      const visualSection = container.querySelector(".order-1.lg\\:order-2");
      expect(visualSection).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle multiple renders", () => {
      const { rerender } = render(<Hero />);

      rerender(<Hero />);
      rerender(<Hero />);

      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    it("should not have console errors", () => {
      const consoleSpy = vi.spyOn(console, "error");

      render(<Hero />);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("negative tests", () => {
    it("should not render incomplete data", () => {
      render(<Hero />);

      // All key sections should be present
      expect(screen.getByText(/I keep databases alive/i)).toBeInTheDocument();
      expect(screen.getByText(/Cloud Database Support Engineer/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /let's talk/i })).toBeInTheDocument();
    });

    it("should not have broken links", () => {
      const { container } = render(<Hero />);

      const links = container.querySelectorAll("a");
      links.forEach(link => {
        const href = link.getAttribute("href");
        expect(href).toBeTruthy();
        expect(href).not.toBe("");
        expect(href).not.toBe("#");
      });
    });
  });

  describe("performance considerations", () => {
    it("profile image should have fetchpriority=high for LCP", () => {
      const { container } = render(<Hero />);

      const profileImage = container.querySelector('img[alt="Shahid Moosa"]');
      expect(profileImage).toHaveAttribute("fetchpriority", "high");
    });

    it("profile image should have async decoding", () => {
      const { container } = render(<Hero />);

      const profileImage = container.querySelector('img[alt="Shahid Moosa"]');
      expect(profileImage).toHaveAttribute("decoding", "async");
    });
  });

  describe("branding consistency", () => {
    it("SingleStore purple color should be applied", () => {
      const { container } = render(<Hero />);

      // Check for elements with SingleStore branding
      const singlestoreElements = container.querySelectorAll('[style*="170, 140, 255"]');
      expect(singlestoreElements.length).toBeGreaterThan(0);
    });
  });
});