import { createFileRoute } from "@tanstack/react-router";
import { HomeScreen } from "@/features/home/screens/home-screen";
import { listPublishedGalleries } from "@/features/gallery/server/list-published-galleries";
import { listHomepagePhotos } from "@/lib/list-homepage-photos";
import { listPricingPackages } from "@/lib/list-pricing-packages";
import { buildPageHead } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [galleries, heroPhotos, pricingPackages] = await Promise.all([
      listPublishedGalleries(),
      listHomepagePhotos(),
      listPricingPackages(),
    ]);
    return { galleries, heroPhotos, pricingPackages };
  },
  head: () =>
    buildPageHead({
      title: `${SITE.name} — ${SITE.tagline}`,
      description: SITE.description,
      path: "/",
    }),
  component: HomeRoute,
});

function HomeRoute() {
  return <HomeScreen {...Route.useLoaderData()} />;
}
