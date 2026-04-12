import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}", "scripts/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "next/navigation": path.resolve(__dirname, "./src/test/__stubs__/next-navigation.ts"),
      "next/link": path.resolve(__dirname, "./src/test/__stubs__/next-link.tsx"),
      "next/script": path.resolve(__dirname, "./src/test/__stubs__/next-script.tsx"),
    },
  },
});