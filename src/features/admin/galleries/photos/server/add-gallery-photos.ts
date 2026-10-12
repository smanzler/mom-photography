import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { generateNKeysBetween } from "fractional-indexing";
import { GalleryPhotos } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { addGalleryPhotosInputSchema } from "@/features/admin/galleries/photos/lib/gallery-photo-schema";
import { db } from "@/lib/db";

/** Adds the photos at the end, in the given order. Skips photos that are already in the gallery. */
export const addGalleryPhotos = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(addGalleryPhotosInputSchema)
  .handler(async ({ data }) => {
    const { galleryId, photoIds } = data;
    const last = await db
      .select({ position: GalleryPhotos.position })
      .from(GalleryPhotos)
      .where(eq(GalleryPhotos.galleryId, galleryId))
      .orderBy(desc(GalleryPhotos.position))
      .limit(1);

    const positions = generateNKeysBetween(
      last.at(0)?.position ?? null,
      null,
      photoIds.length,
    );
    await db
      .insert(GalleryPhotos)
      .values(
        photoIds.map((photoId, i) => ({
          galleryId,
          photoId,
          position: positions[i],
        })),
      )
      .onConflictDoNothing();
  });
