import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    base: env.VITE_BASE_URL,
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    resolve: {
      alias: {
        src: path.resolve("./src"),
        "react-dom$": "react-dom/profiling",
        "scheduler/tracing": "scheduler/tracing-profiling",
      },
    },
  };
});
