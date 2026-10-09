import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { colorById, FREE_SHIP_AT, getProduct, money, STANDARD_SHIPPING, unitPrice } from "@/lib/catalog";
import { colorOnBlank, defaultBlankId } from "@/lib/blanks";
import { createCheckoutSession } from "@/lib/create-checkout";
import { useShop } from "@/lib/shop-store";
import { useSkateCatalog } from "@/lib/skate-host";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Chubz" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const hydrated = useShop((state) => state.hydrated);
  const lines = useShop((state) => state.lines);
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
            face: row.face,
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

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-4xl font-semibold">Checkout</h1>
      <p className="mt-3 text-mute">
        Stripe takes the card, the ship-to, and tax. Printful prints the shirt, or embroiders the cap, after the payment.
        Standard shipping is {money(STANDARD_SHIPPING)}, free over {money(FREE_SHIP_AT)}.
      </p>
      {!hydrated ? <p className="mt-6 text-mute">Loading the cart…</p> : null}
      {hydrated && rows.length === 0 ? (
        <p className="mt-6">
          Nothing to pay.{" "}
          <Link to="/shop" search={{ lane: "all" }} className="text-pink underline">
            Shop first.
          </Link>
        </p>
      ) : null}
      {hydrated && rows.length > 0 ? (
        <div className="mt-8">
          <ul className="divide-y divide-line border border-line">
            {rows.map((row) => (
              <li key={row.id} className="flex justify-between gap-3 bg-panel px-4 py-3 text-sm">
                <span>
                  {row.product.name} · {row.color.name} · {row.size}
                  {row.backPrint ? " · front + back" : ""} · ×{row.qty}
                </span>
                <span>{money(row.price * row.qty)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-right text-lg font-semibold">Pieces {money(subtotal)}</p>
          {error ? (
            <p className="mt-4 text-pink" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="button"
            disabled={busy}
            onClick={() => void pay()}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center bg-yellow font-semibold uppercase tracking-widest text-yellow-ink disabled:opacity-40"
          >
            {busy ? "Opening Stripe…" : "Pay with Stripe"}
          </button>
        </div>
      ) : null}
    </main>
  );
}
