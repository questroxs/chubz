import { createFileRoute, Link } from "@tanstack/react-router";
import { CapRack } from "@/components/cap-rack";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/catalog";

type ShopSearch = { lane: "all" | "tee" | "hoodie" | "cap" };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    const lane = search.lane;
    if (lane === "tee" || lane === "hoodie" || lane === "cap") return { lane };
    return { lane: "all" };
  },
  head: () => ({
    meta: [{ title: "Shop — Chubz" }],
  }),
  component: ShopPage,
});

const filters: { lane: ShopSearch["lane"]; label: string }[] = [
  { lane: "all", label: "All" },
  { lane: "tee", label: "Tees" },
  { lane: "hoodie", label: "Hoodies" },
  { lane: "cap", label: "Caps" },
];

function ShopPage() {
  const { lane } = Route.useSearch();
  const list = products.filter((product) => lane === "all" || product.lane === lane);
  const caps = lane === "all" || lane === "cap";

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-pink">Print on demand</p>
      <h1 className="mt-2 text-4xl font-semibold">{lane === "cap" ? "Embroidered caps" : "The rack"}</h1>
      <p className="mt-3 max-w-xl text-mute">
        {lane === "cap"
          ? "Unisex Printful caps. The chub is embroidered on the front. Pick the hat, then the color."
          : "Unisex tees, hoodies, and embroidered caps. The price is on each blank."}
      </p>
      <div className="mt-6 flex flex-wrap gap-2" aria-label="Filter">
        {filters.map((filter) => {
          const active = filter.lane === lane;
          return (
            <Link
              key={filter.lane}
              to="/shop"
              search={{ lane: filter.lane }}
              className={
                active
                  ? "inline-flex min-h-11 items-center bg-paper px-4 font-semibold uppercase tracking-widest text-ink"
                  : "inline-flex min-h-11 items-center border border-line px-4 font-semibold uppercase tracking-widest text-paper"
              }
            >
              {filter.label}
            </Link>
          );
        })}
      </div>
      {lane === "cap" ? null : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {list.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
      {caps ? (
        <section className={lane === "cap" ? "mt-8" : "mt-14"}>
          {lane === "cap" ? null : (
            <div className="mb-5">
              <h2 className="text-2xl font-semibold">Embroidered caps</h2>
              <p className="mt-2 text-mute">Stitched on the front. Not a print.</p>
            </div>
          )}
          <CapRack />
        </section>
      ) : null}
    </main>
  );
}
