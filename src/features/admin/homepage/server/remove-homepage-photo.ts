import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { HomepagePhotos } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { removeHomepagePhotoInputSchema } from "@/features/admin/homepage/lib/homepage-photo-schema";
import { db } from "@/lib/db";

/** Keeps the photo in the library. */
export const removeHomepagePhoto = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(removeHomepagePhotoInputSchema)
  .handler(async ({ data }) => {
    await db
      .delete(HomepagePhotos)
      .where(eq(HomepagePhotos.photoId, data.photoId));
  });
