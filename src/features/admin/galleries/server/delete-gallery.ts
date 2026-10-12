import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { Galleries } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { galleryIdInputSchema } from "@/features/admin/galleries/lib/gallery-schema";
import { db } from "@/lib/db";

/** Keeps the photos in the library. */
export const deleteGallery = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(galleryIdInputSchema)
  .handler(async ({ data }) => {
    await db.delete(Galleries).where(eq(Galleries.id, data.id));
  });
