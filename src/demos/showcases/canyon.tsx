// The canyon itself: a 3D world of 41 real video screens rendered through a
// first-person camera. Physics you can feel:
//   · ignition — the opener lights up, then the near screens burst past the
//     lens into their slots on staggered springs
//   · wake — the camera's draft shoves walls outward as it passes
//   · sink — after each dive the featured float drops out of the lane
//   · depth — far screens dissolve into the obsidian void
// Every clip starts at a fixed Sequence frame (firstFrameWithin), so sync is
// exact no matter when a screen mounts — that's what makes the match-cut
// dives seamless at any render order.

import React from "react";
import {
  AbsoluteFill,
  Easing,
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
  FLOAT_W,
  FLOAT_H,
  WALL_W,
  WALL_H,
  IGNITION_START,
  DIVES,
  OPENER_Z,
  firstFrameWithin,
  VIDEO_AHEAD_EXPORT,
  type CameraPose,
} from "./camera";
import { SLOTS, GATES, type Slot } from "./layout";
import { SHOWCASE_VIDEOS } from "./media";

// visibility windows (world units from the camera)
const CULL_BEHIND = -950;
const CULL_AHEAD = 6800;
const VIDEO_AHEAD = VIDEO_AHEAD_EXPORT;
const FADE_FAR = 6500; // fully dissolved into the void
const FADE_NEAR = 3400; // full opacity up to here

const OPENER = "introducing-shadcn";

const videoOf = (id: string) => {
  const v = SHOWCASE_VIDEOS.find((s) => s.id === id);
  if (!v) throw new Error(`no video ${id}`);
  return v;
};

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

// ---------------------------------------------------------------------------
// One screen in the world. Owns its ignition motion, wake push and (for
// featured floats) the post-dive sink — all pure functions of the frame.
// ---------------------------------------------------------------------------
const Screen: React.FC<{
  slot: Slot;
  cam: CameraPose;
  frame: number;
}> = ({ slot, cam, frame }) => {
  const { fps } = useVideoConfig();
  const video = videoOf(slot.id);
  const dz = slot.z - cam.z;
  if (dz < CULL_BEHIND || dz > CULL_AHEAD) return null;

  // ignition — the opener lights up out of the dark, then a wave of light
  // races down the canyon: every screen near the mouth flickers on in
  // distance order with a spring kick toward the lens
  let brightness = 1;
  let igniteScale = 1;
  let igniteZ = 0;
  if (slot.id === OPENER) {
    brightness = interpolate(frame, [6, 30], [0.1, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    const s = spring({
      frame: frame - 4,
      fps,
      config: { damping: 15, stiffness: 110, mass: 0.9 },
    });
    igniteScale = 0.94 + 0.06 * s;
  } else if (slot.z < OPENER_Z) {
    // the wave: walls light from far to near (toward the camera), each one
    // flaring up just before the glide past it
    const at = IGNITION_START + ((OPENER_Z - slot.z) / OPENER_Z) * 60;
    const s = spring({
      frame: frame - at,
      fps,
      config: { damping: 15, stiffness: 140, mass: 0.7 },
    });
    brightness = 0.13 + 0.87 * s;
    igniteZ = (1 - s) * 170; // the kick: a nudge toward the lens as it lights
    igniteScale = 0.955 + 0.045 * s;
  }

  // wake: the camera's draft shoves the wall outward and rocks it as it passes
  const prox = clamp(1 - Math.abs(dz) / 750, 0, 1);
  const wake = prox * prox;
  const pushX = slot.side * wake * 42;
  const wakeRot = -slot.side * wake * 7;
  const wakeScale = 1 + wake * 0.045;

  // after its dive, the featured float drops out of the lane on a spring
  let sinkY = 0;
  const dive = DIVES.find((d) => d.id === slot.id);
  if (dive && frame > dive.ret) {
    const s = spring({
      frame: frame - dive.ret,
      fps,
      config: { damping: 16, stiffness: 72, mass: 1.1 },
    });
    sinkY = s * 940;
  }

  // dissolve into the void with distance
  const depthOpacity = interpolate(dz, [FADE_NEAR, FADE_FAR], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const w = slot.side === 0 ? FLOAT_W : WALL_W;
  const h = slot.side === 0 ? FLOAT_H : WALL_H;

  const live = dz < VIDEO_AHEAD;
  // fixed clip start: the first frame this screen ever entered the live
  // window — deterministic, so sync survives mounts and parallel rendering
  const clipStart = firstFrameWithin(slot.z, VIDEO_AHEAD);

  // world → CSS: "into the screen" is negative z, so a screen ahead of the
  // camera sits at -(worldZ - camZ)
  const zCss = -(slot.z + igniteZ - cam.z);

  // as a float swallows the frame, its chrome dissolves so the match-cut
  // into the fullscreen overlay leaves no radius/border ghost at the corners
  const chrome = interpolate(dz, [40, 320], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: w,
        height: h,
        marginLeft: -w / 2,
        marginTop: -h / 2,
        transform: `translate3d(${slot.x + pushX - cam.x}px, ${
          slot.y + sinkY - cam.y
        }px, ${zCss}px) rotateY(${slot.rotY + wakeRot}deg) scale(${
          igniteScale * wakeScale
        })`,
        opacity: depthOpacity,
        borderRadius: 10 * chrome,
        overflow: "hidden",
        border: `1px solid rgba(242,242,242,${0.24 * chrome})`,
        background: "#17161c",
        backfaceVisibility: "hidden",
        // a whisper of dim integrates light scenes into the obsidian canyon
        filter: `brightness(${brightness * 0.92})`,
      }}
    >
      {live ? (
        <Sequence from={clipStart}>
          <OffthreadVideo
            src={staticFile(video.clip)}
            trimBefore={Math.round(video.clipOffsetSec * fps)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>
      ) : (
        <Img
          src={staticFile(video.thumb)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// A family gate: the section label floating high in the lane. Mono, quiet.
// ---------------------------------------------------------------------------
const Gate: React.FC<{ label: string; z: number; cam: CameraPose }> = ({
  label,
  z,
  cam,
}) => {
  const dz = z - cam.z;
  if (dz < CULL_BEHIND || dz > CULL_AHEAD) return null;
  const opacity = interpolate(dz, [2200, 5200], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 0,
        height: 0,
        transform: `translate3d(${-cam.x}px, ${-330 - cam.y}px, ${-(z - cam.z)}px)`,
        opacity,
      }}
    >
      <span
        style={{
          display: "block",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
          fontFamily: "var(--showcases-mono)",
          fontSize: 32,
          color: "rgba(242,242,242,0.62)",
        }}
      >
        {label}
      </span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// The world, transformed by the inverse camera. Roll is the outermost layer
// so banking pivots around the view axis; yaw/pitch next; translation last.
// ---------------------------------------------------------------------------
export const CanyonWorld: React.FC<{ cam: CameraPose }> = ({ cam }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        perspective: 1000,
        perspectiveOrigin: "50% 50%",
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateZ(${cam.roll}deg)`,
        }}
      >
        <AbsoluteFill
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${cam.pitch}deg) rotateY(${cam.yaw}deg)`,
          }}
        >
          {GATES.map((g) => (
            <Gate key={g.z} label={g.label} z={g.z} cam={cam} />
          ))}
          {SLOTS.map((slot) => (
            <Screen key={slot.id} slot={slot} cam={cam} frame={frame} />
          ))}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
