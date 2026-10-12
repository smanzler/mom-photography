import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";

/** Uses the first photo when a gallery has no cover. */
export const listPublishedGalleries = createServerFn().handler(async () => {
  const galleries = await db.query.Galleries.findMany({
    where: { publishedAt: { isNotNull: true } },
    orderBy: { position: "asc" },
    with: {
      coverPhoto: true,
      galleryPhotos: {
        orderBy: { position: "asc" },
        limit: 1,
        with: { photo: true },
      },
    },
  });

  return galleries.map(
    ({ id, slug, title, description, coverPhoto, galleryPhotos }) => ({
      id,
      slug,
      title,
      description,
      coverPhoto: coverPhoto ?? galleryPhotos.at(0)?.photo ?? null,
    }),
  );
});
