/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./jest.setup.mjs"],
    include: ["**/__tests__/**/*.test.{ts,tsx}"],
    alias: {
      "@": path.resolve(__dirname, "./app"),
      "@app": path.resolve(__dirname, "./app"),
      "@lib": path.resolve(__dirname, "./app/lib"),
      "@components": path.resolve(__dirname, "./app/components"),
      "@services": path.resolve(__dirname, "./app/services"),
      "@utils": path.resolve(__dirname, "./app/utils"),
    },
  },
});
