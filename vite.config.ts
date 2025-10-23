import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
// Use a repo-specific base path when building for production so assets load correctly on GitHub Pages.
// Behavior:
// - If REPO_NAME is undefined -> default to the repo folder name (for user/org pages where site is under /repo-name/)
// - If REPO_NAME is an empty string -> build for custom domain (base '/')
// - If REPO_NAME is set to a name -> build with that name (e.g. '/repo-name/')
const repoNameEnv = process.env.REPO_NAME;
const defaultRepoName = "completed-task-timeline";
const repoName = repoNameEnv === undefined ? defaultRepoName : repoNameEnv; // allow empty string

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? (repoName === "" ? "/" : `/${repoName}/`) : "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
