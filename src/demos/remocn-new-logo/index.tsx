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
import { loadFont as loadSans } from "@remotion/google-fonts/Manrope";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { ScaleDownFade } from "@/components/remocn/scale-down-fade";
import { pushThrough } from "@/components/remocn/push-through";
import { ShaderWarp } from "@/components/remocn/shader-warp";

const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700", "800"],
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
// The logo's plate: black.
const PLATE = "#000000";
const HAIRLINE = "rgba(242,242,242,0.1)";

// X's own palette, used only inside the X mockup.
const X_INK = "#e7e9ea";
const X_MUTED = "#71767b";
const X_BLUE = "#1d9bf0";

// GitHub's own palette, used only inside the GitHub mockup.
const GH_BG = "rgba(13,17,23,0.96)";
const GH_INK = "#e6edf3";
const GH_MUTED = "#9198a1";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// The deep-blue paper.design warp preset that carries the whole video (and
// doubles as the X profile's banner image).
const WARP_PROPS = {
  speed: 2.8,
  colors: ["#000d14", "#001929", "#00263d", "#003557", "#005285"],
  proportion: 0.05,
  softness: 0.07,
  distortion: 0.29,
  swirl: 0.55,
  swirlIterations: 13.4,
  shape: "checks" as const,
  shapeScale: 0.34,
  scale: 0.8,
  rotation: 0,
};

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap.
// ---------------------------------------------------------------------------
const S_HOOK = 124; //   two scale-down-fade lines
const S_CODE = 130; //   the logo's SVG source types itself
const S_MORPH = 530; //  one continuous shot: draw → X → GitHub → favicon →
//                       reveal, the mark tile morphing between every context

const T_X = 14; //       crossfade into the code scene
const T_PUSH = 40; //    push-through INTO the code

// ===========================================================================
// The mark — the R letterform on its black plate. The R path is inlined so
// the morph scene can draw it on (pathLength-normalized dashoffset).
// ===========================================================================
const R_VIEWBOX = "0 0 131.75 144.15";
const R_RATIO = 131.75 / 144.15;
const R_PATH =
  "M 0.35 7.55 L 0.35 0.35 L 86.55 0.35 C 110.55 1.35, 131.25 24.05, 131.25 47.55 C 131.25 71.05, 112.55 88.55, 93.55 94.35 L 131.75 144.15 L 101.55 144.15 C 96.55 144.15, 94.55 141.55, 93.25 138.45 L 63.95 104.05 C 60.55 98.75, 56.55 97.35, 51.55 97.35 L 43.05 97.35 C 35.05 98.05, 28.85 102.55, 28.85 112.05 L 28.85 144.15 L 0.35 144.15 L 0.35 106.05 C 0.35 88.05, 21.55 71.05, 32.55 69.65 L 86.55 66.55 C 96.55 65.55, 102.15 58.55, 102.15 47.55 C 102.15 36.55, 96.05 30.35, 84.55 29.25 L 28.55 29.05 C 16.55 28.05, 3.05 17.55, 0.35 7.55 Z";

// How many viewBox units get eroded off the letterform (half per edge), so
// the R's strokes sit at text weight next to the Manrope wordmark.
const R_THIN = 6;

// `thin` is a 0→1 progress: at 0 the mark is the original letterform with its
// persistent outline (the draw/fill animation plays on this, exactly as the
// original design), at 1 it is the eroded, text-weight letter with no
// outline. The morph scene blends it during the shrink into the X avatar,
// where the motion hides the weight change.
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
      {/* The black stroke inside the mask eats thin·R_THIN/2 off every
          edge — a uniform geometric thinning that works over any background. */}
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
      {/* The outline: it traces the letter on during the draw, stays put
          while the color fills in beneath it, and only leaves as the mark
          thins down. */}
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

// The R + wordmark lockup used inside the X banner.
const MiniLockup: React.FC<{ markH: number; fontSize: number }> = ({
  markH,
  fontSize,
}) => (
  <div style={{ display: "flex", alignItems: "flex-end" }}>
    <div style={{ marginBottom: Math.round(fontSize * 0.115) }}>
      <RemocnMark height={markH} color="#ffffff" />
    </div>
    <span
      style={{
        lineHeight: 1,
        fontFamily: SANS,
        fontWeight: 400,
        fontSize,
        letterSpacing: "-0.03em",
        color: "#ffffff",
      }}
    >
      emocn
    </span>
  </div>
);

// ---------------------------------------------------------------------------
// Tiny stroke icons for the mockup chrome.
// ---------------------------------------------------------------------------
const Icon: React.FC<{ size?: number; children: React.ReactNode }> = ({
  size = 16,
  children,
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", flexShrink: 0 }}
  >
    {children}
  </svg>
);

const ArrowLeftIcon = () => (
  <Icon size={20}>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </Icon>
);
const SearchIcon = () => (
  <Icon size={18}>
    <circle cx={11} cy={11} r={7} />
    <path d="m21 21-4.5-4.5" />
  </Icon>
);
const GrokIcon = () => (
  <Icon size={18}>
    <circle cx={12} cy={12} r={9} />
    <path d="m6 18 12-12" />
  </Icon>
);
const BriefcaseIcon = () => (
  <Icon>
    <rect x={2.5} y={7} width={19} height={13} rx={2} />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </Icon>
);
const PinIcon = () => (
  <Icon>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx={12} cy={10} r={3} />
  </Icon>
);
const LinkIcon = () => (
  <Icon>
    <path d="M9 17H7A5 5 0 0 1 7 7h2" />
    <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
    <path d="M8 12h8" />
  </Icon>
);
const CalendarIcon = () => (
  <Icon>
    <rect x={3} y={4} width={18} height={17} rx={2} />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </Icon>
);
const UsersIcon = () => (
  <Icon size={14}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx={9} cy={7} r={4} />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Icon>
);
const MailIcon = () => (
  <Icon size={14}>
    <rect x={2} y={4} width={20} height={16} rx={2} />
    <path d="m22 7-10 5L2 7" />
  </Icon>
);
const XLogoIcon: React.FC<{ size?: number }> = ({ size = 13 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    style={{ display: "block", flexShrink: 0 }}
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);
const VerifiedSeal: React.FC<{ size?: number }> = ({ size = 17 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 22 22"
    aria-label="Verified account"
    role="img"
    data-testid="icon-verified"
  >
    <g>
      <path
        d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
        fill={X_BLUE}
      ></path>
    </g>
  </svg>
);

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
// Scene 1 — Hook. Two lines land solo: the setup for the meta joke.
// ===========================================================================
const HookScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={62}>
      <ScaleDownFade
        text="Remocn needed a new logo"
        fontSize={54}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
    <Sequence from={62} durationInFrames={62}>
      <ScaleDownFade
        text="So we wrote one"
        fontSize={54}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 2 — The writing. The logo's SVG source types itself out — the black
// plate rect, then the R path in lime — closed by a block caret. The camera
// will push INTO this code.
// ===========================================================================
type CodeSegment = { t: string; c?: string };

const CODE_SEGMENTS: CodeSegment[] = [
  { t: '<svg viewBox="0 0 100 100">\n' },
  { t: '  <rect width="100" height="100" rx="14" fill="#000000" />\n' },
  { t: "  <path\n" },
  { t: '    fill="#ffffff"\n' },
  { t: "    d=" },
  { t: '"M 0.35 7.55 L 0.35 0.35 L 86.55 0.35\n', c: LIME },
  { t: '       C 110.55 1.35, 131.25 24.05, 131.25 47.55 …"', c: LIME },
  { t: "\n  />\n" },
  { t: "</svg>" },
];

const CODE_TOTAL = CODE_SEGMENTS.reduce((n, s) => n + s.t.length, 0);
const TYPE_START = 14;
const TYPE_SPEED = 3.4; // chars per frame

const CodeScene: React.FC = () => {
  const frame = useCurrentFrame();

  const typed = Math.max(
    0,
    Math.min(CODE_TOTAL, Math.floor((frame - TYPE_START) * TYPE_SPEED)),
  );
  const typingDone = typed >= CODE_TOTAL;
  const caretOn = typingDone ? Math.floor(frame / 15) % 2 === 0 : true;

  const fileTagOpacity = interpolate(frame, [4, 14], [0, 1], clampOpts);

  const caret = (
    <span
      key="caret"
      style={{
        display: "inline-block",
        width: 12,
        height: 24,
        verticalAlign: "-4px",
        background: caretOn ? MUTED : "transparent",
      }}
    />
  );

  const rendered: React.ReactNode[] = [];
  let offset = 0;
  let caretPlaced = false;
  CODE_SEGMENTS.forEach((seg, i) => {
    const visible = Math.max(0, Math.min(seg.t.length, typed - offset));
    if (visible > 0) {
      rendered.push(
        <span key={i} style={{ color: seg.c ?? MUTED }}>
          {seg.t.slice(0, visible)}
        </span>,
      );
    }
    offset += seg.t.length;
    if (!caretPlaced && typed < offset) {
      rendered.push(caret);
      caretPlaced = true;
    }
  });
  if (!caretPlaced) rendered.push(caret);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 17,
            color: FAINT,
            marginBottom: 22,
            opacity: fileTagOpacity,
          }}
        >
          remocn-logo.svg
        </div>
        <div
          style={{
            position: "relative",
            fontFamily: MONO,
            fontSize: 23,
            lineHeight: 1.7,
            whiteSpace: "pre",
            textAlign: "left",
          }}
        >
          {/* Invisible full-code sizer pins the block's layout from frame
              one, so the typing never re-centers the group. */}
          <div style={{ visibility: "hidden" }}>
            {CODE_SEGMENTS.map((s) => s.t).join("")}
          </div>
          <div style={{ position: "absolute", left: 0, top: 0 }}>
            {rendered}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 3 — The morph shot. One continuous take: the d attribute stroke-draws
// itself as the R, then ONE tile carries the mark through every context —
// it morphs into the avatar of a real X profile page, glides into the org
// avatar of a real GitHub header, shrinks to the favicon in a browser tab,
// and finally grows into the wordmark's first letter while its black plate
// dissolves. The chrome of each surface assembles around the tile in a calm
// top-to-bottom cascade and leaves; the tile never cuts.
// ===========================================================================

// --- X profile metrics (fixed so the avatar slot's center is exact) --------
const X_W = 640;
const X_TOPBAR = 50;
const X_BANNER = 170;
const X_AVA = 100;
const X_PAD_X = 20;
// section rows: pt12 + edit36 + mt14 + name28 + mt4 + handle18 + mt12 +
// bio20 + mt12 + meta18 + mt12 + follows18 + pb16 = 220
const X_SECTION = 220;
const X_TABS = 44;
const X_H = X_TOPBAR + X_BANNER + X_SECTION + X_TABS; // 484
const X_AVA_CX = -(X_W / 2) + X_PAD_X + X_AVA / 2; // -250
const X_AVA_CY = X_TOPBAR + X_BANNER - X_H / 2; // avatar center = banner seam

// --- GitHub header metrics ---------------------------------------------------
const G_W = 880;
const G_PAD = 28;
const G_AVA = 96;
const G_H = G_PAD + G_AVA + G_PAD; // 152
const G_AVA_CX = -(G_W / 2) + G_PAD + G_AVA / 2; // -364

// --- Browser fragment metrics ------------------------------------------------
const F_CARD_W = 640;
const F_FAV = 18;
const F_CARD_H = 108;
const F_FAV_CX = -(F_CARD_W / 2) + 14 + 16 + F_FAV / 2; // = -281
const F_FAV_CY = -(F_CARD_H / 2) + 10 + 10 + F_FAV / 2; // = -25

// --- Reveal lockup metrics ---------------------------------------------------
const WORD_TAIL = "emocn";
const WORD_SIZE = 92;
const WORD_TRACKING = -0.03; // em, matches every headline in the video
const MARK_H = 66; //           ≈ the wordmark's cap height
const REVEAL_TILE = MARK_H / 0.52;
const REVEAL_CY = 0;

// --- The tile's waypoints ----------------------------------------------------
type TileState = {
  cx: number;
  cy: number;
  size: number;
  radius: number;
  plate: number; // plate opacity
};

const TILE_DRAW: TileState = {
  cx: 0,
  cy: 0,
  size: 240 / 0.52,
  radius: 120,
  plate: 0,
};
const TILE_X: TileState = {
  cx: X_AVA_CX,
  cy: X_AVA_CY,
  size: X_AVA,
  radius: X_AVA / 2,
  plate: 1,
};
const TILE_G: TileState = {
  cx: G_AVA_CX,
  cy: 0,
  size: G_AVA,
  radius: 16,
  plate: 1,
};
const TILE_F: TileState = {
  cx: F_FAV_CX,
  cy: F_FAV_CY,
  size: F_FAV,
  radius: 4.5,
  plate: 1,
};
const TILE_R: TileState = {
  cx: 0,
  cy: REVEAL_CY,
  size: REVEAL_TILE,
  radius: 32,
  plate: 0,
};

// --- The shot's clock ---------------------------------------------------------
const M_P1 = [96, 128] as const; //  draw → X avatar
const M_X_EXIT = 216;
const M_P2 = [220, 252] as const; // X → GitHub
const M_G_ENTER = 246;
const M_G_EXIT = 304;
const M_P3 = [308, 340] as const; // GitHub → favicon
const M_F_ENTER = 334;
const M_F_EXIT = 390;
const M_P4 = [394, 428] as const; // favicon → the wordmark's R
const M_SLIDE = 436;

const MORPH_LEGS: ReadonlyArray<{
  t: readonly [number, number];
  to: TileState;
}> = [
  { t: M_P1, to: TILE_X },
  { t: M_P2, to: TILE_G },
  { t: M_P3, to: TILE_F },
  { t: M_P4, to: TILE_R },
];

const tweenTile = (frame: number): TileState => {
  let state = TILE_DRAW;
  for (const leg of MORPH_LEGS) {
    if (frame < leg.t[0]) break;
    const p = interpolate(frame, [leg.t[0], leg.t[1]], [0, 1], {
      ...clampOpts,
      easing: Easing.inOut(Easing.cubic),
    });
    state = {
      cx: state.cx + (leg.to.cx - state.cx) * p,
      cy: state.cy + (leg.to.cy - state.cy) * p,
      size: state.size + (leg.to.size - state.size) * p,
      radius: state.radius + (leg.to.radius - state.radius) * p,
      plate: state.plate + (leg.to.plate - state.plate) * p,
    };
  }
  return state;
};

// Canvas-measured width of the tail at the loaded Manrope, corrected for CSS
// letter-spacing, which canvas ignores. Overshoot only pads the wrapper.
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

// A muted meta entry: icon + label.
const MetaItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  color?: string;
  gap?: number;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ icon, label, color, gap = 6, fontSize = 14, style }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap,
      fontSize,
      whiteSpace: "nowrap",
      ...(color ? { color } : {}),
      ...style,
    }}
  >
    {icon}
    <span>{label}</span>
  </span>
);

const X_TAB_LABELS = [
  "Posts",
  "Replies",
  "Highlights",
  "Articles",
  "Media",
  "Likes",
];

const MorphScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const tailWidth = React.useMemo(measureTail, []);

  // --- The draw ---
  const markDraw = interpolate(frame, [12, 70], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const markFill = interpolate(frame, [58, 84], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const markSettle = spring({
    frame: frame - 12,
    fps,
    config: { damping: 16, stiffness: 90, mass: 0.9 },
  });

  // --- The tile ---
  const tile = tweenTile(frame);
  // Once the wordmark's tail slides out, the R shifts left so the finished
  // lockup lands centered.
  const slideIn =
    frame < M_SLIDE - 20
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
  const tileCx = tile.cx - (slideIn * tailWidth) / 2;

  // Element cascade: a soft rise used by every mockup element.
  const rise = (start: number) => {
    const p = interpolate(frame, [start, start + 16], [0, 1], {
      ...clampOpts,
      easing: Easing.out(Easing.cubic),
    });
    return { opacity: p, transform: `translateY(${(1 - p) * 8}px)` };
  };

  // --- X page assembly ---
  const p1 = interpolate(frame, [M_P1[0], M_P1[1]], [0, 1], clampOpts);
  const xOut = interpolate(frame, [M_X_EXIT, M_X_EXIT + 16], [0, 1], {
    ...clampOpts,
    easing: Easing.in(Easing.cubic),
  });
  const xFrameOpacity =
    interpolate(p1, [0.2, 0.75], [0, 1], clampOpts) * (1 - xOut);

  // --- GitHub / browser chrome ---
  const gIn = interpolate(
    frame,
    [M_G_ENTER, M_G_ENTER + 14],
    [0, 1],
    clampOpts,
  );
  const gOut = interpolate(frame, [M_G_EXIT, M_G_EXIT + 16], [0, 1], {
    ...clampOpts,
    easing: Easing.in(Easing.cubic),
  });
  const fIn = interpolate(
    frame,
    [M_F_ENTER, M_F_ENTER + 14],
    [0, 1],
    clampOpts,
  );
  const fOut = interpolate(frame, [M_F_EXIT, M_F_EXIT + 16], [0, 1], {
    ...clampOpts,
    easing: Easing.in(Easing.cubic),
  });

  // --- The montage line ---
  const lineOpacity =
    interpolate(frame, [152, 172], [0, 1], clampOpts) * (1 - fOut);

  // The word box's bottom sits WORD_SIZE * 0.115 below the R's bottom edge,
  // so the R stands on the same baseline as the tail (the intro's own rule).
  const wordTop =
    height / 2 +
    tile.cy +
    MARK_H / 2 -
    (WORD_SIZE - Math.round(WORD_SIZE * 0.115));
  const wordLeft = width / 2 + tileCx + markW / 2;

  // The banner shader renders at full video size and is scaled down to the
  // banner window, so the profile wears the video's own field as its banner.
  const bannerScale = X_W / width;
  const bannerTop = -((height * bannerScale - X_BANNER) / 2);

  return (
    <AbsoluteFill>
      {/* ================= X profile page ================= */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: X_W,
            height: X_H,
            borderRadius: 18,
            background: "#000000",
            boxShadow: `inset 0 0 0 1px ${HAIRLINE}`,
            overflow: "hidden",
            fontFamily: SANS,
            opacity: xFrameOpacity,
            transform: `translateY(${xOut * 8}px)`,
          }}
        >
          {/* top bar */}
          <div
            style={{
              height: X_TOPBAR,
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "0 18px",
              color: X_INK,
              ...rise(128),
            }}
          >
            <ArrowLeftIcon />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.2 }}>
                Remocn
              </div>
              <div style={{ fontSize: 12.5, color: X_MUTED, lineHeight: 1.2 }}>
                61 posts
              </div>
            </div>
            <GrokIcon />
            <SearchIcon />
          </div>

          {/* banner: the video's own warp field + the wordmark lockup */}
          <div
            style={{
              height: X_BANNER,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: bannerTop,
                width,
                height,
                transform: `scale(${bannerScale})`,
                transformOrigin: "0 0",
              }}
            >
              <ShaderWarp {...WARP_PROPS} />
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...rise(134),
              }}
            >
              <MiniLockup markH={34} fontSize={47} />
            </div>
          </div>

          {/* profile section */}
          <div
            style={{
              height: X_SECTION,
              padding: `12px ${X_PAD_X}px 16px`,
              position: "relative",
              color: X_INK,
            }}
          >
            {/* the avatar slot is left empty — the morphing tile lives there */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                height: 36,
                ...rise(138),
              }}
            >
              <div
                style={{
                  height: 36,
                  padding: "0 18px",
                  borderRadius: 18,
                  border: "1px solid rgba(242,242,242,0.32)",
                  display: "flex",
                  alignItems: "center",
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                Edit profile
              </div>
            </div>

            <div
              style={{
                marginTop: 14,
                height: 28,
                display: "flex",
                alignItems: "center",
                gap: 10,
                ...rise(144),
              }}
            >
              <span style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>
                Remocn
              </span>
              <VerifiedSeal />
            </div>

            <div
              style={{
                marginTop: 4,
                height: 18,
                fontSize: 15,
                color: X_MUTED,
                ...rise(150),
              }}
            >
              @_remocn
            </div>

            <div
              style={{
                marginTop: 12,
                height: 20,
                fontSize: 15.5,
                lineHeight: "20px",
                ...rise(156),
              }}
            >
              Production-ready animations, transitions, backgrounds, and scenes
              for Remotion
            </div>

            <div
              style={{
                marginTop: 12,
                height: 18,
                display: "flex",
                alignItems: "center",
                gap: 16,
                color: X_MUTED,
                ...rise(162),
              }}
            >
              <MetaItem icon={<BriefcaseIcon />} label="Software Application" />
              <MetaItem icon={<PinIcon />} label="Ukraine" />
              <MetaItem icon={<LinkIcon />} label="remocn.dev" color={X_BLUE} />
              <MetaItem icon={<CalendarIcon />} label="Joined July 2026" />
            </div>

            <div
              style={{
                marginTop: 12,
                height: 18,
                display: "flex",
                alignItems: "center",
                gap: 18,
                fontSize: 14.5,
                color: X_MUTED,
                ...rise(168),
              }}
            >
              <span>
                <span style={{ color: X_INK, fontWeight: 700 }}>1</span>{" "}
                Following
              </span>
              <span>
                <span style={{ color: X_INK, fontWeight: 700 }}>540</span>{" "}
                Followers
              </span>
            </div>
          </div>

          {/* tabs */}
          <div
            style={{
              height: X_TABS,
              display: "flex",
              borderTop: `1px solid rgba(242,242,242,0.06)`,
              borderBottom: `1px solid rgba(242,242,242,0.12)`,
              ...rise(174),
            }}
          >
            {X_TAB_LABELS.map((label, i) => (
              <div
                key={label}
                style={{
                  flex: 1,
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14.5,
                  fontWeight: i === 0 ? 700 : 500,
                  color: i === 0 ? X_INK : X_MUTED,
                }}
              >
                {label}
                {i === 0 ? (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 52,
                      height: 4,
                      borderRadius: 2,
                      background: X_BLUE,
                    }}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>

      {/* ================= GitHub org header ================= */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: G_W,
            height: G_H,
            borderRadius: 16,
            background: GH_BG,
            boxShadow: `inset 0 0 0 1px ${HAIRLINE}`,
            padding: G_PAD,
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontFamily: SANS,
            opacity: gIn * (1 - gOut),
            transform: `translateY(${gOut * 8}px)`,
          }}
        >
          {/* the avatar slot is left empty — the morphing tile lands here */}
          <div style={{ width: G_AVA, height: G_AVA, flexShrink: 0 }} />
          <div
            style={{ display: "flex", flexDirection: "column", minWidth: 0 }}
          >
            <div
              style={{
                height: 28,
                display: "flex",
                alignItems: "center",
                fontSize: 25,
                fontWeight: 700,
                color: GH_INK,
                ...rise(M_G_ENTER + 8),
              }}
            >
              Remocn
            </div>
            <div
              style={{
                marginTop: 10,
                height: 18,
                fontSize: 15,
                lineHeight: "18px",
                color: GH_MUTED,
                ...rise(M_G_ENTER + 14),
              }}
            >
              Remocn. Write code. Get videos
            </div>
            <div
              style={{
                marginTop: 16,
                height: 18,
                display: "flex",
                alignItems: "center",
                gap: 14,
                color: GH_INK,
                whiteSpace: "nowrap",
              }}
            >
              {(
                [
                  {
                    icon: <UsersIcon />,
                    label: "3 followers",
                  },
                  { icon: <PinIcon />, label: "Ukraine" },
                  { icon: <LinkIcon />, label: "https://remocn.dev" },
                  { icon: <XLogoIcon />, label: "@kapish_dima" },
                  { icon: <XLogoIcon />, label: "@_remocn" },
                  { icon: <MailIcon />, label: "kapishdima@gmail.com" },
                ] as const
              ).map((item, i) => (
                <MetaItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  gap={5}
                  fontSize={12.5}
                  style={rise(M_G_ENTER + 20 + i * 4)}
                />
              ))}
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* ================= Browser-tab fragment ================= */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: F_CARD_W,
            borderRadius: 16,
            background: "rgba(16,15,20,0.92)",
            boxShadow: `inset 0 0 0 1px ${HAIRLINE}`,
            overflow: "hidden",
            opacity: fIn * (1 - fOut),
            transform: `translateY(${fOut * 8}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 6,
              padding: "10px 14px 0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 16px",
                borderRadius: "10px 10px 0 0",
                background: "#232230",
                minWidth: 300,
              }}
            >
              <div style={{ width: F_FAV, height: F_FAV, flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: SANS,
                  fontWeight: 400,
                  fontSize: 14,
                  color: INK,
                  whiteSpace: "nowrap",
                  ...rise(M_F_ENTER + 8),
                }}
              >
                Remocn — Cinematic video components
              </span>
            </div>
            <div
              style={{
                padding: "10px 16px",
                fontFamily: SANS,
                fontWeight: 400,
                fontSize: 14,
                color: FAINT,
                ...rise(M_F_ENTER + 14),
              }}
            >
              New Tab
            </div>
          </div>
          <div style={{ padding: "10px 14px 14px", background: "#232230" }}>
            <div
              style={{
                height: 36,
                borderRadius: 9,
                background: "rgba(242,242,242,0.06)",
                display: "flex",
                alignItems: "center",
                paddingLeft: 16,
                fontFamily: SANS,
                fontSize: 14,
                color: MUTED,
                ...rise(M_F_ENTER + 20),
              }}
            >
              remocn.dev
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* ---- The wordmark tail, sliding out from behind the R ---- */}
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
        {/* Right-anchored, so the tail's leading edge rides the growing
            wrapper — the word extends out of the mark. */}
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

      {/* ---- The tile — one mark, carried through every surface ---- */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) translate(${tileCx}px, ${tile.cy}px)`,
          width: tile.size,
          height: tile.size,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: tile.radius,
            background: PLATE,
            boxShadow: `inset 0 0 0 1px ${HAIRLINE}`,
            opacity: tile.plate,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${interpolate(markSettle, [0, 1], [0.94, 1])})`,
          }}
        >
          <RemocnMark
            height={tile.size * 0.52}
            draw={markDraw}
            fill={markFill}
            thin={p1}
          />
        </div>
      </div>

      {/* ---- The montage line ---- */}
      <span
        style={{
          position: "absolute",
          bottom: 42,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 19,
          color: FAINT,
          opacity: lineOpacity,
        }}
      >
        One mark, everywhere
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Crossfade presentation for the hook → code cut.
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

// ===========================================================================
// Composition root.
// ===========================================================================
export const REMOCN_NEW_LOGO_DURATION =
  S_HOOK + S_CODE + S_MORPH - (T_X + T_PUSH);

export const RemocnNewLogoDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: OBSIDIAN }}>
      {/* One deep-blue paper.design warp (checks shape) carries the whole
          video — pushed way back by opacity + the scrim so it never competes
          with the mark. */}
      <AbsoluteFill style={{ opacity: 0.5 }}>
        <ShaderWarp {...WARP_PROPS} />
      </AbsoluteFill>
      <Scrim strength={0.9} />

      <TransitionSeries>
        {/* 1 — Hook, two lines */}
        <TransitionSeries.Sequence durationInFrames={S_HOOK}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 2 — The SVG source types itself */}
        <TransitionSeries.Sequence durationInFrames={S_CODE}>
          <CodeScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_PUSH })}
          presentation={pushThrough({ zoom: 2.8 })}
        />

        {/* 3 — The morph shot: draw → X → GitHub → favicon → wordmark */}
        <TransitionSeries.Sequence durationInFrames={S_MORPH}>
          <MorphScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
