import { createServerFn } from "@tanstack/react-start";

export const recordHomeVisit = createServerFn({ method: "POST" })
  .validator((data: { count?: boolean }) => ({ count: data?.count === true }))
  .handler(async ({ data }) => {
    const { nextVisitCount } = await import("@/lib/visits.server");
    const visits = await nextVisitCount(data.count);
    return { visits };
  });
