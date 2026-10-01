import type { PrintJobRow } from "@/lib/printful.server";

export type SavedJob = {
  id: string;
  slug: string;
  size: string;
  color: string;
  quantity: number;
  back: boolean;
};

/** Stripe metadata values cap at 500 characters. The shirt details ride on the payment so a later request can still print. */
export function encodeJobs(jobs: SavedJob[]): Record<string, string> {
  const meta: Record<string, string> = {};
  let bucket = "";
  let index = 0;
  const key = () => (index === 0 ? "order" : `order${index}`);
  for (const job of jobs) {
    const piece = [job.id, job.slug, job.size, job.color.replaceAll("~", " ").replaceAll(";", ","), String(job.quantity), job.back ? "1" : "0"].join("~");
    if (piece.length > 480) continue;
    const next = bucket ? `${bucket};${piece}` : piece;
    if (next.length > 480 && bucket) {
      meta[key()] = bucket;
      index += 1;
      bucket = piece;
    } else {
      bucket = next;
    }
  }
  if (bucket) meta[key()] = bucket;
  return meta;
}

export function jobsFromMetadata(metadata: Record<string, string> | undefined): PrintJobRow[] {
  if (!metadata) return [];
  const keys = Object.keys(metadata)
    .filter((name) => name === "order" || /^order\d+$/.test(name))
    .sort((a, b) => (a === "order" ? 0 : Number(a.slice(5))) - (b === "order" ? 0 : Number(b.slice(5))));
  const rows: PrintJobRow[] = [];
  for (const name of keys) {
    for (const piece of metadata[name].split(";")) {
      const [id, slug, size, color, qty, back] = piece.split("~");
      const quantity = Number(qty);
      if (!id || !slug || !size || !color || !Number.isFinite(quantity)) continue;
      rows.push({
        id,
        slug,
        size,
        color_name: color,
        quantity,
        back_print: back === "1",
        art: null,
      });
    }
  }
  return rows;
}
