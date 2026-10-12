import { createFileRoute } from "@tanstack/react-router";
import { GalleryScreen } from "@/features/gallery/screens/gallery-screen";
import { getPublishedGallery } from "@/features/gallery/server/get-published-gallery";
import { buildImageUrl } from "@/lib/image-url";
import { buildPageHead } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/$gallerySlug")({
  loader: ({ params }) =>
    getPublishedGallery({ data: { slug: params.gallerySlug } }),
  head: ({ loaderData, params }) => {
    if (!loaderData) return {};

    const head = buildPageHead({
      title: `${loaderData.title} — ${SITE.name}`,
      description: loaderData.description ?? SITE.description,
      path: `/${params.gallerySlug}`,
    });
    const image = loaderData.coverPhoto
      ? [
          {
            property: "og:image",
            content: buildImageUrl({
              key: loaderData.coverPhoto.key,
              width: 1200,
            }),
          },
        ]
      : [];

    return { ...head, meta: [...head.meta, ...image] };
  },
  component: GalleryRoute,
});

function GalleryRoute() {
  return <GalleryScreen gallery={Route.useLoaderData()} />;
}
