import { createServerFn } from "@tanstack/react-start";
import { notFound } from "@tanstack/react-router";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { galleryIdInputSchema } from "@/features/admin/galleries/lib/gallery-schema";
import { db } from "@/lib/db";

export const getGallery = createServerFn()
  .middleware([adminMiddleware])
  .validator(galleryIdInputSchema)
  .handler(async ({ data }) => {
    const gallery = await db.query.Galleries.findFirst({
      where: { id: data.id },
    });
    if (!gallery) throw notFound();

    return gallery;
  });
