import { createServerFn } from "@tanstack/react-start";

export const fulfillPaidSession = createServerFn({ method: "POST" })
  .validator((sessionId: string) => {
    const id = sessionId.trim();
    if (!id.startsWith("cs_")) throw new Error("Missing Stripe session.");
    return id;
  })
  .handler(async ({ data: sessionId }) => {
    const { fulfillPaidSessionOnServer } = await import("@/lib/fulfill-printful.server");
    return fulfillPaidSessionOnServer(sessionId);
  });
