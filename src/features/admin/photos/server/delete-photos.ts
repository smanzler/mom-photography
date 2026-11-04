import { createServerFn } from "@tanstack/react-start";
import { inArray } from "drizzle-orm";
import { Photos } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { deletePhotosInputSchema } from "@/features/admin/photos/lib/photo-schema";
import { deleteObject } from "@/features/admin/uploads/lib/r2";
import { db } from "@/lib/db";

/** Also removes the photos from every gallery, and clears them as gallery covers. */
export const deletePhotos = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(deletePhotosInputSchema)
  .handler(async ({ data }) => {
    const deleted = await db
      .delete(Photos)
      .where(inArray(Photos.id, data.ids))
      .returning();
    await Promise.all(deleted.map((photo) => deleteObject(photo.key)));
  });
