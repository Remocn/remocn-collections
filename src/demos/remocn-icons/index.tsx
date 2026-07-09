import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
  type TransitionPresentation,
  type TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import { loadFont as loadSans } from "@remotion/google-fonts/Manrope";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { ShaderNeuroNoise } from "@/components/remocn/shader-neuro-noise";
import { SoftBlurIn } from "@/components/remocn/soft-blur-in";
import { ScaleDownFade } from "@/components/remocn/scale-down-fade";
import { KineticCenterBuild } from "@/components/remocn/kinetic-center-build";
import { RolodexFlip } from "@/components/remocn/rolodex-flip";
import { pushThrough } from "@/components/remocn/push-through";
import { whipPan } from "@/components/remocn/whip-pan";
import { focusPull } from "@/components/remocn/focus-pull";

import { BellIcon, BellIconStatic } from "@/components/remocn/icon-bell";
import { HeartIcon, HeartIconStatic } from "@/components/remocn/icon-heart";
import { StarIcon, StarIconStatic } from "@/components/remocn/icon-star";
import { ZapIcon } from "@/components/remocn/icon-zap";
import { SearchIcon } from "@/components/remocn/icon-search";
import { RocketIcon } from "@/components/remocn/icon-rocket";
import { SendIcon } from "@/components/remocn/icon-send";
import { PlayIcon } from "@/components/remocn/icon-play";
import { SettingsIcon } from "@/components/remocn/icon-settings";
import { LockIcon } from "@/components/remocn/icon-lock";
import { CloudIcon } from "@/components/remocn/icon-cloud";
import { CameraIcon } from "@/components/remocn/icon-camera";
import { MailIcon } from "@/components/remocn/icon-mail";
import { CheckCircleIcon } from "@/components/remocn/icon-check-circle";
import { SunIcon } from "@/components/remocn/icon-sun";
import { MoonIcon } from "@/components/remocn/icon-moon";
import { PartyPopperIcon } from "@/components/remocn/icon-party-popper";
import { TrendingUpIcon } from "@/components/remocn/icon-trending-up";
import { WalletIcon } from "@/components/remocn/icon-wallet";
import { CrownIcon } from "@/components/remocn/icon-crown";
import { TrophyIcon } from "@/components/remocn/icon-trophy";
import { FlameIcon } from "@/components/remocn/icon-flame";
import { SparklesIcon } from "@/components/remocn/icon-sparkles";
import { TimerIcon } from "@/components/remocn/icon-timer";

const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400", "500"],
});

const SANS = `${SANS_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;
const MONO = `${MONO_FAMILY}, ui-monospace, SFMono-Regular, monospace`;

// The shipped remocn.dev brand: warm obsidian + one lime accent.
const OBSIDIAN = "#141318";
const INK = "#f2f2f2";
const MUTED = "rgba(242,242,242,0.62)";
const FAINT = "rgba(242,242,242,0.4)";
const LIME = "#C3E88D";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// The neuro-noise field that carries the whole video — a web of fine living
// strokes, the same material the icons are made of. Obsidian family with a
// faint lime undertone, pushed far back by opacity + the scrim.
const NOISE_PROPS = {
  speed: 0.4,
  colorBack: "#141318",
  colorMid: "#26252f",
  colorFront: "#7d8672",
  brightness: 0.06,
  contrast: 0.32,
};

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap.
// ---------------------------------------------------------------------------
const S_HOOK_A = 72; //   "Everything in your video moves" — the lush entrance
const S_HOOK_B = 66; //   "Except the icons" — deliberately dead
const S_REVEAL = 196; //  the bell draws itself, then the name lands
const S_POS = 96; //      "100 Lucide icons, rewritten for video"
const S_GALLERY = 132; // 24 icons stroke-draw in a diagonal wave, then act
const S_ACTS = 464; //    "Then it acts" + one stroke morphs through ten icons
const S_INSTALL = 180; // the typed command with a rolodex of icon names
const S_OUTRO = 162; //   the new-logo lockup animation, inherited

const T_CROSS_A = 16; //  hookA → hookB (fade-through: out, then in)
const T_PUSH_IN = 32; //  hookB → reveal
const T_CROSS = 14; //    reveal → positioning
const T_WHIP = 18; //     positioning → gallery
const T_FOCUS = 24; //    acts → install
const T_PUSH_OUT = 32; // install → outro

// Readability scrim over the backdrop shader.
const Scrim: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 120% at 50% 42%, rgba(20,19,24,${
        0.3 * strength
      }) 0%, rgba(20,19,24,${0.78 * strength}) 100%)`,
    }}
  />
);

// ===========================================================================
// Scene 1 — Hook A. The lushest text entrance remocn ships, deliberately:
// this frame is the world where everything moves.
// ===========================================================================
const HookMovesScene: React.FC = () => (
  <AbsoluteFill>
    <SoftBlurIn
      text="Everything in your video moves"
      fontSize={54}
      fontWeight={400}
      color={INK}
    />
  </AbsoluteFill>
);

// ===========================================================================
// Scene 2 — Hook B. The line itself is dead: no entrance, no easing, no
// life — the joke is the grammar, over three frozen gray outlines. The
// crossfade in is the only motion it gets.
// ===========================================================================
const HookStillScene: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 46,
      }}
    >
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 54,
          color: INK,
          lineHeight: 1,
        }}
      >
        Except the icons
      </span>
      <div style={{ display: "flex", gap: 34 }}>
        <StarIconStatic size={44} color={FAINT} strokeWidth={1.8} />
        <BellIconStatic size={44} color={FAINT} strokeWidth={1.8} />
        <HeartIconStatic size={44} color={FAINT} strokeWidth={1.8} />
      </div>
    </div>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 3 — The reveal. One huge bell stroke-draws itself on alone, gets its
// grand beat, rings once — then glides up and shrinks as the name resolves
// tight beneath it. The product demonstrates itself before it is named.
// ===========================================================================
const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();

  // The bell's grand beat ends around frame 102 (draw + ring at speed 0.55);
  // then it glides up into the lockup as the name lands.
  const glide = interpolate(frame, [104, 130], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const bellY = -10 - glide * 62;
  const bellScale = 1 - glide * 0.52;

  const subOpacity = interpolate(frame, [152, 172], [0, 1], clampOpts);

  return (
    <AbsoluteFill>
      {/* the bell */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            transform: `translateY(${bellY}px) scale(${bellScale})`,
          }}
        >
          <Sequence from={18} layout="none">
            <BellIcon size={170} color={INK} strokeWidth={1.6} speed={0.55} />
          </Sequence>
        </div>
      </AbsoluteFill>

      {/* the name — resolves tight beneath the glided bell */}
      <Sequence from={108}>
        <AbsoluteFill style={{ transform: "translateY(40px)" }}>
          <SoftBlurIn
            text="Remocn Icons"
            fontSize={64}
            fontWeight={400}
            color={INK}
          />
        </AbsoluteFill>
      </Sequence>

      {/* the category line */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <span
          style={{
            transform: "translateY(104px)",
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 21,
            color: FAINT,
            opacity: subOpacity,
          }}
        >
          A new icon set for Remotion
        </span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 4 — The positioning, assembling word by word. The plain number 100
// rides in as just another word.
// ===========================================================================
const PositioningScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={8}>
      <KineticCenterBuild
        text="100 Lucide icons, rewritten for video"
        fontSize={52}
        fontWeight={400}
        color={INK}
        measureScale={1.08}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 5 — The gallery. 24 of the 100, all running the same real registry
// code: each icon stroke-draws on in a diagonal wave and then fires its own
// action — the wall never sits still.
// ===========================================================================
const GALLERY_ICONS: ReadonlyArray<
  React.ComponentType<{
    animation?: "draw" | "action" | "both";
    size?: number;
    color?: string;
    strokeWidth?: number;
    speed?: number;
  }>
> = [
  PlayIcon,
  BellIcon,
  HeartIcon,
  StarIcon,
  SearchIcon,
  RocketIcon,
  ZapIcon,
  SendIcon,
  SettingsIcon,
  LockIcon,
  CloudIcon,
  CameraIcon,
  MailIcon,
  CheckCircleIcon,
  SunIcon,
  MoonIcon,
  PartyPopperIcon,
  TrendingUpIcon,
  WalletIcon,
  CrownIcon,
  TrophyIcon,
  FlameIcon,
  SparklesIcon,
  TimerIcon,
];

const GALLERY_COLS = 6;
const GALLERY_SIZE = 58;

const GalleryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const lineOpacity = interpolate(frame, [22, 42], [0, 1], clampOpts);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 54,
          transform: "translateY(-8px)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${GALLERY_COLS}, ${GALLERY_SIZE}px)`,
            columnGap: 60,
            rowGap: 42,
          }}
        >
          {GALLERY_ICONS.map((Icon, i) => {
            const row = Math.floor(i / GALLERY_COLS);
            const col = i % GALLERY_COLS;
            const delay = 12 + (row + col) * 5;
            return (
              <div
                key={i}
                style={{
                  width: GALLERY_SIZE,
                  height: GALLERY_SIZE,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sequence from={delay} layout="none">
                  <Icon
                    animation="both"
                    size={GALLERY_SIZE}
                    color={INK}
                    strokeWidth={1.8}
                  />
                </Sequence>
              </div>
            );
          })}
        </div>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 24,
            color: MUTED,
            opacity: lineOpacity,
          }}
        >
          Every icon draws itself on
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 6 — Then it acts. ONE continuous lime stroke carries the whole
// scene: it draws on as the heart, performs its little action, then morphs
// into the next icon, and the next — ten icons, one stroke, never cutting.
// Each station's mono name crossfades beneath. The finale lands the claim
// this shot just proved: the paths land in your repo, so you can write
// motion the registry never shipped.
// ===========================================================================

// Path data from the installed icon components (components/remocn/icon-*.tsx
// and the remocn-icons registry).
const HEART_PATH =
  "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5";
const STAR_PATH =
  "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z";
const ZAP_PATH =
  "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z";
const FLAME_PATH =
  "M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4";
const MOON_PATH =
  "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401";
const CLOUD_PATH = "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z";
const BUBBLE_PATH =
  "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719";
const SHIELD_PATH =
  "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z";
const BOOKMARK_PATH =
  "M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z";
const PLAY_PATH =
  "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z";

// ---------------------------------------------------------------------------
// Ring morphing. `interpolatePath` maps command-by-command from each path's
// own start point, so shapes whose parameterizations start on opposite sides
// (or wind the other way) twist through figure-eights mid-morph. Instead we
// resample every glyph into a fixed-size ring of points, normalize the
// winding, and rotate each morph target's ring to the phase that minimizes
// travel — then a plain point lerp reads as one shape flowing into the next.
// All rings and alignments are precomputed at module scope.
// ---------------------------------------------------------------------------
const RING_N = 180;
type Ring = ReadonlyArray<{ x: number; y: number }>;

const ringOf = (d: string): Ring => {
  const len = getLength(d);
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < RING_N; i++) {
    pts.push(getPointAtLength(d, (len * i) / RING_N));
  }
  // normalize winding (shoelace; SVG's y grows downward)
  let area = 0;
  for (let i = 0; i < RING_N; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % RING_N];
    area += a.x * b.y - b.x * a.y;
  }
  if (area < 0) pts.reverse();
  return pts;
};

// Rotate ring `b` to the phase offset that best matches ring `a`.
const alignRing = (a: Ring, b: Ring): Ring => {
  let bestK = 0;
  let bestCost = Infinity;
  for (let k = 0; k < RING_N; k++) {
    let cost = 0;
    for (let i = 0; i < RING_N; i += 4) {
      const p = a[i];
      const q = b[(i + k) % RING_N];
      cost += (p.x - q.x) ** 2 + (p.y - q.y) ** 2;
    }
    if (cost < bestCost) {
      bestCost = cost;
      bestK = k;
    }
  }
  return a.map((_, i) => b[(i + bestK) % RING_N]);
};

const lerpRingPath = (a: Ring, b: Ring, t: number): string => {
  let s = "";
  for (let i = 0; i < RING_N; i++) {
    const x = a[i].x + (b[i].x - a[i].x) * t;
    const y = a[i].y + (b[i].y - a[i].y) * t;
    s += `${i === 0 ? "M" : "L"}${x.toFixed(3)} ${y.toFixed(3)} `;
  }
  return `${s}Z`;
};

// keyframe helper for the little station actions.
const kf = (q: number, stops: number[], vals: number[]) =>
  interpolate(q, stops, vals, {
    ...clampOpts,
    easing: Easing.inOut(Easing.quad),
  });

// scale around a pivot in the 24×24 icon space.
const pivotScale = (sx: number, sy: number, px = 12, py = 12) =>
  `translate(${px} ${py}) scale(${sx} ${sy}) translate(${-px} ${-py})`;

// Each station: the icon's path, its mono name, and a hand-written action —
// motion the registry does NOT ship, performed on the raw path. The order is
// chosen for silhouette similarity (round blobs first, then the angular
// family), so every morph reads as one shape flowing into a neighbour.
// Every action starts AND ends at identity, so the hand-off from a finished
// morph into the action never jumps.
type MorphStation = {
  name: string;
  d: string;
  act: (q: number) => string;
};

const STATIONS: MorphStation[] = [
  {
    name: "icon-heart",
    d: HEART_PATH,
    // beat, twice
    act: (q) => pivotScale(kf(q, [0, 0.25, 0.5, 0.75, 1], [1, 1.12, 1, 1.07, 1]), kf(q, [0, 0.25, 0.5, 0.75, 1], [1, 1.12, 1, 1.07, 1])),
  },
  {
    name: "icon-flame",
    d: FLAME_PATH,
    // flicker from the base
    act: (q) => pivotScale(1, kf(q, [0, 0.25, 0.5, 0.75, 1], [1, 1.12, 0.94, 1.06, 1]), 12, 21),
  },
  {
    name: "icon-moon",
    d: MOON_PATH,
    // rock to sleep
    act: (q) => `rotate(${kf(q, [0, 0.3, 0.6, 0.85, 1], [0, -12, 7, -3, 0])} 12 12)`,
  },
  {
    name: "icon-cloud",
    d: CLOUD_PATH,
    // drift
    act: (q) => `translate(${kf(q, [0, 0.33, 0.66, 1], [0, -2.6, 2.6, 0])} 0)`,
  },
  {
    name: "icon-message-circle",
    d: BUBBLE_PATH,
    // bounce off its tail
    act: (q) => pivotScale(kf(q, [0, 0.3, 0.6, 1], [1, 1.1, 0.97, 1]), kf(q, [0, 0.3, 0.6, 1], [1, 1.1, 0.97, 1]), 4, 21),
  },
  {
    name: "icon-shield",
    d: SHIELD_PATH,
    // a firm guard thump
    act: (q) => pivotScale(kf(q, [0, 0.3, 0.6, 1], [1, 1.09, 0.97, 1]), kf(q, [0, 0.3, 0.6, 1], [1, 1.09, 0.97, 1])),
  },
  {
    name: "icon-bookmark",
    d: BOOKMARK_PATH,
    // dip, like it just saved something
    act: (q) => `translate(0 ${kf(q, [0, 0.35, 0.7, 1], [0, 2.5, -1.5, 0])})`,
  },
  {
    name: "icon-star",
    d: STAR_PATH,
    // twinkle — a rock and a pop, easing out of rest
    act: (q) =>
      `rotate(${kf(q, [0, 0.35, 0.7, 1], [0, -14, 8, 0])} 12 12) ${pivotScale(
        kf(q, [0, 0.45, 1], [1, 1.08, 1]),
        kf(q, [0, 0.45, 1], [1, 1.08, 1]),
      )}`,
  },
  {
    name: "icon-zap",
    d: ZAP_PATH,
    // flash
    act: (q) => pivotScale(kf(q, [0, 0.2, 0.45, 0.7, 1], [1, 1.16, 0.95, 1.05, 1]), kf(q, [0, 0.2, 0.45, 0.7, 1], [1, 1.16, 0.95, 1.05, 1])),
  },
  {
    name: "icon-play",
    d: PLAY_PATH,
    // press
    act: (q) => pivotScale(kf(q, [0, 0.3, 0.6, 1], [1, 0.92, 1.06, 1]), kf(q, [0, 0.3, 0.6, 1], [1, 0.92, 1.06, 1])),
  },
];

// Precomputed rings: each leg lerps from station i-1's canonical ring to
// station i's ring rotated into the matching phase.
const STATION_RINGS = STATIONS.map((s) => ringOf(s.d));
const STATION_LEG_TO = STATIONS.map((_, i) =>
  i === 0 ? null : alignRing(STATION_RINGS[i - 1], STATION_RINGS[i]),
);

// The stroke's clock: the heart draws on, then every PERIOD frames the
// stroke morphs (MORPH_DUR) into the next station and acts out the rest.
const DRAW_IN = [46, 70] as const;
const STATION_0 = 70;
const PERIOD = 32;
const MORPH_DUR = 12;
const ACT_DUR = 20;

const actStart = (i: number) => STATION_0 + i * PERIOD;

// Which shape the stroke is at `frame`, morphing between neighbours. At rest
// the exact registry path renders; mid-leg the ring lerp takes over.
const morphedD = (frame: number): string => {
  let d = STATIONS[0].d;
  for (let i = 1; i < STATIONS.length; i++) {
    const start = actStart(i) - MORPH_DUR;
    if (frame < start) break;
    const p = interpolate(frame, [start, start + MORPH_DUR], [0, 1], {
      ...clampOpts,
      easing: Easing.inOut(Easing.cubic),
    });
    d =
      p >= 1
        ? STATIONS[i].d
        : lerpRingPath(
            STATION_RINGS[i - 1],
            STATION_LEG_TO[i] as Ring,
            p,
          );
  }
  return d;
};

const ActsScene: React.FC = () => {
  const frame = useCurrentFrame();

  // The heart draws itself on first — the same gesture every icon ships.
  const draw = interpolate(frame, [DRAW_IN[0], DRAW_IN[1]], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const { strokeDasharray, strokeDashoffset } = evolvePath(
    draw,
    STATIONS[0].d,
  );

  const d = morphedD(frame);
  const morphing = STATIONS.some((_, i) => {
    if (i === 0) return false;
    const s = actStart(i) - MORPH_DUR;
    return frame >= s && frame <= s + MORPH_DUR;
  });

  // The station currently acting (or -1 during a morph / before the draw).
  let acting = -1;
  for (let i = 0; i < STATIONS.length; i++) {
    const s = actStart(i);
    const isLast = i === STATIONS.length - 1;
    const end = isLast ? Number.MAX_SAFE_INTEGER : s + PERIOD - MORPH_DUR;
    if (frame >= s && frame < end) acting = i;
  }
  const actTransform =
    acting >= 0
      ? STATIONS[acting].act(
          Math.min(1, (frame - actStart(acting)) / ACT_DUR),
        )
      : undefined;

  // The claims rise in from below — the play label has already left its
  // slot, so nothing ever overlaps.
  const riseOpts = { ...clampOpts, easing: Easing.out(Easing.cubic) };
  const claim1 = interpolate(frame, [382, 400], [0, 1], riseOpts);
  const claim2 = interpolate(frame, [400, 418], [0, 1], riseOpts);

  return (
    <AbsoluteFill>
      {/* the statement, alone first */}
      <Sequence durationInFrames={52}>
        <ScaleDownFade
          text="Then it acts"
          fontSize={54}
          fontWeight={400}
          color={INK}
        />
      </Sequence>

      {/* the one continuous stroke, morphing through ten icons */}
      <Sequence from={DRAW_IN[0] - 2}>
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <svg
            viewBox="0 0 24 24"
            width={200}
            height={200}
            fill="none"
            stroke={LIME}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ overflow: "visible", transform: "translateY(-30px)" }}
          >
            <g transform={actTransform}>
              <path
                d={d}
                strokeDasharray={
                  draw < 1 && !morphing ? strokeDasharray : undefined
                }
                strokeDashoffset={
                  draw < 1 && !morphing ? strokeDashoffset : undefined
                }
              />
            </g>
          </svg>
        </AbsoluteFill>
      </Sequence>

      {/* the station names, crossfading beneath the stroke */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {STATIONS.map((st, i) => {
          const s = actStart(i);
          const isLast = i === STATIONS.length - 1;
          const fadeIn = interpolate(frame, [s + 2, s + 10], [0, 1], clampOpts);
          const fadeOut = isLast
            ? interpolate(frame, [366, 376], [1, 0], clampOpts)
            : interpolate(
                frame,
                [s + PERIOD - MORPH_DUR - 4, s + PERIOD - MORPH_DUR + 4],
                [1, 0],
                clampOpts,
              );
          const opacity = fadeIn * fadeOut;
          if (opacity <= 0.001) return null;
          return (
            <span
              key={st.name}
              style={{
                position: "absolute",
                transform: "translateY(122px)",
                fontFamily: MONO,
                fontWeight: 400,
                fontSize: 18,
                color: FAINT,
                opacity,
              }}
            >
              {st.name}
            </span>
          );
        })}
      </AbsoluteFill>

      {/* the claim this shot just proved */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <span
          style={{
            position: "absolute",
            transform: `translateY(${122 + (1 - claim1) * 18}px)`,
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 24,
            color: MUTED,
            opacity: claim1,
          }}
        >
          The paths land in your repo
        </span>
        <span
          style={{
            position: "absolute",
            transform: `translateY(${162 + (1 - claim2) * 18}px)`,
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 24,
            color: MUTED,
            opacity: claim2,
          }}
        >
          So you can write motion we never shipped
        </span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 7 — The command types itself; the folder draws on above it, then the
// package name rolodex-flips through icon names while the icon above morphs
// in sync — flip and morph are the same beat.
// ===========================================================================
const CMD_PREFIX = "npx shadcn@latest add ";
const CMD_ITEMS = [
  "@remocn/icon-folder",
  "@remocn/icon-tag",
  "@remocn/icon-filter",
  "@remocn/icon-sparkles",
];

// Four icons the morph run did NOT use — fourteen distinct icons across the
// two scenes. Paths from the remocn-icons registry, ordered for silhouette
// similarity again (folder → tag → funnel → sparkle).
const FOLDER_PATH =
  "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z";
const TAG_PATH =
  "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z";
const FUNNEL_PATH =
  "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z";
const SPARKLES_PATH =
  "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z";

const CMD_PATHS = [FOLDER_PATH, TAG_PATH, FUNNEL_PATH, SPARKLES_PATH];
// The widest item sizes the name slot for the whole scene.
const CMD_SIZER = CMD_ITEMS.reduce((a, b) => (b.length > a.length ? b : a), "");
const CMD_RINGS = CMD_PATHS.map(ringOf);
const CMD_LEG_TO = CMD_PATHS.map((_, i) =>
  i === 0 ? null : alignRing(CMD_RINGS[i - 1], CMD_RINGS[i]),
);
const CMD_TOTAL = CMD_PREFIX.length + CMD_ITEMS[0].length;
const TYPE_START = 10;
const TYPE_SPEED = 1.5; // chars per frame
const ROLODEX_FROM = 66;
const ROLODEX_INTERVAL = 30;
const ROLODEX_FLIP = 10;

// Which shape the install icon is at `frame` — synced to the rolodex flips.
const installD = (frame: number): string => {
  let d = CMD_PATHS[0];
  for (let i = 1; i < CMD_PATHS.length; i++) {
    const start = ROLODEX_FROM + (i - 1) * ROLODEX_INTERVAL;
    if (frame < start) break;
    const p = interpolate(frame, [start, start + MORPH_DUR], [0, 1], {
      ...clampOpts,
      easing: Easing.inOut(Easing.cubic),
    });
    d =
      p >= 1
        ? CMD_PATHS[i]
        : lerpRingPath(CMD_RINGS[i - 1], CMD_LEG_TO[i] as Ring, p);
  }
  return d;
};

const InstallScene: React.FC = () => {
  const frame = useCurrentFrame();

  const typed = Math.max(
    0,
    Math.min(CMD_TOTAL, Math.floor((frame - TYPE_START) * TYPE_SPEED)),
  );
  const typingDone = typed >= CMD_TOTAL;
  const flipping = frame >= ROLODEX_FROM;
  const caretOn = typingDone ? Math.floor(frame / 15) % 2 === 0 : true;
  const caretOpacity = interpolate(frame, [56, 64], [1, 0], clampOpts);

  const prefixVisible = Math.min(CMD_PREFIX.length, typed);
  const nameVisible = Math.max(
    0,
    Math.min(CMD_ITEMS[0].length, typed - CMD_PREFIX.length),
  );

  // The install icon draws on as the name finishes typing, then morphs.
  const draw = interpolate(frame, [44, 60], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const { strokeDasharray, strokeDashoffset } = evolvePath(draw, CMD_PATHS[0]);
  const d = installD(frame);

  // A little settle pop each time a new shape lands.
  let pop = 1;
  for (let i = 1; i < CMD_PATHS.length; i++) {
    const landed = ROLODEX_FROM + (i - 1) * ROLODEX_INTERVAL + MORPH_DUR;
    if (frame >= landed) {
      pop = interpolate(frame, [landed, landed + 8], [1.06, 1], {
        ...clampOpts,
        easing: Easing.out(Easing.cubic),
      });
    }
  }

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 44,
          transform: "translateY(-6px)",
        }}
      >
        {/* the icon's box is reserved from frame one so nothing reflows */}
        <div
          style={{
            width: 96,
            height: 96,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Sequence from={42} layout="none">
            <svg
              viewBox="0 0 24 24"
              width={96}
              height={96}
              fill="none"
              stroke={INK}
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                overflow: "visible",
                transformOrigin: "center",
                transform: `scale(${pop})`,
              }}
            >
              <path
                d={d}
                strokeDasharray={draw < 1 ? strokeDasharray : undefined}
                strokeDashoffset={draw < 1 ? strokeDashoffset : undefined}
              />
            </svg>
          </Sequence>
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 25,
            lineHeight: 1,
            whiteSpace: "pre",
          }}
        >
          <span style={{ color: INK }}>
            {CMD_PREFIX.slice(0, prefixVisible)}
          </span>
          {/* The name slot is sized by the longest item from frame one —
              the same reservation RolodexFlip makes — so handing over from
              typed text to the rolodex never re-centers the line. */}
          <span
            style={{
              position: "relative",
              display: "inline-block",
              verticalAlign: "bottom",
            }}
          >
            <span style={{ visibility: "hidden" }}>{CMD_SIZER}</span>
            <span style={{ position: "absolute", left: 0, top: 0 }}>
              {flipping ? (
                <RolodexFlip
                  items={CMD_ITEMS}
                  from={ROLODEX_FROM}
                  interval={ROLODEX_INTERVAL}
                  flipDuration={ROLODEX_FLIP}
                  style={{ color: LIME }}
                />
              ) : (
                <span style={{ color: LIME }}>
                  {CMD_ITEMS[0].slice(0, nameVisible)}
                </span>
              )}
              <span
                style={{
                  display: "inline-block",
                  width: 13,
                  height: 26,
                  verticalAlign: "-4px",
                  background: caretOn ? MUTED : "transparent",
                  opacity: caretOpacity,
                }}
              />
            </span>
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 8 — The lockup, inherited from the rebrand video: the R letterform
// stroke-draws itself on at cap height, the ink fills beneath the tracing
// outline, then "emocn" slides out from behind the mark as the outline
// thins away.
// ===========================================================================
const R_VIEWBOX = "0 0 131.75 144.15";
const R_RATIO = 131.75 / 144.15;
const R_PATH =
  "M 0.35 7.55 L 0.35 0.35 L 86.55 0.35 C 110.55 1.35, 131.25 24.05, 131.25 47.55 C 131.25 71.05, 112.55 88.55, 93.55 94.35 L 131.75 144.15 L 101.55 144.15 C 96.55 144.15, 94.55 141.55, 93.25 138.45 L 63.95 104.05 C 60.55 98.75, 56.55 97.35, 51.55 97.35 L 43.05 97.35 C 35.05 98.05, 28.85 102.55, 28.85 112.05 L 28.85 144.15 L 0.35 144.15 L 0.35 106.05 C 0.35 88.05, 21.55 71.05, 32.55 69.65 L 86.55 66.55 C 96.55 65.55, 102.15 58.55, 102.15 47.55 C 102.15 36.55, 96.05 30.35, 84.55 29.25 L 28.55 29.05 C 16.55 28.05, 3.05 17.55, 0.35 7.55 Z";
const R_THIN = 6;

const RemocnMark: React.FC<{
  height: number;
  draw?: number;
  fill?: number;
  color?: string;
  thin?: number;
}> = ({ height, draw = 1, fill = 1, color = INK, thin = 1 }) => {
  const maskId = React.useId();
  return (
    <svg
      viewBox={R_VIEWBOX}
      width={height * R_RATIO}
      height={height}
      style={{ display: "block", color, overflow: "visible" }}
    >
      <mask
        id={maskId}
        maskUnits="userSpaceOnUse"
        x={-10}
        y={-10}
        width={152}
        height={165}
      >
        <path
          d={R_PATH}
          fill="#ffffff"
          stroke="#000000"
          strokeWidth={R_THIN * thin}
          strokeLinejoin="round"
        />
      </mask>
      <rect
        x={-10}
        y={-10}
        width={152}
        height={165}
        fill="currentColor"
        opacity={fill}
        mask={`url(#${maskId})`}
      />
      <path
        d={R_PATH}
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinejoin="round"
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
        opacity={1 - thin}
      />
    </svg>
  );
};

const WORD_TAIL = "emocn";
const WORD_SIZE = 92;
const WORD_TRACKING = -0.03; // em — the wordmark's own tracking, inherited
const MARK_H = 66;
const M_SLIDE = 96;

// Canvas-measured width of the tail at the loaded Manrope, corrected for CSS
// letter-spacing, which canvas ignores.
const measureTail = (): number => {
  const fallback = WORD_TAIL.length * WORD_SIZE * 0.55;
  if (typeof document === "undefined") return fallback;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return fallback;
  ctx.font = `400 ${WORD_SIZE}px ${SANS_FAMILY}, sans-serif`;
  return (
    ctx.measureText(WORD_TAIL).width +
    WORD_TAIL.length * WORD_TRACKING * WORD_SIZE +
    2
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const tailWidth = React.useMemo(measureTail, []);

  const markDraw = interpolate(frame, [14, 64], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const markFill = interpolate(frame, [52, 76], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const markSettle = spring({
    frame: frame - 14,
    fps,
    config: { damping: 16, stiffness: 90, mass: 0.9 },
  });

  // The outline leaves as the tail slides out — the motion hides the
  // letterform thinning to text weight.
  const thin = interpolate(frame, [M_SLIDE, M_SLIDE + 22], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const slideIn =
    frame < M_SLIDE
      ? 0
      : Math.min(
          1,
          spring({
            frame: frame - M_SLIDE,
            fps,
            config: { damping: 18, stiffness: 90, mass: 1 },
          }),
        );

  const markW = MARK_H * R_RATIO;
  const markCx = -(slideIn * tailWidth) / 2;

  // The word box's bottom sits WORD_SIZE * 0.115 below the R's bottom edge,
  // so the R stands on the same baseline as the tail.
  const wordTop =
    height / 2 + MARK_H / 2 - (WORD_SIZE - Math.round(WORD_SIZE * 0.115));
  const wordLeft = width / 2 + markCx + markW / 2;

  const urlOpacity = interpolate(frame, [126, 146], [0, 1], clampOpts);

  return (
    <AbsoluteFill>
      {/* the wordmark tail, sliding out from behind the R */}
      <div
        style={{
          position: "absolute",
          left: wordLeft,
          top: wordTop,
          width: slideIn * tailWidth,
          height: WORD_SIZE,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            whiteSpace: "nowrap",
            lineHeight: 1,
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: WORD_SIZE,
            letterSpacing: `${WORD_TRACKING}em`,
            color: INK,
          }}
        >
          {WORD_TAIL}
        </span>
      </div>

      {/* the mark */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) translate(${markCx}px, 0px)`,
          width: markW,
          height: MARK_H,
        }}
      >
        <div
          style={{
            transform: `scale(${interpolate(markSettle, [0, 1], [0.94, 1])})`,
            transformOrigin: "center",
          }}
        >
          <RemocnMark
            height={MARK_H}
            draw={markDraw}
            fill={markFill}
            thin={thin}
          />
        </div>
      </div>

      {/* the destination */}
      <span
        style={{
          position: "absolute",
          bottom: 46,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 19,
          color: FAINT,
          opacity: urlOpacity,
        }}
      >
        Write code - get video
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Crossfade presentation for the quiet cuts.
// ===========================================================================
type EmptyProps = Record<string, never>;

const Crossfade: React.FC<TransitionPresentationComponentProps<EmptyProps>> = ({
  children,
  presentationProgress,
  presentationDirection,
}) => {
  const entering = presentationDirection === "entering";
  const opacity = entering ? presentationProgress : 1 - presentationProgress;
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
const crossfade = (): TransitionPresentation<EmptyProps> => ({
  component: Crossfade,
  props: {},
});

// Fade-through for the hook cut: the first line leaves fully before the
// second appears — the two centered lines never overlap.
const FadeThrough: React.FC<
  TransitionPresentationComponentProps<EmptyProps>
> = ({ children, presentationProgress, presentationDirection }) => {
  const entering = presentationDirection === "entering";
  const opacity = entering
    ? interpolate(presentationProgress, [0.55, 1], [0, 1], clampOpts)
    : interpolate(presentationProgress, [0, 0.45], [1, 0], clampOpts);
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
const fadeThrough = (): TransitionPresentation<EmptyProps> => ({
  component: FadeThrough,
  props: {},
});

// ===========================================================================
// Composition root.
// ===========================================================================
export const REMOCN_ICONS_DURATION =
  S_HOOK_A +
  S_HOOK_B +
  S_REVEAL +
  S_POS +
  S_GALLERY +
  S_ACTS +
  S_INSTALL +
  S_OUTRO -
  (T_CROSS_A + T_PUSH_IN + T_CROSS + T_WHIP + T_FOCUS + T_PUSH_OUT);

export const RemocnIconsDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={
        {
          background: OBSIDIAN,
          fontFamily: SANS,
          "--font-geist-sans": SANS_FAMILY,
        } as React.CSSProperties
      }
    >
      {/* One neuro-noise field carries the whole video — a web of fine
          living strokes, pushed way back so it never competes with the
          icons' own strokes. */}
      <AbsoluteFill style={{ opacity: 0.5 }}>
        <ShaderNeuroNoise {...NOISE_PROPS} />
      </AbsoluteFill>
      <Scrim strength={0.9} />

      <TransitionSeries>
        {/* 1 — the world where everything moves */}
        <TransitionSeries.Sequence durationInFrames={S_HOOK_A}>
          <HookMovesScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_CROSS_A })}
          presentation={fadeThrough()}
        />

        {/* 2 — the still line over frozen icons */}
        <TransitionSeries.Sequence durationInFrames={S_HOOK_B}>
          <HookStillScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_PUSH_IN })}
          presentation={pushThrough({ zoom: 2.6 })}
        />

        {/* 3 — the bell draws itself, then the name */}
        <TransitionSeries.Sequence durationInFrames={S_REVEAL}>
          <RevealScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_CROSS })}
          presentation={crossfade()}
        />

        {/* 4 — the positioning */}
        <TransitionSeries.Sequence durationInFrames={S_POS}>
          <PositioningScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_WHIP })}
          presentation={whipPan({ direction: "left" })}
        />

        {/* 5 — the gallery wave */}
        <TransitionSeries.Sequence durationInFrames={S_GALLERY}>
          <GalleryScene />
        </TransitionSeries.Sequence>

        {/* 6 — hard cut: one stroke acts out ten icons */}
        <TransitionSeries.Sequence durationInFrames={S_ACTS}>
          <ActsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_FOCUS })}
          presentation={focusPull()}
        />

        {/* 7 — the command with the rolodex of names */}
        <TransitionSeries.Sequence durationInFrames={S_INSTALL}>
          <InstallScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_PUSH_OUT })}
          presentation={pushThrough({ zoom: 2.4 })}
        />

        {/* 8 — the lockup */}
        <TransitionSeries.Sequence durationInFrames={S_OUTRO}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
