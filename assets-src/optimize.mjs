// Web-optimise Blender exports: weld, quantise, meshopt-compress
import { execSync } from "node:child_process";
import { copyFileSync, statSync, existsSync } from "node:fs";

const gt = "npx.cmd --yes @gltf-transform/cli@4.5.1";
const kb = (f) => (statSync(f).size / 1024).toFixed(1) + " KB";
const flags = [
  "--compress meshopt",
  "--texture-compress webp",
  "--texture-size 1024",
  "--weld true",
  "--simplify false",
  "--join false",
  "--flatten false",
  "--palette false",
  "--instance false",
].join(" ");

function optimize(src, outFinal) {
  if (!existsSync(src)) return;
  const outTemp = src.replace(".raw.glb", ".opt.glb");
  console.log(`Optimizing ${src}...`);
  execSync(`${gt} optimize ${src} ${outTemp} ${flags}`, { stdio: "inherit" });
  copyFileSync(outTemp, outFinal);
  console.log(`Finished: ${src} (${kb(src)}) -> ${outFinal} (${kb(outFinal)})`);
}

optimize("out/avatar.raw.glb", "../public/models/avatar.glb");
optimize("out/unit01.raw.glb", "../public/models/unit01.glb");
