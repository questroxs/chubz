import { useEffect, useState } from "react";

/** Loads deck products for the cart. Kept in its own chunk. */
export function useSkateCatalog() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancel = false;
    void import("@/lib/skate-catalog").then(() => {
      if (!cancel) setReady(true);
    });
    return () => {
      cancel = true;
    };
  }, []);
  return ready;
}
