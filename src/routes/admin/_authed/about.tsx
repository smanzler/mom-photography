import { createFileRoute } from "@tanstack/react-router";
import { AboutScreen } from "@/features/admin/about/screens/about-screen";
import { listPhotos } from "@/features/admin/photos/server/list-photos";
import { getAboutSection } from "@/lib/get-about-section";

export const Route = createFileRoute("/admin/_authed/about")({
  loader: async () => {
    const [about, library] = await Promise.all([
      getAboutSection(),
      listPhotos(),
    ]);
    return { about, library };
  },
  head: () => ({ meta: [{ title: "About" }] }),
  component: AboutRoute,
});

function AboutRoute() {
  return <AboutScreen {...Route.useLoaderData()} />;
}
