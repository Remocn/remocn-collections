import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { demoAsset } from "@/lib/demo-assets";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { loadFont as loadSans } from "@remotion/google-fonts/Manrope";

import { ShaderDithering } from "@/components/remocn/shader-dithering";
import { pushThrough } from "@/components/remocn/push-through";
import { focusPull } from "@/components/remocn/focus-pull";

// react-bits speaks in motion, we speak in Manrope — normal weight only.
const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400"],
});

const SANS = `${SANS_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;

// Palette lifted from reactbits.dev itself: #060010 is the landing body
// background, #5227FF the signature accent used across the whole library.
const BG = "#060010";
const VIOLET = "#5227FF";
const INK = "#fafafa";
const MUTED = "rgba(250,250,250,0.6)";
const FAINT = "rgba(250,250,250,0.45)";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap.
// ---------------------------------------------------------------------------
const S_HOOK = 70; //    per-word kinetic hook
const S_REVEAL = 95; //  react-bits wordmark reveal + tagline
const S_COUNT = 60; //   130 count-up
const S_LOCKUP = 125; // Remocn ✕ react bits + reactbits.dev

// The tagline, cut into rhythmic beats — each word is its own hard-cut scene.
const BEAT_WORDS = [
  "Free",
  "Customizable",
  "Animations for",
  "Text",
  "Backgrounds",
  "UI",
];
const BEAT_DURS = [14, 14, 16, 12, 12, 22]; // accelerating into the tail
const S_BEATS = BEAT_DURS.reduce((a, b) => a + b, 0);

const T_PT = 18; // push-through
const T_FP = 18; // focus-pull

export const SPONSOR_REACTBITS_DURATION =
  S_HOOK + S_REVEAL + S_COUNT + S_BEATS + S_LOCKUP - (T_PT + T_FP + T_PT);

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
// Per-word rise — the react-bits "Split Text" register, rebuilt frame-driven:
// each word resolves out of blur while rising onto the baseline.
// ---------------------------------------------------------------------------
const WordsRise: React.FC<{
  text: string;
  fontSize: number;
  color?: string;
  delay?: number;
  stagger?: number;
}> = ({ text, fontSize, color = INK, delay = 0, stagger = 4 }) => {
  const frame = useCurrentFrame();
  const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
  return (
    <span
      style={{
        fontFamily: SANS,
        fontWeight: 400,
        fontSize,
        color,
        lineHeight: 1.25,
      }}
    >
      {text.split(" ").map((word, i) => {
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
              transform: `translateY(${(1 - py) * 30}px)`,
              filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined,
            }}
          >
            {word}
            {i < text.split(" ").length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
};

// ===========================================================================
// Scene 1 — Hook. The sponsor line lands word by word.
// ===========================================================================
const HookScene: React.FC = () => (
  <Drift>
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "0 120px",
        textAlign: "center",
      }}
    >
      <WordsRise text="Say hello to my new sponsor" fontSize={58} />
    </AbsoluteFill>
  </Drift>
);

// ===========================================================================
// Scene 2 — Reveal. The react-bits wordmark resolves out of depth, then the
// tagline settles beneath it.
// ===========================================================================
const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [4, 34], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const scale = interpolate(p, [0, 1], [1.14, 1]);
  return (
    <Drift>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
        }}
      >
        <Img
          src={demoAsset("reactbits-logo.svg")}
          style={{
            width: 660,
            opacity: p,
            transform: `scale(${scale})`,
            filter: p < 1 ? `blur(${(1 - p) * 22}px)` : undefined,
          }}
        />
        <div style={{ textAlign: "center" }}>
          <WordsRise
            text="The largest & most creative library of animated React components"
            fontSize={25}
            color={MUTED}
            delay={30}
            stagger={2}
          />
        </div>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 3 — Proof. The count-up react-bits is famous for, turned on itself.
// The plain number, nothing else.
// ===========================================================================
const CountScene: React.FC = () => {
  const frame = useCurrentFrame();
  const count = interpolate(frame, [4, 44], [0, 130], {
    ...clampOpts,
    easing: Easing.out(Easing.poly(3)),
  });
  return (
    <Drift>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 200,
            lineHeight: 1,
            color: INK,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(count)}
        </span>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 4 — Beats. The tagline cut into hard-cut word slots, switching on a
// rhythm: Free / Customizable / animations for / text / backgrounds / UI.
// Each word snaps in fast and holds until the next cut — no cross-fades.
// ===========================================================================
const BEAT_STARTS = BEAT_DURS.map((_, i) =>
  BEAT_DURS.slice(0, i).reduce((a, b) => a + b, 0),
);

const BeatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  let active = 0;
  for (let i = 0; i < BEAT_STARTS.length; i++) {
    if (frame >= BEAT_STARTS[i]) active = i;
  }
  const local = frame - BEAT_STARTS[active];
  const p = interpolate(local, [0, 8], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const scale = interpolate(p, [0, 1], [1.14, 1]);
  return (
    <Drift>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 96,
            lineHeight: 1.1,
            color: INK,
            opacity: p,
            transform: `scale(${scale})`,
            filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
            whiteSpace: "nowrap",
          }}
        >
          {BEAT_WORDS[active]}
        </span>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 4 — Lockup. Remocn ✕ react bits assembles, reactbits.dev closes.
// ===========================================================================
const LockupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ease = Easing.out(Easing.cubic);

  // The two names glide in from opposite sides.
  const sideP = interpolate(frame, [6, 30], [0, 1], {
    ...clampOpts,
    easing: ease,
  });
  const leftX = (1 - sideP) * -70;
  const rightX = (1 - sideP) * 70;
  const sideBlur = (1 - sideP) * 12;

  // The cross springs in once the sides have almost settled.
  const cross = spring({
    frame: frame - 26,
    fps,
    config: { damping: 12, stiffness: 160, mass: 0.8 },
  });
  const crossOpacity = interpolate(frame, [26, 38], [0, 1], clampOpts);

  return (
    <Drift grow={0.05}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: 66,
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
              fontSize: 44,
              color: FAINT,
              opacity: crossOpacity,
              transform: `scale(${interpolate(cross, [0, 1], [0.4, 1])})`,
            }}
          >
            ✕
          </span>
          <Img
            src={demoAsset("reactbits-logo.svg")}
            style={{
              height: 58,
              opacity: sideP,
              transform: `translateX(${rightX}px)`,
              filter: sideBlur > 0.2 ? `blur(${sideBlur}px)` : undefined,
            }}
          />
        </div>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Composition root. One persistent dithering shader carries the whole video —
// the paper.design warp/4x4 preset recolored into the react-bits register
// (#060010 body, #5227FF accent), pushed back by a vignette so it textures
// the dark instead of competing with it.
// ===========================================================================
export const SponsorReactbitsDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* Persistent shader backdrop — dithering / warp / 4x4. */}
      <ShaderDithering
        speed={0.55}
        colorBack={BG}
        colorFront={VIOLET}
        shape="warp"
        type="4x4"
        size={2.5}
      />
      {/* Vignette scrim — keeps the dither a texture, not a subject. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 42%, rgba(4,0,12,0.66) 0%, rgba(4,0,12,0.93) 100%)",
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

        {/* 2 — react-bits reveal */}
        <TransitionSeries.Sequence durationInFrames={S_REVEAL}>
          <RevealScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_FP })}
          presentation={focusPull()}
        />

        {/* 3 — 130 count-up */}
        <TransitionSeries.Sequence durationInFrames={S_COUNT}>
          <CountScene />
        </TransitionSeries.Sequence>

        {/* 4 — Tagline word beats (hard cut in, hard cuts inside) */}
        <TransitionSeries.Sequence durationInFrames={S_BEATS}>
          <BeatsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_PT })}
          presentation={pushThrough()}
        />

        {/* 5 — Lockup + URL */}
        <TransitionSeries.Sequence durationInFrames={S_LOCKUP}>
          <LockupScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
