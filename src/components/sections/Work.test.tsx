import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Work } from "./Work";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
  },
}));

// Mock Section and SectionHeader components
vi.mock("@/components/ui/Section", () => ({
  Section: ({ children, id }: any) => <section id={id}>{children}</section>,
  SectionHeader: ({ label, title, description }: any) => (
    <header>
      <span>{label}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </header>
  ),
}));

describe("Work", () => {
  it("should render the work section", () => {
    render(<Work />);

    const section = document.querySelector('section#work');
    expect(section).toBeInTheDocument();
  });

  describe("section header", () => {
    it("should display section label", () => {
      render(<Work />);

      expect(screen.getByText("Experience")).toBeInTheDocument();
    });

    it("should display section title", () => {
      render(<Work />);

      expect(screen.getByText("Where I've made impact")).toBeInTheDocument();
    });

    it("should display section description", () => {
      render(<Work />);

      expect(
        screen.getByText(/A track record of solving hard problems/i)
      ).toBeInTheDocument();
    });
  });

  describe("experience entries", () => {
    it("should render all three experiences", () => {
      const { container } = render(<Work />);

      expect(container.textContent).toContain("SingleStore");
      expect(screen.getByText("Amazon Web Services")).toBeInTheDocument();
      expect(screen.getByText("Infosys")).toBeInTheDocument();
    });

    it("should render all job titles", () => {
      render(<Work />);

      expect(
        screen.getByText("Database Cloud Support Engineer")
      ).toBeInTheDocument();
      expect(screen.getByText("Cloud Support Associate")).toBeInTheDocument();
      expect(screen.getByText("Senior System Associate")).toBeInTheDocument();
    });

    it("should render all time periods", () => {
      render(<Work />);

      expect(screen.getByText("Jan 2024 — Present")).toBeInTheDocument();
      expect(screen.getByText("Jul 2022 — Jan 2024")).toBeInTheDocument();
      expect(screen.getByText("Apr 2020 — Jul 2022")).toBeInTheDocument();
    });
  });

  describe("SingleStore experience", () => {
    it("should display current badge", () => {
      render(<Work />);

      expect(screen.getByText("Current")).toBeInTheDocument();
    });

    it("should display job description", () => {
      render(<Work />);

      expect(
        screen.getByText(/Resolving Tier-2\/3 distributed systems challenges/i)
      ).toBeInTheDocument();
    });

    it("should display impact metrics", () => {
      render(<Work />);

      expect(
        screen.getByText(/Reduced average resolution time by 40%/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Authored 15\+ internal runbooks/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Supported migrations handling 10M\+ rows\/second/i)
      ).toBeInTheDocument();
    });

    it("should display skills", () => {
      const { container } = render(<Work />);

      expect(container.textContent).toContain("SingleStore");
      expect(screen.getByText("Distributed SQL")).toBeInTheDocument();
      const linuxElements = screen.getAllByText("Linux");
      expect(linuxElements.length).toBeGreaterThan(0);
      expect(screen.getByText("AWS")).toBeInTheDocument();
      expect(screen.getByText("Python")).toBeInTheDocument();
    });
  });

  describe("AWS experience", () => {
    it("should not display current badge", () => {
      render(<Work />);

      // There should only be one "Current" badge
      const currentBadges = screen.getAllByText("Current");
      expect(currentBadges).toHaveLength(1);
    });

    it("should display job description", () => {
      render(<Work />);

      expect(
        screen.getByText(/Delivered technical support for Amazon Aurora/i)
      ).toBeInTheDocument();
    });

    it("should display impact metrics", () => {
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

    it("should display skills", () => {
      render(<Work />);

      expect(screen.getByText("AWS RDS")).toBeInTheDocument();
      expect(screen.getByText("Aurora")).toBeInTheDocument();
      expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
      expect(screen.getByText("DMS")).toBeInTheDocument();
      expect(screen.getByText("IAM")).toBeInTheDocument();
    });
  });

  describe("Infosys experience", () => {
    it("should display job description", () => {
      render(<Work />);

      expect(
        screen.getByText(/Administered SCCM and Windows systems/i)
      ).toBeInTheDocument();
    });

    it("should display impact metrics", () => {
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

    it("should display skills", () => {
      render(<Work />);

      expect(screen.getByText("SCCM")).toBeInTheDocument();
      expect(screen.getByText("Windows Server")).toBeInTheDocument();
      // Note: Linux appears in both SingleStore and Infosys
      expect(screen.getByText("PowerShell")).toBeInTheDocument();
    });
  });

  describe("company logos", () => {
    it("should render SingleStore logo", () => {
      render(<Work />);

      const logo = screen.getByAltText("SingleStore logo");
      expect(logo).toBeInTheDocument();
    });

    it("should render AWS logo", () => {
      render(<Work />);

      const logo = screen.getByAltText("Amazon Web Services logo");
      expect(logo).toBeInTheDocument();
    });

    it("should render Infosys logo", () => {
      render(<Work />);

      const logo = screen.getByAltText("Infosys logo");
      expect(logo).toBeInTheDocument();
    });
  });

  describe("impact section structure", () => {
    it("should have Key Impact heading", () => {
      render(<Work />);

      const headings = screen.getAllByText(/Key Impact/i);
      // Should have 3 (one per experience)
      expect(headings.length).toBe(3);
    });

    it("should display all impact items as list items", () => {
      const { container } = render(<Work />);

      // Each experience has 3 impact items, total 9
      const impactItems = container.querySelectorAll("ul li");
      expect(impactItems.length).toBe(9);
    });
  });

  describe("skills badges", () => {
    it("should render all unique skills", () => {
      const { container } = render(<Work />);

      const expectedSkills = [
        "SingleStore",
        "Distributed SQL",
        "Linux",
        "AWS",
        "Python",
        "AWS RDS",
        "Aurora",
        "PostgreSQL",
        "DMS",
        "IAM",
        "SCCM",
        "Windows Server",
        "PowerShell",
      ];

      expectedSkills.forEach((skill) => {
        expect(container.textContent).toContain(skill);
      });
    });
  });

  describe("brand styling", () => {
    it("should render articles with proper structure", () => {
      const { container } = render(<Work />);

      const articles = container.querySelectorAll("article");
      expect(articles.length).toBe(3);
    });
  });

  describe("accessibility", () => {
    it("should use semantic article elements", () => {
      const { container } = render(<Work />);

      const articles = container.querySelectorAll("article");
      expect(articles.length).toBeGreaterThan(0);
    });

    it("should have proper heading for section", () => {
      render(<Work />);

      const heading = screen.getByRole("heading", { name: /Where I've made impact/i });
      expect(heading).toBeInTheDocument();
    });

    it("should have proper heading for companies", () => {
      render(<Work />);

      const singleStoreHeading = screen.getByRole("heading", { name: /SingleStore/i });
      expect(singleStoreHeading).toBeInTheDocument();
    });
  });

  describe("chronological order", () => {
    it("should display experiences in reverse chronological order", () => {
      const { container } = render(<Work />);

      const articles = Array.from(container.querySelectorAll("article"));
      const companies = articles.map((article) =>
        article.textContent?.match(/(SingleStore|Amazon Web Services|Infosys)/)?.[0]
      );

      expect(companies[0]).toBe("SingleStore");
      expect(companies[1]).toBe("Amazon Web Services");
      expect(companies[2]).toBe("Infosys");
    });
  });

  describe("edge cases and integration", () => {
    it("should render without errors", () => {
      expect(() => render(<Work />)).not.toThrow();
    });

    it("should handle all experience data correctly", () => {
      const { container } = render(<Work />);

      // Verify all key elements are present
      expect(container.textContent).toContain("SingleStore");
      expect(container.textContent).toContain("Amazon Web Services");
      expect(container.textContent).toContain("Infosys");
      expect(container.textContent).toContain("Database Cloud Support Engineer");
      expect(container.textContent).toContain("Jan 2024 — Present");
    });

    it("should maintain data consistency", () => {
      const { container } = render(<Work />);

      // Each experience should have:
      // - Company name
      // - Role
      // - Period
      // - Description
      // - 3 impact items
      // - Multiple skills

      const articles = container.querySelectorAll("article");
      const singleStoreSection = articles[0];
      expect(singleStoreSection).toBeInTheDocument();
      expect(singleStoreSection?.textContent).toContain("SingleStore");
      expect(singleStoreSection?.textContent).toContain("Database Cloud Support Engineer");
      expect(singleStoreSection?.textContent).toContain("Jan 2024 — Present");
    });
  });

  describe("responsive content", () => {
    it("should render all content regardless of viewport", () => {
      const { container } = render(<Work />);

      // All experiences should be visible
      expect(container.textContent).toContain("SingleStore");
      expect(screen.getByText("Amazon Web Services")).toBeInTheDocument();
      expect(screen.getByText("Infosys")).toBeInTheDocument();
    });
  });
});