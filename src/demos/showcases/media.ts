// The showcase manifest: every video that flies through the canyon, in
// canyon order. Each entry points at its pre-encoded clip in
// public/showcases/ (walls: 640x360, featured floats: hero-* 1280x720) and
// its gallery thumbnail for the far-field / mosaic views.
//
// `clipOffsetSec` is the source offset the clip was encoded from — it is the
// anchor of every sync calculation (a screen's video is frame-locked to the
// composition clock: source time = clipOffset + composition time).

export type ShowcaseFamily = "gifts" | "sponsors" | "changelogs" | "demos";

export type ShowcaseVideo = {
  id: string;
  /** display title (featured overlays) */
  title: string;
  family: ShowcaseFamily;
  /** featured videos are center-lane floats the camera dives into */
  featured: boolean;
  durationSec: number;
  clip: string;
  thumb: string;
  clipOffsetSec: number;
};

const wall = (
  id: string,
  family: ShowcaseFamily,
  clipOffsetSec: number,
): ShowcaseVideo => ({
  id,
  title: id,
  family,
  featured: false,
  durationSec: 0,
  clip: `showcases/${id}.mp4`,
  thumb: `thumbnails/${id}.png`,
  clipOffsetSec,
});

const hero = (
  id: string,
  title: string,
  family: ShowcaseFamily,
  durationSec: number,
  clipOffsetSec: number,
): ShowcaseVideo => ({
  id,
  title,
  family,
  featured: true,
  durationSec,
  clip: `showcases/hero-${id}.mp4`,
  thumb: `thumbnails/${id}.png`,
  clipOffsetSec,
});

// Canyon order — the opener float, then families in flight order.
export const SHOWCASE_VIDEOS: ShowcaseVideo[] = [
  hero("introducing-shadcn", "Introducing shadcn/ui", "gifts", 73, 2),

  // the gift cuts
  wall("introducing-remocn", "gifts", 14),
  wall("introducing-nextjs", "gifts", 10),
  wall("introducing-prisma", "gifts", 16),
  wall("introducing-tenkit", "gifts", 14),
  wall("introducing-videorc", "gifts", 4),
  wall("introducing-shadcn-typeset", "gifts", 20),

  hero("introducing-vercel", "Introducing Vercel", "gifts", 29, 3),

  // the sponsor spots
  wall("sponsor-ln", "sponsors", 0),
  wall("sponsor-orcdev", "sponsors", 4),
  wall("sponsor-reactbits", "sponsors", 3),
  wall("sponsor-shieldcn", "sponsors", 5),
  wall("sponsor-gramotion", "sponsors", 6),
  wall("sponsor-canadian-ai", "sponsors", 4),
  wall("sponsor-shadcn-ui-kit", "sponsors", 7),
  wall("sponsor-reui", "sponsors", 12),

  hero("remocn-icons-3d", "remocn icons, in 3D", "changelogs", 44, 14),

  // the changelog cuts
  wall("remocn-icons", "changelogs", 18),
  wall("remocn-icons-onetake", "changelogs", 10),
  wall("remocn-new-logo", "changelogs", 8),
  wall("ai-and-social", "changelogs", 12),
  wall("new-transitions", "changelogs", 20),
  wall("paper-shaders", "changelogs", 12),
  wall("remocn-ui", "changelogs", 14),
  wall("agent-skill", "changelogs", 12),
  wall("agent-skills", "changelogs", 15),
  wall("llms-txt", "changelogs", 8),
  wall("shadcn-aria", "changelogs", 6),
  wall("changelog", "changelogs", 4),
  wall("chat-changelog", "changelogs", 12),
  wall("skill-changelog", "changelogs", 6),

  // the product demos
  wall("shadcn-ui", "demos", 10),
  wall("shieldcn", "demos", 14),
  wall("shieldcn-plus", "demos", 22),
  wall("signup-flow", "demos", 0),
  wall("batchwork", "demos", 4),
  wall("fonttrio", "demos", 8),
  wall("render-sdk", "demos", 6),
  wall("tegami", "demos", 18),
  wall("typography", "demos", 12),
  wall("perf-guards", "demos", 8),
];

export const VIDEO_COUNT = SHOWCASE_VIDEOS.length; // 41

export const FAMILY_LABEL: Record<ShowcaseFamily, string> = {
  gifts: "the gift cuts",
  sponsors: "the sponsor spots",
  changelogs: "the changelog cuts",
  demos: "the product demos",
};

// The in-the-wild repos wired to the @remocn registry (GitHub code search,
// July 2026). blume gets the card; the rest are the mono rows.
export const WILD_FEATURED = {
  repo: "haydenbleasel / blume",
  note: "a video package built with remocn",
  path: "packages/video · Remotion",
};

export const WILD_REPOS = [
  "felipersas/democraft",
  "rznies/demoforge",
  "TommyBez/evex",
  "kelvinzer0/audio2scene",
  "mishkatik/infra-billing",
];

export const WILD_TOTAL = 10; // public repos wired to @remocn
