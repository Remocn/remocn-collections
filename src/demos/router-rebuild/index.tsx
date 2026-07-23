import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/Geist";

import {
  SpringSettleEnter,
  SpringSettleItem as Item,
  springSettleExitStyle,
} from "@/components/remocn/spring-settle";

const { fontFamily: SANS } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600"],
});

export const ROUTER_REBUILD_DURATION = 657;

// ─────────────────────────────────────────────────────────────────────────────
// Frame-accurate rebuild of the Cursor Router promo reference
// (x6JrXpGMGgWHlAIL.mp4, 30fps, 657 frames). Every beat below was measured
// frame-by-frame from the source; scene boundaries land on the same frames.
// Transitions use the spring-settle grammar components with per-boundary
// exit windows matching the reference cuts.
//
// Timeline (source frames):
//   0-114   headline — full lockup, line 2 clears at 23, "at" at 30,
//           55→60% count every 2f from 40, "lower" at 48, "cost" at 58
//   115-191 select — pill enters 115, menu 130 (✓ Intelligence·orange),
//           ✓→Balance·green 142, ✓→Cost·blue 152, exit 187-191, gap 192
//   193-369 flow — prompt 194, arrow 207-214, Router 218/222, arrow 235-242,
//           model 246/250; swaps orange→blue 284-290, blue→green 316-324;
//           exit 364-369
//   370-459 table — title+Fable 370, ghost rows 372-384, spotlight wave
//           390-404, Cursor Router lands 406 (green, stays), exit 458-460
//   461-576 cursor — "Cursor" settles in 461, types " Router" 476-492,
//           clears 508, "Now available for Teams and Enterprises"
//           word-by-word 510-540, exit 571-576
//   577-656 cube — 3D cube spins in on a settling spring, static from ~596
// ─────────────────────────────────────────────────────────────────────────────

const INK = "#1d1d1b";
const ACCENT = "#e5602c";
const BLUE = "#3c6fe4";
const GREEN = "#1f9d55";
const RED = "#e04f38";

const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const Center: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{ justifyContent: "center", alignItems: "center", fontFamily: SANS }}
  >
    {children}
  </AbsoluteFill>
);

// ─── scene 1: headline (f0-114) ─────────────────────────────────────────────

const HeadlineScene: React.FC = () => {
  const f = useCurrentFrame();
  let line2: React.ReactNode;
  if (f < 23) {
    line2 = (
      <>
        at <span style={{ color: ACCENT }}>60%</span> lower cost
      </>
    );
  } else if (f < 30) {
    line2 = " ";
  } else {
    const pct = f < 39 ? null : 55 + Math.min(Math.floor((f - 39) / 2), 5);
    line2 = (
      <>
        at
        {pct !== null ? (
          <span style={{ color: ACCENT }}> {pct}%</span>
        ) : null}
        {f >= 48 ? " lower" : ""}
        {f >= 58 ? " cost" : ""}
      </>
    );
  }
  return (
    <Center>
      <div
        style={{
          textAlign: "center",
          fontSize: 58,
          lineHeight: 1.3,
          fontWeight: 500,
          color: INK,
        }}
      >
        <div>Frontier intelligence</div>
        <div>{line2}</div>
      </div>
    </Center>
  );
};

// ─── scene 2: select (f115-191, local 0-76) ─────────────────────────────────

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 6px 18px rgba(0,0,0,0.05)",
  fontSize: 24,
  color: INK,
};

const SelectScene: React.FC = () => {
  const f = useCurrentFrame();
  const active = f < 27 ? 0 : f < 37 ? 1 : 2;
  const items: Array<[string, string]> = [
    ["Intelligence", ACCENT],
    ["Balance", GREEN],
    ["Cost", BLUE],
  ];
  return (
    <AbsoluteFill style={springSettleExitStyle(f, 76, { exitFrames: 5 })}>
      <Center>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 40 }}>
          <SpringSettleEnter local={f}>
            <Item index={0}>
              <div
                style={{
                  ...cardStyle,
                  display: "flex",
                  alignItems: "center",
                  gap: 72,
                  padding: "16px 24px",
                  fontWeight: 500,
                }}
              >
                <span>Auto</span>
                <span style={{ fontSize: 20 }}>✓</span>
              </div>
            </Item>
          </SpringSettleEnter>
          <SpringSettleEnter local={f - 12}>
            <Item index={0}>
              <div
                style={{
                  ...cardStyle,
                  padding: "18px 24px",
                  width: 300,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <span style={{ color: "#a3a29e", fontSize: 20 }}>
                  Optimize For
                </span>
                {items.map(([label, color], i) => (
                  <span
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: active === i ? color : INK,
                    }}
                  >
                    {label}
                    {active === i ? <span>✓</span> : null}
                  </span>
                ))}
              </div>
            </Item>
          </SpringSettleEnter>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// ─── scene 3: flow (f193-369, local 0-176) ──────────────────────────────────

const CYCLES = [
  { prompt: "Build a new UI", model: "Grok 4.5", fg: ACCENT, bg: "#fbe4d8", pw: 208, mw: 130 },
  { prompt: "Hard debug", model: "Opus 4.8", fg: BLUE, bg: "#dde6fa", pw: 164, mw: 132 },
  { prompt: "Run tests", model: "Composer", fg: GREEN, bg: "#dcf3e3", pw: 148, mw: 150 },
];
const SWAPS = [91, 123]; // cycle switches (blank midpoints)

const FlowArrow: React.FC<{ draw: number }> = ({ draw }) => {
  const len = 88 * draw;
  return (
    <svg width={96} height={12} viewBox="0 0 96 12" style={{ flexShrink: 0 }}>
      <line x1={0} y1={6} x2={len} y2={6} stroke="#8a8a86" strokeWidth={1.6} />
      {draw > 0.9 ? (
        <path
          d="M88 6 L80 1.5 M88 6 L80 10.5"
          stroke="#8a8a86"
          strokeWidth={1.6}
          fill="none"
          opacity={interpolate(draw, [0.9, 1], [0, 1])}
        />
      ) : null}
    </svg>
  );
};

const FlowScene: React.FC = () => {
  const f = useCurrentFrame();
  const cycle = f < SWAPS[0] ? 0 : f < SWAPS[1] ? 1 : 2;
  const cur = CYCLES[cycle];

  // prompt/model text dips out and back around each swap; Router persists
  let textOpacity = 1;
  for (const s of SWAPS) {
    textOpacity = Math.min(
      textOpacity,
      interpolate(f, [s - 4, s - 1, s + 2, s + 5], [1, 0, 0, 1], CLAMP),
    );
  }
  const pillBg =
    f >= SWAPS[0] - 2 && f < SWAPS[0] + 2
      ? interpolateColors(f, [SWAPS[0] - 2, SWAPS[0] + 2], [CYCLES[0].bg, CYCLES[1].bg])
      : f >= SWAPS[1] - 2 && f < SWAPS[1] + 2
        ? interpolateColors(f, [SWAPS[1] - 2, SWAPS[1] + 2], [CYCLES[1].bg, CYCLES[2].bg])
        : cur.bg;

  const arrow1 = interpolate(f, [14, 21], [0, 1], CLAMP);
  const arrow2 = interpolate(f, [42, 49], [0, 1], CLAMP);
  const routerText = interpolate(f, [29, 33], [0, 1], CLAMP);
  const modelText =
    interpolate(f, [57, 61], [0, 1], CLAMP) * textOpacity;

  const pill = (
    width: number,
    bg: string,
    fg: string,
    text: string,
    txtOpacity: number,
  ) => (
    <div
      style={{
        width,
        background: bg,
        borderRadius: 8,
        padding: "10px 0",
        fontSize: 24,
        fontWeight: 500,
        color: fg,
        textAlign: "center",
      }}
    >
      <span style={{ opacity: txtOpacity }}>{text}</span>
    </div>
  );

  return (
    <AbsoluteFill style={springSettleExitStyle(f, 177, { exitFrames: 6 })}>
      <Center>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <SpringSettleEnter local={f - 1}>
            <Item index={0}>
              {pill(cur.pw, pillBg, cur.fg, cur.prompt, textOpacity)}
            </Item>
          </SpringSettleEnter>
          <FlowArrow draw={arrow1} />
          <SpringSettleEnter local={f - 25}>
            <Item index={0}>
              {pill(120, "#e6e4e0", "#6f6e6a", "Router", routerText)}
            </Item>
          </SpringSettleEnter>
          <FlowArrow draw={arrow2} />
          <SpringSettleEnter local={f - 53}>
            <Item index={0}>
              {pill(cur.mw, pillBg, cur.fg, cur.model, modelText)}
            </Item>
          </SpringSettleEnter>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// ─── scene 4: table (f370-460, local 0-90) ──────────────────────────────────

const ROWS: Array<[string, string]> = [
  ["Fable 5", "$12.69"],
  ["GPT-5.6 Sol", "$6.77"],
  ["Balance", "$4.63"],
  ["Intelligence", "$6.76"],
  ["Opus 4.8", "$7.34"],
  ["Composer", "$1.49"],
  ["Grok 4.5", "$2.91"],
  ["Cursor Router", "$1.38"],
];
// spotlight windows per row index (local frames)
const SPOT: Array<[number, number]> = [
  [0, 20],
  [20, 24],
  [24, 26],
  [26, 28],
  [28, 30],
  [30, 32],
  [32, 36],
  [36, Infinity],
];
const GHOST_AT = [0, 2, 4, 6, 8, 10, 12, 36];

const TableScene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={springSettleExitStyle(f, 91, { exitFrames: 3 })}>
      <Center>
        <div style={{ display: "flex", alignItems: "center", gap: 150 }}>
          <SpringSettleEnter local={f}>
            <Item index={0}>
              <div style={{ fontSize: 44, fontWeight: 500, color: INK }}>
                Cost per commit
              </div>
            </Item>
          </SpringSettleEnter>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {ROWS.map(([name, price], i) => {
              const [s, e] = SPOT[i];
              const hot = f >= s && f < e;
              const isRouter = i === 7;
              const mounted = interpolate(
                f,
                [GHOST_AT[i], GHOST_AT[i] + 3],
                [0, 1],
                CLAMP,
              );
              const opacity = mounted * (hot ? 1 : 0.25);
              const chip = hot;
              const chipFg = isRouter ? GREEN : i === 0 ? ACCENT : RED;
              const chipBg = isRouter ? "#dcf3e3" : "#fde3dc";
              const row = (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 90,
                    fontSize: 21,
                    color: INK,
                    opacity,
                  }}
                >
                  <span>{name}</span>
                  <span
                    style={{
                      color: chip ? chipFg : RED,
                      background: chip ? chipBg : "transparent",
                      borderRadius: 6,
                      padding: "2px 8px",
                    }}
                  >
                    {price}
                  </span>
                </div>
              );
              // the first row lands together with the title (as in the ref)
              return i === 0 ? (
                <SpringSettleEnter key={name} local={f}>
                  <Item index={0}>{row}</Item>
                </SpringSettleEnter>
              ) : (
                <div key={name}>{row}</div>
              );
            })}
          </div>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// ─── scene 5: cursor typewriter (f461-576, local 0-115) ─────────────────────

const CursorScene: React.FC = () => {
  const f = useCurrentFrame();
  let text: string;
  if (f < 47) {
    const letters = ["R", "o", "u", "t", "e", "r"];
    const at = [15, 17, 21, 25, 27, 31];
    const n = at.filter((a) => f >= a).length;
    text = "Cursor" + (n > 0 ? " " + letters.slice(0, n).join("") : "");
  } else {
    const words = ["Now", "available", "for", "Teams", "and", "Enterprises"];
    const at = [49, 53, 58, 67, 73, 79];
    text = words.filter((_, i) => f >= at[i]).join(" ");
  }
  return (
    <AbsoluteFill style={springSettleExitStyle(f, 116, { exitFrames: 6 })}>
      <Center>
        <SpringSettleEnter local={f}>
          <Item index={0}>
            <div style={{ fontSize: 34, fontWeight: 500, color: INK }}>
              {text.length > 0 ? text : " "}
            </div>
          </Item>
        </SpringSettleEnter>
      </Center>
    </AbsoluteFill>
  );
};

// ─── scene 6: cube (f577-656, local 0-79) ───────────────────────────────────

const CUBE = 72;

const face = (transform: string, background: string): React.CSSProperties => ({
  position: "absolute",
  width: CUBE,
  height: CUBE,
  background,
  border: "2px solid #131313",
  boxSizing: "border-box",
  transform,
  backfaceVisibility: "hidden",
});

const CubeScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: f,
    fps,
    config: { damping: 24, stiffness: 200, mass: 1 },
  });
  const scale = interpolate(p, [0, 1], [1.25, 1]);
  const rotY = interpolate(p, [0, 1], [160, 315]);
  const rotX = interpolate(p, [0, 1], [-58, -28]);
  const opacity = interpolate(f, [0, 4], [0, 1], CLAMP);
  const h = CUBE / 2;
  return (
    <Center>
      <div style={{ perspective: 1400, opacity }}>
        <div
          style={{
            width: CUBE,
            height: CUBE,
            transformStyle: "preserve-3d",
            transform: `scale(${scale}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          }}
        >
          <div style={face(`rotateY(0deg) translateZ(${h}px)`, "#131313")} />
          <div style={face(`rotateY(90deg) translateZ(${h}px)`, "#1c1c1c")} />
          <div style={face(`rotateY(180deg) translateZ(${h}px)`, "#131313")} />
          <div style={face(`rotateY(-90deg) translateZ(${h}px)`, "#1c1c1c")} />
          <div style={face(`rotateX(90deg) translateZ(${h}px)`, "#fafafa")} />
          <div style={face(`rotateX(-90deg) translateZ(${h}px)`, "#131313")} />
        </div>
      </div>
    </Center>
  );
};

// ─── stage ───────────────────────────────────────────────────────────────────

const bgAt = (f: number): string => {
  if (f < 115) return "#ffffff";
  if (f < 191) return "#e6e4e0";
  if (f < 194) return interpolateColors(f, [191, 194], ["#e6e4e0", "#f5f5f5"]);
  if (f < 368) return "#f5f5f5";
  if (f < 371) return interpolateColors(f, [368, 371], ["#f5f5f5", "#ffffff"]);
  return "#ffffff";
};

export const RouterRebuildDemo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: bgAt(frame) }}>
      <Sequence from={0} durationInFrames={115}>
        <HeadlineScene />
      </Sequence>
      <Sequence from={115} durationInFrames={77}>
        <SelectScene />
      </Sequence>
      <Sequence from={193} durationInFrames={177}>
        <FlowScene />
      </Sequence>
      <Sequence from={370} durationInFrames={91}>
        <TableScene />
      </Sequence>
      <Sequence from={461} durationInFrames={116}>
        <CursorScene />
      </Sequence>
      <Sequence from={577} durationInFrames={80}>
        <CubeScene />
      </Sequence>
    </AbsoluteFill>
  );
};
