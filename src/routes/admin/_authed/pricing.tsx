import { createFileRoute } from "@tanstack/react-router";
import { PricingScreen } from "@/features/admin/pricing/screens/pricing-screen";
import { listPricingPackages } from "@/lib/list-pricing-packages";

export const Route = createFileRoute("/admin/_authed/pricing")({
  loader: () => listPricingPackages(),
  head: () => ({ meta: [{ title: "Pricing" }] }),
  component: PricingRoute,
});

function PricingRoute() {
  return <PricingScreen packages={Route.useLoaderData()} />;
}
