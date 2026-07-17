import React, { useMemo } from "react";
import {
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRIGHT, HAIRLINE, INK, MONO, MUTED, clampOpts } from "./theme";

// ---------------------------------------------------------------------------
// The three nextjs.org feature-card illustrations, rebuilt live and animated.
// Type stays monochrome; the streaming pulses keep their shipped
// #3291FF → #61DAFB gradient — illustration-surface colors, same exemption
// class as code syntax.
// ---------------------------------------------------------------------------

const easeOut = Easing.out(Easing.cubic);

// ===========================================================================
// Built-in Optimizations — three image windows: the Original mountain, then
// the same picture rebuilt from pixels at 1440px and 375px, each assembling
// cell by cell with a shine sweeping across once it lands.
// ===========================================================================

const WindowShell: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  enter: number;
  z?: number;
  shineAt?: number;
  children: React.ReactNode;
}> = ({ x, y, w, h, label, enter, z = 1, shineAt, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - enter,
    fps,
    config: { damping: 13, stiffness: 140, mass: 0.8 },
  });
  const shine =
    shineAt === undefined
      ? 0
      : interpolate(frame - shineAt, [0, 26], [0, 1], {
          ...clampOpts,
          easing: Easing.bezier(0.4, 0, 0.4, 1),
        });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 9,
        background: "#101010",
        border: `1px solid ${HAIRLINE}`,
        boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
        overflow: "hidden",
        zIndex: z,
        opacity: Math.min(1, s * 1.3),
        transform: `translateY(${(1 - s) * 20}px) scale(${interpolate(s, [0, 1], [0.94, 1])})`,
      }}
    >
      <div
        style={{
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: `1px solid rgba(237,237,237,0.08)`,
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: 10.5, color: MUTED }}>
          {label}
        </span>
      </div>
      <div style={{ position: "absolute", inset: "24px 0 0 0" }}>
        {children}
      </div>
      {/* One shine pass — the optimized image "developing". */}
      {shine > 0 && shine < 1 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.16) 50%, transparent 62%)",
            transform: `translateX(${interpolate(shine, [0, 1], [-w, w])}px)`,
          }}
        />
      ) : null}
    </div>
  );
};

// The Original — the shipped 184×88 mountain vector, verbatim.
const MOUNTAIN =
  "M36.5858 4.91421L0.585786 40.9142C0.210714 41.2893 0 41.798 0 42.3284V85.5C0 86.6046 0.89543 87.5 2 87.5H182C183.105 87.5 184 86.6046 184 85.5V50.8284C184 49.0466 181.846 48.1543 180.586 49.4142L179.586 50.4142C179.211 50.7893 179 51.298 179 51.8284V59.1716C179 59.702 178.789 60.2107 178.414 60.5858L177.586 61.4142C177.211 61.7893 176.702 62 176.172 62H165.328C164.798 62 164.289 62.2107 163.914 62.5858L155.914 70.5858C155.133 71.3668 153.867 71.3668 153.086 70.5858L133.914 51.4142C133.133 50.6332 131.867 50.6332 131.086 51.4142L127.914 54.5858C127.133 55.3668 125.867 55.3668 125.086 54.5858L119 48.5L90.4142 19.9142C89.6332 19.1332 88.3668 19.1332 87.5858 19.9142L72.4142 35.0858C71.6332 35.8668 70.3668 35.8668 69.5858 35.0858L39.4142 4.91421C38.6332 4.13317 37.3668 4.13316 36.5858 4.91421Z";

// The mountain's silhouette, as a height field for the pixel rebuilds.
const silhouette = (u: number) => {
  const tri = (c: number, w: number, h: number) =>
    Math.max(0, 1 - Math.abs(u - c) / w) * h;
  return Math.max(tri(0.2, 0.22, 0.95), tri(0.52, 0.32, 0.5), tri(0.85, 0.3, 0.72));
};

const PixelMountain: React.FC<{
  cols: number;
  rows: number;
  pitch: number;
  cell: number;
  opacity: number;
  start: number;
  seed: string;
  sun?: boolean;
}> = ({ cols, rows, pitch, cell, opacity, start, seed, sun = false }) => {
  const frame = useCurrentFrame();
  const cells = useMemo(() => {
    const out: Array<{ x: number; y: number; d: number }> = [];
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const filled = r / rows > 1 - silhouette(c / cols);
        const sunCell = sun && r >= 1 && r <= 3 && c >= cols - 5 && c <= cols - 3;
        if (!filled && !sunCell) continue;
        out.push({
          x: c * pitch,
          y: r * pitch,
          d: c * 0.5 + random(`${seed}-${c}-${r}`) * 16,
        });
      }
    }
    return out;
  }, [cols, rows, pitch, sun, seed]);
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${cols * pitch} ${rows * pitch}`}
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      {cells.map((c, i) => (
        <rect
          key={i}
          x={c.x}
          y={c.y}
          width={cell}
          height={cell}
          fill="#ededed"
          opacity={
            opacity *
            interpolate(frame - start - c.d, [0, 5], [0, 1], clampOpts)
          }
        />
      ))}
    </svg>
  );
};

export const OptimizationsIllo: React.FC = () => {
  const frame = useCurrentFrame();
  const originalIn = interpolate(frame - 8, [0, 16], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });
  return (
    <div style={{ position: "relative", width: 560, height: 310 }}>
      <WindowShell x={238} y={4} w={306} h={186} label="Original" enter={2} z={1}>
        <div style={{ padding: "10px 12px 0" }}>
          <svg width={282} height={135} viewBox="0 0 184 88.2" fill="none">
            <circle cx={174} cy={8.5} r={8} fill="#ededed" opacity={0.28 * originalIn} />
            <path d={MOUNTAIN} fill="url(#opt-grad)" opacity={originalIn} />
            <defs>
              <linearGradient id="opt-grad" x1="92" x2="92" y1="7.5" y2="87.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ededed" stopOpacity="0.12" />
                <stop offset="1" stopColor="#ededed" stopOpacity="0.26" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </WindowShell>
      <WindowShell x={116} y={96} w={252} h={144} label="1440px" enter={12} z={2} shineAt={64}>
        <div style={{ padding: "8px 10px 0", height: "100%" }}>
          <PixelMountain cols={51} rows={21} pitch={3} cell={2} opacity={0.4} start={22} seed="opt-lg" />
        </div>
      </WindowShell>
      <WindowShell x={16} y={182} w={170} h={106} label="375px" enter={24} z={3} shineAt={80}>
        <div style={{ padding: "6px 8px 0", height: "100%" }}>
          <PixelMountain cols={25} rows={11} pitch={4} cell={2.6} opacity={0.5} start={34} seed="opt-sm" sun />
        </div>
      </WindowShell>
    </div>
  );
};

// ===========================================================================
// Dynamic HTML Streaming — the wireframe app on its dashed grid, its pieces
// streaming in one after another. Four conductors draw in from the frame and
// PLUG INTO the app's border; blue signal pulses run the conductors and flow
// ON INTO the window border, which carries a blue current of its own.
// ===========================================================================

// The wireframe window, in illustration coords — the conductors land on its
// border and the current runs this exact rounded rectangle.
const APP = { x: 115, y: 40, w: 330, h: 226, r: 10 };

// Each conductor runs in from off-frame, meets the border perpendicular, then
// follows the border edge a short way — so a pulse travelling it flows off the
// wire ONTO the app's border rather than stopping at (or overrunning) it.
const WIRES: Array<{ d: string; phase: number; draw: number }> = [
  {
    d: "M-150 70 L-10 70 Q-2 70 -2 78 L-2 142 Q-2 150 6 150 L115 150 L115 62",
    phase: 0.1,
    draw: 10,
  },
  {
    d: "M-150 300 L-30 300 Q-22 300 -22 292 L-22 218 Q-22 210 -14 210 L115 210 L115 250",
    phase: 0.5,
    draw: 16,
  },
  {
    d: "M710 70 L560 70 Q552 70 552 78 L552 142 Q552 150 544 150 L445 150 L445 62",
    phase: 0.3,
    draw: 13,
  },
  {
    d: "M710 300 L570 300 Q562 300 562 292 L562 218 Q562 210 554 210 L445 210 L445 250",
    phase: 0.72,
    draw: 19,
  },
];

const Bar: React.FC<{
  w: number | string;
  dim?: boolean;
  in_: number;
}> = ({ w, dim = false, in_ }) => (
  <div
    style={{
      width: w,
      height: 5,
      borderRadius: 3,
      background: dim ? "rgba(237,237,237,0.14)" : "rgba(237,237,237,0.42)",
      opacity: in_,
      transform: `translateY(${(1 - in_) * 5}px)`,
    }}
  />
);

export const StreamingIllo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gridIn = interpolate(frame, [0, 16], [0, 1], clampOpts);
  const windowIn = spring({
    frame: frame - 6,
    fps,
    config: { damping: 13, stiffness: 140, mass: 0.8 },
  });
  const piece = (i: number) =>
    interpolate(frame - (20 + i * 5), [0, 12], [0, 1], {
      ...clampOpts,
      easing: easeOut,
    });
  const pulsesIn = interpolate(frame, [34, 50], [0, 1], clampOpts);

  return (
    <div style={{ position: "relative", width: 560, height: 310 }}>
      {/* The dashed grid the card ships with. */}
      <svg
        width={560}
        height={310}
        style={{ position: "absolute", inset: 0, opacity: gridIn }}
      >
        <g opacity={0.1} stroke={INK} strokeDasharray="1 1">
          {Array.from({ length: 19 }, (_, i) => (
            <line key={`h${i}`} x1={0} x2={560} y1={i * 16 + 7.5} y2={i * 16 + 7.5} />
          ))}
          {Array.from({ length: 35 }, (_, i) => (
            <line key={`v${i}`} x1={i * 16 + 8} x2={i * 16 + 8} y1={0} y2={310} />
          ))}
        </g>
      </svg>
      {/* The wireframe window — its content streams in piece by piece. */}
      <div
        style={{
          position: "absolute",
          left: 115,
          top: 40,
          width: 330,
          height: 226,
          borderRadius: 10,
          background: "rgba(12,12,12,0.94)",
          border: `1px solid ${HAIRLINE}`,
          boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
          opacity: Math.min(1, windowIn * 1.3),
          transform: `scale(${interpolate(windowIn, [0, 1], [0.94, 1])})`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 24,
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "0 10px",
            borderBottom: "1px solid rgba(237,237,237,0.08)",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "rgba(237,237,237,0.22)",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, padding: "14px 16px" }}>
          {/* Sidebar */}
          <div style={{ width: 64, display: "flex", flexDirection: "column", gap: 7 }}>
            <svg width={15} height={13} viewBox="0 0 115 100" style={{ opacity: piece(0), marginBottom: 3 }}>
              <path fill="rgba(237,237,237,0.7)" d="M57.5 0 115 100H0z" />
            </svg>
            <Bar w="100%" in_={piece(1)} />
            <Bar w="55%" dim in_={piece(2)} />
            <Bar w="100%" dim in_={piece(3)} />
            <Bar w="100%" dim in_={piece(4)} />
            <Bar w="55%" dim in_={piece(5)} />
          </div>
          {/* Main column */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: piece(2),
              }}
            >
              <div
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: "50%",
                  background: "rgba(237,237,237,0.3)",
                }}
              />
              <div
                style={{
                  width: 36,
                  height: 11,
                  borderRadius: 6,
                  background: "rgba(237,237,237,0.22)",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <Bar w={18} in_={piece(3)} />
              <Bar w={34} dim in_={piece(4)} />
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 52,
                    borderRadius: 5,
                    background: "rgba(237,237,237,0.08)",
                    border: "1px solid rgba(237,237,237,0.08)",
                    opacity: piece(5 + i),
                    transform: `translateY(${(1 - piece(5 + i)) * 8}px)`,
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 34,
                    borderRadius: 5,
                    background: "rgba(237,237,237,0.05)",
                    border: "1px solid rgba(237,237,237,0.07)",
                    opacity: piece(8 + i),
                    transform: `translateY(${(1 - piece(8 + i)) * 8}px)`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Conductors plugged into the app border, and the border's own current. */}
      <svg
        width={880}
        height={400}
        viewBox="-160 -30 880 400"
        style={{ position: "absolute", left: -160, top: -30, overflow: "visible" }}
      >
        <defs>
          <linearGradient id="stream-grad" x1="0" y1="0" x2="560" y2="310" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3291FF" />
            <stop offset="1" stopColor="#61DAFB" />
          </linearGradient>
        </defs>

        {/* Conductors drawing in from the frame toward the app. */}
        {WIRES.map((wire, i) => {
          const drawP = interpolate(frame - wire.draw, [0, 22], [0, 1], {
            ...clampOpts,
            easing: easeOut,
          });
          return (
            <path
              key={`wire-${i}`}
              d={wire.d}
              stroke="rgba(237,237,237,0.13)"
              strokeWidth={1.5}
              fill="none"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - drawP}
            />
          );
        })}

        {/* The border base — a faint blue rail the current rides. */}
        <rect
          x={APP.x}
          y={APP.y}
          width={APP.w}
          height={APP.h}
          rx={APP.r}
          fill="none"
          stroke="rgba(50,145,255,0.14)"
          strokeWidth={1.5}
          opacity={pulsesIn}
        />

        {/* Signal pulses running the conductors and flowing onto the border. */}
        {WIRES.map((wire, i) => {
          const travel = 1 - ((frame * 0.011 + wire.phase) % 1);
          return (
            <path
              key={`pulse-${i}`}
              d={wire.d}
              stroke="url(#stream-grad)"
              strokeWidth={2.2}
              strokeLinecap="round"
              fill="none"
              pathLength={1}
              strokeDasharray="0.16 0.84"
              strokeDashoffset={travel}
              opacity={pulsesIn}
            />
          );
        })}

        {/* The blue current circulating the app border. */}
        <rect
          x={APP.x}
          y={APP.y}
          width={APP.w}
          height={APP.h}
          rx={APP.r}
          fill="none"
          stroke="url(#stream-grad)"
          strokeWidth={2.4}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="0.13 0.87"
          strokeDashoffset={1 - ((frame * 0.012) % 1)}
          opacity={pulsesIn}
        />
      </svg>
    </div>
  );
};

// ===========================================================================
// React Server Components — the sphere tree, each node popping in down the
// hierarchy while dashed edges draw between them; two nodes wear the
// wireframe mesh, the rest render dark.
// ===========================================================================

const RSC_NODES = [
  { x: 230, y: 46, r: 30, mesh: false, at: 4 },
  { x: 148, y: 142, r: 27, mesh: true, at: 18 },
  { x: 312, y: 142, r: 27, mesh: false, at: 22 },
  { x: 76, y: 240, r: 24, mesh: false, at: 34 },
  { x: 230, y: 240, r: 24, mesh: true, at: 38 },
  { x: 384, y: 240, r: 24, mesh: false, at: 42 },
];
const RSC_EDGES: Array<[number, number, number]> = [
  [0, 1, 10],
  [0, 2, 14],
  [1, 3, 26],
  [1, 4, 30],
  [2, 5, 34],
];

export const RscIllo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "relative", width: 460, height: 300 }}>
      <svg width={460} height={300} style={{ position: "absolute", inset: 0 }}>
        {RSC_EDGES.map(([a, b, at], i) => {
          const na = RSC_NODES[a];
          const nb = RSC_NODES[b];
          const p = interpolate(frame - at, [0, 14], [0, 1], {
            ...clampOpts,
            easing: easeOut,
          });
          return (
            <line
              key={i}
              x1={na.x}
              y1={na.y}
              x2={na.x + (nb.x - na.x) * p}
              y2={na.y + (nb.y - na.y) * p}
              stroke="rgba(237,237,237,0.25)"
              strokeDasharray="3 4"
              opacity={p}
            />
          );
        })}
      </svg>
      {RSC_NODES.map((node, i) => {
        const s = spring({
          frame: frame - node.at,
          fps,
          config: { damping: 12, stiffness: 150, mass: 0.8 },
        });
        const float = Math.sin(frame * 0.045 + i * 1.7) * 2.4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: node.x - node.r,
              top: node.y - node.r + float,
              width: node.r * 2,
              height: node.r * 2,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 33% 28%, #3d3d42 0%, #161619 58%, #0b0b0d 100%)",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow: "0 10px 26px rgba(0,0,0,0.5)",
              opacity: Math.min(1, s * 1.3),
              transform: `scale(${interpolate(s, [0, 1], [0.4, 1])})`,
            }}
          >
            {node.mesh ? (
              <svg
                width={node.r * 2}
                height={node.r * 2}
                viewBox="0 0 60 60"
                style={{ position: "absolute", inset: 0, opacity: 0.5 }}
              >
                <ellipse cx="30" cy="30" rx="26" ry="10" fill="none" stroke={BRIGHT} strokeOpacity="0.4" strokeWidth="0.8" strokeDasharray="2 3" transform="rotate(-24 30 30)" />
                <ellipse cx="30" cy="30" rx="26" ry="10" fill="none" stroke={BRIGHT} strokeOpacity="0.4" strokeWidth="0.8" strokeDasharray="2 3" transform="rotate(42 30 30)" />
                <ellipse cx="30" cy="30" rx="26" ry="16" fill="none" stroke={BRIGHT} strokeOpacity="0.28" strokeWidth="0.8" strokeDasharray="2 3" transform="rotate(96 30 30)" />
              </svg>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
