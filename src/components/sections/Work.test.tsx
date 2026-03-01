import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Work } from "./Work";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock Section components
vi.mock("@/components/ui/Section", () => ({
  Section: ({ children, id }: any) => <section id={id}>{children}</section>,
  SectionHeader: ({ label, title, description }: any) => (
    <div>
      {label && <span>{label}</span>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  ),
}));

describe("Work", () => {
  it("should render without crashing", () => {
    render(<Work />);
    expect(screen.getByText("Experience")).toBeInTheDocument();
  });

  it("should render section with work id", () => {
    const { container } = render(<Work />);
    const section = container.querySelector("#work");
    expect(section).toBeInTheDocument();
  });

  it("should display section header", () => {
    render(<Work />);
    expect(screen.getByText("Experience")).toBeInTheDocument();
    expect(screen.getByText("Where I've made impact")).toBeInTheDocument();
    expect(screen.getByText(/track record of solving hard problems/i)).toBeInTheDocument();
  });

  describe("SingleStore experience", () => {
    it("should display SingleStore company", () => {
      render(<Work />);
      expect(screen.getAllByText("SingleStore").length).toBeGreaterThan(0);
    });

    it("should display SingleStore role", () => {
      render(<Work />);
      expect(screen.getByText("Database Cloud Support Engineer")).toBeInTheDocument();
    });

    it("should display SingleStore period", () => {
      render(<Work />);
      expect(screen.getByText("Jan 2024 — Present")).toBeInTheDocument();
    });

    it("should display current badge for SingleStore", () => {
      render(<Work />);
      expect(screen.getByText("Current")).toBeInTheDocument();
    });

    it("should display SingleStore description", () => {
      render(<Work />);
      expect(screen.getByText(/Resolving Tier-2\/3 distributed systems challenges/i)).toBeInTheDocument();
    });

    it("should display SingleStore impact points", () => {
      render(<Work />);
      expect(screen.getByText(/Reduced average resolution time by 40%/i)).toBeInTheDocument();
      expect(screen.getByText(/Authored 15\+ internal runbooks/i)).toBeInTheDocument();
      expect(screen.getByText(/Supported migrations handling 10M\+ rows\/second/i)).toBeInTheDocument();
    });

    it("should display SingleStore skills", () => {
      render(<Work />);
      expect(screen.getAllByText("SingleStore").length).toBeGreaterThan(0);
      expect(screen.getByText("Distributed SQL")).toBeInTheDocument();
      expect(screen.getAllByText("Linux").length).toBeGreaterThan(0);
      expect(screen.getAllByText("AWS").length).toBeGreaterThan(0);
      expect(screen.getByText("Python")).toBeInTheDocument();
    });

    it("should display SingleStore logo", () => {
      const { container } = render(<Work />);
      const logos = container.querySelectorAll('img[alt="SingleStore logo"]');
      expect(logos.length).toBeGreaterThan(0);
    });
  });

  describe("AWS experience", () => {
    it("should display AWS company", () => {
      render(<Work />);
      expect(screen.getByText("Amazon Web Services")).toBeInTheDocument();
    });

    it("should display AWS role", () => {
      render(<Work />);
      expect(screen.getByText("Cloud Support Associate")).toBeInTheDocument();
    });

    it("should display AWS period", () => {
      render(<Work />);
      expect(screen.getByText("Jul 2022 — Jan 2024")).toBeInTheDocument();
    });

    it("should not display current badge for AWS", () => {
      render(<Work />);
      // Current badge should only appear once (for SingleStore)
      const currentBadges = screen.getAllByText("Current");
      expect(currentBadges.length).toBe(1);
    });

    it("should display AWS description", () => {
      render(<Work />);
      expect(screen.getByText(/Delivered technical support for Amazon Aurora/i)).toBeInTheDocument();
    });

    it("should display AWS impact points", () => {
      render(<Work />);
      expect(screen.getByText(/Maintained 98% customer satisfaction/i)).toBeInTheDocument();
      expect(screen.getByText(/Created documentation reducing repeat issues/i)).toBeInTheDocument();
      expect(screen.getByText(/Led knowledge sessions/i)).toBeInTheDocument();
    });

    it("should display AWS skills", () => {
      render(<Work />);
      expect(screen.getByText("AWS RDS")).toBeInTheDocument();
      expect(screen.getByText("Aurora")).toBeInTheDocument();
      expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
      expect(screen.getByText("DMS")).toBeInTheDocument();
      expect(screen.getByText("IAM")).toBeInTheDocument();
    });
  });

  describe("Infosys experience", () => {
    it("should display Infosys company", () => {
      render(<Work />);
      expect(screen.getByText("Infosys")).toBeInTheDocument();
    });

    it("should display Infosys role", () => {
      render(<Work />);
      expect(screen.getByText("Senior System Associate")).toBeInTheDocument();
    });

    it("should display Infosys period", () => {
      render(<Work />);
      expect(screen.getByText("Apr 2020 — Jul 2022")).toBeInTheDocument();
    });

    it("should display Infosys description", () => {
      render(<Work />);
      expect(screen.getByText(/Administered SCCM and Windows systems/i)).toBeInTheDocument();
    });

    it("should display Infosys impact points", () => {
      render(<Work />);
      expect(screen.getByText(/Automated deployment processes/i)).toBeInTheDocument();
      expect(screen.getByText(/Implemented monitoring reducing unplanned downtime/i)).toBeInTheDocument();
      expect(screen.getByText(/Trained team of 5/i)).toBeInTheDocument();
    });

    it("should display Infosys skills", () => {
      render(<Work />);
      expect(screen.getByText("SCCM")).toBeInTheDocument();
      expect(screen.getByText("Windows Server")).toBeInTheDocument();
      expect(screen.getByText("PowerShell")).toBeInTheDocument();
    });
  });

  describe("structure and layout", () => {
    it("should render all three experience cards", () => {
      const { container } = render(<Work />);
      const articles = container.querySelectorAll("article");
      expect(articles.length).toBe(3);
    });

    it("should display experiences in correct order", () => {
      const { container } = render(<Work />);
      const companies = Array.from(container.querySelectorAll("h3")).map(h3 => h3.textContent);

      expect(companies[0]).toContain("SingleStore");
      expect(companies[1]).toContain("Amazon Web Services");
      expect(companies[2]).toContain("Infosys");
    });

    it("should have Key Impact section for each experience", () => {
      render(<Work />);
      const keyImpactHeaders = screen.getAllByText("Key Impact");
      expect(keyImpactHeaders.length).toBe(3);
    });

    it("should display 3 impact points per experience", () => {
      const { container } = render(<Work />);
      const lists = container.querySelectorAll("ul");
      lists.forEach(list => {
        const items = list.querySelectorAll("li");
        expect(items.length).toBe(3);
      });
    });
  });

  describe("visual elements", () => {
    it("should display company logos", () => {
      const { container } = render(<Work />);
      const logos = container.querySelectorAll('img[alt$=" logo"]');
      expect(logos.length).toBe(3);
    });

    it("should have ArrowUpRight icon", () => {
      const { container } = render(<Work />);
      const arrowIcons = container.querySelectorAll(".lucide-arrow-up-right");
      expect(arrowIcons.length).toBeGreaterThan(0);
    });

    it("should have brand-colored elements", () => {
      const { container } = render(<Work />);
      // Check for inline styles with brand colors
      const coloredElements = Array.from(container.querySelectorAll("*")).filter(el => {
        const style = el.getAttribute("style");
        return style && (
          style.includes("170, 140, 255") || // SingleStore purple
          style.includes("255, 153, 0") || // AWS orange
          style.includes("0, 124, 195") // Infosys blue
        );
      });
      expect(coloredElements.length).toBeGreaterThan(0);
    });
  });

  describe("accessibility", () => {
    it("should use semantic article elements", () => {
      const { container } = render(<Work />);
      const articles = container.querySelectorAll("article");
      expect(articles.length).toBe(3);
    });

    it("should have proper heading structure", () => {
      render(<Work />);
      const sectionHeading = screen.getByText("Where I've made impact");
      expect(sectionHeading).toBeInTheDocument();
    });

    it("should have alt text on company logos", () => {
      const { container } = render(<Work />);
      const logos = container.querySelectorAll("img");
      logos.forEach(logo => {
        expect(logo).toHaveAttribute("alt");
        expect(logo.getAttribute("alt")).not.toBe("");
      });
    });
  });

  describe("responsive design", () => {
    it("should have responsive flex layouts", () => {
      const { container } = render(<Work />);
      const flexContainers = container.querySelectorAll(".flex");
      expect(flexContainers.length).toBeGreaterThan(0);
    });

    it("should have responsive grid layouts", () => {
      const { container } = render(<Work />);
      // Check for responsive classes
      const hasResponsiveClasses = Array.from(container.querySelectorAll("*")).some(el =>
        el.className.includes("md:") || el.className.includes("lg:")
      );
      expect(hasResponsiveClasses).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should render without errors when data is present", () => {
      expect(() => render(<Work />)).not.toThrow();
    });

    it("should handle missing images gracefully", () => {
      const { container } = render(<Work />);
      const images = container.querySelectorAll("img");
      expect(images.length).toBeGreaterThan(0);
      // Images should still render even if src fails to load
    });

    it("should render all skill tags", () => {
      const { container } = render(<Work />);
      const skillTags = container.querySelectorAll("span");
      // Should have multiple skill tags
      expect(skillTags.length).toBeGreaterThan(10);
    });
  });

  describe("branding", () => {
    it("should use correct brand colors for SingleStore", () => {
      const { container } = render(<Work />);
      const purpleElements = Array.from(container.querySelectorAll("*")).filter(el =>
        el.getAttribute("style")?.includes("170, 140, 255")
      );
      expect(purpleElements.length).toBeGreaterThan(0);
    });

    it("should use correct brand colors for AWS", () => {
      const { container } = render(<Work />);
      const orangeElements = Array.from(container.querySelectorAll("*")).filter(el =>
        el.getAttribute("style")?.includes("255, 153, 0")
      );
      expect(orangeElements.length).toBeGreaterThan(0);
    });

    it("should use correct brand colors for Infosys", () => {
      const { container } = render(<Work />);
      const blueElements = Array.from(container.querySelectorAll("*")).filter(el =>
        el.getAttribute("style")?.includes("0, 124, 195")
      );
      expect(blueElements.length).toBeGreaterThan(0);
    });
  });

  describe("content validation", () => {
    it("should display percentage and number metrics correctly", () => {
      render(<Work />);
      const text = document.body.textContent || "";
      expect(text).toContain("40%");
      expect(text).toContain("98%");
      expect(text).toContain("60%");
    });

    it("should display time periods correctly", () => {
      render(<Work />);
      expect(screen.getByText("Jan 2024 — Present")).toBeInTheDocument();
      expect(screen.getByText("Jul 2022 — Jan 2024")).toBeInTheDocument();
      expect(screen.getByText("Apr 2020 — Jul 2022")).toBeInTheDocument();
    });
  });
});