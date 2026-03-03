import { describe, it, expect, vi } from "vitest";

// Mock site config
vi.mock("@/lib/site-config", () => ({
  siteConfig: {
    siteUrl: "https://shahidster.tech",
    title: "Shahid Moosa - Cloud Database Engineer",
    description: "Cloud Database Support Engineer at SingleStore",
    name: "Shahid Moosa",
    ogImage: "/og-image.png",
    locale: "en_US",
    twitterHandle: "@shahidster_",
    titleTemplate: "%s | Shahid Moosa",
    blogTitle: "Shahid Moosa - Distributed Systems Engineering",
    blogDescription:
      "Deep dives into distributed databases, data infrastructure, and production systems.",
    author: {
      name: "Shahid Moosa",
      email: "hello@shahidster.tech",
      jobTitle: "Cloud Database Support Engineer",
    },
    organization: {
      name: "SingleStore",
      url: "https://www.singlestore.com",
    },
    social: {
      twitter: "https://twitter.com/shahidster_",
      linkedin: "https://linkedin.com/in/shahidmoosa",
      github: "https://github.com/shahidmoosa",
    },
  },
}));

describe("Config Validation", () => {
  describe("Site Configuration", () => {
    it("should have valid site URL", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.siteUrl).toBeDefined();
      expect(siteConfig.siteUrl).toMatch(/^https?:\/\//);
      expect(siteConfig.siteUrl).not.toContain("localhost");
    });

    it("should have valid title", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.title).toBeDefined();
      expect(siteConfig.title.length).toBeGreaterThan(0);
      expect(siteConfig.title.length).toBeLessThan(100);
    });

    it("should have valid description", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.description).toBeDefined();
      expect(siteConfig.description.length).toBeGreaterThan(50);
      expect(siteConfig.description.length).toBeLessThan(200);
    });

    it("should have valid OG image path", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.ogImage).toBeDefined();
      expect(siteConfig.ogImage).toMatch(/\.(png|jpg|jpeg|webp)$/i);
    });

    it("should have valid locale", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.locale).toBeDefined();
      expect(siteConfig.locale).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
    });

    it("should have valid Twitter handle", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.twitterHandle).toBeDefined();
      expect(siteConfig.twitterHandle).toMatch(/^@[a-zA-Z0-9_]+$/);
    });

    it("should have title template with placeholder", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.titleTemplate).toBeDefined();
      expect(siteConfig.titleTemplate).toContain("%s");
    });
  });

  describe("Author Configuration", () => {
    it("should have valid author name", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.author.name).toBeDefined();
      expect(siteConfig.author.name.length).toBeGreaterThan(0);
    });

    it("should have valid author email", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.author.email).toBeDefined();
      expect(siteConfig.author.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it("should have valid job title", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.author.jobTitle).toBeDefined();
      expect(siteConfig.author.jobTitle.length).toBeGreaterThan(0);
    });
  });

  describe("Organization Configuration", () => {
    it("should have valid organization name", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.organization.name).toBeDefined();
      expect(siteConfig.organization.name.length).toBeGreaterThan(0);
    });

    it("should have valid organization URL", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.organization.url).toBeDefined();
      expect(siteConfig.organization.url).toMatch(/^https?:\/\//);
    });
  });

  describe("Social Links Configuration", () => {
    it("should have valid Twitter URL", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.social.twitter).toBeDefined();
      expect(siteConfig.social.twitter).toMatch(/^https:\/\/(twitter\.com|x\.com)\//);
    });

    it("should have valid LinkedIn URL", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.social.linkedin).toBeDefined();
      expect(siteConfig.social.linkedin).toMatch(/^https:\/\/linkedin\.com\/in\//);
    });

    it("should have valid GitHub URL", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.social.github).toBeDefined();
      expect(siteConfig.social.github).toMatch(/^https:\/\/github\.com\//);
    });

    it("should have all required social links", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.social).toHaveProperty("twitter");
      expect(siteConfig.social).toHaveProperty("linkedin");
      expect(siteConfig.social).toHaveProperty("github");
    });
  });

  describe("Blog Configuration", () => {
    it("should have valid blog title", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.blogTitle).toBeDefined();
      expect(siteConfig.blogTitle.length).toBeGreaterThan(0);
    });

    it("should have valid blog description", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.blogDescription).toBeDefined();
      expect(siteConfig.blogDescription.length).toBeGreaterThan(0);
    });
  });

  describe("Configuration Consistency", () => {
    it("should have consistent author name across configs", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.name).toBe(siteConfig.author.name);
    });

    it("should have consistent domain in URLs", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      const domain = new URL(siteConfig.siteUrl).hostname;
      expect(domain).toMatch(/shahidster\.tech/);
    });

    it("should have all required configuration fields", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      const requiredFields = [
        "siteUrl",
        "title",
        "description",
        "name",
        "ogImage",
        "locale",
        "twitterHandle",
        "titleTemplate",
        "author",
        "organization",
        "social",
      ];

      requiredFields.forEach((field) => {
        expect(siteConfig).toHaveProperty(field);
      });
    });

    it("should not have trailing slashes in URLs", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.siteUrl).not.toMatch(/\/$/);
      expect(siteConfig.organization.url).not.toMatch(/\/$/);
    });

    it("should use HTTPS for all URLs", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.siteUrl).toMatch(/^https:\/\//);
      expect(siteConfig.organization.url).toMatch(/^https:\/\//);
      expect(siteConfig.social.twitter).toMatch(/^https:\/\//);
      expect(siteConfig.social.linkedin).toMatch(/^https:\/\//);
      expect(siteConfig.social.github).toMatch(/^https:\/\//);
    });
  });

  describe("SEO Configuration", () => {
    it("should have appropriate title length for SEO", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      // Google typically displays 50-60 characters
      expect(siteConfig.title.length).toBeLessThanOrEqual(60);
    });

    it("should have appropriate description length for SEO", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      // Google typically displays 150-160 characters
      expect(siteConfig.description.length).toBeGreaterThan(50);
      expect(siteConfig.description.length).toBeLessThanOrEqual(160);
    });

    it("should not have duplicate keywords in title and description", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      const titleWords = siteConfig.title.toLowerCase().split(/\s+/);
      const descWords = siteConfig.description.toLowerCase().split(/\s+/);

      // At least some unique words in description
      const uniqueInDesc = descWords.filter((word) => !titleWords.includes(word));
      expect(uniqueInDesc.length).toBeGreaterThan(0);
    });
  });

  describe("Image paths", () => {
    it("should use relative paths for local images", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.ogImage).toMatch(/^\//);
      expect(siteConfig.ogImage).not.toMatch(/^https?:\/\//);
    });

    it("should use common image formats", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.ogImage).toMatch(/\.(png|jpg|jpeg|webp|gif)$/i);
    });
  });

  describe("Twitter/X handle format", () => {
    it("should start with @ symbol", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.twitterHandle).toMatch(/^@/);
    });

    it("should not contain spaces", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.twitterHandle).not.toMatch(/\s/);
    });

    it("should contain valid characters only", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.twitterHandle).toMatch(/^@[a-zA-Z0-9_]+$/);
    });
  });

  describe("Locale format", () => {
    it("should follow language_COUNTRY format", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.locale).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
    });

    it("should use underscore separator", async () => {
      const { siteConfig } = await import("@/lib/site-config");

      expect(siteConfig.locale).toContain("_");
      expect(siteConfig.locale).not.toContain("-");
    });
  });
});