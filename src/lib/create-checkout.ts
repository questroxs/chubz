import { createServerFn } from "@tanstack/react-start";
import { parseCheckoutLines, type CheckoutLine } from "@/lib/checkout";

export const createCheckoutSession = createServerFn({ method: "POST" })
  .validator((data: { lines: CheckoutLine[] }) => ({ lines: parseCheckoutLines(data) }))
  .handler(async ({ data }): Promise<{ url: string; livemode: boolean }> => {
    const { createStripeCheckoutUrl } = await import("@/lib/stripe-session.server");
    return createStripeCheckoutUrl(data.lines);
  });
