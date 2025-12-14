import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

console.log(path.resolve("../src"));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react-sweet-context": path.resolve(".."),
      src: path.resolve("./src"),
    },
  },
});
