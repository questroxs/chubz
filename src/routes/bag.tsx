import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/bag")({
  beforeLoad: () => {
    throw redirect({ to: "/cart" });
  },
});
