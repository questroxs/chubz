import { Link } from "@tanstack/react-router";
import { laneLabel, money, type Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const look = product.looks[0];
  return (
    <article className="border border-line bg-panel">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <img src={look.src} alt={look.alt} className="aspect-[3/4] w-full object-cover" />
        <div className="flex items-end justify-between gap-3 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-volt">
              {laneLabel(product.lane)} · {product.tag}
            </p>
            <h3 className="mt-1 text-xl font-semibold">{product.name}</h3>
            <p className="mt-1 text-sm text-mute">S–XXL · pick the colors</p>
          </div>
          <p className="shrink-0 bg-yellow px-2 py-1 text-sm font-bold text-yellow-ink">
            {money(product.price)}
          </p>
        </div>
      </Link>
    </article>
  );
}
