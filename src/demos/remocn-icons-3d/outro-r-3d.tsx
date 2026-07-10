import React from "react";
import { AbsoluteFill, Easing, interpolate, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { getLength, getPointAtLength } from "@remotion/paths";

// ===========================================================================
// The outro, entirely in 3D. The R is a solid from the first frame — the
// same ritual, one dimension up: a 3D tube traces the letterform on (the
// gallery's own stroke material), the extruded body fades in beneath the
// tracing outline, and ONE slow camera arc carries the whole scene from a
// ~28° three-quarter view into dead face-on — depth is read by parallax and
// by the lime rim light traveling across the bevel, never by a maneuver.
// The arc lands with zero velocity exactly as the wordmark slide begins, so
// the DOM tail aligns to a face-on mark; the canvas is mounted for the whole
// scene, so nothing ever flashes.
// ===========================================================================

const INK = "#f2f2f2";
const LIME = "#C3E88D";
const FOV = 45;
const DIST = 8;
const ARC_END = 126; // the frame the camera reaches face-on — the slide's start

// Extrusion proportions, in path units of the R's 144.15-tall viewBox.
const DEPTH = 24; // ~17% of cap height — deep enough to read at 66px
const BEVEL = 1.6;
const TUBE_R = 1.5; // the tracing outline's radius, path units

const buildSolid = (d: string, s: number) => {
  const svg = new SVGLoader().parse(
    `<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`,
  );
  const shapes = svg.paths.flatMap((p) => SVGLoader.createShapes(p));
  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL * 0.8,
    bevelSegments: 3,
    curveSegments: 24,
  });
  // Uniform positive scale keeps windings and normals intact; the SVG's
  // y-down is corrected by the group's base π rotation about X — a proper
  // rotation, so the glyph is never mirrored.
  geo.scale(s, s, s);
  geo.center();
  geo.computeBoundingBox();
  return geo;
};

const buildTube = (d: string, s: number) => {
  const len = getLength(d);
  const N = 260;
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= N; i++) {
    const p = getPointAtLength(d, (len * i) / N);
    pts.push(new THREE.Vector3(p.x, p.y, 0));
  }
  const closed = pts[0].distanceTo(pts[pts.length - 1]) < 1;
  if (closed) pts.pop();
  const curve = new THREE.CatmullRomCurve3(pts, closed, "catmullrom", 0);
  const geo = new THREE.TubeGeometry(curve, 320, TUBE_R, 8, closed);
  geo.scale(s, s, s);
  geo.center();
  return geo;
};

// One deliberate arc: the camera HOLDS the three-quarter view through the
// draw and the fill — the beats where the volume is the story — then swings
// into dead face-on, zero velocity at the landing so the slide begins on a
// still lens.
const ARC_START = 58;

const CameraArc: React.FC<{ frame: number }> = ({ frame }) => {
  const camera = useThree((state) => state.camera);
  const a = interpolate(frame, [ARC_START, ARC_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const theta = -0.5 * a;
  camera.position.set(Math.sin(theta) * DIST, 0.35 * a, Math.cos(theta) * DIST);
  camera.lookAt(0, 0, 0);
  return null;
};

export const ROutro3D: React.FC<{
  d: string;
  viewBoxHeight: number;
  markHeightPx: number;
  frame: number;
  draw: number; // 0..1 — the tube traces the letterform
  fill: number; // 0..1 — the solid fades in beneath the outline
  outline: number; // 1..0 — the tube leaves as the wordmark slides
  settle: number; // scale settle, shared with the flat cut's spring
  markCxPx: number; // the mark's slide offset, in screen pixels
}> = ({ d, viewBoxHeight, markHeightPx, frame, draw, fill, outline, settle, markCxPx }) => {
  const { width, height } = useVideoConfig();

  // World units per pixel at z=0, so the 3D mark stands in exactly the same
  // screen pixels as the flat mark it inherits its layout from.
  const unitsPerPx = (2 * DIST * Math.tan((FOV * Math.PI) / 360)) / height;
  const s = (markHeightPx * unitsPerPx) / viewBoxHeight;

  const built = React.useMemo(() => {
    const solid = buildSolid(d, s);
    const tube = buildTube(d, s);
    // The tracing outline rides just off the solid's front face.
    const tubeZ = -((solid.boundingBox?.max.z ?? 0) + TUBE_R * s * 0.6);
    return { solid, tube, tubeZ };
  }, [d, s]);

  // drawRange walks the tube exactly like a dashoffset walks the SVG stroke.
  built.tube.setDrawRange(
    0,
    Math.ceil((built.tube.index?.count ?? 0) * Math.min(1, Math.max(0, draw))),
  );

  const markX = markCxPx * unitsPerPx;

  return (
    <AbsoluteFill>
      <ThreeCanvas
        width={width}
        height={height}
        flat
        style={{ backgroundColor: "transparent" }}
        camera={{ fov: FOV, position: [0, 0.35, DIST], near: 0.1, far: 60 }}
      >
        {/* No tone mapping, and ambient + key·(n·l) calibrated so the
            face-on front cap lands on the flat cut's exact ink. */}
        <ambientLight intensity={1.0} />
        <directionalLight position={[4, 6, 9]} intensity={1.9} />
        {/* the lime rim from behind-left — the gallery's light, inherited */}
        <directionalLight position={[-7, -3, -3]} intensity={1.2} color={LIME} />
        <CameraArc frame={frame} />
        <group position={[markX, 0, 0]} scale={settle}>
          <group rotation={[Math.PI, 0, 0]}>
            {fill > 0.001 && (
              <mesh geometry={built.solid} renderOrder={1}>
                <meshStandardMaterial
                  color={INK}
                  roughness={0.4}
                  metalness={0}
                  transparent
                  opacity={fill}
                />
              </mesh>
            )}
            {outline > 0.001 && draw > 0 && (
              <mesh
                geometry={built.tube}
                position={[0, 0, built.tubeZ]}
                renderOrder={2}
              >
                <meshBasicMaterial color={INK} transparent opacity={outline} />
              </mesh>
            )}
          </group>
        </group>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
