import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming, type TransitionPresentation, type TransitionPresentationComponentProps } from "@remotion/transitions";
import { loadFont as loadCalSans } from "@remotion/google-fonts/CalSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

import { ShadcnUiKitWarp } from "./shadcn-ui-kit-warp";
import { SoftBlurIn } from "@/components/remocn/soft-blur-in";
import { LineByLineSlide } from "@/components/remocn/line-by-line-slide";
import { KineticCenterBuild } from "@/components/remocn/kinetic-center-build";
import { pushThrough } from "@/components/remocn/push-through";
import { focusPull } from "@/components/remocn/focus-pull";

// Shadcn UI Kit speaks in the two voices its own CSS ships: Cal Sans for the
// headings, Inter for the body. Cal Sans ships one weight only — 400
// everywhere.
const { fontFamily: HEADING_FAMILY } = loadCalSans("normal", {
  subsets: ["latin"],
  weights: ["400"],
});
const { fontFamily: BODY_FAMILY } = loadInter("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600"],
});

const HEADING = `${HEADING_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;
const BODY = `${BODY_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;

// Palette lifted from shadcnuikit.com itself: #0a0a0a dark canvas, #fafafa
// ink, #a1a1a1 muted copy, and the indigo #6366f1 that fills the site's hero
// gradient and colors "Shadcn" in its own title art. The theme-generator
// station borrows two of the kit's preset accents.
const BG = "#0a0a0a";
const INK = "#fafafa";
const MUTED = "rgba(250,250,250,0.62)";
const FAINT = "rgba(250,250,250,0.4)";
const INDIGO = "#6366f1";
const EMERALD = "#10b981";
const AMBER = "#f59e0b";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap.
// ---------------------------------------------------------------------------
const S_HOOK = 66; //     "Say hello to my new sponsor"
const S_REVEAL = 108; //  mark draws on + Shadcn UI Kit wordmark + tagline
const S_KINETIC = 62; //  "Copy, paste, ship" center build
const S_STACK = 92; //    line-by-line value stack
const S_COUNT = 70; //    780 components count-up
const S_CTA = 70; //      "Your next dashboard is already built"
const S_LOCKUP = 120; //  Remocn ✕ Shadcn UI Kit + shadcnuikit.com

// What's inside — the kit's three pillars, cut into hard beats.
const STATIONS = [
  { name: "Dashboards", blurb: "12 admin panels, CRM to crypto" },
  { name: "Blocks", blurb: "225 ready sections for marketing and apps" },
  { name: "Theme generator", blurb: "Your brand in one click" },
];
const STATION_DURS = [56, 56, 66];
const S_STATIONS = STATION_DURS.reduce((a, b) => a + b, 0);

const T_PT = 16; // push-through
const T_FP = 16; // focus-pull
const T_X = 14; //  crossfade

export const SPONSOR_SHADCN_UI_KIT_DURATION =
  S_HOOK +
  S_REVEAL +
  S_STATIONS +
  S_KINETIC +
  S_STACK +
  S_COUNT +
  S_CTA +
  S_LOCKUP -
  (T_PT + T_FP + T_X + T_X + T_FP + T_X + T_PT);

// ---------------------------------------------------------------------------
// Slow camera drift — every scene rides a barely-there push-in so no frame
// is ever static. durationInFrames is Sequence-scoped inside TransitionSeries.
// ---------------------------------------------------------------------------
const Drift: React.FC<{ children: React.ReactNode; grow?: number }> = ({
  children,
  grow = 0.035,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1, 1 + grow]);
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})` }}>
      {children}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Per-word rise — each word resolves out of blur while rising onto the
// baseline. The body voice of the spot, in Inter.
// ---------------------------------------------------------------------------
const WordsRise: React.FC<{
  text: string;
  fontSize: number;
  color?: string;
  delay?: number;
  stagger?: number;
  fontFamily?: string;
}> = ({
  text,
  fontSize,
  color = INK,
  delay = 0,
  stagger = 3,
  fontFamily = BODY,
}) => {
  const frame = useCurrentFrame();
  const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
  const words = text.split(" ");
  return (
    <span
      style={{
        fontFamily,
        fontWeight: 400,
        fontSize,
        color,
        lineHeight: 1.3,
      }}
    >
      {words.map((word, i) => {
        const local = frame - delay - i * stagger;
        const p = interpolate(local, [0, 24], [0, 1], {
          ...clampOpts,
          easing: ease,
        });
        // Travel lands at ~60% — the eased tail clicks the word down the pixel
        // grid one pixel every few frames; opacity/blur keep the full curve.
        const py = interpolate(local, [0, 14], [0, 1], {
          ...clampOpts,
          easing: ease,
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: p,
              transform: `translateY(${(1 - py) * 24}px)`,
              filter: p < 1 ? `blur(${(1 - p) * 9}px)` : undefined,
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
};

// ---------------------------------------------------------------------------
// The Shadcn UI Kit mark, redrawn in code from the site's logo.png: a rounded
// square carrying five diagonal round-cap strokes — one full center diagonal,
// two mediums flanking it, two short dots in the opposite corners, 180 degree
// symmetric. Centerline endpoints measured off the shipped 1876px logo
// (connected-component analysis), snapped to exact 45 degrees. Inverted to
// ink-on-dark for this canvas. The strokes draw themselves on via pathLength.
// ---------------------------------------------------------------------------
const MARK_STROKES = [
  "M25.3 24.8 L75.7 75.2",
  "M48.5 24.8 L75.8 52.1",
  "M25.2 47.9 L52.5 75.2",
  "M71.7 24.6 L75.8 28.7",
  "M25.2 71.3 L29.3 75.4",
];

const KitMark: React.FC<{
  size: number;
  /** Local frame the square starts entering */
  enterAt?: number;
  /** When true the mark renders fully drawn, no animation */
  still?: boolean;
}> = ({ size, enterAt = 0, still = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const squareS = still
    ? 1
    : spring({
        frame: frame - enterAt,
        fps,
        config: { damping: 13, stiffness: 160, mass: 0.8 },
      });
  const squareO = still
    ? 1
    : interpolate(frame, [enterAt, enterAt + 8], [0, 1], clampOpts);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        opacity: squareO,
        transform: `scale(${interpolate(squareS, [0, 1], [0.72, 1])})`,
      }}
    >
      <rect x="2" y="2" width="96" height="96" rx="22" fill={INK} />
      {MARK_STROKES.map((d, i) => {
        const p = still
          ? 1
          : interpolate(frame, [enterAt + 8 + i * 4, enterAt + 20 + i * 4], [0, 1], {
              ...clampOpts,
              easing: Easing.out(Easing.cubic),
            });
        return (
          <path
            key={i}
            d={d}
            pathLength={1}
            stroke={BG}
            strokeWidth="8.3"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="1"
            strokeDashoffset={1 - p}
          />
        );
      })}
    </svg>
  );
};

// The wordmark, plain ink on the dark canvas, Cal Sans throughout.
const KitWordmark: React.FC<{ fontSize: number }> = ({ fontSize }) => (
  <span
    style={{
      fontFamily: HEADING,
      fontWeight: 400,
      fontSize,
      lineHeight: 1,
      whiteSpace: "nowrap",
      color: INK,
    }}
  >
    Shadcn UI Kit
  </span>
);

// ===========================================================================
// Scene 1 — Hook. The family line resolves out of a soft blur.
// ===========================================================================
const HookScene: React.FC = () => (
  <Drift>
    <AbsoluteFill style={{ padding: "0 90px" }}>
      <SoftBlurIn
        text="Say hello to my new sponsor"
        fontSize={54}
        fontWeight={400}
        color={INK}
        blur={14}
      />
    </AbsoluteFill>
  </Drift>
);

// ===========================================================================
// Scene 2 — Reveal. The mark draws its strokes on while the wordmark resolves
// out of depth beside it, tagline settling tight beneath.
// ===========================================================================
const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [8, 38], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const scale = interpolate(p, [0, 1], [1.1, 1]);

  return (
    <Drift>
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", gap: 14 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <KitMark size={88} enterAt={2} />
          <span
            style={{
              display: "inline-block",
              opacity: p,
              transform: `scale(${scale})`,
              filter: p < 1 ? `blur(${(1 - p) * 18}px)` : undefined,
            }}
          >
            <KitWordmark fontSize={92} />
          </span>
        </div>
        <WordsRise
          text="Launch your projects faster"
          fontSize={26}
          color={MUTED}
          delay={44}
        />
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 3 — What's inside. Three hard-cut stations, each acted out inside a
// tiny code-drawn fragment of the kit itself: a dashboard assembling, a bento
// of blocks snapping in, the theme generator re-tinting the surface live.
// shadcnuikit.com sells real UI, so the spot rebuilds its surfaces in code.
// ===========================================================================
const STATION_STARTS = STATION_DURS.map((_, i) =>
  STATION_DURS.slice(0, i).reduce((a, b) => a + b, 0),
);

const PANEL_W = 500;
const PANEL_H = 210;

const panelStyle: React.CSSProperties = {
  position: "relative",
  width: PANEL_W,
  height: PANEL_H,
  borderRadius: 14,
  border: "1px solid rgba(250,250,250,0.12)",
  background: "rgba(20,20,23,0.6)",
  overflow: "hidden",
};

// 01 Dashboards — the kit's core surface assembles: sidebar rows slide in,
// stat cards pop with counting figures, chart bars grow, a donut ring draws.
const DashboardIllustration: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const ease = Easing.out(Easing.cubic);

  const STAT_VALUES = [12480, 3842, 96];
  const BAR_HEIGHTS = [30, 46, 36, 60, 44, 70, 52, 80];

  const donutP = interpolate(frame, [22, 48], [0, 0.72], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <div style={panelStyle}>
      {/* Sidebar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 88,
          borderRight: "1px solid rgba(250,250,250,0.1)",
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const rp = interpolate(frame, [4 + i * 3, 12 + i * 3], [0, 1], {
            ...clampOpts,
            easing: ease,
          });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 14,
                top: 18 + i * 28,
                width: i === 0 ? 44 : 58,
                height: 10,
                borderRadius: 5,
                background:
                  i === 1 ? "rgba(99,102,241,0.85)" : "rgba(250,250,250,0.22)",
                opacity: rp,
                transform: `translateX(${(1 - rp) * -10}px)`,
              }}
            />
          );
        })}
      </div>
      {/* Stat cards with counting figures */}
      {STAT_VALUES.map((value, i) => {
        const s = spring({
          frame: frame - (8 + i * 4),
          fps,
          config: { damping: 13, stiffness: 180, mass: 0.7 },
        });
        const o = interpolate(frame, [8 + i * 4, 14 + i * 4], [0, 1], clampOpts);
        const count = interpolate(frame, [12 + i * 4, 36 + i * 4], [0, value], {
          ...clampOpts,
          easing: Easing.out(Easing.poly(3)),
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 104 + i * 130,
              top: 16,
              width: 118,
              height: 54,
              borderRadius: 8,
              border: "1px solid rgba(250,250,250,0.1)",
              background: "rgba(250,250,250,0.04)",
              opacity: o,
              transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`,
              padding: "9px 12px",
            }}
          >
            <div
              style={{
                width: 42,
                height: 7,
                borderRadius: 3.5,
                background: "rgba(250,250,250,0.28)",
              }}
            />
            <div
              style={{
                marginTop: 7,
                fontFamily: BODY,
                fontWeight: 600,
                fontSize: 16,
                color: INK,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {Math.round(count).toLocaleString("en-US")}
            </div>
          </div>
        );
      })}
      {/* Bar chart */}
      {BAR_HEIGHTS.map((h, i) => {
        const bp = interpolate(frame, [18 + i * 2, 32 + i * 2], [0, 1], {
          ...clampOpts,
          easing: ease,
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 108 + i * 26,
              bottom: 20,
              width: 14,
              height: h * bp,
              borderRadius: 4,
              background:
                i === BAR_HEIGHTS.length - 1
                  ? INDIGO
                  : "rgba(250,250,250,0.32)",
            }}
          />
        );
      })}
      {/* Donut ring drawing itself */}
      <svg
        width="76"
        height="76"
        viewBox="0 0 76 76"
        style={{ position: "absolute", left: 384, top: 100 }}
      >
        <circle
          cx="38"
          cy="38"
          r="29"
          stroke="rgba(250,250,250,0.12)"
          strokeWidth="9"
          fill="none"
        />
        <circle
          cx="38"
          cy="38"
          r="29"
          stroke={INDIGO}
          strokeWidth="9"
          fill="none"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - donutP}
          strokeLinecap="round"
          transform="rotate(-90 38 38)"
        />
      </svg>
    </div>
  );
};

// 02 Blocks — a bento of ready-made sections snaps in tile by tile.
const BENTO_TILES: Array<{
  x: number;
  y: number;
  w: number;
  h: number;
  kind: "hero" | "profile" | "list" | "bars" | "cta" | "media";
}> = [
  { x: 14, y: 14, w: 226, h: 86, kind: "hero" },
  { x: 250, y: 14, w: 110, h: 86, kind: "profile" },
  { x: 370, y: 14, w: 116, h: 86, kind: "list" },
  { x: 14, y: 110, w: 140, h: 86, kind: "bars" },
  { x: 164, y: 110, w: 196, h: 86, kind: "cta" },
  { x: 370, y: 110, w: 116, h: 86, kind: "media" },
];

const TileInnards: React.FC<{ kind: string }> = ({ kind }) => {
  const line = (w: number, o: number): React.CSSProperties => ({
    width: w,
    height: 8,
    borderRadius: 4,
    background: `rgba(250,250,250,${o})`,
  });
  switch (kind) {
    case "hero":
      return (
        <div style={{ display: "flex", gap: 12, padding: 13 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 8,
              background: "rgba(250,250,250,0.14)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 9, paddingTop: 5 }}>
            <div style={line(118, 0.34)} />
            <div style={line(90, 0.2)} />
            <div style={line(104, 0.12)} />
          </div>
        </div>
      );
    case "profile":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            paddingTop: 14,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "rgba(250,250,250,0.24)",
            }}
          />
          <div style={line(58, 0.3)} />
          <div style={line(42, 0.14)} />
        </div>
      );
    case "list":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 9, padding: 13 }}>
          {[0.32, 0.2, 0.14, 0.1].map((o, i) => (
            <div key={i} style={line(64 + (i % 2) * 20, o)} />
          ))}
        </div>
      );
    case "bars":
      return (
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
            padding: "0 16px",
            height: "100%",
            paddingBottom: 14,
          }}
        >
          {[26, 44, 32, 52].map((h, i) => (
            <div
              key={i}
              style={{
                width: 14,
                height: h,
                borderRadius: 4,
                background: "rgba(250,250,250,0.26)",
              }}
            />
          ))}
        </div>
      );
    case "cta":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 9, padding: 14 }}>
          <div style={line(120, 0.34)} />
          <div style={line(88, 0.16)} />
          <div
            style={{
              marginTop: 4,
              width: 64,
              height: 18,
              borderRadius: 5,
              background: INDIGO,
            }}
          />
        </div>
      );
    default:
      return (
        <div style={{ padding: 13 }}>
          <div
            style={{
              width: 90,
              height: 40,
              borderRadius: 6,
              background: "rgba(250,250,250,0.14)",
            }}
          />
          <div style={{ marginTop: 9, ...line(66, 0.22) }} />
        </div>
      );
  }
};

const BlocksIllustration: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  return (
    <div style={panelStyle}>
      {BENTO_TILES.map((tile, i) => {
        const s = spring({
          frame: frame - (4 + i * 5),
          fps,
          config: { damping: 13, stiffness: 170, mass: 0.7 },
        });
        const o = interpolate(frame, [4 + i * 5, 10 + i * 5], [0, 1], clampOpts);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: tile.x,
              top: tile.y,
              width: tile.w,
              height: tile.h,
              borderRadius: 10,
              border: "1px solid rgba(250,250,250,0.13)",
              background: "rgba(250,250,250,0.06)",
              overflow: "hidden",
              opacity: o,
              transform: `scale(${interpolate(s, [0, 1], [0.78, 1])})`,
            }}
          >
            <TileInnards kind={tile.kind} />
          </div>
        );
      })}
    </div>
  );
};

// 03 Theme generator — the same surface re-tints live: the accent flips
// indigo → emerald → amber and every artifact re-renders at once, while the
// active swatch ring hops along the row.
const THEME_ACCENTS = [INDIGO, EMERALD, AMBER];

const ThemeIllustration: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const ease = Easing.out(Easing.cubic);

  const accentIdx = frame < 24 ? 0 : frame < 44 ? 1 : 2;
  const accent = THEME_ACCENTS[accentIdx];
  const flipAt = accentIdx === 0 ? 0 : accentIdx === 1 ? 24 : 44;
  // A tiny settle on each flip so the re-tint reads as a click, not a glitch.
  const settle = spring({
    frame: frame - flipAt,
    fps,
    config: { damping: 15, stiffness: 220, mass: 0.6 },
  });
  const tick = 1 + (1 - settle) * 0.015;

  const enter = interpolate(frame, [2, 14], [0, 1], {
    ...clampOpts,
    easing: ease,
  });

  const BAR_HEIGHTS = [44, 78, 58, 100, 70];

  return (
    <div style={panelStyle}>
      {/* Swatch row, active ring hops */}
      {THEME_ACCENTS.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 392 + i * 30,
            top: 18,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: c,
            opacity: enter,
            boxShadow:
              i === accentIdx
                ? "0 0 0 2px rgba(10,10,10,1), 0 0 0 3.5px rgba(250,250,250,0.75)"
                : undefined,
          }}
        />
      ))}
      {/* Mini card, accent-tinted */}
      <div
        style={{
          position: "absolute",
          left: 26,
          top: 46,
          width: 208,
          height: 140,
          borderRadius: 10,
          border: "1px solid rgba(250,250,250,0.1)",
          background: "rgba(250,250,250,0.04)",
          opacity: enter,
          transform: `translateY(${(1 - enter) * 12}px) scale(${tick})`,
          padding: 16,
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: accent,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                width: 92,
                height: 8,
                borderRadius: 4,
                background: "rgba(250,250,250,0.32)",
              }}
            />
            <div
              style={{
                width: 64,
                height: 8,
                borderRadius: 4,
                background: "rgba(250,250,250,0.16)",
              }}
            />
          </div>
        </div>
        <div
          style={{
            marginTop: 14,
            width: 172,
            height: 8,
            borderRadius: 4,
            background: "rgba(250,250,250,0.12)",
          }}
        />
        <div
          style={{
            marginTop: 16,
            width: 112,
            height: 26,
            borderRadius: 6,
            background: accent,
          }}
        />
      </div>
      {/* Accent bar chart */}
      {BAR_HEIGHTS.map((h, i) => {
        const bp = interpolate(frame, [6 + i * 2, 20 + i * 2], [0, 1], {
          ...clampOpts,
          easing: ease,
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 268 + i * 42,
              bottom: 24,
              width: 24,
              height: h * bp,
              borderRadius: 5,
              background: accent,
              opacity: 0.55 + (i / (BAR_HEIGHTS.length - 1)) * 0.45,
              transform: `scaleY(${tick})`,
              transformOrigin: "50% 100%",
            }}
          />
        );
      })}
    </div>
  );
};

const STATION_ILLUSTRATIONS = [
  DashboardIllustration,
  BlocksIllustration,
  ThemeIllustration,
];

const StationsScene: React.FC = () => {
  const frame = useCurrentFrame();
  let active = 0;
  for (let i = 0; i < STATION_STARTS.length; i++) {
    if (frame >= STATION_STARTS[i]) active = i;
  }
  const local = frame - STATION_STARTS[active];
  const p = interpolate(local, [0, 9], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const scale = interpolate(p, [0, 1], [1.06, 1]);
  const station = STATIONS[active];
  const Illustration = STATION_ILLUSTRATIONS[active];
  return (
    <Drift>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            opacity: p,
            transform: `scale(${scale})`,
            filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
          }}
        >
          <Illustration frame={local} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: HEADING,
                fontWeight: 400,
                fontSize: 50,
                lineHeight: 1.05,
                color: INK,
                whiteSpace: "nowrap",
              }}
            >
              {station.name}
            </span>
            <span
              style={{
                fontFamily: BODY,
                fontWeight: 400,
                fontSize: 20,
                color: MUTED,
                whiteSpace: "nowrap",
              }}
            >
              {station.blurb}
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 4 — Kinetic bridge. Three verbs build center-out, each new word
// pushing the line open. measureScale tuned for Cal Sans' wide face.
// ===========================================================================
const KineticScene: React.FC = () => (
  <Drift>
    <AbsoluteFill>
      <KineticCenterBuild
        text="Copy, paste, ship"
        fontSize={84}
        fontWeight={400}
        color={INK}
        measureScale={1.16}
      />
    </AbsoluteFill>
  </Drift>
);

// ===========================================================================
// Scene 5 — Value stack. Four short value lines slide in line by line and
// hold as one compact block.
// ===========================================================================
const StackScene: React.FC = () => (
  <Drift>
    <AbsoluteFill>
      <LineByLineSlide
        text={
          "11 website templates\nBuilt with Tailwind and TypeScript\nReact, Next.js, Vite and Remix\nOne payment, lifetime access"
        }
        fontSize={44}
        fontWeight={400}
        color={INK}
      />
    </AbsoluteFill>
  </Drift>
);

// ===========================================================================
// Scene 6 — Proof. A plain count-up to 780 in tabular figures, the caption
// tight beneath. No plus-suffix, in the series' count-up tradition.
// ===========================================================================
const CountScene: React.FC = () => {
  const frame = useCurrentFrame();
  const count = interpolate(frame, [4, 46], [0, 780], {
    ...clampOpts,
    easing: Easing.out(Easing.poly(3)),
  });
  return (
    <Drift>
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", gap: 4 }}
      >
        <span
          style={{
            fontFamily: HEADING,
            fontWeight: 400,
            fontSize: 168,
            lineHeight: 1,
            color: INK,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(count)}
        </span>
        <WordsRise
          text="components, blocks and examples"
          fontSize={25}
          color={MUTED}
          delay={18}
        />
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 7 — CTA. The closing line resolves alone, flipping the pain.
// ===========================================================================
const CtaScene: React.FC = () => (
  <Drift>
    <AbsoluteFill style={{ padding: "0 90px" }}>
      {/* The line runs 36 chars; a gentle speed-up lets every char resolve
          before the push-through starts. */}
      <SoftBlurIn
        text="Your next dashboard is already built"
        fontSize={52}
        fontWeight={400}
        color={INK}
        blur={14}
        speed={1.15}
      />
    </AbsoluteFill>
  </Drift>
);

// ===========================================================================
// Scene 8 — Lockup. Remocn ✕ Shadcn UI Kit glides together from both sides,
// dead-center, nothing else on screen.
// ===========================================================================
const LockupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ease = Easing.out(Easing.cubic);

  const sideP = interpolate(frame, [6, 30], [0, 1], {
    ...clampOpts,
    easing: ease,
  });
  const leftX = (1 - sideP) * -70;
  const rightX = (1 - sideP) * 70;
  const sideBlur = (1 - sideP) * 12;

  const cross = spring({
    frame: frame - 26,
    fps,
    config: { damping: 12, stiffness: 160, mass: 0.8 },
  });
  const crossOpacity = interpolate(frame, [26, 38], [0, 1], clampOpts);

  return (
    <Drift grow={0.05}>
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <span
            style={{
              fontFamily: HEADING,
              fontWeight: 400,
              fontSize: 58,
              color: INK,
              opacity: sideP,
              transform: `translateX(${leftX}px)`,
              filter: sideBlur > 0.2 ? `blur(${sideBlur}px)` : undefined,
              whiteSpace: "nowrap",
            }}
          >
            Remocn
          </span>
          <span
            style={{
              fontFamily: BODY,
              fontWeight: 400,
              fontSize: 38,
              color: FAINT,
              opacity: crossOpacity,
              transform: `scale(${interpolate(cross, [0, 1], [0.4, 1])})`,
            }}
          >
            ✕
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              opacity: sideP,
              transform: `translateX(${rightX}px)`,
              filter: sideBlur > 0.2 ? `blur(${sideBlur}px)` : undefined,
            }}
          >
            <KitMark size={52} still />
            <KitWordmark fontSize={58} />
          </span>
        </div>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Transition presentations.
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
// Composition root. One persistent warp shader carries the whole video — the
// paper.design edge preset recolored into the kit's indigo family, pushed
// back by a vignette so it textures the dark instead of competing with it.
// Cal Sans is wired into the remocn text components via the shared font var.
// ===========================================================================
export const SponsorShadcnUiKitDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={
        {
          "--font-geist-sans": HEADING_FAMILY,
          background: BG,
        } as React.CSSProperties
      }
    >
      {/* Persistent warp backdrop — edge shape, Shadcn UI Kit indigo family. */}
      <ShadcnUiKitWarp />
      {/* Vignette scrim — keeps the warp a texture, not a subject. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 42%, rgba(8,8,12,0.72) 0%, rgba(8,8,12,0.94) 100%)",
        }}
      />

      <TransitionSeries>
        {/* 1 — Hook */}
        <TransitionSeries.Sequence durationInFrames={S_HOOK}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_PT })}
          presentation={pushThrough()}
        />

        {/* 2 — Shadcn UI Kit reveal */}
        <TransitionSeries.Sequence durationInFrames={S_REVEAL}>
          <RevealScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_FP })}
          presentation={focusPull()}
        />

        {/* 3 — What's inside: Dashboards / Blocks / Theme generator */}
        <TransitionSeries.Sequence durationInFrames={S_STATIONS}>
          <StationsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 4 — Copy, paste, ship */}
        <TransitionSeries.Sequence durationInFrames={S_KINETIC}>
          <KineticScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 5 — Value stack */}
        <TransitionSeries.Sequence durationInFrames={S_STACK}>
          <StackScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_FP })}
          presentation={focusPull()}
        />

        {/* 6 — 780 count-up */}
        <TransitionSeries.Sequence durationInFrames={S_COUNT}>
          <CountScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 7 — CTA */}
        <TransitionSeries.Sequence durationInFrames={S_CTA}>
          <CtaScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_PT })}
          presentation={pushThrough()}
        />

        {/* 8 — Lockup + URL */}
        <TransitionSeries.Sequence durationInFrames={S_LOCKUP}>
          <LockupScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
