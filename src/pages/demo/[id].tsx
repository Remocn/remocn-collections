import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeftIcon } from "lucide-react";
import { demos, getDemo, DEFAULT_VIDEO } from "@/demos";
import { SiteHeader } from "@/components/site/site-header";
import {
  CodeBlockCommand,
  convertNpmCommand,
} from "@/components/code-block-command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SourceFile } from "@/lib/demo-page-data";
import { SITE_URL } from "@/lib/site-config";

const Player = dynamic(
  () => import("@remotion/player").then((m) => m.Player),
  { ssr: false },
);

type Props = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  promptIsDraft: boolean;
  installCmd: string;
  renderCmd: string;
  sources: SourceFile[];
};

const DemoPage: NextPage<Props> = ({
  id,
  title,
  description,
  prompt,
  promptIsDraft,
  installCmd,
  renderCmd,
  sources,
}) => {
  const demo = getDemo(id);
  if (!demo) return null;

  const fps = demo.fps ?? DEFAULT_VIDEO.fps;
  const width = demo.width ?? DEFAULT_VIDEO.width;
  const height = demo.height ?? DEFAULT_VIDEO.height;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Head>
        <title>{`${title} — remocn demos`}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={`${SITE_URL}/demo/${id}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="remocn demos" />
        <meta property="og:url" content={`${SITE_URL}/demo/${id}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${SITE_URL}/og/${id}.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-base text-muted-foreground hover:text-foreground sm:text-sm"
        >
          <ArrowLeftIcon className="size-4 shrink-0" aria-hidden="true" />
          All demos
        </Link>

        <div className="mt-6">
          <h1 className="max-w-[35ch] text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-[56ch] text-lg text-pretty text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Video */}
        <div
          className="mt-8 overflow-hidden rounded-[min(1.5vw,14px)] outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
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

        {/* Install */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">
            Install this video
          </h2>
          <p className="mt-2 max-w-[56ch] text-base text-pretty text-muted-foreground sm:text-sm">
            Adds the full composition, its remocn dependencies, and the prompt
            to your Remotion project via the shadcn registry.
          </p>
          <div className="mt-4">
            <CodeBlockCommand
              prompt={`Add the "${id}" demo video from the kapishdima/remocn-demo shadcn registry to my Remotion project and register the composition.`}
              {...convertNpmCommand(installCmd)}
            />
          </div>
        </section>

        {/* Render */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">
            Render it locally
          </h2>
          <p className="mt-2 max-w-[56ch] text-base text-pretty text-muted-foreground sm:text-sm">
            Renders the MP4 on your machine with the Remotion CLI.
          </p>
          <div className="mt-4">
            <CodeBlockCommand {...convertNpmCommand(renderCmd)} />
          </div>
        </section>

        {/* Prompt */}
        <section className="mt-10">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight">The prompt</h2>
            {promptIsDraft && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                Reconstructed draft
              </span>
            )}
          </div>
          <p className="mt-2 max-w-[56ch] text-base text-pretty text-muted-foreground sm:text-sm">
            {promptIsDraft
              ? "A reconstruction of the prompt this video was generated from."
              : "The prompt this video was generated from."}
          </p>
          <blockquote className="mt-4 rounded-xl bg-muted/50 p-5 sm:p-6">
            <p className="text-base/7 whitespace-pre-wrap text-pretty">
              {prompt}
            </p>
          </blockquote>
        </section>

        {/* Code */}
        <section className="mt-10 pb-20">
          <h2 className="text-xl font-semibold tracking-tight">The code</h2>
          <p className="mt-2 max-w-[56ch] text-base text-pretty text-muted-foreground sm:text-sm">
            The exact source the AI wrote — the same files the install command
            puts in your project.
          </p>
          <Tabs defaultValue={sources[0]?.name} className="mt-4">
            <TabsList>
              {sources.map((file) => (
                <TabsTrigger key={file.name} value={file.name}>
                  {file.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {sources.map((file) => (
              <TabsContent key={file.name} value={file.name}>
                <div className="code-viewer max-h-[32rem] overflow-auto rounded-xl outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10">
                  <div dangerouslySetInnerHTML={{ __html: file.html }} />
                  {file.truncated && (
                    <p className="border-t border-border/60 p-4 text-base text-muted-foreground sm:text-sm">
                      Showing the first 400 of {file.totalLines} lines.{" "}
                      <a
                        href={file.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-foreground hover:underline"
                      >
                        View the full file on GitHub
                      </a>
                      .
                    </p>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </main>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: demos.map((demo) => ({ params: { id: demo.id } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const id = params?.id as string;
  const demo = demos.find((d) => d.id === id);
  if (!demo) return { notFound: true };

  const { readDemoMeta, readPrompt, readSources, installCommand, renderCommand } =
    await import("@/lib/demo-page-data");
  const meta = readDemoMeta()[id];
  const { prompt, isDraft } = readPrompt(id);
  const sources = await readSources(id);

  return {
    props: {
      id,
      title: demo.title,
      description: demo.description,
      prompt,
      promptIsDraft: isDraft,
      installCmd: installCommand(id),
      renderCmd: renderCommand(id, meta?.usesShaders ?? false),
      sources,
    },
  };
};

export default DemoPage;
