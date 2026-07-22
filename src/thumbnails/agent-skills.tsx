import React from "react";
import { AbsoluteFill } from "remotion";
import { MANROPE, MONO, REMOCN, RemocnLockup, ThumbFrame } from "./kit";

/**
 * "Claude Code makes the video" — the meta premise of the spot. Claude keeps its
 * own Anthropic clay; the video it produces is the ghosted stack of light
 * component cards bleeding off the right edge.
 */
const GROUND = "#0B0B0C";
const CLAY = "#D97757";
const CLAY_CANVAS = "#F0EEE6";

// The Anthropic mark, verbatim from src/demos/agent-skills/index.tsx.
const CLAUDE_PATH =
  "m50.228 170.321 50.357-28.257.843-2.463-.843-1.361h-2.462l-8.426-.518-28.775-.778-24.952-1.037-24.175-1.296-6.092-1.297L0 125.796l.583-3.759 5.12-3.434 7.324.648 16.202 1.101 24.304 1.685 17.629 1.037 26.118 2.722h4.148l.583-1.685-1.426-1.037-1.101-1.037-25.147-17.045-27.22-18.017-14.258-10.37-7.713-5.25-3.888-4.925-1.685-10.758 7-7.713 9.397.649 2.398.648 9.527 7.323 20.35 15.75L94.817 91.9l3.889 3.24 1.555-1.102.195-.777-1.75-2.917-14.453-26.118-15.425-26.572-6.87-11.018-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0 82.05 1.426l4.472 3.888 6.61 15.101 10.694 23.786 16.591 32.34 4.861 9.592 2.592 8.879.973 2.722h1.685v-1.556l1.36-18.211 2.528-22.36 2.463-28.776.843-8.1 4.018-9.722 7.971-5.25 6.222 2.981 5.12 7.324-.713 4.73-3.046 19.768-5.962 30.98-3.889 20.739h2.268l2.593-2.593 10.499-13.934 17.628-22.036 7.778-8.749 9.073-9.657 5.833-4.601h11.018l8.1 12.055-3.628 12.443-11.342 14.388-9.398 12.184-13.48 18.147-8.426 14.518.778 1.166 2.01-.194 30.46-6.481 16.462-2.982 19.637-3.37 8.88 4.148.971 4.213-3.5 8.62-20.998 5.184-24.628 4.926-36.682 8.685-.454.324.519.648 16.526 1.555 7.065.389h17.304l32.21 2.398 8.426 5.574 5.055 6.805-.843 5.184-12.962 6.611-17.498-4.148-40.83-9.721-14-3.5h-1.944v1.167l11.666 11.406 21.387 19.314 26.767 24.887 1.36 6.157-3.434 4.86-3.63-.518-23.526-17.693-9.073-7.972-20.545-17.304h-1.36v1.814l4.73 6.935 25.017 37.59 1.296 11.536-1.814 3.76-6.481 2.268-7.13-1.297-14.647-20.544-15.1-23.138-12.185-20.739-1.49.843-7.194 77.448-3.37 3.953-7.778 2.981-6.48-4.925-3.436-7.972 3.435-15.749 4.148-20.544 3.37-16.333 3.046-20.285 1.815-6.74-.13-.454-1.49.194-15.295 20.999-23.267 31.433-18.406 19.702-4.407 1.75-7.648-3.954.713-7.064 4.277-6.286 25.47-32.405 15.36-20.092 9.917-11.6-.065-1.686h-.583L44.07 198.125l-12.055 1.555-5.185-4.86.648-7.972 2.463-2.593 20.35-13.999-.064.065Z";

/** A produced-component card — the artefact Claude hands back. */
const Card: React.FC<{
  left: number;
  top: number;
  rotate: number;
  children: React.ReactNode;
}> = ({ left, top, rotate, children }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width: 434,
      padding: 30,
      borderRadius: 20,
      background: "#FAFAFA",
      border: "1px solid rgba(10,10,10,0.10)",
      boxShadow: "0 34px 80px rgba(0,0,0,0.62)",
      transform: `rotate(${rotate}deg)`,
      display: "flex",
      flexDirection: "column",
      gap: 16,
    }}
  >
    {children}
  </div>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      fontFamily: MANROPE,
      fontWeight: 600,
      fontSize: 42,
      lineHeight: "42px",
      letterSpacing: "-0.02em",
      color: "#0A0A0A",
    }}
  >
    {children}
  </span>
);

export const AgentSkillsThumb: React.FC = () => (
  <ThumbFrame background={GROUND}>
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: -180,
          top: -220,
          width: 860,
          height: 860,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(217,119,87,0.26) 0%, rgba(217,119,87,0.08) 40%, rgba(11,11,12,0) 70%)",
          filter: "blur(22px)",
        }}
      />

      {/* The produced video: a leaning stack of finished component cards. */}
      <Card left={846} top={72} rotate={-8}>
        <Label>Confirm your email</Label>
        <div
          style={{
            height: 68,
            borderRadius: 12,
            border: "2px solid rgba(10,10,10,0.16)",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            fontFamily: MANROPE,
            fontSize: 32,
            color: "rgba(10,10,10,0.5)",
          }}
        >
          m@example.com
        </div>
      </Card>

      <Card left={906} top={288} rotate={5}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 13,
              background: "#0A0A0A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width={30} height={30} viewBox="0 0 24 24">
              <path
                d="M4 12.5 9.5 18 20 6.5"
                fill="none"
                stroke="#fff"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <Label>Accept terms</Label>
        </div>
      </Card>

      <Card left={866} top={468} rotate={-4}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Label>Framework</Label>
          <span
            style={{
              fontFamily: MANROPE,
              fontWeight: 500,
              fontSize: 34,
              color: "rgba(10,10,10,0.55)",
            }}
          >
            Next.js
          </span>
        </div>
      </Card>

      {/* Left column — the mark, the claim, the prompt that started it. */}
      <div
        style={{
          position: "absolute",
          left: 84,
          top: 0,
          width: 740,
          height: 720,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 32,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: 22,
              background: CLAY_CANVAS,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width={52} height={52} viewBox="0 0 256 257">
              <path fill={CLAY} d={CLAUDE_PATH} />
            </svg>
          </div>
          <RemocnLockup size={42} color="rgba(242,242,242,0.88)" />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {[
            { text: "Claude Code", color: CLAY },
            { text: "makes the video", color: REMOCN.ink },
          ].map((line) => (
            <div
              key={line.text}
              style={{
                fontFamily: MANROPE,
                fontWeight: 800,
                fontSize: 100,
                lineHeight: "104px",
                letterSpacing: "-0.045em",
                color: line.color,
              }}
            >
              {line.text}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 26px",
            borderRadius: 14,
            background: "rgba(217,119,87,0.12)",
            border: "2px solid rgba(217,119,87,0.42)",
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontWeight: 500,
              fontSize: 48,
              lineHeight: "48px",
              color: CLAY,
            }}
          >
            /remocn make a video
          </span>
        </div>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
