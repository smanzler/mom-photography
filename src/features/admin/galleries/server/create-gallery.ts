import { createServerFn } from "@tanstack/react-start";
import { Galleries } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { createGalleryInputSchema } from "@/features/admin/galleries/lib/gallery-schema";
import { findGallerySlug } from "@/features/admin/galleries/server/find-gallery-slug";
import { buildPositionAtEnd } from "@/features/admin/lib/build-position";
import { db } from "@/lib/db";

/** Creates an unpublished gallery at the end of the list. */
export const createGallery = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(createGalleryInputSchema)
  .handler(async ({ data }) => {
    const [slug, ordered] = await Promise.all([
      findGallerySlug({ title: data.title }),
      db
        .select({ id: Galleries.id, position: Galleries.position })
        .from(Galleries)
        .orderBy(Galleries.position),
    ]);

    const [gallery] = await db
      .insert(Galleries)
      .values({
        title: data.title,
        slug,
        position: buildPositionAtEnd(ordered),
      })
      .returning();
    return gallery;
  });
