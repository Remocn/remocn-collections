"use client";

// shadcn/ui × React Aria — the July 2026 changelog cut ("choose your
// foundation"). Register sampled live from ui.shadcn.com dark tokens
// (2026-07-17): #0a0a0a canvas, #fafafa ink, #171717 card, #a1a1a1 muted,
// white/10 hairline, radius 10, Geist + Geist Mono. Guest brand React Aria:
// exact header mark (viewBox 200 206 800 790), #7F57FF on dark.
//
// After the news + the flag, the heart of the cut is React Aria's own three
// signature demos, rebuilt from react-aria.adobe.com's "Bring your own
// styles" section — the DatePicker ("Date Planted"), the ComboBox
// ("Assignee", with the entering animation the site itself advertises), and
// the Slider ("Opacity", defaultValue 30) — each acting out one of React
// Aria's value words on the pinned dark tokens with the violet as accent.
//
// One camera: beats enter from below and exit upward on springs; sections
// dive forward through the remocn push-through; no lateral travel anywhere.
// One backdrop: shader-caustics, whose light takes the violet the moment the
// aria mark completes and keeps it.

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
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { loadFont as loadSans } from "@remotion/google-fonts/Geist";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { ShaderCaustics } from "@/components/remocn/shader-caustics";
import { SoftBlurIn } from "@/components/remocn/soft-blur-in";
import { pushThrough } from "@/components/remocn/push-through";

const { fontFamily: GEIST } = loadSans("normal", {
  weights: ["400", "500"],
  subsets: ["latin", "latin-ext"],
});
const { fontFamily: GEIST_MONO } = loadMono("normal", {
  weights: ["400"],
  subsets: ["latin", "latin-ext"],
});

// ---------------------------------------------------------------------------
// Live ui.shadcn.com dark tokens (fetched 2026-07-17)
// ---------------------------------------------------------------------------

const BG = "#0a0a0a";
const INK = "#fafafa";
const MUTED = "#a1a1a1";
const CARD = "#171717";
const HAIRLINE = "rgba(255,255,255,0.10)";
const RADIUS = 10;

// React Aria's own value from light-dark(#6733FF, #7F57FF) — dark side.
const ARIA = "#7F57FF";

const SANS = `${GEIST}, -apple-system, BlinkMacSystemFont, sans-serif`;
const MONO = `${GEIST_MONO}, ui-monospace, SFMono-Regular, monospace`;

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------

const S_INTRO = 160;
const S_CMD = 150;
const S_CAL = 116;
const S_COMBO = 132;
const S_SLIDER = 100;
const S_OUTRO = 166;
const T = 26; // push-through overlap

export const SHADCN_ARIA_DURATION =
  S_INTRO + S_CMD + S_CAL + S_COMBO + S_SLIDER + S_OUTRO - 5 * T; // 694

// The violet arrives in the light as the aria mark completes in the intro,
// and never leaves.
const ACCENT_AT = 48;

// ---------------------------------------------------------------------------
// Exact marks
// ---------------------------------------------------------------------------

// Official shadcn/ui logo — shadcn-ui/ui apps/v4/components/icons.tsx:
// two round-cap diagonals in a 256 viewBox, strokeWidth 32.
const SHADCN_LINES = [
  { x1: 192, y1: 40, x2: 40, y2: 192, len: 214.96 },
  { x1: 208, y1: 128, x2: 128, y2: 208, len: 113.14 },
] as const;

function ShadcnMark({
  size,
  progress,
  color = INK,
}: {
  size: number;
  progress: number; // 0..1 draw-on
  color?: string;
}) {
  // Reveal the two round-capped diagonals with a diagonal wipe along the
  // stroke direction (top-right → bottom-left). A dashoffset draw-on flashes a
  // big round-cap dot before the line grows, and the two lines start at
  // different points — the wipe paints the whole mark on as one gesture with
  // no floating dot.
  const c = Math.max(-1, Math.min(1, 2 * progress - 1));
  let clip: string | undefined;
  if (progress <= 0) {
    clip = "polygon(100% 0%, 100% 0%, 100% 0%)";
  } else if (progress >= 1) {
    clip = undefined;
  } else if (c >= 0) {
    clip = `polygon(0% 0%, 0% ${(c * 100).toFixed(2)}%, ${((1 - c) * 100).toFixed(2)}% 100%, 100% 100%, 100% 0%)`;
  } else {
    clip = `polygon(${(-c * 100).toFixed(2)}% 0%, 100% 0%, 100% ${((1 + c) * 100).toFixed(2)}%)`;
  }
  return (
    <div style={{ width: size, height: size, clipPath: clip }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 256 256"
        fill="none"
        style={{ display: "block" }}
      >
        {SHADCN_LINES.map((l, i) => (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke={color}
            strokeWidth={32}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
    </div>
  );
}

// Exact React Aria header mark — react-aria.adobe.com (one path, two
// subpaths), viewBox "200 206 800 790", dark-theme fill #7F57FF.
const ARIA_PATH =
  "M720.67 205.995C867.583 205.995 986.679 325.091 986.68 472.003C986.68 590.753 908.865 691.325 801.446 725.521L979.312 948.055C994.438 966.98 980.963 995 956.736 995H795.612C778.743 995 762.715 987.629 751.734 974.823L697.365 911.421L493.126 653.39C457.134 607.918 489.518 540.979 547.511 540.977L720.67 540.971C758.758 540.971 789.635 510.091 789.635 472.003C789.634 433.915 758.758 403.038 720.67 403.038H429.939C404.955 403.038 388.623 391.886 373.994 373.623L277.349 252.966C262.194 234.045 275.664 205.996 299.905 205.995H720.67Z M396.605 720.706C407.798 705.406 430.443 704.843 442.381 719.568L503.816 797.018H502.786L535.569 838.934C548.074 854.358 549.943 877.191 538.047 893.09L476.638 972.545C465.692 986.707 448.803 995 430.903 995H242.276C218.18 995 204.665 967.248 219.523 948.278L337.992 797.018H337.923L396.605 720.706Z";

function AriaMark({
  size,
  trace,
  fill,
  color = ARIA,
}: {
  size: number;
  trace: number; // 0..1 outline trace
  fill: number; // 0..1 bottom-up fill
  color?: string;
}) {
  const clipId = React.useId();
  const fillH = 790 * fill;
  return (
    <svg
      width={size}
      height={size * (790 / 800)}
      viewBox="200 206 800 790"
      fill="none"
      style={{ display: "block" }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={200} y={996 - fillH} width={800} height={fillH} />
        </clipPath>
      </defs>
      <path
        d={ARIA_PATH}
        pathLength={1}
        stroke={color}
        strokeWidth={7}
        strokeDasharray={1}
        strokeDashoffset={1 - trace}
        opacity={interpolate(fill, [0.75, 1], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />
      <path d={ARIA_PATH} fill={color} clipPath={`url(#${clipId})`} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Motion helpers — one camera: enter from below, exit upward.
// ---------------------------------------------------------------------------

function useRise(
  at: number,
  {
    dist = 32,
    damping = 15,
    stiffness = 120,
    exitAt,
  }: {
    dist?: number;
    damping?: number;
    stiffness?: number;
    exitAt?: number;
  } = {},
) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - at,
    fps,
    config: { damping, stiffness, mass: 1 },
  });
  const enterOpacity = interpolate(frame, [at, at + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  let y = (1 - s) * dist;
  let opacity = enterOpacity;
  if (exitAt !== undefined) {
    const e = interpolate(frame, [exitAt, exitAt + 14], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    });
    y -= e * 40;
    opacity *= 1 - e;
  }
  return { transform: `translateY(${y}px)`, opacity };
}

function Rise({
  at,
  dist,
  damping,
  stiffness,
  exitAt,
  style,
  children,
}: {
  at: number;
  dist?: number;
  damping?: number;
  stiffness?: number;
  exitAt?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const anim = useRise(at, { dist, damping, stiffness, exitAt });
  return <div style={{ ...style, ...anim }}>{children}</div>;
}

// A violet focus ring — React Aria's signature — springing onto a box.
function FocusRing({
  at,
  radius,
  inset = -6,
}: {
  at: number;
  radius: number;
  inset?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - at,
    fps,
    config: { damping: 12, stiffness: 170, mass: 0.9 },
  });
  const opacity = interpolate(frame, [at, at + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = 1.06 - 0.06 * s;
  return (
    <div
      style={{
        position: "absolute",
        inset,
        borderRadius: radius,
        border: `2px solid ${ARIA}`,
        boxShadow: "0 0 0 4px rgba(127,87,255,0.30)",
        opacity,
        transform: `scale(${scale})`,
      }}
    />
  );
}

// A value caption that rises under a component demo.
function Caption({ at, text }: { at: number; text: string }) {
  return (
    <Rise
      at={at}
      dist={26}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 552,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <span style={{ fontSize: 30, color: INK, fontWeight: 400 }}>{text}</span>
    </Rise>
  );
}

// A small drawn check, used by the ComboBox selected row.
function CheckMark({ at, size = 18, color = "#fff" }: { at: number; size?: number; color?: string }) {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.2, 1),
  });
  const LEN = 18;
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <polyline
        points="4,10.5 8.5,15 16,6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={LEN}
        strokeDashoffset={LEN * (1 - p)}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Scene 1 — the news, named (opener)
// ---------------------------------------------------------------------------

function Lockup({
  size,
  drawStart,
  gap = 32,
  crossSize = 18,
}: {
  size: number;
  drawStart: number;
  gap?: number;
  crossSize?: number;
}) {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [drawStart, drawStart + 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.2, 1),
  });
  const trace = interpolate(frame, [drawStart + 4, drawStart + 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.3, 1),
  });
  const fill = interpolate(frame, [drawStart + 26, drawStart + 54], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.2, 1),
  });
  const crossOpacity = interpolate(
    frame,
    [drawStart + 30, drawStart + 42],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap }}>
      <ShadcnMark size={size} progress={draw} />
      <span
        style={{
          fontSize: crossSize,
          color: MUTED,
          opacity: crossOpacity,
          fontFamily: SANS,
        }}
      >
        ✕
      </span>
      <AriaMark size={size} trace={trace} fill={fill} />
    </div>
  );
}

function IntroScene() {
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 224,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Lockup size={88} drawStart={14} />
      </div>

      <div
        style={{ position: "absolute", left: 0, right: 0, top: 368, height: 64 }}
      >
        <Sequence from={54}>
          <SoftBlurIn
            text="React Aria, now a base"
            fontSize={54}
            fontWeight={400}
            color={INK}
          />
        </Sequence>
      </div>

      <Rise
        at={96}
        dist={28}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 456,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 20, color: MUTED }}>
          First-class in shadcn/ui — alongside Base UI and Radix
        </span>
      </Rise>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------------
// Scene 2 — one flag (caretless)
// ---------------------------------------------------------------------------

const CMD_PREFIX = "pnpm dlx shadcn@latest init ";
const CMD_FLAG = "--base ";
const CMD_VALUE = "aria";
const CMD_LEN = CMD_PREFIX.length + CMD_FLAG.length + CMD_VALUE.length;

function CommandScene() {
  const frame = useCurrentFrame();
  const typed = Math.floor(
    interpolate(frame, [16, 50], [0, CMD_LEN], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const prefixText = CMD_PREFIX.slice(0, typed);
  const flagText = CMD_FLAG.slice(0, Math.max(0, typed - CMD_PREFIX.length));
  const valueText = CMD_VALUE.slice(
    0,
    Math.max(0, typed - CMD_PREFIX.length - CMD_FLAG.length),
  );

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 336,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: MONO,
          fontSize: 25,
          color: INK,
          whiteSpace: "pre",
        }}
      >
        <span>{prefixText}</span>
        <span style={{ color: ARIA }}>{flagText}</span>
        <span style={{ position: "relative", color: ARIA }}>
          {valueText}
          {typed >= CMD_LEN ? (
            <FocusRing at={64} radius={8} inset={-7} />
          ) : null}
        </span>
      </div>

      <Rise
        at={100}
        dist={28}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 416,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 18, color: MUTED }}>
          Or pick it in shadcn/create
        </span>
      </Rise>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------------
// Scene 3 — React Aria's DatePicker (accessibility)
// react-aria.adobe.com — the Vanilla CSS "Date Planted" example.
// ---------------------------------------------------------------------------

// July 2026: the 1st is a Wednesday (offset 3), 31 days. Selected = the 15th.
const CAL_OFFSET = 3;
const CAL_DAYS = 31;
const CAL_SELECTED = 15;
const CAL_WALK = [13, 14, 15]; // arrow-key focus walk landing on selected
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function CalendarScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // React Aria's popover entering animation: fade + scale-up from 0.96.
  const openS = spring({
    frame: frame - 8,
    fps,
    config: { damping: 18, stiffness: 190, mass: 0.8 },
  });
  const popOpacity = interpolate(frame, [8, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const popScale = 0.96 + 0.04 * openS;
  const popY = (1 - openS) * 8;

  // The focus ring is already on the 13th as the popover opens, holds, then
  // walks 13 → 14 → 15 on arrow-key beats.
  const WALK_START = 22;
  const walkIdx =
    frame < WALK_START
      ? 0
      : Math.min(CAL_WALK.length - 1, Math.floor((frame - WALK_START) / 9) + 1);
  const focusDay = CAL_WALK[walkIdx];

  const CELL = 34;
  const GAP = 6;

  const cells: React.ReactNode[] = [];
  for (let i = 0; i < 35; i++) {
    const day = i - CAL_OFFSET + 1;
    const inMonth = day >= 1 && day <= CAL_DAYS;
    const selected = day === CAL_SELECTED;
    const focused = inMonth && day === focusDay;
    cells.push(
      <div
        key={i}
        style={{
          position: "relative",
          width: CELL,
          height: CELL,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          fontSize: 14,
          color: selected ? "#fff" : inMonth ? INK : "transparent",
          background: selected ? ARIA : "transparent",
        }}
      >
        {inMonth ? day : ""}
        {focused && !selected ? (
          <div
            style={{
              position: "absolute",
              inset: -3,
              borderRadius: 9,
              border: `2px solid ${ARIA}`,
              boxShadow: "0 0 0 3px rgba(127,87,255,0.28)",
            }}
          />
        ) : null}
        {focused && selected ? (
          <div
            style={{
              position: "absolute",
              inset: -3,
              borderRadius: 9,
              boxShadow: "0 0 0 3px rgba(127,87,255,0.45)",
            }}
          />
        ) : null}
      </div>,
    );
  }

  const CARD_W = 7 * CELL + 6 * GAP + 32; // + padding

  return (
    <AbsoluteFill>
      <Rise
        at={6}
        dist={30}
        style={{
          position: "absolute",
          left: (1280 - CARD_W) / 2,
          top: 128,
          width: CARD_W,
        }}
      >
        {/* DatePicker field — label "Date Planted" (verbatim from the site). */}
        <div style={{ fontSize: 13, color: MUTED, marginBottom: 8 }}>
          Date Planted
        </div>
        <div
          style={{
            height: 40,
            borderRadius: RADIUS,
            border: `1px solid ${HAIRLINE}`,
            background: CARD,
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            fontSize: 15,
            color: INK,
            fontFamily: MONO,
          }}
        >
          <span>07</span>
          <span style={{ color: MUTED, margin: "0 4px" }}>/</span>
          <span style={{ color: ARIA }}>15</span>
          <span style={{ color: MUTED, margin: "0 4px" }}>/</span>
          <span>2026</span>
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke={MUTED}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginLeft: "auto" }}
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </div>
      </Rise>

      {/* Calendar popover — React Aria's entering animation. */}
      <div
        style={{
          position: "absolute",
          left: (1280 - CARD_W) / 2,
          top: 248,
          width: CARD_W,
          opacity: popOpacity,
          transform: `translateY(${popY}px) scale(${popScale})`,
          transformOrigin: "50% 0%",
          borderRadius: RADIUS,
          border: `1px solid ${HAIRLINE}`,
          background: CARD,
          padding: 16,
          boxSizing: "border-box",
          boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <span style={{ color: MUTED, fontSize: 16 }}>‹</span>
          <span style={{ color: INK, fontSize: 15, fontWeight: 500 }}>
            July 2026
          </span>
          <span style={{ color: MUTED, fontSize: 16 }}>›</span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(7, ${CELL}px)`,
            gap: GAP,
            marginBottom: GAP,
          }}
        >
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              style={{
                width: CELL,
                textAlign: "center",
                fontSize: 11,
                color: MUTED,
              }}
            >
              {d}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(7, ${CELL}px)`,
            gap: GAP,
          }}
        >
          {cells}
        </div>
      </div>

      <Caption at={46} text="Top-tier accessibility" />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------------
// Scene 4 — React Aria's ComboBox (built-in behavior)
// react-aria.adobe.com — the Tailwind "Assignee" example, whose entering
// animation the site itself advertises ("built-in entry and exit states").
// ---------------------------------------------------------------------------

const PEOPLE = [
  { name: "Alex Chen", color: "#5b8def" },
  { name: "Bailey Ford", color: "#e5675f" },
  { name: "Casey Kim", color: "#7F57FF" },
  { name: "Devon Ray", color: "#3aa675" },
  { name: "Emery Ross", color: "#d99a2b" },
];
const COMBO_SELECTED = 2; // Casey Kim

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("");
}

function ComboBoxScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const openS = spring({
    frame: frame - 8,
    fps,
    config: { damping: 18, stiffness: 190, mass: 0.8 },
  });
  const popOpacity = interpolate(frame, [8, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const popY = (1 - openS) * 8;

  // Focus highlight glides down to the selected row.
  const selectedAt = 52;
  const focusShown = frame >= 28;
  const focusRow = interpolate(frame, [28, selectedAt], [0, COMBO_SELECTED], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.2, 1),
  });

  const ROW_H = 48;
  const CARD_W = 336;

  return (
    <AbsoluteFill>
      <Rise
        at={6}
        dist={30}
        style={{
          position: "absolute",
          left: (1280 - CARD_W) / 2,
          top: 148,
          width: CARD_W,
        }}
      >
        {/* ComboBox field — label "Assignee" (verbatim from the site). */}
        <div style={{ fontSize: 13, color: MUTED, marginBottom: 8 }}>
          Assignee
        </div>
        <div
          style={{
            height: 44,
            borderRadius: RADIUS,
            border: `1px solid ${frame >= 22 ? ARIA : HAIRLINE}`,
            background: CARD,
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            fontSize: 15,
            color: frame >= selectedAt + 4 ? INK : MUTED,
            position: "relative",
            boxShadow: frame >= 22 ? "0 0 0 3px rgba(127,87,255,0.25)" : "none",
          }}
        >
          {frame >= selectedAt + 4 ? PEOPLE[COMBO_SELECTED].name : "Search…"}
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke={MUTED}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginLeft: "auto" }}
          >
            <path d="M8 9l4-4 4 4M8 15l4 4 4-4" />
          </svg>
        </div>
      </Rise>

      {/* ListBox popover — the entering animation React Aria advertises. */}
      <div
        style={{
          position: "absolute",
          left: (1280 - CARD_W) / 2,
          top: 268,
          width: CARD_W,
          opacity: popOpacity,
          transform: `translateY(${popY}px)`,
          borderRadius: RADIUS,
          border: `1px solid ${HAIRLINE}`,
          background: CARD,
          padding: 6,
          boxSizing: "border-box",
          boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
        }}
      >
        {PEOPLE.map((p, i) => {
          // Each item fades and slides in, staggered — entering:animate-in.
          const at = 14 + i * 4;
          const itemS = spring({
            frame: frame - at,
            fps,
            config: { damping: 18, stiffness: 160, mass: 0.8 },
          });
          const itemOpacity = interpolate(frame, [at, at + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const active = focusShown && Math.round(focusRow) === i;
          const isSelected = i === COMBO_SELECTED;
          return (
            <div
              key={p.name}
              style={{
                height: ROW_H,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "0 10px",
                borderRadius: 8,
                background: active ? ARIA : "transparent",
                opacity: itemOpacity,
                transform: `translateY(${(1 - itemS) * 10}px)`,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: p.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {initials(p.name)}
              </div>
              <span
                style={{
                  fontSize: 15,
                  color: active ? "#fff" : INK,
                  fontWeight: active ? 500 : 400,
                }}
              >
                {p.name}
              </span>
              {isSelected ? (
                <span style={{ marginLeft: "auto", display: "flex" }}>
                  <CheckMark
                    at={selectedAt}
                    color={active ? "#fff" : ARIA}
                  />
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      <Caption at={66} text="Built-in behavior" />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------------
// Scene 5 — React Aria's Slider (adaptive interactions)
// react-aria.adobe.com — the Styled Components "Opacity" example,
// defaultValue 30.
// ---------------------------------------------------------------------------

function SliderScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const TRACK_W = 360;
  const START = 30;
  const END = 72;

  // The thumb drags 30 → 72 on a spring; data-dragging fills it violet.
  const dragS = spring({
    frame: frame - 14,
    fps,
    config: { damping: 16, stiffness: 130, mass: 1 },
  });
  const value = Math.round(START + (END - START) * dragS);
  const dragging = frame >= 16 && dragS < 0.98;
  const pct = value / 100;

  const CARD_W = TRACK_W + 48;

  return (
    <AbsoluteFill>
      <Rise
        at={6}
        dist={30}
        style={{
          position: "absolute",
          left: (1280 - CARD_W) / 2,
          top: 300,
          width: CARD_W,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 16, color: INK }}>Opacity</span>
          <span
            style={{ fontSize: 16, color: MUTED, fontFamily: MONO, fontVariantNumeric: "tabular-nums" }}
          >
            {value}
          </span>
        </div>

        {/* Track + fill + thumb. */}
        <div
          style={{
            position: "relative",
            height: 24,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 6,
              borderRadius: 3,
              background: "rgba(255,255,255,0.14)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              width: `${pct * 100}%`,
              height: 6,
              borderRadius: 3,
              background: ARIA,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: `calc(${pct * 100}% - 12px)`,
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: dragging ? ARIA : "#e5e5e5",
              border: `2px solid ${dragging ? ARIA : "#8a8a8a"}`,
              boxShadow: dragging ? "0 0 0 6px rgba(127,87,255,0.22)" : "none",
            }}
          />
        </div>
      </Rise>

      <Caption at={46} text="Adaptive interactions" />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------------
// Scene 6 — choose your foundation
// ---------------------------------------------------------------------------

function OutroScene() {
  // The lockup + headline sit centered as a pair (no URL line).
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 280,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Lockup size={64} drawStart={10} gap={24} crossSize={15} />
      </div>

      <div
        style={{ position: "absolute", left: 0, right: 0, top: 384, height: 56 }}
      >
        <Sequence from={44}>
          <SoftBlurIn
            text="Choose your foundation"
            fontSize={46}
            fontWeight={400}
            color={INK}
          />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export function ShadcnAriaDemo() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accentIn = spring({
    frame: frame - ACCENT_AT,
    fps,
    config: { damping: 30, stiffness: 26, mass: 1 },
  });
  const accentAmount = 0.62 * accentIn;

  return (
    <AbsoluteFill
      style={
        {
          background: BG,
          fontFamily: SANS,
          "--font-geist-sans": SANS,
        } as React.CSSProperties
      }
    >
      <ShaderCaustics
        colors={["#0a0a0a", "#38383f"]}
        accent={ARIA}
        accentAmount={accentAmount}
        scale={4.6}
        intensity={1.15}
        speed={1}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 46%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.48) 100%)",
        }}
      />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={S_INTRO}>
          <IntroScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T })}
          presentation={pushThrough()}
        />
        <TransitionSeries.Sequence durationInFrames={S_CMD}>
          <CommandScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T })}
          presentation={pushThrough()}
        />
        <TransitionSeries.Sequence durationInFrames={S_CAL}>
          <CalendarScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T })}
          presentation={pushThrough()}
        />
        <TransitionSeries.Sequence durationInFrames={S_COMBO}>
          <ComboBoxScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T })}
          presentation={pushThrough()}
        />
        <TransitionSeries.Sequence durationInFrames={S_SLIDER}>
          <SliderScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T })}
          presentation={pushThrough()}
        />
        <TransitionSeries.Sequence durationInFrames={S_OUTRO}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
}
