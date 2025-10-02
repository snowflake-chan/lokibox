import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import monkey from "vite-plugin-monkey";
import path from "path";
import { fileURLToPath } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    monkey({
      entry: "src/main.ts",
      userscript: {
        icon: "https://vitejs.dev/logo.svg",
        namespace: "npm/vite-plugin-monkey",
        match: ["https://view.dao3.fun/p/*", "https://view.dao3.fun/e/*", "https://view.goboxgame.com/p/*"],
      },
    }),
  ],
  resolve: {
    alias: {
      "src": path.resolve(fileURLToPath(new URL('./src', import.meta.url)))
    }
  }
});
