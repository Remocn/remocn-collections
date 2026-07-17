// Scans each demo's import graph and writes src/demos/demo-meta.json.
// Consumed by the demo page (render command, code tab) and the registry
// builder. Re-run after adding a demo or changing demo imports:
//   node scripts/scan-demos.mjs
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, normalize, relative, basename } from "node:path";

const ROOT = normalize(join(import.meta.dirname, ".."));
const DEMOS_DIR = join(ROOT, "src/demos");

const demoIds = readdirSync(DEMOS_DIR).filter(
  (d) =>
    !d.startsWith("_") &&
    statSync(join(DEMOS_DIR, d)).isDirectory() &&
    existsSync(join(DEMOS_DIR, d, "index.tsx")),
);

const IMPORT_RE = /from\s+"(@\/[^"]+|\.{1,2}\/[^"]+)"/g;
const PKG_RE = /from\s+"(@?[a-z][^"./][^"]*)"/g;

function resolve(spec, curDir) {
  const p = spec.startsWith("@/")
    ? join(ROOT, "src", spec.slice(2))
    : normalize(join(curDir, spec));
  for (const ext of [".tsx", ".ts", "/index.tsx", "/index.ts", ".css"]) {
    if (existsSync(p + ext) && statSync(p + ext).isFile()) return p + ext;
  }
  return existsSync(p) && statSync(p).isFile() ? p : null;
}

function scanDemo(id) {
  const entry = join(DEMOS_DIR, id, "index.tsx");
  const seen = new Set();
  const pkgs = new Set();
  const queue = [entry];
  while (queue.length) {
    const f = queue.pop();
    if (seen.has(f)) continue;
    seen.add(f);
    const txt = readFileSync(f, "utf8");
    for (const m of txt.matchAll(IMPORT_RE)) {
      const r = resolve(m[1], dirname(f));
      if (r && !seen.has(r)) queue.push(r);
    }
    for (const m of txt.matchAll(PKG_RE)) {
      const parts = m[1].split("/");
      pkgs.add(m[1].startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]);
    }
  }
  const graph = [...seen].map((f) => relative(ROOT, f)).sort();
  const assets = new Set();
  for (const f of graph) {
    const txt = readFileSync(join(ROOT, f), "utf8");
    for (const m of txt.matchAll(/demoAsset\(\s*["`]([^"`]+)["`]/g)) assets.add(m[1]);
  }
  return {
    graph,
    ownFiles: graph.filter((f) => f.startsWith(`src/demos/${id}/`) && !f.endsWith("prompt.md")),
    remocnComponents: [
      ...new Set(
        graph
          .filter((f) => f.startsWith("src/components/remocn/"))
          .map((f) => basename(f).replace(/\.(tsx|ts)$/, "")),
      ),
    ].sort(),
    npmPackages: [...pkgs].sort(),
    assets: [...assets].sort(),
    // Paper-design shaders AND our own WebGL shader components (shader-*)
    // both need --gl=angle at render time.
    usesShaders:
      pkgs.has("@paper-design/shaders-react") ||
      graph.some((f) => basename(f).startsWith("shader-")),
  };
}

const meta = Object.fromEntries(demoIds.sort().map((id) => [id, scanDemo(id)]));
writeFileSync(join(DEMOS_DIR, "demo-meta.json"), JSON.stringify(meta, null, 2) + "\n");
console.log(`demo-meta.json written for ${demoIds.length} demos`);
