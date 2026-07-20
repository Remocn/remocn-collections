// The stop-motion clock. The whole paper world runs quantized to STEP frames
// (~10 fps): every transform samples the timeline through qf(), springs are
// sampled on the quantized clock so their overshoot survives as hand-placed
// poses, and every object breathes a per-step paper jitter — the reshoot
// wobble of a photo that was picked up and put back down. Only the video
// inside a living photograph runs on the real 30fps clock.

import { spring } from "remotion";

export const STEP = 3; // 10 poses per second

export const qf = (frame: number, step = STEP): number =>
  Math.floor(frame / step) * step;

export const qstep = (frame: number, step = STEP): number =>
  Math.floor(frame / step);

// deterministic 0..1 hash
export const hash01 = (seed: string): number => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h = Math.imul(h ^ (h >>> 13), 2246822519);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

export const hashRange = (seed: string, lo: number, hi: number): number =>
  lo + hash01(seed) * (hi - lo);

/** a spring that only moves when the stop-motion clock ticks */
export const steppedSpring = (args: {
  frame: number;
  fps: number;
  delay?: number;
  config?: { damping?: number; stiffness?: number; mass?: number };
}): number =>
  spring({
    frame: qf(Math.max(0, args.frame - (args.delay ?? 0))),
    fps: args.fps,
    config: args.config,
  });

export type Jitter = { x: number; y: number; rot: number };

/** per-step reshoot wobble; amp is in px, rot in degrees */
export const paperJitter = (
  frame: number,
  seed: string,
  amp = 1.4,
  rotAmp = 0.35,
): Jitter => {
  const s = qstep(frame);
  return {
    x: hashRange(`${seed}:x:${s}`, -amp, amp),
    y: hashRange(`${seed}:y:${s}`, -amp, amp),
    rot: hashRange(`${seed}:r:${s}`, -rotAmp, rotAmp),
  };
};

/** quantized eased progress 0..1 over [from, to] */
export const steppedRamp = (
  frame: number,
  from: number,
  to: number,
  ease: (t: number) => number = (t) => t,
): number => {
  const f = qf(frame);
  if (f <= from) return 0;
  if (f >= to) return 1;
  return ease((f - from) / (to - from));
};
