import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { Photos } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { photoIdInputSchema } from "@/features/admin/photos/lib/photo-schema";
import { deleteObject } from "@/features/admin/uploads/lib/r2";
import { db } from "@/lib/db";

/** Also removes the photo from every gallery, and clears it as a gallery cover. */
export const deletePhoto = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(photoIdInputSchema)
  .handler(async ({ data }) => {
    const deleted = await db
      .delete(Photos)
      .where(eq(Photos.id, data.id))
      .returning();
    await Promise.all(deleted.map((photo) => deleteObject(photo.key)));
  });
