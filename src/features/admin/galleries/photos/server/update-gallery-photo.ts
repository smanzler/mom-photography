import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { GalleryPhotos } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { updateGalleryPhotoInputSchema } from "@/features/admin/galleries/photos/lib/gallery-photo-schema";
import { db } from "@/lib/db";

export const updateGalleryPhoto = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(updateGalleryPhotoInputSchema)
  .handler(async ({ data }) => {
    const { galleryId, photoId, span } = data;
    await db
      .update(GalleryPhotos)
      .set({ span })
      .where(
        and(
          eq(GalleryPhotos.galleryId, galleryId),
          eq(GalleryPhotos.photoId, photoId),
        ),
      );
  });
