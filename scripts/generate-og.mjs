// Renders a 1200x630 Open Graph image per demo into public/og/<id>.png.
// Renders the composition at scale 0.9375 (1200x675) and center-crops to 630
// with macOS `sips`. Frames come from scripts/frames.mjs.
//   node scripts/generate-og.mjs [demo-id ...]
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join, normalize } from "node:path";
import { FRAMES } from "./frames.mjs";

const ROOT = normalize(join(import.meta.dirname, ".."));
const only = process.argv.slice(2);
const ids = only.length ? only : Object.keys(FRAMES);
const outDir = join(ROOT, "public/og");
mkdirSync(outDir, { recursive: true });

for (const id of ids) {
  const frame = FRAMES[id];
  if (frame == null) { console.error(`unknown demo: ${id}`); continue; }
  const out = join(outDir, `${id}.png`);
  console.log(`rendering ${id} @ ${frame}`);
  execFileSync("npx", [
    "remotion", "still", "src/remotion/index.ts", id,
    `--frame=${frame}`, "--scale=0.9375", "--gl=angle",
    out, "--log=error",
  ], { cwd: ROOT, stdio: "inherit" });
  // center-crop 1200x675 -> 1200x630
  execFileSync("sips", ["-c", "630", "1200", out, "--out", out], { stdio: "ignore" });
}
console.log("done");
