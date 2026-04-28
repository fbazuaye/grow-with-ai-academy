import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ai-business-growth/curriculum")({
  beforeLoad: () => {
    throw redirect({ to: "/programs/ai-business-growth/curriculum" });
  },
});