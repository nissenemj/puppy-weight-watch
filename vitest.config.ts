import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    globals: true,
    include: [
      "tests/unit/**/*.test.ts",
      "src/**/*.test.ts",
      "src/**/*.spec.ts",
    ],
    exclude: ["tests/e2e/**", "tests/a11y/**"],
    coverage: {
      reporter: ["text", "lcov"],
    },
  },
});
