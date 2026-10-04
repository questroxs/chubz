import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chubz — Coming soon" },
      {
        name: "description",
        content: "Chubz is coming soon.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pink">mrchubz.com</p>
      <h1 className="mt-5 font-display text-7xl leading-none text-paper sm:text-8xl">Chubz</h1>
      <p className="mt-8 text-3xl font-semibold uppercase tracking-[0.18em] text-yellow sm:text-5xl">Coming soon</p>
    </main>
  );
}
