import { createFileRoute } from "@tanstack/react-router";

const CHUBS = [
  { src: "/art/chub-orange.png", alt: "Orange chub" },
  { src: "/art/chub-blue.png", alt: "Blue chub" },
  { src: "/art/chub-green.png", alt: "Green chub" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chubz — Coming soon" },
      {
        name: "description",
        content: "Chubz is coming soon. Straight off the wall, onto your back.",
      },
    ],
    links: CHUBS.map((chub) => ({ rel: "preload", as: "image", href: chub.src })),
  }),
  component: Home,
});

function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pink">mrchubz.com</p>
      <h1 className="mt-5 font-display text-7xl leading-none text-paper sm:text-8xl">Chubz</h1>
      <p className="mt-8 text-3xl font-semibold uppercase tracking-[0.18em] text-yellow sm:text-5xl">Coming soon</p>
      <p className="mt-4 max-w-md text-lg text-mute">Straight off the wall, onto your back.</p>
      <div className="mt-14 flex items-end justify-center gap-3 sm:gap-6">
        {CHUBS.map((chub) => (
          <img
            key={chub.src}
            src={chub.src}
            alt={chub.alt}
            width={280}
            height={300}
            className="w-24 sm:w-36"
            onError={(event) => {
              event.currentTarget.remove();
            }}
          />
        ))}
      </div>
    </main>
  );
}
