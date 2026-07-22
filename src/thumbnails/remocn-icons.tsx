import React from "react";
import { AbsoluteFill } from "remotion";
import { MANROPE, REMOCN, RemocnLockup, ThumbFrame } from "./kit";

import { BellIconStatic } from "@/components/remocn/icon-bell";
import { HeartIconStatic } from "@/components/remocn/icon-heart";
import { StarIconStatic } from "@/components/remocn/icon-star";
import { ZapIconStatic } from "@/components/remocn/icon-zap";
import { SearchIconStatic } from "@/components/remocn/icon-search";
import { RocketIconStatic } from "@/components/remocn/icon-rocket";
import { SendIconStatic } from "@/components/remocn/icon-send";
import { PlayIconStatic } from "@/components/remocn/icon-play";
import { SettingsIconStatic } from "@/components/remocn/icon-settings";
import { LockIconStatic } from "@/components/remocn/icon-lock";
import { CloudIconStatic } from "@/components/remocn/icon-cloud";
import { CameraIconStatic } from "@/components/remocn/icon-camera";
import { MailIconStatic } from "@/components/remocn/icon-mail";
import { CheckCircleIconStatic } from "@/components/remocn/icon-check-circle";
import { SunIconStatic } from "@/components/remocn/icon-sun";
import { MoonIconStatic } from "@/components/remocn/icon-moon";
import { PartyPopperIconStatic } from "@/components/remocn/icon-party-popper";
import { TrendingUpIconStatic } from "@/components/remocn/icon-trending-up";
import { WalletIconStatic } from "@/components/remocn/icon-wallet";
import { CrownIconStatic } from "@/components/remocn/icon-crown";
import { TrophyIconStatic } from "@/components/remocn/icon-trophy";
import { FlameIconStatic } from "@/components/remocn/icon-flame";
import { SparklesIconStatic } from "@/components/remocn/icon-sparkles";
import { TimerIconStatic } from "@/components/remocn/icon-timer";

type IconComp = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

/** the gallery beat's own 24, in the order the wave draws them */
const WALL: IconComp[] = [
  PlayIconStatic,
  BellIconStatic,
  HeartIconStatic,
  StarIconStatic,
  SearchIconStatic,
  RocketIconStatic,
  ZapIconStatic,
  SendIconStatic,
  SettingsIconStatic,
  LockIconStatic,
  CloudIconStatic,
  CameraIconStatic,
  MailIconStatic,
  CheckCircleIconStatic,
  SunIconStatic,
  MoonIconStatic,
  PartyPopperIconStatic,
  TrendingUpIconStatic,
  WalletIconStatic,
  CrownIconStatic,
  TrophyIconStatic,
  FlameIconStatic,
  SparklesIconStatic,
  TimerIconStatic,
];

const COLS = 4;
const ROWS = 5;
const CELL = 136;
const GLYPH = 94;
// the bell is the icon that reveals the product — it keeps the accent
const LIME_AT = 1;

/**
 * "The icons move" — the announcement of remocn icons, split: the claim held
 * in the left column, the real registry wall standing to the right with the
 * bell (the icon that reveals the product) carrying the accent.
 */
export const RemocnIconsThumb: React.FC = () => (
  <ThumbFrame background={REMOCN.obsidian}>
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 700,
          top: -110,
          width: 780,
          height: 940,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(195,232,141,0.16) 0%, rgba(195,232,141,0.05) 40%, rgba(20,19,24,0) 68%)",
          filter: "blur(24px)",
        }}
      />

      {/* the wall */}
      <div
        style={{
          position: "absolute",
          left: 766,
          top: 22,
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
          gridAutoRows: `${CELL}px`,
        }}
      >
        {WALL.slice(0, COLS * ROWS).map((Icon, i) => (
          <div
            key={i}
            style={{
              width: CELL,
              height: CELL,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              size={GLYPH}
              color={i === LIME_AT ? REMOCN.lime : REMOCN.ink}
              strokeWidth={2.6}
            />
          </div>
        ))}
      </div>

      {/* a soft edge so the wall bleeds instead of stopping */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(20,19,24,1) 46%, rgba(20,19,24,0.55) 55%, rgba(20,19,24,0) 64%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 76,
          top: 0,
          width: 620,
          height: 720,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 40,
        }}
      >
        <RemocnLockup size={54} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          {[
            { text: "The icons", color: REMOCN.ink },
            { text: "move", color: REMOCN.lime },
          ].map((line) => (
            <div
              key={line.text}
              style={{
                fontFamily: MANROPE,
                fontWeight: 800,
                fontSize: 124,
                lineHeight: "122px",
                letterSpacing: "-0.045em",
                color: line.color,
              }}
            >
              {line.text}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              fontFamily: MANROPE,
              fontWeight: 500,
              fontSize: 50,
              lineHeight: "56px",
              letterSpacing: "-0.02em",
              color: "rgba(242,242,242,0.9)",
            }}
          >
            100 Lucide icons,
            <br />
            rewritten for video
          </span>
        </div>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
