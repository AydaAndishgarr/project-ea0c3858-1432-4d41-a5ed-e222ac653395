// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
    // Client-first SPA for a backend-independent demo deployable on Vercel/static hosts.
    spa: {
      enabled: true,
    },
  },
  // Skip Nitro so `vite build` produces a static client bundle under dist/ (no worker runtime needed).
  nitro: false,
  vite: {
    server: { port: 8080 },
    preview: { port: 8080 },
  },
});
