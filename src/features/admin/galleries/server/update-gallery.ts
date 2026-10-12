import { createServerFn } from "@tanstack/react-start";
import { and, eq, ne } from "drizzle-orm";
import { Galleries } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { updateGalleryInputSchema } from "@/features/admin/galleries/lib/gallery-schema";
import { db } from "@/lib/db";

export const updateGallery = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(updateGalleryInputSchema)
  .handler(async ({ data }) => {
    const { id, isPublished, ...fields } = data;

    const clashes = await db
      .select({ id: Galleries.id })
      .from(Galleries)
      .where(and(eq(Galleries.slug, fields.slug), ne(Galleries.id, id)));
    if (clashes.length) throw new Error("Another gallery uses this URL");

    const gallery = await db.query.Galleries.findFirst({ where: { id } });
    if (!gallery) throw new Error("Gallery not found");

    // Keep the first publish date when the gallery is saved again.
    const publishedAt = isPublished
      ? (gallery.publishedAt ?? new Date())
      : null;
    await db
      .update(Galleries)
      .set({ ...fields, publishedAt })
      .where(eq(Galleries.id, id));
  });
