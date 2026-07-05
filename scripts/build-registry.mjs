// Builds registry.json (GitHub registry, https://ui.shadcn.com/docs/registry/github)
// with one installable item per demo:
//   npx shadcn@latest add kapishdima/remocn-demo/<demo-id>
//
// For every remocn component a demo uses, the published item on remocn.dev is
// fetched and byte-compared with the local copy. Identical -> the item becomes a
// registryDependencies URL; diverged or unpublished -> the local file is bundled
// so the installed demo renders exactly like the gallery. Run after changing
// demos (needs network):
//   node scripts/scan-demos.mjs && node scripts/build-registry.mjs
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, normalize, basename } from "node:path";

const ROOT = normalize(join(import.meta.dirname, ".."));
const REMOCN = "https://remocn.dev/r";
const meta = JSON.parse(
  readFileSync(join(ROOT, "src/demos/demo-meta.json"), "utf8"),
);

// Refresh from `npx remotion compositions` when a demo's length changes.
const DURATIONS = {
  "sponsor-canadian-ai": 504,
  "introducing-shadcn": 2178,
  "sponsor-orcdev": 482,
  "sponsor-reactbits": 386,
  "new-transitions": 1556,
  "introducing-remocn": 1012,
  "sponsor-shieldcn": 416,
  "paper-shaders": 984,
  shieldcn: 1224,
  "sponsor-ln": 198,
  "shadcn-ui": 908,
  "skill-changelog": 624,
  tegami: 1494,
  fonttrio: 744,
  "render-sdk": 618,
  "agent-skills": 1400,
  typography: 1538,
  batchwork: 480,
  "chat-changelog": 693,
  changelog: 481,
  "signup-flow": 230,
};

// Demo titles from src/demos/catalog.ts (component-free metadata module).
const catalogTs = readFileSync(join(ROOT, "src/demos/catalog.ts"), "utf8");
const titles = {};
for (const m of catalogTs.matchAll(
  /id:\s*"([^"]+)",\s*\n\s*title:\s*"([^"]+)"/g,
)) {
  titles[m[1]] = m[2];
}
// Real exported component name per demo (e.g. shadcn-ui exports ShadcnDemo).
const demosTs = readFileSync(join(ROOT, "src/demos/index.ts"), "utf8");
const componentNames = {};
for (const m of demosTs.matchAll(
  /getCatalogEntry\("([^"]+)"\),\s*\n\s*component:\s*(\w+)/g,
)) {
  componentNames[m[1]] = m[2];
}

const NPM_KEEP = [
  "remotion",
  "@remotion/",
  "@paper-design/",
  "lucide-react",
  "date-fns",
  "culori",
  "class-variance-authority",
  "clsx",
  "tailwind-merge",
  "radix-ui",
  "react-day-picker",
  "cmdk",
  "@radix-ui/",
];

const norm = (s) =>
  s
    .trim()
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n");

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
}

const index = await fetchJson(`${REMOCN}/registry.json`);
const published = new Set(index.items.map((i) => i.name));

// name -> { ok: all files identical, files: Map<basename, identical?> }
const itemCache = new Map();
async function checkItem(name) {
  if (itemCache.has(name)) return itemCache.get(name);
  let entry;
  try {
    const item = await fetchJson(`${REMOCN}/${name}.json`);
    const files = new Map();
    for (const f of item.files ?? []) {
      const base = basename(f.target || f.path);
      const local = join(ROOT, "src/components/remocn", base);
      const localLib = join(ROOT, "src/lib/remocn-ui.ts");
      const cmp = existsSync(local)
        ? norm(readFileSync(local, "utf8")) === norm(f.content ?? "")
        : name === "remocn-ui" && existsSync(localLib)
          ? norm(readFileSync(localLib, "utf8")) === norm(f.content ?? "")
          : null; // file the item ships that we don't have locally — fine
      files.set(base, cmp);
    }
    entry = { ok: [...files.values()].every((v) => v !== false), files };
  } catch (e) {
    entry = { ok: false, files: new Map(), error: String(e) };
  }
  itemCache.set(name, entry);
  return entry;
}

const log = [];
const items = [];

for (const [id, m] of Object.entries(meta)) {
  const deps = new Set(); // registryDependencies URLs
  const covered = new Set(); // remocn basenames provided by dep items
  const bundle = new Set(); // repo paths to ship as files

  // remocn-ui lib -> published shared item
  const usesRemocnUi = m.graph.some((f) => f.startsWith("src/lib/remocn-ui"));
  if (usesRemocnUi) {
    const e = await checkItem("remocn-ui");
    if (e.ok) {
      deps.add(`${REMOCN}/remocn-ui.json`);
      for (const b of e.files.keys()) covered.add(b);
      log.push(`${id}: dep remocn-ui`);
    }
  }

  // components whose own item is published & identical -> dependency
  for (const name of m.remocnComponents) {
    if (!published.has(name)) continue;
    const e = await checkItem(name);
    if (e.ok) {
      deps.add(`${REMOCN}/${name}.json`);
      for (const b of e.files.keys()) covered.add(b);
      log.push(`${id}: dep ${name}`);
    } else {
      log.push(`${id}: DIVERGED ${name} -> bundling local copy`);
    }
  }

  for (const f of m.graph) {
    if (f.startsWith(`src/demos/`))
      bundle.add(f); // own files + _ui kit
    else if (f.startsWith("src/components/remocn/")) {
      if (!covered.has(basename(f))) {
        bundle.add(f);
        if (!published.has(basename(f).replace(/\.(tsx|ts)$/, "")))
          log.push(`${id}: unpublished ${basename(f)} -> bundled`);
      }
    } else if (f.startsWith("src/lib/")) {
      if (
        f.startsWith("src/lib/remocn-ui") &&
        deps.has(`${REMOCN}/remocn-ui.json`)
      )
        continue;
      if (f === "src/lib/utils.ts") continue; // ships with every shadcn project
      bundle.add(f);
    } else if (f.startsWith("src/components/") || f.startsWith("src/hooks/")) {
      bundle.add(f); // safety net; freeze should have moved these already
    }
  }

  // Bundled files import the cn() helper — pull shadcn's utils item so
  // installs work in projects that never ran `shadcn init`.
  const needsUtils = [...bundle].some((p) =>
    readFileSync(join(ROOT, p), "utf8").includes('"@/lib/utils"'),
  );
  if (needsUtils) deps.add("utils");

  const promptPath = `src/demos/${id}/prompt.md`;
  const files = [...bundle].sort().map((p) => ({
    path: p,
    type: "registry:component",
    target: p.replace(/^src\//, ""),
  }));
  if (existsSync(join(ROOT, promptPath))) {
    files.push({
      path: promptPath,
      type: "registry:file",
      target: `demos/${id}/prompt.md`,
    });
  }

  const dependencies = m.npmPackages
    .filter((p) =>
      NPM_KEEP.some((k) => (k.endsWith("/") ? p.startsWith(k) : p === k)),
    )
    .sort();

  const glFlag = m.usesShaders ? " --gl=angle" : "";
  items.push({
    name: id,
    type: "registry:block",
    title: titles[id] ?? id,
    description: `remocn demo composition "${titles[id] ?? id}" — installs the full Remotion composition. Generated with AI from the prompt in demos/${id}/prompt.md.`,
    dependencies,
    registryDependencies: [...deps].sort(),
    files,
    docs: [
      `Register the composition in your Remotion Root:`,
      ``,
      `  import { ${componentNames[id] ?? pascal(id) + "Demo"} } from "@/demos/${id}";`,
      `  <Composition id="${id}" component={${componentNames[id] ?? pascal(id) + "Demo"}} durationInFrames={${DURATIONS[id] ?? 300}} fps={30} width={1280} height={720} />`,
      ``,
      `Requires Tailwind v4 wired into Remotion (@remotion/tailwind-v4).`,
      `Render locally: npx remotion render ${id} out/${id}.mp4${glFlag}`,
    ].join("\n"),
  });
}

function pascal(id) {
  return id
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join("");
}

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "remocn-demo",
  homepage: "https://collections.remocn.dev",
  items,
};

writeFileSync(
  join(ROOT, "registry.json"),
  JSON.stringify(registry, null, 2) + "\n",
);
writeFileSync(
  join(ROOT, "scripts/registry-verification.log"),
  log.sort().join("\n") + "\n",
);
console.log(`registry.json: ${items.length} items`);
console.log(
  `verification log: scripts/registry-verification.log (${log.length} lines)`,
);
const bundledDiverged = [
  ...new Set(
    log.filter((l) => l.includes("DIVERGED")).map((l) => l.split(" ")[2]),
  ),
];
console.log(
  "diverged components bundled:",
  bundledDiverged.join(", ") || "none",
);
