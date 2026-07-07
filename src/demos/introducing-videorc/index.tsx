import React from "react";
import { AbsoluteFill, Easing, Img, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { demoAsset } from "@/lib/demo-assets";
import {
  TransitionSeries,
  linearTiming,
  type TransitionPresentation,
  type TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { loadFont as loadSans } from "@remotion/google-fonts/Manrope";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { ShaderGrainGradient } from "@/components/remocn/shader-grain-gradient";
import { whipPan } from "@/components/remocn/whip-pan";
import { pushThrough } from "@/components/remocn/push-through";
import { focusPull } from "@/components/remocn/focus-pull";
import { KineticCenterBuild } from "@/components/remocn/kinetic-center-build";
import { LineByLineSlide } from "@/components/remocn/line-by-line-slide";

// Videorc speaks in its own dark zinc tokens; we speak in Manrope 400 only.
const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "800"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400"],
});

const SANS = `${SANS_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;
const MONO = `${MONO_FAMILY}, ui-monospace, SFMono-Regular, monospace`;

// Palette lifted from videorc.com's own .dark tokens: #18181b background,
// #f5f5f6 foreground, #a1a1a8 muted — plus ONE accent, the record-red the
// logo's eyes wear and the site keeps for the record dot.
const ZINC = "#18181b";
const INK = "#f5f5f6";
const MUTED = "rgba(245,245,246,0.62)";
const FAINT = "rgba(245,245,246,0.4)";
const RED = "#ff3b30";
const HAIRLINE = "rgba(245,245,246,0.16)";
const SURFACE = "rgba(245,245,246,0.045)";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap.
// The motion score: narrative progress dives INTO the frame (ripple-zoom,
// push-through), enumeration travels LEFT (whip-pans, content arriving from
// the right and decelerating). Nothing moves against the cut before it.
// ---------------------------------------------------------------------------
const S_HOOK = 104; //   ● REC blinking, then the dive into the dot
const S_REVEAL = 220; // giant mark out of the tunnel → crisp beat → one descent
const S_VERBS = 88; //   Record / Stream / Publish beats
const S_ONE = 96; //     "Everything you need in one window"
const F_CAPTURE = 66; // feature station 1
const F_STREAM = 66; //  feature station 2
const F_PUBLISH = 74; // feature station 3 (absorbs the wave overlap)
const S_VALUES = 100; // three value lines
const S_OUTRO = 160; //  lockup + videorc.com

const T_RIPPLE = 80; //  signal dive (grain ripple, brand red)
const T_FP = 18; //      focus-pull
const T_WHIP = 14; //    whip-pan left
const T_WAVE = 42; //    wave-wipe (grain swell)
const T_PUSH = 18; //    push-through

const S_MONTAGE = F_CAPTURE + F_STREAM + F_PUBLISH - T_WHIP * 2;

export const INTRODUCING_VIDEORC_DURATION =
  S_HOOK +
  S_REVEAL +
  S_VERBS +
  S_ONE +
  S_MONTAGE +
  S_VALUES +
  S_OUTRO -
  (T_RIPPLE + T_FP + T_FP + T_WHIP + T_WAVE + T_PUSH);

// Global anchors for the recording chrome.
const REC_START = S_HOOK - T_RIPPLE; //          the dive begins — rec is on
const OUTRO_START = INTRODUCING_VIDEORC_DURATION - S_OUTRO;
const REC_STOP = OUTRO_START + 64; //            the lockup has landed — cut

// ---------------------------------------------------------------------------
// Local grain-field presentations. TransitionSeries keeps the entering
// presentation mounted for the WHOLE incoming sequence with progress pinned
// at 1, so the stock ripple-zoom / wave-wipe fields would sit behind the
// scene forever. These variants play the same dive / swell but fade the
// field out at the tail — the cut lands back in the calm zinc world.
// ---------------------------------------------------------------------------
type EmptyProps = Record<string, never>;

// Falling through the record dot: the hook scene dives INTO the dot itself
// (the in-scene camera zoom does the swallow — by the time the dot's flat
// red fills the frame, the ripple field has already bloomed beneath it), so
// the outgoing fade happens entirely behind the red and the tunnel is simply
// THERE when the dot dissolves. No visible fade-in for the field.
const SignalDive: React.FC<TransitionPresentationComponentProps<EmptyProps>> = ({
  children,
  presentationProgress,
  presentationDirection,
}) => {
  const p = presentationProgress;
  if (presentationDirection === "exiting") {
    // The hook scene plays its own dive; here we only dissolve the flat red
    // once it has swallowed the frame, revealing the tunnel beneath.
    return (
      <AbsoluteFill
        style={{
          opacity: interpolate(p, [0.72, 0.84], [1, 0], {
            ...clampOpts,
            easing: Easing.bezier(0.42, 0, 0.58, 1),
          }),
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  // The tunnel blooms under the red swallow, HOLDS readable while it keeps
  // zooming, then settles away as the lockup resolves.
  const fieldOpacity = interpolate(p, [0.68, 0.78, 0.93, 1], [0, 1, 1, 0], {
    ...clampOpts,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  });
  // Rings stay in readable range through the hold, then the zoom punches
  // through only at the tail as the lockup lands.
  const fieldScale = interpolate(p, [0.68, 0.93, 1], [0.35, 0.9, 4], {
    ...clampOpts,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  });
  const childStyle: React.CSSProperties = {
    opacity: interpolate(p, [0.86, 0.97], [0, 1], clampOpts),
    transform: `scale(${interpolate(p, [0.84, 1], [0.35, 1], {
      ...clampOpts,
      easing: Easing.bezier(0.33, 1, 0.68, 1),
    })})`,
    filter: `blur(${interpolate(p, [0.84, 0.98], [8, 0], clampOpts)}px)`,
  };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: fieldOpacity, pointerEvents: "none" }}>
        <ShaderGrainGradient
          shape="ripple"
          colors={["#2c191c", "#5c2a2c", "#96443c"]}
          colorBack={ZINC}
          intensity={0.5}
          softness={0.55}
          noise={0.4}
          scale={fieldScale}
        />
      </AbsoluteFill>
      <AbsoluteFill style={childStyle}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
const signalDive = (): TransitionPresentation<EmptyProps> => ({
  component: SignalDive,
  props: {},
});

// A zinc grain swell washes upward over the montage; the values ride in on
// the same rise, and the field settles away once they land.
const GrainSwell: React.FC<TransitionPresentationComponentProps<EmptyProps>> = ({
  children,
  presentationProgress,
  presentationDirection,
}) => {
  const p = presentationProgress;
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill
        style={{
          opacity: interpolate(p, [0.3, 0.5], [1, 0], {
            ...clampOpts,
            easing: Easing.bezier(0.42, 0, 0.58, 1),
          }),
          transform: `translateY(${interpolate(p, [0, 0.7], [0, -70], {
            ...clampOpts,
            easing: Easing.in(Easing.cubic),
          })}%)`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  const fieldOpacity = interpolate(p, [0.18, 0.45, 0.8, 1], [0, 1, 1, 0], {
    ...clampOpts,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  });
  const drift = interpolate(p, [0, 1], [0, 0.7], {
    ...clampOpts,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const rise = interpolate(p, [0.4, 0.82, 1], [100, -3.5, 0], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: fieldOpacity, pointerEvents: "none" }}>
        <ShaderGrainGradient
          shape="wave"
          colors={["#26262b", "#3a3a41", "#5b5b64"]}
          colorBack={ZINC}
          intensity={0.2}
          softness={0.7}
          noise={0.4}
          scale={1.16}
          offsetY={drift}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateY(${rise}%)` }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const grainSwell = (): TransitionPresentation<EmptyProps> => ({
  component: GrainSwell,
  props: {},
});

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
// Per-word rise — words resolve out of blur while rising onto the baseline.
// ---------------------------------------------------------------------------
const WordsRise: React.FC<{
  text: string;
  fontSize: number;
  color?: string;
  delay?: number;
  stagger?: number;
}> = ({ text, fontSize, color = INK, delay = 0, stagger = 3 }) => {
  const frame = useCurrentFrame();
  const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
  const words = text.split(" ");
  return (
    <span
      style={{
        fontFamily: SANS,
        fontWeight: 400,
        fontSize,
        color,
        lineHeight: 1.3,
      }}
    >
      {words.map((word, i) => {
        const p = interpolate(frame - delay - i * stagger, [0, 22], [0, 1], {
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
              transform: `translateY(${(1 - p) * 24}px)`,
              filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
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
// Recording chrome — a quiet mono timecode with a blinking record dot along
// the bottom-left, ticking on the GLOBAL clock (it sits outside the
// TransitionSeries). It appears as the ripple dive begins — the recording
// starts with the brand — and freezes solid at the outro lockup: cut, saved.
// ===========================================================================
const RecChrome: React.FC = () => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [REC_START + 58, REC_START + 80], [0, 1], clampOpts);
  const leave = interpolate(frame, [REC_STOP + 10, REC_STOP + 32], [1, 0], clampOpts);
  const stopped = frame >= REC_STOP;
  const tc = Math.max(0, Math.min(frame, REC_STOP) - REC_START);
  const ss = Math.floor(tc / 30) % 60;
  const ff = tc % 30;
  const pad = (n: number) => String(n).padStart(2, "0");
  const blinkOn = stopped || Math.floor(frame / 15) % 2 === 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 30,
        bottom: 24,
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity: appear * leave,
      }}
    >
      <div
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: RED,
          opacity: blinkOn ? 1 : 0.2,
        }}
      />
      <span style={{ fontFamily: MONO, fontSize: 15, color: FAINT }}>
        {`00:00:${pad(ss)}:${pad(ff)}`}
      </span>
    </div>
  );
};

// ===========================================================================
// Scene 1 — Hook. The ● REC lockup lands dead-center (the dot blinking on
// the camcorder cycle), one signal ring leaves the dot, and then the camera
// dives INTO the dot: an accelerating zoom whose transform origin is pinned
// to the dot's center, the letters flying past, until the flat red swallows
// the frame and the SignalDive tunnel is revealed beneath it — we fall
// through the record dot.
// ===========================================================================
// The dot's fixed screen position (offsets from center). The REC text hangs
// off the dot's right side so the dot's coordinates — the dive's transform
// origin — never depend on measured text width; -76 optically centers the
// whole ● REC group.
const DOT_X = -76;
const DOT_SIZE = 32;
const DIVE_FROM = 58;
const DIVE_TO = 88;

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lockupIn = spring({
    frame: frame - 4,
    fps,
    config: { damping: 12, stiffness: 160, mass: 0.7 },
  });
  // The dive: accelerating zoom whose origin is the dot's center; the
  // translate walks that origin back to screen center so the dot ends up
  // dead-center as it swallows the frame.
  const dive = interpolate(frame, [DIVE_FROM, DIVE_TO], [0, 1], {
    ...clampOpts,
    easing: Easing.in(Easing.cubic),
  });
  const diveScale = 1 + dive * 56;
  const blinkOn = dive > 0 || Math.floor(frame / 15) % 2 === 0;

  return (
    <Drift>
      <AbsoluteFill
        style={{
          transform: `translate(${-DOT_X * dive}px, 0px) scale(${diveScale})`,
          transformOrigin: `calc(50% + ${DOT_X}px) 50%`,
        }}
      >
        {/* ● REC — the dot is the anchor, REC hangs off its right side. */}
        <div
          style={{
            position: "absolute",
            left: `calc(50% + ${DOT_X}px)`,
            top: "50%",
            width: DOT_SIZE,
            height: DOT_SIZE,
            marginLeft: -DOT_SIZE / 2,
            marginTop: -DOT_SIZE / 2,
            borderRadius: "50%",
            background: RED,
            opacity: blinkOn ? 1 : 0.22,
            transform: `scale(${lockupIn})`,
          }}
        />
        <span
          style={{
            position: "absolute",
            left: `calc(50% + ${DOT_X + DOT_SIZE / 2 + 20}px)`,
            top: "50%",
            transform: "translateY(-51%)",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 56,
            lineHeight: 1,
            color: RED,
            opacity: Math.min(1, lockupIn * 1.3),
            whiteSpace: "nowrap",
          }}
        >
          REC
        </span>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 3 — The verbs. The three jobs hard-cut on a beat, now that the
// viewer knows whose jobs they are — Record / Stream / Publish.
// ===========================================================================
const VERBS = ["Record", "Stream", "Publish"];
const VERB_STARTS = [10, 34, 56];

const VerbsScene: React.FC = () => {
  const frame = useCurrentFrame();
  let active = -1;
  for (let i = 0; i < VERB_STARTS.length; i++) {
    if (frame >= VERB_STARTS[i]) active = i;
  }
  const local = active >= 0 ? frame - VERB_STARTS[active] : 0;
  const p = interpolate(local, [0, 8], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <Drift>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {active >= 0 ? (
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: 92,
              lineHeight: 1.1,
              color: INK,
              opacity: p,
              transform: `scale(${interpolate(p, [0, 1], [1.12, 1])})`,
              filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
              whiteSpace: "nowrap",
            }}
          >
            {VERBS[active]}
          </span>
        ) : null}
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 2 — Reveal: one continuous deceleration. The dive never stops — the
// tunnel spits us out right on the giant orc mark, and ONE long curve brakes
// the camera into the lockup: scale and the drift into the mark's slot ride
// the same interpolation, so the "shrink" and the "move left" are one
// motion. The curve's flat top reads as the grandeur hold without the frame
// ever going static. The name and the tagline are depth layers of the same
// camera: "Videorc" resolves out of the deep blur at ~45% of the descent
// (riding the group transform, so it visibly decelerates in from the right
// as the group settles), the tagline rises at ~70%. No reversals, no
// lateral pushes — layers, not steps.
// ===========================================================================
const REVEAL_MARK_W = 118;
const REVEAL_WORD_SIZE = 112; // cap height ≈ the mark's VISIBLE head height
const REVEAL_WORD_W = 385; // "Videorc" at 112px Manrope 400 (scaled from measured 268@78px)
const REVEAL_GAP = 26;
const REVEAL_LOCKUP_W = REVEAL_MARK_W + REVEAL_GAP + REVEAL_WORD_W;
const REVEAL_MARK_X = -(REVEAL_LOCKUP_W / 2) + REVEAL_MARK_W / 2;
const REVEAL_WORD_X = REVEAL_LOCKUP_W / 2 - REVEAL_WORD_W / 2;
// The tunnel hands over at ~80; the mark de-blurs and stands in full
// grandeur (only the camera drift breathing) before the one descent begins.
const REVEAL_SETTLE_FROM = 96;
const REVEAL_SETTLE_TO = 172;

const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();

  // The one curve: gentle release out of the crisp beat, committed middle,
  // soft landing. Everything in the scene reads off this clock.
  const p = interpolate(frame, [REVEAL_SETTLE_FROM, REVEAL_SETTLE_TO], [0, 1], {
    ...clampOpts,
    easing: Easing.bezier(0.5, 0, 0.2, 1),
  });
  const groupScale = interpolate(p, [0, 1], [3.4, 1]);
  // Scale is anchored on the mark's center; this drift walks the mark from
  // dead-center (where the dot swallowed us) into its lockup slot.
  const groupX = (1 - p) * -REVEAL_MARK_X;
  // Residual motion blur off the dive — fully crisp BEFORE the descent, so
  // the orc gets its clean full-size moment.
  const groupBlur = interpolate(frame, [76, 88], [2.5, 0], clampOpts);

  // Depth layer 2: the name resolves inside the moving group.
  const nameOpacity = interpolate(p, [0.42, 0.58], [0, 1], clampOpts);
  const nameBlur = interpolate(p, [0.42, 0.62], [8, 0], clampOpts);

  return (
    <Drift>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: REVEAL_MARK_W,
            transform: `translateX(${groupX}px) scale(${groupScale})`,
            transformOrigin: `calc(50% + ${REVEAL_MARK_X}px) 50%`,
            filter: groupBlur > 0.1 ? `blur(${groupBlur}px)` : undefined,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) translateX(${REVEAL_MARK_X}px)`,
            }}
          >
            <Img
              src={demoAsset("videorc-logo.png")}
              style={{
                width: REVEAL_MARK_W,
                height: REVEAL_MARK_W,
                display: "block",
              }}
            />
          </div>
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) translateX(${REVEAL_WORD_X}px)`,
              opacity: nameOpacity,
              filter: nameBlur > 0.1 ? `blur(${nameBlur}px)` : undefined,
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: REVEAL_WORD_SIZE,
              lineHeight: 1,
              color: INK,
              whiteSpace: "nowrap",
            }}
          >
            Videorc
          </span>
        </div>
        {/* Depth layer 3: the tagline rises as the camera parks. Sized so it
            spans the full lockup width — logo's left edge to the name's
            right edge (measured 387px @ 27px vs 529px lockup). */}
        <WordsRise
          text="The future of video starts here"
          fontSize={37}
          color={MUTED}
          delay={148}
          stagger={3}
        />
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 3 — Positioning. The site's own line assembles word by word.
// ===========================================================================
const OneWindowScene: React.FC = () => (
  <Drift>
    <AbsoluteFill>
      <Sequence from={6}>
        <KineticCenterBuild
          text="Everything you need in one window"
          fontSize={54}
          fontWeight={400}
          color={INK}
          measureScale={1.08}
        />
      </Sequence>
    </AbsoluteFill>
  </Drift>
);

// ===========================================================================
// Feature stations — shared layout so the montage keeps one rhythm: the
// fragment lives above center, the label sits on a fixed line below, and
// everything arrives from the right, decelerating out of the whip's
// leftward momentum.
// ===========================================================================
const Station: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => {
  const frame = useCurrentFrame();
  const ease = Easing.out(Easing.cubic);
  const slide = interpolate(frame, [0, 16], [46, 0], { ...clampOpts, easing: ease });
  const labelP = interpolate(frame - 8, [0, 16], [0, 1], { ...clampOpts, easing: ease });
  return (
    <Drift>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `translateX(${slide}px) translateY(-52px)` }}>
          {children}
        </div>
        <span
          style={{
            position: "absolute",
            top: 496,
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 29,
            color: INK,
            opacity: labelP,
            transform: `translateX(${(1 - labelP) * 60}px)`,
            filter: labelP < 1 ? `blur(${(1 - labelP) * 6}px)` : undefined,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </AbsoluteFill>
    </Drift>
  );
};

// Station 1 — Capture. A code-drawn recording surface: screen, red dot with
// a running mini-timecode, camera bubble, breathing mic waveform.
const CaptureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rectIn = spring({
    frame: frame - 2,
    fps,
    config: { damping: 14, stiffness: 130, mass: 0.9 },
  });
  const camIn = spring({
    frame: frame - 16,
    fps,
    config: { damping: 12, stiffness: 150, mass: 0.8 },
  });
  const dotP = interpolate(frame, [10, 18], [0, 1], clampOpts);
  const waveP = interpolate(frame, [22, 32], [0, 1], clampOpts);
  const tc = Math.max(0, frame - 10);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <Station label="Record in 4K — free, no watermark">
      <div
        style={{
          position: "relative",
          width: 380,
          height: 224,
          borderRadius: 14,
          border: `1.5px solid ${HAIRLINE}`,
          background: SURFACE,
          opacity: Math.min(1, rectIn * 1.4),
          transform: `scale(${interpolate(rectIn, [0, 1], [0.92, 1])})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: dotP,
          }}
        >
          <div
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: RED,
              opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0.25,
            }}
          />
          <span style={{ fontFamily: MONO, fontSize: 12.5, color: MUTED }}>
            {`00:00:${pad(Math.floor(tc / 30) % 60)}:${pad(tc % 30)}`}
          </span>
        </div>
        <span
          style={{
            position: "absolute",
            top: 15,
            right: 16,
            fontFamily: MONO,
            fontSize: 12,
            color: FAINT,
            opacity: dotP,
          }}
        >
          3840×2160 · 60 fps
        </span>
        <div
          style={{
            position: "absolute",
            bottom: 18,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: 5,
            height: 26,
            opacity: waveP,
          }}
        >
          {Array.from({ length: 11 }, (_, i) => (
            <div
              key={i}
              style={{
                width: 3.5,
                borderRadius: 2,
                background: MUTED,
                height: 5 + Math.abs(Math.sin(frame * 0.3 + i * 1.15)) * 19,
              }}
            />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            right: -22,
            bottom: -22,
            width: 64,
            height: 64,
            borderRadius: "50%",
            border: `1.5px solid ${HAIRLINE}`,
            background: "#202024",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: Math.min(1, camIn * 1.4),
            transform: `scale(${interpolate(camIn, [0, 1], [0.5, 1])})`,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "rgba(245,245,246,0.18)",
            }}
          />
        </div>
      </div>
    </Station>
  );
};

// Station 2 — Multistream. The red source dot lands left of center and five
// rays draw outward to the right, one per beat — the fan IS the multistream.
const DESTINATIONS = ["YouTube", "Twitch", "X", "RTMP", "…"];
const RAY_LEN = 296;
const RAY_ANGLES = [-36, -18, 0, 18, 36];

const MultistreamScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const srcIn = spring({
    frame: frame - 2,
    fps,
    config: { damping: 12, stiffness: 160, mass: 0.7 },
  });
  return (
    <Station label="One go-live, five destinations">
      <div style={{ position: "relative", width: 560, height: 260 }}>
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 130,
            width: 13,
            height: 13,
            marginLeft: -6.5,
            marginTop: -6.5,
            borderRadius: "50%",
            background: RED,
            transform: `scale(${srcIn})`,
          }}
        />
        {RAY_ANGLES.map((deg, i) => {
          const start = 8 + i * 5;
          const grow = interpolate(frame - start, [0, 13], [0, 1], {
            ...clampOpts,
            easing: Easing.out(Easing.cubic),
          });
          const rad = (deg * Math.PI) / 180;
          const ex = 90 + Math.cos(rad) * RAY_LEN;
          const ey = 130 + Math.sin(rad) * RAY_LEN * 0.62;
          const dotIn = spring({
            frame: frame - (start + 11),
            fps,
            config: { damping: 12, stiffness: 170, mass: 0.7 },
          });
          const labelP = interpolate(frame - (start + 13), [0, 10], [0, 1], {
            ...clampOpts,
            easing: Easing.out(Easing.cubic),
          });
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  position: "absolute",
                  left: 90,
                  top: 130,
                  width: Math.hypot(ex - 90, ey - 130),
                  height: 1.5,
                  background: HAIRLINE,
                  transformOrigin: "0 50%",
                  transform: `rotate(${Math.atan2(ey - 130, ex - 90)}rad) scaleX(${grow})`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: ex - 4,
                  top: ey - 4,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: INK,
                  transform: `scale(${dotIn})`,
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: ex + 16,
                  top: ey - 13,
                  fontFamily: SANS,
                  fontWeight: 400,
                  fontSize: 21,
                  color: MUTED,
                  opacity: labelP,
                  transform: `translateX(${(1 - labelP) * 14}px)`,
                  whiteSpace: "nowrap",
                }}
              >
                {DESTINATIONS[i]}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </Station>
  );
};

// Station 3 — AI publish. Four rows arrive one after another and a quiet
// check settles on each — the chores doing themselves.
const CHORES = ["Transcript", "Title & description", "Chapters", "Highlights"];

const PublishScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Station label="Stop recording — AI writes the rest">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        {CHORES.map((chore, i) => {
          const start = 6 + i * 7;
          const p = interpolate(frame - start, [0, 14], [0, 1], {
            ...clampOpts,
            easing: Easing.out(Easing.cubic),
          });
          const checkIn = spring({
            frame: frame - (start + 12),
            fps,
            config: { damping: 12, stiffness: 170, mass: 0.7 },
          });
          return (
            <div
              key={chore}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                opacity: p,
                transform: `translateX(${(1 - p) * 38}px)`,
                filter: p < 1 ? `blur(${(1 - p) * 5}px)` : undefined,
              }}
            >
              <span
                style={{
                  fontFamily: SANS,
                  fontWeight: 400,
                  fontSize: 28,
                  color: INK,
                  whiteSpace: "nowrap",
                }}
              >
                {chore}
              </span>
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: 20,
                  color: MUTED,
                  opacity: Math.min(1, checkIn * 1.3),
                  transform: `scale(${interpolate(checkIn, [0, 1], [0.4, 1])})`,
                }}
              >
                ✓
              </span>
            </div>
          );
        })}
      </div>
    </Station>
  );
};

const MontageScene: React.FC = () => (
  <AbsoluteFill>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={F_CAPTURE}>
        <CaptureScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        timing={linearTiming({ durationInFrames: T_WHIP })}
        presentation={whipPan({ direction: "left" })}
      />
      <TransitionSeries.Sequence durationInFrames={F_STREAM}>
        <MultistreamScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        timing={linearTiming({ durationInFrames: T_WHIP })}
        presentation={whipPan({ direction: "left" })}
      />
      <TransitionSeries.Sequence durationInFrames={F_PUBLISH}>
        <PublishScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 5 — The values. Three claims accumulate as a block.
// ===========================================================================
const ValuesScene: React.FC = () => (
  <Drift>
    <AbsoluteFill>
      <Sequence from={18}>
        <LineByLineSlide
          text={
            "Open source, free forever\n4K on your Mac, no watermark\nFrom stop to published, by AI"
          }
          fontSize={44}
          fontWeight={400}
          color={INK}
        />
      </Sequence>
    </AbsoluteFill>
  </Drift>
);

// ===========================================================================
// Scene 6 — Outro. The lockup assembles, videorc.com resolves beneath, the
// recording chrome freezes and lifts away — cut, saved.
// ===========================================================================
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const markIn = spring({
    frame: frame - 8,
    fps,
    config: { damping: 13, stiffness: 150, mass: 0.8 },
  });
  const wordIn = spring({
    frame: frame - 16,
    fps,
    config: { damping: 14, stiffness: 130, mass: 0.9 },
  });
  const wordOpacity = interpolate(frame, [16, 30], [0, 1], clampOpts);
  const creditOpacity = interpolate(frame, [96, 114], [0, 1], clampOpts);

  return (
    <Drift grow={0.05}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              opacity: Math.min(1, markIn * 1.3),
              transform: `scale(${interpolate(markIn, [0, 1], [0.5, 1])})`,
            }}
          >
            {/* The glossy orb mark, cut to its circle — the dark glass
                reads on the zinc canvas through its own rim highlights. */}
            <Img
              src={demoAsset("videorc-orb.png")}
              style={{ width: 112, height: 112, display: "block" }}
            />
          </div>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: 82,
              color: INK,
              opacity: wordOpacity,
              transform: `translateX(${interpolate(wordIn, [0, 1], [-18, 0])}px)`,
            }}
          >
            Videorc
          </span>
        </div>
        <span
          style={{
            position: "absolute",
            bottom: 42,
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 18,
            color: FAINT,
            opacity: creditOpacity,
          }}
        >
          Open source, built by OrcDev
        </span>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Composition root. One quiet grain-gradient (corners shape — the grain
// lives at the edges, the center stays clear for type) carries the whole
// video; the statement transitions are the SAME shader in ripple and wave
// shapes, so backdrop and cuts speak one language. No swirl anywhere.
// ===========================================================================
export const IntroducingVideorcDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={
        {
          "--font-geist-sans": SANS_FAMILY,
          background: ZINC,
        } as React.CSSProperties
      }
    >
      <ShaderGrainGradient
        speed={0.45}
        shape="corners"
        colors={["#1f1f23", "#28282d", "#352c31"]}
        colorBack={ZINC}
        softness={0.8}
        intensity={0.14}
        noise={0.28}
      />
      {/* Vignette scrim — keeps the grain a texture, not a subject. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 42%, rgba(24,24,27,0.55) 0%, rgba(24,24,27,0.93) 100%)",
        }}
      />

      <TransitionSeries>
        {/* 1 — Hook: dot + verbs */}
        <TransitionSeries.Sequence durationInFrames={S_HOOK}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_RIPPLE })}
          presentation={signalDive()}
        />

        {/* 2 — Reveal */}
        <TransitionSeries.Sequence durationInFrames={S_REVEAL}>
          <RevealScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_FP })}
          presentation={focusPull()}
        />

        {/* 3 — Record / Stream / Publish beats */}
        <TransitionSeries.Sequence durationInFrames={S_VERBS}>
          <VerbsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_FP })}
          presentation={focusPull()}
        />

        {/* 4 — One window */}
        <TransitionSeries.Sequence durationInFrames={S_ONE}>
          <OneWindowScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_WHIP })}
          presentation={whipPan({ direction: "left" })}
        />

        {/* 5 — Feature montage (whip-pans inside keep the same direction) */}
        <TransitionSeries.Sequence durationInFrames={S_MONTAGE}>
          <MontageScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_WAVE })}
          presentation={grainSwell()}
        />

        {/* 6 — Values */}
        <TransitionSeries.Sequence durationInFrames={S_VALUES}>
          <ValuesScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_PUSH })}
          presentation={pushThrough()}
        />

        {/* 7 — Lockup + URL */}
        <TransitionSeries.Sequence durationInFrames={S_OUTRO}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <RecChrome />
    </AbsoluteFill>
  );
};
