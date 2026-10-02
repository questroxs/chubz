import { createFileRoute, Link } from "@tanstack/react-router";
import { bagProducts, money } from "@/lib/catalog";
import { useOwnerDesk } from "@/lib/owner-desk";

export const Route = createFileRoute("/gear")({
  head: () => ({
    meta: [{ title: "Gear — Chubz" }, { name: "description", content: "Ten bags you can see." }],
  }),
  component: GearPage,
});

function GearPage() {
  const desk = useOwnerDesk();
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-volt">Accessories</p>
      <h1 className="mt-2 text-4xl font-semibold">The bags</h1>
      <p className="mt-3 max-w-2xl text-mute">
        Ten pieces. The photo is the bag, on a person when the shot has one.
        {desk ? ` ${desk.gearNote}` : ""}
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {bagProducts.map((item) => (
          <article key={item.slug} className="border border-line bg-panel">
            <Link to="/product/$slug" params={{ slug: item.slug }} className="block">
              <img src={item.looks[0]?.src} alt={item.artAlt} className="aspect-square w-full object-cover" />
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-yellow">{item.tag}</p>
                <h2 className="mt-1 text-2xl font-semibold">{item.name}</h2>
                <p className="mt-3 w-fit bg-yellow px-2 py-1 text-sm font-bold text-yellow-ink">{money(item.price)}</p>
                {desk && desk.costs[item.slug] != null ? (
                  <p className="mt-2 text-sm text-mute">Wholesale {money(desk.costs[item.slug])}</p>
                ) : null}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}