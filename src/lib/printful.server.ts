import { blankById, blankVariantId } from "@/lib/blanks";
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
  blank_id?: string;
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

async function printfulStoreId(token: string): Promise<number | null> {
  const forced = env("PRINTFUL_STORE_ID");
  if (forced && /^\d+$/.test(forced)) return Number(forced);
  const response = await fetch("https://api.printful.com/stores", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;
  const body = (await response.json()) as { result?: Array<{ id?: number }> };
  const stores = body.result ?? [];
  return stores.length === 1 && stores[0]?.id ? stores[0].id : stores[0]?.id ?? null;
}

function printfulExternalId(id: string): string {
  return `chubz${id.replace(/[^a-zA-Z0-9]/g, "").slice(-24)}`;
}

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
  const storeId = await printfulStoreId(token);
  if (!storeId) return { pushed: false as const, reason: "missing-store" as const };
  const items = [];
  for (const job of jobs) {
    const product = getProduct(job.slug);
    if (!product || product.supplier !== "printful" || product.lane === "bag") continue;
    const blank = blankById(job.blank_id);
    const variantId = blank
      ? blankVariantId(blank.id, job.color_name, job.size)
      : product.lane === "cap"
        ? null
        : printfulVariantId(product.lane, job.color_name, job.size);
    const url = fileUrl(job);
    if (!variantId || !url) continue;
    const files: Array<{ type: string; url: string }> = [{ type: blank?.file ?? "front", url }];
    if (job.back_print && blank?.file !== "embroidery_front") files.push({ type: "back", url });
    items.push({
      variant_id: variantId,
      quantity: job.quantity,
      external_id: printfulExternalId(job.id),
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
      "X-PF-Store-Id": String(storeId),
    },
    body: JSON.stringify({ external_id: printfulExternalId(externalId), confirm: false, recipient, items }),
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
