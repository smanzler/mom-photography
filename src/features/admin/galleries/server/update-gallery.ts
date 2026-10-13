import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { Galleries } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { updateGalleryInputSchema } from "@/features/admin/galleries/lib/gallery-schema";
import { findGallerySlug } from "@/features/admin/galleries/server/find-gallery-slug";
import { db } from "@/lib/db";

/** Makes the slug from the title again, so a rename changes the gallery URL. */
export const updateGallery = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(updateGalleryInputSchema)
  .handler(async ({ data }) => {
    const { id, isPublished, ...fields } = data;

    const gallery = await db.query.Galleries.findFirst({ where: { id } });
    if (!gallery) throw new Error("Gallery not found");

    const slug = await findGallerySlug({ title: fields.title, exceptId: id });
    // Keep the first publish date when the gallery is saved again.
    const publishedAt = isPublished
      ? (gallery.publishedAt ?? new Date())
      : null;
    await db
      .update(Galleries)
      .set({ ...fields, slug, publishedAt })
      .where(eq(Galleries.id, id));
  });
