// Web-optimise the Blender export: weld, quantise, meshopt-compress, WebP textures.
// Keeps named nodes as interactive targets in Three.js.
import { execSync } from "node:child_process";
import { copyFileSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gt = "npx.cmd --yes @gltf-transform/cli@4.5.1";
const kb = (f) => (statSync(f).size / 1024).toFixed(1) + " KB";
const flags = [
  "--compress meshopt",
  "--texture-compress webp",
  "--texture-size 1024",
  "--weld true",
  "--simplify false", // preserve vertex colours with baked AO
  "--join false",     // preserve separate components for explosion and interaction
  "--flatten false",
  "--palette false",
  "--instance false",
].join(" ");

const target = process.argv[2] || "diorama";
const src = path.join(__dirname, `out/${target}.raw.glb`);
const tempOut = path.join(__dirname, `out/${target}.glb`);
const finalOut = path.join(__dirname, `../public/models/${target}.glb`);

if (!existsSync(src)) {
  console.error(`Source not found: ${src}`);
  process.exit(1);
}

console.log(`Optimizing ${src}...`);
execSync(`${gt} optimize "${src}" "${tempOut}" ${flags}`, { stdio: "inherit" });
copyFileSync(tempOut, finalOut);
console.log(`Finished: ${src} (${kb(src)}) -> ${finalOut} (${kb(finalOut)})`);
