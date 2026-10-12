import { createFileRoute } from "@tanstack/react-router";
import { PhotosScreen } from "@/features/admin/photos/screens/photos-screen";
import { listPhotos } from "@/features/admin/photos/server/list-photos";

export const Route = createFileRoute("/admin/_authed/photos")({
  loader: () => listPhotos(),
  head: () => ({ meta: [{ title: "Photos" }] }),
  component: PhotosRoute,
});

function PhotosRoute() {
  return <PhotosScreen photos={Route.useLoaderData()} />;
}
