import { createFileRoute } from "@tanstack/react-router";
import { HomeScreen } from "@/features/home/screens/home-screen";
import { listPublishedGalleries } from "@/features/gallery/server/list-published-galleries";
import { getAboutSection } from "@/lib/get-about-section";
import { listHomepagePhotos } from "@/lib/list-homepage-photos";
import { listPricingPackages } from "@/lib/list-pricing-packages";
import { buildPageHead, buildSiteTitle } from "@/lib/seo";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [galleries, heroPhotos, pricingPackages, about] = await Promise.all([
      listPublishedGalleries(),
      listHomepagePhotos(),
      listPricingPackages(),
      getAboutSection(),
    ]);
    return { galleries, heroPhotos, pricingPackages, about };
  },
  head: ({ match }) =>
    buildPageHead({
      title: buildSiteTitle(match.context.site),
      description: match.context.site.description,
      path: "/",
    }),
  component: HomeRoute,
});

function HomeRoute() {
  return <HomeScreen {...Route.useLoaderData()} />;
}
