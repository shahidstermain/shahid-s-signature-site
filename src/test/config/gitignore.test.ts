/**
 * Tests for .gitignore configuration
 */

import { describe, it, expect, beforeAll } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe(".gitignore Configuration", () => {
  const gitignorePath = path.join(process.cwd(), ".gitignore");
  let gitignoreContent: string;
  let gitignoreLines: string[];

  beforeAll(() => {
    gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
    gitignoreLines = gitignoreContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));
  });

  describe("Basic Structure", () => {
    it("should exist as a file", () => {
      expect(fs.existsSync(gitignorePath)).toBe(true);
    });

    it("should not be empty", () => {
      expect(gitignoreContent.length).toBeGreaterThan(0);
      expect(gitignoreLines.length).toBeGreaterThan(0);
    });

    it("should have valid format (no syntax errors)", () => {
      // Lines should either be comments, empty, or valid patterns
      const lines = gitignoreContent.split("\n");
      lines.forEach((line) => {
        const trimmed = line.trim();
        // Empty lines and comments are valid
        if (trimmed === "" || trimmed.startsWith("#")) {
          expect(true).toBe(true);
        } else {
          // Should not contain invalid characters like quotes or semicolons
          expect(trimmed).not.toMatch(/[";]/);
        }
      });
    });
  });

  describe("Log Files", () => {
    it("should ignore logs directory", () => {
      expect(gitignoreLines).toContain("logs");
    });

    it("should ignore all .log files", () => {
      expect(gitignoreLines).toContain("*.log");
    });

    it("should ignore npm debug logs", () => {
      expect(gitignoreLines).toContain("npm-debug.log*");
    });

    it("should ignore yarn debug logs", () => {
      expect(gitignoreLines).toContain("yarn-debug.log*");
      expect(gitignoreLines).toContain("yarn-error.log*");
    });

    it("should ignore pnpm debug logs", () => {
      expect(gitignoreLines).toContain("pnpm-debug.log*");
    });

    it("should ignore lerna debug logs", () => {
      expect(gitignoreLines).toContain("lerna-debug.log*");
    });
  });

  describe("Dependencies", () => {
    it("should ignore node_modules", () => {
      expect(gitignoreLines).toContain("node_modules");
    });
  });

  describe("Build Outputs", () => {
    it("should ignore dist directory", () => {
      expect(gitignoreLines).toContain("dist");
    });

    it("should ignore dist-ssr directory", () => {
      expect(gitignoreLines).toContain("dist-ssr");
    });

    it("should ignore local files", () => {
      expect(gitignoreLines).toContain("*.local");
    });
  });

  describe("Editor and IDE Files", () => {
    it("should ignore .vscode directory except extensions.json", () => {
      expect(gitignoreLines).toContain(".vscode/*");
      expect(gitignoreLines).toContain("!.vscode/extensions.json");
    });

    it("should ignore .idea directory", () => {
      expect(gitignoreLines).toContain(".idea");
    });

    it("should ignore .DS_Store (macOS)", () => {
      expect(gitignoreLines).toContain(".DS_Store");
    });

    it("should ignore Visual Studio files", () => {
      expect(gitignoreLines).toContain("*.suo");
      expect(gitignoreLines).toContain("*.ntvs*");
      expect(gitignoreLines).toContain("*.njsproj");
      expect(gitignoreLines).toContain("*.sln");
      expect(gitignoreLines).toContain("*.sw?");
    });
  });

  describe("Security and Best Practices", () => {
    it("should not accidentally ignore important config files", () => {
      // These files should NOT be in gitignore
      expect(gitignoreLines).not.toContain("package.json");
      expect(gitignoreLines).not.toContain("package-lock.json");
      expect(gitignoreLines).not.toContain(".gitignore");
      expect(gitignoreLines).not.toContain("README.md");
      expect(gitignoreLines).not.toContain("tsconfig.json");
    });

    it("should not ignore the entire src directory", () => {
      expect(gitignoreLines).not.toContain("src");
      expect(gitignoreLines).not.toContain("src/");
    });

    it("should not contain absolute paths", () => {
      gitignoreLines.forEach((line) => {
        // Gitignore patterns should be relative
        expect(line).not.toMatch(/^[/\\]/);
        expect(line).not.toMatch(/^[A-Z]:/); // Windows drive letter
      });
    });

    it("should not have trailing whitespace", () => {
      const lines = gitignoreContent.split("\n");
      lines.forEach((line) => {
        if (line.trim() !== "") {
          expect(line).toBe(line.trimEnd());
        }
      });
    });
  });

  describe("Common Patterns", () => {
    it("should use wildcards for flexible matching", () => {
      const hasWildcards = gitignoreLines.some((line) => line.includes("*"));
      expect(hasWildcards).toBe(true);
    });

    it("should have negation patterns for exceptions", () => {
      const hasNegations = gitignoreLines.some((line) => line.startsWith("!"));
      expect(hasNegations).toBe(true);
    });

    it("should not have duplicate patterns", () => {
      const uniqueLines = new Set(gitignoreLines);
      expect(gitignoreLines.length).toBe(uniqueLines.size);
    });
  });

  describe("Coverage of Common Files", () => {
    it("should cover all common log file types", () => {
      // Should have patterns for different package managers
      const logPatterns = gitignoreLines.filter(
        (line) => line.includes("log") || line.includes("logs")
      );
      expect(logPatterns.length).toBeGreaterThan(3);
    });

    it("should cover build artifacts", () => {
      const buildPatterns = gitignoreLines.filter(
        (line) => line.includes("dist") || line.includes("build")
      );
      expect(buildPatterns.length).toBeGreaterThan(0);
    });

    it("should cover editor configurations", () => {
      const editorPatterns = gitignoreLines.filter(
        (line) =>
          line.includes(".vscode") ||
          line.includes(".idea") ||
          line.includes(".DS_Store")
      );
      expect(editorPatterns.length).toBeGreaterThan(0);
    });
  });

  describe("File Organization", () => {
    it("should have comments for grouping (if present)", () => {
      const hasComments = gitignoreContent.includes("#");
      if (hasComments) {
        // Comments should provide context
        const commentLines = gitignoreContent
          .split("\n")
          .filter((line) => line.trim().startsWith("#"));
        expect(commentLines.length).toBeGreaterThan(0);
      }
    });

    it("should be readable and well-formatted", () => {
      // Should not have excessive blank lines (more than 2 in a row)
      expect(gitignoreContent).not.toMatch(/\n\s*\n\s*\n\s*\n/);
    });
  });

  describe("Edge Cases", () => {
    it("should handle files with multiple extensions", () => {
      // Patterns like *.tar.gz should work
      const multiExtPatterns = gitignoreLines.filter((line) =>
        line.match(/\*\.\w+\.\w+/)
      );
      // It's okay if there are none, but if present, they should be valid
      expect(multiExtPatterns.every((p) => p.includes("*"))).toBe(true);
    });

    it("should not contain invalid glob patterns", () => {
      gitignoreLines.forEach((line) => {
        // Should not have unmatched brackets or invalid regex
        if (line.includes("[")) {
          expect(line).toMatch(/\[.*\]/);
        }
      });
    });

    it("should preserve .vscode/extensions.json", () => {
      // Should explicitly not ignore this file
      expect(gitignoreContent).toContain("!.vscode/extensions.json");
    });
  });

  describe("Platform Compatibility", () => {
    it("should work on Unix and Windows", () => {
      // Should not contain platform-specific path separators in patterns
      gitignoreLines.forEach((line) => {
        if (!line.startsWith("!")) {
          // Backslashes should only be for escaping
          const backslashes = line.match(/\\/g) || [];
          backslashes.forEach((_, index) => {
            // If there's a backslash, it should be escaping something
            if (index < line.length - 1) {
              expect(["*", "?", "[", "]", "!", "#"]).toContain(
                line[index + 1]
              );
            }
          });
        }
      });
    });

    it("should not have CRLF line endings", () => {
      // Should use LF (\n) not CRLF (\r\n)
      expect(gitignoreContent).not.toContain("\r\n");
    });
  });

  describe("Essential Ignores", () => {
    it("should ignore node_modules for performance", () => {
      expect(gitignoreLines).toContain("node_modules");
    });

    it("should ignore build output directories", () => {
      const hasDist = gitignoreLines.includes("dist");
      const hasDistSsr = gitignoreLines.includes("dist-ssr");
      expect(hasDist || hasDistSsr).toBe(true);
    });

    it("should ignore OS-specific files", () => {
      const hasDS_Store = gitignoreLines.includes(".DS_Store");
      expect(hasDS_Store).toBe(true);
    });
  });

  describe("Regression Tests", () => {
    it("should not accidentally ignore test files", () => {
      expect(gitignoreLines).not.toContain("*.test.ts");
      expect(gitignoreLines).not.toContain("*.spec.ts");
      expect(gitignoreLines).not.toContain("__tests__");
    });

    it("should not ignore TypeScript source files", () => {
      expect(gitignoreLines).not.toContain("*.ts");
      expect(gitignoreLines).not.toContain("*.tsx");
    });

    it("should not ignore configuration files", () => {
      expect(gitignoreLines).not.toContain("*.json");
      expect(gitignoreLines).not.toContain("*.yml");
      expect(gitignoreLines).not.toContain("*.yaml");
    });

    it("should be consistent with project structure", () => {
      // If firebase.json exists, it shouldn't be ignored
      const firebaseJsonPath = path.join(process.cwd(), "firebase.json");
      if (fs.existsSync(firebaseJsonPath)) {
        expect(gitignoreLines).not.toContain("firebase.json");
      }
    });
  });
});