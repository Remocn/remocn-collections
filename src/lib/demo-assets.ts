// Demo assets are loaded from absolute URLs so a demo installed into another
// project via the registry renders identically without copying this repo's
// public/ directory. The same URLs are used on the site and in local renders,
// which keeps a single code path (network access is required for rendering).
// Override with REMOTION_DEMO_ASSETS_BASE (e.g. a local static server) — only
// REMOTION_-prefixed env vars reach Remotion compositions.
export const DEMO_ASSETS_BASE =
  process.env.REMOTION_DEMO_ASSETS_BASE ||
  "https://raw.githubusercontent.com/Remocn/remocn-collections/main/public";

export const demoAsset = (path: string): string =>
  `${DEMO_ASSETS_BASE}/${path.replace(/^\/+/, "")}`;
