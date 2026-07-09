import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getLength, getPointAtLength } from "@remotion/paths";

// ===========================================================================
// The gallery, in depth. The whip-pan lands INSIDE the set — on a
// detonation: 24 icons burst out of the center like shards, tumbling on all
// three axes, each one built as a real 3D tube along its registry path —
// the same stroke material as everywhere else in the video, given volume.
// Every shard traces itself on DURING the flight (drawRange walks the tube
// exactly like a dashoffset walks the SVG), decelerates into its grid slot
// with a hair of overshoot, and settles into a three-layer parallax field.
// The camera takes the blast as recoil — pushed back with a decaying shake —
// and at the end dives THROUGH the wall into the hard cut.
// ===========================================================================

const INK = "#f2f2f2";
const LIME = "#C3E88D";
const MUTED = "rgba(242,242,242,0.62)";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------------------------------------------------------------------------
// Path data — the same 24×24 registry paths the icon components ship.
// ---------------------------------------------------------------------------
type IconDef = { name: string; paths: string[] };

const ICONS: IconDef[] = [
  {
    name: "play",
    paths: [
      "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
    ],
  },
  {
    name: "bell",
    paths: [
      "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      "M10.268 21a2 2 0 0 0 3.464 0",
    ],
  },
  {
    name: "heart",
    paths: [
      "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
    ],
  },
  {
    name: "star",
    paths: [
      "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
    ],
  },
  {
    name: "search",
    paths: [
      "M11 3 A8 8 0 0 1 19 11 A8 8 0 0 1 11 19 A8 8 0 0 1 3 11 A8 8 0 0 1 11 3",
      "m21 21-4.34-4.34",
    ],
  },
  {
    name: "rocket",
    paths: [
      "M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z",
      "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",
      "M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05",
      "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09",
    ],
  },
  {
    name: "zap",
    paths: [
      "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
    ],
  },
  {
    name: "send",
    paths: [
      "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      "m21.854 2.147-10.94 10.939",
    ],
  },
  {
    name: "shield",
    paths: [
      "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
    ],
  },
  {
    name: "lock",
    paths: [
      "M5 11H19A2 2 0 0 1 21 13V20A2 2 0 0 1 19 22H5A2 2 0 0 1 3 20V13A2 2 0 0 1 5 11Z",
      "M7 11V7a5 5 0 0 1 10 0v4",
    ],
  },
  { name: "cloud", paths: ["M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"] },
  {
    name: "camera",
    paths: [
      "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
      "M12 10 A3 3 0 0 1 15 13 A3 3 0 0 1 12 16 A3 3 0 0 1 9 13 A3 3 0 0 1 12 10",
    ],
  },
  {
    name: "mail",
    paths: [
      "M4 4H20A2 2 0 0 1 22 6V18A2 2 0 0 1 20 20H4A2 2 0 0 1 2 18V6A2 2 0 0 1 4 4Z",
      "M22 7 13.009 12.727a2 2 0 0 1-2.009 0L2 7",
    ],
  },
  {
    name: "check-circle",
    paths: [
      "M12 2 A10 10 0 0 1 22 12 A10 10 0 0 1 12 22 A10 10 0 0 1 2 12 A10 10 0 0 1 12 2",
      "M9 12 11 14 15 10",
    ],
  },
  {
    name: "moon",
    paths: [
      "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
    ],
  },
  {
    name: "bookmark",
    paths: [
      "M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z",
    ],
  },
  {
    name: "message-circle",
    paths: [
      "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
    ],
  },
  {
    name: "trending-up",
    paths: ["M2 17 8.5 10.5 13.5 15.5 22 7", "M16 7H22V13"],
  },
  {
    name: "flame",
    paths: [
      "M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4",
    ],
  },
  {
    name: "sparkles",
    paths: [
      "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
    ],
  },
  {
    name: "timer",
    paths: [
      "M12 6a8 8 0 1 0 0 16 8 8 0 1 0 0-16Z",
      "M10 2H14",
      "M12 14 15 11",
    ],
  },
  {
    name: "folder",
    paths: [
      "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
    ],
  },
  {
    name: "tag",
    paths: [
      "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
    ],
  },
  {
    name: "funnel",
    paths: [
      "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
    ],
  },
];

// ---------------------------------------------------------------------------
// Layout — the 6×4 grid the flat cut used, opened into three depth layers
// with deterministic jitter. Each icon's grid slot is scaled by its distance
// to the mid-dolly camera, so every layer projects back onto the same clean
// grid — no overlaps — while the camera's travel un-flattens it into
// parallax.
// ---------------------------------------------------------------------------
const COLS = 6;
const SPACING_X = 2.1;
const SPACING_Y = 1.78;
const CAM_MID = 13.5; // the settled camera distance the grid is aligned to
const BURST = 10; // the detonation frame
const ORIGIN = { x: 0, y: 0.8, z: -2 }; // where the blast comes from

const SLOTS = ICONS.map((_, i) => {
  const row = Math.floor(i / COLS);
  const col = i % COLS;
  const layer = (i * 7 + row * 3) % 3;
  const z = -layer * 2.6 - random(`g3d-z-${i}`) * 0.5;
  const spread = (CAM_MID - z) / CAM_MID;
  return {
    x:
      ((col - (COLS - 1) / 2) * SPACING_X +
        (random(`g3d-x-${i}`) - 0.5) * 0.3) *
      spread,
    y:
      (((4 - 1) / 2 - row) * SPACING_Y +
        0.7 +
        (random(`g3d-y-${i}`) - 0.5) * 0.25) *
      spread,
    z,
    tiltY: (random(`g3d-ry-${i}`) - 0.5) * 0.6,
    tiltX: (random(`g3d-rx-${i}`) - 0.5) * 0.32,
    phase: random(`g3d-ph-${i}`) * Math.PI * 2,
    // every shard leaves the blast on its own beat, flies its own arc
    delay: BURST + random(`g3d-d-${i}`) * 6,
    flight: 26 + random(`g3d-f-${i}`) * 14,
    spinX: (random(`g3d-sx-${i}`) - 0.5) * 7,
    spinY: (random(`g3d-sy-${i}`) - 0.5) * 9,
    spinZ: (random(`g3d-sz-${i}`) - 0.5) * 10,
  };
});

// ---------------------------------------------------------------------------
// Tube-stroke geometry. Every subpath is sampled along its length and swept
// into a TubeGeometry; setDrawRange then walks the index exactly like a
// dashoffset walks an SVG stroke (TubeGeometry orders its triangles along
// the tube). Subpaths share one draw clock proportionally to their length,
// the same rule the SVG components use.
// ---------------------------------------------------------------------------
const SAMPLES = 110;
const TUBE_R = 0.048;

const toLocal = (p: { x: number; y: number }) =>
  new THREE.Vector3((p.x - 12) / 12, (12 - p.y) / 12, 0);

type BuiltIcon = {
  geos: THREE.TubeGeometry[];
  ranges: ReadonlyArray<readonly [number, number]>;
};

const buildIcon = (def: IconDef): BuiltIcon => {
  const lens = def.paths.map((d) => getLength(d));
  const total = lens.reduce((a, b) => a + b, 0);
  let acc = 0;
  const ranges = lens.map((l) => {
    const s = acc / total;
    acc += l;
    return [s, acc / total] as const;
  });
  const geos = def.paths.map((d, k) => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      pts.push(toLocal(getPointAtLength(d, (lens[k] * i) / SAMPLES)));
    }
    const closed = pts[0].distanceTo(pts[pts.length - 1]) < 0.04;
    if (closed) pts.pop();
    const curve = new THREE.CatmullRomCurve3(pts, closed, "catmullrom", 0);
    return new THREE.TubeGeometry(curve, 150, TUBE_R, 10, closed);
  });
  return { geos, ranges };
};

const FieldIcon: React.FC<{
  def: IconDef;
  slot: (typeof SLOTS)[number];
  frame: number;
}> = ({ def, slot, frame }) => {
  const built = React.useMemo(() => buildIcon(def), [def]);

  // The shard's flight: it leaves the blast on its own beat, a decelerating
  // radial throw with a hair of overshoot, tumbling on all three axes until
  // the spin unwinds into its resting tilt.
  const p = interpolate(frame, [slot.delay, slot.delay + slot.flight], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.back(1.2)),
  });
  // The stroke traces itself on DURING the flight — fast, front-loaded, so
  // the burst is visible from its first frames and the shards leave the
  // blast already recognizable.
  const draw = interpolate(
    frame,
    [slot.delay, slot.delay + slot.flight * 0.45],
    [0, 1],
    { ...clampOpts, easing: Easing.out(Easing.cubic) },
  );

  // drawRange is mutated per frame — deterministic, driven only by `frame`.
  built.geos.forEach((geo, k) => {
    const [s, e] = built.ranges[k];
    const dp = Math.min(1, Math.max(0, (draw - s) / (e - s)));
    geo.setDrawRange(0, Math.ceil(geo.index!.count * dp));
  });

  // Once landed, the icon lives: a quiet float, never at rest — the 3D
  // reading of "the wall ripples alive".
  const alive = interpolate(
    frame,
    [slot.delay + slot.flight, slot.delay + slot.flight + 14],
    [0, 1],
    clampOpts,
  );
  const t = frame - slot.delay;
  const swayY = alive * Math.sin(t * 0.045 + slot.phase) * 0.09;
  const swayX = alive * Math.cos(t * 0.04 + slot.phase) * 0.06;
  const bobY = alive * Math.sin(t * 0.05 + slot.phase * 2) * 0.05;

  if (frame < slot.delay) return null;

  const px = ORIGIN.x + (slot.x - ORIGIN.x) * p;
  const py = ORIGIN.y + (slot.y - ORIGIN.y) * p + bobY;
  const pz = ORIGIN.z + (slot.z - ORIGIN.z) * p;
  const rotX = slot.tiltX + (1 - p) * slot.spinX + swayX;
  const rotY = slot.tiltY + (1 - p) * slot.spinY + swayY;
  const rotZ = (1 - p) * slot.spinZ;
  const scale = 0.45 + 0.55 * Math.min(1, p);

  return (
    <group
      position={[px, py, pz]}
      rotation={[rotX, rotY, rotZ]}
      scale={scale}
    >
      {built.geos.map((geo, k) => (
        <mesh key={k} geometry={geo}>
          <meshStandardMaterial
            color={INK}
            emissive="#3a3a42"
            roughness={0.42}
            metalness={0.18}
          />
        </mesh>
      ))}
    </group>
  );
};

// ---------------------------------------------------------------------------
// The recoil and the dive-out. The camera sits close on the empty field as
// the whip-pan lands; the detonation pushes it back — a fast recoil that
// settles wide, with a decaying shake riding the first beats — then a
// whisper of drift keeps the layers sliding against each other. At the end
// the blast finds its echo: the camera accelerates THROUGH the wall — the
// front layer rushing past the lens — and the hard cut into the morph run
// lands mid-dive.
// ---------------------------------------------------------------------------
const EXIT_DUR = 24;

const CameraRig: React.FC<{ frame: number; duration: number }> = ({
  frame,
  duration,
}) => {
  const camera = useThree((s) => s.camera);
  const recoil = interpolate(frame, [BURST, BURST + 42], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const shakeAmp =
    frame < BURST
      ? 0
      : interpolate(frame, [BURST, BURST + 26], [1, 0], {
          ...clampOpts,
          easing: Easing.out(Easing.quad),
        });
  const drift = interpolate(frame, [0, duration], [1, 0], clampOpts);
  const exit = interpolate(
    frame,
    [duration - EXIT_DUR, duration - 2],
    [0, 1],
    { ...clampOpts, easing: Easing.in(Easing.cubic) },
  );
  const x =
    0.35 - drift * 0.25 + exit * 0.3 + Math.sin(frame * 2.3) * 0.07 * shakeAmp;
  const y = 0.3 + drift * 0.08 + Math.cos(frame * 1.9) * 0.055 * shakeAmp;
  const z = 12.1 + recoil * 1.15 - (1 - drift) * 0.25 - exit * 14;
  camera.position.set(x, y, z);
  // The look target stays ahead of the lens once the dive crosses the front
  // layer, so the camera never flips around.
  camera.lookAt(x * 0.35, y * 0.35, Math.min(0, z - 12));
  return null;
};

export const Gallery3DScene: React.FC<{ fontFamily: string }> = ({
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  // The caption leaves before the dive begins, so the exit is pure motion.
  const lineOpacity =
    interpolate(frame, [46, 66], [0, 1], clampOpts) *
    interpolate(
      frame,
      [durationInFrames - EXIT_DUR - 6, durationInFrames - EXIT_DUR + 6],
      [1, 0],
      clampOpts,
    );

  return (
    <AbsoluteFill>
      <ThreeCanvas
        width={width}
        height={height}
        style={{ backgroundColor: "transparent" }}
        camera={{ fov: 40, position: [0.1, 0.38, 12.1], near: 0.1, far: 80 }}
      >
        <CameraRig frame={frame} duration={durationInFrames} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 9]} intensity={1.2} />
        {/* the lime rim from behind-left — the accent lives in the light */}
        <directionalLight position={[-7, -3, -3]} intensity={1.1} color={LIME} />
        {ICONS.map((def, i) => (
          <FieldIcon key={def.name} def={def} slot={SLOTS[i]} frame={frame} />
        ))}
      </ThreeCanvas>

      <span
        style={{
          position: "absolute",
          bottom: 58,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily,
          fontWeight: 400,
          fontSize: 24,
          color: MUTED,
          opacity: lineOpacity,
        }}
      >
        Every icon draws itself on
      </span>
    </AbsoluteFill>
  );
};
