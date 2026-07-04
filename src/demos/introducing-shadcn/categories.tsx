import React from "react";
import {
  AbsoluteFill,
  Easing,
  Series,
  interpolate,
  useCurrentFrame,
} from "remotion";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/demos/_ui/card";
import { Label } from "@/demos/_ui/label";
import { Switch } from "@/demos/_ui/switch";
import { AppSidebar } from "@/demos/_ui/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/demos/_ui/breadcrumb";
import { Separator } from "@/demos/_ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/demos/_ui/sidebar";
import { TooltipProvider } from "@/demos/_ui/tooltip";

import { MiniBars } from "./field";

const SANS =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const INK = "#fafafa";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const CAT_BEAT = 56;
const BLOCKS_BEAT = 96;

// Shared beat frame: label and live UI as one centered column. `themed`
// wraps the UI in the dark theme class; the Themes beat manages its own.
const CategoryFrame: React.FC<{
  label: string;
  themed?: boolean;
  children: React.ReactNode;
}> = ({ label, themed = true, children }) => {
  const frame = useCurrentFrame();

  const labelOpacity = interpolate(frame, [0, 7], [0, 1], clampOpts);
  const labelY = interpolate(frame, [0, 8], [10, 0], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const labelBlur = interpolate(frame, [0, 7], [6, 0], clampOpts);

  const uiIn = interpolate(frame, [4, 16], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 46,
          color: INK,
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
          filter: `blur(${labelBlur}px)`,
        }}
      >
        {label}
      </span>
      <div
        className={`${themed ? "dark " : ""}**:font-normal!`}
        style={{
          marginTop: 36,
          opacity: uiIn,
          transform: `translateY(${(1 - uiIn) * 24}px) scale(${
            0.97 + uiIn * 0.03
          })`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

// Blocks — the real sidebar-07 block from the shadcn registry, assembling
// itself: the frame resolves, the sidebar slides in from the left, the
// header settles, and the content placeholders cascade in. The sidebar's
// internals live in registry files, so its slide is driven by a
// frame-computed <style> rule instead of edits to those files.
const BlocksBeat: React.FC = () => {
  const frame = useCurrentFrame();

  const easeOut = Easing.out(Easing.cubic);

  const sbX = interpolate(frame, [6, 26], [-72, 0], {
    ...clampOpts,
    easing: easeOut,
  });
  const sbOpacity = interpolate(frame, [6, 22], [0, 1], clampOpts);

  const headerIn = interpolate(frame, [16, 30], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });

  const cardIn = (delay: number) =>
    interpolate(frame, [delay, delay + 14], [0, 1], {
      ...clampOpts,
      easing: easeOut,
    });
  const cards = [cardIn(20), cardIn(26), cardIn(32)];
  const heroIn = cardIn(38);

  return (
    <CategoryFrame label="Blocks">
      {/* The wrapper is exactly the block's scaled size, so the centered
          column truly centers the visible block (no phantom layout space). */}
      <div style={{ position: "relative", width: 1120 * 0.72, height: 600 * 0.72 }}>
      <div
        data-blocks-anim
        className="absolute left-0 top-0 h-[600px] w-[1120px] overflow-hidden rounded-xl border border-border bg-background [&_[data-slot=sidebar-container]]:absolute! [&_[data-slot=sidebar-container]]:h-full!"
        style={{ transform: "scale(0.72)", transformOrigin: "top left" }}
      >
        <style>{`[data-blocks-anim] [data-slot=sidebar-container]{transform:translateX(${sbX}px);opacity:${sbOpacity};}`}</style>
        <TooltipProvider>
          <SidebarProvider className="h-full min-h-0">
            <AppSidebar />
            <SidebarInset className="min-h-0">
              <header
                className="flex h-16 shrink-0 items-center gap-2 px-4"
                style={{
                  opacity: headerIn,
                  transform: `translateY(${(1 - headerIn) * -10}px)`,
                }}
              >
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink>Building Your Application</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </header>
              <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                  {cards.map((p, i) => (
                    <div
                      key={i}
                      className="aspect-video rounded-xl bg-muted/50"
                      style={{
                        opacity: p,
                        transform: `translateY(${(1 - p) * 20}px) scale(${
                          0.97 + p * 0.03
                        })`,
                      }}
                    />
                  ))}
                </div>
                <div
                  className="flex-1 rounded-xl bg-muted/50"
                  style={{
                    opacity: heroIn,
                    transform: `translateY(${(1 - heroIn) * 24}px) scale(${
                      0.98 + heroIn * 0.02
                    })`,
                  }}
                />
              </div>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </div>
      </div>
    </CategoryFrame>
  );
};

// Charts — a monochrome bar chart drawing itself live.
const ChartsBeat: React.FC = () => (
  <CategoryFrame label="Charts">
    <Card className="w-[560px]">
      <CardHeader>
        <CardDescription>Exercise minutes</CardDescription>
        <CardTitle className="text-3xl">1,284</CardTitle>
      </CardHeader>
      <CardContent>
        <MiniBars
          values={[38, 62, 44, 78, 52, 70, 88, 58, 72, 84, 60, 92, 68, 80]}
          height={140}
          barWidth={26}
          gap={10}
          color="#a1a1aa"
          stagger={2}
        />
      </CardContent>
    </Card>
  </CategoryFrame>
);

// Themes — the same card, hard-flipping between dark and light.
const ThemeCard: React.FC = () => (
  <Card className="w-[380px]">
    <CardHeader>
      <CardTitle>Notifications</CardTitle>
      <CardDescription>How you want to be notified</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="cat-push">Push notifications</Label>
        <Switch id="cat-push" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="cat-digest">Weekly digest</Label>
        <Switch id="cat-digest" />
      </div>
    </CardContent>
  </Card>
);

const ThemesBeat: React.FC = () => {
  const frame = useCurrentFrame();
  // Two hard theme flips — dark → light → dark. The flip IS the beat.
  const phase = frame >= 20 && frame < 38 ? "light" : "dark";

  return (
    <CategoryFrame label="Themes" themed={false}>
      <div className={phase === "light" ? "" : "dark"}>
        <ThemeCard />
      </div>
    </CategoryFrame>
  );
};

// Colors — the real Tailwind palette the system ships with: 22 ramps ×
// 11 shades (50→950) in docs order, values verbatim from tailwindcss v4's
// theme.css. The one beat where color itself is the point.
const TAILWIND_PALETTE: string[][] = [
  // red
  ["oklch(97.1% 0.013 17.38)", "oklch(93.6% 0.032 17.717)", "oklch(88.5% 0.062 18.334)", "oklch(80.8% 0.114 19.571)", "oklch(70.4% 0.191 22.216)", "oklch(63.7% 0.237 25.331)", "oklch(57.7% 0.245 27.325)", "oklch(50.5% 0.213 27.518)", "oklch(44.4% 0.177 26.899)", "oklch(39.6% 0.141 25.723)", "oklch(25.8% 0.092 26.042)"],
  // orange
  ["oklch(98% 0.016 73.684)", "oklch(95.4% 0.038 75.164)", "oklch(90.1% 0.076 70.697)", "oklch(83.7% 0.128 66.29)", "oklch(75% 0.183 55.934)", "oklch(70.5% 0.213 47.604)", "oklch(64.6% 0.222 41.116)", "oklch(55.3% 0.195 38.402)", "oklch(47% 0.157 37.304)", "oklch(40.8% 0.123 38.172)", "oklch(26.6% 0.079 36.259)"],
  // amber
  ["oklch(98.7% 0.022 95.277)", "oklch(96.2% 0.059 95.617)", "oklch(92.4% 0.12 95.746)", "oklch(87.9% 0.169 91.605)", "oklch(82.8% 0.189 84.429)", "oklch(76.9% 0.188 70.08)", "oklch(66.6% 0.179 58.318)", "oklch(55.5% 0.163 48.998)", "oklch(47.3% 0.137 46.201)", "oklch(41.4% 0.112 45.904)", "oklch(27.9% 0.077 45.635)"],
  // yellow
  ["oklch(98.7% 0.026 102.212)", "oklch(97.3% 0.071 103.193)", "oklch(94.5% 0.129 101.54)", "oklch(90.5% 0.182 98.111)", "oklch(85.2% 0.199 91.936)", "oklch(79.5% 0.184 86.047)", "oklch(68.1% 0.162 75.834)", "oklch(55.4% 0.135 66.442)", "oklch(47.6% 0.114 61.907)", "oklch(42.1% 0.095 57.708)", "oklch(28.6% 0.066 53.813)"],
  // lime
  ["oklch(98.6% 0.031 120.757)", "oklch(96.7% 0.067 122.328)", "oklch(93.8% 0.127 124.321)", "oklch(89.7% 0.196 126.665)", "oklch(84.1% 0.238 128.85)", "oklch(76.8% 0.233 130.85)", "oklch(64.8% 0.2 131.684)", "oklch(53.2% 0.157 131.589)", "oklch(45.3% 0.124 130.933)", "oklch(40.5% 0.101 131.063)", "oklch(27.4% 0.072 132.109)"],
  // green
  ["oklch(98.2% 0.018 155.826)", "oklch(96.2% 0.044 156.743)", "oklch(92.5% 0.084 155.995)", "oklch(87.1% 0.15 154.449)", "oklch(79.2% 0.209 151.711)", "oklch(72.3% 0.219 149.579)", "oklch(62.7% 0.194 149.214)", "oklch(52.7% 0.154 150.069)", "oklch(44.8% 0.119 151.328)", "oklch(39.3% 0.095 152.535)", "oklch(26.6% 0.065 152.934)"],
  // emerald
  ["oklch(97.9% 0.021 166.113)", "oklch(95% 0.052 163.051)", "oklch(90.5% 0.093 164.15)", "oklch(84.5% 0.143 164.978)", "oklch(76.5% 0.177 163.223)", "oklch(69.6% 0.17 162.48)", "oklch(59.6% 0.145 163.225)", "oklch(50.8% 0.118 165.612)", "oklch(43.2% 0.095 166.913)", "oklch(37.8% 0.077 168.94)", "oklch(26.2% 0.051 172.552)"],
  // teal
  ["oklch(98.4% 0.014 180.72)", "oklch(95.3% 0.051 180.801)", "oklch(91% 0.096 180.426)", "oklch(85.5% 0.138 181.071)", "oklch(77.7% 0.152 181.912)", "oklch(70.4% 0.14 182.503)", "oklch(60% 0.118 184.704)", "oklch(51.1% 0.096 186.391)", "oklch(43.7% 0.078 188.216)", "oklch(38.6% 0.063 188.416)", "oklch(27.7% 0.046 192.524)"],
  // cyan
  ["oklch(98.4% 0.019 200.873)", "oklch(95.6% 0.045 203.388)", "oklch(91.7% 0.08 205.041)", "oklch(86.5% 0.127 207.078)", "oklch(78.9% 0.154 211.53)", "oklch(71.5% 0.143 215.221)", "oklch(60.9% 0.126 221.723)", "oklch(52% 0.105 223.128)", "oklch(45% 0.085 224.283)", "oklch(39.8% 0.07 227.392)", "oklch(30.2% 0.056 229.695)"],
  // sky
  ["oklch(97.7% 0.013 236.62)", "oklch(95.1% 0.026 236.824)", "oklch(90.1% 0.058 230.902)", "oklch(82.8% 0.111 230.318)", "oklch(74.6% 0.16 232.661)", "oklch(68.5% 0.169 237.323)", "oklch(58.8% 0.158 241.966)", "oklch(50% 0.134 242.749)", "oklch(44.3% 0.11 240.79)", "oklch(39.1% 0.09 240.876)", "oklch(29.3% 0.066 243.157)"],
  // blue
  ["oklch(97% 0.014 254.604)", "oklch(93.2% 0.032 255.585)", "oklch(88.2% 0.059 254.128)", "oklch(80.9% 0.105 251.813)", "oklch(70.7% 0.165 254.624)", "oklch(62.3% 0.214 259.815)", "oklch(54.6% 0.245 262.881)", "oklch(48.8% 0.243 264.376)", "oklch(42.4% 0.199 265.638)", "oklch(37.9% 0.146 265.522)", "oklch(28.2% 0.091 267.935)"],
  // indigo
  ["oklch(96.2% 0.018 272.314)", "oklch(93% 0.034 272.788)", "oklch(87% 0.065 274.039)", "oklch(78.5% 0.115 274.713)", "oklch(67.3% 0.182 276.935)", "oklch(58.5% 0.233 277.117)", "oklch(51.1% 0.262 276.966)", "oklch(45.7% 0.24 277.023)", "oklch(39.8% 0.195 277.366)", "oklch(35.9% 0.144 278.697)", "oklch(25.7% 0.09 281.288)"],
  // violet
  ["oklch(96.9% 0.016 293.756)", "oklch(94.3% 0.029 294.588)", "oklch(89.4% 0.057 293.283)", "oklch(81.1% 0.111 293.571)", "oklch(70.2% 0.183 293.541)", "oklch(60.6% 0.25 292.717)", "oklch(54.1% 0.281 293.009)", "oklch(49.1% 0.27 292.581)", "oklch(43.2% 0.232 292.759)", "oklch(38% 0.189 293.745)", "oklch(28.3% 0.141 291.089)"],
  // purple
  ["oklch(97.7% 0.014 308.299)", "oklch(94.6% 0.033 307.174)", "oklch(90.2% 0.063 306.703)", "oklch(82.7% 0.119 306.383)", "oklch(71.4% 0.203 305.504)", "oklch(62.7% 0.265 303.9)", "oklch(55.8% 0.288 302.321)", "oklch(49.6% 0.265 301.924)", "oklch(43.8% 0.218 303.724)", "oklch(38.1% 0.176 304.987)", "oklch(29.1% 0.149 302.717)"],
  // fuchsia
  ["oklch(97.7% 0.017 320.058)", "oklch(95.2% 0.037 318.852)", "oklch(90.3% 0.076 319.62)", "oklch(83.3% 0.145 321.434)", "oklch(74% 0.238 322.16)", "oklch(66.7% 0.295 322.15)", "oklch(59.1% 0.293 322.896)", "oklch(51.8% 0.253 323.949)", "oklch(45.2% 0.211 324.591)", "oklch(40.1% 0.17 325.612)", "oklch(29.3% 0.136 325.661)"],
  // pink
  ["oklch(97.1% 0.014 343.198)", "oklch(94.8% 0.028 342.258)", "oklch(89.9% 0.061 343.231)", "oklch(82.3% 0.12 346.018)", "oklch(71.8% 0.202 349.761)", "oklch(65.6% 0.241 354.308)", "oklch(59.2% 0.249 0.584)", "oklch(52.5% 0.223 3.958)", "oklch(45.9% 0.187 3.815)", "oklch(40.8% 0.153 2.432)", "oklch(28.4% 0.109 3.907)"],
  // rose
  ["oklch(96.9% 0.015 12.422)", "oklch(94.1% 0.03 12.58)", "oklch(89.2% 0.058 10.001)", "oklch(81% 0.117 11.638)", "oklch(71.2% 0.194 13.428)", "oklch(64.5% 0.246 16.439)", "oklch(58.6% 0.253 17.585)", "oklch(51.4% 0.222 16.935)", "oklch(45.5% 0.188 13.697)", "oklch(41% 0.159 10.272)", "oklch(27.1% 0.105 12.094)"],
  // slate
  ["oklch(98.4% 0.003 247.858)", "oklch(96.8% 0.007 247.896)", "oklch(92.9% 0.013 255.508)", "oklch(86.9% 0.022 252.894)", "oklch(70.4% 0.04 256.788)", "oklch(55.4% 0.046 257.417)", "oklch(44.6% 0.043 257.281)", "oklch(37.2% 0.044 257.287)", "oklch(27.9% 0.041 260.031)", "oklch(20.8% 0.042 265.755)", "oklch(12.9% 0.042 264.695)"],
  // gray
  ["oklch(98.5% 0.002 247.839)", "oklch(96.7% 0.003 264.542)", "oklch(92.8% 0.006 264.531)", "oklch(87.2% 0.01 258.338)", "oklch(70.7% 0.022 261.325)", "oklch(55.1% 0.027 264.364)", "oklch(44.6% 0.03 256.802)", "oklch(37.3% 0.034 259.733)", "oklch(27.8% 0.033 256.848)", "oklch(21% 0.034 264.665)", "oklch(13% 0.028 261.692)"],
  // zinc
  ["oklch(98.5% 0 0)", "oklch(96.7% 0.001 286.375)", "oklch(92% 0.004 286.32)", "oklch(87.1% 0.006 286.286)", "oklch(70.5% 0.015 286.067)", "oklch(55.2% 0.016 285.938)", "oklch(44.2% 0.017 285.786)", "oklch(37% 0.013 285.805)", "oklch(27.4% 0.006 286.033)", "oklch(21% 0.006 285.885)", "oklch(14.1% 0.005 285.823)"],
  // neutral
  ["oklch(98.5% 0 0)", "oklch(97% 0 0)", "oklch(92.2% 0 0)", "oklch(87% 0 0)", "oklch(70.8% 0 0)", "oklch(55.6% 0 0)", "oklch(43.9% 0 0)", "oklch(37.1% 0 0)", "oklch(26.9% 0 0)", "oklch(20.5% 0 0)", "oklch(14.5% 0 0)"],
  // stone
  ["oklch(98.5% 0.001 106.423)", "oklch(97% 0.001 106.424)", "oklch(92.3% 0.003 48.717)", "oklch(86.9% 0.005 56.366)", "oklch(70.9% 0.01 56.259)", "oklch(55.3% 0.013 58.071)", "oklch(44.4% 0.011 73.639)", "oklch(37.4% 0.01 67.558)", "oklch(26.8% 0.007 34.298)", "oklch(21.6% 0.006 56.043)", "oklch(14.7% 0.004 49.25)"],
];

const ColorsBeat: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <CategoryFrame label="Colors">
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {TAILWIND_PALETTE.map((ramp, row) => (
          <div key={row} style={{ display: "flex", gap: 5 }}>
            {ramp.map((color, col) => {
              const d = 4 + row * 0.9 + col;
              const enter = interpolate(frame, [d, d + 9], [0, 1], {
                ...clampOpts,
                easing: Easing.out(Easing.cubic),
              });
              return (
                <div
                  key={col}
                  style={{
                    width: 68,
                    height: 18,
                    borderRadius: 4,
                    background: color,
                    border: "1px solid rgba(250,250,250,0.08)",
                    opacity: enter,
                    transform: `translateY(${(1 - enter) * 10}px)`,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </CategoryFrame>
  );
};

const BEATS: { label: string; dur: number; node: React.ReactNode }[] = [
  { label: "Blocks", dur: BLOCKS_BEAT, node: <BlocksBeat /> },
  { label: "Charts", dur: CAT_BEAT, node: <ChartsBeat /> },
  { label: "Themes", dur: CAT_BEAT, node: <ThemesBeat /> },
  { label: "Colors", dur: CAT_BEAT, node: <ColorsBeat /> },
];

export const categorySceneDuration = (tailOverlap: number) =>
  BEATS.reduce((acc, b) => acc + b.dur, 0) + tailOverlap;

export const CategoriesScene: React.FC<{ tailOverlap: number }> = ({
  tailOverlap,
}) => (
  <AbsoluteFill>
    <Series>
      {BEATS.map((beat, i) => (
        <Series.Sequence
          key={beat.label}
          durationInFrames={
            i === BEATS.length - 1 ? beat.dur + tailOverlap : beat.dur
          }
        >
          {beat.node}
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
