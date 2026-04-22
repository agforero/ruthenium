import * as esbuild from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(dir, "dist");
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

await esbuild.build({
  entryPoints: [path.join(dir, "src/main.ts")],
  outfile: path.join(dir, "dist/main.js"),
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  sourcemap: true,
  external: ["electron", "typescript"],
});

await esbuild.build({
  entryPoints: [path.join(dir, "src/preload.ts")],
  outfile: path.join(dir, "dist/preload.cjs"),
  bundle: true,
  platform: "node",
  target: "node20",
  format: "cjs",
  sourcemap: true,
  external: ["electron"],
});

const iconSrc = path.join(
  dir,
  "..",
  "..",
  "packages",
  "brand-assets",
  "logo-square-black.png",
);
const iconDest = path.join(dist, "assets", "app-icon.png");
fs.mkdirSync(path.dirname(iconDest), { recursive: true });
fs.copyFileSync(iconSrc, iconDest);
