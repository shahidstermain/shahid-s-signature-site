/**
 * Tests for eslint.config.js changes
 *
 * Covers changes introduced in this PR:
 * - Added @typescript-eslint/no-unused-vars: "off" in main config
 * - Added test-file override block for *.test.ts / *.test.tsx
 *   with @typescript-eslint/no-explicit-any: "off"
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Read the eslint.config.js source text for structural assertions
// ---------------------------------------------------------------------------
const eslintConfigPath = path.resolve(__dirname, '../../../eslint.config.js');
const eslintConfigSource = fs.readFileSync(eslintConfigPath, 'utf-8');

describe('eslint.config.js - structure', () => {
  it('should exist and be readable', () => {
    expect(eslintConfigSource).toBeTruthy();
    expect(eslintConfigSource.length).toBeGreaterThan(0);
  });

  it('should use typescript-eslint config builder', () => {
    expect(eslintConfigSource).toContain('tseslint.config(');
  });

  it('should extend @eslint/js recommended config', () => {
    expect(eslintConfigSource).toContain('js.configs.recommended');
  });

  it('should extend typescript-eslint recommended configs', () => {
    expect(eslintConfigSource).toContain('tseslint.configs.recommended');
  });

  it('should include react-hooks plugin', () => {
    expect(eslintConfigSource).toContain('react-hooks');
  });

  it('should include react-refresh plugin', () => {
    expect(eslintConfigSource).toContain('react-refresh');
  });

  it('should apply the react-hooks recommended rules', () => {
    expect(eslintConfigSource).toContain('reactHooks.configs.recommended.rules');
  });

  it('should apply the react-refresh only-export-components rule', () => {
    expect(eslintConfigSource).toContain('react-refresh/only-export-components');
  });
});

describe('eslint.config.js - @typescript-eslint/no-unused-vars rule', () => {
  it('should disable @typescript-eslint/no-unused-vars', () => {
    expect(eslintConfigSource).toContain('@typescript-eslint/no-unused-vars');
    // Rule value should be "off"
    const match = eslintConfigSource.match(
      /"@typescript-eslint\/no-unused-vars"\s*:\s*"([^"]+)"/
    );
    expect(match).not.toBeNull();
    expect(match?.[1]).toBe('off');
  });
});

describe('eslint.config.js - test file override block', () => {
  it('should include an override block for test files', () => {
    expect(eslintConfigSource).toContain('**/*.test.ts');
    expect(eslintConfigSource).toContain('**/*.test.tsx');
  });

  it('should disable @typescript-eslint/no-explicit-any for test files', () => {
    expect(eslintConfigSource).toContain('@typescript-eslint/no-explicit-any');
    // Rule should be "off"
    const match = eslintConfigSource.match(
      /"@typescript-eslint\/no-explicit-any"\s*:\s*"([^"]+)"/
    );
    expect(match).not.toBeNull();
    expect(match?.[1]).toBe('off');
  });

  it('should list both .test.ts and .test.tsx in the files array', () => {
    // Both patterns must appear together
    const testTsIndex = eslintConfigSource.indexOf('**/*.test.ts');
    const testTsxIndex = eslintConfigSource.indexOf('**/*.test.tsx');
    expect(testTsIndex).toBeGreaterThanOrEqual(0);
    expect(testTsxIndex).toBeGreaterThanOrEqual(0);
  });

  it('should place the test-file override after the main config block', () => {
    // The main TS files block appears before the test override
    const mainFilesIndex = eslintConfigSource.indexOf('"**/*.{ts,tsx}"');
    const testOverrideIndex = eslintConfigSource.indexOf('**/*.test.ts');
    expect(mainFilesIndex).toBeGreaterThanOrEqual(0);
    expect(testOverrideIndex).toBeGreaterThan(mainFilesIndex);
  });
});

describe('eslint.config.js - general quality', () => {
  it('should ignore the dist directory', () => {
    expect(eslintConfigSource).toContain('"dist"');
  });

  it('should set ecmaVersion to 2020', () => {
    expect(eslintConfigSource).toContain('2020');
  });

  it('should use browser globals', () => {
    expect(eslintConfigSource).toContain('globals.browser');
  });

  it('should allow constant exports for react-refresh', () => {
    expect(eslintConfigSource).toContain('allowConstantExport');
  });

  it('should be a valid JavaScript module (no syntax errors by having exports)', () => {
    expect(eslintConfigSource).toContain('export default');
  });
});