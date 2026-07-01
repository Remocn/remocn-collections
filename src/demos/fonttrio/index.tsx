import React, { type CSSProperties, type ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Series,
  interpolate,
  interpolateColors,
  spring,
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
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSourceSerif } from "@remotion/google-fonts/SourceSerif4";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadAbril } from "@remotion/google-fonts/AbrilFatface";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadUrbanist } from "@remotion/google-fonts/Urbanist";

import { RemocnUIProvider } from "@/lib/remocn-ui";
import { Backdrop } from "@/components/remocn/backdrop";
import { GlassCodeBlock } from "@/components/remocn/glass-code-block";
import { SharedAxisZ } from "@/components/remocn/shared-axis-z";
import { RollingNumber } from "@/components/remocn/rolling-number";
import { TerminalCursorZoom } from "@/components/remocn/terminal-cursor-zoom";
import { useBlurInTransition } from "@/components/remocn/use-blur-in-transition";
import { BlurIn } from "@/components/remocn/blur-in";
import { CheckIcon, CopyIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Fonts. The whole point of a type product is to show the real typefaces — so
// every specimen here renders in its actual family, not a stand-in.
// ---------------------------------------------------------------------------
const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700"],
});
const { fontFamily: PLAYFAIR_FAMILY } = loadPlayfair("normal", {
  subsets: ["latin"],
  weights: ["500", "700", "800"],
});
const { fontFamily: SOURCE_SERIF_FAMILY } = loadSourceSerif("normal", {
  subsets: ["latin"],
  weights: ["400", "600"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});
const { fontFamily: ABRIL_FAMILY } = loadAbril("normal", {
  subsets: ["latin"],
  weights: ["400"],
});
const { fontFamily: BEBAS_FAMILY } = loadBebas("normal", {
  subsets: ["latin"],
  weights: ["400"],
});
const { fontFamily: URBANIST_FAMILY } = loadUrbanist("normal", {
  subsets: ["latin"],
  weights: ["600", "800"],
});

const SANS = `${SANS_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;
const MONO = `${MONO_FAMILY}, ui-monospace, SFMono-Regular, monospace`;
const PLAYFAIR = `${PLAYFAIR_FAMILY}, Georgia, serif`;
const SOURCE_SERIF = `${SOURCE_SERIF_FAMILY}, Georgia, serif`;
const ABRIL = `${ABRIL_FAMILY}, Georgia, serif`;
const BEBAS = `${BEBAS_FAMILY}, Impact, sans-serif`;
const URBANIST = `${URBANIST_FAMILY}, sans-serif`;

// Editorial palette — warm ink + a single restrained gold accent.
const GOLD = "#e0a23c";
const INK = "#fafafa";
const MUTED = "rgba(250,250,250,0.62)";
const FAINT = "rgba(250,250,250,0.4)";

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps), one per beat. Transitions overlap.
// ---------------------------------------------------------------------------
const S_INTRO = 140; //  three pain questions via shared-axis-z
const S_THREE = 48; //   "Three fonts." — the hook
const S_TRIO = 140; //   the editorial pairing — three real specimens
const S_INSTALL = 82; //  terminal-cursor-zoom install
const S_CODE = 132; //   generated CSS variables (GlassCodeBlock)
const S_COUNT = 88; //    78 curated pairings (rolling-number)
const S_WALL = 112; //   specimen wall across moods
const S_OUTRO = 112; //   wordmark + tagline + install pill

const T_ZOOM = 18; //  intro → three (punch in)
const T_X = 14; //      generic crossfade
const T_BLUR = 16; //   trio → install (background clash)
const T_OUT = 20; //    wall → outro

export const FONTTRIO_DURATION =
  S_INTRO +
  S_THREE +
  S_TRIO +
  S_INSTALL +
  S_CODE +
  S_COUNT +
  S_WALL +
  S_OUTRO -
  (T_ZOOM + T_X + T_BLUR + T_X + T_X + T_X + T_OUT);

// ---------------------------------------------------------------------------
// Reveal — blur-in wrapper driven by useBlurInTransition.
// ---------------------------------------------------------------------------
const Reveal: React.FC<{
  children: ReactNode;
  delay?: number;
  distance?: number;
  blur?: number;
  duration?: number;
  display?: CSSProperties["display"];
}> = ({
  children,
  delay = 0,
  distance = 16,
  blur = 10,
  duration = 20,
  display = "block",
}) => {
  const style = useBlurInTransition(
    [{ at: delay, state: "revealed", duration }],
    { direction: "up", distance, blur },
  );
  return (
    <BlurIn style={style} display={display}>
      {children}
    </BlurIn>
  );
};

// ---------------------------------------------------------------------------
// Mark — inline marker swipe behind a phrase.
// ---------------------------------------------------------------------------
const Mark: React.FC<{
  children: string;
  color?: string;
  startFrame?: number;
}> = ({ children, color = GOLD, startFrame = 8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scaleX = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 15, mass: 0.8 },
  });
  const textColor = interpolateColors(
    interpolate(scaleX, [0.45, 0.85], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    [0, 1],
    [INK, "#0a0a0a"],
  );
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: "-0.02em -0.12em",
          background: color,
          borderRadius: 6,
          transformOrigin: "left center",
          transform: `scaleX(${scaleX})`,
          zIndex: 0,
        }}
      />
      <span style={{ position: "relative", zIndex: 1, color: textColor }}>
        {children}
      </span>
    </span>
  );
};

// Small "trio" mark — three type-weight bars, the middle one gold.
const TrioMark: React.FC<{ size?: number }> = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x={3} y={4} width={3.4} height={16} rx={1.7} fill={INK} />
    <rect x={10.3} y={4} width={3.4} height={16} rx={1.7} fill={GOLD} />
    <rect x={17.6} y={4} width={3.4} height={16} rx={1.7} fill={INK} />
  </svg>
);

// ===========================================================================
// Scene 1 — Intro. Three setup-the-pain questions, each via shared-axis-z.
// ===========================================================================
const Q1 = "Hand-picking fonts for every project?";
const Q2 = "Wiring CSS variables by hand?";
const Q3 = "Rebuilding the type scale each time?";

const IntroScene: React.FC = () => (
  <AbsoluteFill style={{ padding: "0 90px" }}>
    <Series>
      <Series.Sequence durationInFrames={42} layout="none">
        <SharedAxisZ
          fromText=""
          toText={Q1}
          fontSize={42}
          fontWeight={600}
          color={"#FFFFFF"}
        />
      </Series.Sequence>
      <Series.Sequence durationInFrames={46} layout="none">
        <SharedAxisZ
          fromText={Q1}
          toText={Q2}
          fontSize={42}
          fontWeight={600}
          color={"#FFFFFF"}
        />
      </Series.Sequence>
      <Series.Sequence durationInFrames={52} layout="none">
        <SharedAxisZ
          fromText={Q2}
          toText={Q3}
          fontSize={42}
          fontWeight={600}
          color={"#FFFFFF"}
        />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 2 — The hook. "Three fonts." settles hard and centered.
// ===========================================================================
const ThreeScene: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <SharedAxisZ
      fromText={""}
      toText={"Three fonts."}
      fontSize={130}
      fontWeight={700}
      color={"#FFFFFF"}
    />
  </AbsoluteFill>
);

// ===========================================================================
// Scene 3 — The editorial pairing. One pairing, three roles — each rendered in
// its real typeface so the viewer reads the actual fonts.
// ===========================================================================
const TrioRow: React.FC<{
  role: string;
  name: string;
  family: string;
  cssVar: string;
  nameSize: number;
  delay: number;
  divider?: boolean;
}> = ({ role, name, family, cssVar, nameSize, delay, divider = true }) => (
  <Reveal delay={delay} distance={22} blur={10} duration={20}>
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 24,
        padding: "20px 0",
        borderTop: divider ? "1px solid rgba(250,250,250,0.1)" : "none",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span
          style={{
            fontFamily: SANS,
            fontSize: 14,
            fontWeight: 600,
            color: GOLD,
          }}
        >
          {role}
        </span>
        <span
          style={{
            fontFamily: family,
            fontSize: nameSize,
            color: INK,
            lineHeight: 1,
          }}
        >
          {name}
        </span>
      </div>
      <span style={{ fontFamily: MONO, fontSize: 15, color: FAINT }}>
        {cssVar}
      </span>
    </div>
  </Reveal>
);

const TrioScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 26,
    }}
  >
    <Reveal delay={2} distance={16} blur={10}>
      <div
        style={{ display: "flex", alignItems: "center", gap: 14 }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 14,
            color: GOLD,
            padding: "5px 12px",
            borderRadius: 999,
            border: `1px solid ${GOLD}55`,
            background: `${GOLD}1a`,
          }}
        >
          editorial
        </span>
        <h2
          style={{
            margin: 0,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 34,
            color: INK,
          }}
        >
          One pairing, three roles
        </h2>
      </div>
    </Reveal>
    <Reveal delay={8} distance={36} blur={14} duration={22}>
      <div
        style={{
          width: 740,
          padding: "12px 40px 24px",
          borderRadius: 20,
          background: "rgba(10,10,10,0.55)",
          border: `1px solid ${GOLD}3a`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
        }}
      >
        <TrioRow
          role="Heading"
          name="Playfair Display"
          family={PLAYFAIR}
          cssVar="--font-heading"
          nameSize={46}
          delay={16}
          divider={false}
        />
        <TrioRow
          role="Body"
          name="Source Serif 4"
          family={SOURCE_SERIF}
          cssVar="--font-body"
          nameSize={38}
          delay={24}
        />
        <TrioRow
          role="Mono"
          name="JetBrains Mono"
          family={MONO}
          cssVar="--font-mono"
          nameSize={30}
          delay={32}
        />
      </div>
    </Reveal>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 4 — Install. terminal-cursor-zoom dollies across the typed command.
// ===========================================================================
const InstallScene: React.FC = () => (
  <AbsoluteFill>
    <TerminalCursorZoom
      command="npx shadcn add @fonttrio/editorial"
      title="~/my-app"
      fontSize={22}
      zoom={2.4}
      charsPerFrame={1}
    />
  </AbsoluteFill>
);

// ===========================================================================
// Scene 5 — What lands in your project: the generated CSS variables.
// ===========================================================================
const CSS_EXAMPLE = `/* app/globals.css — added by Fonttrio */
:root {
  --font-heading: var(--font-playfair-display);
  --font-body: var(--font-source-serif-4);
  --font-mono: var(--font-jetbrains-mono);
}

h1, h2, h3 {
  font-family: var(--font-heading);
  font-weight: 700;
}

p {
  font-family: var(--font-body);
  line-height: 1.65;
}`;

const CodeScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 26,
    }}
  >
    <Reveal delay={2} distance={16} blur={10}>
      <h2
        style={{
          margin: 0,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 38,
          color: INK,
          textAlign: "center",
        }}
      >
        Variables,{" "}
        <Mark color={GOLD} startFrame={12}>
          wired for you
        </Mark>
      </h2>
    </Reveal>
    <Reveal delay={8} distance={40} blur={14} duration={22}>
      <div style={{ position: "relative", width: 760, height: 440 }}>
        <GlassCodeBlock
          code={CSS_EXAMPLE}
          title="globals.css"
          width={760}
          height={440}
          fontSize={15}
          staggerFrames={2}
        />
      </div>
    </Reveal>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 6 — The library at a glance. A rolling number lands on the count.
// ===========================================================================
const CountScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 10,
    }}
  >
    <div style={{ height: 170, display: "flex", alignItems: "center" }}>
      <RollingNumber from={0} to={78} fontSize={150} color={INK} speed={1.3} />
    </div>
    <Reveal delay={26} distance={14} blur={8}>
      <span
        style={{
          fontFamily: SANS,
          fontSize: 30,
          fontWeight: 600,
          color: INK,
        }}
      >
        curated pairings
      </span>
    </Reveal>
    <Reveal delay={36} distance={12} blur={6}>
      <span style={{ fontFamily: SANS, fontSize: 18, color: MUTED }}>
        editorial · clean · bold · corporate · creative
      </span>
    </Reveal>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 7 — Specimen wall. One "Ag" per mood, each in a real display face.
// ===========================================================================
type Specimen = { label: string; name: string; family: string };

const SPECIMENS: Specimen[] = [
  { label: "Editorial", name: "Playfair Display", family: PLAYFAIR },
  { label: "Bold", name: "Abril Fatface", family: ABRIL },
  { label: "Impact", name: "Bebas Neue", family: BEBAS },
  { label: "Clean", name: "Urbanist", family: URBANIST },
];

const SpecimenCard: React.FC<{ spec: Specimen; delay: number }> = ({
  spec,
  delay,
}) => (
  <Reveal delay={delay} distance={34} blur={12} duration={20}>
    <div
      style={{
        width: 232,
        height: 230,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px 22px",
        borderRadius: 18,
        background: "rgba(10,10,10,0.5)",
        border: "1px solid rgba(250,250,250,0.12)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
      }}
    >
      <span
        style={{
          alignSelf: "flex-start",
          fontFamily: MONO,
          fontSize: 13,
          color: GOLD,
          padding: "4px 10px",
          borderRadius: 999,
          background: `${GOLD}1a`,
        }}
      >
        {spec.label}
      </span>
      <span
        style={{
          fontFamily: spec.family,
          fontSize: 96,
          color: INK,
          lineHeight: 1,
          textAlign: "center",
        }}
      >
        Ag
      </span>
      <span style={{ fontFamily: SANS, fontSize: 16, color: MUTED }}>
        {spec.name}
      </span>
    </div>
  </Reveal>
);

const WallScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 40,
    }}
  >
    <Reveal delay={2} distance={16} blur={10}>
      <h2
        style={{
          margin: 0,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 40,
          color: INK,
          textAlign: "center",
        }}
      >
        Every mood, every project
      </h2>
    </Reveal>
    <div style={{ display: "flex", gap: 24 }}>
      {SPECIMENS.map((spec, i) => (
        <SpecimenCard key={spec.name} spec={spec} delay={8 + i * 6} />
      ))}
    </div>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 8 — Outro. The trio mark, the wordmark in its own hero serif, the
// tagline, and a copy-ready install pill.
// ===========================================================================
const InstallPill: React.FC<{
  command: string;
  delay: number;
  copyAt: number;
}> = ({ command, delay, copyAt }) => {
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
        height: 52,
        padding: "0 22px",
        borderRadius: 999,
        border: `1px solid rgba(255,255,255,${copied ? 0.22 : 0.14})`,
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0 12px 34px rgba(0,0,0,0.3)",
        fontFamily: MONO,
        fontSize: 18,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 12}px)`,
      }}
    >
      <span style={{ color: FAINT }}>$</span>
      <span style={{ color: INK }}>{command}</span>
      <span
        style={{
          display: "inline-flex",
          marginLeft: 3,
          color: copied ? "#4ade80" : "rgba(250,250,250,0.55)",
          transform: copied ? `scale(${pop})` : "scale(1)",
        }}
      >
        {copied ? <CheckIcon size={17} /> : <CopyIcon size={17} />}
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
        gap: 14,
      }}
    >
      <Reveal delay={2} distance={10} blur={6} duration={14}>
        <TrioMark size={60} />
      </Reveal>
      <Reveal delay={10} distance={16} blur={14} duration={22}>
        <div
          style={{
            fontFamily: PLAYFAIR,
            fontWeight: 700,
            fontSize: 96,
            color: INK,
            lineHeight: 1,
          }}
        >
          Fonttrio
        </div>
      </Reveal>
      <Reveal delay={22} distance={12} blur={8}>
        <span style={{ fontFamily: SANS, fontSize: 24, color: MUTED }}>
          Three fonts. One command.
        </span>
      </Reveal>
      <Reveal delay={34} distance={12} blur={8}>
        <div style={{ marginTop: 10 }}>
          <InstallPill
            command="npx shadcn add @fonttrio/editorial"
            delay={34}
            copyAt={60}
          />
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

const BlurCrossfade: React.FC<
  TransitionPresentationComponentProps<EmptyProps>
> = ({ children, presentationProgress, presentationDirection }) => {
  const entering = presentationDirection === "entering";
  const p = presentationProgress;
  const style: React.CSSProperties = entering
    ? {
        opacity: p,
        transform: `scale(${0.96 + p * 0.04})`,
        filter: p < 1 ? `blur(${(1 - p) * 14}px)` : undefined,
      }
    : {
        opacity: 1 - p,
        transform: `scale(${1 + p * 0.04})`,
        filter: p > 0 ? `blur(${p * 14}px)` : undefined,
      };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
const blurCrossfade = (): TransitionPresentation<EmptyProps> => ({
  component: BlurCrossfade,
  props: {},
});

const ZoomBlur: React.FC<
  TransitionPresentationComponentProps<{ rise: number }>
> = ({
  children,
  presentationProgress,
  presentationDirection,
  passedProps,
}) => {
  const { rise } = passedProps;
  const entering = presentationDirection === "entering";
  const p = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: entering ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
  });
  const style: React.CSSProperties = entering
    ? {
        opacity: p,
        transform: `translateY(${(1 - p) * rise}px) scale(${0.84 + p * 0.16})`,
        filter: p < 1 ? `blur(${(1 - p) * 20}px)` : undefined,
      }
    : {
        opacity: 1 - p,
        transform: `translateY(${-p * rise}px) scale(${1 + p * 0.22})`,
        filter: p > 0 ? `blur(${p * 20}px)` : undefined,
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
export const FonttrioDemo: React.FC = () => {
  return (
    <RemocnUIProvider>
      <AbsoluteFill style={{ fontFamily: SANS }}>
        {/* Persistent image background for the whole video. */}
        <Backdrop fill={{ type: "image", src: staticFile("bg.png") }} />
        {/* Scrim to deepen contrast for foreground content. */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(120% 120% at 50% 40%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        <TransitionSeries>
          {/* 1 — Intro questions */}
          <TransitionSeries.Sequence durationInFrames={S_INTRO}>
            <IntroScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_ZOOM })}
            presentation={zoomBlur(40)}
          />

          {/* 2 — Three fonts. */}
          <TransitionSeries.Sequence durationInFrames={S_THREE}>
            <ThreeScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 3 — The editorial pairing */}
          <TransitionSeries.Sequence durationInFrames={S_TRIO}>
            <TrioScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_BLUR })}
            presentation={blurCrossfade()}
          />

          {/* 4 — Install (terminal-cursor-zoom) */}
          <TransitionSeries.Sequence durationInFrames={S_INSTALL}>
            <InstallScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 5 — Generated CSS variables */}
          <TransitionSeries.Sequence durationInFrames={S_CODE}>
            <CodeScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 6 — Count */}
          <TransitionSeries.Sequence durationInFrames={S_COUNT}>
            <CountScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 7 — Specimen wall */}
          <TransitionSeries.Sequence durationInFrames={S_WALL}>
            <WallScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_OUT })}
            presentation={zoomBlur(70)}
          />

          {/* 8 — Outro */}
          <TransitionSeries.Sequence durationInFrames={S_OUTRO}>
            <OutroScene />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>
    </RemocnUIProvider>
  );
};
