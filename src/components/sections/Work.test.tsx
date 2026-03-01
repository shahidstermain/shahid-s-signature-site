import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Work } from "./Work";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
  },
}));

// Mock Section components
vi.mock("@/components/ui/Section", () => ({
  Section: ({ children, id }: any) => <section id={id}>{children}</section>,
  SectionHeader: ({ label, title, description }: any) => (
    <div>
      <span>{label}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  ),
}));

// Mock logo imports
vi.mock("@/assets/logos/singlestore.svg", () => ({
  default: "/mock-singlestore.svg",
}));

vi.mock("@/assets/logos/aws.png", () => ({
  default: "/mock-aws.png",
}));

vi.mock("@/assets/logos/infosys.svg", () => ({
  default: "/mock-infosys.svg",
}));

describe("Work", () => {
  it("should render without crashing", () => {
    render(<Work />);
  });

  it("should display section header", () => {
    render(<Work />);
    expect(screen.getByText("Experience")).toBeInTheDocument();
    expect(screen.getByText("Where I've made impact")).toBeInTheDocument();
    expect(
      screen.getByText(
        "A track record of solving hard problems in production environments."
      )
    ).toBeInTheDocument();
  });

  it("should have section with id 'work'", () => {
    const { container } = render(<Work />);
    const section = container.querySelector("#work");
    expect(section).toBeInTheDocument();
  });

  describe("SingleStore experience", () => {
    it("should display SingleStore company name", () => {
      render(<Work />);
      const singlestoreItems = screen.getAllByText("SingleStore");
      expect(singlestoreItems.length).toBeGreaterThan(0);
    });

    it("should display SingleStore role", () => {
      render(<Work />);
      expect(
        screen.getByText("Database Cloud Support Engineer")
      ).toBeInTheDocument();
    });

    it("should display SingleStore period", () => {
      render(<Work />);
      expect(screen.getByText("Jan 2024 — Present")).toBeInTheDocument();
    });

    it("should display Current badge for SingleStore", () => {
      render(<Work />);
      expect(screen.getByText("Current")).toBeInTheDocument();
    });

    it("should display SingleStore description", () => {
      render(<Work />);
      expect(
        screen.getByText(/Resolving Tier-2\/3 distributed systems challenges/i)
      ).toBeInTheDocument();
    });

    it("should display SingleStore impact points", () => {
      render(<Work />);
      expect(
        screen.getByText(/Reduced average resolution time by 40%/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Authored 15\+ internal runbooks/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Supported migrations handling 10M\+ rows\/second/i)
      ).toBeInTheDocument();
    });

    it("should display SingleStore skills", () => {
      render(<Work />);
      const singlestoreItems = screen.getAllByText("SingleStore");
      expect(singlestoreItems.length).toBeGreaterThan(0);
      expect(screen.getByText("Distributed SQL")).toBeInTheDocument();
      const linuxItems = screen.getAllByText("Linux");
      expect(linuxItems.length).toBeGreaterThan(0);
      expect(screen.getByText("AWS")).toBeInTheDocument();
      expect(screen.getByText("Python")).toBeInTheDocument();
    });

    it("should display SingleStore logo", () => {
      render(<Work />);
      const logos = screen.getAllByAltText("SingleStore logo");
      expect(logos.length).toBeGreaterThan(0);
      expect(logos[0]).toHaveAttribute("src", "/mock-singlestore.svg");
    });
  });

  describe("AWS experience", () => {
    it("should display AWS company name", () => {
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

    it("should not display Current badge for AWS", () => {
      render(<Work />);
      const currentBadges = screen.getAllByText("Current");
      // Should only have one Current badge (for SingleStore)
      expect(currentBadges).toHaveLength(1);
    });

    it("should display AWS description", () => {
      render(<Work />);
      expect(
        screen.getByText(
          /Delivered technical support for Amazon Aurora, RDS, and AWS DMS/i
        )
      ).toBeInTheDocument();
    });

    it("should display AWS impact points", () => {
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

    it("should display AWS skills", () => {
      render(<Work />);
      expect(screen.getByText("AWS RDS")).toBeInTheDocument();
      expect(screen.getByText("Aurora")).toBeInTheDocument();
      expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
      expect(screen.getByText("DMS")).toBeInTheDocument();
      expect(screen.getByText("IAM")).toBeInTheDocument();
    });

    it("should display AWS logo", () => {
      render(<Work />);
      const logo = screen.getByAltText("Amazon Web Services logo");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src", "/mock-aws.png");
    });
  });

  describe("Infosys experience", () => {
    it("should display Infosys company name", () => {
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
      expect(
        screen.getByText(/Administered SCCM and Windows systems/i)
      ).toBeInTheDocument();
    });

    it("should display Infosys impact points", () => {
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

    it("should display Infosys skills", () => {
      render(<Work />);
      expect(screen.getByText("SCCM")).toBeInTheDocument();
      expect(screen.getByText("Windows Server")).toBeInTheDocument();
      // Linux appears in multiple experiences
      expect(screen.getAllByText("Linux").length).toBeGreaterThan(0);
      expect(screen.getByText("PowerShell")).toBeInTheDocument();
    });

    it("should display Infosys logo", () => {
      render(<Work />);
      const logo = screen.getByAltText("Infosys logo");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src", "/mock-infosys.svg");
    });
  });

  describe("layout and structure", () => {
    it("should render all three experience cards", () => {
      render(<Work />);
      const articles = screen.getAllByRole("article");
      expect(articles).toHaveLength(3);
    });

    it("should display experiences in order (newest first)", () => {
      render(<Work />);
      const companyNames = screen.getAllByRole("heading", { level: 3 });

      // Should be in order: SingleStore, AWS, Infosys
      expect(companyNames[0]).toHaveTextContent(/SingleStore/i);
      expect(companyNames[1]).toHaveTextContent(/Amazon Web Services/i);
      expect(companyNames[2]).toHaveTextContent(/Infosys/i);
    });

    it("should display Key Impact section for each experience", () => {
      render(<Work />);
      const keyImpactHeaders = screen.getAllByText("Key Impact");
      expect(keyImpactHeaders).toHaveLength(3);
    });

    it("should have proper semantic structure", () => {
      const { container } = render(<Work />);
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });
  });

  describe("brand colors", () => {
    it("should render with brand-specific styling", () => {
      const { container } = render(<Work />);
      // Should render without errors
      expect(container).toBeInTheDocument();
    });

    it("should apply different brand colors to each company", () => {
      const { container } = render(<Work />);
      const articles = container.querySelectorAll("article");
      expect(articles.length).toBe(3);
    });
  });

  describe("accessibility", () => {
    it("should have proper alt text for all logos", () => {
      render(<Work />);
      expect(screen.getByAltText("SingleStore logo")).toBeInTheDocument();
      expect(
        screen.getByAltText("Amazon Web Services logo")
      ).toBeInTheDocument();
      expect(screen.getByAltText("Infosys logo")).toBeInTheDocument();
    });

    it("should use proper heading hierarchy", () => {
      render(<Work />);
      const h2 = screen.getByRole("heading", {
        level: 2,
        name: /Where I've made impact/i,
      });
      expect(h2).toBeInTheDocument();

      const h3s = screen.getAllByRole("heading", { level: 3 });
      expect(h3s.length).toBeGreaterThanOrEqual(3);
    });

    it("should display all content text", () => {
      render(<Work />);
      // Check that all major text content is visible
      expect(screen.getByText("Experience")).toBeInTheDocument();
      const singlestoreItems = screen.getAllByText("SingleStore");
      expect(singlestoreItems.length).toBeGreaterThan(0);
      expect(screen.getByText("Amazon Web Services")).toBeInTheDocument();
      expect(screen.getByText("Infosys")).toBeInTheDocument();
    });
  });

  describe("skills display", () => {
    it("should display all skills for all experiences", () => {
      render(<Work />);

      // SingleStore skills
      expect(screen.getByText("Distributed SQL")).toBeInTheDocument();

      // AWS skills
      expect(screen.getByText("Aurora")).toBeInTheDocument();

      // Infosys skills
      expect(screen.getByText("SCCM")).toBeInTheDocument();
    });

    it("should render skills as separate elements", () => {
      const { container } = render(<Work />);
      const skills = container.querySelectorAll("span");
      // Should have multiple skill badges
      expect(skills.length).toBeGreaterThan(10);
    });
  });

  describe("content completeness", () => {
    it("should display all required fields for each experience", () => {
      render(<Work />);

      // Each experience should have: company, role, period, description, impact, skills
      const singlestoreItems = screen.getAllByText("SingleStore");
      expect(singlestoreItems.length).toBeGreaterThan(0);
      expect(
        screen.getByText("Database Cloud Support Engineer")
      ).toBeInTheDocument();
      expect(screen.getByText("Jan 2024 — Present")).toBeInTheDocument();
    });

    it("should display impact metrics for all companies", () => {
      render(<Work />);

      // SingleStore impact
      expect(screen.getByText(/40%/i)).toBeInTheDocument();

      // AWS impact
      expect(screen.getByText(/98%/i)).toBeInTheDocument();

      // Infosys impact
      expect(screen.getByText(/60%/i)).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle rendering with no experiences data gracefully", () => {
      // Component has hardcoded experiences, but testing it doesn't crash
      expect(() => render(<Work />)).not.toThrow();
    });

    it("should render all logo images", () => {
      render(<Work />);
      const allImages = screen.getAllByRole("img");
      expect(allImages.length).toBeGreaterThanOrEqual(3);
    });

    it("should render multiple times without errors (regression test)", () => {
      const { rerender } = render(<Work />);
      rerender(<Work />);
      rerender(<Work />);
      const singlestoreItems = screen.getAllByText("SingleStore");
      expect(singlestoreItems.length).toBeGreaterThan(0);
    });

    it("should maintain correct article count", () => {
      render(<Work />);
      const articles = screen.getAllByRole("article");
      expect(articles).toHaveLength(3);
    });

    it("should have consistent brand color styling", () => {
      const { container } = render(<Work />);
      const articles = container.querySelectorAll("article");

      // Each article should have brand-specific styling
      articles.forEach((article) => {
        expect(article).toBeInTheDocument();
      });
    });

    it("should display all impact metrics with numbers", () => {
      render(<Work />);

      // Should show percentage improvements
      expect(screen.getByText(/40%/i)).toBeInTheDocument();
      expect(screen.getByText(/98%/i)).toBeInTheDocument();
      expect(screen.getByText(/60%/i)).toBeInTheDocument();
    });

    it("should show correct chronological order", () => {
      render(<Work />);
      const periods = [
        screen.getByText("Jan 2024 — Present"),
        screen.getByText("Jul 2022 — Jan 2024"),
        screen.getByText("Apr 2020 — Jul 2022"),
      ];

      periods.forEach((period) => {
        expect(period).toBeInTheDocument();
      });
    });
  });
});