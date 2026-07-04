// Renders a 640x360 PNG per demo into public/thumbnails/<id>.png (grid cards
// and OG images derive from these). Frames match the demo's mid frame.
// Refresh FRAMES from `npx remotion compositions` when durations change.
//   node scripts/generate-thumbnails.mjs [demo-id ...]
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join, normalize } from "node:path";
import { FRAMES } from "./frames.mjs";

const ROOT = normalize(join(import.meta.dirname, ".."));
const only = process.argv.slice(2);
const ids = only.length ? only : Object.keys(FRAMES);
mkdirSync(join(ROOT, "public/thumbnails"), { recursive: true });

for (const id of ids) {
  const frame = FRAMES[id];
  if (frame == null) { console.error(`unknown demo: ${id}`); continue; }
  console.log(`rendering ${id} @ ${frame}`);
  execFileSync("npx", [
    "remotion", "still", "src/remotion/index.ts", id,
    `--frame=${frame}`, "--scale=0.5", "--gl=angle",
    `public/thumbnails/${id}.png`, "--log=error",
  ], { cwd: ROOT, stdio: "inherit" });
}
console.log("done");
