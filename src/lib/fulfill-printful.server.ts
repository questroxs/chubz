import { getSql } from "@/lib/db";
import { env } from "@/lib/env.server";
import { pushPrintfulDraft, type PrintJobRow, type PrintfulRecipient } from "@/lib/printful.server";

type StripeSession = {
  payment_status?: string;
  metadata?: { jobs?: string };
  customer_details?: { email?: string | null; phone?: string | null; name?: string | null };
  shipping_details?: {
    name?: string | null;
    address?: {
      line1?: string | null;
      city?: string | null;
      state?: string | null;
      postal_code?: string | null;
      country?: string | null;
    } | null;
  } | null;
  error?: { message?: string };
};

function recipientFrom(session: StripeSession): PrintfulRecipient | null {
  const address = session.shipping_details?.address;
  const name = session.shipping_details?.name || session.customer_details?.name;
  if (!address?.line1 || !address.city || !address.state || !address.postal_code || !address.country || !name) {
    return null;
  }
  return {
    name,
    address1: address.line1,
    city: address.city,
    state_code: address.state,
    country_code: address.country,
    zip: address.postal_code,
    email: session.customer_details?.email ?? undefined,
    phone: session.customer_details?.phone ?? undefined,
  };
}

export async function fulfillPaidSessionOnServer(sessionId: string) {
    const secret = env("STRIPE_SECRET_KEY");
    if (!secret) return { pushed: false as const, reason: "missing-stripe" as const };
    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const session = (await response.json()) as StripeSession;
    if (!response.ok) return { pushed: false as const, reason: session.error?.message ?? "Stripe session missing." };
    if (session.payment_status !== "paid") return { pushed: false as const, reason: "unpaid" as const };
    const recipient = recipientFrom(session);
    if (!recipient) return { pushed: false as const, reason: "missing-address" as const };
    const ids = (session.metadata?.jobs ?? "").split(",").map((id) => id.trim()).filter(Boolean);
    if (ids.length === 0) return { pushed: false as const, reason: "no-jobs" as const };
    const sql = await getSql();
    const rows = await sql.query<PrintJobRow>(
      "select id, slug, size, color_name, back_print, quantity, art from print_jobs where id = any($1::text[])",
      [ids],
    );
    return pushPrintfulDraft(rows, recipient, sessionId);
}
