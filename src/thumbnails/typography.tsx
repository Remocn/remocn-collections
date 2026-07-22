import React from "react";
import { AbsoluteFill } from "remotion";
import { MANROPE, REMOCN, RemocnLockup, ThumbFrame } from "./kit";

/**
 * The typography wave, set as typography. No illustrative object — the claim is
 * the frame, and each word is caught in a different animation state: a motion
 * trail on "text", a per-character rise on "animations", the caret-wipe caret
 * parked at the end of the line.
 */
const SIZE = 144;
const LEAD = 152;
const LEFT = 84;

/** Faint specimen rules, one under each line of the ladder. */
const Rule: React.FC<{ top: number }> = ({ top }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top,
      width: 1280,
      height: 2,
      background: "rgba(242,242,242,0.10)",
    }}
  />
);

const lineStyle: React.CSSProperties = {
  fontFamily: MANROPE,
  fontWeight: 800,
  fontSize: SIZE,
  lineHeight: `${LEAD}px`,
  letterSpacing: "-0.045em",
  color: REMOCN.ink,
  whiteSpace: "pre",
};

/** "text" caught mid soft-blur-in — the sharp word over its own motion trail. */
const Trailed: React.FC<{ children: string }> = ({ children }) => (
  <span style={{ position: "relative", display: "inline-block" }}>
    <span
      style={{
        position: "absolute",
        left: 0,
        top: -58,
        filter: "blur(13px)",
        opacity: 0.16,
      }}
    >
      {children}
    </span>
    <span
      style={{
        position: "absolute",
        left: 0,
        top: -30,
        filter: "blur(5px)",
        opacity: 0.3,
      }}
    >
      {children}
    </span>
    <span style={{ position: "relative" }}>{children}</span>
  </span>
);

/**
 * "animations" caught mid per-character rise — letters still climbing in. The
 * drop and the fade are both shallow on purpose: at grid size a deep tail stops
 * reading as an effect and starts reading as damage.
 */
const Rising: React.FC<{ children: string }> = ({ children }) => (
  <span style={{ display: "inline-block" }}>
    {children.split("").map((ch, i) => {
      const t = i / (children.length - 1);
      return (
        <span
          key={`${ch}-${i}`}
          style={{
            display: "inline-block",
            transform: `translateY(${Math.round(t * 24)}px)`,
            opacity: 1 - t * 0.14,
          }}
        >
          {ch}
        </span>
      );
    })}
  </span>
);

export const TypographyThumb: React.FC = () => (
  <ThumbFrame background={REMOCN.obsidian}>
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: -140,
          top: 120,
          width: 900,
          height: 760,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(195,232,141,0.16) 0%, rgba(195,232,141,0.05) 40%, rgba(20,19,24,0) 70%)",
          filter: "blur(26px)",
        }}
      />

      <Rule top={300} />
      <Rule top={452} />
      <Rule top={604} />

      <div style={{ position: "absolute", left: LEFT, top: 48 }}>
        <RemocnLockup size={44} color="rgba(242,242,242,0.88)" />
      </div>

      <div style={{ position: "absolute", left: LEFT, top: 148 }}>
        <div style={lineStyle}>
          <span style={{ color: REMOCN.lime }}>18</span> new
        </div>
        <div style={lineStyle}>
          <Trailed>text</Trailed>
        </div>
        <div style={{ ...lineStyle, display: "flex", alignItems: "baseline" }}>
          <Rising>animations</Rising>
          <span
            style={{
              display: "inline-block",
              width: 17,
              height: 112,
              marginLeft: 20,
              borderRadius: 3,
              background: REMOCN.lime,
              transform: "translateY(20px)",
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: LEFT,
          top: 634,
          fontFamily: MANROPE,
          fontWeight: 600,
          fontSize: 52,
          lineHeight: "52px",
          color: "rgba(242,242,242,0.9)",
        }}
      >
        Built on interpolate and spring
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
