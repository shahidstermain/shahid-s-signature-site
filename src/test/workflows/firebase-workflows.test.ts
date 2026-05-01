/**
 * Tests for Firebase Hosting deployment workflows
 */

import { describe, it, expect, beforeAll } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Firebase Hosting Workflows", () => {
  describe("Production Deployment (Merge)", () => {
    const workflowPath = path.join(
      process.cwd(),
      ".github/workflows/firebase-hosting-merge.yml"
    );
    let workflowContent: string;

    beforeAll(() => {
      workflowContent = fs.readFileSync(workflowPath, "utf-8");
    });

    it("should exist as a file", () => {
      expect(fs.existsSync(workflowPath)).toBe(true);
    });

    it("should have descriptive name", () => {
      expect(workflowContent).toContain("name:");
      expect(workflowContent).toContain("Production");
    });

    it("should trigger only on push to main", () => {
      expect(workflowContent).toContain("on:");
      expect(workflowContent).toContain("push:");
      expect(workflowContent).toContain("- main");
    });

    it("should not trigger on pull requests", () => {
      expect(workflowContent).not.toContain("pull_request:");
    });

    it("should run on ubuntu-latest", () => {
      expect(workflowContent).toContain("runs-on: ubuntu-latest");
    });

    it("should checkout repository", () => {
      expect(workflowContent).toContain("Checkout repository");
      expect(workflowContent).toContain("actions/checkout@v4");
    });

    it("should setup Node.js version 20", () => {
      expect(workflowContent).toContain("Setup Node.js");
      expect(workflowContent).toContain("actions/setup-node@v4");
      expect(workflowContent).toContain("node-version: '20'");
    });

    it("should cache npm dependencies", () => {
      expect(workflowContent).toContain("cache: 'npm'");
    });

    it("should install dependencies with npm ci", () => {
      expect(workflowContent).toContain("npm ci");
    });

    it("should run linting", () => {
      expect(workflowContent).toContain("npm run lint");
    });

    it("should run tests", () => {
      expect(workflowContent).toContain("npm run test");
    });

    it("should build project with production env", () => {
      expect(workflowContent).toContain("npm run build");
      expect(workflowContent).toContain("NODE_ENV: production");
    });

    it("should deploy to Firebase with live channel", () => {
      expect(workflowContent).toContain("FirebaseExtended/action-hosting-deploy");
      expect(workflowContent).toContain("channelId: live");
    });

    it("should use GitHub token for deployment", () => {
      expect(workflowContent).toContain("repoToken: '${{ secrets.GITHUB_TOKEN }}'");
    });

    it("should use Firebase service account", () => {
      expect(workflowContent).toContain("firebaseServiceAccount:");
      expect(workflowContent).toContain("FIREBASE_SERVICE_ACCOUNT");
    });

    it("should use Firebase project ID from secrets", () => {
      expect(workflowContent).toContain("projectId:");
      expect(workflowContent).toContain("FIREBASE_PROJECT_ID");
    });

    it("should allow lint to fail without blocking deployment", () => {
      const lintSection = workflowContent.split("Run linting")[1].split("Run tests")[0];
      expect(lintSection).toContain("continue-on-error: true");
    });

    it("should allow tests to fail without blocking deployment", () => {
      const testSection = workflowContent.split("Run tests")[1].split("Build project")[0];
      expect(testSection).toContain("continue-on-error: true");
    });
  });

  describe("Preview Deployment (Pull Request)", () => {
    const workflowPath = path.join(
      process.cwd(),
      ".github/workflows/firebase-hosting-pull-request.yml"
    );
    let workflowContent: string;

    beforeAll(() => {
      workflowContent = fs.readFileSync(workflowPath, "utf-8");
    });

    it("should exist as a file", () => {
      expect(fs.existsSync(workflowPath)).toBe(true);
    });

    it("should have descriptive name indicating preview", () => {
      expect(workflowContent).toContain("name:");
      expect(workflowContent).toContain("Preview");
    });

    it("should trigger only on pull requests to main", () => {
      expect(workflowContent).toContain("on:");
      expect(workflowContent).toContain("pull_request:");
      expect(workflowContent).toContain("- main");
    });

    it("should not trigger on push", () => {
      const onSection = workflowContent.split("on:")[1].split("jobs:")[0];
      expect(onSection).not.toContain("push:");
    });

    it("should only run for same-repo PRs", () => {
      expect(workflowContent).toContain("if:");
      expect(workflowContent).toContain("github.event.pull_request.head.repo.full_name");
      expect(workflowContent).toContain("github.repository");
    });

    it("should checkout repository", () => {
      expect(workflowContent).toContain("Checkout repository");
      expect(workflowContent).toContain("actions/checkout@v4");
    });

    it("should setup Node.js version 20", () => {
      expect(workflowContent).toContain("node-version: '20'");
    });

    it("should install dependencies", () => {
      expect(workflowContent).toContain("npm ci");
    });

    it("should run linting", () => {
      expect(workflowContent).toContain("npm run lint");
    });

    it("should run tests", () => {
      expect(workflowContent).toContain("npm run test");
    });

    it("should build with production environment", () => {
      expect(workflowContent).toContain("npm run build");
      expect(workflowContent).toContain("NODE_ENV: production");
    });

    it("should deploy preview to Firebase", () => {
      expect(workflowContent).toContain("Deploy Preview to Firebase Hosting");
      expect(workflowContent).toContain("FirebaseExtended/action-hosting-deploy");
    });

    it("should NOT specify channelId (creates preview channel)", () => {
      const deploySection = workflowContent.split("Deploy Preview")[1];
      expect(deploySection).not.toContain("channelId: live");
      // Comment should explain this
      expect(workflowContent).toContain("preview channel");
    });

    it("should use GitHub token", () => {
      expect(workflowContent).toContain("repoToken: '${{ secrets.GITHUB_TOKEN }}'");
    });

    it("should use Firebase service account from secrets", () => {
      expect(workflowContent).toContain("firebaseServiceAccount:");
      expect(workflowContent).toContain("FIREBASE_SERVICE_ACCOUNT");
    });

    it("should use Firebase project ID from secrets", () => {
      expect(workflowContent).toContain("projectId:");
      expect(workflowContent).toContain("FIREBASE_PROJECT_ID");
    });

    it("should allow lint to fail without blocking preview", () => {
      const lintSection = workflowContent.split("Run linting")[1].split("Run tests")[0];
      expect(lintSection).toContain("continue-on-error: true");
    });

    it("should allow tests to fail without blocking preview", () => {
      const testSection = workflowContent.split("Run tests")[1].split("Build project")[0];
      expect(testSection).toContain("continue-on-error: true");
    });
  });

  describe("Workflow Best Practices", () => {
    it("should use consistent Node.js version across workflows", () => {
      const mergePath = path.join(
        process.cwd(),
        ".github/workflows/firebase-hosting-merge.yml"
      );
      const prPath = path.join(
        process.cwd(),
        ".github/workflows/firebase-hosting-pull-request.yml"
      );

      const mergeContent = fs.readFileSync(mergePath, "utf-8");
      const prContent = fs.readFileSync(prPath, "utf-8");

      const mergeNodeVersion = mergeContent.match(/node-version: '(\d+)'/)?.[1];
      const prNodeVersion = prContent.match(/node-version: '(\d+)'/)?.[1];

      expect(mergeNodeVersion).toBe(prNodeVersion);
      expect(mergeNodeVersion).toBe("20");
    });

    it("should use latest GitHub Actions versions", () => {
      const mergePath = path.join(
        process.cwd(),
        ".github/workflows/firebase-hosting-merge.yml"
      );
      const mergeContent = fs.readFileSync(mergePath, "utf-8");

      expect(mergeContent).toContain("@v4"); // checkout and setup-node
      expect(mergeContent).toContain("@v0"); // Firebase action
    });

    it("should not expose secrets in workflow files", () => {
      const mergePath = path.join(
        process.cwd(),
        ".github/workflows/firebase-hosting-merge.yml"
      );
      const prPath = path.join(
        process.cwd(),
        ".github/workflows/firebase-hosting-pull-request.yml"
      );

      const mergeContent = fs.readFileSync(mergePath, "utf-8");
      const prContent = fs.readFileSync(prPath, "utf-8");

      // Should use secrets syntax, not hardcoded values
      expect(mergeContent).toContain("secrets.");
      expect(prContent).toContain("secrets.");

      // Should not contain Firebase API keys or tokens (actual secrets)
      expect(mergeContent).not.toMatch(/AIza[a-zA-Z0-9-_]{35}/); // Firebase API key pattern
      expect(prContent).not.toMatch(/AIza[a-zA-Z0-9-_]{35}/);
      // Should not contain service account JSON inline
      expect(mergeContent).not.toContain('"private_key"');
      expect(prContent).not.toContain('"private_key"');
    });

    it("should cache npm dependencies for performance", () => {
      const mergePath = path.join(
        process.cwd(),
        ".github/workflows/firebase-hosting-merge.yml"
      );
      const prPath = path.join(
        process.cwd(),
        ".github/workflows/firebase-hosting-pull-request.yml"
      );

      const mergeContent = fs.readFileSync(mergePath, "utf-8");
      const prContent = fs.readFileSync(prPath, "utf-8");

      expect(mergeContent).toContain("cache: 'npm'");
      expect(prContent).toContain("cache: 'npm'");
    });

    it("should use npm ci for reproducible installs", () => {
      const mergePath = path.join(
        process.cwd(),
        ".github/workflows/firebase-hosting-merge.yml"
      );
      const prPath = path.join(
        process.cwd(),
        ".github/workflows/firebase-hosting-pull-request.yml"
      );

      const mergeContent = fs.readFileSync(mergePath, "utf-8");
      const prContent = fs.readFileSync(prPath, "utf-8");

      expect(mergeContent).toContain("npm ci");
      expect(prContent).toContain("npm ci");

      expect(mergeContent).not.toContain("npm install");
      expect(prContent).not.toContain("npm install");
    });
  });

  describe("Security Considerations", () => {
    it("should prevent fork PRs from accessing secrets", () => {
      const prPath = path.join(
        process.cwd(),
        ".github/workflows/firebase-hosting-pull-request.yml"
      );
      const prContent = fs.readFileSync(prPath, "utf-8");

      // Should have conditional check for same repo
      expect(prContent).toContain("full_name");
      expect(prContent).toContain("==");
      expect(prContent).toContain("github.repository");
    });

    it("should use service account for Firebase authentication", () => {
      const mergePath = path.join(
        process.cwd(),
        ".github/workflows/firebase-hosting-merge.yml"
      );
      const mergeContent = fs.readFileSync(mergePath, "utf-8");

      expect(mergeContent).toContain("firebaseServiceAccount");
      expect(mergeContent).not.toContain("FIREBASE_TOKEN"); // Deprecated method
    });
  });

  describe("Deployment Strategy", () => {
    it("should only deploy to live channel from main branch", () => {
      const mergePath = path.join(
        process.cwd(),
        ".github/workflows/firebase-hosting-merge.yml"
      );
      const mergeContent = fs.readFileSync(mergePath, "utf-8");

      expect(mergeContent).toContain("branches:");
      expect(mergeContent).toContain("- main");
      expect(mergeContent).toContain("channelId: live");
    });

    it("should create unique preview channels for PRs", () => {
      const prPath = path.join(
        process.cwd(),
        ".github/workflows/firebase-hosting-pull-request.yml"
      );
      const prContent = fs.readFileSync(prPath, "utf-8");

      // Should NOT have channelId: live
      const deploySection = prContent.split("FirebaseExtended/action-hosting-deploy")[1];
      expect(deploySection).not.toContain("channelId: live");
    });

    it("should run quality checks before deployment", () => {
      const mergePath = path.join(
        process.cwd(),
        ".github/workflows/firebase-hosting-merge.yml"
      );
      const mergeContent = fs.readFileSync(mergePath, "utf-8");

      // Order: lint -> test -> build -> deploy
      const lintPos = mergeContent.indexOf("npm run lint");
      const testPos = mergeContent.indexOf("npm run test");
      const buildPos = mergeContent.indexOf("npm run build");
      const deployPos = mergeContent.indexOf("action-hosting-deploy");

      expect(lintPos).toBeLessThan(testPos);
      expect(testPos).toBeLessThan(buildPos);
      expect(buildPos).toBeLessThan(deployPos);
    });
  });
});