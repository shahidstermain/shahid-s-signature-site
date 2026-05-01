/**
 * Tests for README.md documentation
 */

import { describe, it, expect, beforeAll } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("README.md", () => {
  const readmePath = path.join(process.cwd(), "README.md");
  let readmeContent: string;

  beforeAll(() => {
    readmeContent = fs.readFileSync(readmePath, "utf-8");
  });

  describe("Basic Structure", () => {
    it("should exist", () => {
      expect(fs.existsSync(readmePath)).toBe(true);
    });

    it("should not be empty", () => {
      expect(readmeContent.length).toBeGreaterThan(0);
    });

    it("should have a title", () => {
      expect(readmeContent).toMatch(/^#\s+/m);
    });

    it("should be written in Markdown", () => {
      expect(path.extname(readmePath)).toBe(".md");
    });
  });

  describe("Content Quality", () => {
    it("should have project description", () => {
      // Should contain project name or description
      expect(readmeContent.toLowerCase()).toMatch(/project|lovable|shahidster/);
    });

    it("should have installation instructions", () => {
      expect(readmeContent.toLowerCase()).toContain("install");
      expect(readmeContent).toContain("npm");
    });

    it("should have usage instructions", () => {
      expect(readmeContent).toMatch(/npm run dev|npm start/);
    });

    it("should mention technologies used", () => {
      // Should mention the tech stack
      const hasTech =
        readmeContent.toLowerCase().includes("react") ||
        readmeContent.toLowerCase().includes("vite") ||
        readmeContent.toLowerCase().includes("typescript");
      expect(hasTech).toBe(true);
    });

    it("should not have placeholder text (except project ID)", () => {
      // Allow REPLACE_WITH_PROJECT_ID as it's a Lovable template
      const withoutProjectId = readmeContent.replace(/REPLACE_WITH_PROJECT_ID/g, "");
      expect(withoutProjectId.toUpperCase()).not.toContain("TODO");
      expect(withoutProjectId.toUpperCase()).not.toContain("REPLACE_WITH");
    });
  });

  describe("Markdown Formatting", () => {
    it("should use proper heading hierarchy", () => {
      const headings = readmeContent.match(/^#{1,6}\s+/gm) || [];
      expect(headings.length).toBeGreaterThan(0);

      // First heading should be H1
      expect(readmeContent).toMatch(/^#\s+[^#]/m);
    });

    it("should have code blocks for commands", () => {
      // Should use ``` for code blocks
      expect(readmeContent).toContain("```");
    });

    it("should format npm commands correctly", () => {
      const codeBlocks = readmeContent.match(/```[\s\S]*?```/g) || [];
      const hasNpmCommands = codeBlocks.some(
        (block) => block.includes("npm") || block.includes("git")
      );
      expect(hasNpmCommands).toBe(true);
    });

    it("should not have broken links", () => {
      const links = readmeContent.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
      links.forEach((link) => {
        const urlMatch = link.match(/\(([^)]+)\)/);
        if (urlMatch) {
          const url = urlMatch[1];
          // URL should not be empty or just #
          expect(url.trim()).not.toBe("");
          expect(url.trim()).not.toBe("#");
        }
      });
    });
  });

  describe("Setup Instructions", () => {
    it("should include clone command", () => {
      expect(readmeContent).toContain("git clone");
    });

    it("should include npm install command", () => {
      expect(readmeContent).toMatch(/npm i|npm install/);
    });

    it("should include dev server command", () => {
      expect(readmeContent).toContain("npm run dev");
    });

    it("should provide step-by-step instructions", () => {
      // Should have numbered steps or clear sections
      const hasSteps =
        readmeContent.includes("Step") ||
        readmeContent.match(/^1\./m) ||
        readmeContent.includes("##");
      expect(hasSteps).toBe(true);
    });
  });

  describe("Technologies Mentioned", () => {
    it("should mention Vite", () => {
      expect(readmeContent).toContain("Vite");
    });

    it("should mention React", () => {
      expect(readmeContent).toContain("React");
    });

    it("should mention TypeScript", () => {
      expect(readmeContent).toContain("TypeScript");
    });

    it("should mention Tailwind CSS", () => {
      expect(readmeContent).toContain("Tailwind");
    });
  });

  describe("Deployment Information", () => {
    it("should mention deployment options", () => {
      const hasDeployment =
        readmeContent.toLowerCase().includes("deploy") ||
        readmeContent.toLowerCase().includes("publish");
      expect(hasDeployment).toBe(true);
    });

    it("should reference Lovable platform", () => {
      expect(readmeContent).toContain("Lovable");
      expect(readmeContent).toContain("lovable.dev");
    });
  });

  describe("Best Practices", () => {
    it("should not have excessive line length", () => {
      const lines = readmeContent.split("\n");
      const longLines = lines.filter((line) => {
        // Ignore code blocks and links
        return (
          !line.trim().startsWith("```") &&
          !line.includes("http") &&
          line.length > 120
        );
      });
      // Most lines should be reasonably short for readability
      expect(longLines.length).toBeLessThan(lines.length * 0.2);
    });

    it("should use consistent markdown style", () => {
      // Should not mix heading styles
      const atxHeadings = (readmeContent.match(/^#{1,6}\s+/gm) || []).length;
      const setextHeadings = (readmeContent.match(/^[=\-]{3,}$/gm) || []).length;

      // Should primarily use one style (ATX is preferred)
      if (atxHeadings > 0) {
        expect(atxHeadings).toBeGreaterThan(setextHeadings);
      }
    });

    it("should have proper spacing", () => {
      // Should not have excessive blank lines
      expect(readmeContent).not.toMatch(/\n{4,}/);
    });
  });

  describe("Links and Resources", () => {
    it("should have valid URL format for external links", () => {
      const urls = readmeContent.match(/https?:\/\/[^\s\)]+/g) || [];
      urls.forEach((url) => {
        expect(url).toMatch(/^https?:\/\/.+/);
      });
    });

    it("should include project URL if available", () => {
      if (readmeContent.includes("URL:")) {
        expect(readmeContent).toMatch(/https:\/\/lovable\.dev/);
      }
    });

    it("should not have broken internal anchors", () => {
      const anchorLinks = readmeContent.match(/\[([^\]]+)\]\(#([^)]+)\)/g) || [];
      anchorLinks.forEach((link) => {
        const anchorMatch = link.match(/#([^)]+)/);
        if (anchorMatch) {
          const anchor = anchorMatch[1];
          // Anchor should not be empty
          expect(anchor.trim()).not.toBe("");
        }
      });
    });
  });

  describe("Content Completeness", () => {
    it("should have sections for major topics", () => {
      const hasProjectInfo =
        readmeContent.toLowerCase().includes("project") ||
        readmeContent.toLowerCase().includes("about");
      const hasInstall =
        readmeContent.toLowerCase().includes("install") ||
        readmeContent.toLowerCase().includes("setup");
      const hasTechnologies =
        readmeContent.toLowerCase().includes("technolog") ||
        readmeContent.toLowerCase().includes("built with");

      expect(hasProjectInfo || hasInstall || hasTechnologies).toBe(true);
    });

    it("should not be a boilerplate template", () => {
      // Should have customized content (allow Lovable template placeholders)
      const withoutLovablePlaceholders = readmeContent
        .replace(/REPLACE_WITH_PROJECT_ID/g, "")
        .replace(/YOUR_GIT_URL/g, "")
        .replace(/YOUR_PROJECT_NAME/g, "");

      // Should still have meaningful content after removing placeholders
      expect(withoutLovablePlaceholders.length).toBeGreaterThan(500);
      expect(withoutLovablePlaceholders).toContain("Lovable");
    });

    it("should provide value to developers", () => {
      // Should have actionable information
      const hasActionableInfo =
        readmeContent.includes("npm") ||
        readmeContent.includes("git") ||
        readmeContent.includes("install");
      expect(hasActionableInfo).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle special characters correctly", () => {
      // Should not have unescaped special markdown chars in text
      const codeBlocks = readmeContent.match(/```[\s\S]*?```/g) || [];
      const withoutCodeBlocks = readmeContent.replace(/```[\s\S]*?```/g, "");

      // Backticks outside code blocks should be paired
      const backticks = (withoutCodeBlocks.match(/`/g) || []).length;
      expect(backticks % 2).toBe(0);
    });

    it("should not have Windows line endings", () => {
      expect(readmeContent).not.toContain("\r\n");
    });

    it("should end with a newline", () => {
      expect(readmeContent.endsWith("\n")).toBe(true);
    });

    it("should not have trailing whitespace", () => {
      const lines = readmeContent.split("\n");
      const linesWithTrailingSpace = lines.filter(
        (line) => line.length > 0 && line !== line.trimEnd()
      );
      expect(linesWithTrailingSpace.length).toBe(0);
    });
  });

  describe("Accessibility", () => {
    it("should have descriptive link text", () => {
      const links = readmeContent.match(/\[([^\]]+)\]/g) || [];
      // Link text should not be just "here" or "click"
      const poorLinkText = links.filter(
        (link) =>
          link.toLowerCase() === "[here]" ||
          link.toLowerCase() === "[click]" ||
          link.toLowerCase() === "[link]"
      );
      expect(poorLinkText.length).toBe(0);
    });

    it("should provide context for code examples", () => {
      const codeBlocks = readmeContent.match(/```[\s\S]*?```/g) || [];
      if (codeBlocks.length > 0) {
        // Most code blocks should have language specified
        const blocksWithLang = codeBlocks.filter((block) =>
          block.match(/```\w+/)
        );
        expect(blocksWithLang.length).toBeGreaterThan(0);
      }
    });
  });
});