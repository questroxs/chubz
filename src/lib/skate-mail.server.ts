import type { CheckoutLine } from "@/lib/checkout";
import { getProduct } from "@/lib/catalog";
import { sendSkateGraphic } from "@/lib/skate-mail.mjs";

function jpegFromArt(art: string): Uint8Array | null {
  const match = /^data:image\/jpeg;base64,([A-Za-z0-9+/=\s]+)$/.exec(art);
  if (!match) return null;
  const bytes = Buffer.from(match[1].replace(/\s/g, ""), "base64");
  if (bytes.length < 100 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  return bytes;
}

/** Emails each skate-deck JPEG on the order. Never throws; checkout still runs if mail fails. */
export async function emailSkateGraphics(lines: CheckoutLine[]): Promise<{ sent: number; detail: string }> {
  await import("@/lib/skate-catalog");
  let sent = 0;
  let detail = "no-deck-art";
  for (const line of lines) {
    const product = getProduct(line.slug);
    if (!product || product.lane !== "skate" || product.supplier !== "point" || !line.art) continue;
    const jpeg = jpegFromArt(line.art);
    const proof = line.proof ? jpegFromArt(line.proof) : null;
    if (!jpeg) {
      detail = "bad-jpeg";
      continue;
    }
    try {
      detail = await sendSkateGraphic({
        subject: `Chubz deck graphic · ${product.name}`,
        message: `${product.name}\nSlug ${line.slug}\nQty ${line.quantity}\n${line.note ?? "No placement note."}\n\nThe first JPEG is the file they uploaded. The second, if attached, is how they placed it. Neither is a full 2700×10200 print file unless their upload already was.`,
        filename: `${line.slug}.jpg`,
        jpeg,
        proof: proof ?? undefined,
        proofName: `${line.slug}-placement.jpg`,
      });
      sent += 1;
    } catch (error) {
      detail = error instanceof Error ? error.message : "mail failed";
    }
  }
  return { sent, detail };
}
