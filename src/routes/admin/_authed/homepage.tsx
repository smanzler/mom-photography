import { createFileRoute } from "@tanstack/react-router";
import { HomepageScreen } from "@/features/admin/homepage/screens/homepage-screen";
import { listPhotos } from "@/features/admin/photos/server/list-photos";
import { listHomepagePhotos } from "@/lib/list-homepage-photos";

export const Route = createFileRoute("/admin/_authed/homepage")({
  loader: async () => {
    const [photos, library] = await Promise.all([
      listHomepagePhotos(),
      listPhotos(),
    ]);
    return { photos, library };
  },
  head: () => ({ meta: [{ title: "Homepage" }] }),
  component: HomepageRoute,
});

function HomepageRoute() {
  return <HomepageScreen {...Route.useLoaderData()} />;
}
