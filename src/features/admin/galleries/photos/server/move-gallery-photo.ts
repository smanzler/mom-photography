import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq } from "drizzle-orm";
import { GalleryPhotos } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { moveGalleryPhotoInputSchema } from "@/features/admin/galleries/photos/lib/gallery-photo-schema";
import { buildPositionAfter } from "@/features/admin/lib/build-position";
import { db } from "@/lib/db";

/** `id` and `afterId` are photo ids. */
export const moveGalleryPhoto = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(moveGalleryPhotoInputSchema)
  .handler(async ({ data }) => {
    const { galleryId, id, afterId } = data;
    const items = await db
      .select({ id: GalleryPhotos.photoId, position: GalleryPhotos.position })
      .from(GalleryPhotos)
      .where(eq(GalleryPhotos.galleryId, galleryId))
      .orderBy(asc(GalleryPhotos.position));

    const position = buildPositionAfter({ items, id, afterId });
    await db
      .update(GalleryPhotos)
      .set({ position })
      .where(
        and(
          eq(GalleryPhotos.galleryId, galleryId),
          eq(GalleryPhotos.photoId, id),
        ),
      );
  });
