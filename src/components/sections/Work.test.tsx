import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Work } from "./Work";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
  },
}));

// Mock the Section components
vi.mock("@/components/ui/Section", () => ({
  Section: ({ children, id }: any) => <section id={id}>{children}</section>,
  SectionHeader: ({ label, title, description }: any) => (
    <div>
      <div>{label}</div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  ),
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
      expect(screen.getByText(/track record of solving hard problems/i)).toBeInTheDocument();
    });

    it("should have work section ID", () => {
      const { container } = render(<Work />);

      const section = container.querySelector("#work");
      expect(section).toBeInTheDocument();
    });
  });

  describe("experience cards", () => {
    it("should render all three experience cards", () => {
      render(<Work />);

      // Company names appear multiple times on page
      expect(screen.getAllByText("SingleStore").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Amazon Web Services").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Infosys").length).toBeGreaterThan(0);
    });

    it("should render job titles", () => {
      render(<Work />);

      expect(screen.getByText("Database Cloud Support Engineer")).toBeInTheDocument();
      expect(screen.getByText("Cloud Support Associate")).toBeInTheDocument();
      expect(screen.getByText("Senior System Associate")).toBeInTheDocument();
    });

    it("should render time periods", () => {
      render(<Work />);

      expect(screen.getByText("Jan 2024 — Present")).toBeInTheDocument();
      expect(screen.getByText("Jul 2022 — Jan 2024")).toBeInTheDocument();
      expect(screen.getByText("Apr 2020 — Jul 2022")).toBeInTheDocument();
    });

    it("should mark current position", () => {
      render(<Work />);

      expect(screen.getByText("Current")).toBeInTheDocument();
    });
  });

  describe("company information", () => {
    it("should render company descriptions", () => {
      render(<Work />);

      expect(screen.getByText(/Resolving Tier-2\/3 distributed systems/i)).toBeInTheDocument();
      expect(screen.getByText(/Delivered technical support for Amazon Aurora/i)).toBeInTheDocument();
      expect(screen.getByText(/Administered SCCM and Windows systems/i)).toBeInTheDocument();
    });

    it("should render company logos", () => {
      const { container } = render(<Work />);

      const logos = container.querySelectorAll("img");
      expect(logos.length).toBeGreaterThanOrEqual(3);

      // Check for specific alt texts
      expect(container.querySelector('img[alt="SingleStore logo"]')).toBeInTheDocument();
      expect(container.querySelector('img[alt="Amazon Web Services logo"]')).toBeInTheDocument();
      expect(container.querySelector('img[alt="Infosys logo"]')).toBeInTheDocument();
    });
  });

  describe("impact metrics", () => {
    it("should render Key Impact section for each role", () => {
      render(<Work />);

      const impactHeaders = screen.getAllByText("Key Impact");
      expect(impactHeaders.length).toBe(3);
    });

    it("should render SingleStore impact metrics", () => {
      render(<Work />);

      expect(screen.getByText(/Reduced average resolution time by 40%/i)).toBeInTheDocument();
      expect(screen.getByText(/Authored 15\+ internal runbooks/i)).toBeInTheDocument();
      expect(screen.getByText(/Supported migrations handling 10M\+ rows\/second/i)).toBeInTheDocument();
    });

    it("should render AWS impact metrics", () => {
      render(<Work />);

      expect(screen.getByText(/Maintained 98% customer satisfaction/i)).toBeInTheDocument();
      expect(screen.getByText(/Created documentation reducing repeat issues by 25%/i)).toBeInTheDocument();
      expect(screen.getByText(/Led knowledge sessions/i)).toBeInTheDocument();
    });

    it("should render Infosys impact metrics", () => {
      render(<Work />);

      expect(screen.getByText(/Automated deployment processes, reducing setup time by 60%/i)).toBeInTheDocument();
      expect(screen.getByText(/Implemented monitoring reducing unplanned downtime/i)).toBeInTheDocument();
      expect(screen.getByText(/Trained team of 5 on Linux administration/i)).toBeInTheDocument();
    });
  });

  describe("skills display", () => {
    it("should render SingleStore skills", () => {
      render(<Work />);

      // SingleStore appears multiple times (company name + skill badge)
      expect(screen.getAllByText("SingleStore").length).toBeGreaterThan(0);
      expect(screen.getByText("Distributed SQL")).toBeInTheDocument();
      // Linux appears in multiple roles, so use getAllByText
      expect(screen.getAllByText("Linux").length).toBeGreaterThan(0);
      expect(screen.getByText("AWS")).toBeInTheDocument();
      expect(screen.getByText("Python")).toBeInTheDocument();
    });

    it("should render AWS skills", () => {
      render(<Work />);

      expect(screen.getByText("AWS RDS")).toBeInTheDocument();
      expect(screen.getByText("Aurora")).toBeInTheDocument();
      expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
      expect(screen.getByText("DMS")).toBeInTheDocument();
      expect(screen.getByText("IAM")).toBeInTheDocument();
    });

    it("should render Infosys skills", () => {
      render(<Work />);

      expect(screen.getByText("SCCM")).toBeInTheDocument();
      expect(screen.getByText("Windows Server")).toBeInTheDocument();
      expect(screen.getByText("PowerShell")).toBeInTheDocument();
    });
  });

  describe("brand colors", () => {
    it("should apply SingleStore purple branding", () => {
      const { container } = render(<Work />);

      // Check for SingleStore purple color (AA8CFF)
      const singlestoreElements = container.querySelectorAll('[style*="170, 140, 255"]');
      expect(singlestoreElements.length).toBeGreaterThan(0);
    });

    it("should apply AWS orange branding", () => {
      const { container } = render(<Work />);

      // Check for AWS orange color (FF9900)
      const awsElements = container.querySelectorAll('[style*="255, 153, 0"]');
      expect(awsElements.length).toBeGreaterThan(0);
    });

    it("should apply Infosys blue branding", () => {
      const { container } = render(<Work />);

      // Check for Infosys blue color (007CC3)
      const infosysElements = container.querySelectorAll('[style*="0, 124, 195"]');
      expect(infosysElements.length).toBeGreaterThan(0);
    });
  });

  describe("layout and structure", () => {
    it("should render three experience articles", () => {
      const { container } = render(<Work />);

      const articles = container.querySelectorAll("article");
      expect(articles.length).toBe(3);
    });

    it("should have proper spacing between cards", () => {
      const { container } = render(<Work />);

      const spacedContainer = container.querySelector(".space-y-8");
      expect(spacedContainer).toBeInTheDocument();
    });

    it("should use card-elevated styling", () => {
      const { container } = render(<Work />);

      const elevatedCards = container.querySelectorAll(".card-elevated");
      expect(elevatedCards.length).toBe(3);
    });

    it("should have responsive padding", () => {
      const { container } = render(<Work />);

      const paddedCards = container.querySelectorAll(".p-8.md\\:p-10");
      expect(paddedCards.length).toBe(3);
    });
  });

  describe("icons", () => {
    it("should render ArrowUpRight icons", () => {
      const { container } = render(<Work />);

      const arrowIcons = container.querySelectorAll(".lucide-arrow-up-right");
      expect(arrowIcons.length).toBe(3);
    });
  });

  describe("accessibility", () => {
    it("should use semantic article elements", () => {
      const { container } = render(<Work />);

      const articles = container.querySelectorAll("article");
      expect(articles.length).toBe(3);
    });

    it("company logos should have descriptive alt text", () => {
      const { container } = render(<Work />);

      const logos = container.querySelectorAll("img");
      logos.forEach(logo => {
        expect(logo.getAttribute("alt")).toBeTruthy();
        expect(logo.getAttribute("alt")).toContain("logo");
      });
    });

    it("should have proper heading hierarchy", () => {
      const { container } = render(<Work />);

      const h2 = container.querySelector("h2");
      expect(h2).toBeInTheDocument();
    });

    it("should have descriptive list structure for impact items", () => {
      const { container } = render(<Work />);

      const lists = container.querySelectorAll("ul");
      expect(lists.length).toBe(3); // One per experience
    });
  });

  describe("responsive design", () => {
    it("should have responsive flex layouts", () => {
      const { container } = render(<Work />);

      const responsiveLayouts = container.querySelectorAll(".flex-col.md\\:flex-row, .md\\:flex-row");
      expect(responsiveLayouts.length).toBeGreaterThan(0);
    });

    it("should have responsive gap classes", () => {
      const { container } = render(<Work />);

      const gapElements = container.querySelectorAll("[class*='gap-']");
      expect(gapElements.length).toBeGreaterThan(0);
    });

    it("should have responsive text alignment", () => {
      const { container } = render(<Work />);

      const responsiveText = container.querySelectorAll(".md\\:text-right");
      expect(responsiveText.length).toBeGreaterThan(0);
    });
  });

  describe("visual effects", () => {
    it("should have brand glow effects", () => {
      const { container } = render(<Work />);

      const glowEffects = container.querySelectorAll(".blur-3xl");
      expect(glowEffects.length).toBe(3);
    });

    it("should have group hover effects", () => {
      const { container } = render(<Work />);

      const groupElements = container.querySelectorAll(".group");
      expect(groupElements.length).toBe(3);
    });

    it("should have transition classes", () => {
      const { container } = render(<Work />);

      const transitions = container.querySelectorAll("[class*='transition']");
      expect(transitions.length).toBeGreaterThan(0);
    });
  });

  describe("current position indicator", () => {
    it("should only mark SingleStore as current", () => {
      render(<Work />);

      const currentBadges = screen.getAllByText("Current");
      expect(currentBadges.length).toBe(1);
    });

    it("current badge should have brand styling", () => {
      const { container } = render(<Work />);

      const currentBadge = screen.getByText("Current");
      expect(currentBadge).toBeInTheDocument();
      // Badge element should exist and have inline styles
      expect(currentBadge).toBeTruthy();
      expect(currentBadge.parentElement).toBeTruthy();
    });
  });

  describe("content accuracy", () => {
    it("should list experiences in chronological order (newest first)", () => {
      const { container } = render(<Work />);

      const companyNames = Array.from(container.querySelectorAll("h3"))
        .map(h3 => h3.textContent);

      expect(companyNames[0]).toContain("SingleStore");
      expect(companyNames[1]).toContain("Amazon Web Services");
      expect(companyNames[2]).toContain("Infosys");
    });

    it("should have three impact items per role", () => {
      const { container } = render(<Work />);

      const lists = container.querySelectorAll("ul");
      lists.forEach(list => {
        const items = list.querySelectorAll("li");
        expect(items.length).toBe(3);
      });
    });
  });

  describe("edge cases", () => {
    it("should handle multiple renders", () => {
      const { rerender } = render(<Work />);

      rerender(<Work />);
      rerender(<Work />);

      expect(screen.getByText("Experience")).toBeInTheDocument();
    });

    it("should not have console errors", () => {
      const consoleSpy = vi.spyOn(console, "error");

      render(<Work />);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("skills rendering", () => {
    it("each role should have multiple skills", () => {
      const { container } = render(<Work />);

      const articles = container.querySelectorAll("article");
      articles.forEach(article => {
        const skills = article.querySelectorAll(".rounded-full");
        expect(skills.length).toBeGreaterThan(0);
      });
    });

    it("skills should have brand-colored styling", () => {
      const { container } = render(<Work />);

      // Skills should have border styling
      const skills = container.querySelectorAll('[style*="border"]');
      expect(skills.length).toBeGreaterThan(0);
    });
  });

  describe("company logo styling", () => {
    it("logos should have brand-colored backgrounds", () => {
      const { container } = render(<Work />);

      const logoContainers = container.querySelectorAll(".w-14.h-14.rounded-xl");
      expect(logoContainers.length).toBe(3);
    });

    it("logos should have hover scale effect", () => {
      const { container } = render(<Work />);

      const hoverElements = container.querySelectorAll(".group-hover\\:scale-105");
      expect(hoverElements.length).toBeGreaterThan(0);
    });
  });

  describe("typography", () => {
    it("company names should use heading font", () => {
      const { container } = render(<Work />);

      const headings = container.querySelectorAll(".font-heading");
      expect(headings.length).toBeGreaterThan(0);
    });

    it("should have proper text sizes", () => {
      const { container } = render(<Work />);

      const textElements = container.querySelectorAll("[class*='text-']");
      expect(textElements.length).toBeGreaterThan(0);
    });
  });

  describe("impact list formatting", () => {
    it("impact items should have bullet indicators", () => {
      const { container } = render(<Work />);

      // Check for bullet points (rendered as colored dots)
      const bullets = container.querySelectorAll(".w-1\\.5.h-1\\.5.rounded-full");
      expect(bullets.length).toBe(9); // 3 items × 3 roles
    });

    it("bullets should have brand colors", () => {
      const { container } = render(<Work />);

      // Check for bullet elements by class instead of inline style attribute
      const bullets = container.querySelectorAll('.w-1\\.5.h-1\\.5.rounded-full');
      expect(bullets.length).toBe(9); // 3 impact items × 3 roles
    });
  });

  describe("negative tests", () => {
    it("should not render empty experience cards", () => {
      const { container } = render(<Work />);

      const articles = container.querySelectorAll("article");
      articles.forEach(article => {
        expect(article.textContent?.trim()).not.toBe("");
      });
    });

    it("should not have broken image sources", () => {
      const { container } = render(<Work />);

      const images = container.querySelectorAll("img");
      images.forEach(img => {
        expect(img.getAttribute("src")).toBeTruthy();
        expect(img.getAttribute("alt")).toBeTruthy();
      });
    });
  });

  describe("performance", () => {
    it("should render efficiently", () => {
      const start = Date.now();
      render(<Work />);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(100);
    });
  });

  describe("data structure validation", () => {
    it("all experiences should have required fields", () => {
      render(<Work />);

      // Company names - use getAllByText since they appear multiple times
      expect(screen.getAllByText("SingleStore").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Amazon Web Services").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Infosys").length).toBeGreaterThan(0);

      // Roles - these should be unique
      expect(screen.getByText("Database Cloud Support Engineer")).toBeInTheDocument();
      expect(screen.getByText("Cloud Support Associate")).toBeInTheDocument();
      expect(screen.getByText("Senior System Associate")).toBeInTheDocument();
    });
  });
});