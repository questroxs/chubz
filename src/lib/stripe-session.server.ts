import { getRequest } from "@tanstack/react-start/server";
import { colorById, getProduct, money, unitPrice } from "@/lib/catalog";
import type { CheckoutLine } from "@/lib/checkout";
import { getSql } from "@/lib/db";
import { env } from "@/lib/env.server";
import { dollarsToCents, shippingOptions } from "@/lib/shipping";
import { flattenStripeParams } from "@/lib/stripe-form";

type StripeSession = {
  id?: string;
  url?: string | null;
  livemode?: boolean;
  error?: { message?: string };
};

function requestOrigin(): string {
  const request = getRequest();
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host")?.split(",")[0]?.trim() || "127.0.0.1:8080";
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto = forwardedProto || (host.startsWith("127.") || host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

function stripeSecret(): string {
  const secret = env("STRIPE_SECRET_KEY");
  if (!secret) {
    throw new Error(
      "Stripe secret is not on this server yet. In Stripe Dashboard open Developers → API keys, copy the Secret key (sk_test_… for now), and send it in this chat so checkout can run. Do not paste a publishable pk_ key.",
    );
  }
  return secret;
}

async function postCheckout(payload: Record<string, unknown>): Promise<StripeSession> {
  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecret()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: flattenStripeParams(payload),
  });
  return (await response.json()) as StripeSession;
}

async function saveJobs(lines: CheckoutLine[]) {
  const sql = await getSql();
  const ids: string[] = [];
  for (const line of lines) {
    const product = getProduct(line.slug);
    const color = colorById(line.colorId);
    const price = unitPrice(line.slug, line.backPrint);
    if (!product || !color || price == null) throw new Error("Cart has a piece we can’t sell.");
    const id = `job_${crypto.randomUUID()}`;
    ids.push(id);
    await sql`
      insert into print_jobs (id, slug, size, color_name, back_print, quantity, unit_price, art)
      values (
        ${id},
        ${line.slug},
        ${line.size},
        ${color.name},
        ${line.backPrint},
        ${line.quantity},
        ${dollarsToCents(price)},
        ${line.art ?? null}
      )
    `;
  }
  return ids;
}

function checkoutPayload(lines: CheckoutLine[], origin: string, jobIds: string[], withImages: boolean, withTax: boolean) {
  const items = lines.map((line, index) => {
    const product = getProduct(line.slug);
    const color = colorById(line.colorId);
    const price = unitPrice(line.slug, line.backPrint);
    if (!product || !color || price == null) throw new Error("Cart has a piece we can’t sell.");
    const name = `${product.name}${line.ink ? ` · ${line.ink.replace("-", " ")} chub` : ""} · ${color.name} · ${line.size}${line.backPrint ? " · front + back" : ""}`;
    return {
      quantity: line.quantity,
      price_data: {
        currency: "usd",
        unit_amount: dollarsToCents(price),
        tax_behavior: "exclusive",
        product_data: {
          name,
          description: `${product.blank}. Ninja POD DTF. Job ${jobIds[index]}.`,
          images: withImages && product.looks[0]?.src ? [`${origin}${product.looks[0].src}`] : undefined,
          metadata: { slug: product.slug, job: jobIds[index], size: line.size, color: color.name },
        },
      },
    };
  });

  const subtotal = lines.reduce((sum, line) => sum + (unitPrice(line.slug, line.backPrint) ?? 0) * line.quantity, 0);

  return {
    mode: "payment",
    submit_type: "pay",
    success_url: `${origin}/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
    customer_creation: "always",
    billing_address_collection: "required",
    phone_number_collection: { enabled: true },
    name_collection: { individual: { enabled: true } },
    shipping_address_collection: { allowed_countries: ["US"] },
    invoice_creation: {
      enabled: true,
      invoice_data: {
        description: `Chubz — ${items.length} print ${items.length === 1 ? "job" : "jobs"}`,
        footer: "Printed by Ninja POD after this payment. Questions stay with Chubz.",
      },
    },
    payment_intent_data: {
      description: `Chubz print order ${money(subtotal)}`,
      metadata: { jobs: jobIds.join(",") },
    },
    custom_text: {
      shipping_address: {
        message: "US only. Ninja POD prints in about 2–4 business days, then the carrier has it. Standard shipping is $7.95, free at $90.",
      },
      submit: { message: "Gear (caps, cans, markers) is not in this charge." },
    },
    metadata: { jobs: jobIds.join(",") },
    automatic_tax: withTax ? { enabled: true } : undefined,
    shipping_options: shippingOptions(subtotal).map((option) => ({
      shipping_rate_data: {
        type: "fixed_amount",
        display_name: option.name,
        tax_behavior: "exclusive",
        fixed_amount: { amount: dollarsToCents(option.amount), currency: "usd" },
        delivery_estimate: {
          minimum: { unit: "business_day", value: option.minDays },
          maximum: { unit: "business_day", value: option.maxDays },
        },
      },
    })),
    line_items: items,
  };
}

export async function createStripeCheckoutUrl(lines: CheckoutLine[]): Promise<{ url: string; livemode: boolean }> {
  const origin = requestOrigin();
  const jobIds = await saveJobs(lines);
  const attempts: Array<[boolean, boolean]> = [
    [true, true],
    [false, true],
    [false, false],
  ];
  let session: StripeSession = {};
  for (const [withImages, withTax] of attempts) {
    session = await postCheckout(checkoutPayload(lines, origin, jobIds, withImages, withTax));
    if (session.url) break;
    const message = session.error?.message?.toLowerCase() ?? "";
    const imageBlocked = message.includes("image") || message.includes("url");
    const taxBlocked = message.includes("automatic tax") || message.includes("head office");
    if (!imageBlocked && !taxBlocked) break;
  }
  if (!session.url) throw new Error(session.error?.message || "Stripe did not return a checkout URL.");
  try {
    const { pushNinjaOrder } = await import("@/lib/ninja.server");
    await pushNinjaOrder(lines, jobIds);
  } catch {
    // Stripe already has the payment link. A Ninja miss must not block checkout.
  }
  return { url: session.url, livemode: Boolean(session.livemode) };
}
