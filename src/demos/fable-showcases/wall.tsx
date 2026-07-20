// The plane everything lives on, rendered through the zoom rig's camera.
// Tiles slam in on springs (arrive), play / freeze / still per the live
// policy, and in the finale every object spring-flies to its sampled pad
// inside the R letterform. Chrome (border, radius) is computed in screen
// space — 1px is 1px at every power of ten — and dissolves as a tile fills
// the frame so a dive reads as entering the video, not a card.

import React from "react";
import {
  AbsoluteFill,
  Freeze,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  SLABS,
  TILES,
  TILE_H,
  TILE_W,
  type Slab,
  type Tile,
} from "./constellation";
import {
  R_SCREEN,
  S_FINAL,
  birthOf,
  cameraAt,
  finaleWorldOf,
  swarmProgress,
  type CameraPose,
} from "./rig";
import { MARK_VIEWBOX_H, MARK_VIEWBOX_W, sampleMarkPoints } from "./mark";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ---------------------------------------------------------------------------
// Live policy: heroes play their long clips through the dives; the opener
// and both near waves arrive playing then freeze on their last shown frame;
// the far field arrives as stills.
// ---------------------------------------------------------------------------
const freezeOf = (tile: Tile): number | null => {
  const birth = birthOf(tile.index);
  if (tile.asset.hero) return Math.min(birth + 648, 724);
  if (tile.index === 0) return 340;
  if (tile.index <= 4) return birth + 150;
  if (tile.index <= 12) return birth + 96;
  return null; // still — never plays
};

// ---------------------------------------------------------------------------
// Swarm targets: pads inside the letterform, matched to objects by polar
// rank so the flight keeps neighbours together.
// ---------------------------------------------------------------------------
type SwarmTarget = { x: number; y: number; scale: number };

const useSwarmTargets = (): Map<string, SwarmTarget> => {
  return React.useMemo(() => {
    const objs = [
      ...TILES.map((t) => ({ key: t.asset.id, x: t.x, y: t.y, w: TILE_W })),
      ...SLABS.map((s) => ({ key: `slab:${s.repo}`, x: s.x, y: s.y, w: s.w })),
    ];
    const pts = sampleMarkPoints(objs.length);
    const k = R_SCREEN.h / MARK_VIEWBOX_H;
    const world = pts.map(([px, py]) => {
      const sx = R_SCREEN.cx + (px - MARK_VIEWBOX_W / 2) * k;
      const sy = R_SCREEN.cy + (py - MARK_VIEWBOX_H / 2) * k;
      return finaleWorldOf(sx, sy);
    });
    const centroid = world.reduce(
      (acc, [x, y]) => [acc[0] + x / world.length, acc[1] + y / world.length],
      [0, 0],
    );
    const byAngle = (x: number, y: number) => Math.atan2(y, x);
    const objOrder = [...objs].sort(
      (a, b) => byAngle(a.y, a.x) - byAngle(b.y, b.x),
    );
    const padOrder = [...world].sort(
      (a, b) =>
        byAngle(a[1] - centroid[1], a[0] - centroid[0]) -
        byAngle(b[1] - centroid[1], b[0] - centroid[0]),
    );
    const padWorldW = 27 / S_FINAL; // a landed object is ~27px on screen
    const map = new Map<string, SwarmTarget>();
    objOrder.forEach((obj, i) => {
      const [x, y] = padOrder[i];
      map.set(obj.key, { x, y, scale: padWorldW / obj.w });
    });
    return map;
  }, []);
};

// ---------------------------------------------------------------------------
// One tile.
// ---------------------------------------------------------------------------
const TileView: React.FC<{
  tile: Tile;
  cam: CameraPose;
  frame: number;
  target: SwarmTarget;
}> = ({ tile, cam, frame, target }) => {
  const { fps } = useVideoConfig();
  const birth = birthOf(tile.index);
  if (frame < birth) return null;

  const arrive =
    tile.index === 0
      ? 1
      : spring({
          frame: frame - birth,
          fps,
          config: { damping: 13, stiffness: 150, mass: 0.8 },
        });

  const p = swarmProgress(frame, fps, tile.asset.id);
  const wx = lerp(tile.x, target.x, p);
  const wy = lerp(tile.y, target.y, p);
  const worldScale = lerp(1.35 - 0.35 * arrive, target.scale, p);

  const sx = (wx - cam.cx) * cam.S + 640;
  const sy = (wy - cam.cy) * cam.S + 360;
  const screenW = TILE_W * worldScale * cam.S;
  const screenH = TILE_H * worldScale * cam.S;
  if (
    sx + screenW / 2 < -260 ||
    sx - screenW / 2 > 1540 ||
    sy + screenH / 2 < -260 ||
    sy - screenH / 2 > 980
  ) {
    return null;
  }

  // screen-space chrome, dissolving as the tile fills the frame
  const chrome = interpolate(screenW, [780, 1080], [1, 0], clampOpts);
  const px = 1 / (cam.S * worldScale); // one screen pixel, in local units
  const freezeAt = freezeOf(tile);
  const live = freezeAt !== null;

  const media = live ? (
    <Freeze frame={freezeAt} active={frame >= freezeAt}>
      <Sequence from={birth}>
        <OffthreadVideo
          src={staticFile(tile.asset.clip)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Sequence>
    </Freeze>
  ) : (
    <Img
      src={staticFile(tile.asset.thumb)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: TILE_W,
        height: TILE_H,
        transform: `translate(${wx - TILE_W / 2}px, ${wy - TILE_H / 2}px) scale(${worldScale})`,
        transformOrigin: `${TILE_W / 2}px ${TILE_H / 2}px`,
        opacity: Math.min(1, arrive * 1.9),
        borderRadius: 12 * px * chrome,
        overflow: "hidden",
        border: `${1.3 * px}px solid rgba(242,242,242,${0.17 * chrome})`,
        background: "#0b0a0e",
        // a whisper of dim knits bright scenes into the obsidian field
        filter: "brightness(0.93)",
      }}
    >
      {media}
    </div>
  );
};

// ---------------------------------------------------------------------------
// One wild slab.
// ---------------------------------------------------------------------------
const SLAB_BIRTH = 640;

const SlabView: React.FC<{
  slab: Slab;
  cam: CameraPose;
  frame: number;
  target: SwarmTarget;
}> = ({ slab, cam, frame, target }) => {
  const { fps } = useVideoConfig();
  const birth = SLAB_BIRTH + slab.order * 5;
  if (frame < birth) return null;

  const arrive = spring({
    frame: frame - birth,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.9 },
  });

  const p = swarmProgress(frame, fps, `slab:${slab.repo}`);
  const wx = lerp(slab.x, target.x, p);
  const wy = lerp(slab.y + (1 - arrive) * 150, target.y, p);
  const worldScale = lerp(0.93 + 0.07 * arrive, target.scale, p);

  const sx = (wx - cam.cx) * cam.S + 640;
  const sy = (wy - cam.cy) * cam.S + 360;
  const screenW = slab.w * worldScale * cam.S;
  if (
    sx + screenW / 2 < -260 ||
    sx - screenW / 2 > 1540 ||
    sy + screenW / 2 < -400 ||
    sy - screenW / 2 > 1120
  ) {
    return null;
  }

  const px = 1 / (cam.S * worldScale);
  const featured = slab.order === 0;
  // slab text dissolves as the swarm folds it away
  const textFade = 1 - interpolate(p, [0, 0.35], [0, 1], clampOpts);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: slab.w,
        height: slab.h,
        transform: `translate(${wx - slab.w / 2}px, ${wy - slab.h / 2}px) scale(${worldScale})`,
        transformOrigin: `${slab.w / 2}px ${slab.h / 2}px`,
        opacity: Math.min(1, arrive * 1.7),
        borderRadius: 22 * px,
        border: `${1.3 * px}px solid rgba(242,242,242,0.15)`,
        background: "rgba(242,242,242,0.045)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 34 * px,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontFamily: "var(--fable-mono)",
          fontSize: (featured ? 20 : 18) * px,
          color: "rgba(242,242,242,0.88)",
          opacity: textFade,
          whiteSpace: "nowrap",
        }}
      >
        {slab.repo}
      </div>
      {slab.note ? (
        <div
          style={{
            fontFamily: "var(--fable-mono)",
            fontSize: 15 * px,
            color: "rgba(242,242,242,0.5)",
            opacity: textFade,
            whiteSpace: "nowrap",
          }}
        >
          {slab.note}
        </div>
      ) : null}
    </div>
  );
};

// ---------------------------------------------------------------------------
// The world, seen through the camera.
// ---------------------------------------------------------------------------
export const WorldPlane: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = cameraAt(frame, fps);
  const targets = useSwarmTargets();

  const fallback: SwarmTarget = { x: 0, y: 0, scale: 0.4 };

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `rotate(${cam.rot}deg)` }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: `translate(${640 - cam.cx * cam.S}px, ${360 - cam.cy * cam.S}px) scale(${cam.S})`,
            transformOrigin: "0 0",
          }}
        >
          {SLABS.map((slab) => (
            <SlabView
              key={slab.repo}
              slab={slab}
              cam={cam}
              frame={frame}
              target={targets.get(`slab:${slab.repo}`) ?? fallback}
            />
          ))}
          {TILES.map((tile) => (
            <TileView
              key={tile.asset.id}
              tile={tile}
              cam={cam}
              frame={frame}
              target={targets.get(tile.asset.id) ?? fallback}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
