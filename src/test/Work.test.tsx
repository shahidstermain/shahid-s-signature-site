import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Work } from "../components/sections/Work";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
  },
}));

// Mock the Section components
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

describe("Work Component", () => {
  it("should render without crashing", () => {
    const { container } = render(<Work />);
    expect(container.querySelector("section")).toBeInTheDocument();
  });

  it("should have work section ID", () => {
    const { container } = render(<Work />);
    const section = container.querySelector("#work");
    expect(section).toBeInTheDocument();
  });

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
      screen.getByText(/A track record of solving hard problems in production environments/i)
    ).toBeInTheDocument();
  });

  it("should render all three companies", () => {
    render(<Work />);
    expect(screen.getAllByText("SingleStore").length).toBeGreaterThan(0);
    expect(screen.getByText("Amazon Web Services")).toBeInTheDocument();
    expect(screen.getByText("Infosys")).toBeInTheDocument();
  });

  it("should display SingleStore as current position", () => {
    render(<Work />);
    expect(screen.getByText("Current")).toBeInTheDocument();
  });

  it("should display SingleStore role", () => {
    render(<Work />);
    expect(screen.getByText("Database Cloud Support Engineer")).toBeInTheDocument();
  });

  it("should display SingleStore period", () => {
    render(<Work />);
    expect(screen.getByText("Jan 2024 — Present")).toBeInTheDocument();
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
    expect(
      screen.getByText(/Supported migrations handling 10M\+ rows\/second/i)
    ).toBeInTheDocument();
  });

  it("should display SingleStore skills", () => {
    render(<Work />);
    expect(screen.getAllByText("SingleStore").length).toBeGreaterThan(0);
    expect(screen.getByText("Distributed SQL")).toBeInTheDocument();
    expect(screen.getAllByText("Linux").length).toBeGreaterThan(0);
    expect(screen.getAllByText("AWS").length).toBeGreaterThan(0);
    expect(screen.getByText("Python")).toBeInTheDocument();
  });

  it("should display AWS role", () => {
    render(<Work />);
    expect(screen.getByText("Cloud Support Associate")).toBeInTheDocument();
  });

  it("should display AWS period", () => {
    render(<Work />);
    expect(screen.getByText("Jul 2022 — Jan 2024")).toBeInTheDocument();
  });

  it("should display AWS description", () => {
    render(<Work />);
    expect(
      screen.getByText(/Delivered technical support for Amazon Aurora, RDS, and AWS DMS/i)
    ).toBeInTheDocument();
  });

  it("should display AWS impact items", () => {
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
      screen.getByText(/Administered SCCM and Windows systems for enterprise clients/i)
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
    expect(
      screen.getByText(/Trained team of 5 on Linux administration/i)
    ).toBeInTheDocument();
  });

  it("should display Infosys skills", () => {
    render(<Work />);
    expect(screen.getByText("SCCM")).toBeInTheDocument();
    expect(screen.getByText("Windows Server")).toBeInTheDocument();
    expect(screen.getByText("PowerShell")).toBeInTheDocument();
  });

  it("should render company logos", () => {
    render(<Work />);
    const singleStoreLogo = screen.getByAltText("SingleStore logo");
    const awsLogo = screen.getByAltText("Amazon Web Services logo");
    const infosysLogo = screen.getByAltText("Infosys logo");

    expect(singleStoreLogo).toBeInTheDocument();
    expect(awsLogo).toBeInTheDocument();
    expect(infosysLogo).toBeInTheDocument();
  });

  it("should render experiences as articles", () => {
    const { container } = render(<Work />);
    const articles = container.querySelectorAll("article");
    expect(articles).toHaveLength(3);
  });

  it("should display Key Impact heading for each experience", () => {
    render(<Work />);
    const keyImpactHeadings = screen.getAllByText("Key Impact");
    expect(keyImpactHeadings).toHaveLength(3);
  });

  it("should display three impact items per experience", () => {
    const { container } = render(<Work />);
    const impactLists = container.querySelectorAll("ul");
    impactLists.forEach((list) => {
      const items = list.querySelectorAll("li");
      expect(items).toHaveLength(3);
    });
  });

  it("should only show Current badge for SingleStore", () => {
    render(<Work />);
    const currentBadges = screen.getAllByText("Current");
    expect(currentBadges).toHaveLength(1);
  });

  it("should have brand-specific styling for each company", () => {
    const { container } = render(<Work />);
    const articles = container.querySelectorAll("article");

    // Each article should have brand-specific colors via inline styles
    articles.forEach((article) => {
      expect(article).toHaveAttribute("style");
    });
  });

  it("should render ArrowUpRight icon for external link indicator", () => {
    const { container } = render(<Work />);
    // ArrowUpRight icons should be present
    const icons = container.querySelectorAll("svg");
    expect(icons.length).toBeGreaterThan(0);
  });

  it("should display experiences in chronological order (most recent first)", () => {
    const { container } = render(<Work />);
    const text = container.textContent || "";

    const singleStoreIndex = text.indexOf("SingleStore");
    const awsIndex = text.indexOf("Amazon Web Services");
    const infosysIndex = text.indexOf("Infosys");

    expect(singleStoreIndex).toBeLessThan(awsIndex);
    expect(awsIndex).toBeLessThan(infosysIndex);
  });

  it("should have proper semantic structure with heading hierarchy", () => {
    render(<Work />);
    // Section title should be h2
    const sectionTitle = screen.getByText("Where I've made impact");
    expect(sectionTitle.tagName).toBe("H2");
  });

  it("should render skills as pill badges", () => {
    const { container } = render(<Work />);
    const skillBadges = container.querySelectorAll(".px-3.py-1");
    // Should have multiple skill badges
    expect(skillBadges.length).toBeGreaterThan(10);
  });

  it("should use card-elevated class for experience cards", () => {
    const { container } = render(<Work />);
    const cards = container.querySelectorAll(".card-elevated");
    expect(cards).toHaveLength(3);
  });

  it("should have hover effects on experience cards", () => {
    const { container } = render(<Work />);
    const cards = container.querySelectorAll("article");
    cards.forEach((card) => {
      expect(card.className).toContain("group");
    });
  });

  it("should render brand glow effects", () => {
    const { container } = render(<Work />);
    const glows = container.querySelectorAll(".blur-3xl");
    expect(glows.length).toBeGreaterThanOrEqual(3);
  });

  it("should have responsive layout with proper padding", () => {
    const { container } = render(<Work />);
    const cards = container.querySelectorAll("article");
    cards.forEach((card) => {
      expect(card.className).toMatch(/p-8|p-10/);
    });
  });
});