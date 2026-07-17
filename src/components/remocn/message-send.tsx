"use client";

import type React from "react";
import { AbsoluteFill, Easing, interpolate, useVideoConfig } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export type MessageSendProps = {
  /**
   * How far the outgoing scene scrolls up before it is gone, in frame
   * heights. The thread advancing — old messages leave the top.
   */
  scroll?: number;
  /** Peak blur on the outgoing scene as it leaves. */
  blur?: number;
  /**
   * Spring overshoot of the incoming scene: it rises past its resting place
   * and settles back, like a bubble that was just sent. 0 disables it.
   */
  overshoot?: number;
};

// A chat thread advancing on send: the outgoing scene scrolls up and away
// like older messages, while the incoming scene springs in from the composer
// edge below, overshooting slightly before it settles. No mask, no chrome —
// the physics of the send gesture applied to whole scenes.
const MessageSendPresentation: React.FC<
  TransitionPresentationComponentProps<MessageSendProps>
> = ({ children, presentationProgress, presentationDirection, passedProps }) => {
  const { height } = useVideoConfig();
  const { scroll = 0.55, blur = 5, overshoot = 0.18 } = passedProps;

  const entering = presentationDirection === "entering";
  const p = presentationProgress;

  if (!entering) {
    return (
      <AbsoluteFill
        style={{
          opacity: interpolate(p, [0.45, 0.85], [1, 0], clampOpts),
          transform: `translateY(${interpolate(p, [0, 1], [0, -height * scroll], {
            ...clampOpts,
            easing: Easing.bezier(0.45, 0, 0.4, 1),
          })}px)`,
          filter: `blur(${interpolate(p, [0.25, 0.9], [0, blur], clampOpts)}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  // Identity once settled — the entering presentation stays mounted at
  // progress 1 for the rest of the scene.
  if (p >= 0.999) {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  // The send: rises from below with a slight overshoot, then settles.
  const rise = interpolate(p, [0.12, 0.96], [0, 1], {
    ...clampOpts,
    easing: Easing.bezier(0.22, 1 + overshoot, 0.36, 1),
  });

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(p, [0.12, 0.3], [0, 1], clampOpts),
        transform: `translateY(${(1 - rise) * height}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export function messageSend(
  props: MessageSendProps = {},
): TransitionPresentation<MessageSendProps> {
  return {
    component: MessageSendPresentation,
    props,
  };
}
