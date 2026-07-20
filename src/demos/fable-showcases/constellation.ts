// Where everything sits on the plane. Tiles fill an elliptical spiral out
// from the opener: grid cells are ranked by an ellipse-weighted distance so
// the wall grows into a wide 16:9-ish island, matching each asset's arrival
// order in the manifest. The first five cells are pinned so the two dive
// heroes sit on opposite diagonals of the opener. A hash jitter keeps the
// wall placed, not gridded. Never Math.random — everything is a pure hash.

import { ASSETS, WILD_REPOS, type ShowcaseAsset } from "./manifest";

export const TILE_W = 640;
export const TILE_H = 360;
export const STEP_X = 672;
export const STEP_Y = 392;

// deterministic 0..1 hash of a string seed
export const hash01 = (seed: string): number => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h = Math.imul(h ^ (h >>> 13), 2246822519);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

const jitter = (seed: string, salt: string, amp: number): number =>
  (hash01(`${seed}:${salt}`) * 2 - 1) * amp;

export type Tile = {
  asset: ShowcaseAsset;
  /** arrival index — also the odometer order */
  index: number;
  /** world center */
  x: number;
  y: number;
  /** grid cell, pre-jitter (the dive rig needs exact cell centers) */
  cellX: number;
  cellY: number;
};

// Cells the first assets are pinned to: opener center, dive heroes on
// opposite diagonals so the two dives travel different directions.
const PINNED: [number, number][] = [
  [0, 0], // introducing-remocn — the opener
  [1, 0], // introducing-vercel — dive 1, east
  [-1, 0], // introducing-nextjs
  [0, -1], // introducing-prisma
  [0, 1], // introducing-shadcn
  [-1, 1], // remocn-icons-3d — dive 2, southwest diagonal
];

const pinnedKey = new Set(PINNED.map(([x, y]) => `${x},${y}`));

// Rank every remaining cell of an 11×7 grid by elliptical distance; ties
// break on a hash so the growth reads organic rather than scanline.
const spiralCells = (): [number, number][] => {
  const cells: { c: [number, number]; k: number }[] = [];
  for (let gy = -3; gy <= 3; gy++) {
    for (let gx = -5; gx <= 5; gx++) {
      if (pinnedKey.has(`${gx},${gy}`)) continue;
      const k =
        Math.hypot(gx / 1.62, gy) + hash01(`cell:${gx},${gy}`) * 0.12;
      cells.push({ c: [gx, gy], k });
    }
  }
  cells.sort((a, b) => a.k - b.k);
  return cells.map((e) => e.c);
};

export const TILES: Tile[] = (() => {
  const rest = spiralCells();
  return ASSETS.map((asset, index) => {
    const cell = index < PINNED.length ? PINNED[index] : rest[index - PINNED.length];
    const [gx, gy] = cell;
    // the pinned cross stays exact (the camera dives into those cells);
    // the far field carries the placement jitter
    const j = index < PINNED.length ? 0 : 1;
    return {
      asset,
      index,
      x: gx * STEP_X + j * jitter(asset.id, "x", 26),
      y: gy * STEP_Y + j * jitter(asset.id, "y", 22),
      cellX: gx,
      cellY: gy,
    };
  });
})();

export const tileOf = (id: string): Tile => {
  const t = TILES.find((tile) => tile.asset.id === id);
  if (!t) throw new Error(`no tile for ${id}`);
  return t;
};

// ---------------------------------------------------------------------------
// The wild slabs — outside repos orbiting the wall. World-space cards; blume
// is the large one. Positions ring the wall's ~6700×2700 island.
// ---------------------------------------------------------------------------
export type Slab = {
  repo: string;
  note?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  order: number;
};

export const SLABS: Slab[] = WILD_REPOS.map((entry, i) => {
  const featured = i === 0;
  // a close ring around the wall's ~6100×2300 island; wide slabs so the
  // mono repo names fit inside with margin, none clipped by the frame edge
  const spots: [number, number][] = [
    [-4400, -1900], // blume — northwest, below the caption band
    [4400, -1850],
    [-4750, 200],
    [4700, 350],
    [-3900, 2250],
    [4100, 2300],
  ];
  const [sx, sy] = spots[i];
  return {
    repo: entry.repo,
    note: entry.note,
    x: sx + jitter(entry.repo, "sx", 130),
    y: sy + jitter(entry.repo, "sy", 90),
    w: featured ? 3400 : 3100,
    h: featured ? 1150 : 900,
    order: i,
  };
});
