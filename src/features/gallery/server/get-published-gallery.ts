import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "@/lib/db";

/** `nextGallery` follows in the homepage order and wraps to the first; it is `null` when no other gallery is published. */
export const getPublishedGallery = createServerFn()
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const gallery = await db.query.Galleries.findFirst({
      where: { slug: data.slug, publishedAt: { isNotNull: true } },
      with: {
        coverPhoto: true,
        galleryPhotos: { orderBy: { position: "asc" }, with: { photo: true } },
      },
    });
    if (!gallery) throw notFound();

    const published = await db.query.Galleries.findMany({
      where: { publishedAt: { isNotNull: true } },
      orderBy: { position: "asc" },
      columns: { id: true, slug: true, title: true },
    });
    const index = published.findIndex((other) => other.id === gallery.id);
    const next = published.at((index + 1) % published.length);

    const { title, description, layout, coverPhoto, galleryPhotos } = gallery;
    const photos = galleryPhotos.map(({ photo, span }) => ({ ...photo, span }));

    return {
      title,
      description,
      layout,
      coverPhoto: coverPhoto ?? photos.at(0) ?? null,
      photos,
      nextGallery:
        next && next.id !== gallery.id
          ? { slug: next.slug, title: next.title }
          : null,
    };
  });
