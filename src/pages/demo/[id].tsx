import { Player } from "@remotion/player";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useEffect } from "react";
import { demos, getDemo, DEFAULT_VIDEO } from "@/demos";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRendering } from "@/helpers/use-rendering";

// Suppress unused-var lint for demos — it is used by the page via getStaticPaths
export { demos };

function RenderPanel({ demoId }: { demoId: string }) {
  const { renderMedia, state, undo } = useRendering(demoId);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  // Auto-trigger download once when render completes
  useEffect(() => {
    if (state.status === "done") {
      downloadRef.current?.click();
    }
  }, [state.status]);

  if (state.status === "init" || state.status === "error") {
    return (
      <div className="space-y-3">
        <Button onClick={renderMedia}>Render &amp; download MP4</Button>
        {state.status === "error" && (
          <p className="text-sm text-destructive">{state.error.message}</p>
        )}
      </div>
    );
  }

  if (state.status === "invoking") {
    return (
      <Button disabled>
        Starting&hellip;
      </Button>
    );
  }

  if (state.status === "rendering") {
    const pct = Math.round(state.progress * 100);
    return (
      <div className="space-y-2">
        <Progress value={state.progress * 100} />
        <p className="text-sm text-muted-foreground">Rendering&hellip; {pct}%</p>
      </div>
    );
  }

  // state.status === "done"
  return (
    <div className="flex items-center gap-3">
      <a
        ref={downloadRef}
        href={state.url}
        download={`${demoId}.mp4`}
        className={buttonVariants({ variant: "default" })}
      >
        Download MP4
      </a>
      <Button variant="secondary" onClick={undo}>
        Render again
      </Button>
    </div>
  );
}

export default function DemoPage() {
  const router = useRouter();
  const { id } = router.query;

  // During hydration id is undefined
  if (typeof id !== "string") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading&hellip;</p>
      </div>
    );
  }

  const demo = getDemo(id);

  if (!demo) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg font-medium">Demo not found.</p>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          &larr; All demos
        </Link>
      </div>
    );
  }

  const fps = demo.fps ?? DEFAULT_VIDEO.fps;
  const width = demo.width ?? DEFAULT_VIDEO.width;
  const height = demo.height ?? DEFAULT_VIDEO.height;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Head>
        <title>{demo.title} — remocn demos</title>
        <meta name="description" content={demo.description} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto max-w-4xl px-4 py-12 space-y-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; All demos
        </Link>

        {/* Title + description */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{demo.title}</h1>
          <p className="mt-2 text-muted-foreground">{demo.description}</p>
        </div>

        {/* Player */}
        <div
          className="overflow-hidden rounded-xl"
          style={{ aspectRatio: `${width} / ${height}` }}
        >
          <Player
            component={demo.component}
            durationInFrames={demo.durationInFrames}
            fps={fps}
            compositionWidth={width}
            compositionHeight={height}
            inputProps={demo.defaultProps ?? {}}
            controls
            autoPlay
            loop
            style={{ width: "100%" }}
          />
        </div>

        {/* Render panel */}
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h2 className="text-base font-semibold">Export</h2>
          <RenderPanel demoId={demo.id} />
        </div>
      </main>
    </div>
  );
}
