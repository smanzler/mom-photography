import { createFileRoute } from "@tanstack/react-router";
import { GalleryScreen } from "@/features/admin/galleries/screens/gallery-screen";
import { getGallery } from "@/features/admin/galleries/server/get-gallery";
import { listGalleryPhotos } from "@/features/admin/galleries/photos/server/list-gallery-photos";
import { listPhotos } from "@/features/admin/photos/server/list-photos";

export const Route = createFileRoute("/admin/_authed/galleries/$galleryId")({
  loader: async ({ params }) => {
    const id = params.galleryId;
    const [gallery, photos, library] = await Promise.all([
      getGallery({ data: { id } }),
      listGalleryPhotos({ data: { id } }),
      listPhotos(),
    ]);
    const { title, slug, description, layout, publishedAt, coverPhotoId } =
      gallery;

    return {
      gallery: {
        id,
        title,
        slug,
        description,
        layout,
        isPublished: publishedAt !== null,
      },
      coverPhotoId,
      photos,
      library,
    };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData?.gallery.title ?? "Gallery" }],
  }),
  component: GalleryRoute,
});

function GalleryRoute() {
  return <GalleryScreen {...Route.useLoaderData()} />;
}
