// Web-optimise the Blender export: weld, quantise, meshopt-compress, WebP textures.
// Keeps named nodes as interactive targets in Three.js.
import { execSync } from "node:child_process";
import { copyFileSync, statSync, existsSync } from "node:fs";

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

const src = "out/unit01.raw.glb";
const out = "../public/models/unit01.glb";

if (!existsSync("out")) {
  console.error("Run blender script first: python build_machine.py");
  process.exit(1);
}

console.log(`Optimizing ${src}...`);
execSync(`${gt} optimize ${src} out/unit01.glb ${flags}`, { stdio: "inherit" });
copyFileSync("out/unit01.glb", out);
console.log(`Finished: ${src} (${kb(src)}) -> ${out} (${kb(out)})`);
