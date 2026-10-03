import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { recordHomeVisit } from "@/lib/visits";

const SEEN = "chubz-counted";
let started = false;

/** Sits under the footer on the homepage only. Counts one visit per browser session. */
export function VisitMeter() {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(() => {
    if (started) return;
    started = true;
    const fresh = window.sessionStorage.getItem(SEEN) !== "1";
    void recordHomeVisit({ data: { count: fresh } })
      .then((result) => {
        if (fresh) window.sessionStorage.setItem(SEEN, "1");
        setVisits(result.visits);
      })
      .catch(() => setVisits(null));
  }, []);

  if (path !== "/" || visits == null) return null;

  return (
    <p className="border-t border-line px-4 py-8 text-center text-xs font-semibold uppercase tracking-widest text-mute">
      Visits <span className="text-paper">{visits.toLocaleString("en-US")}</span>
    </p>
  );
}
