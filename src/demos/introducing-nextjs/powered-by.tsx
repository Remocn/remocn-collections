import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRIGHT, HAIRLINE, INK, MUTED, SANS, clampOpts } from "./theme";

// ---------------------------------------------------------------------------
// "Built on a foundation of fast, production-grade tooling" — the Powered By
// chip with its circuit traces drawing outward to the React / Turbopack /
// SWC cards, light pulses riding the wires once they're live. Trace and icon
// colors are the site's own illustration surface.
// ---------------------------------------------------------------------------

const easeOut = Easing.out(Easing.cubic);

const CHIP = { cx: 640, cy: 240, w: 158, h: 48 };
const CARD_Y = 416;
const CARD_XS = [310, 640, 970];

// Orthogonal traces with rounded corners, chip → card tops. One per card; no
// decorative dead-end runs — every trace lands on a card.
const TRACES: Array<{ d: string; pulse?: string; phase?: number }> = [
  {
    d: `M600 ${CHIP.cy + 24} L600 330 Q600 338 592 338 L318 338 Q310 338 310 346 L310 ${CARD_Y - 4}`,
    pulse: "#61DAFB",
    phase: 0.15,
  },
  {
    d: `M640 ${CHIP.cy + 24} L640 ${CARD_Y - 4}`,
    pulse: "#3291FF",
    phase: 0.55,
  },
  {
    d: `M680 ${CHIP.cy + 24} L680 330 Q680 338 688 338 L962 338 Q970 338 970 346 L970 ${CARD_Y - 4}`,
    pulse: "#F5A623",
    phase: 0.35,
  },
];

const ReactIcon: React.FC = () => (
  <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
    {[0, 60, 120].map((deg) => (
      <ellipse
        key={deg}
        cx="16"
        cy="16"
        rx="14"
        ry="5.4"
        stroke={INK}
        strokeWidth="1.4"
        transform={`rotate(${deg} 16 16)`}
      />
    ))}
    <circle cx="16" cy="16" r="2.6" fill={INK} />
  </svg>
);

const TurbopackIcon: React.FC = () => (
  <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
    <rect x="4" y="4" width="24" height="24" rx="5" stroke={INK} strokeWidth="1.6" />
    <rect x="11" y="11" width="10" height="10" rx="2" fill={INK} />
  </svg>
);

const SwcIcon: React.FC = () => (
  <svg width={40} height={32} viewBox="0 0 40 32" fill="none">
    {[7, 17, 27].map((cx, i) => (
      <circle
        key={i}
        cx={cx}
        cy="16"
        r="7"
        stroke="url(#swc-grad)"
        strokeWidth="4.6"
        strokeDasharray="33 11"
        transform={`rotate(${-38 + i * 8} ${cx} 16)`}
      />
    ))}
    <defs>
      <linearGradient id="swc-grad" x1="0" y1="16" x2="40" y2="16" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D24B32" />
        <stop offset="0.55" stopColor="#F0813F" />
        <stop offset="1" stopColor="#F5C13D" />
      </linearGradient>
    </defs>
  </svg>
);

const CARDS = [
  {
    icon: <ReactIcon />,
    title: "React",
    subtitle: "The library for web and native user interfaces, built on the latest React features.",
  },
  {
    icon: <TurbopackIcon />,
    title: "Turbopack",
    subtitle: "An incremental bundler optimized for JavaScript and TypeScript, written in Rust.",
  },
  {
    icon: <SwcIcon />,
    title: "Speedy Web Compiler",
    subtitle: "An extensible Rust based platform for the next generation of fast developer tools.",
  },
];

export const PoweredByScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headWords = "Built on a foundation of fast, production-grade tooling".split(" ");
  const chipIn = spring({
    frame: frame - 14,
    fps,
    config: { damping: 13, stiffness: 150, mass: 0.8 },
  });
  const pulsesOn = interpolate(frame, [52, 66], [0, 1], clampOpts);

  return (
    <AbsoluteFill>
      {/* Heading */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 84,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 33,
          color: BRIGHT,
          whiteSpace: "pre",
        }}
      >
        {headWords.map((w, i) => {
          const p = interpolate(frame - 4 - i * 2, [0, 18], [0, 1], {
            ...clampOpts,
            easing: easeOut,
          });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                opacity: p,
                transform: `translateY(${(1 - p) * 14}px)`,
                filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined,
              }}
            >
              {w}
              {i < headWords.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>

      {/* Traces */}
      <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
        {TRACES.map((trace, i) => {
          const draw = interpolate(frame - (22 + i * 4), [0, 22], [0, 1], {
            ...clampOpts,
            easing: Easing.bezier(0.4, 0, 0.3, 1),
          });
          const travel = 1 - ((frame * 0.012 + (trace.phase ?? 0)) % 1);
          return (
            <React.Fragment key={i}>
              <path
                d={trace.d}
                stroke="rgba(237,237,237,0.16)"
                strokeWidth={1.4}
                fill="none"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - draw}
              />
              {trace.pulse ? (
                <path
                  d={trace.d}
                  stroke={trace.pulse}
                  strokeWidth={2}
                  strokeLinecap="round"
                  fill="none"
                  pathLength={1}
                  strokeDasharray="0.14 0.86"
                  strokeDashoffset={travel}
                  opacity={pulsesOn * 0.9}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </svg>

      {/* Powered By chip */}
      <div
        style={{
          position: "absolute",
          left: CHIP.cx - CHIP.w / 2,
          top: CHIP.cy - CHIP.h / 2,
          width: CHIP.w,
          height: CHIP.h,
          borderRadius: 10,
          background: "#161616",
          border: `1px solid ${HAIRLINE}`,
          boxShadow: "0 14px 40px rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 18,
          color: MUTED,
          opacity: Math.min(1, chipIn * 1.3),
          transform: `scale(${interpolate(chipIn, [0, 1], [0.85, 1])})`,
        }}
      >
        Powered By
        {/* Pins */}
        {[-3, -2, -1, 1, 2, 3].map((k) => (
          <React.Fragment key={k}>
            <div
              style={{
                position: "absolute",
                top: -5,
                left: CHIP.w / 2 + k * 18 - 2,
                width: 4,
                height: 5,
                background: "rgba(237,237,237,0.28)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -5,
                left: CHIP.w / 2 + k * 18 - 2,
                width: 4,
                height: 5,
                background: "rgba(237,237,237,0.28)",
              }}
            />
          </React.Fragment>
        ))}
      </div>

      {/* Cards */}
      {CARDS.map((card, i) => {
        const s = spring({
          frame: frame - (34 + i * 7),
          fps,
          config: { damping: 13, stiffness: 130, mass: 0.9 },
        });
        return (
          <div
            key={card.title}
            style={{
              position: "absolute",
              left: CARD_XS[i] - 150,
              top: CARD_Y,
              width: 300,
              height: 172,
              borderRadius: 12,
              background: "#0e0e0e",
              border: `1px solid ${HAIRLINE}`,
              padding: "20px 22px",
              opacity: Math.min(1, s * 1.3),
              transform: `translateY(${(1 - s) * 26}px)`,
            }}
          >
            <div style={{ height: 34, display: "flex", alignItems: "center" }}>
              {card.icon}
            </div>
            <div
              style={{
                marginTop: 12,
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: 19,
                color: BRIGHT,
              }}
            >
              {card.title}
              <span style={{ color: MUTED, marginLeft: 7, fontWeight: 400 }}>↗</span>
            </div>
            <div
              style={{
                marginTop: 8,
                fontFamily: SANS,
                fontWeight: 400,
                fontSize: 13.5,
                lineHeight: 1.5,
                color: MUTED,
              }}
            >
              {card.subtitle}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
