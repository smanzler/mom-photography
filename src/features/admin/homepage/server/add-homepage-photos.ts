import { createServerFn } from "@tanstack/react-start";
import { desc } from "drizzle-orm";
import { generateNKeysBetween } from "fractional-indexing";
import { HomepagePhotos } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { addHomepagePhotosInputSchema } from "@/features/admin/homepage/lib/homepage-photo-schema";
import { db } from "@/lib/db";

/** Adds the photos at the end, in the given order. Skips photos that are already on the homepage. */
export const addHomepagePhotos = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(addHomepagePhotosInputSchema)
  .handler(async ({ data }) => {
    const last = await db
      .select({ position: HomepagePhotos.position })
      .from(HomepagePhotos)
      .orderBy(desc(HomepagePhotos.position))
      .limit(1);

    const positions = generateNKeysBetween(
      last.at(0)?.position ?? null,
      null,
      data.photoIds.length,
    );
    await db
      .insert(HomepagePhotos)
      .values(
        data.photoIds.map((photoId, i) => ({
          photoId,
          position: positions[i],
        })),
      )
      .onConflictDoNothing();
  });
