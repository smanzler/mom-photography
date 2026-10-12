import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { Galleries } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { setGalleryCoverInputSchema } from "@/features/admin/galleries/photos/lib/gallery-photo-schema";
import { db } from "@/lib/db";

export const setGalleryCover = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(setGalleryCoverInputSchema)
  .handler(async ({ data }) => {
    await db
      .update(Galleries)
      .set({ coverPhotoId: data.photoId })
      .where(eq(Galleries.id, data.galleryId));
  });
