import { getProduct } from "@/lib/catalog";
import { env } from "@/lib/env.server";
import { printfulVariantId } from "@/lib/printful-variants";

export type PrintJobRow = {
  id: string;
  slug: string;
  size: string;
  color_name: string;
  back_print: boolean;
  quantity: number;
  art: string | null;
};

export type PrintfulRecipient = {
  name: string;
  address1: string;
  city: string;
  state_code: string;
  country_code: string;
  zip: string;
  email?: string;
  phone?: string;
};

const ART_ORIGIN = "https://mrchubz.com";

function fileUrl(job: PrintJobRow): string | null {
  if (job.art?.startsWith("https://")) return job.art;
  const product = getProduct(job.slug);
  if (!product || product.custom || !product.art.startsWith("/")) return null;
  return `${ART_ORIGIN}${product.art}`;
}

/** Draft only. Printful does not print or charge until the draft is confirmed in their dashboard. */
export async function pushPrintfulDraft(jobs: PrintJobRow[], recipient: PrintfulRecipient, externalId: string) {
  const token = env("PRINTFUL_API_TOKEN");
  if (!token) return { pushed: false as const, reason: "missing-token" as const };
  const items = [];
  for (const job of jobs) {
    const product = getProduct(job.slug);
    if (!product || product.supplier !== "printful" || product.lane === "bag") continue;
    const variantId = printfulVariantId(product.lane, job.color_name, job.size);
    const url = fileUrl(job);
    if (!variantId || !url) continue;
    const files = [{ type: "front", url }];
    if (job.back_print) files.push({ type: "back", url });
    items.push({
      variant_id: variantId,
      quantity: job.quantity,
      external_id: job.id,
      name: product.name,
      files,
    });
  }
  if (items.length === 0) return { pushed: false as const, reason: "nothing-to-print" as const };
  const response = await fetch("https://api.printful.com/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ external_id: externalId, confirm: false, recipient, items }),
  });
  const body = (await response.json().catch(() => ({}))) as {
    result?: { id?: number };
    error?: { message?: string };
  };
  if (!response.ok) {
    const message = body.error?.message ?? "Printful refused the draft.";
    if (/external.?id/i.test(message)) return { pushed: true as const, duplicate: true as const };
    return { pushed: false as const, reason: message };
  }
  return { pushed: true as const, id: body.result?.id };
}
