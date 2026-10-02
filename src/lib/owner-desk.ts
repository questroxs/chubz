import { useEffect, useState } from "react";
import { createServerFn } from "@tanstack/react-start";

export type OwnerDesk = {
  costs: Record<string, number>;
  notes: Record<string, string>;
  gearNote: string;
};

export const getOwnerWholesale = createServerFn({ method: "GET" }).handler(async (): Promise<OwnerDesk | null> => {
  const { ownerWholesale } = await import("@/lib/wholesale.server");
  return ownerWholesale();
});

/** Null on mrchubz.com. The cost sheet loads only on a vercel.app host. */
export function useOwnerDesk() {
  const [desk, setDesk] = useState<OwnerDesk | null>(null);
  useEffect(() => {
    const host = window.location.hostname.toLowerCase();
    if (!(host === "vercel.app" || host.endsWith(".vercel.app"))) return;
    void getOwnerWholesale()
      .then(setDesk)
      .catch(() => setDesk(null));
  }, []);
  return desk;
}
