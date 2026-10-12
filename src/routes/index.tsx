import { createFileRoute } from "@tanstack/react-router";
import { HomeScreen } from "@/features/gallery/screens/home-screen";
import { listPublishedGalleries } from "@/features/gallery/server/list-published-galleries";
import { buildPageHead } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  loader: () => listPublishedGalleries(),
  head: () =>
    buildPageHead({
      title: `${SITE.name} — ${SITE.tagline}`,
      description: SITE.description,
      path: "/",
    }),
  component: HomeRoute,
});

function HomeRoute() {
  return <HomeScreen galleries={Route.useLoaderData()} />;
}
