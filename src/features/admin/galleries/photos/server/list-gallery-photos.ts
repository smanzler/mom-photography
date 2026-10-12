import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { GalleryPhotos, Photos } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { galleryIdInputSchema } from "@/features/admin/galleries/lib/gallery-schema";
import { db } from "@/lib/db";

/** Each item has the photo's fields, with `id` set to the photo id. */
export const listGalleryPhotos = createServerFn()
  .middleware([adminMiddleware])
  .inputValidator(galleryIdInputSchema)
  .handler(async ({ data }) => {
    const rows = await db
      .select()
      .from(GalleryPhotos)
      .innerJoin(Photos, eq(GalleryPhotos.photoId, Photos.id))
      .where(eq(GalleryPhotos.galleryId, data.id))
      .orderBy(asc(GalleryPhotos.position));

    return rows.map((row) => ({
      ...row.photos,
      span: row.gallery_photos.span,
    }));
  });
