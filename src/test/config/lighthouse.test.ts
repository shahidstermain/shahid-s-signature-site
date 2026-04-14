import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const lighthouseConfig = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), "lighthouserc.json"), "utf8"),
);
describe("lighthouserc.json Configuration", () => {
  describe("Basic Structure", () => {
    it("should have CI configuration", () => {
      expect(lighthouseConfig).toHaveProperty("ci");
      expect(lighthouseConfig.ci).toBeDefined();
    });

    it("should have collect configuration", () => {
      expect(lighthouseConfig.ci).toHaveProperty("collect");
      expect(lighthouseConfig.ci.collect).toBeDefined();
    });

    it("should have assert configuration", () => {
      expect(lighthouseConfig.ci).toHaveProperty("assert");
      expect(lighthouseConfig.ci.assert).toBeDefined();
    });

    it("should have upload configuration", () => {
      expect(lighthouseConfig.ci).toHaveProperty("upload");
      expect(lighthouseConfig.ci.upload).toBeDefined();
    });
  });

  describe("Collect Configuration", () => {
    it("should specify static dist directory", () => {
      expect(lighthouseConfig.ci.collect.staticDistDir).toBe("./dist");
    });

    it("should use staticDistDir for URL discovery", () => {
      // When staticDistDir is set, LHCI auto-discovers and serves the URLs;
      // an explicit 'url' override is not needed and can point to the wrong port.
      expect(lighthouseConfig.ci.collect.staticDistDir).toBeDefined();
      expect(lighthouseConfig.ci.collect.url).toBeUndefined();
    });

    it("should run multiple iterations for consistency", () => {
      expect(lighthouseConfig.ci.collect.numberOfRuns).toBe(3);
      expect(lighthouseConfig.ci.collect.numberOfRuns).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Assertions Configuration", () => {
    it("should have assertions object", () => {
      expect(lighthouseConfig.ci.assert.assertions).toBeDefined();
      expect(typeof lighthouseConfig.ci.assert.assertions).toBe("object");
    });

    describe("Performance Assertions", () => {
      it("should assert performance score", () => {
        const perfAssertion = lighthouseConfig.ci.assert.assertions["categories:performance"];
        expect(perfAssertion).toBeDefined();
        expect(perfAssertion[0]).toBe("warn");
        expect(perfAssertion[1]).toHaveProperty("minScore");
        expect(perfAssertion[1].minScore).toBe(0.8);
      });

      it("should have reasonable performance threshold", () => {
        const perfAssertion = lighthouseConfig.ci.assert.assertions["categories:performance"];
        // 80% is a good baseline for performance
        expect(perfAssertion[1].minScore).toBeGreaterThanOrEqual(0.7);
      });
    });

    describe("Accessibility Assertions", () => {
      it("should assert accessibility score", () => {
        const a11yAssertion = lighthouseConfig.ci.assert.assertions["categories:accessibility"];
        expect(a11yAssertion).toBeDefined();
        expect(a11yAssertion[0]).toBe("warn");
        expect(a11yAssertion[1].minScore).toBe(0.9);
      });

      it("should have high accessibility threshold", () => {
        const a11yAssertion = lighthouseConfig.ci.assert.assertions["categories:accessibility"];
        // Accessibility should be >= 90%
        expect(a11yAssertion[1].minScore).toBeGreaterThanOrEqual(0.9);
      });
    });

    describe("Best Practices Assertions", () => {
      it("should assert best practices score", () => {
        const bpAssertion = lighthouseConfig.ci.assert.assertions["categories:best-practices"];
        expect(bpAssertion).toBeDefined();
        expect(bpAssertion[0]).toBe("warn");
        expect(bpAssertion[1].minScore).toBe(0.9);
      });
    });

    describe("SEO Assertions", () => {
      it("should assert SEO score", () => {
        const seoAssertion = lighthouseConfig.ci.assert.assertions["categories:seo"];
        expect(seoAssertion).toBeDefined();
        expect(seoAssertion[1].minScore).toBe(0.9);
      });

      it("should use error level for SEO", () => {
        const seoAssertion = lighthouseConfig.ci.assert.assertions["categories:seo"];
        // SEO is critical, should be error level
        expect(seoAssertion[0]).toBe("error");
      });

      it("should require high SEO score", () => {
        const seoAssertion = lighthouseConfig.ci.assert.assertions["categories:seo"];
        expect(seoAssertion[1].minScore).toBeGreaterThanOrEqual(0.9);
      });
    });
  });

  describe("Core Web Vitals Assertions", () => {
    it("should assert First Contentful Paint (FCP)", () => {
      const fcpAssertion = lighthouseConfig.ci.assert.assertions["first-contentful-paint"];
      expect(fcpAssertion).toBeDefined();
      expect(fcpAssertion[0]).toBe("warn");
      expect(fcpAssertion[1]).toHaveProperty("maxNumericValue");
    });

    it("should have FCP under 2 seconds", () => {
      const fcpAssertion = lighthouseConfig.ci.assert.assertions["first-contentful-paint"];
      expect(fcpAssertion[1].maxNumericValue).toBe(2000);
      expect(fcpAssertion[1].maxNumericValue).toBeLessThanOrEqual(2000);
    });

    it("should assert Largest Contentful Paint (LCP)", () => {
      const lcpAssertion = lighthouseConfig.ci.assert.assertions["largest-contentful-paint"];
      expect(lcpAssertion).toBeDefined();
      expect(lcpAssertion[0]).toBe("warn");
      expect(lcpAssertion[1]).toHaveProperty("maxNumericValue");
    });

    it("should have LCP under 2.5 seconds (good threshold)", () => {
      const lcpAssertion = lighthouseConfig.ci.assert.assertions["largest-contentful-paint"];
      expect(lcpAssertion[1].maxNumericValue).toBe(2500);
      expect(lcpAssertion[1].maxNumericValue).toBeLessThanOrEqual(2500);
    });

    it("should assert Cumulative Layout Shift (CLS)", () => {
      const clsAssertion = lighthouseConfig.ci.assert.assertions["cumulative-layout-shift"];
      expect(clsAssertion).toBeDefined();
      expect(clsAssertion[0]).toBe("warn");
      expect(clsAssertion[1]).toHaveProperty("maxNumericValue");
    });

    it("should have CLS under 0.1 (good threshold)", () => {
      const clsAssertion = lighthouseConfig.ci.assert.assertions["cumulative-layout-shift"];
      expect(clsAssertion[1].maxNumericValue).toBe(0.1);
      expect(clsAssertion[1].maxNumericValue).toBeLessThanOrEqual(0.1);
    });

    it("should assert Total Blocking Time (TBT)", () => {
      const tbtAssertion = lighthouseConfig.ci.assert.assertions["total-blocking-time"];
      expect(tbtAssertion).toBeDefined();
      expect(tbtAssertion[0]).toBe("warn");
      expect(tbtAssertion[1]).toHaveProperty("maxNumericValue");
    });

    it("should have TBT under 300ms", () => {
      const tbtAssertion = lighthouseConfig.ci.assert.assertions["total-blocking-time"];
      expect(tbtAssertion[1].maxNumericValue).toBe(300);
      expect(tbtAssertion[1].maxNumericValue).toBeLessThanOrEqual(300);
    });
  });

  describe("Upload Configuration", () => {
    it("should use temporary public storage", () => {
      expect(lighthouseConfig.ci.upload.target).toBe("temporary-public-storage");
    });
  });

  describe("Overall Quality Standards", () => {
    it("should have assertions for all major categories", () => {
      const assertions = lighthouseConfig.ci.assert.assertions;
      expect(assertions).toHaveProperty("categories:performance");
      expect(assertions).toHaveProperty("categories:accessibility");
      expect(assertions).toHaveProperty("categories:best-practices");
      expect(assertions).toHaveProperty("categories:seo");
    });

    it("should have assertions for Core Web Vitals", () => {
      const assertions = lighthouseConfig.ci.assert.assertions;
      expect(assertions).toHaveProperty("first-contentful-paint");
      expect(assertions).toHaveProperty("largest-contentful-paint");
      expect(assertions).toHaveProperty("cumulative-layout-shift");
      expect(assertions).toHaveProperty("total-blocking-time");
    });

    it("should use warn level for most metrics (non-blocking)", () => {
      const assertions = lighthouseConfig.ci.assert.assertions;
      const warnCount = (Object.values(assertions) as [string, ...unknown[]][]).filter(
        (a) => a[0] === "warn"
      ).length;
      // Most should be warnings to not block builds
      expect(warnCount).toBeGreaterThan(0);
    });

    it("should only fail on critical SEO issues", () => {
      const assertions = lighthouseConfig.ci.assert.assertions;
      const errorAssertions = (Object.entries(assertions) as [string, [string, ...unknown[]]][]).filter(
        ([, value]) => value[0] === "error"
      );
      // Only SEO should be error level
      expect(errorAssertions.length).toBe(1);
      expect(errorAssertions[0][0]).toBe("categories:seo");
    });
  });

  describe("Configuration Best Practices", () => {
    it("should run tests multiple times for reliability", () => {
      expect(lighthouseConfig.ci.collect.numberOfRuns).toBeGreaterThanOrEqual(3);
    });

    it("should use staticDistDir for local CI testing", () => {
      // staticDistDir causes LHCI to spin up its own server; no explicit url needed.
      expect(lighthouseConfig.ci.collect.staticDistDir).toBeDefined();
    });

    it("should have realistic performance thresholds", () => {
      // All numeric thresholds should be achievable
      const assertions = lighthouseConfig.ci.assert.assertions;
      const perfScore = assertions["categories:performance"][1].minScore;
      const a11yScore = assertions["categories:accessibility"][1].minScore;
      const seoScore = assertions["categories:seo"][1].minScore;

      expect(perfScore).toBeGreaterThan(0);
      expect(perfScore).toBeLessThanOrEqual(1);
      expect(a11yScore).toBeGreaterThan(0);
      expect(a11yScore).toBeLessThanOrEqual(1);
      expect(seoScore).toBeGreaterThan(0);
      expect(seoScore).toBeLessThanOrEqual(1);
    });
  });
});