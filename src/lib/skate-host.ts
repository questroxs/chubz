import { useEffect, useState } from "react";
import { createServerFn } from "@tanstack/react-start";

/** Skate rack is a preview. mrchubz.com never shows it. */
export function skateHost(hostname: string) {
  const host = hostname.toLowerCase().split(":")[0];
  if (host === "mrchubz.com" || host === "www.mrchubz.com") return false;
  return host === "localhost" || host === "127.0.0.1" || host === "vercel.app" || host.endsWith(".vercel.app");
}

export const skatePageAllowed = createServerFn({ method: "GET" }).handler(async () => {
  const { requestIsSkateHost } = await import("@/lib/skate-request.server");
  return requestIsSkateHost();
});

export function useSkateGate(): "wait" | "yes" | "no" {
  const [gate, setGate] = useState<"wait" | "yes" | "no">("wait");
  useEffect(() => {
    setGate(skateHost(window.location.hostname) ? "yes" : "no");
  }, []);
  return gate;
}

export function useSkateRack() {
  return useSkateGate() === "yes";
}

/** Loads the deck list only after the host check. Keeps it off the public shop bundle. */
export function useSkateCatalog() {
  const on = useSkateRack();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!on) return;
    let cancel = false;
    void import("@/lib/skate-catalog").then(() => {
      if (!cancel) setReady(true);
    });
    return () => {
      cancel = true;
    };
  }, [on]);
  return ready;
}
