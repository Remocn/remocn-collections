import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming, type TransitionPresentation, type TransitionPresentationComponentProps } from "@remotion/transitions";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";

import { ShaderGrainGradient } from "@/components/remocn/shader-grain-gradient";
import { SoftBlurIn } from "@/components/remocn/soft-blur-in";
import { pushThrough } from "@/components/remocn/push-through";
import { focusPull } from "@/components/remocn/focus-pull";

// Canadian AI speaks in an editorial register — Inter for the interface voice,
// Playfair Display for the serif statements, exactly as canadian-ai.ca pairs them.
const { fontFamily: INTER_FAMILY } = loadInter("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700"],
});
const { fontFamily: SERIF_FAMILY } = loadPlayfair("normal", {
  subsets: ["latin"],
  weights: ["500"],
});
loadPlayfair("italic", { subsets: ["latin"], weights: ["500"] });

const SANS = `${INTER_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;
const SERIF = `${SERIF_FAMILY}, Georgia, serif`;

// Canadian AI palette — the site is paper-white with black ink and one amber
// accent (#F59E0B, their "live" dots and Start buttons). The only light-theme
// sponsor spot in the collection, because the brand is light.
const PAPER = "#FCFBF9";
const INK = "#111110";
const MUTED = "rgba(17,17,16,0.6)";
const FAINT = "rgba(17,17,16,0.38)";
const AMBER = "#F59E0B";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap.
// ---------------------------------------------------------------------------
const S_INTRO = 70; //   the mark draws itself on, amber live-dot pops
const S_HOOK = 66; //    "Say hello to my new sponsor"
const S_REVEAL = 110; // Canadian AI wordmark + serif tagline
const S_PHILOSOPHY = 76; // "Better tools create more value."
const S_LOCKUP = 120; // Remocn ✕ Canadian AI + canadian-ai.ca

// "What we build" — the site's own numbered product list, cut into beats.
const PRODUCTS = [
  {
    num: "01",
    name: "Core",
    blurb: "Unified identity, workflows, and system foundation",
  },
  {
    num: "02",
    name: "Sales Agent",
    blurb: "Automation for outreach, follow-up, and growth",
  },
  {
    num: "03",
    name: "Dev Agent",
    blurb: "Operates across repos, builds, and technical workflows",
  },
];
const PRODUCT_DURS = [44, 44, 50];
const S_BUILD = PRODUCT_DURS.reduce((a, b) => a + b, 0);

const T_PT = 16; // push-through
const T_X = 14; //  crossfade
const T_FP = 16; // focus-pull

export const SPONSOR_CANADIAN_AI_DURATION =
  S_INTRO +
  S_HOOK +
  S_REVEAL +
  S_BUILD +
  S_PHILOSOPHY +
  S_LOCKUP -
  (T_PT + T_X + T_FP + T_X + T_PT);

// The real Canadian AI mark from canadian-ai.ca/icon.svg — a single
// monochrome path in a 1080 box. With drawProgress it draws itself on as a
// stroke while the fill resolves via fillProgress.
const LOGO_PATH =
  "M1080,477.72v104.55c-19.84,255.58-221.7,461.02-474.67,491.57-21.43,2.58-43.24,6.16-65.33,6.16-54.13,0-106.38-10.24-155.64-25.12-4.06-11.11-3.07-24.13,4.96-35.2l202.02-279.04s0-.02,0-.03c6.37-8.82,9.79-19.38,9.79-30.25v-56.18c0-44.75-53.1-68.29-86.26-38.22l-113.72,103.09s0,.01-.03.03c-20.39,18.44-51.67,17.67-71.11-1.78l-88.8-88.8c-19.63-19.64-20.21-51.29-1.29-71.63l252.97-271.94.02-.02c30.69-33,7.27-86.73-37.8-86.73h-29.65c-13.7,0-26.81,5.44-36.49,15.11h-.02S88.09,514.19,88.09,514.19c-.03.03-.08.08-.11.11L0,602.28v-104.55C19.37,248.14,212.34,46.37,456.96,8.6c5.88-.9,11.77-1.71,17.71-2.44,21.43-2.58,43.24-6.16,65.33-6.16,54.13,0,106.38,10.24,155.64,25.12,4.06,11.11,3.07,24.13-4.96,35.2l-202.02,279.04s0,.02,0,.03c-6.37,8.82-9.79,19.4-9.79,30.25v56.18c0,44.75,53.1,68.29,86.26,38.22l113.72-103.09s0-.01.03-.03c20.39-18.44,51.67-17.67,71.11,1.78l88.8,88.8c19.63,19.64,20.21,51.29,1.29,71.63l-252.97,271.94-.02.02c-30.69,33-7.27,86.73,37.8,86.73h29.65c13.7,0,26.81-5.44,36.49-15.11h.02s300.87-300.9,300.87-300.9c.03-.03.08-.08.11-.11l87.98-87.98Z";

const CanadianAiMark: React.FC<{
  size?: number;
  color?: string;
  drawProgress?: number;
  fillProgress?: number;
}> = ({ size = 96, color = INK, drawProgress, fillProgress }) => {
  const drawing = drawProgress !== undefined;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1080 1080"
      width={size}
      height={size}
      aria-hidden
    >
      <path
        d={LOGO_PATH}
        fill={color}
        {...(drawing
          ? {
              pathLength: 1,
              strokeDasharray: 1,
              strokeDashoffset: 1 - drawProgress,
              stroke: color,
              strokeWidth: 18,
              strokeLinecap: "round" as const,
              fillOpacity: fillProgress ?? 1,
            }
          : {})}
      />
    </svg>
  );
};

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
// baseline. Takes the full type voice so the serif beats can use it too.
// ---------------------------------------------------------------------------
const WordsRise: React.FC<{
  text: string;
  fontSize: number;
  color?: string;
  delay?: number;
  stagger?: number;
  fontFamily?: string;
  fontStyle?: "normal" | "italic";
  fontWeight?: number;
}> = ({
  text,
  fontSize,
  color = INK,
  delay = 0,
  stagger = 4,
  fontFamily = SANS,
  fontStyle = "normal",
  fontWeight = 500,
}) => {
  const frame = useCurrentFrame();
  const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
  const words = text.split(" ");
  return (
    <span
      style={{
        fontFamily,
        fontStyle,
        fontWeight,
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
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: p,
              transform: `translateY(${(1 - p) * 26}px)`,
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

// ===========================================================================
// Scene 1 — Intro. The Canadian AI mark draws itself on in black ink over the
// paper and the fill resolves. A gentle float starts once the mark is drawn.
// ===========================================================================
const MARK_INTRO_SIZE = 190;

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [4, 42], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const fill = interpolate(frame, [34, 52], [0, 1], clampOpts);
  // Float only after the ink has settled — a steady hand draws, then breathes.
  const floatIn = interpolate(frame, [46, 64], [0, 1], clampOpts);
  const float = Math.sin(frame / 14) * 6 * floatIn;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          transform: `translateY(${float}px)`,
          filter: "drop-shadow(0 16px 28px rgba(31,26,16,0.16))",
        }}
      >
        <CanadianAiMark
          size={MARK_INTRO_SIZE}
          drawProgress={draw}
          fillProgress={fill}
        />
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 2 — Hook. The family line, in ink on paper.
// ===========================================================================
const HookScene: React.FC = () => (
  <Drift>
    <AbsoluteFill style={{ padding: "0 90px" }}>
      <SoftBlurIn
        text="Say hello to my new sponsor"
        fontSize={54}
        fontWeight={600}
        color={INK}
        blur={14}
      />
    </AbsoluteFill>
  </Drift>
);

// ===========================================================================
// Scene 3 — Reveal. The Canadian AI wordmark resolves out of depth, then the
// site's serif tagline settles beneath it in Playfair italic.
// ===========================================================================
const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [4, 34], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const scale = interpolate(p, [0, 1], [1.12, 1]);
  return (
    <Drift>
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", gap: 8 }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 92,
            letterSpacing: "-0.03em",
            color: INK,
            opacity: p,
            transform: `scale(${scale})`,
            filter: p < 1 ? `blur(${(1 - p) * 20}px)` : undefined,
            whiteSpace: "nowrap",
          }}
        >
          Canadian AI
        </span>
        <WordsRise
          text="Operating System for Organizations"
          fontSize={31}
          color={MUTED}
          delay={28}
          stagger={3}
          fontFamily={SERIF}
          fontStyle="italic"
        />
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 4 — What we build. The site's numbered product list cut into
// hard-cut beats: an amber serif numeral, the product name, one descriptor.
// The kicker holds through the cuts.
// ===========================================================================
const BEAT_STARTS = PRODUCT_DURS.map((_, i) =>
  PRODUCT_DURS.slice(0, i).reduce((a, b) => a + b, 0),
);

const BuildScene: React.FC = () => {
  const frame = useCurrentFrame();
  let active = 0;
  for (let i = 0; i < BEAT_STARTS.length; i++) {
    if (frame >= BEAT_STARTS[i]) active = i;
  }
  const local = frame - BEAT_STARTS[active];
  const p = interpolate(local, [0, 9], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const scale = interpolate(p, [0, 1], [1.1, 1]);
  const kicker = interpolate(frame, [0, 14], [0, 1], clampOpts);
  const beat = PRODUCTS[active];
  return (
    <Drift>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {/* Kicker — persists across the hard cuts. */}
        <span
          style={{
            position: "absolute",
            top: 128,
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 19,
            color: FAINT,
            opacity: kicker,
          }}
        >
          What we build
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            opacity: p,
            transform: `scale(${scale})`,
            filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
          }}
        >
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 500,
              fontSize: 64,
              lineHeight: 1,
              color: AMBER,
            }}
          >
            {beat.num}
          </span>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 76,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: INK,
              whiteSpace: "nowrap",
            }}
          >
            {beat.name}
          </span>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: 23,
              color: MUTED,
              whiteSpace: "nowrap",
            }}
          >
            {beat.blurb}
          </span>
        </div>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 5 — Philosophy. The site's lead creed, set as a serif statement.
// ===========================================================================
const PhilosophyScene: React.FC = () => (
  <Drift>
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "0 120px",
        textAlign: "center",
      }}
    >
      <WordsRise
        text="Better tools create more value."
        fontSize={56}
        delay={4}
        stagger={5}
        fontFamily={SERIF}
        fontStyle="italic"
      />
    </AbsoluteFill>
  </Drift>
);

// ===========================================================================
// Scene 6 — Lockup. Remocn ✕ Canadian AI glides together from both sides.
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
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 64,
              letterSpacing: "-0.02em",
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
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: 42,
              color: FAINT,
              opacity: crossOpacity,
              transform: `scale(${interpolate(cross, [0, 1], [0.4, 1])})`,
            }}
          >
            ✕
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              opacity: sideP,
              transform: `translateX(${rightX}px)`,
              filter: sideBlur > 0.2 ? `blur(${sideBlur}px)` : undefined,
            }}
          >
            <CanadianAiMark size={56} />
            <span
              style={{
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: 56,
                letterSpacing: "-0.02em",
                color: INK,
                whiteSpace: "nowrap",
              }}
            >
              Canadian AI
            </span>
          </div>
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
// Composition root. Paper-white canvas — the only light sponsor spot in the
// collection, because Canadian AI is a light brand. A warm grain gradient
// textures the paper, washed back toward the center so content sits on
// near-clean white.
// ===========================================================================
export const SponsorCanadianAiDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={
        {
          "--font-geist-sans": INTER_FAMILY,
          background: PAPER,
        } as React.CSSProperties
      }
    >
      {/* Persistent warm-paper grain backdrop. */}
      <ShaderGrainGradient
        speed={0.5}
        colorBack={PAPER}
        colors={["#F1EAD9", "#EDE3CE", "#F7F2E6"]}
        softness={0.85}
        intensity={0.16}
        noise={0.06}
      />
      {/* Paper wash — keeps the center clean, lets the edges keep the grain. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 42%, rgba(252,251,249,0.8) 0%, rgba(252,251,249,0.28) 100%)",
        }}
      />

      <TransitionSeries>
        {/* 1 — The mark draws itself on */}
        <TransitionSeries.Sequence durationInFrames={S_INTRO}>
          <IntroScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_PT })}
          presentation={pushThrough()}
        />

        {/* 2 — Hook */}
        <TransitionSeries.Sequence durationInFrames={S_HOOK}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 3 — Wordmark + tagline */}
        <TransitionSeries.Sequence durationInFrames={S_REVEAL}>
          <RevealScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_FP })}
          presentation={focusPull()}
        />

        {/* 4 — What we build: 01 / 02 / 03 */}
        <TransitionSeries.Sequence durationInFrames={S_BUILD}>
          <BuildScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 5 — Philosophy */}
        <TransitionSeries.Sequence durationInFrames={S_PHILOSOPHY}>
          <PhilosophyScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_PT })}
          presentation={pushThrough()}
        />

        {/* 6 — Lockup + URL */}
        <TransitionSeries.Sequence durationInFrames={S_LOCKUP}>
          <LockupScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
