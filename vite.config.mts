import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    base: env.VITE_BASE_URL,
    resolve: {
      alias: {
        src: path.resolve("./src"),
        "react-sweet-context": path.resolve("./lib"),
      },
    },
  };
});
