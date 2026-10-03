import { createFileRoute } from "@tanstack/react-router";
import { checkSkateArtLink } from "@/lib/skate-art-check";

const TOKEN = "9f3c7e4a8b21";

export const Route = createFileRoute("/skate-art-check")({
  loader: async ({ location }) => {
    const run = new URL(location.href, "https://mrchubz.com").searchParams.get("run");
    if (run !== TOKEN) return { ok: false, detail: "idle" };
    const hosted = await checkSkateArtLink();
    if ("url" in hosted) return { ok: true, detail: hosted.url };
    return { ok: false, detail: hosted.error };
  },
  component: ArtCheck,
});

function ArtCheck() {
  const result = Route.useLoaderData();
  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-3xl font-semibold">{result.ok ? "Art link ready" : "Art link failed"}</h1>
      <p className="mt-4 break-all text-mute">{result.detail}</p>
    </main>
  );
}
