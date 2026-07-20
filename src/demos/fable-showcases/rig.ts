// The zoom rig. One camera (cx, cy, S) carries the whole video; every beat
// is an additive spring in the log-scale domain, so overlapping moves stay
// continuous, every arrival overshoots like a mass on a spring, and there is
// no linear segment anywhere. On top: a sine hand-drift (enveloped away
// inside dives and the finale) and tiny log-domain kicks when the first
// tiles slam onto the plane.

import { spring } from "remotion";
import { hash01, tileOf } from "./constellation";
import { DIVE_1, DIVE_2 } from "./manifest";

export type SpringCfg = { damping: number; stiffness: number; mass: number };

type Seg = {
  at: number;
  logS: number;
  cx: number;
  cy: number;
  cfg: SpringCfg;
};

const dive1 = tileOf(DIVE_1);
const dive2 = tileOf(DIVE_2);

// beat anchors (frames @30) — the storyboard's spine
export const PULL_1 = 58;
export const PULL_2 = 128;
export const PULL_3 = 204;
export const DIVE_1_AT = 344;
export const RISE_1_AT = 452;
export const DIVE_2_AT = 520;
export const RISE_2_AT = 628; // the wild bounce
export const FINALE_AT = 726; // swarm begins; camera makes its last breath in
export const WORLD_END = 830; // world unmounts (finale lockup layer takes over)
export const TOTAL_DURATION = 952;

export const S_FINAL = 0.098; // the camera's resting scale for the swarm

const SEGS: Seg[] = [
  { at: 0, logS: Math.log(2.0), cx: 0, cy: 0, cfg: { damping: 14, stiffness: 100, mass: 1 } },
  // pull 1 — the reveal snap; the frame rides high so the caption band
  // under the cross stays clear
  { at: PULL_1, logS: Math.log(0.58), cx: 0, cy: -140, cfg: { damping: 13.5, stiffness: 110, mass: 1 } },
  // pull 2 — wider
  { at: PULL_2, logS: Math.log(0.382), cx: 0, cy: 0, cfg: { damping: 14, stiffness: 95, mass: 1 } },
  // pull 3 — the long soft pull to the whole wall
  { at: PULL_3, logS: Math.log(0.1855), cx: 0, cy: 0, cfg: { damping: 15.5, stiffness: 60, mass: 1.15 } },
  // anticipation breath, then dive 1 east into the vercel tile
  { at: DIVE_1_AT - 8, logS: Math.log(0.171), cx: 0, cy: 0, cfg: { damping: 11, stiffness: 170, mass: 0.7 } },
  // dive target overshoots 2.0 slightly so the tile truly seals the frame
  // (a log-domain spring's last percent would otherwise leave a seam)
  { at: DIVE_1_AT, logS: Math.log(2.1), cx: dive1.x, cy: dive1.y, cfg: { damping: 16.5, stiffness: 120, mass: 1 } },
  // bounce out wide
  { at: RISE_1_AT, logS: Math.log(0.3), cx: 0, cy: 0, cfg: { damping: 13, stiffness: 100, mass: 0.95 } },
  // anticipation, then dive 2 down the opposite diagonal
  { at: DIVE_2_AT - 8, logS: Math.log(0.276), cx: 0, cy: 0, cfg: { damping: 11, stiffness: 170, mass: 0.7 } },
  { at: DIVE_2_AT, logS: Math.log(2.1), cx: dive2.x, cy: dive2.y, cfg: { damping: 16.5, stiffness: 120, mass: 1 } },
  // the wild bounce — widest frame of the video
  { at: RISE_2_AT, logS: Math.log(0.089), cx: 0, cy: 0, cfg: { damping: 14.5, stiffness: 75, mass: 1.1 } },
  // the finale breath in while the swarm flies
  { at: FINALE_AT, logS: Math.log(S_FINAL), cx: 0, cy: 0, cfg: { damping: 17, stiffness: 60, mass: 1.1 } },
];

const smooth = (t: number): number => {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
};

// ---------------------------------------------------------------------------
// Arrivals: when each tile lands, when it freezes. Pure functions of the
// manifest index — the odometer and the wall both read these.
// ---------------------------------------------------------------------------
export const birthOf = (index: number): number => {
  if (index === 0) return 0;
  if (index <= 4) return 60 + (index - 1) * 4; // wave 1 — the inner cross
  if (index <= 12) return 130 + (index - 5) * 4; // wave 2 — the diagonals
  return 206 + (index - 13) * 3; // wave 3 — the far field
};

/** first frame the tile is fully landed (spring visually settled) */
export const LAST_ARRIVAL = 206 + (40 - 13) * 3; // 287

export const arrivalsAt = (frame: number): number => {
  let n = 0;
  for (let i = 0; i < 41; i++) if (frame >= birthOf(i)) n++;
  return n;
};

// ---------------------------------------------------------------------------
// The camera.
// ---------------------------------------------------------------------------
export type CameraPose = {
  cx: number;
  cy: number;
  S: number;
  /** degrees, hand-drift roll around screen center */
  rot: number;
};

const additive = (
  frame: number,
  fps: number,
  pick: (s: Seg) => number,
): number => {
  let v = pick(SEGS[0]);
  for (let i = 1; i < SEGS.length; i++) {
    const seg = SEGS[i];
    const prev = pick(SEGS[i - 1]);
    const target = pick(seg);
    if (target === prev) continue;
    if (frame < seg.at) continue;
    const p = spring({ frame: frame - seg.at, fps, config: seg.cfg });
    v += p * (target - prev);
  }
  return v;
};

// drift envelope: silent in the cold open, full in cruise, gone in dives
// and the finale
const driftEnv = (frame: number): number => {
  let env = smooth((frame - 60) / 26);
  const gates: [number, number][] = [
    [DIVE_1_AT - 14, RISE_1_AT + 26],
    [DIVE_2_AT - 14, RISE_2_AT + 26],
  ];
  for (const [off, on] of gates) {
    const down = smooth((frame - (off - 22)) / 22);
    const up = smooth((frame - on) / 22);
    env *= 1 - down * (1 - up);
  }
  env *= 1 - smooth((frame - 698) / 28);
  return env;
};

// tiny log-domain kicks: the wave-1 slams and the wild slabs thump the camera
const KICKS: { at: number; amp: number }[] = [
  ...[1, 2, 3, 4].map((i) => ({ at: birthOf(i) + 6, amp: 0.0042 })),
  ...[0, 1, 2, 3, 4, 5].map((i) => ({ at: 640 + i * 5 + 4, amp: 0.0028 })),
];

const kickAt = (frame: number): number => {
  let k = 0;
  for (const { at, amp } of KICKS) {
    const t = frame - at;
    if (t <= 0 || t > 46) continue;
    k += amp * Math.exp(-t / 7) * Math.sin(t * 0.9);
  }
  return k;
};

export const cameraAt = (frame: number, fps: number): CameraPose => {
  const logS = additive(frame, fps, (s) => s.logS) + kickAt(frame);
  const S = Math.exp(logS);
  const env = driftEnv(frame);

  const dx =
    7.5 * Math.sin((2 * Math.PI * frame) / 234 + 1.3) +
    3 * Math.sin((2 * Math.PI * frame) / 97 + 0.6);
  const dy =
    5.5 * Math.sin((2 * Math.PI * frame) / 278 + 4.2) +
    2.4 * Math.sin((2 * Math.PI * frame) / 121 + 2.9);

  return {
    cx: additive(frame, fps, (s) => s.cx) + (env * dx) / S,
    cy: additive(frame, fps, (s) => s.cy) + (env * dy) / S,
    S,
    rot: env * 0.5 * Math.sin((2 * Math.PI * frame) / 300 + 2.1),
  };
};

// ---------------------------------------------------------------------------
// The swarm — every object's flight into the letterform. Per-object stagger
// off a hash; the wall passes each tile its sampled target.
// ---------------------------------------------------------------------------
export const SWARM_CFG: SpringCfg = { damping: 15, stiffness: 60, mass: 1.15 };

export const swarmProgress = (
  frame: number,
  fps: number,
  seed: string,
): number => {
  const start = FINALE_AT + 2 + hash01(`swarm:${seed}`) * 18;
  if (frame <= start) return 0;
  return spring({ frame: frame - start, fps, config: SWARM_CFG });
};

// world → screen for the resting finale pose (drift is zero by then)
export const finaleWorldOf = (sx: number, sy: number): [number, number] => [
  (sx - 640) / S_FINAL,
  (sy - 360) / S_FINAL,
];

export const R_SCREEN = { cx: 640, cy: 336, h: 580 };
