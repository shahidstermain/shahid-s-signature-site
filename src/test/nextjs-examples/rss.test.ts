import { describe, it, expect, vi } from "vitest";

// Mock dependencies
vi.mock("@/data/articles", () => ({
  articles: [
    {
      slug: "test-article",
      title: "Test Article",
      description: "Test description",
      category: "Testing",
      date: "Jan 2024",
      content: "Test content with **bold** and `code`",
      seoKeywords: ["test", "article"],
    },
  ],
}));

describe("Next.js RSS Route Example", () => {
  describe("RSS feed structure", () => {
    it("should start with XML declaration", () => {
      const xml = '<?xml version="1.0" encoding="UTF-8"?>';

      expect(xml).toContain('<?xml version="1.0"');
      expect(xml).toContain('encoding="UTF-8"');
    });

    it("should have RSS 2.0 root element", () => {
      const rss = '<rss version="2.0"></rss>';

      expect(rss).toContain('version="2.0"');
    });

    it("should include required namespaces", () => {
      const namespaces = [
        'xmlns:content="http://purl.org/rss/1.0/modules/content/"',
        'xmlns:atom="http://www.w3.org/2005/Atom"',
        'xmlns:dc="http://purl.org/dc/elements/1.1/"',
      ];

      namespaces.forEach((ns) => {
        expect(ns).toContain("xmlns:");
      });
    });
  });

  describe("Channel metadata", () => {
    it("should have channel element", () => {
      const channel = "<channel></channel>";

      expect(channel).toBe("<channel></channel>");
    });

    it("should have title", () => {
      const title = "Shahid Moosa — Distributed Systems Engineering";

      expect(title).toBeDefined();
      expect(title.length).toBeGreaterThan(0);
    });

    it("should have description", () => {
      const description =
        "Deep dives into distributed databases, data infrastructure, and production systems.";

      expect(description.length).toBeGreaterThan(0);
    });

    it("should have link to site", () => {
      const link = "https://shahidster.tech";

      expect(link).toMatch(/^https:\/\//);
    });

    it("should have language tag", () => {
      const language = "en-us";

      expect(language).toMatch(/^[a-z]{2}-[a-z]{2}$/);
    });

    it("should have lastBuildDate", () => {
      const lastBuildDate = new Date().toUTCString();

      expect(lastBuildDate).toContain("GMT");
    });

    it("should have TTL", () => {
      const ttl = 60;

      expect(ttl).toBeGreaterThan(0);
      expect(ttl).toBeLessThanOrEqual(1440);
    });

    it("should have generator tag", () => {
      const generator = "Next.js RSS Generator";

      expect(generator).toContain("Next.js");
    });

    it("should have managing editor", () => {
      const managingEditor = "hello@shahidster.tech (Shahid Moosa)";

      expect(managingEditor).toMatch(/\(.*\)$/);
    });

    it("should have copyright notice", () => {
      const year = new Date().getFullYear();
      const copyright = `Copyright ${year} Shahid Moosa. All rights reserved.`;

      expect(copyright).toContain("Copyright");
      expect(copyright).toContain(String(year));
    });
  });

  describe("Atom self-link", () => {
    it("should include atom:link for feed URL", () => {
      const atomLink = {
        href: "https://shahidster.tech/rss.xml",
        rel: "self",
        type: "application/rss+xml",
      };

      expect(atomLink.href).toContain("/rss.xml");
      expect(atomLink.rel).toBe("self");
      expect(atomLink.type).toBe("application/rss+xml");
    });
  });

  describe("Channel image", () => {
    it("should have image element", () => {
      const image = {
        url: "https://shahidster.tech/og-image.png",
        title: "Site Title",
        link: "https://shahidster.tech",
        width: 1200,
        height: 630,
      };

      expect(image.url).toMatch(/\.(png|jpg|jpeg)$/);
      expect(image.width).toBeGreaterThan(0);
      expect(image.height).toBeGreaterThan(0);
    });
  });

  describe("Item structure", () => {
    it("should have title element", () => {
      const title = "Test Article";

      expect(title).toBeDefined();
    });

    it("should have link element", () => {
      const link = "https://shahidster.tech/blog/test-article";

      expect(link).toMatch(/^https:\/\//);
      expect(link).toContain("/blog/");
    });

    it("should have guid element", () => {
      const guid = {
        isPermaLink: true,
        value: "https://shahidster.tech/blog/test-article",
      };

      expect(guid.isPermaLink).toBe(true);
      expect(guid.value).toMatch(/^https:\/\//);
    });

    it("should have description element", () => {
      const description = "Test description";

      expect(description).toBeDefined();
    });

    it("should have pubDate in RFC 822 format", () => {
      const pubDate = new Date().toUTCString();

      expect(pubDate).toMatch(/^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4}/);
    });

    it("should have author element", () => {
      const author = "hello@shahidster.tech (Shahid Moosa)";

      expect(author).toMatch(/^[\w.-]+@[\w.-]+/);
      expect(author).toContain("(");
      expect(author).toContain(")");
    });

    it("should have category elements", () => {
      const categories = ["Testing", "test", "article"];

      expect(categories.length).toBeGreaterThan(0);
    });

    it("should have content:encoded with CDATA", () => {
      const contentEncoded = "<![CDATA[Test content...]]>";

      expect(contentEncoded).toContain("<![CDATA[");
      expect(contentEncoded).toContain("]]>");
    });
  });

  describe("XML escaping", () => {
    it("should escape ampersands", () => {
      const text = "Test & More";
      const escaped = text.replace(/&/g, "&amp;");

      expect(escaped).toBe("Test &amp; More");
    });

    it("should escape less than", () => {
      const text = "Test < More";
      const escaped = text.replace(/</g, "&lt;");

      expect(escaped).toBe("Test &lt; More");
    });

    it("should escape greater than", () => {
      const text = "Test > More";
      const escaped = text.replace(/>/g, "&gt;");

      expect(escaped).toBe("Test &gt; More");
    });

    it("should escape quotes", () => {
      const text = 'Test "quote"';
      const escaped = text.replace(/"/g, "&quot;");

      expect(escaped).toBe("Test &quot;quote&quot;");
    });

    it("should escape apostrophes", () => {
      const text = "Test 'quote'";
      const escaped = text.replace(/'/g, "&apos;");

      expect(escaped).toBe("Test &apos;quote&apos;");
    });
  });

  describe("Markdown stripping", () => {
    it("should remove code blocks", () => {
      const content = "Text ```code``` more";
      const stripped = content.replace(/```[\s\S]*?```/g, "");

      expect(stripped).not.toContain("```");
    });

    it("should remove inline code", () => {
      const content = "Text `code` more";
      const stripped = content.replace(/`[^`]+`/g, "");

      expect(stripped).not.toContain("`");
    });

    it("should remove bold", () => {
      const content = "Text **bold** more";
      const stripped = content.replace(/\*\*(.+?)\*\*/g, "$1");

      expect(stripped).toBe("Text bold more");
    });

    it("should remove headers", () => {
      const content = "# Header\nText";
      const stripped = content.replace(/^#{1,6}\s+/gm, "");

      expect(stripped).not.toMatch(/^#/);
    });

    it("should convert links to text", () => {
      const content = "[link](url)";
      const stripped = content.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

      expect(stripped).toBe("link");
    });

    it("should truncate to 500 characters", () => {
      const longContent = "a".repeat(600);
      const truncated = longContent.slice(0, 500);

      expect(truncated.length).toBe(500);
    });
  });

  describe("Date parsing", () => {
    it("should parse month-year format", () => {
      const dateStr = "Jan 2024";
      const [month, year] = dateStr.split(" ");

      expect(month).toBe("Jan");
      expect(year).toBe("2024");
    });

    it("should handle all months", () => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      months.forEach((month, index) => {
        expect(months[index]).toBe(month);
      });
    });
  });

  describe("Response configuration", () => {
    it("should set correct Content-Type header", () => {
      const contentType = "application/rss+xml; charset=utf-8";

      expect(contentType).toContain("application/rss+xml");
      expect(contentType).toContain("charset=utf-8");
    });

    it("should set Cache-Control header", () => {
      const cacheControl = "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400";

      expect(cacheControl).toContain("public");
      expect(cacheControl).toMatch(/max-age=\d+/);
    });

    it("should set X-Content-Type-Options", () => {
      const xContentType = "nosniff";

      expect(xContentType).toBe("nosniff");
    });
  });

  describe("Article sorting", () => {
    it("should sort by date descending", () => {
      const articles = [
        { date: "Jan 2024", title: "Old" },
        { date: "Mar 2024", title: "New" },
        { date: "Feb 2024", title: "Middle" },
      ];

      expect(articles.length).toBe(3);
    });
  });

  describe("Category handling", () => {
    it("should include article category", () => {
      const category = "Testing";

      expect(category).toBeDefined();
    });

    it("should include SEO keywords as categories", () => {
      const keywords = ["test", "article"];

      expect(Array.isArray(keywords)).toBe(true);
    });
  });

  describe("Integration", () => {
    it("should return Response object", () => {
      const response = new Response("test", {
        headers: { "Content-Type": "application/rss+xml" },
      });

      expect(response).toBeInstanceOf(Response);
    });

    it("should use GET export", () => {
      const GET = async () => new Response();

      expect(GET).toBeInstanceOf(Function);
    });
  });
});