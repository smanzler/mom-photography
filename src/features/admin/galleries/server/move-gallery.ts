import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { Galleries } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { buildPositionAfter } from "@/features/admin/lib/build-position";
import { moveInputSchema } from "@/features/admin/lib/move-schema";
import { db } from "@/lib/db";

export const moveGallery = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(moveInputSchema)
  .handler(async ({ data }) => {
    const items = await db
      .select({ id: Galleries.id, position: Galleries.position })
      .from(Galleries)
      .orderBy(Galleries.position);

    const position = buildPositionAfter({ items, ...data });
    await db
      .update(Galleries)
      .set({ position })
      .where(eq(Galleries.id, data.id));
  });
