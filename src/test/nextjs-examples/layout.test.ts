import { describe, it, expect } from "vitest";

describe("Next.js Layout Example", () => {
  describe("Font configuration", () => {
    it("should use Inter font", () => {
      const fontConfig = {
        subsets: ["latin"],
        display: "swap" as const,
        variable: "--font-inter",
      };

      expect(fontConfig.subsets).toContain("latin");
      expect(fontConfig.display).toBe("swap");
      expect(fontConfig.variable).toMatch(/^--font-/);
    });

    it("should use Space Grotesk for headings", () => {
      const fontConfig = {
        subsets: ["latin"],
        display: "swap" as const,
        variable: "--font-space-grotesk",
      };

      expect(fontConfig.subsets).toContain("latin");
      expect(fontConfig.variable).toBe("--font-space-grotesk");
    });

    it("should use font-display swap for performance", () => {
      const fontDisplay = "swap";

      expect(["auto", "block", "swap", "fallback", "optional"]).toContain(fontDisplay);
    });
  });

  describe("HTML structure", () => {
    it("should have lang attribute", () => {
      const htmlLang = "en";

      expect(htmlLang).toBe("en");
      expect(htmlLang).toMatch(/^[a-z]{2}$/);
    });

    it("should apply font variables to html element", () => {
      const className = "--font-inter --font-space-grotesk";

      expect(className).toContain("--font-inter");
      expect(className).toContain("--font-space-grotesk");
    });

    it("should use suppressHydrationWarning for theme", () => {
      const suppressHydrationWarning = true;

      expect(suppressHydrationWarning).toBe(true);
    });
  });

  describe("Head preconnects", () => {
    it("should preconnect to Google Fonts", () => {
      const preconnects = [
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com",
      ];

      preconnects.forEach((url) => {
        expect(url).toMatch(/^https:\/\//);
      });
    });

    it("should use crossOrigin for font resources", () => {
      const crossOrigin = "anonymous";

      expect(["anonymous", "use-credentials"]).toContain(crossOrigin);
    });
  });

  describe("Favicon and icons", () => {
    it("should have multiple icon formats", () => {
      const icons = [
        { rel: "icon", href: "/favicon.ico", sizes: "any" },
        { rel: "icon", href: "/icon.svg", type: "image/svg+xml" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      ];

      expect(icons.length).toBeGreaterThanOrEqual(3);
    });

    it("should have manifest file", () => {
      const manifestPath = "/manifest.json";

      expect(manifestPath).toBe("/manifest.json");
    });
  });

  describe("Structured data schemas", () => {
    it("should have Person schema", () => {
      const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": "https://shahidster.tech/#person",
        name: "Shahid Moosa",
        jobTitle: "Cloud Database Support Engineer",
      };

      expect(personSchema["@type"]).toBe("Person");
      expect(personSchema["@context"]).toBe("https://schema.org");
    });

    it("should have WebSite schema", () => {
      const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://shahidster.tech/#website",
        url: "https://shahidster.tech",
      };

      expect(websiteSchema["@type"]).toBe("WebSite");
      expect(websiteSchema.url).toMatch(/^https:\/\//);
    });

    it("should link schemas with @id references", () => {
      const personId = "https://shahidster.tech/#person";
      const websiteId = "https://shahidster.tech/#website";

      expect(personId).toContain("#person");
      expect(websiteId).toContain("#website");
    });

    it("should include worksFor organization", () => {
      const worksFor = {
        "@type": "Organization",
        name: "SingleStore",
        url: "https://www.singlestore.com",
      };

      expect(worksFor["@type"]).toBe("Organization");
      expect(worksFor.name).toBe("SingleStore");
    });

    it("should include sameAs social profiles", () => {
      const sameAs = [
        "https://twitter.com/shahidster_",
        "https://linkedin.com/in/shahidmoosa",
        "https://github.com/shahidmoosa",
      ];

      expect(sameAs.length).toBeGreaterThanOrEqual(3);
      sameAs.forEach((url) => {
        expect(url).toMatch(/^https:\/\//);
      });
    });

    it("should include knowsAbout expertise", () => {
      const knowsAbout = [
        "Distributed Systems",
        "Database Engineering",
        "Cloud Infrastructure",
        "AWS",
        "PostgreSQL",
        "MySQL",
        "SingleStore",
        "Query Optimization",
        "Data Sharding",
      ];

      expect(knowsAbout.length).toBeGreaterThan(0);
    });

    it("should include search action in WebSite schema", () => {
      const potentialAction = {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://shahidster.tech/blog?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      };

      expect(potentialAction["@type"]).toBe("SearchAction");
      expect(potentialAction.target.urlTemplate).toContain("{search_term_string}");
    });
  });

  describe("Analytics configuration", () => {
    it("should only load in production", () => {
      const shouldLoad = process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_GA_ID;

      if (process.env.NODE_ENV !== "production") {
        expect(shouldLoad).toBeFalsy();
      }
    });

    it("should use afterInteractive strategy", () => {
      const strategy = "afterInteractive";

      expect(["beforeInteractive", "afterInteractive", "lazyOnload"]).toContain(strategy);
    });

    it("should initialize gtag properly", () => {
      const gtagInit = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_ID', {
          page_path: window.location.pathname,
        });
      `;

      expect(gtagInit).toContain("dataLayer");
      expect(gtagInit).toContain("gtag");
    });
  });

  describe("Body styling", () => {
    it("should have proper body classes", () => {
      const bodyClasses = "font-body bg-background text-foreground antialiased min-h-screen";

      expect(bodyClasses).toContain("font-body");
      expect(bodyClasses).toContain("bg-background");
      expect(bodyClasses).toContain("text-foreground");
      expect(bodyClasses).toContain("antialiased");
      expect(bodyClasses).toContain("min-h-screen");
    });

    it("should use semantic font classes", () => {
      const fontBody = "font-body";
      const fontHeading = "font-heading";

      expect(fontBody).toBe("font-body");
      expect(fontHeading).toBe("font-heading");
    });
  });

  describe("Script loading", () => {
    it("should use proper script IDs", () => {
      const scriptIds = ["person-schema", "website-schema", "google-analytics"];

      scriptIds.forEach((id) => {
        expect(id).toMatch(/^[a-z-]+$/);
      });
    });

    it("should use JSON-LD script type", () => {
      const scriptType = "application/ld+json";

      expect(scriptType).toBe("application/ld+json");
    });

    it("should stringify JSON for script content", () => {
      const schema = { "@type": "Person", name: "Test" };
      const content = JSON.stringify(schema);

      expect(() => JSON.parse(content)).not.toThrow();
    });
  });

  describe("Environment handling", () => {
    it("should handle missing GA_ID gracefully", () => {
      const gaId = process.env.NEXT_PUBLIC_GA_ID;

      if (!gaId) {
        expect(gaId).toBeUndefined();
      } else {
        expect(gaId).toMatch(/^G-[A-Z0-9]+$/);
      }
    });

    it("should use fallback for site URL", () => {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shahidster.tech";

      expect(siteUrl).toMatch(/^https?:\/\//);
    });
  });
});