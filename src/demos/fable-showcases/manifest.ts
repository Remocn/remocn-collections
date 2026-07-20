// The 41 shipping videos, as flat asset facts: which pre-encoded clip in
// public/showcases/ a tile plays (heroes carry the 1280×720 hero-* files so
// the dives stay sharp) and the clip length in frames so a freeze can never
// outrun its source. Clips are self-contained excerpts — they play from
// t=0; offsetFr only records which source moment the excerpt was cut from.
// Thumbnails are the 640×360 stills in public/thumbnails/.

export type ShowcaseAsset = {
  id: string;
  clip: string;
  thumb: string;
  /** source offset the clip was encoded from, in frames @30 */
  offsetFr: number;
  /** encoded clip length in frames @30 */
  clipFr: number;
  hero: boolean;
};

const F = 30;

const wall = (id: string, offsetSec: number, clipSec = 12): ShowcaseAsset => ({
  id,
  clip: `showcases/${id}.mp4`,
  thumb: `thumbnails/${id}.png`,
  offsetFr: Math.round(offsetSec * F),
  clipFr: Math.floor(clipSec * F),
  hero: false,
});

const hero = (id: string, offsetSec: number): ShowcaseAsset => ({
  id,
  clip: `showcases/hero-${id}.mp4`,
  thumb: `thumbnails/${id}.png`,
  offsetFr: Math.round(offsetSec * F),
  clipFr: Math.floor(22 * F),
  hero: true,
});

// Arrival order IS this array order: the opener, the inner ring (live wave),
// the second wave, then the far field. Short clips live in the far field
// where tiles arrive as stills and never play.
export const ASSETS: ShowcaseAsset[] = [
  // wave 0 — the opener
  wall("introducing-remocn", 14),
  // wave 1 — the inner cross, all playing (two of them are dive heroes)
  hero("introducing-vercel", 3),
  wall("introducing-nextjs", 10),
  wall("introducing-prisma", 16),
  hero("introducing-shadcn", 2),
  // wave 2 — the diagonals and the second ring
  hero("remocn-icons-3d", 14),
  wall("introducing-tenkit", 14),
  wall("introducing-videorc", 4),
  wall("introducing-shadcn-typeset", 20),
  wall("paper-shaders", 12),
  wall("new-transitions", 20),
  wall("remocn-ui", 14),
  wall("remocn-icons", 18),
  // wave 3 — the far field (arrives as stills)
  wall("remocn-icons-onetake", 10),
  wall("remocn-new-logo", 8),
  wall("ai-and-social", 12),
  wall("agent-skill", 12),
  wall("agent-skills", 15),
  wall("llms-txt", 8),
  wall("shadcn-aria", 6),
  wall("changelog", 4),
  wall("chat-changelog", 12),
  wall("skill-changelog", 6),
  wall("shadcn-ui", 10),
  wall("shieldcn", 14),
  wall("shieldcn-plus", 22),
  wall("signup-flow", 0, 7.66),
  wall("batchwork", 4),
  wall("fonttrio", 8),
  wall("render-sdk", 6),
  wall("tegami", 18),
  wall("typography", 12),
  wall("perf-guards", 8),
  wall("sponsor-ln", 0, 6.6),
  wall("sponsor-orcdev", 4),
  wall("sponsor-reactbits", 3, 9.86),
  wall("sponsor-shieldcn", 5, 8.86),
  wall("sponsor-gramotion", 6),
  wall("sponsor-canadian-ai", 4),
  wall("sponsor-shadcn-ui-kit", 7),
  wall("sponsor-reui", 12),
];

export const VIDEO_COUNT = ASSETS.length; // 41

export const DIVE_1 = "introducing-vercel";
export const DIVE_2 = "remocn-icons-3d";

export const DIVE_TITLE: Record<string, { title: string; slug: string }> = {
  [DIVE_1]: { title: "Introducing Vercel", slug: "introducing-vercel · 29 seconds" },
  [DIVE_2]: { title: "remocn icons, in 3D", slug: "remocn-icons-3d · 44 seconds" },
};

// The in-the-wild repos wired to the @remocn registry (GitHub code search,
// July 2026). blume gets the large slab.
export const WILD_REPOS: { repo: string; note?: string }[] = [
  { repo: "haydenbleasel/blume", note: "packages/video · Remotion" },
  { repo: "felipersas/democraft" },
  { repo: "rznies/demoforge" },
  { repo: "TommyBez/evex" },
  { repo: "kelvinzer0/audio2scene" },
  { repo: "mishkatik/infra-billing" },
];

export const WILD_TOTAL = 10; // public repos wired to @remocn
