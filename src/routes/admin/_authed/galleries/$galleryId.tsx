import { createFileRoute } from "@tanstack/react-router";
import { GalleryScreen } from "@/features/admin/galleries/screens/gallery-screen";
import { getGallery } from "@/features/admin/galleries/server/get-gallery";

export const Route = createFileRoute("/admin/_authed/galleries/$galleryId")({
  loader: async ({ params }) => {
    const { id, title, slug, description, layout, publishedAt } =
      await getGallery({
        data: { id: params.galleryId },
      });
    return {
      id,
      title,
      slug,
      description,
      layout,
      isPublished: publishedAt !== null,
    };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData?.title ?? "Gallery" }],
  }),
  component: GalleryRoute,
});

function GalleryRoute() {
  return <GalleryScreen gallery={Route.useLoaderData()} />;
}
