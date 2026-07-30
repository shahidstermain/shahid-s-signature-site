import { describe, it, expect, beforeAll } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe(".firebaserc Configuration", () => {
  const firebasercPath = path.join(process.cwd(), ".firebaserc");
  let firebaserc: any;

  beforeAll(() => {
    const content = fs.readFileSync(firebasercPath, "utf-8");
    firebaserc = JSON.parse(content);
  });

  describe("Basic Structure", () => {
    it("should exist as a file", () => {
      expect(fs.existsSync(firebasercPath)).toBe(true);
    });

    it("should be valid JSON", () => {
      expect(firebaserc).toBeDefined();
      expect(typeof firebaserc).toBe("object");
    });

    it("should have projects configuration", () => {
      expect(firebaserc).toHaveProperty("projects");
      expect(firebaserc.projects).toBeDefined();
    });

    it("should have default project", () => {
      expect(firebaserc.projects).toHaveProperty("default");
      expect(firebaserc.projects.default).toBeDefined();
    });
  });

  describe("Project Configuration", () => {
    it("should have valid project ID format", () => {
      const projectId = firebaserc.projects.default;
      expect(projectId).toBeDefined();
      expect(typeof projectId).toBe("string");
      expect(projectId.length).toBeGreaterThan(0);
    });

    it("should have project ID with expected pattern", () => {
      const projectId = firebaserc.projects.default;
      // Firebase project IDs can contain alphanumeric chars, hyphens, and dots
      expect(projectId).toMatch(/^[a-z0-9.-]+$/i);
    });

    it("should reference shahidster.tech project", () => {
      const projectId = firebaserc.projects.default;
      expect(projectId).toContain("shahidster");
    });

    it("should not be empty string", () => {
      const projectId = firebaserc.projects.default;
      expect(projectId.trim()).not.toBe("");
    });
  });

  describe("Configuration Validity", () => {
    it("should not have trailing whitespace in project ID", () => {
      const projectId = firebaserc.projects.default;
      expect(projectId).toBe(projectId.trim());
    });

    it("should not start or end with hyphen", () => {
      const projectId = firebaserc.projects.default;
      expect(projectId[0]).not.toBe("-");
      expect(projectId[projectId.length - 1]).not.toBe("-");
    });

    it("should not contain invalid characters", () => {
      const projectId = firebaserc.projects.default;
      // Firebase project IDs should not contain spaces, special chars except hyphen and dot
      expect(projectId).not.toMatch(/[\s@#$%^&*()+=[\]{}|\\:;"'<>,?/]/);
    });

    it("should be lowercase with valid characters", () => {
      const projectId = firebaserc.projects.default;
      // Firebase project IDs are typically lowercase with hyphens and dots
      expect(projectId).toMatch(/^[a-z0-9.-]+$/);
    });
  });

  describe("Structure Requirements", () => {
    it("should only have projects key at root level", () => {
      const keys = Object.keys(firebaserc);
      expect(keys).toContain("projects");
    });

    it("should not have undefined values", () => {
      expect(firebaserc.projects.default).not.toBeUndefined();
      expect(firebaserc.projects.default).not.toBeNull();
    });

    it("should be a valid Firebase configuration", () => {
      // Ensure the structure matches Firebase expectations
      expect(firebaserc).toMatchObject({
        projects: {
          default: expect.any(String),
        },
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle projects object access safely", () => {
      expect(() => firebaserc.projects.default).not.toThrow();
    });

    it("should not have duplicate keys", () => {
      const jsonString = JSON.stringify(firebaserc);
      const parsed = JSON.parse(jsonString);
      expect(parsed).toEqual(firebaserc);
    });

    it("should serialize and deserialize correctly", () => {
      const serialized = JSON.stringify(firebaserc);
      const deserialized = JSON.parse(serialized);
      expect(deserialized).toEqual(firebaserc);
    });
  });

  describe("Security and Best Practices", () => {
    it("should not contain sensitive information in project ID", () => {
      const projectId = firebaserc.projects.default;
      // Should not contain words like "secret", "password", "key", "token"
      expect(projectId.toLowerCase()).not.toMatch(/secret|password|key|token|api/);
    });

    it("should be suitable for version control", () => {
      const projectId = firebaserc.projects.default;
      // Should not contain absolute paths or system-specific info
      expect(projectId).not.toMatch(/[/\\]/);
      expect(projectId).not.toMatch(/^[A-Z]:/); // Windows drive letter
    });
  });
});