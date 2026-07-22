import React from "react";
import { AbsoluteFill } from "remotion";
import { GEIST, MANROPE, REMOCN, ThumbFrame } from "./kit";

/**
 * One conversation, three skins — so the frame is cut into three skewed bands,
 * each running the identical two messages on its own surface. The headline
 * lands across the two dark bands, which is why they lean: no scrim is needed
 * over Telegram's light surface, and none of the three gets recoloured.
 * iMessage blue is the colour moment.
 */

const IMESSAGE_BLUE = "#0a7cff";
const TELEGRAM_BLUE = "#3390ec";

type Skin = {
  name: string;
  ground: string;
  incomingBg: string;
  incomingFg: string;
  outgoingBg: string;
  outgoingFg: string;
  radius: number;
  /** where this band's content column sits, in unskewed frame coordinates */
  left: number;
  width: number;
};

const SKINS: Skin[] = [
  {
    name: "chat-flow",
    ground: "#1a1922",
    incomingBg: "#232231",
    incomingFg: "#f2f2f2",
    outgoingBg: REMOCN.lime,
    outgoingFg: "#252d1b",
    radius: 26,
    left: 48,
    width: 322,
  },
  {
    name: "imessage-chat-flow",
    ground: "#000000",
    incomingBg: "#26262a",
    incomingFg: "#ffffff",
    outgoingBg: IMESSAGE_BLUE,
    outgoingFg: "#ffffff",
    radius: 28,
    left: 444,
    width: 344,
  },
  {
    name: "telegram-chat-flow",
    ground: "#ffffff",
    incomingBg: "#f1f3f5",
    incomingFg: "#0f1419",
    outgoingBg: TELEGRAM_BLUE,
    outgoingFg: "#ffffff",
    radius: 20,
    left: 864,
    width: 318,
  },
];

const Bubble: React.FC<{
  text: string;
  bg: string;
  fg: string;
  radius: number;
  side: "left" | "right";
}> = ({ text, bg, fg, radius, side }) => (
  <div
    style={{
      alignSelf: side === "right" ? "flex-end" : "flex-start",
      maxWidth: 300,
      background: bg,
      color: fg,
      borderRadius: radius,
      borderBottomRightRadius: side === "right" ? 8 : radius,
      borderBottomLeftRadius: side === "left" ? 8 : radius,
      padding: "14px 22px",
      fontFamily: GEIST,
      fontSize: 40,
      lineHeight: "48px",
    }}
  >
    {text}
  </div>
);

export const ChatChangelogThumb: React.FC = () => (
  <ThumbFrame background={REMOCN.obsidian}>
    <AbsoluteFill>
      {/* the three surfaces, cut on a lean */}
      <div
        style={{
          position: "absolute",
          left: -100,
          top: -40,
          width: 1480,
          height: 800,
          transform: "skewX(-6deg)",
          transformOrigin: "center",
        }}
      >
        {[
          { left: 0, width: 527, bg: SKINS[0].ground },
          { left: 527, width: 427, bg: SKINS[1].ground },
          { left: 954, width: 526, bg: SKINS[2].ground },
        ].map((band) => (
          <div
            key={band.left}
            style={{
              position: "absolute",
              left: band.left,
              top: 0,
              width: band.width,
              height: 800,
              background: band.bg,
            }}
          />
        ))}
      </div>

      {/* content rides upright over the lean */}
      {SKINS.map((skin) => (
        <div
          key={skin.name}
          style={{
            position: "absolute",
            left: skin.left,
            width: skin.width,
            bottom: 40,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <Bubble
            text="Same thread?"
            bg={skin.incomingBg}
            fg={skin.incomingFg}
            radius={skin.radius}
            side="left"
          />
          <Bubble
            text="Same message API."
            bg={skin.outgoingBg}
            fg={skin.outgoingFg}
            radius={skin.radius}
            side="right"
          />
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          left: 76,
          top: 48,
          width: 700,
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {[
            { text: "One thread,", color: REMOCN.ink },
            { text: "three skins", color: IMESSAGE_BLUE },
          ].map((line) => (
            <div
              key={line.text}
              style={{
                fontFamily: MANROPE,
                fontWeight: 800,
                fontSize: 104,
                lineHeight: "104px",
                letterSpacing: "-0.045em",
                whiteSpace: "nowrap",
                color: line.color,
              }}
            >
              {line.text}
            </div>
          ))}
        </div>
        <span
          style={{
            fontFamily: MANROPE,
            fontWeight: 600,
            fontSize: 48,
            lineHeight: "54px",
            letterSpacing: "-0.02em",
            color: "rgba(242,242,242,0.9)",
          }}
        >
          Built from message-bubble and typing-indicator
        </span>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
