import { createFileRoute } from "@tanstack/react-router";
import { EXPEDITED_SHIPPING, FREE_SHIP_AT, STANDARD_SHIPPING } from "@/lib/catalog";

export const Route = createFileRoute("/policies")({
  head: () => ({
    meta: [
      { title: "Policies — Chubz" },
      { name: "description", content: "Shipping, returns, privacy, and terms for Chubz." },
    ],
  }),
  component: PoliciesPage,
});

function PoliciesPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-pink">Before you buy</p>
      <h1 className="mt-2 text-4xl font-semibold">Policies</h1>
      <p className="mt-3 text-mute">
        Chubz. Questions go to{" "}
        <a className="text-paper underline" href="mailto:questroxs18@gmail.com">
          questroxs18@gmail.com
        </a>
        .
      </p>

      <section id="shipping" className="mt-10 scroll-mt-24">
        <h2 className="text-2xl font-semibold">Shipping</h2>
        <div className="mt-3 space-y-3 text-mute">
          <p>
            Tees and hoodies are printed after you order. Printful makes them in about 2–5 business days, then the carrier takes over.
          </p>
          <p>
            Standard shipping is ${STANDARD_SHIPPING.toFixed(2)} and arrives in 5–10 business days after it leaves the printer. It is free on
            orders of ${FREE_SHIP_AT} or more.
          </p>
          <p>Expedited shipping is ${EXPEDITED_SHIPPING.toFixed(2)} and arrives in 3–6 business days after it leaves the printer.</p>
          <p>Bags ship from the supplier, not from the print shop. They usually leave within a few business days.</p>
        </div>
      </section>

      <section id="returns" className="mt-10 scroll-mt-24">
        <h2 className="text-2xl font-semibold">Returns</h2>
        <div className="mt-3 space-y-3 text-mute">
          <p>
            These are made when you order, so a change of mind is not refundable. If the print is wrong, the shirt is damaged, or the size you
            received is not the size you ordered, email within 14 days of delivery and we will reprint it or refund it.
          </p>
          <p>Unused bags can be returned within 14 days of delivery. You pay the return postage unless the bag arrived damaged or wrong.</p>
          <p>Custom uploads are printed as the file was sent. A file you sent by mistake is not a defect.</p>
        </div>
      </section>

      <section id="privacy" className="mt-10 scroll-mt-24">
        <h2 className="text-2xl font-semibold">Privacy</h2>
        <div className="mt-3 space-y-3 text-mute">
          <p>
            Checkout collects the name, email, and address Stripe needs to take payment and ship the order. Stripe processes the card. Chubz
            does not store the card number.
          </p>
          <p>
            The cart and the chub you picked stay in this browser. We do not sell your information. We share an order only with the printer or
            the bag supplier so they can make it and ship it.
          </p>
          <p>Email questroxs18@gmail.com to ask what we have on you, or to have it deleted.</p>
        </div>
      </section>

      <section id="terms" className="mt-10 scroll-mt-24">
        <h2 className="text-2xl font-semibold">Terms</h2>
        <div className="mt-3 space-y-3 text-mute">
          <p>
            Placing an order means you agree to these policies. Colors on a screen and colors on cotton are close, not identical. The size
            chart on each product is the garment, not your body.
          </p>
          <p>
            You keep the rights to art you upload. You give Chubz permission to print that file for the order you placed. Do not upload art
            you do not have the right to print.
          </p>
          <p>The chub drawings belong to Chubz. Do not resell the artwork on its own.</p>
        </div>
      </section>
    </main>
  );
}
