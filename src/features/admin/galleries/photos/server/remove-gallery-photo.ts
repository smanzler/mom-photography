import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { Galleries, GalleryPhotos } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { galleryPhotoInputSchema } from "@/features/admin/galleries/photos/lib/gallery-photo-schema";
import { db } from "@/lib/db";

/** Keeps the photo in the library. Clears the cover when the photo was the cover. */
export const removeGalleryPhoto = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(galleryPhotoInputSchema)
  .handler(async ({ data }) => {
    const { galleryId, photoId } = data;
    await db.transaction(async (tx) => {
      await tx
        .delete(GalleryPhotos)
        .where(
          and(
            eq(GalleryPhotos.galleryId, galleryId),
            eq(GalleryPhotos.photoId, photoId),
          ),
        );
      await tx
        .update(Galleries)
        .set({ coverPhotoId: null })
        .where(
          and(eq(Galleries.id, galleryId), eq(Galleries.coverPhotoId, photoId)),
        );
    });
  });
