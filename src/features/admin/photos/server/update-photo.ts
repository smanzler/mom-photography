import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { Photos } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { updatePhotoInputSchema } from "@/features/admin/photos/lib/photo-schema";
import { db } from "@/lib/db";

export const updatePhoto = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(updatePhotoInputSchema)
  .handler(async ({ data }) => {
    const { id, alt, caption } = data;
    await db.update(Photos).set({ alt, caption }).where(eq(Photos.id, id));
  });
