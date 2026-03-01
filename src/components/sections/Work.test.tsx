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
      {label && <span>{label}</span>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  ),
}));

describe("Work", () => {
  it("should render the work section with correct id", () => {
    render(<Work />);
    const section = document.getElementById("work");

    expect(section).toBeInTheDocument();
  });

  it("should render section header with correct content", () => {
    render(<Work />);

    expect(screen.getByText("Experience")).toBeInTheDocument();
    expect(screen.getByText("Where I've made impact")).toBeInTheDocument();
    expect(
      screen.getByText("A track record of solving hard problems in production environments.")
    ).toBeInTheDocument();
  });

  it("should render all three work experiences", () => {
    render(<Work />);

    expect(screen.getAllByText("SingleStore").length).toBeGreaterThan(0);
    expect(screen.getByText("Amazon Web Services")).toBeInTheDocument();
    expect(screen.getByText("Infosys")).toBeInTheDocument();
  });

  it("should display SingleStore as current position", () => {
    render(<Work />);

    expect(screen.getByText("Database Cloud Support Engineer")).toBeInTheDocument();
    expect(screen.getByText("Jan 2024 — Present")).toBeInTheDocument();
    expect(screen.getByText("Current")).toBeInTheDocument();
  });

  it("should display AWS position details", () => {
    render(<Work />);

    expect(screen.getByText("Cloud Support Associate")).toBeInTheDocument();
    expect(screen.getByText("Jul 2022 — Jan 2024")).toBeInTheDocument();
  });

  it("should display Infosys position details", () => {
    render(<Work />);

    expect(screen.getByText("Senior System Associate")).toBeInTheDocument();
    expect(screen.getByText("Apr 2020 — Jul 2022")).toBeInTheDocument();
  });

  it("should render SingleStore job description", () => {
    render(<Work />);

    expect(
      screen.getByText(/Resolving Tier-2\/3 distributed systems challenges/i)
    ).toBeInTheDocument();
  });

  it("should render AWS job description", () => {
    render(<Work />);

    expect(
      screen.getByText(/Delivered technical support for Amazon Aurora, RDS, and AWS DMS/i)
    ).toBeInTheDocument();
  });

  it("should render Infosys job description", () => {
    render(<Work />);

    expect(
      screen.getByText(/Administered SCCM and Windows systems for enterprise clients/i)
    ).toBeInTheDocument();
  });

  it("should display SingleStore impact points", () => {
    render(<Work />);

    expect(
      screen.getByText(/Reduced average resolution time by 40%/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Authored 15\+ internal runbooks/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Supported migrations handling 10M\+ rows\/second/i)
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
    expect(screen.getByText(/Led knowledge sessions for new team members/i)).toBeInTheDocument();
  });

  it("should display Infosys impact points", () => {
    render(<Work />);

    expect(
      screen.getByText(/Automated deployment processes, reducing setup time by 60%/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Implemented monitoring reducing unplanned downtime/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Trained team of 5 on Linux administration/i)).toBeInTheDocument();
  });

  it("should display SingleStore skills", () => {
    render(<Work />);

    expect(screen.getAllByText("SingleStore").length).toBeGreaterThan(0);
    expect(screen.getByText("Distributed SQL")).toBeInTheDocument();
    expect(screen.getAllByText("Linux").length).toBeGreaterThan(0);
    expect(screen.getAllByText("AWS").length).toBeGreaterThan(0);
    expect(screen.getByText("Python")).toBeInTheDocument();
  });

  it("should display AWS skills", () => {
    render(<Work />);

    expect(screen.getByText("AWS RDS")).toBeInTheDocument();
    expect(screen.getByText("Aurora")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
    expect(screen.getByText("DMS")).toBeInTheDocument();
    expect(screen.getByText("IAM")).toBeInTheDocument();
  });

  it("should display Infosys skills", () => {
    render(<Work />);

    expect(screen.getByText("SCCM")).toBeInTheDocument();
    expect(screen.getByText("Windows Server")).toBeInTheDocument();
    // Linux appears multiple times, already tested
    expect(screen.getByText("PowerShell")).toBeInTheDocument();
  });

  it("should render company logos with alt text", () => {
    render(<Work />);

    expect(screen.getByAltText("SingleStore logo")).toBeInTheDocument();
    expect(screen.getByAltText("Amazon Web Services logo")).toBeInTheDocument();
    expect(screen.getByAltText("Infosys logo")).toBeInTheDocument();
  });

  it("should render Key Impact headers", () => {
    render(<Work />);
    const impactHeaders = screen.getAllByText("Key Impact");

    // One for each company
    expect(impactHeaders).toHaveLength(3);
  });

  it("should render articles with proper structure", () => {
    const { container } = render(<Work />);
    const articles = container.querySelectorAll("article");

    expect(articles).toHaveLength(3);
  });

  it("should have proper spacing between experiences", () => {
    const { container } = render(<Work />);
    const spacingDiv = container.querySelector(".space-y-8");

    expect(spacingDiv).toBeInTheDocument();
  });

  it("should only show Current badge for SingleStore", () => {
    render(<Work />);
    const currentBadges = screen.getAllByText("Current");

    expect(currentBadges).toHaveLength(1);
  });

  it("should render experiences in correct order", () => {
    const { container } = render(<Work />);
    const articles = container.querySelectorAll("article");
    const companies = Array.from(articles).map(article =>
      article.querySelector("h3")?.textContent
    );

    expect(companies[0]).toContain("SingleStore");
    expect(companies[1]).toContain("Amazon Web Services");
    expect(companies[2]).toContain("Infosys");
  });

  it("should render ArrowUpRight icon for external links", () => {
    const { container } = render(<Work />);
    const arrowIcons = container.querySelectorAll("svg.lucide-arrow-up-right");

    // One for each company
    expect(arrowIcons.length).toBeGreaterThanOrEqual(3);
  });

  it("should have brand colors applied", () => {
    const { container } = render(<Work />);
    const articles = container.querySelectorAll("article");

    // Each article should have inline styles for brand colors
    articles.forEach(article => {
      expect(article.hasAttribute("style")).toBe(true);
    });
  });

  it("should render all impact lists with bullet points", () => {
    const { container } = render(<Work />);
    const impactLists = container.querySelectorAll("ul");

    expect(impactLists).toHaveLength(3);

    impactLists.forEach(list => {
      const items = list.querySelectorAll("li");
      expect(items.length).toBeGreaterThan(0);
    });
  });

  it("should have card-elevated class on experiences", () => {
    const { container } = render(<Work />);
    const articles = container.querySelectorAll("article");

    articles.forEach(article => {
      expect(article.className).toContain("card-elevated");
    });
  });

  it("should display all skills as tags", () => {
    const { container } = render(<Work />);
    const skillTags = container.querySelectorAll("span[style]");

    // Should have multiple skill tags (5 + 5 + 4 = 14)
    expect(skillTags.length).toBeGreaterThanOrEqual(14);
  });
});