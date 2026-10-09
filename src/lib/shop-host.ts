import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

/** The shop stays on the Vercel preview. mrchubz.com stays the coming soon page. */
export const shopOnThisHost = createServerFn({ method: "GET" }).handler(async () => {
  const request = getRequest();
  const raw = request?.headers.get("x-forwarded-host") || request?.headers.get("host") || "";
  const host = raw.split(",")[0].trim().split(":")[0];
  return host.endsWith("vercel.app") || host === "localhost" || host === "127.0.0.1";
});
