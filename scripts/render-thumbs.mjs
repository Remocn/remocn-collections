// Renders every `thumb-*` composition to a PNG still.
//
// One bundle serves all of them — rendering these through `remotion still`
// one by one re-bundles the whole project 44 times over.
//
//   node scripts/render-thumbs.mjs [--scale=2] [--out=out/thumbs-2x] [id ...]

import path from "node:path";
import fs from "node:fs/promises";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import { enableTailwind } from "@remotion/tailwind-v4";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const scale = Number(flag("scale", "2"));
const outDir = path.resolve(flag("out", "out/thumbs-2x"));
const only = args.filter((a) => !a.startsWith("--"));

const root = process.cwd();

console.log(`bundling…`);
// remotion.config.ts does NOT apply to the Node APIs, so the `@` alias and
// Tailwind have to be re-declared here or the composition tree won't resolve.
const serveUrl = await bundle({
  entryPoint: path.join(root, "src/remotion/index.ts"),
  webpackOverride: (config) =>
    enableTailwind({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...(config.resolve?.alias ?? {}),
          "@": path.join(root, "src"),
        },
      },
    }),
});

// The bundle exposes the same composition list Studio shows; the thumbnail
// compositions are exactly the `thumb-` prefixed ones.
const { getCompositions } = await import("@remotion/renderer");
const all = await getCompositions(serveUrl);
const targets = all
  .filter((c) => c.id.startsWith("thumb-"))
  .filter((c) => only.length === 0 || only.includes(c.id.replace(/^thumb-/, "")))
  .sort((a, b) => a.id.localeCompare(b.id));

if (targets.length === 0) {
  console.error("no matching thumb-* compositions");
  process.exit(1);
}

await fs.mkdir(outDir, { recursive: true });
console.log(`${targets.length} stills → ${outDir} at ${scale}x`);

let done = 0;
const failures = [];

for (const target of targets) {
  const id = target.id.replace(/^thumb-/, "");
  const output = path.join(outDir, `${id}.png`);
  try {
    const composition = await selectComposition({ serveUrl, id: target.id });
    await renderStill({
      composition,
      serveUrl,
      output,
      overwrite: true,
      imageFormat: "png",
      scale,
      chromiumOptions: { gl: "angle" },
      // Fonts and the two network-fetched brand marks need a moment on a cold
      // cache; the default is tight when 44 stills share one bundle.
      timeoutInMilliseconds: 120_000,
    });
    const { size } = await fs.stat(output);
    done += 1;
    console.log(
      `[${String(done).padStart(2)}/${targets.length}] ${id} — ${(size / 1024).toFixed(0)} KB`,
    );
  } catch (err) {
    failures.push({ id, message: err instanceof Error ? err.message : String(err) });
    console.error(`[FAIL] ${id}: ${err}`);
  }
}

console.log(`\ndone: ${done}/${targets.length}`);
if (failures.length) {
  console.log("failures:");
  for (const f of failures) console.log(`  ${f.id}: ${f.message}`);
  process.exit(1);
}
