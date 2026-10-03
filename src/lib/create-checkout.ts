import { createServerFn } from "@tanstack/react-start";
import type { CheckoutLine } from "@/lib/checkout";

export const createCheckoutSession = createServerFn({ method: "POST" })
  .validator((data: { lines: CheckoutLine[] }) => data)
  .handler(async ({ data }): Promise<{ url: string; livemode: boolean }> => {
    const { registerSkateProducts } = await import("@/lib/skate-catalog");
    registerSkateProducts();
    const { parseCheckoutLines } = await import("@/lib/checkout");
    const lines = parseCheckoutLines(data);
    const { createStripeCheckoutUrl } = await import("@/lib/stripe-session.server");
    return createStripeCheckoutUrl(lines);
  });
