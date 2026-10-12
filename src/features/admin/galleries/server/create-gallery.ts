import { createServerFn } from "@tanstack/react-start";
import { like } from "drizzle-orm";
import { Galleries } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import {
  findFreeSlug,
  toSlug,
} from "@/features/admin/galleries/lib/build-slug";
import {
  RESERVED_SLUGS,
  createGalleryInputSchema,
} from "@/features/admin/galleries/lib/gallery-schema";
import { buildPositionAtEnd } from "@/features/admin/lib/build-position";
import { db } from "@/lib/db";

/** Creates an unpublished gallery at the end of the list. */
export const createGallery = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(createGalleryInputSchema)
  .handler(async ({ data }) => {
    const base = toSlug(data.title) || "gallery";
    const [taken, ordered] = await Promise.all([
      db
        .select({ slug: Galleries.slug })
        .from(Galleries)
        .where(like(Galleries.slug, `${base}%`)),
      db
        .select({ id: Galleries.id, position: Galleries.position })
        .from(Galleries)
        .orderBy(Galleries.position),
    ]);

    const [gallery] = await db
      .insert(Galleries)
      .values({
        title: data.title,
        slug: findFreeSlug(base, [
          ...RESERVED_SLUGS,
          ...taken.map((row) => row.slug),
        ]),
        position: buildPositionAtEnd(ordered),
      })
      .returning();
    return gallery;
  });
