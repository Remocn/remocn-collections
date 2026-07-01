import React, { type CSSProperties, type ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
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
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
import { CheckIcon, CopyIcon } from "lucide-react";

import { RemocnUIProvider } from "@/lib/remocn-ui";
import { BlurIn } from "@/components/remocn/blur-in";
import { useBlurInTransition } from "@/components/remocn/use-blur-in-transition";
import { StrikethroughReplace } from "@/components/remocn/strikethrough-replace";

// ---------------------------------------------------------------------------
// Fonts — the Tegami brand: a bold geometric sans (Manrope) for the wordmark
// and headlines, a handwritten script (Caveat) for the margin notes / "record
// your changes!" annotations, and GeistMono for code. Bound to the CSS vars
// the remocn text components read.
// ---------------------------------------------------------------------------
const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700", "800"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "700"],
});
const { fontFamily: HAND_FAMILY } = loadHand("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700"],
});

const SANS = "var(--font-geist-sans), -apple-system, sans-serif";
const MONO = "var(--font-geist-mono), ui-monospace, monospace";
const HAND = "var(--font-hand), cursive";

// Monochrome ink-on-paper palette. Pure black ink on warm white paper — the
// brand uses no color accent at all, and neither do we.
const PAPER = "#FFFFFF";
const INK = "#161616";
const FAINT = "rgba(22,22,22,0.52)";
const HAIR = "rgba(22,22,22,0.16)";
const DOT = "#EEEEEE";

const BANNER = staticFile("tegami-banner.png");
const LOGO = staticFile("tegami-logo.png");

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap and are subtracted.
// ---------------------------------------------------------------------------
const S_AVALANCHE = 150; // hook — release chores pile up
const S_BREAKS = 120; //    the old fixes fail
const S_MEET = 110; //      Meet Tegami (banner reveal)
const S_SCRIPT = 150; //    a script you own (paper code)
const S_NOTE = 165; //      write the change like a note
const S_VERSION = 150; //   version & lock
const S_SHIP = 175; //      merge -> ship
const S_REGISTRY = 130; //  not just npm (constellation)
const S_STACK = 150; //     retry-safe / plugins / programmable
const S_AGENT = 120; //     agent writes the changelog
const S_MIGRATE = 110; //   coming from Changesets
const S_CTA = 130; //       record your changes

const T_X = 14; //   crossfade (same visual world)
const T_Z1 = 18; //  problem -> solution (zoom-through)
const T_Z2 = 16; //  intro -> demo
const T_P = 14; //   push-slide between demo steps
const T_Z3 = 16; //  demo -> benefits
const T_Z4 = 18; //  -> CTA

export const TEGAMI_DURATION =
  S_AVALANCHE +
  S_BREAKS +
  S_MEET +
  S_SCRIPT +
  S_NOTE +
  S_VERSION +
  S_SHIP +
  S_REGISTRY +
  S_STACK +
  S_AGENT +
  S_MIGRATE +
  S_CTA -
  (T_X + T_Z1 + T_Z2 + T_X + T_P + T_P + T_Z3 + T_X + T_X + T_X + T_Z4);

// ===========================================================================
// Shared primitives
// ===========================================================================

// Blur-in reveal, driven by the remocn-ui timeline hook.
const Reveal: React.FC<{
  children: ReactNode;
  delay?: number;
  distance?: number;
  blur?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  display?: CSSProperties["display"];
}> = ({
  children,
  delay = 0,
  distance = 16,
  blur = 10,
  duration = 20,
  direction = "up",
  display = "block",
}) => {
  const style = useBlurInTransition(
    [{ at: delay, state: "revealed", duration }],
    { direction, distance, blur },
  );
  return (
    <BlurIn style={style} display={display}>
      {children}
    </BlurIn>
  );
};

// Handwritten annotation (Caveat) — the brand's margin-note voice.
const Hand: React.FC<{
  children: ReactNode;
  size?: number;
  color?: string;
  style?: CSSProperties;
}> = ({ children, size = 34, color = INK, style }) => (
  <span
    style={{
      fontFamily: HAND,
      fontSize: size,
      fontWeight: 600,
      color,
      lineHeight: 1.1,
      display: "inline-block",
      ...style,
    }}
  >
    {children}
  </span>
);

// Inline, normal-flow typewriter (mono, left-aligned) — deterministic char
// reveal with a blinking block caret. Replaces the scene-centered Typewriter
// component so it can sit inside a card / prompt line.
const MonoType: React.FC<{
  text: string;
  delay?: number;
  cps?: number;
  fontSize?: number;
  color?: string;
  weight?: number;
}> = ({ text, delay = 0, cps = 16, fontSize = 20, color = INK, weight = 500 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = Math.floor(
    interpolate(frame, [delay, delay + (text.length / cps) * fps], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const shown = text.slice(0, Math.max(0, chars));
  const done = chars >= text.length;
  const blinkOn = Math.floor((frame / fps) * 2) % 2 === 0;
  const caretVisible = frame >= delay && (!done || blinkOn);
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize,
        fontWeight: weight,
        color,
        whiteSpace: "pre",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {shown}
      <span
        style={{
          display: "inline-block",
          width: fontSize * 0.5,
          height: fontSize,
          background: color,
          marginLeft: 2,
          opacity: caretVisible ? 1 : 0,
          transform: "translateY(1px)",
        }}
      />
    </span>
  );
};

const Heading: React.FC<{
  children: ReactNode;
  size?: number;
  weight?: number;
  style?: CSSProperties;
}> = ({ children, size = 44, weight = 700, style }) => (
  <h2
    style={{
      margin: 0,
      fontFamily: SANS,
      fontWeight: weight,
      fontSize: size,
      letterSpacing: "-0.02em",
      color: INK,
      textAlign: "center",
      lineHeight: 1.12,
      ...style,
    }}
  >
    {children}
  </h2>
);

// Stroke-draw hook — pairs with pathLength={1} strokeDasharray={1}.
const useDrawOffset = (delay: number, dur: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
};

// A single inked path that draws itself on.
const Stroke: React.FC<{
  d: string;
  delay?: number;
  dur?: number;
  width?: number;
  color?: string;
}> = ({ d, delay = 0, dur = 24, width = 2.5, color = INK }) => {
  const off = useDrawOffset(delay, dur);
  return (
    <path
      d={d}
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={off}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
};

// A marker swipe that draws left-to-right — the brand's brush stroke.
const BrushUnderline: React.FC<{
  width?: number;
  delay?: number;
  dur?: number;
  thickness?: number;
}> = ({ width = 320, delay = 6, dur = 18, thickness = 9 }) => {
  const off = useDrawOffset(delay, dur);
  // A slightly wavy stroke so it reads as a hand swipe, not a ruler line.
  const d = `M6 ${thickness + 6} C ${width * 0.28} ${thickness - 2}, ${
    width * 0.6
  } ${thickness + 11}, ${width - 6} ${thickness + 2}`;
  return (
    <svg width={width} height={thickness + 18} style={{ display: "block" }}>
      <path
        d={d}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={off}
        fill="none"
        stroke={INK}
        strokeWidth={thickness}
        strokeLinecap="round"
      />
    </svg>
  );
};

// Empty sketch checkbox that ticks at `checkAt`.
const SketchCheck: React.FC<{
  size?: number;
  checkAt?: number | null;
}> = ({ size = 26, checkAt = null }) => {
  const boxOff = useDrawOffset(0, 12);
  const tickOff = useDrawOffset(checkAt ?? 1e9, 9);
  return (
    <svg width={size} height={size} viewBox="0 0 26 26">
      <path
        d="M4 5 Q3 4 5 4 L21 3.5 Q23 4 22.5 6 L22 21 Q22 23 20 22.5 L5 23 Q3 22.5 3.5 20 Z"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={boxOff}
        fill="none"
        stroke={INK}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {checkAt !== null && (
        <path
          d="M7 13 L11.5 18 L20 7"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={tickOff}
          fill="none"
          stroke={INK}
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};

// A paper card with a hand-inked border and a small tilt.
const PaperCard: React.FC<{
  children: ReactNode;
  width?: number | string;
  tilt?: number;
  padding?: number | string;
  style?: CSSProperties;
}> = ({ children, width = 360, tilt = 0, padding = "26px 28px", style }) => (
  <div
    style={{
      width,
      padding,
      background: PAPER,
      border: `2px solid ${INK}`,
      borderRadius: 16,
      transform: `rotate(${tilt}deg)`,
      boxShadow: `5px 6px 0 ${INK}`,
      ...style,
    }}
  >
    {children}
  </div>
);

// A light, ink-on-paper code card with line-by-line reveal.
const PaperCode: React.FC<{
  title: string;
  code: string;
  width?: number;
  fontSize?: number;
  startDelay?: number;
  stagger?: number;
  tilt?: number;
}> = ({
  title,
  code,
  width = 560,
  fontSize = 18,
  startDelay = 0,
  stagger = 6,
  tilt = -1,
}) => {
  const lines = code.split("\n");
  return (
    <div
      style={{
        width,
        background: PAPER,
        border: `2px solid ${INK}`,
        borderRadius: 14,
        overflow: "hidden",
        transform: `rotate(${tilt}deg)`,
        boxShadow: `6px 7px 0 ${INK}`,
        fontFamily: MONO,
      }}
    >
      <div
        style={{
          height: 38,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 16px",
          borderBottom: `2px solid ${INK}`,
        }}
      >
        <Dot /> <Dot /> <Dot />
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontFamily: MONO,
            fontSize: 14,
            color: FAINT,
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          fontSize,
          lineHeight: 1.6,
        }}
      >
        {lines.map((line, i) => (
          <PaperCodeLine
            key={i}
            line={line}
            delay={startDelay + i * stagger}
            fontSize={fontSize}
          />
        ))}
      </div>
    </div>
  );
};

const Dot: React.FC = () => (
  <span
    style={{
      width: 10,
      height: 10,
      borderRadius: "50%",
      border: `2px solid ${INK}`,
      display: "inline-block",
    }}
  />
);

const PaperCodeLine: React.FC<{
  line: string;
  delay: number;
  fontSize: number;
}> = ({ line, delay, fontSize }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ty = interpolate(frame, [delay, delay + 8], [4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isComment = line.trimStart().startsWith("//");
  if (line.trim() === "") return <div style={{ height: fontSize * 0.7 }} />;
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${ty}px)`,
        whiteSpace: "pre",
        color: isComment ? FAINT : INK,
      }}
    >
      {line}
    </div>
  );
};

// ===========================================================================
// Scene 1 — Release-day avalanche. Chore cards pile in from every edge.
// ===========================================================================
const CHORES: { label: string; x: number; y: number; tilt: number; d: number }[] =
  [
    { label: "Bump the versions", x: 150, y: 120, tilt: -6, d: 6 },
    { label: "Fix dependency ranges", x: 760, y: 96, tilt: 5, d: 22 },
    { label: "Write the changelog", x: 96, y: 420, tilt: 4, d: 38 },
    { label: "Cut the release", x: 800, y: 430, tilt: -5, d: 54 },
    { label: "Post the announcement", x: 430, y: 540, tilt: 2, d: 70 },
  ];

const ChoreCard: React.FC<{
  label: string;
  x: number;
  y: number;
  tilt: number;
  delay: number;
}> = ({ label, x, y, tilt, delay }) => (
  <div style={{ position: "absolute", left: x, top: y }}>
    <Reveal delay={delay} distance={26} blur={11} duration={16}>
      <div
        style={{
          transform: `rotate(${tilt}deg)`,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "16px 22px",
          background: PAPER,
          border: `2px solid ${INK}`,
          borderRadius: 13,
          boxShadow: `4px 5px 0 ${INK}`,
        }}
      >
        <SketchCheck size={24} />
        <span
          style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, color: INK }}
        >
          {label}
        </span>
      </div>
    </Reveal>
  </div>
);

const AvalancheScene: React.FC = () => (
  <AbsoluteFill>
    {CHORES.map((c) => (
      <ChoreCard key={c.label} {...c} delay={c.d} />
    ))}
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", marginTop: 14 }}>
        <Reveal delay={88} distance={14} blur={9}>
          <Hand size={68} style={{ fontWeight: 700 }}>
            every single time you ship
          </Hand>
        </Reveal>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <BrushUnderline width={420} delay={100} dur={16} thickness={8} />
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 2 — The old fixes break.
// ===========================================================================
const BreaksScene: React.FC = () => {
  // Decorations are anchored to the emphasized word (an inline-block span) and
  // scale to its width via preserveAspectRatio="none"; non-scaling-stroke keeps
  // the ink weight constant, so the crack/box always line up with the text.
  const crackOff = useDrawOffset(26, 16);
  const boxOff = useDrawOffset(64, 22);
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 56,
      }}
    >
      <Reveal delay={4} distance={18} blur={10}>
        <Heading size={46} weight={600}>
          So you write a release script —{" "}
          <span
            style={{
              position: "relative",
              display: "inline-block",
              fontWeight: 800,
            }}
          >
            it breaks.
            <svg
              viewBox="0 0 200 14"
              preserveAspectRatio="none"
              width="100%"
              height={13}
              style={{
                position: "absolute",
                left: 0,
                bottom: -17,
                display: "block",
                overflow: "visible",
              }}
            >
              <path
                d="M4 7 L42 12 L80 3 L118 12 L156 3 L196 8"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={crackOff}
                fill="none"
                stroke={INK}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </span>
        </Heading>
      </Reveal>
      <Reveal delay={44} distance={18} blur={10}>
        <Heading size={46} weight={600}>
          Or you reach for Changesets —{" "}
          <span
            style={{
              position: "relative",
              display: "inline-block",
              fontWeight: 800,
            }}
          >
            and hit its walls.
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{
                position: "absolute",
                left: -16,
                top: -11,
                width: "calc(100% + 32px)",
                height: "calc(100% + 22px)",
                display: "block",
                overflow: "visible",
              }}
            >
              <path
                d="M4 8 L96 5 L97 93 L3 95 Z"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={boxOff}
                fill="none"
                stroke={INK}
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </span>
        </Heading>
      </Reveal>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 3 — Meet Tegami. The official brand lockup reveals on paper.
// ===========================================================================
const MeetScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 26], [0.94, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const opacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blur = interpolate(frame, [0, 20], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
        }}
      >
        <div
          style={{
            opacity,
            filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
            transform: `scale(${scale})`,
          }}
        >
          <Img src={BANNER} style={{ width: 800, height: "auto", display: "block" }} />
        </div>
        <Reveal delay={40} distance={12} blur={8}>
          <Heading size={34} weight={600}>
            Releasing, as simple as writing a note.
          </Heading>
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 4 — A script you own.
// ===========================================================================
const SCRIPT_CODE = `import { tegami } from "tegami";
import { runCli } from "tegami/cli";
import { github } from "tegami/plugins/github";

const paper = tegami({
  plugins: [github({ repo: "acme/ui" })],
});

await runCli(paper);`;

const ScriptScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 30,
    }}
  >
    <Reveal delay={2} distance={16} blur={10}>
      <Heading size={42}>
        Not a CLI you fight.{" "}
        <span style={{ color: FAINT }}>A script you own.</span>
      </Heading>
    </Reveal>
    <div style={{ position: "relative" }}>
      <Reveal delay={12} distance={34} blur={14} duration={22}>
        <PaperCode
          title="scripts/tegami.mts"
          code={SCRIPT_CODE}
          width={620}
          fontSize={18}
          startDelay={20}
          stagger={6}
          tilt={-1}
        />
      </Reveal>
      <div
        style={{
          position: "absolute",
          right: -240,
          top: 118,
          width: 220,
          textAlign: "left",
        }}
      >
        <Reveal delay={86} distance={10} blur={6} direction="left">
          <Hand size={34} color={INK} style={{ display: "block" }}>
            yours — read it,
            <br />
            change it.
          </Hand>
        </Reveal>
        {/* arrow curves left from the note and points back into the card */}
        <svg
          width={110}
          height={70}
          viewBox="0 0 110 70"
          style={{ position: "absolute", left: -84, top: 34, overflow: "visible" }}
        >
          <Stroke
            d="M104 50 C 64 56, 30 46, 8 22 M8 22 L31 23 M8 22 L19 41"
            delay={98}
            dur={15}
            width={2.6}
          />
        </svg>
      </div>
    </div>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 5 — Write the change like a note.
// ===========================================================================
const NoteScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 26,
    }}
  >
    <Reveal delay={2} distance={16} blur={10}>
      <Heading size={42}>Describe the change like a note.</Heading>
    </Reveal>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 46,
        position: "relative",
      }}
    >
      <Reveal delay={14} distance={20} blur={10}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 20,
              color: INK,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ color: FAINT }}>$</span>
            <MonoType text="tegami" delay={8} cps={9} fontSize={20} />
          </div>
          <Hand size={30} color={FAINT}>
            ...drops into <span style={{ color: INK }}>.tegami/</span>
          </Hand>
        </div>
      </Reveal>

      <Reveal delay={40} distance={30} blur={12} duration={20}>
        <PaperCard width={460} tilt={1.5} padding="24px 30px">
          <div
            style={{
              fontFamily: MONO,
              fontSize: 17,
              color: FAINT,
              lineHeight: 1.7,
            }}
          >
            <div>---</div>
            <div>
              packages:
            </div>
            <div style={{ color: INK }}>
              {"  "}&quot;@acme/ui&quot;: minor
            </div>
            <div>---</div>
          </div>
          <div
            style={{
              marginTop: 14,
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 26,
              color: INK,
            }}
          >
            ## Fix button hover state
          </div>
          <div
            style={{
              marginTop: 6,
              fontFamily: SANS,
              fontSize: 18,
              color: FAINT,
            }}
          >
            The hover color now matches the design system.
          </div>
        </PaperCard>
      </Reveal>

      <div style={{ position: "absolute", right: -256, bottom: -56 }}>
        <Reveal delay={96} distance={10} blur={6}>
          <Hand size={36} style={{ transform: "rotate(-7deg)" }}>
            record your changes!
          </Hand>
        </Reveal>
      </div>
    </div>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 6 — Version & lock.
// ===========================================================================
const BumpRow: React.FC<{
  pkg: string;
  from: string;
  to: string;
  delay: number;
}> = ({ pkg, from, to, delay }) => {
  const arrowOff = useDrawOffset(delay + 8, 10);
  return (
    <Reveal delay={delay} distance={16} blur={9}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontFamily: MONO,
          fontSize: 22,
        }}
      >
        <span style={{ color: INK, width: 168 }}>{pkg}</span>
        <span style={{ color: FAINT }}>{from}</span>
        <svg width={40} height={20}>
          <path
            d="M4 10 L30 10 M30 10 L23 5 M30 10 L23 15"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={arrowOff}
            fill="none"
            stroke={INK}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span style={{ color: INK, fontWeight: 700 }}>{to}</span>
      </div>
    </Reveal>
  );
};

const VersionScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 30,
    }}
  >
    <Reveal delay={2} distance={16} blur={10}>
      <Heading size={42}>
        Compute every bump.{" "}
        <span style={{ fontWeight: 800 }}>Lock the release.</span>
      </Heading>
    </Reveal>

    <div
      style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 6 }}
    >
      <BumpRow pkg="@acme/ui" from="1.4.0" to="1.5.0" delay={20} />
      <BumpRow pkg="@acme/utils" from="2.1.3" to="2.1.4" delay={34} />
      <BumpRow pkg="@acme/core" from="0.9.0" to="0.9.1" delay={48} />
    </div>

    <Reveal delay={78} distance={26} blur={12}>
      <div
        style={{
          marginTop: 8,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 22px",
          background: PAPER,
          border: `2px solid ${INK}`,
          borderRadius: 12,
          boxShadow: `4px 5px 0 ${INK}`,
          fontFamily: MONO,
          fontSize: 20,
          color: INK,
        }}
      >
        <svg width={26} height={26} viewBox="0 0 26 26">
          <Stroke
            d="M7 12 L7 8 Q7 3 13 3 Q19 3 19 8 L19 12"
            delay={86}
            dur={10}
            width={2.4}
          />
          <Stroke
            d="M5 12 L21 12 L21 23 L5 23 Z"
            delay={90}
            dur={10}
            width={2.4}
          />
        </svg>
        .tegami/publish-lock.yaml
      </div>
    </Reveal>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 7 — Merge, and it ships.
// ===========================================================================
const ShipScene: React.FC = () => {
  const mergeTickOff = useDrawOffset(70, 12);
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 26,
      }}
    >
      <Reveal delay={2} distance={16} blur={10}>
        <Heading size={42}>Merge once — it ships itself.</Heading>
      </Reveal>

      <Reveal delay={14} distance={28} blur={12} duration={20}>
        <PaperCard width={560} tilt={-1} padding="22px 26px">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: SANS,
            }}
          >
            <SketchCheck size={26} checkAt={62} />
            <span style={{ fontWeight: 700, fontSize: 24, color: INK }}>
              Version Packages
            </span>
            <span style={{ fontFamily: MONO, fontSize: 18, color: FAINT }}>
              #42
            </span>
            <span style={{ flex: 1 }} />
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 17,
                color: PAPER,
                background: INK,
                padding: "6px 16px",
                borderRadius: 8,
              }}
            >
              Merge
              <svg width={18} height={18} viewBox="0 0 24 24">
                <path
                  d="M4 13 L10 19 L21 5"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={mergeTickOff}
                  fill="none"
                  stroke={PAPER}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </PaperCard>
      </Reveal>

      <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
        <Reveal delay={96} distance={18} blur={9}>
          <ShipTag label="3 packages published" />
        </Reveal>
        <Reveal delay={110} distance={18} blur={9}>
          <ShipTag label="GitHub releases created" />
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};

const ShipTag: React.FC<{ label: string }> = ({ label }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 18px",
      border: `2px solid ${INK}`,
      borderRadius: 999,
      background: PAPER,
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 19,
      color: INK,
    }}
  >
    <svg width={20} height={20} viewBox="0 0 24 24">
      <path
        d="M4 13 L10 19 L21 5"
        fill="none"
        stroke={INK}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    {label}
  </div>
);

// ===========================================================================
// Scene 8 — Not just npm (constellation).
// ===========================================================================
const REGISTRIES: { label: string; x: number; y: number; delay: number }[] = [
  { label: "npm", x: -300, y: -120, delay: 30 },
  { label: "Cargo", x: 300, y: -120, delay: 42 },
  { label: "PyPI", x: -300, y: 120, delay: 54 },
  { label: "+ more", x: 300, y: 120, delay: 66 },
];

const RegistryScene: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <div style={{ position: "absolute", top: 70 }}>
      <Reveal delay={2} distance={16} blur={10}>
        <Heading size={42}>One pipeline. Every registry.</Heading>
      </Reveal>
    </div>

    <div style={{ position: "relative", width: 1, height: 1 }}>
      {/* connector lines drawing outward from the hub */}
      <svg
        width={760}
        height={420}
        viewBox="-380 -210 760 420"
        style={{
          position: "absolute",
          left: -380,
          top: -210,
          overflow: "visible",
        }}
      >
        {REGISTRIES.map((r) => (
          <Stroke
            key={r.label}
            d={`M0 0 L ${r.x * 0.78} ${r.y * 0.74}`}
            delay={r.delay - 8}
            dur={12}
            width={2.2}
            color={HAIR}
          />
        ))}
      </svg>

      {/* hub */}
      <div
        style={{
          position: "absolute",
          left: -64,
          top: -64,
          width: 128,
          height: 128,
        }}
      >
        <Reveal delay={8} distance={0} blur={10} duration={16}>
          <div
            style={{
              width: 128,
              height: 128,
              borderRadius: "50%",
              border: `2px solid ${INK}`,
              background: PAPER,
              boxShadow: `5px 6px 0 ${INK}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Img src={LOGO} style={{ width: 78, height: 78 }} />
          </div>
        </Reveal>
      </div>

      {/* registry nodes */}
      {REGISTRIES.map((r) => (
        <div
          key={r.label}
          style={{
            position: "absolute",
            left: r.x - 70,
            top: r.y - 30,
            width: 140,
          }}
        >
          <Reveal delay={r.delay} distance={18} blur={9}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 60,
                border: `2px solid ${INK}`,
                borderRadius: 12,
                background: PAPER,
                boxShadow: `3px 4px 0 ${INK}`,
                fontFamily: MONO,
                fontWeight: 500,
                fontSize: 24,
                color: INK,
              }}
            >
              {r.label}
            </div>
          </Reveal>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 9 — Retry-safe / plugins / programmable.
// ===========================================================================
const StackCard: React.FC<{
  title: string;
  body: ReactNode;
  delay: number;
  tilt: number;
}> = ({ title, body, delay, tilt }) => (
  <Reveal delay={delay} distance={30} blur={12} duration={20}>
    <PaperCard width={320} tilt={tilt} padding="26px 26px">
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 27,
          color: INK,
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      <div style={{ fontFamily: SANS, fontSize: 19, color: FAINT, lineHeight: 1.45 }}>
        {body}
      </div>
    </PaperCard>
  </Reveal>
);

const StackScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 34,
    }}
  >
    <Reveal delay={2} distance={16} blur={10}>
      <Heading size={42}>Safe. Pluggable. Programmable.</Heading>
    </Reveal>
    <div style={{ display: "flex", gap: 30, alignItems: "flex-start" }}>
      <StackCard
        delay={14}
        tilt={-1.5}
        title="Retry-safe"
        body={
          <>
            The publish lock lives in git — a failed publish is just a{" "}
            <span style={{ color: INK, fontWeight: 700 }}>retry</span>.
          </>
        }
      />
      <StackCard
        delay={24}
        tilt={1}
        title="Plugins"
        body={
          <span style={{ fontFamily: MONO, fontSize: 18, color: INK }}>
            github · npm · cargo · git · gitlab
          </span>
        }
      />
      <StackCard
        delay={34}
        tilt={-0.5}
        title="Programmable"
        body={
          <span style={{ fontFamily: MONO, fontSize: 17, color: INK }}>
            willPublish() · draft() · publish()
          </span>
        }
      />
    </div>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 10 — Let the agent write it.
// ===========================================================================
const RobotDoodle: React.FC<{ delay: number }> = ({ delay }) => (
  <svg width={108} height={120} viewBox="0 0 108 120">
    {/* antenna */}
    <Stroke d="M54 8 L54 22" delay={delay} dur={6} width={2.4} />
    <circle
      cx={54}
      cy={6}
      r={4}
      fill="none"
      stroke={INK}
      strokeWidth={2.4}
    />
    {/* head */}
    <Stroke
      d="M24 24 L84 24 L84 70 L24 70 Z"
      delay={delay + 4}
      dur={14}
      width={2.6}
    />
    {/* eyes */}
    <Stroke d="M40 44 L40 52" delay={delay + 16} dur={5} width={3} />
    <Stroke d="M68 44 L68 52" delay={delay + 18} dur={5} width={3} />
    {/* mouth */}
    <Stroke d="M42 60 Q54 66 66 60" delay={delay + 20} dur={6} width={2.4} />
    {/* body + arm holding the brush */}
    <Stroke
      d="M34 70 L34 104 L74 104 L74 70"
      delay={delay + 22}
      dur={12}
      width={2.6}
    />
    <Stroke d="M74 86 L98 96" delay={delay + 28} dur={8} width={2.6} />
  </svg>
);

const AgentScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 26,
    }}
  >
    <Reveal delay={2} distance={14} blur={9}>
      <div style={{ fontFamily: MONO, fontSize: 22, color: INK }}>
        <span style={{ color: FAINT }}>$ </span>tegami init-agent
      </div>
    </Reveal>

    <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
      <Reveal delay={16} distance={18} blur={10}>
        <RobotDoodle delay={20} />
      </Reveal>

      <Reveal delay={28} distance={26} blur={12} duration={18}>
        <PaperCard width={520} tilt={1} padding="24px 30px">
          <MonoType
            text="## Fix flaky upload retry"
            delay={36}
            cps={15}
            fontSize={20}
            weight={600}
          />
          <div style={{ marginTop: 14 }}>
            <Hand size={30} color={FAINT}>
              ...your agent writes the changelog.
            </Hand>
          </div>
        </PaperCard>
      </Reveal>
    </div>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 11 — Coming from Changesets?
// ===========================================================================
const MigrateScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 30,
    }}
  >
    <Reveal delay={2} distance={14} blur={9}>
      <Hand size={56}>Already on Changesets?</Hand>
    </Reveal>

    <Reveal delay={18} distance={20} blur={11}>
      <div style={{ position: "relative", width: 620, height: 92 }}>
        <StrikethroughReplace
          from=".changeset/"
          to=".tegami/"
          lineColor={INK}
          color={INK}
          fontSize={56}
          fontWeight={700}
        />
      </div>
    </Reveal>

    <Reveal delay={40} distance={14} blur={9}>
      <Heading size={32} weight={600}>
        Same flow. <span style={{ color: FAINT }}>Migrate in an afternoon.</span>
      </Heading>
    </Reveal>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 12 — CTA: record your changes.
// ===========================================================================
const InstallPill: React.FC<{ delay: number; copyAt: number }> = ({
  delay,
  copyAt,
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [delay, delay + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const copied = frame >= copyAt;
  const pop = interpolate(frame - copyAt, [0, 8], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 13,
        height: 54,
        padding: "0 22px",
        borderRadius: 999,
        border: `2px solid ${INK}`,
        background: PAPER,
        boxShadow: `4px 5px 0 ${INK}`,
        fontFamily: MONO,
        fontSize: 20,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 12}px)`,
      }}
    >
      <span style={{ color: FAINT }}>$</span>
      <span style={{ color: INK }}>npm install tegami -D</span>
      <span
        style={{
          display: "inline-flex",
          marginLeft: 3,
          color: INK,
          transform: copied ? `scale(${pop})` : "scale(1)",
        }}
      >
        {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
      </span>
    </div>
  );
};

const CtaScene: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Reveal delay={2} distance={10} blur={8} duration={14}>
        <Img src={LOGO} style={{ width: 104, height: 104 }} />
      </Reveal>
      <Reveal delay={10} distance={14} blur={10}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 86,
            letterSpacing: "-0.03em",
            color: INK,
            marginTop: 6,
          }}
        >
          Tegami
        </div>
      </Reveal>
      <div style={{ marginTop: -2, marginBottom: 24 }}>
        <BrushUnderline width={300} delay={26} dur={16} thickness={9} />
      </div>
      <Reveal delay={34} distance={12} blur={8}>
        <InstallPill delay={34} copyAt={64} />
      </Reveal>
      <Reveal delay={50} distance={10} blur={6}>
        <div
          style={{
            marginTop: 18,
            fontFamily: SANS,
            fontSize: 22,
            color: FAINT,
          }}
        >
          tegami.fuma-nama.dev
        </div>
      </Reveal>
      <div style={{ position: "absolute", bottom: 70, right: 150 }}>
        <Reveal delay={70} distance={10} blur={6}>
          <Hand size={40} style={{ transform: "rotate(-6deg)" }}>
            record your changes!
          </Hand>
        </Reveal>
      </div>
    </div>
  </AbsoluteFill>
);

// ===========================================================================
// Transition presentations (ink-on-white — backgrounds never clash).
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
        transform: `translateY(${(1 - p) * rise}px) scale(${0.86 + p * 0.14})`,
        filter: p < 1 ? `blur(${(1 - p) * 16}px)` : undefined,
      }
    : {
        opacity: 1 - p,
        transform: `translateY(${-p * rise}px) scale(${1 + p * 0.18})`,
        filter: p > 0 ? `blur(${p * 16}px)` : undefined,
      };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
const zoomBlur = (rise = 0): TransitionPresentation<{ rise: number }> => ({
  component: ZoomBlur,
  props: { rise },
});

const PushSlide: React.FC<
  TransitionPresentationComponentProps<{ dist: number }>
> = ({ children, presentationProgress, presentationDirection, passedProps }) => {
  const { dist } = passedProps;
  const entering = presentationDirection === "entering";
  const p = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
  });
  const x = entering ? (1 - p) * dist : -p * dist;
  const opacity = entering ? p : 1 - p;
  return (
    <AbsoluteFill style={{ transform: `translateX(${x}px)`, opacity }}>
      {children}
    </AbsoluteFill>
  );
};
const pushSlide = (dist = 70): TransitionPresentation<{ dist: number }> => ({
  component: PushSlide,
  props: { dist },
});

// ===========================================================================
// Persistent paper background — warm white with a very faint notebook dot grid.
// ===========================================================================
const PaperBg: React.FC = () => (
  <AbsoluteFill style={{ background: PAPER }}>
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${DOT} 1.4px, transparent 1.4px)`,
        backgroundSize: "30px 30px",
        opacity: 0.7,
      }}
    />
  </AbsoluteFill>
);

// ===========================================================================
// Composition root.
// ===========================================================================
export const TegamiDemo: React.FC = () => {
  return (
    <RemocnUIProvider>
      <AbsoluteFill
        style={
          {
            "--font-geist-sans": SANS_FAMILY,
            "--font-geist-mono": MONO_FAMILY,
            "--font-hand": HAND_FAMILY,
          } as React.CSSProperties
        }
      >
        <PaperBg />

        <TransitionSeries>
          {/* 1 — Release-day avalanche */}
          <TransitionSeries.Sequence durationInFrames={S_AVALANCHE}>
            <AvalancheScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 2 — The old fixes break */}
          <TransitionSeries.Sequence durationInFrames={S_BREAKS}>
            <BreaksScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_Z1 })}
            presentation={zoomBlur(46)}
          />

          {/* 3 — Meet Tegami */}
          <TransitionSeries.Sequence durationInFrames={S_MEET}>
            <MeetScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_Z2 })}
            presentation={zoomBlur(40)}
          />

          {/* 4 — A script you own */}
          <TransitionSeries.Sequence durationInFrames={S_SCRIPT}>
            <ScriptScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 5 — Write the note */}
          <TransitionSeries.Sequence durationInFrames={S_NOTE}>
            <NoteScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_P })}
            presentation={pushSlide(80)}
          />

          {/* 6 — Version & lock */}
          <TransitionSeries.Sequence durationInFrames={S_VERSION}>
            <VersionScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_P })}
            presentation={pushSlide(80)}
          />

          {/* 7 — Merge & ship */}
          <TransitionSeries.Sequence durationInFrames={S_SHIP}>
            <ShipScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_Z3 })}
            presentation={zoomBlur(46)}
          />

          {/* 8 — Not just npm */}
          <TransitionSeries.Sequence durationInFrames={S_REGISTRY}>
            <RegistryScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 9 — Safe / pluggable / programmable */}
          <TransitionSeries.Sequence durationInFrames={S_STACK}>
            <StackScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 10 — Agent writes it */}
          <TransitionSeries.Sequence durationInFrames={S_AGENT}>
            <AgentScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 11 — Coming from Changesets */}
          <TransitionSeries.Sequence durationInFrames={S_MIGRATE}>
            <MigrateScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_Z4 })}
            presentation={zoomBlur(56)}
          />

          {/* 12 — CTA */}
          <TransitionSeries.Sequence durationInFrames={S_CTA}>
            <CtaScene />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>
    </RemocnUIProvider>
  );
};
