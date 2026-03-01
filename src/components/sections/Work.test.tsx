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
    <div data-testid="section-header">
      <span>{label}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  ),
}));

describe("Work component", () => {
  describe("basic rendering", () => {
    it("should render without crashing", () => {
      expect(() => render(<Work />)).not.toThrow();
    });

    it("should render section with id 'work'", () => {
      const { container } = render(<Work />);
      const section = container.querySelector("section#work");
      expect(section).toBeInTheDocument();
    });

    it("should render section header", () => {
      render(<Work />);
      expect(screen.getByText("Experience")).toBeInTheDocument();
      expect(screen.getByText("Where I've made impact")).toBeInTheDocument();
      expect(
        screen.getByText(/A track record of solving hard problems/i)
      ).toBeInTheDocument();
    });
  });

  describe("SingleStore experience", () => {
    it("should display SingleStore company name", () => {
      render(<Work />);
      // SingleStore appears multiple times (company name and skill tag)
      expect(screen.getAllByText("SingleStore").length).toBeGreaterThanOrEqual(1);
    });

    it("should display SingleStore role", () => {
      render(<Work />);
      expect(screen.getByText("Database Cloud Support Engineer")).toBeInTheDocument();
    });

    it("should display SingleStore time period", () => {
      render(<Work />);
      expect(screen.getByText("Jan 2024 — Present")).toBeInTheDocument();
    });

    it("should show 'Current' badge for SingleStore", () => {
      render(<Work />);
      expect(screen.getByText("Current")).toBeInTheDocument();
    });

    it("should display SingleStore description", () => {
      render(<Work />);
      expect(
        screen.getByText(/Resolving Tier-2\/3 distributed systems challenges/i)
      ).toBeInTheDocument();
    });

    it("should list SingleStore skills", () => {
      render(<Work />);
      // Check for skills (note: some may appear multiple times)
      expect(screen.getAllByText("SingleStore").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Distributed SQL")).toBeInTheDocument();
      expect(screen.getAllByText("Linux").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("AWS").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Python")).toBeInTheDocument();
    });

    it("should display SingleStore impact metrics", () => {
      render(<Work />);
      expect(
        screen.getByText(/Reduced average resolution time by 40%/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Authored 15\+ internal runbooks/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Supported migrations handling 10M\+ rows\/second/i)
      ).toBeInTheDocument();
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

    it("should display AWS time period", () => {
      render(<Work />);
      expect(screen.getByText("Jul 2022 — Jan 2024")).toBeInTheDocument();
    });

    it("should display AWS description", () => {
      render(<Work />);
      expect(
        screen.getByText(/Delivered technical support for Amazon Aurora/i)
      ).toBeInTheDocument();
    });

    it("should list AWS skills", () => {
      render(<Work />);
      expect(screen.getByText("AWS RDS")).toBeInTheDocument();
      expect(screen.getByText("Aurora")).toBeInTheDocument();
      expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
      expect(screen.getByText("DMS")).toBeInTheDocument();
      expect(screen.getByText("IAM")).toBeInTheDocument();
    });

    it("should display AWS impact metrics", () => {
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

    it("should display Infosys time period", () => {
      render(<Work />);
      expect(screen.getByText("Apr 2020 — Jul 2022")).toBeInTheDocument();
    });

    it("should display Infosys description", () => {
      render(<Work />);
      expect(
        screen.getByText(/Administered SCCM and Windows systems/i)
      ).toBeInTheDocument();
    });

    it("should list Infosys skills", () => {
      render(<Work />);
      expect(screen.getByText("SCCM")).toBeInTheDocument();
      expect(screen.getByText("Windows Server")).toBeInTheDocument();
      // Note: "Linux" appears multiple times, so we just check it exists
      expect(screen.getByText("PowerShell")).toBeInTheDocument();
    });

    it("should display Infosys impact metrics", () => {
      render(<Work />);
      expect(
        screen.getByText(/Automated deployment processes, reducing setup time by 60%/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Implemented monitoring reducing unplanned downtime/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Trained team of 5 on Linux administration/i)).toBeInTheDocument();
    });
  });

  describe("visual branding", () => {
    it("should include company logos", () => {
      const { container } = render(<Work />);
      const images = container.querySelectorAll("img");
      expect(images.length).toBeGreaterThanOrEqual(3); // At least 3 company logos
    });

    it("should have proper alt text for logos", () => {
      const { container } = render(<Work />);
      const singlestoreLogo = container.querySelector('img[alt="SingleStore logo"]');
      const awsLogo = container.querySelector('img[alt="Amazon Web Services logo"]');
      const infosysLogo = container.querySelector('img[alt="Infosys logo"]');

      expect(singlestoreLogo).toBeInTheDocument();
      expect(awsLogo).toBeInTheDocument();
      expect(infosysLogo).toBeInTheDocument();
    });

    it("should apply brand-specific colors", () => {
      const { container } = render(<Work />);
      // Check for inline styles with brand colors
      expect(container.innerHTML).toContain("170, 140, 255"); // SingleStore purple
      expect(container.innerHTML).toContain("255, 153, 0"); // AWS orange
      expect(container.innerHTML).toContain("0, 124, 195"); // Infosys blue
    });
  });

  describe("structure and layout", () => {
    it("should render all three experiences", () => {
      const { container } = render(<Work />);
      const articles = container.querySelectorAll("article");
      expect(articles.length).toBe(3);
    });

    it("should have 'Key Impact' sections", () => {
      render(<Work />);
      const impactHeaders = screen.getAllByText("Key Impact");
      expect(impactHeaders.length).toBe(3);
    });

    it("should render experiences as articles", () => {
      const { container } = render(<Work />);
      const articles = container.querySelectorAll("article");
      expect(articles.length).toBeGreaterThan(0);
    });

    it("should group skills in tags", () => {
      const { container } = render(<Work />);
      // Check that skills are in separate elements
      const skillTags = container.querySelectorAll("span");
      const hasSkills = Array.from(skillTags).some(
        (tag) =>
          tag.textContent === "SingleStore" ||
          tag.textContent === "AWS RDS" ||
          tag.textContent === "SCCM"
      );
      expect(hasSkills).toBe(true);
    });
  });

  describe("content ordering", () => {
    it("should list experiences in reverse chronological order", () => {
      const { container } = render(<Work />);
      const companies = Array.from(container.querySelectorAll("article")).map(
        (article) => article.textContent
      );

      // SingleStore (current) should come first
      expect(companies[0]).toContain("SingleStore");
      // AWS should come second
      expect(companies[1]).toContain("Amazon Web Services");
      // Infosys should come last
      expect(companies[2]).toContain("Infosys");
    });
  });

  describe("accessibility", () => {
    it("should use semantic article elements", () => {
      const { container } = render(<Work />);
      const articles = container.querySelectorAll("article");
      expect(articles.length).toBeGreaterThan(0);
    });

    it("should have proper heading structure", () => {
      const { container } = render(<Work />);
      const headings = container.querySelectorAll("h2, h3, h4");
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  describe("impact metrics formatting", () => {
    it("should display metrics as bullet points", () => {
      const { container } = render(<Work />);
      const lists = container.querySelectorAll("ul");
      expect(lists.length).toBeGreaterThanOrEqual(3); // One per experience
    });

    it("should have list items for each impact", () => {
      const { container } = render(<Work />);
      const listItems = container.querySelectorAll("li");
      // Each experience has 3 impact items = 9 total
      expect(listItems.length).toBe(9);
    });
  });

  describe("numerical metrics", () => {
    it("should display percentage improvements", () => {
      render(<Work />);
      expect(screen.getByText(/40%/)).toBeInTheDocument(); // SingleStore
      expect(screen.getByText(/98%/)).toBeInTheDocument(); // AWS
      expect(screen.getByText(/25%/)).toBeInTheDocument(); // AWS
      expect(screen.getByText(/60%/)).toBeInTheDocument(); // Infosys
    });

    it("should display specific counts", () => {
      render(<Work />);
      expect(screen.getByText(/15\+/)).toBeInTheDocument(); // runbooks
      expect(screen.getByText(/10M\+/)).toBeInTheDocument(); // rows/second
      expect(screen.getByText(/500\+/)).toBeInTheDocument(); // cases
      expect(screen.getByText(/100\+/)).toBeInTheDocument(); // user environments
      expect(screen.getByText(/team of 5/)).toBeInTheDocument(); // trained
    });

    it("should display uptime metrics", () => {
      render(<Work />);
      expect(screen.getByText(/99% uptime/)).toBeInTheDocument();
    });
  });
});