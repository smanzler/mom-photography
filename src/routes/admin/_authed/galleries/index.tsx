import { createFileRoute } from "@tanstack/react-router";
import { GalleriesScreen } from "@/features/admin/galleries/screens/galleries-screen";
import { listGalleries } from "@/features/admin/galleries/server/list-galleries";

export const Route = createFileRoute("/admin/_authed/galleries/")({
  loader: () => listGalleries(),
  head: () => ({ meta: [{ title: "Galleries" }] }),
  component: GalleriesRoute,
});

function GalleriesRoute() {
  return <GalleriesScreen galleries={Route.useLoaderData()} />;
}
