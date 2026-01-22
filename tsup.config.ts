import { defineConfig } from "tsup";
import pkg from "./package.json";

export default defineConfig({
  entry: ["lib/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,

  external: [
    "react",
    "react-dom",
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ],
});
