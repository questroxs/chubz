import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/order-confirmed")({
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === "string" ? search.session_id : "",
  }),
  head: () => ({ meta: [{ title: "Order in — Chubz" }] }),
  component: ConfirmedPage,
});

function ConfirmedPage() {
  const { session_id: sessionId } = Route.useSearch();
  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-yellow">Paid</p>
      <h1 className="mt-2 font-display text-5xl leading-none">It’s in.</h1>
      <p className="mt-4 text-mute">
        Stripe has the payment, the ship-to, and the tax. The print job (size, color, and your art) is stored
        with this order so it can be pushed to Ninja POD when that hook is connected.
      </p>
      {sessionId ? <p className="mt-4 text-sm text-mute">Stripe session {sessionId}</p> : null}
      <Link
        to="/shop"
        search={{ lane: "all" }}
        className="mt-8 inline-flex min-h-11 items-center bg-pink px-4 font-semibold uppercase tracking-widest text-pink-ink"
      >
        Back to the rack
      </Link>
    </main>
  );
}
