import React from "react";
import { AbsoluteFill } from "remotion";
import { MANROPE, REMOCN, RemocnLockup, ThumbFrame } from "./kit";

import { BellIconStatic } from "@/components/remocn/icon-bell";
import { HeartIconStatic } from "@/components/remocn/icon-heart";
import { StarIconStatic } from "@/components/remocn/icon-star";
import { ZapIconStatic } from "@/components/remocn/icon-zap";
import { CloudIconStatic } from "@/components/remocn/icon-cloud";
import { MoonIconStatic } from "@/components/remocn/icon-moon";
import { PlayIconStatic } from "@/components/remocn/icon-play";

const TILE_W = 320;
const TILE_H = 180;
const GAP = 30;
const COLS = 4;

/** the snake the camera drives: right across the top, down, left back along the
 *  bottom — two rows rather than three, so the wall clears the lower third and
 *  the claim gets ground of its own */
const SNAKE: { col: number; row: number }[] = [
  { col: 0, row: 0 },
  { col: 1, row: 0 },
  { col: 2, row: 0 },
  { col: 3, row: 0 },
  { col: 3, row: 1 },
  { col: 2, row: 1 },
  { col: 1, row: 1 },
  { col: 0, row: 1 },
];

const tileX = (col: number) => col * (TILE_W + GAP);
const tileY = (row: number) => row * (TILE_H + GAP);

type IconComp = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

type Scene = { kind: "icon"; Icon: IconComp } | { kind: "lockup" };

/**
 * The eight scenes of the icons cut. Nothing on the wall is set as copy: at
 * grid size a monitor is far too small to carry a readable line, so each tile
 * shows the one thing that survives being shrunk — a single large glyph — and
 * the brand rides the tile the camera is parked on.
 */
const SCENES: Scene[] = [
  { kind: "icon", Icon: BellIconStatic },
  { kind: "icon", Icon: HeartIconStatic },
  { kind: "icon", Icon: StarIconStatic },
  { kind: "icon", Icon: ZapIconStatic },
  { kind: "icon", Icon: CloudIconStatic },
  { kind: "icon", Icon: MoonIconStatic },
  { kind: "icon", Icon: PlayIconStatic },
  { kind: "lockup" },
];

const SceneBody: React.FC<{ scene: Scene }> = ({ scene }) => {
  if (scene.kind === "lockup") return <RemocnLockup size={54} />;
  return <scene.Icon size={104} color={REMOCN.ink} strokeWidth={2.6} />;
};

/**
 * "One take, no cuts" — the one-take cut, whose whole video is a single camera
 * drive across a flat wall of monitors. The wall runs the top two thirds with
 * the drive drawn on it, and the claim stands below on clean ground as one
 * unbroken lime line, still tilted onto the wall plane so it reads as riding
 * the camera's own track rather than sitting beside it.
 */
export const RemocnIconsOnetakeThumb: React.FC = () => {
  const parked = 7;
  const px = tileX(SNAKE[parked].col);
  const py = tileY(SNAKE[parked].row);
  const path = SNAKE.map(
    (s) => `${tileX(s.col) + TILE_W / 2},${tileY(s.row) + TILE_H / 2}`,
  ).join(" ");
  const canvasW = COLS * TILE_W + (COLS - 1) * GAP;
  const canvasH = 2 * TILE_H + GAP;

  return (
    <ThumbFrame background={REMOCN.obsidian}>
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: (1280 - canvasW) / 2,
            top: 34,
            width: canvasW,
            height: canvasH,
            transform: "rotate(-4deg)",
            transformOrigin: "50% 50%",
          }}
        >
          {/* the drive, drawn on the wall */}
          <svg
            width={canvasW}
            height={canvasH}
            style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
          >
            <polyline
              points={path}
              fill="none"
              stroke={REMOCN.lime}
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.85}
            />
            {SNAKE.map((s, i) => (
              <circle
                key={i}
                cx={tileX(s.col) + TILE_W / 2}
                cy={tileY(s.row) + TILE_H / 2}
                r={9}
                fill={REMOCN.lime}
                opacity={0.85}
              />
            ))}
          </svg>

          {SNAKE.map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: tileX(s.col),
                top: tileY(s.row),
                width: TILE_W,
                height: TILE_H,
                borderRadius: 10,
                border: "2px solid rgba(242,242,242,0.16)",
                background:
                  "radial-gradient(120% 130% at 30% 12%, #232230 0%, #1a1922 46%, #131218 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
                opacity: i === parked ? 1 : 0.8,
              }}
            >
              <SceneBody scene={SCENES[i]} />
            </div>
          ))}

          {/* the viewfinder parked on the running tile */}
          <svg
            width={canvasW}
            height={canvasH}
            style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
          >
            {(
              [
                [px - 14, py - 14, 1, 1],
                [px + TILE_W + 14, py - 14, -1, 1],
                [px - 14, py + TILE_H + 14, 1, -1],
                [px + TILE_W + 14, py + TILE_H + 14, -1, -1],
              ] as const
            ).map(([x, y, sx, sy], i) => (
              <path
                key={i}
                d={`M ${x} ${y + sy * 36} L ${x} ${y} L ${x + sx * 36} ${y}`}
                fill="none"
                stroke={REMOCN.lime}
                strokeWidth={5}
                strokeLinecap="square"
              />
            ))}
          </svg>
        </div>

        {/* the wall settles into the floor rather than stopping on a line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 400,
            width: 1280,
            height: 180,
            background:
              "linear-gradient(180deg, rgba(20,19,24,0) 0%, rgba(20,19,24,0.86) 46%, rgba(20,19,24,1) 82%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 568,
            width: 1280,
            height: 152,
            background: REMOCN.obsidian,
          }}
        />

        {/* the claim, on its own ground but still on the camera's track */}
        <div
          style={{
            position: "absolute",
            left: 74,
            top: 536,
            transform: "rotate(-3deg)",
            transformOrigin: "0% 50%",
            fontFamily: MANROPE,
            fontWeight: 800,
            fontSize: 122,
            lineHeight: "122px",
            letterSpacing: "-0.045em",
            whiteSpace: "nowrap",
            color: REMOCN.lime,
          }}
        >
          One take, no cuts
        </div>
      </AbsoluteFill>
    </ThumbFrame>
  );
};
