"use client";

import type React from "react";
import type { ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { typingDotOffset } from "@/components/remocn/typing-indicator";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

/**
 * Chat-bubble scene transitions, three variants (the bubble-free "send"
 * gesture lives in its own component — message-send):
 *
 * - "bloom"  — a typing pill springs up and ITSELF inflates into the next
 *              scene: dots, surface and edge all belong to the one growing
 *              bubble; nothing detaches.
 * - "pop"    — the pill overshoots, bursts, and the next scene lands on the
 *              pop with a scale settle. Snappy, no mask.
 * - "launch" — a typing pill appears on the incoming side (the left, where
 *              the other party types) and swells from there into the frame,
 *              its center gliding to the middle as it opens.
 */
export type BubbleBloomVariant = "bloom" | "pop" | "launch";

export type BubbleBloomProps = {
  variant?: BubbleBloomVariant;
  /** Bubble center in 0..1 frame coordinates. Defaults to just below center. */
  origin?: { x: number; y: number };
  /** Surface of the bubble (scenes are often transparent over a shared backdrop). */
  surfaceColor?: string;
  /** Edge of the bubble. */
  surfaceBorder?: string;
  /**
   * The tone of your composition's backdrop. The bloom's covering layers
   * melt into this color, so the hand-off to the (often transparent)
   * incoming scene never flashes. Match it to your canvas.
   */
  backdropColor?: string;
  /**
   * Your composition's LIVE backdrop stack (e.g. the shader + scrim the
   * scenes sit on). When provided, the bubble's covering layers render this
   * instead of the flat color — the animated field stays visible through
   * the whole transition, and since a second instance renders the exact
   * same pixels on the same frame, every layer hand-off is invisible.
   */
  backdrop?: ReactNode;
  /** The three waving dots. */
  dotColor?: string;
};

// Sized like the message-bubble typing pill (a one-line bubble at the hook
// scene's scale): a soft glass stadium with three large waving dots.
const PILL_W = 118;
const PILL_H = 78;
const DOT_SIZE = 13;
const DOT_GAP = 8;
const DOT_OPTS = { dotCount: 3, amplitude: 5, speed: 1, cyclesPerSecond: 1.1 };

// The presentation only receives progress, so its springs run on a reference
// clock scaled by progress — deterministic, and real remotion physics.
const REF_FRAMES = 56;

const Dots: React.FC<{ color: string; opacity: number }> = ({
  color,
  opacity,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (opacity <= 0) return null;
  return (
    <div style={{ display: "flex", gap: DOT_GAP, opacity }}>
      {Array.from({ length: DOT_OPTS.dotCount }, (_, i) => {
        const dot = typingDotOffset(frame, i, { fps, ...DOT_OPTS });
        return (
          <span
            key={i}
            style={{
              width: DOT_SIZE,
              height: DOT_SIZE,
              borderRadius: "50%",
              background: color,
              opacity: dot.opacity,
              transform: `translateY(${dot.translateY}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

const BubbleBloomPresentation: React.FC<
  TransitionPresentationComponentProps<BubbleBloomProps>
> = ({ children, presentationProgress, presentationDirection, passedProps }) => {
  const { width, height, fps } = useVideoConfig();
  const {
    variant = "bloom",
    origin = { x: 0.5, y: 0.6 },
    surfaceColor = "#1c1b23",
    surfaceBorder = "rgba(242,242,242,0.14)",
    backdropColor = "#141318",
    backdrop,
    dotColor = "rgba(242,242,242,0.85)",
  } = passedProps;

  // The covering layers show the live backdrop when provided, so the
  // animated field never goes dark behind the transition.
  const cover: ReactNode = backdrop ?? (
    <AbsoluteFill style={{ background: backdropColor }} />
  );

  const entering = presentationDirection === "entering";
  const p = presentationProgress;

  // -------------------------------------------------------------------------
  // pop — the pill bursts; the scene lands on the pop.
  // -------------------------------------------------------------------------
  const POP_AT = 0.62;

  if (variant === "pop") {
    if (!entering) {
      return (
        <AbsoluteFill
          style={{
            opacity: interpolate(p, [POP_AT - 0.12, POP_AT + 0.02], [1, 0], clampOpts),
            transform: `scale(${interpolate(p, [0.1, POP_AT], [1, 0.97], clampOpts)})`,
            filter: `brightness(${interpolate(p, [0.15, POP_AT], [1, 0.6], clampOpts)})`,
          }}
        >
          {children}
        </AbsoluteFill>
      );
    }
    if (p >= 0.999) return <AbsoluteFill>{children}</AbsoluteFill>;

    const cx = origin.x * width;
    const cy = origin.y * height;

    // The pill pops in, then swells with rising tension until it bursts.
    const popIn = interpolate(p, [0.06, 0.24], [0, 1], {
      ...clampOpts,
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    });
    const swell = interpolate(p, [0.28, POP_AT], [1, 1.5], {
      ...clampOpts,
      easing: Easing.in(Easing.quad),
    });
    const burst = p >= POP_AT;
    const pillScale = burst
      ? 1.5 + interpolate(p, [POP_AT, POP_AT + 0.06], [0, 0.35], clampOpts)
      : popIn * swell;
    const pillOpacity = burst
      ? interpolate(p, [POP_AT, POP_AT + 0.06], [1, 0], clampOpts)
      : popIn;

    // A single thin shockwave ring sells the burst.
    const ringP = interpolate(p, [POP_AT, POP_AT + 0.2], [0, 1], {
      ...clampOpts,
      easing: Easing.out(Easing.cubic),
    });
    const ringR = 28 + ringP * 150;

    const landed = interpolate(p, [POP_AT, POP_AT + 0.3], [0, 1], {
      ...clampOpts,
      easing: Easing.bezier(0.22, 1.2, 0.36, 1),
    });

    return (
      <AbsoluteFill>
        <AbsoluteFill
          style={{
            opacity: interpolate(p, [POP_AT, POP_AT + 0.08], [0, 1], clampOpts),
            transform: `scale(${1.05 - landed * 0.05})`,
          }}
        >
          {children}
        </AbsoluteFill>
        {pillOpacity > 0 ? (
          <div
            style={{
              position: "absolute",
              left: cx - PILL_W / 2,
              top: cy - PILL_H / 2,
              width: PILL_W,
              height: PILL_H,
              borderRadius: PILL_H / 2,
              background: surfaceColor,
              border: `1px solid ${surfaceBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: pillOpacity,
              transform: `scale(${pillScale})`,
              transformOrigin: "50% 50%",
              pointerEvents: "none",
            }}
          >
            <Dots color={dotColor} opacity={1} />
          </div>
        ) : null}
        {burst && ringP < 1 ? (
          <div
            style={{
              position: "absolute",
              left: cx - ringR,
              top: cy - ringR,
              width: ringR * 2,
              height: ringR * 2,
              borderRadius: "50%",
              border: `1.5px solid ${surfaceBorder}`,
              opacity: 1 - ringP,
              pointerEvents: "none",
            }}
          />
        ) : null}
      </AbsoluteFill>
    );
  }

  // -------------------------------------------------------------------------
  // bloom / launch — one continuous bubble grows into the scene. In "bloom"
  // it stays where it popped up; in "launch" it pops up where the other
  // party would type (pass a left-side origin) and its center glides to the
  // middle of the frame while it opens.
  // -------------------------------------------------------------------------
  // Ease-in-out growth: the bubble gathers itself, accelerates through the
  // middle, and brakes into the frame edges. Computed for BOTH directions —
  // every fade below is keyed to actual mask coverage, never to raw
  // progress, so nothing can fade before it is covered.
  const grow = interpolate(p, [0.42, 0.96], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });

  if (!entering) {
    // The outgoing scene never fades in the open: it recedes and dims while
    // the bubble grows, and its actual opacity fade happens at grow 0.86+ —
    // when the entering side's full-frame underlay has already covered
    // everything, so the fade itself is invisible.
    return (
      <AbsoluteFill
        style={{
          opacity: interpolate(grow, [0.86, 0.93], [1, 0], clampOpts),
          transform: `scale(${interpolate(p, [0.1, 0.9], [1, 0.965], clampOpts)})`,
          filter: `brightness(${interpolate(p, [0.15, 0.85], [1, 0.55], clampOpts)}) blur(${interpolate(p, [0.42, 0.9], [0, 5], clampOpts)}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  if (p >= 0.999) return <AbsoluteFill>{children}</AbsoluteFill>;

  // The pill pops in on a real remotion spring — the slight overshoot is the
  // force — then DWELLS with the dots waving before the growth begins.
  const vFrame = p * REF_FRAMES;
  const pillScale = spring({
    frame: vFrame - 2,
    fps,
    config: { damping: 11, stiffness: 170, mass: 0.8 },
  });

  // In "launch" the bubble's center glides from where it popped up (the
  // typing side) to the middle of the frame as it opens; in "bloom" it
  // stays put. The glide rides the same growth curve, so slide and swell
  // read as one motion.
  const travel =
    variant === "launch"
      ? interpolate(grow, [0, 0.85], [0, 1], {
          ...clampOpts,
          easing: Easing.out(Easing.cubic),
        })
      : 0;
  const cx = (origin.x + (0.5 - origin.x) * travel) * width;
  const cy = (origin.y + (0.5 - origin.y) * travel) * height;

  const insetLeft = Math.max(0, (cx - (PILL_W / 2) * pillScale) * (1 - grow));
  const insetRight = Math.max(0, (width - cx - (PILL_W / 2) * pillScale) * (1 - grow));
  const insetTop = Math.max(0, (cy - (PILL_H / 2) * pillScale) * (1 - grow));
  const insetBottom = Math.max(
    0,
    (height - cy - (PILL_H / 2) * pillScale) * (1 - grow),
  );
  const currentH = height - insetTop - insetBottom;
  // Pill-round while small, bubble-round while inflating, square at the end.
  const radius = Math.min(
    currentH / 2,
    interpolate(grow, [0, 0.7, 1], [PILL_H / 2, 110, 0], clampOpts),
  );

  // The hand-off is layered so nothing visible ever pops: the LIFTED surface
  // tone fades while the bubble's edge is still on screen (reads as the
  // bubble opening up), and the layer that disappears last is color-matched
  // to the backdrop — its exit is invisible.
  const baseOpacity = interpolate(grow, [0.92, 1], [1, 0], clampOpts);
  const liftOpacity = interpolate(grow, [0.5, 0.8], [1, 0], clampOpts);
  const borderOpacity = interpolate(grow, [0.85, 0.98], [1, 0], clampOpts);
  const dotsOpacity =
    Math.min(1, pillScale) * interpolate(grow, [0.12, 0.38], [1, 0], clampOpts);
  const contentOpacity = interpolate(grow, [0.2, 0.55], [0, 1], clampOpts);
  // Full-frame, backdrop-matched underlay OUTSIDE the mask: as the bubble
  // grows, the rest of the frame melts into the canvas tone. It is what the
  // outgoing scene fades behind (invisibly), and its own exit — flat canvas
  // tone over the canvas itself — cannot flash.
  const underlayOpacity = interpolate(
    grow,
    [0.55, 0.85, 0.94, 1],
    [0, 1, 1, 0],
    clampOpts,
  );

  return (
    <AbsoluteFill>
      {underlayOpacity > 0 ? (
        <AbsoluteFill style={{ opacity: underlayOpacity }}>{cover}</AbsoluteFill>
      ) : null}
      <AbsoluteFill
        style={{
          clipPath: `inset(${insetTop}px ${insetRight}px ${insetBottom}px ${insetLeft}px round ${radius}px)`,
        }}
      >
        {baseOpacity > 0 ? (
          <AbsoluteFill style={{ opacity: baseOpacity }}>{cover}</AbsoluteFill>
        ) : null}
        {liftOpacity > 0 ? (
          <AbsoluteFill style={{ background: surfaceColor, opacity: liftOpacity }} />
        ) : null}
        {/* A faint glass tint keeps the small pill legible on the dark
            stage; it melts away as the bubble opens into the scene. */}
        {dotsOpacity > 0 ? (
          <AbsoluteFill
            style={{
              background: "rgba(242,242,242,0.1)",
              opacity: dotsOpacity,
            }}
          />
        ) : null}
        <AbsoluteFill
          style={{
            opacity: contentOpacity,
            transform: `scale(${interpolate(grow, [0, 1], [1.05, 1], clampOpts)})`,
          }}
        >
          {children}
        </AbsoluteFill>
        {/* The dots live INSIDE the growing bubble — they are its content
            while it is still a typing pill, and dissolve as it opens. */}
        {dotsOpacity > 0 ? (
          <div
            style={{
              position: "absolute",
              left: cx,
              top: cy,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          >
            <Dots color={dotColor} opacity={dotsOpacity} />
          </div>
        ) : null}
      </AbsoluteFill>
      {borderOpacity > 0 ? (
        <div
          style={{
            position: "absolute",
            left: insetLeft,
            top: insetTop,
            right: insetRight,
            bottom: insetBottom,
            borderRadius: radius,
            border: `1px solid ${surfaceBorder}`,
            opacity: borderOpacity * Math.min(1, pillScale),
            pointerEvents: "none",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

export function bubbleBloom(
  props: BubbleBloomProps = {},
): TransitionPresentation<BubbleBloomProps> {
  return {
    component: BubbleBloomPresentation,
    props,
  };
}
