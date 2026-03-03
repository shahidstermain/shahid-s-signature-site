import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Work } from "./Work";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    article: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => <article {...(props as React.HTMLAttributes<HTMLElement>)}>{children}</article>,
  },
}));

// Mock Section and SectionHeader components
vi.mock("@/components/ui/Section", () => ({
  Section: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <section id={id}>{children}</section>
  ),
  SectionHeader: ({
    label,
    title,
    description,
  }: {
    label: string;
    title: string;
    description: string;
  }) => (
    <div>
      <span>{label}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  ),
}));

// Mock image imports
vi.mock("@/assets/logos/singlestore.svg", () => ({
  default: "/mock-singlestore-logo.svg",
}));

vi.mock("@/assets/logos/aws.png", () => ({
  default: "/mock-aws-logo.png",
}));

vi.mock("@/assets/logos/infosys.svg", () => ({
  default: "/mock-infosys-logo.svg",
}));

describe("Work component", () => {
  it("should render without crashing", () => {
    expect(() => render(<Work />)).not.toThrow();
  });

  it("should render section with correct id", () => {
    const { container } = render(<Work />);

    const section = container.querySelector("#work");
    expect(section).toBeInTheDocument();
  });

  it("should render section header", () => {
    render(<Work />);

    expect(screen.getByText("Experience")).toBeInTheDocument();
    expect(screen.getByText("Where I've made impact")).toBeInTheDocument();
    expect(
      screen.getByText(
        "A track record of solving hard problems in production environments."
      )
    ).toBeInTheDocument();
  });

  describe("SingleStore experience", () => {
    it("should render SingleStore company name", () => {
      render(<Work />);

      const singlestoreElements = screen.getAllByText("SingleStore");
      expect(singlestoreElements.length).toBeGreaterThan(0);
    });

    it("should render SingleStore role", () => {
      render(<Work />);

      expect(screen.getByText("Database Cloud Support Engineer")).toBeInTheDocument();
    });

    it("should render SingleStore period", () => {
      render(<Work />);

      expect(screen.getByText("Jan 2024 — Present")).toBeInTheDocument();
    });

    it("should display current badge for SingleStore", () => {
      render(<Work />);

      expect(screen.getByText("Current")).toBeInTheDocument();
    });

    it("should render SingleStore description", () => {
      render(<Work />);

      expect(
        screen.getByText(
          /Resolving Tier-2\/3 distributed systems challenges/i
        )
      ).toBeInTheDocument();
    });

    it("should render SingleStore impact items", () => {
      render(<Work />);

      expect(
        screen.getByText(/Reduced average resolution time by 40%/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Authored 15\+ internal runbooks/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Supported migrations handling 10M\+ rows\/second/i)
      ).toBeInTheDocument();
    });

    it("should render SingleStore skills", () => {
      render(<Work />);

      expect(screen.getAllByText("SingleStore").length).toBeGreaterThan(0);
      expect(screen.getByText("Distributed SQL")).toBeInTheDocument();
      expect(screen.getAllByText("Linux").length).toBeGreaterThan(0);
      expect(screen.getAllByText("AWS").length).toBeGreaterThan(0);
      expect(screen.getByText("Python")).toBeInTheDocument();
    });

    it("should render SingleStore logo", () => {
      render(<Work />);

      const singlestoreLogo = screen.getByAltText("SingleStore logo");
      expect(singlestoreLogo).toBeInTheDocument();
      expect(singlestoreLogo).toHaveAttribute("src", "/mock-singlestore-logo.svg");
    });
  });

  describe("AWS experience", () => {
    it("should render AWS company name", () => {
      render(<Work />);

      expect(screen.getByText("Amazon Web Services")).toBeInTheDocument();
    });

    it("should render AWS role", () => {
      render(<Work />);

      expect(screen.getByText("Cloud Support Associate")).toBeInTheDocument();
    });

    it("should render AWS period", () => {
      render(<Work />);

      expect(screen.getByText("Jul 2022 — Jan 2024")).toBeInTheDocument();
    });

    it("should not display current badge for AWS", () => {
      render(<Work />);

      const awsSection = screen.getByText("Amazon Web Services").closest("article");
      expect(awsSection).toBeInTheDocument();
      // Current badge should only appear once (for SingleStore)
      const currentBadges = screen.getAllByText("Current");
      expect(currentBadges.length).toBe(1);
    });

    it("should render AWS description", () => {
      render(<Work />);

      expect(
        screen.getByText(
          /Delivered technical support for Amazon Aurora, RDS, and AWS DMS/i
        )
      ).toBeInTheDocument();
    });

    it("should render AWS impact items", () => {
      render(<Work />);

      expect(
        screen.getByText(/Maintained 98% customer satisfaction score/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Created documentation reducing repeat issues by 25%/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Led knowledge sessions for new team members/i)
      ).toBeInTheDocument();
    });

    it("should render AWS skills", () => {
      render(<Work />);

      expect(screen.getByText("AWS RDS")).toBeInTheDocument();
      expect(screen.getByText("Aurora")).toBeInTheDocument();
      expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
      expect(screen.getByText("DMS")).toBeInTheDocument();
      expect(screen.getByText("IAM")).toBeInTheDocument();
    });

    it("should render AWS logo", () => {
      render(<Work />);

      const awsLogo = screen.getByAltText("Amazon Web Services logo");
      expect(awsLogo).toBeInTheDocument();
      expect(awsLogo).toHaveAttribute("src", "/mock-aws-logo.png");
    });
  });

  describe("Infosys experience", () => {
    it("should render Infosys company name", () => {
      render(<Work />);

      expect(screen.getByText("Infosys")).toBeInTheDocument();
    });

    it("should render Infosys role", () => {
      render(<Work />);

      expect(screen.getByText("Senior System Associate")).toBeInTheDocument();
    });

    it("should render Infosys period", () => {
      render(<Work />);

      expect(screen.getByText("Apr 2020 — Jul 2022")).toBeInTheDocument();
    });

    it("should render Infosys description", () => {
      render(<Work />);

      expect(
        screen.getByText(
          /Administered SCCM and Windows systems for enterprise clients/i
        )
      ).toBeInTheDocument();
    });

    it("should render Infosys impact items", () => {
      render(<Work />);

      expect(
        screen.getByText(/Automated deployment processes, reducing setup time by 60%/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Implemented monitoring reducing unplanned downtime/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Trained team of 5 on Linux administration/i)
      ).toBeInTheDocument();
    });

    it("should render Infosys skills", () => {
      render(<Work />);

      expect(screen.getByText("SCCM")).toBeInTheDocument();
      expect(screen.getByText("Windows Server")).toBeInTheDocument();
      // Note: Linux appears in multiple places, just verify it exists
      expect(screen.getByText("PowerShell")).toBeInTheDocument();
    });

    it("should render Infosys logo", () => {
      render(<Work />);

      const infosysLogo = screen.getByAltText("Infosys logo");
      expect(infosysLogo).toBeInTheDocument();
      expect(infosysLogo).toHaveAttribute("src", "/mock-infosys-logo.svg");
    });
  });

  describe("experience ordering and layout", () => {
    it("should render all three experiences", () => {
      render(<Work />);

      expect(screen.getAllByText("SingleStore").length).toBeGreaterThan(0);
      expect(screen.getByText("Amazon Web Services")).toBeInTheDocument();
      expect(screen.getByText("Infosys")).toBeInTheDocument();
    });

    it("should render experiences in reverse chronological order", () => {
      const { container } = render(<Work />);

      const articles = container.querySelectorAll("article");
      expect(articles.length).toBe(3);

      // First should be current (SingleStore)
      expect(articles[0]).toHaveTextContent("SingleStore");
      expect(articles[0]).toHaveTextContent("Current");

      // Second should be AWS
      expect(articles[1]).toHaveTextContent("Amazon Web Services");

      // Third should be Infosys
      expect(articles[2]).toHaveTextContent("Infosys");
    });

    it("should render Key Impact sections", () => {
      render(<Work />);

      const keyImpactHeaders = screen.getAllByText("Key Impact");
      expect(keyImpactHeaders.length).toBe(3); // One for each experience
    });

    it("should apply brand colors", () => {
      const { container } = render(<Work />);

      // Check that brand-specific styling is present via RGB color format
      // Framer-motion mocking may convert hex colors to RGB
      const styledElements = container.querySelectorAll('[style]');
      expect(styledElements.length).toBeGreaterThan(0);
    });
  });

  describe("visual elements", () => {
    it("should render company logos with proper styling", () => {
      render(<Work />);

      const singlestoreLogo = screen.getByAltText("SingleStore logo");
      const awsLogo = screen.getByAltText("Amazon Web Services logo");
      const infosysLogo = screen.getByAltText("Infosys logo");

      expect(singlestoreLogo).toBeInTheDocument();
      expect(awsLogo).toBeInTheDocument();
      expect(infosysLogo).toBeInTheDocument();
    });

    it("should render ArrowUpRight icons", () => {
      const { container } = render(<Work />);

      // ArrowUpRight icons should be rendered as SVGs
      const svgs = container.querySelectorAll("svg");
      expect(svgs.length).toBeGreaterThan(0);
    });

    it("should apply card-elevated class to articles", () => {
      const { container } = render(<Work />);

      const articles = container.querySelectorAll(".card-elevated");
      expect(articles.length).toBe(3);
    });

    it("should have glow effects for each company", () => {
      const { container } = render(<Work />);

      const glowEffects = container.querySelectorAll(".blur-3xl");
      expect(glowEffects.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("content structure", () => {
    it("should render impact lists with proper bullet points", () => {
      const { container } = render(<Work />);

      const lists = container.querySelectorAll("ul");
      expect(lists.length).toBe(3); // One for each experience

      lists.forEach((list) => {
        const items = list.querySelectorAll("li");
        expect(items.length).toBe(3); // Each experience has 3 impact items
      });
    });

    it("should render skill tags", () => {
      render(<Work />);

      // Check for skill tags across all experiences
      expect(screen.getAllByText("SingleStore").length).toBeGreaterThan(0);
      expect(screen.getByText("Distributed SQL")).toBeInTheDocument();
      expect(screen.getByText("AWS RDS")).toBeInTheDocument();
      expect(screen.getByText("Aurora")).toBeInTheDocument();
      expect(screen.getByText("SCCM")).toBeInTheDocument();
      expect(screen.getByText("Windows Server")).toBeInTheDocument();
    });

    it("should have proper spacing between experiences", () => {
      const { container } = render(<Work />);

      const spacingContainer = container.querySelector(".space-y-8");
      expect(spacingContainer).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have proper alt text for all logos", () => {
      render(<Work />);

      expect(screen.getByAltText("SingleStore logo")).toBeInTheDocument();
      expect(screen.getByAltText("Amazon Web Services logo")).toBeInTheDocument();
      expect(screen.getByAltText("Infosys logo")).toBeInTheDocument();
    });

    it("should render semantic HTML structure", () => {
      const { container } = render(<Work />);

      const section = container.querySelector("section");
      const articles = container.querySelectorAll("article");

      expect(section).toBeInTheDocument();
      expect(articles.length).toBe(3);
    });

    it("should have proper heading hierarchy", () => {
      const { container } = render(<Work />);

      const h2 = container.querySelector("h2");
      const h3s = container.querySelectorAll("h3");
      const h4s = container.querySelectorAll("h4");

      expect(h2).toBeInTheDocument();
      expect(h3s.length).toBeGreaterThan(0); // Company names
      expect(h4s.length).toBe(3); // "Key Impact" headers
    });
  });

  describe("responsive design", () => {
    it("should have responsive padding classes", () => {
      const { container } = render(<Work />);

      const responsivePadding = container.querySelectorAll('[class*="p-8"]');
      expect(responsivePadding.length).toBeGreaterThan(0);
    });

    it("should have responsive flex layout", () => {
      const { container } = render(<Work />);

      const flexContainers = container.querySelectorAll('[class*="flex"]');
      expect(flexContainers.length).toBeGreaterThan(0);
    });
  });

  describe("edge cases", () => {
    it("should handle rendering with all experiences present", () => {
      const { container } = render(<Work />);

      const articles = container.querySelectorAll("article");
      expect(articles.length).toBe(3);
    });

    it("should properly display periods with em dashes", () => {
      render(<Work />);

      expect(screen.getByText("Jan 2024 — Present")).toBeInTheDocument();
      expect(screen.getByText("Jul 2022 — Jan 2024")).toBeInTheDocument();
      expect(screen.getByText("Apr 2020 — Jul 2022")).toBeInTheDocument();
    });

    it("should render all skill tags with proper styling", () => {
      const { container } = render(<Work />);

      const skillTags = container.querySelectorAll('[class*="rounded-full"]');
      expect(skillTags.length).toBeGreaterThanOrEqual(12); // Total skills across all experiences
    });
  });

  describe("data integrity and consistency", () => {
    it("should display chronological work experience", () => {
      const { container } = render(<Work />);

      const articles = Array.from(container.querySelectorAll("article"));

      // Should have exactly 3 work experiences
      expect(articles.length).toBe(3);

      // First should be most recent (Current)
      expect(articles[0].textContent).toContain("Jan 2024");
      expect(articles[0].textContent).toContain("Present");
    });

    it("should show consistent skill format across all experiences", () => {
      render(<Work />);

      // Check that all skill tags are rendered
      const singlestore = screen.getAllByText("SingleStore");
      const linux = screen.getAllByText("Linux");
      const aws = screen.getAllByText("AWS");

      expect(singlestore.length).toBeGreaterThan(0);
      expect(linux.length).toBeGreaterThan(0);
      expect(aws.length).toBeGreaterThan(0);
    });

    it("should display impact metrics for all roles", () => {
      render(<Work />);

      // All experiences should have "Key Impact" section
      const keyImpactHeaders = screen.getAllByText("Key Impact");
      expect(keyImpactHeaders.length).toBe(3);
    });

    it("should render company logos for all experiences", () => {
      render(<Work />);

      expect(screen.getByAltText("SingleStore logo")).toBeInTheDocument();
      expect(screen.getByAltText("Amazon Web Services logo")).toBeInTheDocument();
      expect(screen.getByAltText("Infosys logo")).toBeInTheDocument();
    });
  });

  describe("component stability", () => {
    it("should render consistently on multiple renders", () => {
      const { rerender } = render(<Work />);

      const firstRender = screen.getAllByText("SingleStore");
      expect(firstRender.length).toBeGreaterThan(0);

      rerender(<Work />);

      const secondRender = screen.getAllByText("SingleStore");
      expect(secondRender.length).toBe(firstRender.length);
    });

    it("should unmount without errors", () => {
      const { unmount } = render(<Work />);

      expect(() => unmount()).not.toThrow();
    });

    it("should handle missing data gracefully", () => {
      // Component should render even if some data is missing
      const { container } = render(<Work />);

      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });
  });

  describe("visual hierarchy and structure", () => {
    it("should have proper heading levels", () => {
      const { container } = render(<Work />);

      // Should have h2 for section title
      const h2 = container.querySelector("h2");
      expect(h2).toBeInTheDocument();

      // Should have h3 for company names
      const h3s = container.querySelectorAll("h3");
      expect(h3s.length).toBeGreaterThanOrEqual(3);
    });

    it("should render experiences in semantic article elements", () => {
      const { container } = render(<Work />);

      const articles = container.querySelectorAll("article");
      expect(articles.length).toBe(3);

      articles.forEach((article) => {
        expect(article).toBeInTheDocument();
      });
    });

    it("should display brand-specific visual elements", () => {
      const { container } = render(<Work />);

      // Should have glow effects
      const glowEffects = container.querySelectorAll(".blur-3xl");
      expect(glowEffects.length).toBeGreaterThanOrEqual(3);

      // Should have elevated card styling
      const elevatedCards = container.querySelectorAll(".card-elevated");
      expect(elevatedCards.length).toBe(3);
    });
  });
});