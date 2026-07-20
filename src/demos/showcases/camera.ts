// The flight path. ONE camera carries the whole first act: the ignition
// pull-back, the canyon cruise with a banked weave, three match-cut dives
// into the featured floats, and the exit acceleration. Everything is driven
// by eased moves — no linear segment anywhere; banking is derived from the
// weave's lateral velocity so the roll is physical, not decorative.

import { Easing } from "remotion";

export const PERSPECTIVE = 1000;
// Featured floats are nominal 1280x720: with perspective 1000 an object at
// the camera's own plane (dz = 0) appears at exactly its native size, so the
// dive cut lands when camZ reaches the float's z — the float IS the frame.
export const FLOAT_W = 1280;
export const FLOAT_H = 720;
export const WALL_W = 540;
export const WALL_H = 304;

/** camera distance at which a float exactly fills the frame (at its plane) */
export const FILL_DISTANCE = 0;

const E_IN = Easing.in(Easing.cubic);
const E_OUT = Easing.out(Easing.cubic);
const E_IO = Easing.inOut(Easing.cubic);

type Move = {
  from: number;
  to: number;
  /** frames */
  dur: number;
  ease: (t: number) => number;
};

// ---------------------------------------------------------------------------
// The z-timeline. Featured float z positions (also used by the layout):
// shadcn 0 · vercel 4700 · icons-3d 10700. A dive cut lands exactly when the
// camera reaches floatZ - FILL_DISTANCE; the overlay covers the static hold;
// the pull-back starts on the cut back, so both cuts are pixel-seamless.
// ---------------------------------------------------------------------------
export const FLOAT_Z = {
  "introducing-shadcn": 3300,
  "introducing-vercel": 4700,
  "remocn-icons-3d": 10700,
} as const;

export const OPENER_Z = FLOAT_Z["introducing-shadcn"];

const OVERLAY = 75; // frames the featured video owns the full frame

const SEGMENTS: { moves: Move[]; dive?: keyof typeof FLOAT_Z }[] = [
  {
    // ignition: the opener hangs at the end of the lane; the camera pushes
    // in slowly as the wave lights the gift walls from far to near, each one
    // flaring up just before we glide past it
    moves: [
      { from: -700, to: -700, dur: 8, ease: E_OUT },
      { from: -700, to: 600, dur: 130, ease: E_OUT },
      { from: 600, to: 605, dur: 72, ease: E_IO },
    ],
  },
  {
    // dive 1 — through the gift section, into the opener
    dive: "introducing-shadcn",
    moves: [
      {
        from: 605,
        to: FLOAT_Z["introducing-shadcn"] - FILL_DISTANCE,
        dur: 60,
        ease: E_IN,
      },
      {
        from: FLOAT_Z["introducing-shadcn"] - FILL_DISTANCE,
        to: FLOAT_Z["introducing-shadcn"] - FILL_DISTANCE,
        dur: OVERLAY,
        ease: E_OUT,
      },
      {
        from: FLOAT_Z["introducing-shadcn"] - FILL_DISTANCE,
        to: 2900,
        dur: 40,
        ease: E_OUT,
      },
    ],
  },
  {
    // short hop past the gift gate, dive 2 — into vercel
    dive: "introducing-vercel",
    moves: [
      { from: 2900, to: 4200, dur: 125, ease: E_IO },
      {
        from: 4200,
        to: FLOAT_Z["introducing-vercel"] - FILL_DISTANCE,
        dur: 35,
        ease: E_IN,
      },
      {
        from: FLOAT_Z["introducing-vercel"] - FILL_DISTANCE,
        to: FLOAT_Z["introducing-vercel"] - FILL_DISTANCE,
        dur: OVERLAY,
        ease: E_OUT,
      },
      {
        from: FLOAT_Z["introducing-vercel"] - FILL_DISTANCE,
        to: 4300,
        dur: 35,
        ease: E_OUT,
      },
    ],
  },
  {
    // the sponsor gauntlet, then dive 3 — into the icons burst
    dive: "remocn-icons-3d",
    moves: [
      { from: 4300, to: 9800, dur: 200, ease: E_IO },
      {
        from: 9800,
        to: FLOAT_Z["remocn-icons-3d"] - FILL_DISTANCE,
        dur: 35,
        ease: E_IN,
      },
      {
        from: FLOAT_Z["remocn-icons-3d"] - FILL_DISTANCE,
        to: FLOAT_Z["remocn-icons-3d"] - FILL_DISTANCE,
        dur: OVERLAY,
        ease: E_OUT,
      },
      {
        from: FLOAT_Z["remocn-icons-3d"] - FILL_DISTANCE,
        to: 10300,
        dur: 35,
        ease: E_OUT,
      },
    ],
  },
  {
    // the long tail — changelogs and demos at rising speed, then exit
    moves: [
      { from: 10300, to: 27000, dur: 320, ease: E_IO },
      { from: 27000, to: 29600, dur: 45, ease: E_IN },
    ],
  },
];

// ---------------------------------------------------------------------------
// Flatten the timeline into absolute frame anchors.
// ---------------------------------------------------------------------------
type AnchoredMove = Move & { start: number; end: number };

const MOVES: AnchoredMove[] = [];
{
  let t = 0;
  for (const seg of SEGMENTS) {
    for (const m of seg.moves) {
      MOVES.push({ ...m, start: t, end: t + m.dur });
      t += m.dur;
    }
  }
}

export const FLIGHT_DURATION = MOVES[MOVES.length - 1].end;

export type Dive = {
  id: keyof typeof FLOAT_Z;
  floatZ: number;
  /** first fullscreen frame (cut in) */
  cut: number;
  /** first canyon frame after the overlay (cut back) */
  ret: number;
  /** pull-back ends, cruise resumes */
  resume: number;
};

export const DIVES: Dive[] = [];
{
  let t = 0;
  for (const seg of SEGMENTS) {
    if (seg.dive) {
      // a dive segment ends with […cruise, approach, hold, pull]
      const n = seg.moves.length;
      const approach = seg.moves[n - 3];
      const hold = seg.moves[n - 2];
      const pull = seg.moves[n - 1];
      const before = seg.moves.slice(0, n - 3).reduce((a, m) => a + m.dur, 0);
      const cut = t + before + approach.dur;
      DIVES.push({
        id: seg.dive,
        floatZ: FLOAT_Z[seg.dive],
        cut,
        ret: cut + hold.dur,
        resume: cut + hold.dur + pull.dur,
      });
    }
    for (const m of seg.moves) t += m.dur;
  }
}

const zAt = (frame: number): number => {
  const f = Math.max(0, Math.min(frame, FLIGHT_DURATION - 0.001));
  const m =
    MOVES.find((mv) => f >= mv.start && f < mv.end) ?? MOVES[MOVES.length - 1];
  const p = m.dur === 0 ? 1 : (f - m.start) / m.dur;
  return m.from + m.ease(p) * (m.to - m.from);
};

// ---------------------------------------------------------------------------
// The weave envelope: zero through the ignition and inside every dive window
// (approach ± hold ± pull-back), one in open cruise. Smooth ramps so the
// lateral sway fades in and out instead of snapping.
// ---------------------------------------------------------------------------
const RAMP = 26;

const envelopeAt = (frame: number): number => {
  // ignition hold: the camera sits square until the first dive commits
  let env = smooth((frame - 190) / RAMP);
  for (const d of DIVES) {
    const off = d.cut - 48;
    const on = d.resume + 14;
    const out = smooth((frame - (off - RAMP)) / RAMP);
    const back = smooth((frame - on) / RAMP);
    env *= 1 - out * (1 - back);
  }
  return Math.max(0, Math.min(1, env));
};

const smooth = (t: number): number => {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
};

const WEAVE_X = 150;
const WEAVE_Y = 60;

const xAt = (frame: number): number => {
  const env = envelopeAt(frame);
  const z = zAt(frame);
  return env * WEAVE_X * Math.sin((2 * Math.PI * (z + 900)) / 5200);
};

const yAt = (frame: number): number => {
  const env = envelopeAt(frame);
  const z = zAt(frame);
  return env * WEAVE_Y * Math.sin((z + 300) / 3400);
};

export type CameraPose = {
  x: number;
  y: number;
  z: number;
  roll: number;
  yaw: number;
  pitch: number;
  /** px/frame forward speed — drives wake strength and speed feel */
  speed: number;
};

export const cameraAt = (frame: number): CameraPose => {
  const z = zAt(frame);
  const x = xAt(frame);
  const y = yAt(frame);
  const vx = x - xAt(frame - 1);
  const vy = y - yAt(frame - 1);
  const vz = z - zAt(frame - 1);

  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v));

  return {
    x,
    y,
    z,
    // bank INTO the weave, like a plane in a coordinated turn
    roll: clamp(-vx * 0.85, -6.5, 6.5),
    yaw: clamp(vx * 0.5, -4.5, 4.5),
    pitch: clamp(-vy * 0.55, -2.5, 2.5),
    speed: Math.max(0, vz),
  };
};

// screens closer than this mount their live clip (also drives clipStarts)
export const VIDEO_AHEAD_EXPORT = 3350;

// Ignition wave: the opener lights first, then the wave races down-canyon
// in distance order (see canyon.tsx).
export const IGNITION_START = 26;

// Hook text overlay window
export const HOOK_IN = 88;
export const HOOK_OUT = 186;
export const HOOK_GONE = 212;

// ---------------------------------------------------------------------------
// firstFrameWithin(z, dist): the first global frame where a screen at world z
// is closer than `dist` to the camera. Used as the fixed Sequence start for
// each screen's clip, so every video is frame-locked to the composition
// clock regardless of when React mounts it. Memoized — the camera path is
// deterministic, so this is a pure lookup once computed.
// ---------------------------------------------------------------------------
let zCache: number[] | null = null;

const cameraPath = (): number[] => {
  if (zCache) return zCache;
  zCache = [];
  for (let f = 0; f <= FLIGHT_DURATION; f++) zCache.push(zAt(f));
  return zCache;
};

export const firstFrameWithin = (z: number, dist: number): number => {
  const path = cameraPath();
  for (let f = 0; f < path.length; f++) {
    if (z - path[f] < dist) return f;
  }
  return FLIGHT_DURATION;
};
