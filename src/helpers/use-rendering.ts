import { useCallback, useMemo, useState } from "react";

export type State =
  | { status: "init" }
  | { status: "invoking" }
  | { status: "rendering"; progress: number }
  | { status: "done"; url: string }
  | { status: "error"; error: Error };

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const useRendering = (id: string) => {
  const [state, setState] = useState<State>({ status: "init" });

  const renderMedia = useCallback(async () => {
    setState({ status: "invoking" });

    try {
      const startRes = await fetch("/api/render", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!startRes.ok) {
        const err = (await startRes.json()) as { error: string };
        throw new Error(err.error ?? "Failed to start render");
      }

      const { renderId } = (await startRes.json()) as { renderId: string };

      setState({ status: "rendering", progress: 0 });

      let pending = true;
      while (pending) {
        await wait(1000);

        const pollRes = await fetch(
          `/api/render/progress?renderId=${encodeURIComponent(renderId)}`,
        );
        const data = (await pollRes.json()) as {
          status: "rendering" | "done" | "error";
          progress: number;
          url?: string;
          error?: string;
        };

        switch (data.status) {
          case "rendering":
            setState({ status: "rendering", progress: data.progress });
            break;
          case "done":
            setState({ status: "done", url: data.url as string });
            pending = false;
            break;
          case "error":
            setState({
              status: "error",
              error: new Error(data.error ?? "Unknown render error"),
            });
            pending = false;
            break;
        }
      }
    } catch (err) {
      setState({
        status: "error",
        error: err instanceof Error ? err : new Error(String(err)),
      });
    }
  }, [id]);

  const undo = useCallback(() => {
    setState({ status: "init" });
  }, []);

  return useMemo(() => ({ renderMedia, state, undo }), [renderMedia, state, undo]);
};
