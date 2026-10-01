import { env } from "@/lib/env.server";
import { ninjaPayload, type NinjaLine } from "@/lib/ninja";

export async function pushNinjaOrder(lines: NinjaLine[], jobIds: string[]) {
  const payload = ninjaPayload(lines, jobIds);
  const url = env("NINJA_POD_API_URL");
  const key = env("NINJA_POD_API_KEY");
  if (!url || !key || payload.items.length === 0) {
    return { pushed: false as const, items: payload.items.length };
  }
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    return { pushed: false as const, items: payload.items.length };
  }
  return { pushed: true as const, items: payload.items.length };
}
