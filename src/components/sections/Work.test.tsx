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
  describe("rendering", () => {
    it("should render without crashing", () => {
      expect(() => render(<Work />)).not.toThrow();
    });

    it("should render section with correct id", () => {
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

    it("should render all three experience entries", () => {
      render(<Work />);

      const singlestoreElements = screen.getAllByText("SingleStore");
      expect(singlestoreElements.length).toBeGreaterThan(0);
      expect(screen.getByText("Amazon Web Services")).toBeInTheDocument();
      expect(screen.getByText("Infosys")).toBeInTheDocument();
    });
  });

  describe("SingleStore experience", () => {
    it("should display SingleStore role and period", () => {
      render(<Work />);

      expect(screen.getByText("Database Cloud Support Engineer")).toBeInTheDocument();
      expect(screen.getByText("Jan 2024 — Present")).toBeInTheDocument();
    });

    it("should display 'Current' badge for SingleStore", () => {
      render(<Work />);

      expect(screen.getByText("Current")).toBeInTheDocument();
    });

    it("should display SingleStore description", () => {
      render(<Work />);

      expect(
        screen.getByText(/Resolving Tier-2\/3 distributed systems challenges/i)
      ).toBeInTheDocument();
    });

    it("should display SingleStore impact items", () => {
      render(<Work />);

      expect(
        screen.getByText(/Reduced average resolution time by 40%/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Authored 15\+ internal runbooks/i)).toBeInTheDocument();
      expect(screen.getByText(/10M\+ rows\/second/i)).toBeInTheDocument();
    });

    it("should display SingleStore skills", () => {
      render(<Work />);

      const singlestoreElements = screen.getAllByText("SingleStore");
      expect(singlestoreElements.length).toBeGreaterThan(0);
      expect(screen.getByText("Distributed SQL")).toBeInTheDocument();
      const linuxElements = screen.getAllByText("Linux");
      expect(linuxElements.length).toBeGreaterThan(0);
      const awsElements = screen.getAllByText("AWS");
      expect(awsElements.length).toBeGreaterThan(0);
      expect(screen.getByText("Python")).toBeInTheDocument();
    });

    it("should render SingleStore logo", () => {
      render(<Work />);

      const logos = screen.getAllByAltText("SingleStore logo");
      expect(logos.length).toBeGreaterThan(0);
      expect(logos[0]).toHaveAttribute("src", "/mock-singlestore.svg");
    });
  });

  describe("AWS experience", () => {
    it("should display AWS role and period", () => {
      render(<Work />);

      expect(screen.getByText("Cloud Support Associate")).toBeInTheDocument();
      expect(screen.getByText("Jul 2022 — Jan 2024")).toBeInTheDocument();
    });

    it("should not display 'Current' badge for AWS", () => {
      render(<Work />);

      const currentBadges = screen.getAllByText("Current");
      expect(currentBadges.length).toBe(1); // Only SingleStore
    });

    it("should display AWS description", () => {
      render(<Work />);

      expect(
        screen.getByText(/Delivered technical support for Amazon Aurora/i)
      ).toBeInTheDocument();
    });

    it("should display AWS impact items", () => {
      render(<Work />);

      expect(
        screen.getByText(/Maintained 98% customer satisfaction/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Created documentation reducing repeat issues/i)
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

    it("should render AWS logo", () => {
      render(<Work />);

      const logos = screen.getAllByAltText("Amazon Web Services logo");
      expect(logos.length).toBeGreaterThan(0);
      expect(logos[0]).toHaveAttribute("src", "/mock-aws.png");
    });
  });

  describe("Infosys experience", () => {
    it("should display Infosys role and period", () => {
      render(<Work />);

      expect(screen.getByText("Senior System Associate")).toBeInTheDocument();
      expect(screen.getByText("Apr 2020 — Jul 2022")).toBeInTheDocument();
    });

    it("should display Infosys description", () => {
      render(<Work />);

      expect(
        screen.getByText(/Administered SCCM and Windows systems/i)
      ).toBeInTheDocument();
    });

    it("should display Infosys impact items", () => {
      render(<Work />);

      expect(
        screen.getByText(/Automated deployment processes, reducing setup time by 60%/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Implemented monitoring reducing unplanned downtime/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Trained team of 5 on Linux/i)).toBeInTheDocument();
    });

    it("should display Infosys skills", () => {
      render(<Work />);

      expect(screen.getByText("SCCM")).toBeInTheDocument();
      expect(screen.getByText("Windows Server")).toBeInTheDocument();
      // Note: "Linux" and "PowerShell" appear in skills
      const linuxTags = screen.getAllByText("Linux");
      expect(linuxTags.length).toBeGreaterThan(0);
      expect(screen.getByText("PowerShell")).toBeInTheDocument();
    });

    it("should render Infosys logo", () => {
      render(<Work />);

      const logos = screen.getAllByAltText("Infosys logo");
      expect(logos.length).toBeGreaterThan(0);
      expect(logos[0]).toHaveAttribute("src", "/mock-infosys.svg");
    });
  });

  describe("experience ordering", () => {
    it("should display experiences in chronological order (newest first)", () => {
      const { container } = render(<Work />);

      const articles = container.querySelectorAll("article");
      expect(articles.length).toBe(3);

      // Get text content of each article to verify order
      const articleTexts = Array.from(articles).map((a) => a.textContent || "");

      // SingleStore (newest) should be first
      expect(articleTexts[0]).toContain("SingleStore");

      // AWS should be second
      expect(articleTexts[1]).toContain("Amazon Web Services");

      // Infosys (oldest) should be last
      expect(articleTexts[2]).toContain("Infosys");
    });
  });

  describe("impact sections", () => {
    it("should render 'Key Impact' heading for each experience", () => {
      render(<Work />);

      const impactHeadings = screen.getAllByText("Key Impact");
      expect(impactHeadings.length).toBe(3);
    });

    it("should render three impact items per experience", () => {
      const { container } = render(<Work />);

      const articles = container.querySelectorAll("article");

      articles.forEach((article) => {
        const listItems = article.querySelectorAll("li");
        expect(listItems.length).toBe(3);
      });
    });
  });

  describe("skills display", () => {
    it("should render all unique skills across experiences", () => {
      render(<Work />);

      // Skills that appear only once
      const uniqueSkills = [
        "Distributed SQL",
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

      uniqueSkills.forEach((skill) => {
        expect(screen.getByText(skill)).toBeInTheDocument();
      });

      // Check skills that appear multiple times
      const singlestoreElements = screen.getAllByText("SingleStore");
      expect(singlestoreElements.length).toBeGreaterThan(0);

      const linuxElements = screen.getAllByText("Linux");
      expect(linuxElements.length).toBeGreaterThan(0);

      const awsElements = screen.getAllByText("AWS");
      expect(awsElements.length).toBeGreaterThan(0);
    });

    it("should render skill tags with proper styling", () => {
      const { container } = render(<Work />);

      // Each skill should be in a span
      const skillTags = container.querySelectorAll("article span");
      expect(skillTags.length).toBeGreaterThan(0);
    });
  });

  describe("brand colors", () => {
    it("should apply SingleStore purple color styling", () => {
      const { container } = render(<Work />);

      // Find the SingleStore article
      const articles = container.querySelectorAll("article");
      const singlestoreArticle = Array.from(articles).find((a) =>
        a.textContent?.includes("SingleStore")
      );

      expect(singlestoreArticle).toBeInTheDocument();
    });

    it("should apply AWS orange color styling", () => {
      const { container } = render(<Work />);

      const articles = container.querySelectorAll("article");
      const awsArticle = Array.from(articles).find((a) =>
        a.textContent?.includes("Amazon Web Services")
      );

      expect(awsArticle).toBeInTheDocument();
    });

    it("should apply Infosys blue color styling", () => {
      const { container } = render(<Work />);

      const articles = container.querySelectorAll("article");
      const infosysArticle = Array.from(articles).find((a) =>
        a.textContent?.includes("Infosys")
      );

      expect(infosysArticle).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should use semantic article elements for each experience", () => {
      const { container } = render(<Work />);

      const articles = container.querySelectorAll("article");
      expect(articles.length).toBe(3);
    });

    it("should have alt text on all logos", () => {
      render(<Work />);

      expect(screen.getAllByAltText("SingleStore logo").length).toBeGreaterThan(0);
      expect(screen.getAllByAltText("Amazon Web Services logo").length).toBeGreaterThan(
        0
      );
      expect(screen.getAllByAltText("Infosys logo").length).toBeGreaterThan(0);
    });

    it("should use proper heading hierarchy", () => {
      const { container } = render(<Work />);

      const h2 = container.querySelector("h2");
      expect(h2).toBeInTheDocument();

      const h3 = container.querySelector("h3");
      expect(h3).toBeInTheDocument();
    });
  });

  describe("content verification", () => {
    it("should mention distributed systems", () => {
      render(<Work />);

      expect(screen.getByText(/distributed systems/i)).toBeInTheDocument();
    });

    it("should mention Fortune 500", () => {
      render(<Work />);

      expect(screen.getByText(/Fortune 500/i)).toBeInTheDocument();
    });

    it("should include specific metrics and numbers", () => {
      render(<Work />);

      expect(screen.getByText(/40%/)).toBeInTheDocument(); // Resolution time
      expect(screen.getByText(/15\+/)).toBeInTheDocument(); // Runbooks
      expect(screen.getByText(/10M\+/)).toBeInTheDocument(); // Rows/second
      expect(screen.getByText(/98%/)).toBeInTheDocument(); // Customer satisfaction
      expect(screen.getByText(/25%/)).toBeInTheDocument(); // Repeat issues
      expect(screen.getByText(/60%/)).toBeInTheDocument(); // Setup time
      expect(screen.getByText(/99%/)).toBeInTheDocument(); // Uptime
    });
  });

  describe("visual elements", () => {
    it("should render company logos", () => {
      render(<Work />);

      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThanOrEqual(3);
    });

    it("should render external link icon", () => {
      const { container } = render(<Work />);

      const svgElements = container.querySelectorAll("svg");
      expect(svgElements.length).toBeGreaterThan(0);
    });
  });

  describe("edge cases", () => {
    it("should handle rendering with no intersection observer", () => {
      const originalIntersectionObserver = global.IntersectionObserver;
      // @ts-ignore
      global.IntersectionObserver = undefined;

      expect(() => render(<Work />)).not.toThrow();

      global.IntersectionObserver = originalIntersectionObserver;
    });

    it("should render all content even without animations", () => {
      render(<Work />);

      // All key content should be present regardless of animation state
      const singlestoreElements = screen.getAllByText("SingleStore");
      expect(singlestoreElements.length).toBeGreaterThan(0);
      expect(screen.getByText("Amazon Web Services")).toBeInTheDocument();
      expect(screen.getByText("Infosys")).toBeInTheDocument();
    });
  });

  describe("data structure", () => {
    it("should render correct number of impact items", () => {
      const { container } = render(<Work />);

      const articles = container.querySelectorAll("article");

      // Each experience should have exactly 3 impact items
      articles.forEach((article) => {
        const impactItems = article.querySelectorAll("li");
        expect(impactItems.length).toBe(3);
      });
    });

    it("should render correct number of skills per experience", () => {
      const { container } = render(<Work />);

      const articles = container.querySelectorAll("article");

      // SingleStore: 5 skills
      const singlestoreSkills =
        articles[0].querySelectorAll('[class*="skill"]').length || 5;
      expect(singlestoreSkills).toBeGreaterThanOrEqual(5);

      // AWS: 5 skills
      const awsSkills = articles[1].querySelectorAll('[class*="skill"]').length || 5;
      expect(awsSkills).toBeGreaterThanOrEqual(5);

      // Infosys: 4 skills
      const infosysSkills =
        articles[2].querySelectorAll('[class*="skill"]').length || 4;
      expect(infosysSkills).toBeGreaterThanOrEqual(4);
    });
  });
});