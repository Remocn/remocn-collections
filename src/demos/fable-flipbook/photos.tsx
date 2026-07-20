// The living photographs. A stack of polaroids sits on the paper; the top
// one plays its real render at full 30fps while the world around it moves
// in stop-motion poses. Each beat the top photo is flipped aside by hand
// (four keyframed poses, then a settle), its caption already written; the
// next photograph is revealed already playing. At the scatter beat the
// whole collection deals out across the desk, the camera pulls back a
// power of ten, and "41 videos" is written across the clean center band.

import React from "react";
import {
  AbsoluteFill,
  Freeze,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Typewriter } from "@/components/remocn/typewriter";
import { ASSETS, type ShowcaseAsset } from "../fable-showcases/manifest";
import { Handwrite, INK, MarkerStroke } from "./ink";
import { PageExit, Sticker } from "./paper";
import {
  hashRange,
  paperJitter,
  qf,
  steppedRamp,
  steppedSpring,
} from "./stepped";

const CONTENT_W = 620;
const CONTENT_H = 349;
const PAD = 16;
const BOTTOM = 62;
export const CARD_W = CONTENT_W + PAD * 2; // 652
export const CARD_H = PAD + CONTENT_H + BOTTOM; // 427

const SHOT = 60; // frames each photo holds the top of the stack
const FLIP = 12; // frames a flip takes (4 poses)
export const SCATTER_AT = 424;
const ZOOM_AT = SCATTER_AT + 30; // camera leaves after the first wave is airborne
// pen starts the moment the desk is basically laid — the last far cards are
// still settling on the periphery, so the scene never idles
const HEAD_AT = 500;
const EXIT_AT = 660;
export const PHOTOS_DURATION = 692;

// one shared deal-out spring: soft enough that each stop-motion pose moves
// a card a hand-width, not half the desk — the earlier stiff spring read as
// glitching because whole-desk jumps landed on single 3-frame poses
const DEAL_CFG = { damping: 16, stiffness: 40, mass: 1.1 };

// introducing-remocn goes LAST so the flagship is the photo left living at
// the center of the desk after the deal-out
const STACK: { id: string; cap: string }[] = [
  { id: "introducing-vercel", cap: "introducing vercel" },
  { id: "introducing-nextjs", cap: "next.js" },
  { id: "shadcn-aria", cap: "shadcn × react aria" },
  { id: "remocn-icons-3d", cap: "icons, in 3d" },
  { id: "ai-and-social", cap: "ai & social" },
  { id: "introducing-prisma", cap: "prisma" },
  { id: "introducing-remocn", cap: "introducing remocn" },
];

const assetOf = (id: string): ShowcaseAsset => {
  const a = ASSETS.find((x) => x.id === id);
  if (!a) throw new Error(`no asset ${id}`);
  return a;
};

const TABLE_ASSETS = ASSETS.filter((a) => !STACK.some((s) => s.id === a.id)); // 34

// Desk cells: an 11×5 grid minus the center 3×3 (the clean band the last
// photo and the headline own), nearest-first.
const TABLE_CELLS: { x: number; y: number }[] = (() => {
  const cells: { x: number; y: number; d: number }[] = [];
  for (let row = -2; row <= 2; row++) {
    for (let col = -5; col <= 5; col++) {
      if (Math.abs(col) <= 1 && Math.abs(row) <= 1) continue;
      const x = col * 690;
      const y = row * 460;
      cells.push({ x, y, d: Math.hypot(x / 1.5, y) });
    }
  }
  cells.sort((a, b) => a.d - b.d);
  return cells.map(({ x, y }) => ({ x, y }));
})();

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ---------------------------------------------------------------------------
// The polaroid frame + its media (video plays smooth; the frame is the
// stop-motion object).
// ---------------------------------------------------------------------------
const Polaroid: React.FC<{
  asset: ShowcaseAsset;
  caption?: string;
  captionAt?: number;
  live?: { from: number; freezeAt: number | null };
}> = ({ asset, caption, captionAt = 0, live }) => {
  const frame = useCurrentFrame();

  let media: React.ReactNode;
  if (live) {
    const video = (
      <Sequence from={live.from}>
        <OffthreadVideo
          src={staticFile(asset.clip)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Sequence>
    );
    media =
      live.freezeAt === null ? (
        video
      ) : (
        <Freeze frame={live.freezeAt} active={frame >= live.freezeAt}>
          {video}
        </Freeze>
      );
  } else {
    media = (
      <Img
        src={staticFile(asset.thumb)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }

  return (
    <div
      style={{
        width: CARD_W,
        height: CARD_H,
        boxSizing: "border-box",
        background: "#fdfcf8",
        borderRadius: 4,
        boxShadow: "0 8px 20px rgba(38,36,44,0.18), 0 2px 5px rgba(38,36,44,0.12)",
        paddingTop: PAD,
      }}
    >
      <div
        style={{
          position: "relative",
          width: CONTENT_W,
          height: CONTENT_H,
          margin: "0 auto",
          background: "#100f14",
          overflow: "hidden",
        }}
      >
        {media}
      </div>
      <div
        style={{
          height: BOTTOM,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {caption ? (
          <Handwrite
            text={caption}
            fontSize={36}
            delay={captionAt}
            perStep={1.4}
            weight={600}
          />
        ) : null}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// One photograph's life on the desk: stack → flip aside → rest → scatter.
// ---------------------------------------------------------------------------
const StackPhoto: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { id, cap } = STACK[index];
  const asset = assetOf(id);
  const last = index === STACK.length - 1;

  const topAt = index * SHOT;
  const flipAt = (index + 1) * SHOT - FLIP;
  const side = index % 2 === 0 ? -1 : 1;

  // photo 0 slaps down at act start; the rest are revealed by the flips
  const arrive =
    index === 0 ? steppedRamp(frame, 0, 6, (t) => 1 - (1 - t) ** 2) : 1;

  // in-stack rest pose: a loose hand-made pile — every card sits slightly
  // off-square so it peeks out from under the one above
  const stackX = hashRange(`${id}:sx`, -14, 14);
  const stackY = hashRange(`${id}:sy`, -9, 13);
  const stackRot = hashRange(`${id}:sr`, -3.5, 3.5);

  // where a viewed photo comes to rest: tucked UNDER the pile, its edge
  // still peeking out — the hand slides it to the bottom of the stack
  const underX = hashRange(`${id}:ux`, -16, 16);
  const underY = 4 + hashRange(`${id}:uy`, 0, 10);
  const underRot = hashRange(`${id}:ur`, -4, 4);

  // flip keyframes, sampled on the stop-motion clock: pull out sideways,
  // swing down, slide back in underneath. z drops below the pile on the
  // tuck-in pose.
  let x = stackX;
  let y = stackY;
  let rot = stackRot;
  let scale = index === 0 ? 1.28 - 0.28 * arrive : 1;
  let z = 50 - index;
  if (!last && frame >= flipAt) {
    const ft = Math.min(FLIP, qf(frame) - flipAt);
    x = interpolate(ft, [0, 3, 6, 9, 12], [stackX, side * 300, side * 338, side * 96, underX]);
    y = interpolate(ft, [0, 3, 6, 9, 12], [stackY, 92, 58, 18, underY]);
    rot = interpolate(ft, [0, 3, 6, 9, 12], [stackRot, side * 13, side * 9, side * 3, underRot]);
    scale = interpolate(ft, [0, 6, 9, 12], [1, 0.985, 0.955, 0.94]);
    if (ft >= 9) z = 2; // tucked under the pile
  }

  // the scatter: the six viewed photos lead the deal, one per pose
  const scatter = last
    ? 0
    : steppedSpring({
        frame,
        fps,
        delay: SCATTER_AT + index * 3,
        config: DEAL_CFG,
      });
  if (scatter > 0) {
    const cell = TABLE_CELLS[index];
    const tx = cell.x + hashRange(`${id}:tx`, -36, 36);
    const ty = cell.y + hashRange(`${id}:ty`, -30, 30);
    const tr = hashRange(`${id}:tr`, -9, 9);
    x = lerp(x, tx, scatter);
    y = lerp(y, ty, scatter);
    rot = lerp(rot, tr, scatter);
    scale = lerp(scale, 1, scatter);
  }

  // reshoot wobble once at rest
  const settled = frame >= topAt + 6 && (last || frame < flipAt);
  const j = settled || scatter > 0 ? paperJitter(frame, id, 0.9, 0.3) : { x: 0, y: 0, rot: 0 };

  // a photograph lives only on top of the stack: it freezes the moment the
  // hand picks it off, so exactly one photo is ever playing. The last one
  // (the desk centerpiece) plays until its clip runs out, then holds.
  const liveFrom = Math.max(0, topAt - 40);
  const freezeAt = last ? liveFrom + asset.clipFr - 8 : flipAt;

  return (
    <div
      style={{
        position: "absolute",
        left: 640 - CARD_W / 2,
        top: 356 - CARD_H / 2,
        zIndex: z,
        transform: `translate(${x + j.x}px, ${y + j.y}px) rotate(${rot + j.rot}deg) scale(${scale})`,
        transformOrigin: "50% 50%",
      }}
    >
      <Polaroid
        asset={asset}
        caption={cap}
        captionAt={topAt + 9}
        live={{ from: liveFrom, freezeAt }}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// The 34 desk photos — hidden in the pile until the scatter deals them out.
// ---------------------------------------------------------------------------
const TablePhoto: React.FC<{ asset: ShowcaseAsset; order: number }> = ({
  asset,
  order,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // nearest cells first, two cards per pose, after the viewed six lead out
  const p = steppedSpring({
    frame,
    fps,
    delay: SCATTER_AT + 18 + order * 1.5,
    config: DEAL_CFG,
  });
  if (p === 0) return null;

  const cell = TABLE_CELLS[6 + order];
  const tx = cell.x + hashRange(`${asset.id}:tx`, -36, 36);
  const ty = cell.y + hashRange(`${asset.id}:ty`, -30, 30);
  const tr = hashRange(`${asset.id}:tr`, -9, 9);
  // each card leaves from its own loose spot inside the pile
  const x = lerp(hashRange(`${asset.id}:px`, -12, 12), tx, p);
  const y = lerp(hashRange(`${asset.id}:py`, -6, 12), ty, p);
  const j = paperJitter(frame, asset.id, 0.9, 0.3);

  return (
    <div
      style={{
        position: "absolute",
        left: 640 - CARD_W / 2,
        top: 356 - CARD_H / 2,
        zIndex: 1,
        transform: `translate(${x + j.x}px, ${y + j.y}px) rotate(${p * tr + j.rot}deg)`,
        transformOrigin: "50% 50%",
      }}
    >
      <Polaroid asset={asset} />
    </div>
  );
};

// the blank pile peeking out under the stack before the scatter
const Pile: React.FC = () => {
  const frame = useCurrentFrame();
  const gone = steppedRamp(frame, SCATTER_AT + 6, SCATTER_AT + 30);
  if (gone === 1) return null;
  return (
    <>
      {[3, 2, 1].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 640 - CARD_W / 2 + hashRange(`pile:${i}:x`, -13, 13),
            top: 356 - CARD_H / 2 + hashRange(`pile:${i}:y`, -3, 15),
            width: CARD_W,
            height: CARD_H,
            zIndex: 10,
            background: "#fbfaf5",
            borderRadius: 4,
            boxShadow: "0 6px 16px rgba(38,36,44,0.14)",
            transform: `rotate(${hashRange(`pile:${i}`, -3.2, 3.2)}deg)`,
            opacity: 1 - gone,
          }}
        />
      ))}
    </>
  );
};

// ---------------------------------------------------------------------------
// The act.
// ---------------------------------------------------------------------------
export const PhotosAct: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoomP = steppedSpring({
    frame,
    fps,
    delay: ZOOM_AT,
    config: { damping: 17, stiffness: 42, mass: 1.1 },
  });
  const zoom = lerp(1, 0.3, zoomP);

  const headJ = paperJitter(frame, "head", 0.8, 0.2);

  return (
    <PageExit at={EXIT_AT}>
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${zoom})`,
            transformOrigin: "640px 356px",
          }}
        >
          <Pile />
          {TABLE_ASSETS.map((asset, i) => (
            <TablePhoto key={asset.id} asset={asset} order={i} />
          ))}
          {/* bottom of the stack first so the top photo paints last */}
          {STACK.map((_, i) => i)
            .reverse()
            .map((i) => (
              <StackPhoto key={STACK[i].id} index={i} />
            ))}
        </div>

        {/* the headline band — screen space, written over the desk */}
        <Sequence from={HEAD_AT}>
          <AbsoluteFill style={{ pointerEvents: "none" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 128,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                transform: `translate(${headJ.x}px, ${headJ.y}px) rotate(${headJ.rot}deg)`,
              }}
            >
              <Handwrite text="41 videos" fontSize={112} perStep={1.2} weight={700} />
              <MarkerStroke width={330} delay={30} seed="head41" />
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 560,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Sticker at={56} seed="countchip">
                <div
                  style={
                    {
                      position: "relative",
                      width: 430,
                      height: 30,
                      "--font-geist-sans": "var(--flip-mono)",
                    } as React.CSSProperties
                  }
                >
                  <Sequence from={62}>
                    <Typewriter
                      text="made with remocn · 22 minutes of footage"
                      fontSize={19}
                      fontWeight={400}
                      color={INK}
                      cursor={false}
                      charsPerSecond={24}
                    />
                  </Sequence>
                </div>
              </Sticker>
            </div>
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </PageExit>
  );
};
