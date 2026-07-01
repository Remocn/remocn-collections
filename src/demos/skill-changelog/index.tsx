import React, { type CSSProperties, type ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
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

import { RemocnUIProvider } from "@/lib/remocn-ui";
import { DynamicGrid } from "@/components/remocn/dynamic-grid";
import { RollingNumber } from "@/components/remocn/rolling-number";

// ---------------------------------------------------------------------------
// Fonts — bind to the CSS variables the remocn components read.
// ---------------------------------------------------------------------------
const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700", "800"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "700"],
});

const SANS =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO = "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace";

// ---------------------------------------------------------------------------
// Palette — one warm accent (Claude/agent) on a flat near-black doc surface.
// ---------------------------------------------------------------------------
const BG = "#0a0a0a";
const INK = "#fafafa";
const FAINT = "rgba(250,250,250,0.50)";
const DIM = "rgba(250,250,250,0.32)";
const HAIR = "rgba(250,250,250,0.10)";
const SURFACE = "#141414";
const ACCENT = "#D97757"; // warm — the agent accent
const GREEN = "#5fcf80"; // muted semantic — Added
const BLUE = "#6aa8f5"; //  muted semantic — Changed

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap adjacent scenes.
// ---------------------------------------------------------------------------
const S_OPEN = 78; //    positioning — "the skill, rebuilt"
const S_BEFORE = 82; //  problem — one monolithic file
const S_TREE = 168; //   hero — the new structure builds as a file tree
const S_CHANGES = 132; // change list — what got added
const S_STATS = 120; //  proof — rolling numbers
const S_OUTRO = 120; //  CTA — wordmark + tagline

const T_X = 14; //    neutral crossfade
const T_ZOOM = 16; // push deeper into the structure
const T_OUT = 18; //  settle into the outro

export const SKILL_CHANGELOG_DURATION =
  S_OPEN +
  S_BEFORE +
  S_TREE +
  S_CHANGES +
  S_STATS +
  S_OUTRO -
  (T_X + T_ZOOM + T_X + T_X + T_OUT);

// ---------------------------------------------------------------------------
// Reveal — frame-driven fade + offset + blur clear. Deterministic.
// ---------------------------------------------------------------------------
const Reveal: React.FC<{
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  blur?: number;
  display?: CSSProperties["display"];
}> = ({
  children,
  delay = 0,
  duration = 20,
  y = 16,
  x = 0,
  blur = 8,
  display = "block",
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        display,
        opacity: p,
        transform: `translate(${(1 - p) * x}px, ${(1 - p) * y}px)`,
        filter: p < 1 ? `blur(${(1 - p) * blur}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Eyebrow — a small accent-dotted label chip.
// ---------------------------------------------------------------------------
const Eyebrow: React.FC<{ children: string; delay?: number }> = ({
  children,
  delay = 0,
}) => (
  <Reveal delay={delay} y={10} blur={6} duration={16} display="inline-block">
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        padding: "7px 15px 7px 12px",
        borderRadius: 999,
        border: `1px solid ${HAIR}`,
        background: "rgba(255,255,255,0.03)",
        fontFamily: SANS,
        fontSize: 16,
        fontWeight: 600,
        color: FAINT,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: ACCENT,
        }}
      />
      {children}
    </div>
  </Reveal>
);

// ===========================================================================
// Scene 1 — Positioning. State what this is.
// ===========================================================================
const OpenScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 22,
    }}
  >
    <Eyebrow delay={2}>Skill update · remocn</Eyebrow>
    <Reveal delay={12} y={20} blur={12} duration={24}>
      <h1
        style={{
          margin: 0,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 68,
          letterSpacing: "-0.02em",
          color: INK,
          textAlign: "center",
          lineHeight: 1.05,
        }}
      >
        The agent skill,
        <br />
        <span style={{ color: ACCENT }}>rebuilt.</span>
      </h1>
    </Reveal>
    <Reveal delay={26} y={14} blur={8} duration={20}>
      <p
        style={{
          margin: 0,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 24,
          color: FAINT,
          textAlign: "center",
        }}
      >
        Restructured, and a lot more detailed.
      </p>
    </Reveal>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 2 — Problem. It used to be one monolithic file.
// ===========================================================================
// Deterministic line widths for the "crammed" monolith doc (no randomness).
const MONO_LINES = [
  96, 72, 88, 54, 91, 67, 83, 60, 94, 49, 79, 86, 58, 90, 64, 81, 71, 95, 52,
  87, 75, 62, 92, 56,
];

const BeforeScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 30,
    }}
  >
    <Reveal delay={2} y={14} blur={8} duration={18}>
      <h2
        style={{
          margin: 0,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 34,
          color: INK,
          textAlign: "center",
        }}
      >
        It used to live in <span style={{ color: ACCENT }}>one file</span>.
      </h2>
    </Reveal>
    <Reveal delay={10} y={30} blur={12} duration={22}>
      <div
        style={{
          width: 420,
          height: 300,
          borderRadius: 16,
          background: SURFACE,
          border: `1px solid ${HAIR}`,
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
        }}
      >
        {/* file header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "13px 18px",
            borderBottom: `1px solid ${HAIR}`,
          }}
        >
          <span
            style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT }}
          />
          <span style={{ fontFamily: MONO, fontSize: 15, color: FAINT }}>
            SKILL.md
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontFamily: MONO,
              fontSize: 12,
              color: DIM,
            }}
          >
            everything
          </span>
        </div>
        {/* crammed lines */}
        <div
          style={{
            padding: "14px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 7,
          }}
        >
          {MONO_LINES.map((w, i) => (
            <div
              key={i}
              style={{
                height: 5,
                width: `${w}%`,
                borderRadius: 3,
                background: "rgba(250,250,250,0.13)",
              }}
            />
          ))}
        </div>
      </div>
    </Reveal>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 3 — Hero. The new structure builds itself as a file tree.
// ===========================================================================
type Row = {
  prefix: string;
  name: string;
  dir?: boolean;
  note?: string;
  fresh?: boolean; // newly added → accent
};

const TREE: Row[] = [
  { prefix: "", name: "skills/remocn/", dir: true },
  { prefix: "├─ ", name: "SKILL.md" },
  { prefix: "└─ ", name: "references/", dir: true },
  { prefix: "   ├─ ", name: "anatomy.md", note: "strategy · beats · quality bar", fresh: true },
  { prefix: "   ├─ ", name: "design.md" },
  { prefix: "   ├─ ", name: "motion-principles.md" },
  { prefix: "   ├─ ", name: "anti-patterns.md" },
  { prefix: "   ├─ ", name: "archetypes/", dir: true, note: "9 recipes", fresh: true },
  { prefix: "   └─ ", name: "components/", dir: true, note: "one file each", fresh: true },
];

const TreeRow: React.FC<{ row: Row; delay: number }> = ({ row, delay }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const nameColor = row.fresh ? ACCENT : row.dir ? INK : FAINT;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 34,
        opacity: p,
        transform: `translateX(${(1 - p) * -12}px)`,
        filter: p < 1 ? `blur(${(1 - p) * 5}px)` : undefined,
      }}
    >
      <span
        style={{
          fontFamily: MONO,
          fontSize: 21,
          color: DIM,
          whiteSpace: "pre",
        }}
      >
        {row.prefix}
      </span>
      <span
        style={{
          fontFamily: MONO,
          fontSize: 21,
          fontWeight: row.dir ? 600 : 400,
          color: nameColor,
        }}
      >
        {row.name}
      </span>
      {row.note && (
        <span
          style={{
            marginLeft: 14,
            fontFamily: SANS,
            fontSize: 13.5,
            fontWeight: 500,
            color: row.fresh ? "rgba(217,119,87,0.85)" : DIM,
            padding: "3px 10px",
            borderRadius: 999,
            background: row.fresh ? "rgba(217,119,87,0.12)" : "transparent",
            border: row.fresh ? "1px solid rgba(217,119,87,0.25)" : "none",
          }}
        >
          {row.note}
        </span>
      )}
    </div>
  );
};

const TreeScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 34,
    }}
  >
    <Reveal delay={2} y={14} blur={8} duration={18}>
      <h2
        style={{
          margin: 0,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 34,
          color: INK,
          textAlign: "center",
        }}
      >
        Now it has a <span style={{ color: ACCENT }}>structure</span>.
      </h2>
    </Reveal>
    <div
      style={{
        width: 660,
        padding: "26px 32px",
        borderRadius: 18,
        background: SURFACE,
        border: `1px solid ${HAIR}`,
        boxShadow: "0 24px 70px rgba(0,0,0,0.5)",
      }}
    >
      {TREE.map((row, i) => (
        <TreeRow key={row.name} row={row} delay={16 + i * 9} />
      ))}
    </div>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 4 — Change list. What got added, changelog-style.
// ===========================================================================
type Change = { tag: "Added" | "Changed"; color: string; text: ReactNode };

const CHANGES: Change[] = [
  {
    tag: "Added",
    color: GREEN,
    text: (
      <>
        <b style={{ fontWeight: 600 }}>anatomy</b> — how to compose a whole
        video, plus a good-vs-slop quality bar
      </>
    ),
  },
  {
    tag: "Added",
    color: GREEN,
    text: (
      <>
        <b style={{ fontWeight: 600 }}>archetypes</b> — 9 ready recipes:
        product demo, changelog, oss showcase…
      </>
    ),
  },
  {
    tag: "Changed",
    color: BLUE,
    text: (
      <>
        <b style={{ fontWeight: 600 }}>components</b> — one file each, with
        clear use / avoid notes
      </>
    ),
  },
];

const ChangeRow: React.FC<{ change: Change; delay: number }> = ({
  change,
  delay,
}) => (
  <Reveal delay={delay} y={18} x={-10} blur={7} duration={18}>
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <span
        style={{
          flexShrink: 0,
          width: 92,
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 15,
          fontWeight: 500,
          color: change.color,
          padding: "6px 0",
          borderRadius: 8,
          background: `${change.color}1f`,
          border: `1px solid ${change.color}33`,
        }}
      >
        {change.tag}
      </span>
      <span style={{ fontFamily: SANS, fontSize: 23, color: INK }}>
        {change.text}
      </span>
    </div>
  </Reveal>
);

const ChangesScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 30,
    }}
  >
    <Reveal delay={2} y={14} blur={8} duration={18}>
      <h2
        style={{
          margin: 0,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 34,
          color: INK,
        }}
      >
        And a lot more detail.
      </h2>
    </Reveal>
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {CHANGES.map((c, i) => (
        <ChangeRow key={i} change={c} delay={14 + i * 12} />
      ))}
    </div>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 5 — Proof. Rolling numbers.
// ===========================================================================
const Stat: React.FC<{
  to: number;
  label: string;
  delay: number;
}> = ({ to, label, delay }) => (
  <Reveal delay={delay} y={24} blur={10} duration={20}>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        width: 280,
      }}
    >
      <div style={{ height: 96, display: "flex", alignItems: "center" }}>
        <RollingNumber from={0} to={to} fontSize={96} color={ACCENT} />
      </div>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 22,
          color: FAINT,
        }}
      >
        {label}
      </span>
    </div>
  </Reveal>
);

const StatsScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 40,
    }}
  >
    <Reveal delay={2} y={14} blur={8} duration={18}>
      <h2
        style={{
          margin: 0,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 30,
          color: INK,
        }}
      >
        Everything your agent needs.
      </h2>
    </Reveal>
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      <Stat to={124} label="components" delay={10} />
      <div style={{ width: 1, height: 120, background: HAIR }} />
      <Stat to={9} label="archetypes" delay={18} />
      <div style={{ width: 1, height: 120, background: HAIR }} />
      <Stat to={5} label="reference guides" delay={26} />
    </div>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 6 — CTA. Calm wordmark lockup.
// ===========================================================================
// Wordmark — letter-spacing collapses + blur clears (tracking-in essence,
// intentionally letter-spaced) on the dark canvas.
const Wordmark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame, fps, config: { damping: 18, stiffness: 90 } });
  const letterSpacing = interpolate(t, [0, 1], [0.5, -0.03]) + "em";
  const blurAmount = interpolate(t, [0, 1], [12, 0]);
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ height: 120, display: "flex", alignItems: "center" }}>
      <span
        style={{
          fontFamily: SANS,
          fontSize: 104,
          fontWeight: 700,
          color: INK,
          letterSpacing,
          opacity,
          filter: blurAmount > 0.05 ? `blur(${blurAmount}px)` : undefined,
          whiteSpace: "nowrap",
        }}
      >
        remocn
      </span>
    </div>
  );
};

const OutroScene: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Wordmark />
      <Reveal delay={26} y={14} blur={8} duration={20}>
        <p
          style={{
            margin: 0,
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 26,
            color: FAINT,
            textAlign: "center",
          }}
        >
          A sharper map for your agent.
        </p>
      </Reveal>
      <Reveal delay={40} y={10} blur={6} duration={16}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginTop: 6,
            padding: "9px 18px",
            borderRadius: 999,
            border: `1px solid ${HAIR}`,
            background: "rgba(255,255,255,0.03)",
            fontFamily: MONO,
            fontSize: 18,
            color: INK,
          }}
        >
          <span style={{ color: ACCENT }}>/</span>remocn
        </div>
      </Reveal>
    </div>
  </AbsoluteFill>
);

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

const ZoomBlur: React.FC<
  TransitionPresentationComponentProps<{ rise: number }>
> = ({ children, presentationProgress, presentationDirection, passedProps }) => {
  const { rise } = passedProps;
  const entering = presentationDirection === "entering";
  const p = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: entering ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
  });
  const style: React.CSSProperties = entering
    ? {
        opacity: p,
        transform: `translateY(${(1 - p) * rise}px) scale(${0.9 + p * 0.1})`,
        filter: p < 1 ? `blur(${(1 - p) * 16}px)` : undefined,
      }
    : {
        opacity: 1 - p,
        transform: `translateY(${-p * rise}px) scale(${1 + p * 0.14})`,
        filter: p > 0 ? `blur(${p * 16}px)` : undefined,
      };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
const zoomBlur = (rise = 0): TransitionPresentation<{ rise: number }> => ({
  component: ZoomBlur,
  props: { rise },
});

// ===========================================================================
// Composition root.
// ===========================================================================
export const SkillChangelogDemo: React.FC = () => {
  return (
    <RemocnUIProvider>
      <AbsoluteFill
        style={
          {
            "--font-geist-sans": SANS_FAMILY,
            "--font-geist-mono": MONO_FAMILY,
            background: BG,
          } as React.CSSProperties
        }
      >
        {/* Static, low-opacity grid — the list/tree is the focus, not the bg. */}
        <DynamicGrid
          cellSize={44}
          lineColor="rgba(255,255,255,0.035)"
          background={BG}
          speed={0}
        />
        {/* Gentle neutral vignette for depth (not a colored glow). */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(120% 120% at 50% 42%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        <TransitionSeries>
          {/* 1 — Positioning */}
          <TransitionSeries.Sequence durationInFrames={S_OPEN}>
            <OpenScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 2 — Problem: one file */}
          <TransitionSeries.Sequence durationInFrames={S_BEFORE}>
            <BeforeScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_ZOOM })}
            presentation={zoomBlur(44)}
          />

          {/* 3 — Hero: the structure */}
          <TransitionSeries.Sequence durationInFrames={S_TREE}>
            <TreeScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 4 — Change list */}
          <TransitionSeries.Sequence durationInFrames={S_CHANGES}>
            <ChangesScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 5 — Proof */}
          <TransitionSeries.Sequence durationInFrames={S_STATS}>
            <StatsScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_OUT })}
            presentation={zoomBlur(60)}
          />

          {/* 6 — CTA */}
          <TransitionSeries.Sequence durationInFrames={S_OUTRO}>
            <OutroScene />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>
    </RemocnUIProvider>
  );
};
