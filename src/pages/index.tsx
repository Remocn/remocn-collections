import { Thumbnail } from "@remotion/player";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { demos, DEFAULT_VIDEO } from "@/demos";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Head>
        <title>remocn demos</title>
        <meta
          name="description"
          content="A gallery of animated UI demos built with remocn and Remotion."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">remocn demos</h1>
          <p className="mt-2 text-muted-foreground">
            Animated UI components rendered as video, built with remocn
            primitives.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {demos.map((demo) => (
            <Link key={demo.id} href={`/demo/${demo.id}`} className="group block">
              <Card className="h-full transition-shadow pt-0 ring-border">
                <Thumbnail
                    component={demo.component}
                    durationInFrames={demo.durationInFrames}
                    fps={demo.fps ?? DEFAULT_VIDEO.fps}
                    compositionWidth={demo.width ?? DEFAULT_VIDEO.width}
                    compositionHeight={demo.height ?? DEFAULT_VIDEO.height}
                    frameToDisplay={
                      demo.thumbnailFrame ??
                      Math.floor(demo.durationInFrames / 2)
                    }
                    inputProps={demo.defaultProps ?? {}}
                    style={{ width: "100%" }}
                  />
                <CardHeader>
                  <CardTitle>{demo.title}</CardTitle>
                  <CardDescription>{demo.description}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
