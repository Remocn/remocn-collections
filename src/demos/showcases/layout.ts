// Canyon geometry: where every screen floats in world space. z slots are
// hand-laid (family blocks with gates between them, floats clearing the
// lane); x/y/rotation carry a deterministic jitter so the walls feel placed,
// not gridded. Never Math.random — jitter is a pure hash of the screen id.

import { FLOAT_Z } from "./camera";
import { FAMILY_LABEL, SHOWCASE_VIDEOS, type ShowcaseFamily } from "./media";

// deterministic 0..1 hash of a string seed
const random = (seed: string): number => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h = Math.imul(h ^ (h >>> 13), 2246822519);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

export type Slot = {
  id: string;
  z: number;
  x: number;
  y: number;
  /** -1 left wall · +1 right wall · 0 center-lane float */
  side: -1 | 0 | 1;
  rotY: number;
};

export type Gate = {
  label: string;
  z: number;
};

const jitter = (seed: string, salt: string, lo: number, hi: number): number =>
  lo + random(`${seed}:${salt}`) * (hi - lo);

// Wall rows between the gates: [z, ids in this row (1-2)] — ids are looked up
// in SHOWCASE_VIDEOS and must appear exactly once across the whole table.
const WALL_ROWS: [number, string[]][] = [
  // the gift cuts (opener float is z 0, gate at 800) — tight around the
  // mouth so the ignition wave reads as a formation, not a scatter
  [500, ["introducing-remocn", "introducing-nextjs"]],
  [900, ["introducing-prisma"]],
  [1400, ["introducing-tenkit"]],
  [2000, ["introducing-videorc"]],
  [2700, ["introducing-shadcn-typeset"]],
  // the sponsor spots (vercel float 4700, gate 5400)
  [5800, ["sponsor-ln", "sponsor-orcdev"]],
  [6500, ["sponsor-reactbits"]],
  [7150, ["sponsor-shieldcn"]],
  [7800, ["sponsor-gramotion"]],
  [8500, ["sponsor-canadian-ai"]],
  [9200, ["sponsor-shadcn-ui-kit"]],
  [9900, ["sponsor-reui"]],
  // the changelog cuts (icons-3d float 10700, gate 11400) — paired rows: at
  // tail speed both walls must read in the same instant
  [11800, ["remocn-icons", "remocn-icons-onetake"]],
  [13300, ["remocn-new-logo", "ai-and-social"]],
  [14800, ["new-transitions", "paper-shaders"]],
  [16300, ["remocn-ui", "agent-skill"]],
  [17800, ["agent-skills", "llms-txt"]],
  [19300, ["shadcn-aria", "changelog"]],
  [20800, ["chat-changelog", "skill-changelog"]],
  // the product demos (gate 21500)
  [22000, ["shadcn-ui", "shieldcn"]],
  [23250, ["shieldcn-plus", "signup-flow"]],
  [24500, ["batchwork", "fonttrio"]],
  [25750, ["render-sdk", "tegami"]],
  [27000, ["typography", "perf-guards"]],
];

export const GATES: Gate[] = (
  [
    [350, "gifts"],
    [5400, "sponsors"],
    [11400, "changelogs"],
    [21500, "demos"],
  ] as [number, ShowcaseFamily][]
).map(([z, family]) => ({ z, label: FAMILY_LABEL[family] }));

export const SLOTS: Slot[] = (() => {
  const byId = new Map(SHOWCASE_VIDEOS.map((v) => [v.id, v]));
  const slots: Slot[] = [];

  for (const v of SHOWCASE_VIDEOS) {
    if (v.featured) {
      slots.push({
        id: v.id,
        z: FLOAT_Z[v.id as keyof typeof FLOAT_Z],
        x: 0,
        y: 0,
        side: 0,
        rotY: 0,
      });
    }
  }

  for (const [z, ids] of WALL_ROWS) {
    ids.forEach((id, i) => {
      if (!byId.has(id)) throw new Error(`unknown wall id: ${id}`);
      // in a pair, first goes left, second right; singles alternate by z
      const side: -1 | 1 =
        ids.length === 2
          ? i === 0
            ? -1
            : 1
          : Math.round(z / 50) % 2 === 0
            ? -1
            : 1;
      slots.push({
        id,
        z,
        side,
        x: side * (560 + jitter(id, "x", -40, 50)),
        y: jitter(id, "y", -215, 225),
        rotY: side * (26 + jitter(id, "r", -6, 8)),
      });
    });
  }

  const once = new Set(slots.map((s) => s.id));
  if (once.size !== SHOWCASE_VIDEOS.length) {
    const missing = SHOWCASE_VIDEOS.filter((v) => !once.has(v.id)).map(
      (v) => v.id,
    );
    throw new Error(`slots missing: ${missing.join(", ")}`);
  }
  return slots;
})();

export const slotOf = (id: string): Slot => {
  const s = SLOTS.find((slot) => slot.id === id);
  if (!s) throw new Error(`no slot for ${id}`);
  return s;
};
