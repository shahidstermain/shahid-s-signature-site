import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Work } from "@/components/sections/Work";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
  },
}));

// Mock Section components
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

// Mock lucide-react
vi.mock("lucide-react", () => ({
  ArrowUpRight: () => <svg data-testid="arrow-up-right" />,
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

describe("Work component - Additional Tests", () => {
  describe("Brand styling", () => {
    it("should apply SingleStore brand color to current position", () => {
      const { container } = render(<Work />);

      // SingleStore elements should have purple brand color
      const singlestoreElements = container.querySelectorAll('[style*="170, 140, 255"]');
      expect(singlestoreElements.length).toBeGreaterThan(0);
    });

    it("should apply AWS brand color to AWS experience", () => {
      const { container } = render(<Work />);

      // AWS elements should have orange brand color
      const awsElements = container.querySelectorAll('[style*="255, 153, 0"]');
      expect(awsElements.length).toBeGreaterThan(0);
    });

    it("should apply Infosys brand color to Infosys experience", () => {
      const { container } = render(<Work />);

      // Infosys elements should have blue brand color
      const infosysElements = container.querySelectorAll('[style*="0, 124, 195"]');
      expect(infosysElements.length).toBeGreaterThan(0);
    });

    it("should render brand glow effects for each company", () => {
      const { container } = render(<Work />);

      const glowEffects = container.querySelectorAll(".blur-3xl");
      expect(glowEffects.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Company logos", () => {
    it("should have proper styling on logo containers", () => {
      const { container } = render(<Work />);

      const logoContainers = container.querySelectorAll(".w-14.h-14.rounded-xl");
      expect(logoContainers.length).toBe(3);
    });

    it("should have lazy loading on all logos", () => {
      const { container } = render(<Work />);

      const logos = container.querySelectorAll('img[loading="lazy"]');
      expect(logos.length).toBe(3);
    });

    it("should have object-contain class on logos", () => {
      const { container } = render(<Work />);

      const logos = container.querySelectorAll("img");
      logos.forEach((logo) => {
        expect(logo).toHaveClass("object-contain");
      });
    });

    it("should have proper alt text for each logo", () => {
      render(<Work />);

      expect(screen.getByAltText("SingleStore logo")).toBeInTheDocument();
      expect(screen.getByAltText("Amazon Web Services logo")).toBeInTheDocument();
      expect(screen.getByAltText("Infosys logo")).toBeInTheDocument();
    });
  });

  describe("Experience data accuracy", () => {
    it("should display correct SingleStore impact metrics", () => {
      render(<Work />);

      expect(screen.getByText(/Reduced average resolution time by 40%/)).toBeInTheDocument();
      expect(screen.getByText(/Authored 15\+ internal runbooks/)).toBeInTheDocument();
      expect(screen.getByText(/Supported migrations handling 10M\+ rows\/second/)).toBeInTheDocument();
    });

    it("should display correct AWS impact metrics", () => {
      render(<Work />);

      expect(screen.getByText(/Maintained 98% customer satisfaction score/)).toBeInTheDocument();
      expect(screen.getByText(/Created documentation reducing repeat issues by 25%/)).toBeInTheDocument();
      expect(screen.getByText(/Led knowledge sessions for new team members/)).toBeInTheDocument();
    });

    it("should display correct Infosys impact metrics", () => {
      render(<Work />);

      expect(screen.getByText(/Automated deployment processes, reducing setup time by 60%/)).toBeInTheDocument();
      expect(screen.getByText(/Implemented monitoring reducing unplanned downtime/)).toBeInTheDocument();
      expect(screen.getByText(/Trained team of 5 on Linux administration/)).toBeInTheDocument();
    });

    it("should display full SingleStore description", () => {
      render(<Work />);

      expect(
        screen.getByText(
          /Resolving Tier-2\/3 distributed systems challenges/
        )
      ).toBeInTheDocument();
    });

    it("should display full AWS description", () => {
      render(<Work />);

      expect(
        screen.getByText(
          /Delivered technical support for Amazon Aurora, RDS, and AWS DMS/
        )
      ).toBeInTheDocument();
    });

    it("should display full Infosys description", () => {
      render(<Work />);

      expect(
        screen.getByText(
          /Administered SCCM and Windows systems for enterprise clients/
        )
      ).toBeInTheDocument();
    });
  });

  describe("Skills rendering", () => {
    it("should render all SingleStore skills", () => {
      render(<Work />);

      const allText = document.body.textContent || "";
      expect(allText).toContain("Distributed SQL");
    });

    it("should render all AWS skills", () => {
      render(<Work />);

      expect(screen.getByText("AWS RDS")).toBeInTheDocument();
      expect(screen.getByText("Aurora")).toBeInTheDocument();
      expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
      expect(screen.getByText("DMS")).toBeInTheDocument();
      expect(screen.getByText("IAM")).toBeInTheDocument();
    });

    it("should render all Infosys skills", () => {
      render(<Work />);

      expect(screen.getByText("SCCM")).toBeInTheDocument();
      expect(screen.getByText("Windows Server")).toBeInTheDocument();
      expect(screen.getByText("PowerShell")).toBeInTheDocument();
    });

    it("should apply brand colors to skill tags", () => {
      const { container } = render(<Work />);

      const skillTags = container.querySelectorAll(".rounded-full");
      expect(skillTags.length).toBeGreaterThan(10);
    });
  });

  describe("Layout and structure", () => {
    it("should use card-elevated class for experience cards", () => {
      const { container } = render(<Work />);

      const cards = container.querySelectorAll(".card-elevated");
      expect(cards.length).toBe(3);
    });

    it("should have proper padding on cards", () => {
      const { container } = render(<Work />);

      const cards = container.querySelectorAll(".p-8");
      expect(cards.length).toBeGreaterThanOrEqual(3);
    });

    it("should have responsive padding classes", () => {
      const { container } = render(<Work />);

      const responsivePadding = container.querySelectorAll(".md\\:p-10");
      expect(responsivePadding.length).toBeGreaterThanOrEqual(3);
    });

    it("should have space-y-8 for vertical spacing", () => {
      const { container } = render(<Work />);

      const spacingContainer = container.querySelector(".space-y-8");
      expect(spacingContainer).toBeInTheDocument();
    });

    it("should have overflow-hidden on cards", () => {
      const { container } = render(<Work />);

      const cards = container.querySelectorAll(".overflow-hidden");
      expect(cards.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Interactive elements", () => {
    it("should render ArrowUpRight icon for each experience", () => {
      const { container } = render(<Work />);

      const arrows = container.querySelectorAll('[data-testid="arrow-up-right"]');
      expect(arrows.length).toBe(3);
    });

    it("should have hover effects on cards", () => {
      const { container } = render(<Work />);

      const cards = container.querySelectorAll(".group");
      expect(cards.length).toBe(3);
    });

    it("should have transition classes on interactive elements", () => {
      const { container } = render(<Work />);

      const transitionElements = container.querySelectorAll(".transition-opacity, .transition-colors, .transition-all");
      expect(transitionElements.length).toBeGreaterThan(0);
    });

    it("should have hover scale effect on logo containers", () => {
      const { container } = render(<Work />);

      const logoContainers = container.querySelectorAll(".group-hover\\:scale-105");
      expect(logoContainers.length).toBe(3);
    });

    it("should have opacity transition on glow effects", () => {
      const { container } = render(<Work />);

      const glowEffects = container.querySelectorAll(".group-hover\\:opacity-50");
      expect(glowEffects.length).toBe(3);
    });
  });

  describe("Current badge", () => {
    it("should only render current badge for SingleStore", () => {
      render(<Work />);

      const currentBadges = screen.getAllByText("Current");
      expect(currentBadges.length).toBe(1);
    });

    it("should apply brand styling to current badge", () => {
      const { container } = render(<Work />);

      const currentBadge = Array.from(container.querySelectorAll("span")).find(
        (el) => el.textContent === "Current"
      );

      expect(currentBadge).toBeInTheDocument();
      expect(currentBadge?.className).toContain("rounded-full");
    });

    it("should have proper text size on current badge", () => {
      const { container } = render(<Work />);

      const currentBadge = Array.from(container.querySelectorAll("span")).find(
        (el) => el.textContent === "Current"
      );

      expect(currentBadge?.className).toContain("text-xs");
    });
  });

  describe("Key Impact sections", () => {
    it("should render Key Impact header for each experience", () => {
      render(<Work />);

      const keyImpactHeaders = screen.getAllByText("Key Impact");
      expect(keyImpactHeaders.length).toBe(3);
    });

    it("should render impact items as list", () => {
      const { container } = render(<Work />);

      const lists = container.querySelectorAll("ul");
      expect(lists.length).toBe(3);
    });

    it("should render bullet points with brand colors", () => {
      const { container } = render(<Work />);

      const bullets = container.querySelectorAll(".w-1\\.5.h-1\\.5.rounded-full");
      expect(bullets.length).toBeGreaterThanOrEqual(9); // 3 items per experience
    });

    it("should have proper spacing between impact items", () => {
      const { container } = render(<Work />);

      const impactLists = container.querySelectorAll("ul.space-y-2");
      expect(impactLists.length).toBe(3);
    });

    it("should uppercase Key Impact headers", () => {
      const { container } = render(<Work />);

      const headers = Array.from(container.querySelectorAll("h4")).filter(
        (el) => el.textContent === "Key Impact"
      );

      headers.forEach((header) => {
        expect(header.className).toContain("uppercase");
      });
    });
  });

  describe("Responsive design", () => {
    it("should have responsive layout for header section", () => {
      const { container } = render(<Work />);

      const responsiveLayout = container.querySelectorAll(".flex-col.md\\:flex-row");
      expect(responsiveLayout.length).toBeGreaterThanOrEqual(3);
    });

    it("should have responsive text alignment", () => {
      const { container } = render(<Work />);

      const textAlign = container.querySelectorAll(".md\\:text-right");
      expect(textAlign.length).toBe(3);
    });

    it("should have flex-wrap on skills container", () => {
      const { container } = render(<Work />);

      const flexWrap = container.querySelectorAll(".flex-wrap");
      expect(flexWrap.length).toBe(3);
    });
  });

  describe("Typography and styling", () => {
    it("should use font-heading for company names", () => {
      const { container } = render(<Work />);

      const companyNames = container.querySelectorAll(".font-heading");
      expect(companyNames.length).toBeGreaterThanOrEqual(3);
    });

    it("should have proper text sizes", () => {
      const { container } = render(<Work />);

      const textXl = container.querySelectorAll(".text-xl");
      expect(textXl.length).toBeGreaterThanOrEqual(3);
    });

    it("should have muted-foreground for descriptions", () => {
      const { container } = render(<Work />);

      const mutedText = container.querySelectorAll(".text-muted-foreground");
      expect(mutedText.length).toBeGreaterThan(0);
    });

    it("should have leading-relaxed for readable text", () => {
      const { container } = render(<Work />);

      const relaxedLeading = container.querySelectorAll(".leading-relaxed");
      expect(relaxedLeading.length).toBeGreaterThanOrEqual(3);
    });

    it("should have tracking-wider for uppercase text", () => {
      const { container } = render(<Work />);

      const widerTracking = container.querySelectorAll(".tracking-wider");
      expect(widerTracking.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Z-index layering", () => {
    it("should have relative positioning on cards", () => {
      const { container } = render(<Work />);

      const articles = container.querySelectorAll("article");
      articles.forEach((article) => {
        expect(article.className).toContain("relative");
      });
    });

    it("should have z-10 on content layer", () => {
      const { container } = render(<Work />);

      const contentLayers = container.querySelectorAll(".z-10");
      expect(contentLayers.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Accessibility", () => {
    it("should use semantic article tags", () => {
      const { container } = render(<Work />);

      const articles = container.querySelectorAll("article");
      expect(articles.length).toBe(3);
    });

    it("should have proper heading hierarchy", () => {
      const { container } = render(<Work />);

      const h2 = container.querySelector("h2");
      const h3s = container.querySelectorAll("h3");
      const h4s = container.querySelectorAll("h4");

      expect(h2).toBeInTheDocument();
      expect(h3s.length).toBe(3);
      expect(h4s.length).toBe(3);
    });

    it("should have descriptive alt text for all images", () => {
      render(<Work />);

      expect(screen.getByAltText("SingleStore logo")).toBeInTheDocument();
      expect(screen.getByAltText("Amazon Web Services logo")).toBeInTheDocument();
      expect(screen.getByAltText("Infosys logo")).toBeInTheDocument();
    });
  });

  describe("Period display", () => {
    it("should display periods with em dashes", () => {
      render(<Work />);

      expect(screen.getByText("Jan 2024 — Present")).toBeInTheDocument();
      expect(screen.getByText("Jul 2022 — Jan 2024")).toBeInTheDocument();
      expect(screen.getByText("Apr 2020 — Jul 2022")).toBeInTheDocument();
    });

    it("should display Present for current position", () => {
      render(<Work />);

      expect(screen.getByText(/Present/)).toBeInTheDocument();
    });

    it("should position period text to the right on desktop", () => {
      const { container } = render(<Work />);

      const periods = Array.from(container.querySelectorAll("span")).filter(
        (el) => el.textContent?.includes("—")
      );

      periods.forEach((period) => {
        expect(period.className).toContain("md:text-right");
      });
    });
  });

  describe("Border styling", () => {
    it("should apply brand-specific border colors", () => {
      const { container } = render(<Work />);

      const articles = container.querySelectorAll("article[style*='borderColor']");
      expect(articles.length).toBe(3);
    });

    it("should have rounded corners on skill badges", () => {
      const { container } = render(<Work />);

      const skillBadges = container.querySelectorAll(".rounded-full");
      expect(skillBadges.length).toBeGreaterThan(10);
    });
  });

  describe("Gap spacing", () => {
    it("should have gap-2 on skills container", () => {
      const { container } = render(<Work />);

      const gap2 = container.querySelectorAll(".gap-2");
      expect(gap2.length).toBeGreaterThanOrEqual(3);
    });

    it("should have gap-4 for layout spacing", () => {
      const { container } = render(<Work />);

      const gap4 = container.querySelectorAll(".gap-4");
      expect(gap4.length).toBeGreaterThan(0);
    });
  });
});