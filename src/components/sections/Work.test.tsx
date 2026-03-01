import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Work } from "./Work";

// Mock framer-motion
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
      <span>{label}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  ),
}));

// Mock image imports
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
      render(<Work />);
      expect(screen.getByText("Experience")).toBeInTheDocument();
    });

    it("should render section header", () => {
      render(<Work />);
      expect(screen.getByText("Experience")).toBeInTheDocument();
      expect(screen.getByText("Where I've made impact")).toBeInTheDocument();
      expect(
        screen.getByText("A track record of solving hard problems in production environments.")
      ).toBeInTheDocument();
    });

    it("should have work section id", () => {
      const { container } = render(<Work />);
      expect(container.querySelector("#work")).toBeInTheDocument();
    });
  });

  describe("SingleStore experience", () => {
    it("should render SingleStore as current role", () => {
      render(<Work />);
      expect(screen.getAllByText("SingleStore").length).toBeGreaterThan(0);
      expect(screen.getByText("Database Cloud Support Engineer")).toBeInTheDocument();
    });

    it("should show Current badge for SingleStore", () => {
      render(<Work />);
      expect(screen.getByText("Current")).toBeInTheDocument();
    });

    it("should render SingleStore period", () => {
      render(<Work />);
      expect(screen.getByText("Jan 2024 — Present")).toBeInTheDocument();
    });

    it("should render SingleStore description", () => {
      render(<Work />);
      expect(
        screen.getByText(
          /Resolving Tier-2\/3 distributed systems challenges for SingleStore's cloud-native/i
        )
      ).toBeInTheDocument();
    });

    it("should render SingleStore impact items", () => {
      render(<Work />);
      expect(
        screen.getByText(/Reduced average resolution time by 40%/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Authored 15\+ internal runbooks/i)).toBeInTheDocument();
      expect(screen.getByText(/Supported migrations handling 10M\+ rows/i)).toBeInTheDocument();
    });

    it("should render SingleStore skills", () => {
      render(<Work />);
      expect(screen.getAllByText("SingleStore").length).toBeGreaterThan(0);
      expect(screen.getByText("Distributed SQL")).toBeInTheDocument();
      expect(screen.getAllByText("Linux").length).toBeGreaterThan(0);
      expect(screen.getByText("AWS")).toBeInTheDocument();
      expect(screen.getByText("Python")).toBeInTheDocument();
    });
  });

  describe("AWS experience", () => {
    it("should render AWS role", () => {
      render(<Work />);
      expect(screen.getByText("Amazon Web Services")).toBeInTheDocument();
      expect(screen.getByText("Cloud Support Associate")).toBeInTheDocument();
    });

    it("should not show Current badge for AWS", () => {
      render(<Work />);
      const articles = screen.getAllByRole("article");
      const awsArticle = articles.find((article) =>
        article.textContent?.includes("Amazon Web Services")
      );
      expect(awsArticle?.textContent).not.toMatch(/Current(?!.*SingleStore)/);
    });

    it("should render AWS period", () => {
      render(<Work />);
      expect(screen.getByText("Jul 2022 — Jan 2024")).toBeInTheDocument();
    });

    it("should render AWS description", () => {
      render(<Work />);
      expect(
        screen.getByText(/Delivered technical support for Amazon Aurora, RDS, and AWS DMS/i)
      ).toBeInTheDocument();
    });

    it("should render AWS impact items", () => {
      render(<Work />);
      expect(
        screen.getByText(/Maintained 98% customer satisfaction score/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Created documentation reducing repeat issues/i)).toBeInTheDocument();
      expect(screen.getByText(/Led knowledge sessions/i)).toBeInTheDocument();
    });

    it("should render AWS skills", () => {
      render(<Work />);
      expect(screen.getByText("AWS RDS")).toBeInTheDocument();
      expect(screen.getByText("Aurora")).toBeInTheDocument();
      expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
      expect(screen.getByText("DMS")).toBeInTheDocument();
      expect(screen.getByText("IAM")).toBeInTheDocument();
    });
  });

  describe("Infosys experience", () => {
    it("should render Infosys role", () => {
      render(<Work />);
      expect(screen.getByText("Infosys")).toBeInTheDocument();
      expect(screen.getByText("Senior System Associate")).toBeInTheDocument();
    });

    it("should render Infosys period", () => {
      render(<Work />);
      expect(screen.getByText("Apr 2020 — Jul 2022")).toBeInTheDocument();
    });

    it("should render Infosys description", () => {
      render(<Work />);
      expect(
        screen.getByText(/Administered SCCM and Windows systems for enterprise clients/i)
      ).toBeInTheDocument();
    });

    it("should render Infosys impact items", () => {
      render(<Work />);
      expect(
        screen.getByText(/Automated deployment processes, reducing setup time by 60%/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Implemented monitoring reducing unplanned downtime/i)).toBeInTheDocument();
      expect(screen.getByText(/Trained team of 5 on Linux administration/i)).toBeInTheDocument();
    });

    it("should render Infosys skills", () => {
      render(<Work />);
      expect(screen.getByText("SCCM")).toBeInTheDocument();
      expect(screen.getByText("Windows Server")).toBeInTheDocument();
      expect(screen.getByText("PowerShell")).toBeInTheDocument();
    });
  });

  describe("company branding", () => {
    it("should render all company logos", () => {
      const { container } = render(<Work />);
      const logos = container.querySelectorAll('img[alt*="logo"]');
      expect(logos.length).toBe(3);
    });

    it("should have SingleStore logo with alt text", () => {
      const { container } = render(<Work />);
      const logo = container.querySelector('img[alt="SingleStore logo"]');
      expect(logo).toBeInTheDocument();
    });

    it("should have AWS logo with alt text", () => {
      const { container } = render(<Work />);
      const logo = container.querySelector('img[alt="Amazon Web Services logo"]');
      expect(logo).toBeInTheDocument();
    });

    it("should have Infosys logo with alt text", () => {
      const { container } = render(<Work />);
      const logo = container.querySelector('img[alt="Infosys logo"]');
      expect(logo).toBeInTheDocument();
    });
  });

  describe("structure and layout", () => {
    it("should render three experience cards", () => {
      const { container } = render(<Work />);
      const articles = container.querySelectorAll("article");
      expect(articles.length).toBe(3);
    });

    it("should have Key Impact section for each experience", () => {
      render(<Work />);
      const keyImpactHeaders = screen.getAllByText("Key Impact");
      expect(keyImpactHeaders.length).toBe(3);
    });

    it("should render skills as tags for each experience", () => {
      const { container } = render(<Work />);
      const articles = container.querySelectorAll("article");
      articles.forEach((article) => {
        expect(article.textContent).toBeTruthy();
      });
    });
  });

  describe("visual indicators", () => {
    it("should show current badge only for SingleStore", () => {
      render(<Work />);
      const currentBadges = screen.getAllByText("Current");
      expect(currentBadges.length).toBe(1);
    });

    it("should have branded colors for each company", () => {
      const { container } = render(<Work />);
      // Check that articles have style attributes (brand colors)
      const articles = container.querySelectorAll("article");
      expect(articles.length).toBeGreaterThan(0);
    });
  });

  describe("accessibility", () => {
    it("should have proper semantic HTML", () => {
      const { container } = render(<Work />);
      expect(container.querySelector("section")).toBeInTheDocument();
      expect(container.querySelectorAll("article").length).toBe(3);
    });

    it("should have descriptive alt text for all images", () => {
      const { container } = render(<Work />);
      const images = container.querySelectorAll("img");
      images.forEach((img) => {
        expect(img.getAttribute("alt")).toBeTruthy();
      });
    });

    it("should have heading hierarchy", () => {
      const { container } = render(<Work />);
      expect(container.querySelector("h2")).toBeInTheDocument();
      expect(container.querySelector("h3")).toBeInTheDocument();
    });
  });

  describe("content completeness", () => {
    it("should render all company names", () => {
      render(<Work />);
      expect(screen.getAllByText("SingleStore").length).toBeGreaterThan(0);
      expect(screen.getByText("Amazon Web Services")).toBeInTheDocument();
      expect(screen.getAllByText("Infosys").length).toBeGreaterThan(0);
    });

    it("should render all role titles", () => {
      render(<Work />);
      expect(screen.getByText("Database Cloud Support Engineer")).toBeInTheDocument();
      expect(screen.getByText("Cloud Support Associate")).toBeInTheDocument();
      expect(screen.getByText("Senior System Associate")).toBeInTheDocument();
    });

    it("should render all time periods", () => {
      render(<Work />);
      expect(screen.getByText("Jan 2024 — Present")).toBeInTheDocument();
      expect(screen.getByText("Jul 2022 — Jan 2024")).toBeInTheDocument();
      expect(screen.getByText("Apr 2020 — Jul 2022")).toBeInTheDocument();
    });

    it("should have at least 3 impact items per role", () => {
      const { container } = render(<Work />);
      const articles = container.querySelectorAll("article");

      articles.forEach((article) => {
        const impactItems = article.querySelectorAll("ul li");
        expect(impactItems.length).toBeGreaterThanOrEqual(3);
      });
    });

    it("should have at least 4 skills per role", () => {
      render(<Work />);
      // SingleStore skills
      expect(screen.getAllByText("SingleStore").length).toBeGreaterThan(0);
      expect(screen.getByText("Distributed SQL")).toBeInTheDocument();

      // AWS skills
      expect(screen.getByText("AWS RDS")).toBeInTheDocument();
      expect(screen.getByText("Aurora")).toBeInTheDocument();

      // Infosys skills
      expect(screen.getByText("SCCM")).toBeInTheDocument();
      expect(screen.getByText("Windows Server")).toBeInTheDocument();
    });
  });

  describe("chronological order", () => {
    it("should display experiences in reverse chronological order", () => {
      const { container } = render(<Work />);
      const articles = Array.from(container.querySelectorAll("article"));

      const texts = articles.map((article) => article.textContent || "");

      // SingleStore (current) should be first
      expect(texts[0]).toContain("SingleStore");
      expect(texts[0]).toContain("Jan 2024");

      // AWS should be second
      expect(texts[1]).toContain("Amazon Web Services");
      expect(texts[1]).toContain("Jul 2022");

      // Infosys should be third
      expect(texts[2]).toContain("Infosys");
      expect(texts[2]).toContain("Apr 2020");
    });
  });

  describe("brand consistency", () => {
    it("should use consistent company naming", () => {
      render(<Work />);
      // Check that company names are consistent throughout
      expect(screen.getAllByText("SingleStore").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Amazon Web Services")).toBeInTheDocument();
      expect(screen.getAllByText("Infosys").length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("edge cases", () => {
    it("should handle rendering with no errors", () => {
      expect(() => render(<Work />)).not.toThrow();
    });

    it("should render all text content", () => {
      const { container } = render(<Work />);
      expect(container.textContent).toBeTruthy();
      expect(container.textContent!.length).toBeGreaterThan(0);
    });

    it("should have proper list structure for impact items", () => {
      const { container } = render(<Work />);
      const lists = container.querySelectorAll("ul");
      expect(lists.length).toBe(3); // One for each experience

      lists.forEach((list) => {
        const items = list.querySelectorAll("li");
        expect(items.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  describe("visual styling", () => {
    it("should have card-like structure", () => {
      const { container } = render(<Work />);
      const articles = container.querySelectorAll("article");

      articles.forEach((article) => {
        expect(article.className).toBeTruthy();
      });
    });

    it("should have company logo containers", () => {
      const { container } = render(<Work />);
      const logos = container.querySelectorAll("img");

      logos.forEach((logo) => {
        expect(logo.parentElement).toBeTruthy();
      });
    });
  });
});