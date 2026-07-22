import React from "react";
import { AbsoluteFill } from "remotion";
import { MANROPE, REMOCN, RemocnLockup, ThumbFrame } from "./kit";

/**
 * "shadcn/ui for video" — the video's own positioning beat, set as the whole
 * frame. A stack of shader tiles bleeds off the right edge so the registry
 * reads as colour even at 210px wide.
 */
const Tile: React.FC<{
  left: number;
  top: number;
  width: number;
  height: number;
  rotate: number;
  background: string;
  children?: React.ReactNode;
}> = ({ left, top, width, height, rotate, background, children }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width,
      height,
      borderRadius: 26,
      transform: `rotate(${rotate}deg)`,
      background,
      boxShadow: "0 40px 90px rgba(0,0,0,0.6)",
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

export const IntroducingRemocnThumb: React.FC = () => (
  <ThumbFrame background={REMOCN.obsidian}>
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: -260,
          top: -300,
          width: 820,
          height: 820,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(124,118,160,0.28) 0%, rgba(87,82,118,0.10) 42%, rgba(20,19,24,0) 70%)",
          filter: "blur(24px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 40,
          width: 900,
          height: 900,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(195,232,141,0.20) 0%, rgba(195,232,141,0.07) 38%, rgba(20,19,24,0) 68%)",
          filter: "blur(20px)",
        }}
      />

      <Tile
        left={838}
        top={40}
        width={324}
        height={404}
        rotate={-10}
        background="radial-gradient(120% 100% at 22% 14%, #a49dcb 0%, #7d76a0 32%, #55506e 62%, #39364d 100%)"
      >
        <svg width={324} height={404} viewBox="0 0 324 404">
          <g stroke="#ffffff">
            <line x1="20" y1="-30" x2="-110" y2="434" strokeWidth="6" strokeOpacity="0.05" />
            <line x1="74" y1="-30" x2="-56" y2="434" strokeWidth="2" strokeOpacity="0.12" />
            <line x1="112" y1="-30" x2="-18" y2="434" strokeWidth="11" strokeOpacity="0.06" />
            <line x1="176" y1="-30" x2="46" y2="434" strokeWidth="3" strokeOpacity="0.14" />
            <line x1="210" y1="-30" x2="80" y2="434" strokeWidth="7" strokeOpacity="0.05" />
            <line x1="266" y1="-30" x2="136" y2="434" strokeWidth="2" strokeOpacity="0.13" />
            <line x1="304" y1="-30" x2="174" y2="434" strokeWidth="14" strokeOpacity="0.05" />
            <line x1="370" y1="-30" x2="240" y2="434" strokeWidth="3" strokeOpacity="0.12" />
            <line x1="416" y1="-30" x2="286" y2="434" strokeWidth="8" strokeOpacity="0.05" />
          </g>
        </svg>
      </Tile>

      <Tile
        left={962}
        top={236}
        width={300}
        height={376}
        rotate={7}
        background="radial-gradient(140% 120% at 78% 18%, #e6e2f5 0%, #C3E88D 20%, #7d76a0 56%, #4a4661 100%)"
      />

      <Tile
        left={1096}
        top={440}
        width={260}
        height={320}
        rotate={-7}
        background="radial-gradient(110% 110% at 26% 24%, #C3E88D 0%, #8fa864 44%, #39412a 100%)"
      />

      <div
        style={{
          position: "absolute",
          left: 84,
          top: 0,
          width: 756,
          height: 720,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 44,
        }}
      >
        <RemocnLockup size={58} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          {[
            { text: "shadcn/ui", color: REMOCN.ink },
            { text: "for video", color: REMOCN.lime },
          ].map((line) => (
            <div
              key={line.text}
              style={{
                fontFamily: MANROPE,
                fontWeight: 800,
                fontSize: 132,
                lineHeight: "130px",
                letterSpacing: "-0.045em",
                color: line.color,
              }}
            >
              {line.text}
            </div>
          ))}
        </div>

        {/* The install command was tertiary and died at grid size; the count is
            the proof worth keeping, so it takes the whole line. */}
        <span
          style={{
            fontFamily: MANROPE,
            fontWeight: 500,
            fontSize: 54,
            lineHeight: "54px",
            letterSpacing: "-0.02em",
            color: "rgba(242,242,242,0.88)",
          }}
        >
          110 components
        </span>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
