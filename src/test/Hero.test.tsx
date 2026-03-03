import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Hero } from "@/components/sections/Hero";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  },
}));

// Mock LiveTerminal
vi.mock("@/components/ui/LiveTerminal", () => ({
  LiveTerminal: () => <div data-testid="live-terminal">Terminal</div>,
}));

// Mock Button component
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, asChild, ...props }: any) => {
    if (asChild) {
      return <div {...props}>{children}</div>;
    }
    return (
      <button onClick={onClick} {...props}>
        {children}</button>
    );
  },
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  ArrowDown: () => <svg data-testid="arrow-down" />,
  Github: () => <svg data-testid="github-icon" />,
  Linkedin: () => <svg data-testid="linkedin-icon" />,
  Mail: () => <svg data-testid="mail-icon" />,
  FileDown: () => <svg data-testid="file-down-icon" />,
  Star: () => <svg data-testid="star-icon" />,
  ExternalLink: () => <svg data-testid="external-link-icon" />,
}));

// Mock image imports
vi.mock("@/assets/shahid-moosa.jpg", () => ({
  default: "/mock-shahid-photo.jpg",
}));

vi.mock("@/assets/logos/singlestore.svg", () => ({
  default: "/mock-singlestore-logo.svg",
}));

describe("Hero component - Additional Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Branding and visual elements", () => {
    it("should apply SingleStore purple brand color", () => {
      const { container } = render(<Hero />);

      const singlestoreElements = container.querySelectorAll('[style*="170, 140, 255"]');
      expect(singlestoreElements.length).toBeGreaterThan(0);
    });

    it("should render two ambient glow effects", () => {
      const { container } = render(<Hero />);

      const glowEffects = container.querySelectorAll(".animate-glow-pulse");
      expect(glowEffects.length).toBe(2);
    });

    it("should have glow ring around profile photo", () => {
      const { container } = render(<Hero />);

      const glowRing = container.querySelector(".blur-md.animate-pulse");
      expect(glowRing).toBeInTheDocument();
    });

    it("should render SingleStore branding with proper styling", () => {
      const { container } = render(<Hero />);

      const brandContainer = Array.from(container.querySelectorAll("a")).find(
        (el) => el.textContent?.includes("SingleStore") && el.href.includes("singlestore.com")
      );

      expect(brandContainer).toBeInTheDocument();
      expect(brandContainer).toHaveAttribute("target", "_blank");
      expect(brandContainer).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Interactive elements", () => {
    it("should handle 'Let's talk' button click", () => {
      const mockScrollIntoView = vi.fn();
      const originalGetElementById = document.getElementById;

      document.getElementById = vi.fn((id: string) => {
        if (id === "connect") {
          return { scrollIntoView: mockScrollIntoView } as any;
        }
        return null;
      });

      render(<Hero />);
      const letsTalkButton = screen.getByText("Let's talk");
      fireEvent.click(letsTalkButton);

      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });

      document.getElementById = originalGetElementById;
    });

    it("should handle 'See my work' button click", () => {
      const mockScrollIntoView = vi.fn();
      const originalGetElementById = document.getElementById;

      document.getElementById = vi.fn((id: string) => {
        if (id === "work") {
          return { scrollIntoView: mockScrollIntoView } as any;
        }
        return null;
      });

      render(<Hero />);
      const seeWorkButton = screen.getByText("See my work");
      fireEvent.click(seeWorkButton);

      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });

      document.getElementById = originalGetElementById;
    });

    it("should handle missing scroll target gracefully", () => {
      const originalGetElementById = document.getElementById;
      document.getElementById = vi.fn(() => null);

      render(<Hero />);

      const letsTalkButton = screen.getByText("Let's talk");
      expect(() => fireEvent.click(letsTalkButton)).not.toThrow();

      document.getElementById = originalGetElementById;
    });
  });

  describe("Responsive layout", () => {
    it("should have responsive grid layout", () => {
      const { container } = render(<Hero />);

      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("lg:grid-cols-2");
    });

    it("should have responsive text sizes", () => {
      const { container } = render(<Hero />);

      const heading = container.querySelector("h1");
      expect(heading).toHaveClass("text-4xl");
      expect(heading).toHaveClass("sm:text-5xl");
      expect(heading).toHaveClass("xl:text-6xl");
    });

    it("should have responsive photo sizes", () => {
      const { container } = render(<Hero />);

      const photoContainer = container.querySelector(".w-48");
      expect(photoContainer).toHaveClass("sm:w-56");
      expect(photoContainer).toHaveClass("md:w-64");
    });

    it("should stack CTAs vertically on mobile", () => {
      const { container } = render(<Hero />);

      const ctaContainer = Array.from(container.querySelectorAll(".flex")).find(
        (el) => el.className.includes("flex-col sm:flex-row")
      );

      expect(ctaContainer).toBeInTheDocument();
    });

    it("should reorder content on different screen sizes", () => {
      const { container } = render(<Hero />);

      const orderedElements = container.querySelectorAll(".order-1, .order-2");
      expect(orderedElements.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Accessibility and SEO", () => {
    it("should have proper image loading attributes for performance", () => {
      render(<Hero />);

      const photo = screen.getByAltText("Shahid Moosa");
      expect(photo).toHaveAttribute("fetchpriority", "high");
      expect(photo).toHaveAttribute("decoding", "async");
    });

    it("should use lazy loading for non-critical images", () => {
      const { container } = render(<Hero />);

      const logos = container.querySelectorAll('img[loading="lazy"]');
      expect(logos.length).toBeGreaterThan(0);
    });

    it("should have semantic section tag", () => {
      const { container } = render(<Hero />);

      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass("min-h-screen");
    });

    it("should have proper heading hierarchy", () => {
      const { container } = render(<Hero />);

      const h1 = container.querySelector("h1");
      const h4s = container.querySelectorAll("h4");

      expect(h1).toBeInTheDocument();
      expect(h4s.length).toBeGreaterThanOrEqual(1);
    });

    it("should have aria-labels on all social links", () => {
      render(<Hero />);

      expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
      expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });
  });

  describe("Animation and visual effects", () => {
    it("should have pulsing active indicator", () => {
      const { container } = render(<Hero />);

      const activeIndicators = container.querySelectorAll(".animate-pulse");
      expect(activeIndicators.length).toBeGreaterThanOrEqual(2);
    });

    it("should have scroll indicator", () => {
      render(<Hero />);

      const scrollIndicator = screen.getByTestId("arrow-down");
      expect(scrollIndicator).toBeInTheDocument();
    });

    it("should have proper z-index layering", () => {
      const { container } = render(<Hero />);

      const zIndexElement = container.querySelector(".z-10");
      expect(zIndexElement).toBeInTheDocument();
    });

    it("should have overflow hidden on section", () => {
      const { container } = render(<Hero />);

      const section = container.querySelector("section");
      expect(section).toHaveClass("overflow-hidden");
    });
  });

  describe("Content accuracy", () => {
    it("should display complete job description", () => {
      render(<Hero />);

      expect(
        screen.getByText(
          /I debug distributed systems, optimize queries at petabyte scale/
        )
      ).toBeInTheDocument();
    });

    it("should display main tagline correctly", () => {
      render(<Hero />);

      expect(screen.getByText("I keep databases alive")).toBeInTheDocument();
      expect(screen.getByText("at scale.")).toBeInTheDocument();
    });

    it("should have text-gradient class on scale text", () => {
      const { container } = render(<Hero />);

      const gradientText = container.querySelector(".text-gradient");
      expect(gradientText).toBeInTheDocument();
      expect(gradientText?.textContent).toBe("at scale.");
    });
  });

  describe("SingleStore endorsement card", () => {
    it("should render endorsement card", () => {
      render(<Hero />);

      expect(screen.getByText("Verified Systems Expertise")).toBeInTheDocument();
      expect(screen.getByText("SingleStore DB")).toBeInTheDocument();
    });

    it("should render star icon for verification", () => {
      render(<Hero />);

      const starIcon = screen.getByTestId("star-icon");
      expect(starIcon).toBeInTheDocument();
    });

    it("should render external link icon on endorsement card", () => {
      render(<Hero />);

      const externalLinkIcon = screen.getByTestId("external-link-icon");
      expect(externalLinkIcon).toBeInTheDocument();
    });

    it("should have proper description in endorsement card", () => {
      render(<Hero />);

      expect(
        screen.getByText(
          /Power your data-intensive apps with the only database/
        )
      ).toBeInTheDocument();
    });

    it("should link endorsement card to SingleStore website", () => {
      const { container } = render(<Hero />);

      const endorsementLink = Array.from(container.querySelectorAll("a"))
        .find((el) => el.textContent?.includes("SingleStore DB"));

      expect(endorsementLink).toHaveAttribute("href", "https://www.singlestore.com");
      expect(endorsementLink).toHaveAttribute("target", "_blank");
    });
  });

  describe("Visual styling details", () => {
    it("should have rounded full elements for badges", () => {
      const { container } = render(<Hero />);

      const roundedFull = container.querySelectorAll(".rounded-full");
      expect(roundedFull.length).toBeGreaterThan(0);
    });

    it("should have backdrop blur on status badge", () => {
      const { container } = render(<Hero />);

      const backdropBlur = container.querySelector(".backdrop-blur-sm");
      expect(backdropBlur).toBeInTheDocument();
    });

    it("should have border styling on profile photo", () => {
      const { container } = render(<Hero />);

      const photoBorder = container.querySelector(".border-2.border-primary\\/30");
      expect(photoBorder).toBeInTheDocument();
    });

    it("should have proper padding and spacing", () => {
      const { container } = render(<Hero />);

      const section = container.querySelector("section");
      expect(section).toHaveClass("py-20");
    });

    it("should have gap spacing in grid layout", () => {
      const { container } = render(<Hero />);

      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("gap-12");
      expect(grid).toHaveClass("lg:gap-16");
    });
  });

  describe("Profile photo", () => {
    it("should have proper image dimensions", () => {
      render(<Hero />);

      const photo = screen.getByAltText("Shahid Moosa");
      expect(photo).toHaveAttribute("width", "256");
      expect(photo).toHaveAttribute("height", "256");
    });

    it("should have object-cover class on photo", () => {
      render(<Hero />);

      const photo = screen.getByAltText("Shahid Moosa");
      expect(photo).toHaveClass("object-cover");
    });

    it("should have active indicator positioned correctly", () => {
      const { container } = render(<Hero />);

      const activeIndicator = Array.from(container.querySelectorAll(".bg-emerald-500")).find(
        (el) => el.className.includes("absolute") && el.className.includes("bottom-4")
      );

      expect(activeIndicator).toBeInTheDocument();
    });
  });

  describe("Social links validation", () => {
    it("should have correct GitHub URL", () => {
      render(<Hero />);

      const githubLink = screen.getByLabelText("GitHub");
      expect(githubLink).toHaveAttribute("href", "https://github.com/shahidmoosa");
    });

    it("should have correct LinkedIn URL", () => {
      render(<Hero />);

      const linkedinLink = screen.getByLabelText("LinkedIn");
      expect(linkedinLink).toHaveAttribute("href", "https://linkedin.com/in/shahidmoosa");
    });

    it("should have correct email link", () => {
      render(<Hero />);

      const emailLink = screen.getByLabelText("Email");
      expect(emailLink).toHaveAttribute("href", "mailto:connect2shahidmoosa@gmail.com");
    });

    it("should have hover effects on social links", () => {
      const { container } = render(<Hero />);

      const socialLinks = Array.from(container.querySelectorAll('a[aria-label]'));
      socialLinks.forEach((link) => {
        expect(link.className).toContain("hover:border-primary");
        expect(link.className).toContain("transition-colors");
      });
    });
  });

  describe("Button styling and behavior", () => {
    it("should have proper size classes on buttons", () => {
      render(<Hero />);

      const letsTalkButton = screen.getByText("Let's talk");
      expect(letsTalkButton.className).toContain("font-medium");
    });

    it("should render resume button with icon", () => {
      render(<Hero />);

      const fileDownIcon = screen.getByTestId("file-down-icon");
      expect(fileDownIcon).toBeInTheDocument();
    });

    it("should have proper download attributes on resume link", () => {
      const { container } = render(<Hero />);

      const resumeLink = Array.from(container.querySelectorAll("a")).find(
        (el) => el.getAttribute("download") === "Shahid_Moosa_Resume.pdf"
      );

      expect(resumeLink).toBeInTheDocument();
      expect(resumeLink).toHaveAttribute("href", "/resume.pdf");
    });
  });
});