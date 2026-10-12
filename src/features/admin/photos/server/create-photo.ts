import { createServerFn } from "@tanstack/react-start";
import { Photos } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { createPhotoInputSchema } from "@/features/admin/photos/lib/photo-schema";
import { hasObject } from "@/features/admin/uploads/lib/r2";
import { db } from "@/lib/db";

/** Call after the PUT to the URL from `createUpload` is done. */
export const createPhoto = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(createPhotoInputSchema)
  .handler(async ({ data }) => {
    if (!(await hasObject(data.key))) throw new Error("Upload not found");

    const [photo] = await db.insert(Photos).values(data).returning();
    return photo;
  });
