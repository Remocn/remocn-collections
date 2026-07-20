// Acts two and three — the count and the wild.
// The count: every video lands as one mosaic wall (the proof), the wall
// recedes, and the odometer rolls to 41. The wild: the registry is already
// outside our repo — blume gets a card, the rest roll as mono rows.

import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { RollingNumber } from "@/components/remocn/rolling-number";
import { SoftBlurIn } from "@/components/remocn/soft-blur-in";
import {
  SHOWCASE_VIDEOS,
  VIDEO_COUNT,
  WILD_FEATURED,
  WILD_REPOS,
  WILD_TOTAL,
} from "./media";

const INK = "#f2f2f2";
const MUTED = "rgba(242,242,242,0.62)";
const FAINT = "rgba(242,242,242,0.4)";
const LIME = "#C3E88D";
const HAIRLINE = "rgba(242,242,242,0.16)";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const easeOut = Easing.out(Easing.cubic);

// deterministic 0..1 hash (same family as the layout jitter)
const hash01 = (seed: string): number => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h = Math.imul(h ^ (h >>> 13), 2246822519);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

// ---------------------------------------------------------------------------
// The count.
// ---------------------------------------------------------------------------
const COLS = 7;
const TILE_W = 164;
const TILE_H = 92;
const GAP = 12;

export const CountAct: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // tiles spring in on a shuffled stagger, then the wall recedes for the number
  const recede = interpolate(frame, [58, 92], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      {/* the mosaic — all 41 at once */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${TILE_W}px)`,
          gap: GAP,
          transform: `translate(-50%, -50%) translateY(${recede * -170}px) scale(${
            1 - recede * 0.24
          })`,
          opacity: 1 - recede * 0.72,
        }}
      >
        {SHOWCASE_VIDEOS.map((v, i) => {
          const order = hash01(`tile:${v.id}`);
          const s = spring({
            frame: frame - (4 + order * 40 + (i % COLS) * 1.5),
            fps,
            config: { damping: 15, stiffness: 160, mass: 0.7 },
          });
          return (
            <div
              key={v.id}
              style={{
                width: TILE_W,
                height: TILE_H,
                borderRadius: 6,
                overflow: "hidden",
                border: `1px solid ${HAIRLINE}`,
                background: "#0b0a0e",
                opacity: s,
                transform: `scale(${0.6 + 0.4 * s}) translateY(${(1 - s) * 26}px)`,
              }}
            >
              <Img
                src={staticFile(v.thumb)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          );
        })}
      </div>

      {/* the odometer */}
      <Sequence from={82} durationInFrames={112}>
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <RollingNumber from={0} to={VIDEO_COUNT} fontSize={210} color={INK} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={120}>
        <CountLabel frame={frame - 120} />
      </Sequence>
    </AbsoluteFill>
  );
};

const CountLabel: React.FC<{ frame: number }> = ({ frame }) => {
  const p1 = interpolate(frame, [0, 18], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });
  const p2 = interpolate(frame, [24, 40], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 118,
      }}
    >
      <div
        style={{
          fontFamily: "var(--showcases-sans)",
          fontWeight: 400,
          fontSize: 46,
          color: INK,
          opacity: p1,
          transform: `translateY(${(1 - p1) * 14}px)`,
        }}
      >
        videos made with <span style={{ color: LIME }}>remocn</span>
      </div>
      <div
        style={{
          fontFamily: "var(--showcases-mono)",
          fontSize: 19,
          color: MUTED,
          marginTop: 18,
          opacity: p2,
          transform: `translateY(${(1 - p2) * 10}px)`,
        }}
      >
        22 minutes of footage, all of it deterministic
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// The wild.
// ---------------------------------------------------------------------------
export const WildAct: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardS = spring({
    frame: frame - 34,
    fps,
    config: { damping: 15, stiffness: 120, mass: 0.9 },
  });

  return (
    <AbsoluteFill>
      {/* the title sits in its own top band so it never collides with content */}
      <Sequence from={8}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 148,
            height: 80,
          }}
        >
          <SoftBlurIn
            text="And it’s not just us"
            fontSize={54}
            fontWeight={400}
            color={INK}
          />
        </div>
      </Sequence>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 310,
          display: "flex",
          justifyContent: "center",
          gap: 72,
          alignItems: "flex-start",
        }}
      >
        {/* blume — the featured outside build */}
        <div
          style={{
            width: 380,
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 14,
            padding: "24px 26px",
            background: "rgba(242,242,242,0.03)",
            opacity: cardS,
            transform: `translateY(${(1 - cardS) * 22}px) scale(${0.94 + 0.06 * cardS})`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <RepoGlyph />
            <span
              style={{
                fontFamily: "var(--showcases-sans)",
                fontWeight: 600,
                fontSize: 25,
                color: INK,
              }}
            >
              haydenbleasel<span style={{ color: FAINT }}> / </span>blume
            </span>
          </div>
          <div
            style={{
              fontFamily: "var(--showcases-sans)",
              fontWeight: 400,
              fontSize: 19,
              color: MUTED,
              marginTop: 12,
            }}
          >
            {WILD_FEATURED.note}
          </div>
          <div
            style={{
              fontFamily: "var(--showcases-mono)",
              fontSize: 15,
              color: FAINT,
              marginTop: 14,
            }}
          >
            {WILD_FEATURED.path}
          </div>
        </div>

        {/* the rest of the wild, as mono rows */}
        <div style={{ paddingTop: 4 }}>
          {WILD_REPOS.map((repo, i) => {
            const p = interpolate(frame, [52 + i * 6, 66 + i * 6], [0, 1], {
              ...clampOpts,
              easing: easeOut,
            });
            return (
              <div
                key={repo}
                style={{
                  fontFamily: "var(--showcases-mono)",
                  fontSize: 19,
                  color: MUTED,
                  lineHeight: 2,
                  opacity: p,
                  transform: `translateX(${(1 - p) * 14}px)`,
                }}
              >
                {repo}
              </div>
            );
          })}
          <div
            style={{
              fontFamily: "var(--showcases-mono)",
              fontSize: 19,
              color: FAINT,
              lineHeight: 2,
              opacity: interpolate(frame, [84, 96], [0, 1], clampOpts),
            }}
          >
            + {WILD_TOTAL - 1 - WILD_REPOS.length} more on GitHub
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 64,
          textAlign: "center",
          fontFamily: "var(--showcases-mono)",
          fontSize: 18,
          color: MUTED,
          opacity: interpolate(frame, [104, 122], [0, 1], clampOpts),
        }}
      >
        {WILD_TOTAL} public repos already wired to{" "}
        <span style={{ color: LIME }}>@remocn</span>
      </div>
    </AbsoluteFill>
  );
};

const RepoGlyph: React.FC = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke={MUTED}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
