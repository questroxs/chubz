import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { colorById, FREE_SHIP_AT, getProduct, money, unitPrice } from "@/lib/catalog";
import { blankById, colorOnBlank, defaultBlankId } from "@/lib/blanks";
import { createCheckoutSession } from "@/lib/create-checkout";
import { remainingToFreeShipping, shippingOptions } from "@/lib/shipping";
import { useShop } from "@/lib/shop-store";
import { useSkateCatalog } from "@/lib/skate-host";

export function CartSheet() {
  const open = useShop((state) => state.cartOpen);
  const setCartOpen = useShop((state) => state.setCartOpen);
  const lines = useShop((state) => state.lines);
  const setQty = useShop((state) => state.setQty);
  const remove = useShop((state) => state.remove);
  const clear = useShop((state) => state.clear);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
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
  const [standard, expedited] = shippingOptions(subtotal);
  const remaining = remainingToFreeShipping(subtotal);

  async function pay() {
    setBusy(true);
    setError("");
    try {
      const session = await createCheckoutSession({
        data: {
          lines: rows.map((row) => ({
            slug: row.slug,
            quantity: row.qty,
            size: row.size,
            colorId: row.colorId,
            backPrint: row.backPrint,
            art: row.art,
            ink: row.ink,
            blankId: row.blankId,
            note: row.note,
            proof: row.proof,
            truck: row.truck,
            wheel: row.wheel,
            grip: row.grip,
          })),
        },
      });
      clear();
      window.location.href = session.url;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Stripe didn’t open.");
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/60" onClick={() => setCartOpen(false)}>
      <div
        role="dialog"
        aria-label="Cart"
        className="flex h-full w-full max-w-md flex-col border-l border-line bg-ink px-5 py-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Cart</h2>
          <button type="button" className="min-h-11 px-2 text-sm uppercase tracking-widest" onClick={() => setCartOpen(false)}>
            Close
          </button>
        </div>
        <p className="mt-1 text-sm text-mute">
          Pay on Stripe. US shipping and state tax are calculated from the address you enter.
        </p>
        <div className="mt-5 flex flex-1 flex-col gap-3 overflow-y-auto">
          {rows.length === 0 ? (
            <p className="border border-line bg-panel px-4 py-6 text-sm text-mute">Cart is empty.</p>
          ) : (
            rows.map((row) => (
              <div key={row.id} className="flex gap-3 border border-line bg-panel p-2">
                {row.art || row.product.looks[0]?.src ? (
                  <img src={row.art ?? row.product.looks[0].src} alt="" className="h-16 w-14 object-cover" />
                ) : (
                  <div className="grid h-16 w-14 place-items-center bg-ink text-[10px] font-bold uppercase">{row.product.tag}</div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{row.product.name}</p>
                  <p className="text-sm text-mute">
                    {row.product.oneSize ? "One size" : `${blankById(row.blankId)?.name ? `${blankById(row.blankId)?.name} · ` : ""}${row.ink ? `${row.ink.replace("-", " ")} · ` : ""}${row.color.name} · ${row.size}`}
                    {row.backPrint ? " · front + back" : ""} · {money(row.price)}
                  </p>
                  {row.note ? <p className="line-clamp-3 whitespace-pre-line text-xs text-mute">{row.note}</p> : null}
                  <div className="mt-2 flex items-center gap-2">
                    <button type="button" className="size-11 border border-line" aria-label="Decrease quantity" onClick={() => setQty(row.id, row.qty - 1)}>
                      −
                    </button>
                    <span className="w-4 text-center text-sm">{row.qty}</span>
                    <button type="button" className="size-11 border border-line" aria-label="Increase quantity" onClick={() => setQty(row.id, row.qty + 1)}>
                      +
                    </button>
                    <button type="button" className="ml-auto text-xs uppercase tracking-widest text-mute" onClick={() => remove(row.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-mute">Pieces</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-mute">{standard?.name}</span>
            <span>{standard && standard.amount === 0 ? "Free" : money(standard?.amount ?? 0)}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-mute">{expedited?.name}</span>
            <span>{money(expedited?.amount ?? 0)}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-mute">State sales tax</span>
            <span className="text-mute">At checkout</span>
          </div>
          {rows.length > 0 && remaining > 0 ? (
            <p className="mt-3 text-xs text-mute">Add {money(remaining)} more for free standard shipping. Free at {money(FREE_SHIP_AT)}.</p>
          ) : rows.length > 0 ? (
            <p className="mt-3 text-xs text-mute">Standard shipping is free on this cart.</p>
          ) : null}
          <p className="mt-2 text-xs text-mute">
            Pick Standard or Expedited on Stripe. You see tax before you pay. Shirts queue for Printful. Bags queue for CJdropshipping.
          </p>
          {error ? (
            <p className="mt-3 text-pink" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="button"
            disabled={rows.length === 0 || busy}
            onClick={() => void pay()}
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center bg-yellow font-semibold uppercase tracking-widest text-yellow-ink disabled:opacity-40"
          >
            {busy ? "Opening Stripe…" : "Checkout with Stripe"}
          </button>
          <Link to="/cart" className="mt-3 inline-flex min-h-11 items-center text-sm underline" onClick={() => setCartOpen(false)}>
            Open the cart page
          </Link>
        </div>
      </div>
    </div>
  );
}
