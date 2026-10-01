import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fulfillPaidSession } from "@/lib/fulfill-printful";

export const Route = createFileRoute("/order-confirmed")({
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === "string" ? search.session_id : "",
  }),
  head: () => ({ meta: [{ title: "Order in — Chubz" }] }),
  component: ConfirmedPage,
});

function ConfirmedPage() {
  const { session_id: sessionId } = Route.useSearch();
  const [note, setNote] = useState("Sending the shirts to Printful.");

  useEffect(() => {
    if (!sessionId) {
      setNote("No Stripe session on this page, so nothing was sent to Printful.");
      return;
    }
    let cancel = false;
    fulfillPaidSession({ data: sessionId })
      .then((result) => {
        if (cancel) return;
        if (result.pushed) setNote("Printful has the order as a draft. Nothing prints until you confirm it there.");
        else if (result.reason === "missing-token") setNote("Paid. Printful is not connected yet, so the print job is saved here.");
        else if (result.reason === "missing-store") setNote("Paid. Printful has no store yet, so the print job is saved here.");
        else if (result.reason === "missing-stripe") setNote("The print job is saved. Stripe’s secret is not on the server, so Printful did not get the address.");
        else if (result.reason === "unpaid") setNote("This checkout is not paid, so Printful was not called.");
        else setNote("The print job is saved. Printful did not take the draft yet.");
      })
      .catch(() => {
        if (!cancel) setNote("The print job is saved. Printful did not take the draft yet.");
      });
    return () => {
      cancel = true;
    };
  }, [sessionId]);

  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-yellow">Paid</p>
      <h1 className="mt-2 font-display text-5xl leading-none">It’s in.</h1>
      <p className="mt-4 text-mute">{note}</p>
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
