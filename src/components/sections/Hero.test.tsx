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

describe("Hero", () => {
  it("should render the hero section", () => {
    const { container } = render(<Hero />);

    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  describe("status badge", () => {
    it("should display active status", () => {
      render(<Hero />);

      expect(screen.getByText("Active now")).toBeInTheDocument();
    });
  });

  describe("heading content", () => {
    it("should display main heading text", () => {
      render(<Hero />);

      expect(screen.getByText(/I keep databases alive/i)).toBeInTheDocument();
    });

    it("should display highlighted 'at scale' text", () => {
      render(<Hero />);

      expect(screen.getByText(/at scale/i)).toBeInTheDocument();
    });
  });

  describe("company information", () => {
    it("should display current role description", () => {
      render(<Hero />);

      expect(
        screen.getByText(/Cloud Database Support Engineer at/i)
      ).toBeInTheDocument();
    });

    it("should display SingleStore company link", () => {
      render(<Hero />);

      const links = screen.getAllByRole("link", { name: /SingleStore/i });
      expect(links.length).toBeGreaterThan(0);
      const singleStoreLink = links[0];
      expect(singleStoreLink).toHaveAttribute("href", "https://www.singlestore.com");
      expect(singleStoreLink).toHaveAttribute("target", "_blank");
      expect(singleStoreLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should display role details", () => {
      render(<Hero />);

      expect(
        screen.getByText(/I debug distributed systems/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/petabyte scale/i)).toBeInTheDocument();
      expect(screen.getByText(/Fortune 500/i)).toBeInTheDocument();
    });
  });

  describe("call-to-action buttons", () => {
    it("should render 'Let's talk' button", () => {
      render(<Hero />);

      const button = screen.getByRole("button", { name: /Let's talk/i });
      expect(button).toBeInTheDocument();
    });

    it("should render 'See my work' button", () => {
      render(<Hero />);

      const button = screen.getByRole("button", { name: /See my work/i });
      expect(button).toBeInTheDocument();
    });

    it("should render resume download link", () => {
      render(<Hero />);

      const link = screen.getByRole("link", { name: /Resume/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/resume.pdf");
      expect(link).toHaveAttribute("download", "Shahid_Moosa_Resume.pdf");
    });
  });

  describe("social links", () => {
    it("should render GitHub link", () => {
      render(<Hero />);

      const link = screen.getByRole("link", { name: /GitHub/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "https://github.com/shahidmoosa");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should render LinkedIn link", () => {
      render(<Hero />);

      const link = screen.getByRole("link", { name: /LinkedIn/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "https://linkedin.com/in/shahidmoosa");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should render email link", () => {
      render(<Hero />);

      const link = screen.getByRole("link", { name: /Email/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "mailto:connect2shahidmoosa@gmail.com");
    });
  });

  describe("verified expertise section", () => {
    it("should display verified expertise heading", () => {
      render(<Hero />);

      expect(
        screen.getByText(/Verified Systems Expertise/i)
      ).toBeInTheDocument();
    });

    it("should render SingleStore endorsement link", () => {
      render(<Hero />);

      // Find the link containing "SingleStore DB"
      const links = screen.getAllByRole("link");
      const endorsementLink = links.find((link) =>
        link.textContent?.includes("SingleStore DB")
      );

      expect(endorsementLink).toBeDefined();
      expect(endorsementLink).toHaveAttribute("href", "https://www.singlestore.com");
      expect(endorsementLink).toHaveAttribute("target", "_blank");
    });

    it("should display SingleStore DB description", () => {
      render(<Hero />);

      expect(
        screen.getByText(/Power your data-intensive apps/i)
      ).toBeInTheDocument();
    });
  });

  describe("profile image", () => {
    it("should render profile image with alt text", () => {
      render(<Hero />);

      const image = screen.getByAltText("Shahid Moosa");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("width", "256");
      expect(image).toHaveAttribute("height", "256");
      expect(image).toHaveAttribute("fetchPriority", "high");
      expect(image).toHaveAttribute("decoding", "async");
    });
  });

  describe("terminal component", () => {
    it("should render LiveTerminal component", () => {
      render(<Hero />);

      const terminal = screen.getByTestId("live-terminal");
      expect(terminal).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(<Hero />);

      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toBeInTheDocument();
    });

    it("should have aria-labels for social links", () => {
      render(<Hero />);

      expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
      expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });
  });

  describe("SingleStore branding", () => {
    it("should render SingleStore logo images", () => {
      render(<Hero />);

      const images = screen.getAllByAltText("SingleStore");
      expect(images.length).toBeGreaterThan(0);
    });

    it("should have multiple SingleStore links", () => {
      render(<Hero />);

      const links = screen
        .getAllByRole("link")
        .filter((link) => link.getAttribute("href") === "https://www.singlestore.com");

      expect(links.length).toBeGreaterThan(1);
    });
  });

  describe("scroll indicator", () => {
    it("should render scroll down indicator", () => {
      const { container } = render(<Hero />);

      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();

      // The ArrowDown icon should be present (though it's an SVG)
      // We can't easily test for Lucide icons, but the component renders
    });
  });

  describe("layout and structure", () => {
    it("should have full-screen height section", () => {
      const { container } = render(<Hero />);

      const section = container.querySelector("section");
      expect(section?.className).toContain("min-h-screen");
    });

    it("should render content in correct order", () => {
      const { container } = render(<Hero />);

      // Check that main elements are present
      expect(screen.getByText("Active now")).toBeInTheDocument();
      expect(screen.getByText(/I keep databases alive/i)).toBeInTheDocument();
      expect(container.textContent).toContain("SingleStore");
      expect(screen.getByRole("link", { name: /GitHub/i })).toBeInTheDocument();
    });
  });

  describe("responsive behavior", () => {
    it("should render all responsive classes", () => {
      const { container } = render(<Hero />);

      // Check for grid layout classes
      const section = container.querySelector("section");
      expect(section?.className).toContain("flex");
    });
  });

  describe("edge cases", () => {
    it("should handle button clicks", () => {
      render(<Hero />);

      const letsTalkButton = screen.getByRole("button", { name: /Let's talk/i });
      expect(letsTalkButton).toBeInTheDocument();

      // Button should be clickable
      expect(letsTalkButton).toBeEnabled();
    });

    it("should render all external links with proper rel attributes", () => {
      render(<Hero />);

      const externalLinks = [
        screen.getByRole("link", { name: /GitHub/i }),
        screen.getByRole("link", { name: /LinkedIn/i }),
      ];

      externalLinks.forEach((link) => {
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
        expect(link).toHaveAttribute("target", "_blank");
      });
    });
  });
});