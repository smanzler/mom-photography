import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { HomepagePhotos } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { buildPositionAfter } from "@/features/admin/lib/build-position";
import { moveInputSchema } from "@/features/admin/lib/move-schema";
import { db } from "@/lib/db";

/** `id` and `afterId` are photo ids. */
export const moveHomepagePhoto = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(moveInputSchema)
  .handler(async ({ data }) => {
    const { id, afterId } = data;
    const items = await db
      .select({ id: HomepagePhotos.photoId, position: HomepagePhotos.position })
      .from(HomepagePhotos)
      .orderBy(asc(HomepagePhotos.position));

    const position = buildPositionAfter({ items, id, afterId });
    await db
      .update(HomepagePhotos)
      .set({ position })
      .where(eq(HomepagePhotos.photoId, id));
  });
