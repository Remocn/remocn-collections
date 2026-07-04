// Build-time data for /demo/[id]. Imported only from getStaticProps — keep
// client components out of this module (it reads the filesystem and runs shiki).
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createHighlighter, type Highlighter } from "shiki";

import { REPO, REPO_URL } from "./site-config";

export { REPO, REPO_URL };

const ROOT = process.cwd();
const MAX_LINES = 400;

export type SourceFile = {
  name: string;
  html: string;
  totalLines: number;
  truncated: boolean;
  githubUrl: string;
};

export type DemoMeta = {
  usesShaders: boolean;
  ownFiles: string[];
  remocnComponents: string[];
  assets: string[];
};

export function readDemoMeta(): Record<string, DemoMeta> {
  return JSON.parse(
    readFileSync(join(ROOT, "src/demos/demo-meta.json"), "utf8"),
  );
}

export function readPrompt(id: string): { prompt: string; isDraft: boolean } {
  const p = join(ROOT, `src/demos/${id}/prompt.md`);
  if (!existsSync(p)) return { prompt: "", isDraft: true };
  const raw = readFileSync(p, "utf8");
  const isDraft = raw.includes("TODO(draft)");
  const prompt = raw.replace(/<!--[\s\S]*?-->/g, "").trim();
  return { prompt, isDraft };
}

export function installCommand(id: string): string {
  return `npx shadcn@latest add ${REPO}/${id}`;
}

export function renderCommand(id: string, usesShaders: boolean): string {
  return `npx remotion render ${id} out/${id}.mp4 --scale=2 --crf=15 --x264-preset=slower --jpeg-quality=95${usesShaders ? " --gl=angle" : ""}`;
}

let highlighterPromise: Promise<Highlighter> | null = null;
function getHighlighter() {
  highlighterPromise ??= createHighlighter({
    themes: ["github-light", "github-dark"],
    langs: ["tsx", "ts", "css", "md"],
  });
  return highlighterPromise;
}

export async function readSources(id: string): Promise<SourceFile[]> {
  const dir = join(ROOT, `src/demos/${id}`);
  const highlighter = await getHighlighter();
  const names = readdirSync(dir)
    .filter((f) => /\.(tsx|ts)$/.test(f))
    .sort((a, b) => (a === "index.tsx" ? -1 : b === "index.tsx" ? 1 : a.localeCompare(b)));
  return names.map((name) => {
    const code = readFileSync(join(dir, name), "utf8");
    const lines = code.split("\n");
    const truncated = lines.length > MAX_LINES;
    const shown = truncated ? lines.slice(0, MAX_LINES).join("\n") : code;
    const html = highlighter.codeToHtml(shown, {
      lang: name.endsWith(".tsx") ? "tsx" : "ts",
      themes: { light: "github-light", dark: "github-dark" },
    });
    return {
      name,
      html,
      totalLines: lines.length,
      truncated,
      githubUrl: `${REPO_URL}/blob/main/src/demos/${id}/${name}`,
    };
  });
}
