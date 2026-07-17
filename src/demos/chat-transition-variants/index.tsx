import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { loadFont as loadSans } from "@remotion/google-fonts/Manrope";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import type { TransitionPresentation } from "@remotion/transitions";

import { ShaderSimplexNoise } from "@/components/remocn/shader-simplex-noise";
import { MessageBubble } from "@/components/remocn/message-bubble";
import { bubbleBloom } from "@/components/remocn/bubble-bloom";
import { messageSend } from "@/components/remocn/message-send";
import type { RemocnTheme } from "@/lib/remocn-ui";

// ---------------------------------------------------------------------------
// SCRATCH — side-by-side comparison of the chat-transition candidates for the
// chat-changelog cut. Four identical takes of the video's own turn (the pain
// exchange → "Chat components"), one per bubble-bloom variant, each with a
// mono label naming the take. Not a shipping cut.
// ---------------------------------------------------------------------------

const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400", "500"],
});

const SANS =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO = `${MONO_FAMILY}, ui-monospace, SFMono-Regular, monospace`;

const OBSIDIAN = "#141318";
const INK = "#f2f2f2";
const FAINT = "rgba(242,242,242,0.4)";
const LIME = "#C3E88D";

const CHAT_THEME: Partial<RemocnTheme> = {
  primary: LIME,
  primaryForeground: OBSIDIAN,
  muted: "rgba(242,242,242,0.1)",
  foreground: INK,
  card: OBSIDIAN,
};

const TAKE_A = 100; // the exchange holds
const TAKE_B = 100; // the headline holds

// The stage backdrop, rendered at the root AND handed to bubble-bloom so the
// shader stays alive through the bubble transitions.
const StageBackdrop: React.FC = () => (
  <AbsoluteFill>
    <ShaderSimplexNoise
      speed={0.35}
      colors={["#141318", "#1a1922", "#232231"]}
      stepsPerColor={2}
      softness={0.8}
    />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(120% 120% at 50% 42%, rgba(20,19,24,0.26) 0%, rgba(20,19,24,0.66) 100%)",
      }}
    />
  </AbsoluteFill>
);

const ORIGIN = { x: 0.42, y: 0.7 };

type Variant = {
  key: string;
  label: string;
  /** transition length in frames — each candidate has its own natural pace */
  dur: number;
  presentation: () => TransitionPresentation<Record<string, unknown>>;
};

const VARIANTS: Variant[] = [
  {
    key: "bloom",
    label: "1/4 bubble-bloom:bloom — the pill itself inflates into the next scene",
    dur: 54,
    presentation: () =>
      bubbleBloom({
        variant: "bloom",
        origin: ORIGIN,
        backdrop: <StageBackdrop />,
      }),
  },
  {
    key: "pop",
    label:
      "2/4 bubble-bloom:pop — the bubble overshoots and bursts; the scene lands on the pop",
    dur: 34,
    presentation: () => bubbleBloom({ variant: "pop", origin: ORIGIN }),
  },
  {
    key: "launch",
    label:
      "3/4 bubble-bloom:launch — a typing bubble pops up on the left and swells to center",
    dur: 56,
    presentation: () =>
      bubbleBloom({
        variant: "launch",
        origin: { x: 0.24, y: 0.66 },
        backdrop: <StageBackdrop />,
      }),
  },
  {
    key: "send",
    label:
      "4/4 message-send — no bubble: the thread scrolls up, the scene springs in below",
    dur: 30,
    presentation: () => messageSend(),
  },
];

// The exchange from the chat-changelog hook, held static.
const ExchangeLite: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <div
      style={{
        width: 470,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transform: "scale(1.9)",
      }}
    >
      <MessageBubble
        variant="incoming"
        theme={CHAT_THEME}
        state="visible"
        maxWidth="88%"
      >
        Every product talks in chat now.
      </MessageBubble>
      <MessageBubble
        variant="outgoing"
        theme={CHAT_THEME}
        state="visible"
        maxWidth="88%"
      >
        Animating bubbles by hand? A day of keyframes.
      </MessageBubble>
    </div>
  </AbsoluteFill>
);

// The headline the transition reveals, held static.
const DropLite: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <span
      style={{
        fontFamily: SANS,
        fontWeight: 400,
        fontSize: 78,
        letterSpacing: "-0.03em",
        color: INK,
      }}
    >
      Chat components
    </span>
  </AbsoluteFill>
);

const Take: React.FC<{ v: Variant }> = ({ v }) => (
  <AbsoluteFill>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={TAKE_A}>
        <ExchangeLite />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        timing={linearTiming({ durationInFrames: v.dur })}
        presentation={v.presentation()}
      />
      <TransitionSeries.Sequence durationInFrames={TAKE_B}>
        <DropLite />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <span
      style={{
        position: "absolute",
        left: 32,
        bottom: 26,
        fontFamily: MONO,
        fontSize: 17,
        color: FAINT,
      }}
    >
      {v.label}
    </span>
  </AbsoluteFill>
);

export const CHAT_TRANSITION_VARIANTS_DURATION = VARIANTS.reduce(
  (acc, v) => acc + TAKE_A + TAKE_B - v.dur,
  0,
);

export const ChatTransitionVariantsDemo: React.FC = () => (
  <AbsoluteFill
    style={
      {
        "--font-geist-sans": SANS_FAMILY,
        background: OBSIDIAN,
      } as React.CSSProperties
    }
  >
    <StageBackdrop />
    <Series>
      {VARIANTS.map((v) => (
        <Series.Sequence key={v.key} durationInFrames={TAKE_A + TAKE_B - v.dur}>
          <Take v={v} />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
