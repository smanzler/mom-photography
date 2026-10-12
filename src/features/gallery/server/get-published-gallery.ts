import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "@/lib/db";

export const getPublishedGallery = createServerFn()
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const gallery = await db.query.Galleries.findFirst({
      where: { slug: data.slug, publishedAt: { isNotNull: true } },
      with: {
        coverPhoto: true,
        galleryPhotos: { orderBy: { position: "asc" }, with: { photo: true } },
      },
    });
    if (!gallery) throw notFound();

    const { title, description, layout, coverPhoto, galleryPhotos } = gallery;
    const photos = galleryPhotos.map(({ photo, span }) => ({ ...photo, span }));

    return {
      title,
      description,
      layout,
      coverPhoto: coverPhoto ?? photos.at(0) ?? null,
      photos,
    };
  });
