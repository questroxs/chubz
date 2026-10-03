import { createFileRoute, Link } from "@tanstack/react-router";
import { colorById, FREE_SHIP_AT, getProduct, money, STANDARD_SHIPPING, unitPrice } from "@/lib/catalog";
import { blankById, colorOnBlank, defaultBlankId } from "@/lib/blanks";
import { bagCount, useShop } from "@/lib/shop-store";
import { useSkateCatalog } from "@/lib/skate-host";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — Chubz" }] }),
  component: CartPage,
});

function CartPage() {
  const hydrated = useShop((state) => state.hydrated);
  const lines = useShop((state) => state.lines);
  const setQty = useShop((state) => state.setQty);
  const remove = useShop((state) => state.remove);
  const setCartOpen = useShop((state) => state.setCartOpen);
  useSkateCatalog();

  const rows = lines
    .map((line) => {
      const product = getProduct(line.slug);
      const blankId = line.blankId ?? (product && !product.custom && product.lane !== "bag" && product.lane !== "skate" ? defaultBlankId(product.lane) : undefined);
      const price = unitPrice(line.slug, line.backPrint, blankId, line);
      const color = (blankId ? colorOnBlank(blankId, line.colorId) : undefined) ?? colorById(line.colorId);
      if (!product || price == null || !color) return null;
      return { ...line, product, price, color };
    })
    .filter((row) => row !== null);

  const subtotal = rows.reduce((sum, row) => sum + row.price * row.qty, 0);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-semibold">Cart</h1>
      {!hydrated ? <p className="mt-6 text-mute">Checking the cart…</p> : null}
      {hydrated && rows.length === 0 ? (
        <div className="mt-8 border border-line bg-panel p-6">
          <p className="text-lg">Nothing in the cart.</p>
          <Link to="/shop" search={{ lane: "all" }} className="mt-4 inline-flex min-h-11 items-center bg-pink px-4 font-semibold uppercase tracking-widest text-pink-ink">
            Hit the rack
          </Link>
        </div>
      ) : null}
      {hydrated && rows.length > 0 ? (
        <div className="mt-8">
          <ul className="divide-y divide-line border border-line">
            {rows.map((row) => (
              <li key={row.id} className="flex gap-4 bg-panel p-4">
                {row.art || row.product.looks[0]?.src ? (
                  <img src={row.art ?? row.product.looks[0].src} alt="" className="h-28 w-20 object-cover" />
                ) : (
                  <div className="grid h-28 w-20 place-items-center bg-ink px-1 text-center text-[10px] font-bold uppercase">{row.product.tag}</div>
                )}
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold">{row.product.name}</h2>
                      <p className="text-sm text-mute">
                        {row.product.oneSize ? "One size" : `${blankById(row.blankId)?.name ? `${blankById(row.blankId)?.name} · ` : ""}${row.color.name} · size ${row.size}`}
                        {row.backPrint ? " · front + back" : ""}
                      </p>
                      {row.note ? <p className="mt-1 line-clamp-4 whitespace-pre-line text-xs text-mute">{row.note}</p> : null}
                    </div>
                    <p className="font-semibold">{money(row.price * row.qty)}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-2 pt-3">
                    <button type="button" className="size-11 border border-line" aria-label="Decrease" onClick={() => setQty(row.id, row.qty - 1)}>
                      −
                    </button>
                    <span className="w-6 text-center">{row.qty}</span>
                    <button type="button" className="size-11 border border-line" aria-label="Increase" onClick={() => setQty(row.id, row.qty + 1)}>
                      +
                    </button>
                    <button type="button" className="ml-auto min-h-11 px-2 text-sm uppercase tracking-widest text-mute hover:text-pink" onClick={() => remove(row.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-mute">Pieces ({bagCount(lines)})</dt>
              <dd>{money(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-mute">Shipping</dt>
              <dd>{subtotal >= FREE_SHIP_AT ? "Free standard at Stripe" : `${money(STANDARD_SHIPPING)} standard, or expedited, at Stripe`}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center bg-pink font-semibold uppercase tracking-widest text-pink-ink sm:w-auto sm:px-8"
          >
            Checkout with Stripe
          </button>
        </div>
      ) : null}
    </main>
  );
}
