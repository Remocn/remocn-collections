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

// Colors — the zinc ramp, the palette the whole system runs on.
const ZINC_RAMP = [
  "#fafafa",
  "#f4f4f5",
  "#e4e4e7",
  "#d4d4d8",
  "#a1a1aa",
  "#71717a",
  "#52525b",
  "#3f3f46",
  "#27272a",
  "#18181b",
];

const ColorsBeat: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <CategoryFrame label="Colors">
      <div style={{ display: "flex", gap: 10 }}>
        {ZINC_RAMP.map((hex, i) => {
          const d = 4 + i * 2.5;
          const enter = interpolate(frame, [d, d + 10], [0, 1], {
            ...clampOpts,
            easing: Easing.out(Easing.cubic),
          });
          return (
            <div
              key={hex}
              style={{
                width: 64,
                height: 96,
                borderRadius: 10,
                background: hex,
                border: "1px solid rgba(250,250,250,0.14)",
                opacity: enter,
                transform: `translateY(${(1 - enter) * 18}px)`,
              }}
            />
          );
        })}
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
