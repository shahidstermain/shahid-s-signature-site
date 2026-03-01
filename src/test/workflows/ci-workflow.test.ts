/**
 * Tests for GitHub Actions CI workflow configuration
 */

import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

interface ParsedYaml {
  name?: string;
  branches?: string[];
}

// Helper to parse YAML (simple key-value extraction for testing)
function parseYaml(content: string): ParsedYaml {
  const lines = content.split("\n");
  const result: ParsedYaml = {};
  let currentKey = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("name:")) {
      result.name = trimmed.split("name:")[1].trim();
    }
    if (trimmed.includes("branches:")) {
      currentKey = "branches";
      result.branches = [];
    } else if (currentKey === "branches" && trimmed.startsWith("- ")) {
      result.branches.push(trimmed.substring(2).trim());
    }
  }

  return result;
}

describe("GitHub Actions CI Workflow", () => {
  const workflowPath = path.join(process.cwd(), ".github/workflows/ci.yml");
  let workflowContent: string;

  beforeAll(() => {
    workflowContent = fs.readFileSync(workflowPath, "utf-8");
  });

  describe("Basic Configuration", () => {
    it("should exist as a file", () => {
      expect(fs.existsSync(workflowPath)).toBe(true);
    });

    it("should have workflow name", () => {
      expect(workflowContent).toContain("name:");
      expect(workflowContent).toContain("CI");
    });

    it("should trigger on push to main", () => {
      expect(workflowContent).toContain("push:");
      expect(workflowContent).toContain("- main");
    });

    it("should trigger on pull requests to main", () => {
      expect(workflowContent).toContain("pull_request:");
      expect(workflowContent).toContain("branches:");
      expect(workflowContent).toContain("- main");
    });

    it("should also trigger on cursor/** branches", () => {
      expect(workflowContent).toContain("- 'cursor/**'");
    });
  });

  describe("Jobs Configuration", () => {
    it("should have lint job", () => {
      expect(workflowContent).toContain("lint:");
      expect(workflowContent).toContain("name: Lint");
    });

    it("should have test job", () => {
      expect(workflowContent).toContain("test:");
      expect(workflowContent).toContain("name: Test");
    });

    it("should have build job", () => {
      expect(workflowContent).toContain("build:");
      expect(workflowContent).toContain("name: Build");
    });

    it("should have lighthouse job", () => {
      expect(workflowContent).toContain("lighthouse:");
      expect(workflowContent).toContain("name: Lighthouse Audit");
    });

    it("should run all jobs on ubuntu-latest", () => {
      const ubuntuCount = (workflowContent.match(/runs-on: ubuntu-latest/g) || []).length;
      expect(ubuntuCount).toBeGreaterThanOrEqual(4);
    });
  });

  describe("Lint Job", () => {
    it("should checkout repository", () => {
      const lintSection = workflowContent.split("lint:")[1].split("test:")[0];
      expect(lintSection).toContain("Checkout repository");
      expect(lintSection).toContain("actions/checkout@v4");
    });

    it("should setup Node.js", () => {
      const lintSection = workflowContent.split("lint:")[1].split("test:")[0];
      expect(lintSection).toContain("Setup Node.js");
      expect(lintSection).toContain("actions/setup-node@v4");
    });

    it("should use Node.js version 20", () => {
      const lintSection = workflowContent.split("lint:")[1].split("test:")[0];
      expect(lintSection).toContain("node-version: '20'");
    });

    it("should cache npm dependencies", () => {
      const lintSection = workflowContent.split("lint:")[1].split("test:")[0];
      expect(lintSection).toContain("cache: 'npm'");
    });

    it("should install dependencies with npm ci", () => {
      const lintSection = workflowContent.split("lint:")[1].split("test:")[0];
      expect(lintSection).toContain("npm ci");
    });

    it("should run ESLint", () => {
      const lintSection = workflowContent.split("lint:")[1].split("test:")[0];
      expect(lintSection).toContain("npm run lint");
    });
  });

  describe("Test Job", () => {
    it("should checkout repository", () => {
      const testSection = workflowContent.split("test:")[1].split("build:")[0];
      expect(testSection).toContain("Checkout repository");
    });

    it("should setup Node.js with caching", () => {
      const testSection = workflowContent.split("test:")[1].split("build:")[0];
      expect(testSection).toContain("Setup Node.js");
      expect(testSection).toContain("cache: 'npm'");
    });

    it("should run tests", () => {
      const testSection = workflowContent.split("test:")[1].split("build:")[0];
      expect(testSection).toContain("npm run test");
    });
  });

  describe("Build Job", () => {
    it("should checkout repository", () => {
      const buildSection = workflowContent.split("build:")[1].split("lighthouse:")[0];
      expect(buildSection).toContain("Checkout repository");
    });

    it("should build the project", () => {
      const buildSection = workflowContent.split("build:")[1].split("lighthouse:")[0];
      expect(buildSection).toContain("npm run build");
    });

    it("should upload build artifacts", () => {
      const buildSection = workflowContent.split("build:")[1].split("lighthouse:")[0];
      expect(buildSection).toContain("Upload build artifacts");
      expect(buildSection).toContain("actions/upload-artifact@v4");
    });

    it("should upload dist directory", () => {
      const buildSection = workflowContent.split("build:")[1].split("lighthouse:")[0];
      expect(buildSection).toContain("name: dist");
      expect(buildSection).toContain("path: dist/");
    });

    it("should retain artifacts for 7 days", () => {
      const buildSection = workflowContent.split("build:")[1].split("lighthouse:")[0];
      expect(buildSection).toContain("retention-days: 7");
    });
  });

  describe("Lighthouse Job", () => {
    it("should depend on build job", () => {
      const lighthouseSection = workflowContent.split("lighthouse:")[1];
      expect(lighthouseSection).toContain("needs: build");
    });

    it("should download build artifacts", () => {
      const lighthouseSection = workflowContent.split("lighthouse:")[1];
      expect(lighthouseSection).toContain("Download build artifacts");
      expect(lighthouseSection).toContain("actions/download-artifact@v4");
    });

    it("should run Lighthouse CI", () => {
      const lighthouseSection = workflowContent.split("lighthouse:")[1];
      expect(lighthouseSection).toContain("Run Lighthouse CI");
      expect(lighthouseSection).toContain("treosh/lighthouse-ci-action@v11");
    });

    it("should upload Lighthouse artifacts", () => {
      const lighthouseSection = workflowContent.split("lighthouse:")[1];
      expect(lighthouseSection).toContain("uploadArtifacts: true");
    });

    it("should use temporary public storage", () => {
      const lighthouseSection = workflowContent.split("lighthouse:")[1];
      expect(lighthouseSection).toContain("temporaryPublicStorage: true");
    });

    it("should use lighthouse config file", () => {
      const lighthouseSection = workflowContent.split("lighthouse:")[1];
      expect(lighthouseSection).toContain("configPath: ./lighthouserc.json");
    });

    it("should continue on error", () => {
      const lighthouseSection = workflowContent.split("lighthouse:")[1];
      expect(lighthouseSection).toContain("continue-on-error: true");
    });
  });

  describe("Best Practices", () => {
    it("should use latest action versions", () => {
      expect(workflowContent).toContain("@v4"); // checkout and setup-node
      expect(workflowContent).toContain("@v11"); // lighthouse
    });

    it("should use npm ci instead of npm install", () => {
      expect(workflowContent).toContain("npm ci");
      expect(workflowContent).not.toContain("npm install");
    });

    it("should cache dependencies for performance", () => {
      const cacheCount = (workflowContent.match(/cache: 'npm'/g) || []).length;
      expect(cacheCount).toBeGreaterThanOrEqual(3);
    });

    it("should specify exact Node.js version", () => {
      expect(workflowContent).toContain("node-version: '20'");
    });
  });

  describe("Job Dependencies", () => {
    it("should not have circular dependencies", () => {
      // Lighthouse depends on build
      const lighthouseSection = workflowContent.split("lighthouse:")[1];
      expect(lighthouseSection).toContain("needs: build");

      // Build should not depend on lighthouse
      const buildSection = workflowContent.split("build:")[1].split("lighthouse:")[0];
      expect(buildSection).not.toContain("needs: lighthouse");
    });

    it("should allow lint and test to run in parallel", () => {
      const lintSection = workflowContent.split("lint:")[1].split("test:")[0];
      const testSection = workflowContent.split("test:")[1].split("build:")[0];

      // Neither should depend on the other
      expect(lintSection).not.toContain("needs:");
      expect(testSection).not.toContain("needs:");
    });
  });
});