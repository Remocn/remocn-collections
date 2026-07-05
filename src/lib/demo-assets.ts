import { staticFile } from "remotion";

// Demo assets are loaded from absolute URLs so a demo installed into another
// project via the registry renders identically without copying this repo's
// public/ directory. The same URLs are used on the site and in local renders,
// which keeps a single code path (network access is required for rendering).
//
// Override with REMOTION_DEMO_ASSETS_BASE — only REMOTION_-prefixed env vars
// reach Remotion compositions (next.config.js additionally inlines it for the
// site's <Player>). Two override forms:
//   - "local" — serve straight from this repo's public/ via staticFile();
//     works in Remotion Studio, CLI renders and the Next dev site. Set it in
//     the gitignored .env so previews never depend on pushed assets.
//   - any URL — e.g. a local static server (http://127.0.0.1:8123).
export const DEMO_ASSETS_BASE =
  process.env.REMOTION_DEMO_ASSETS_BASE ||
  "https://raw.githubusercontent.com/Remocn/remocn-collections/main/public";

export const demoAsset = (path: string): string => {
  const clean = path.replace(/^\/+/, "");
  if (DEMO_ASSETS_BASE === "local") return staticFile(clean);
  return `${DEMO_ASSETS_BASE}/${clean}`;
};
