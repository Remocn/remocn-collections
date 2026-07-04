import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { demoCatalog } from "@/demos/catalog";
import { SiteHeader } from "@/components/site/site-header";
import { CodeBlockCommand } from "@/components/code-block-command";
import { convertNpmCommand } from "@/lib/npm-command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  readDemoMeta,
  readPrompt,
  readSources,
  installCommand,
  renderCommand,
} from "@/lib/demo-page-data";
import { SITE_URL } from "@/lib/site-config";
import { DemoPlayer } from "./demo-player";

export const dynamicParams = false;

export function generateStaticParams() {
  return demoCatalog.map((demo) => ({ id: demo.id }));
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const demo = demoCatalog.find((d) => d.id === id);
  if (!demo) return {};

  return {
    title: `${demo.title} — remocn demos`,
    description: demo.description,
    alternates: { canonical: `${SITE_URL}/demo/${id}` },
    openGraph: {
      type: "website",
      siteName: "remocn demos",
      url: `${SITE_URL}/demo/${id}`,
      title: demo.title,
      description: demo.description,
      images: [{ url: `${SITE_URL}/og/${id}.png`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function DemoPage({ params }: PageProps) {
  const { id } = await params;
  const demo = demoCatalog.find((d) => d.id === id);
  if (!demo) notFound();

  const meta = readDemoMeta()[id];
  const { prompt, isDraft: promptIsDraft } = readPrompt(id);
  const sources = await readSources(id);
  const installCmd = installCommand(id);
  const renderCmd = renderCommand(id, meta?.usesShaders ?? false);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-base text-muted-foreground hover:text-foreground sm:text-sm"
        >
          <ArrowLeftIcon className="size-4 shrink-0" aria-hidden="true" />
          All demos
        </Link>

        <div className="mt-6">
          <h1 className="max-w-[35ch] text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {demo.title}
          </h1>
        </div>

        {/* Video */}
        <DemoPlayer id={id} />

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
}
