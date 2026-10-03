import type { CheckoutLine } from "@/lib/checkout";
import { getProduct } from "@/lib/catalog";
import { env } from "@/lib/env.server";

const LINK_DAYS = 60;

function jpegFromArt(art: string): Uint8Array | null {
  const match = /^data:image\/jpeg;base64,([A-Za-z0-9+/=\s]+)$/.exec(art);
  if (!match) return null;
  const bytes = Buffer.from(match[1].replace(/\s/g, ""), "base64");
  if (bytes.length < 100 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  return bytes;
}

function stripeError(body: { error?: { message?: string } }, status: number): string {
  return body.error?.message || `Stripe file upload failed (${status})`;
}

/** Puts a deck JPEG on Stripe and returns a link the shop owner can open without a login. */
export async function hostDeckGraphic(
  jpeg: Uint8Array,
  filename: string,
): Promise<{ url: string } | { error: string }> {
  const secret = env("STRIPE_SECRET_KEY");
  if (!secret) return { error: "Stripe secret is missing" };
  const safeName = filename.replace(/[^a-z0-9.-]/gi, "") || "deck.jpg";
  const expires = Math.floor(Date.now() / 1000) + LINK_DAYS * 24 * 60 * 60;
  const boundary = `----chubz${crypto.randomUUID().replaceAll("-", "")}`;
  const enc = new TextEncoder();
  const field = (name: string, value: string) =>
    enc.encode(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`);
  const parts = [
    field("purpose", "dispute_evidence"),
    field("file_link_data[create]", "true"),
    field("file_link_data[expires_at]", String(expires)),
    enc.encode(
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${safeName}"\r\nContent-Type: image/jpeg\r\n\r\n`,
    ),
    jpeg,
    enc.encode(`\r\n--${boundary}--\r\n`),
  ];
  const length = parts.reduce((sum, part) => sum + part.length, 0);
  const body = new Uint8Array(length);
  let offset = 0;
  for (const part of parts) {
    body.set(part, offset);
    offset += part.length;
  }
  const response = await fetch("https://files.stripe.com/v1/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
    },
    body,
    signal: AbortSignal.timeout(12_000),
  });
  const file = (await response.json()) as {
    id?: string;
    error?: { message?: string };
    links?: { data?: Array<{ url?: string }> };
  };
  if (!response.ok) return { error: stripeError(file, response.status) };
  const linked = file.links?.data?.find((link) => link.url)?.url;
  if (linked) return { url: linked };
  if (!file.id) return { error: "Stripe stored the file but returned no id" };
  const linkResponse = await fetch("https://api.stripe.com/v1/file_links", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ file: file.id, expires_at: String(expires) }),
    signal: AbortSignal.timeout(12_000),
  });
  const link = (await linkResponse.json()) as { url?: string; error?: { message?: string } };
  if (!linkResponse.ok || !link.url) return { error: stripeError(link, linkResponse.status) };
  return { url: link.url };
}

/** One link per cart line. Null when that line is not a deck graphic. */
export async function hostSkateArt(lines: CheckoutLine[]): Promise<Array<string | null>> {
  await import("@/lib/skate-catalog");
  const urls: Array<string | null> = [];
  for (const line of lines) {
    const product = getProduct(line.slug);
    if (!product || product.lane !== "skate" || product.supplier !== "point" || !line.art) {
      urls.push(null);
      continue;
    }
    const jpeg = jpegFromArt(line.art);
    if (!jpeg) {
      urls.push(null);
      continue;
    }
    const hosted = await hostDeckGraphic(jpeg, `${line.slug}.jpg`);
    urls.push("url" in hosted ? hosted.url : null);
  }
  return urls;
}
