import { createServerFn } from "@tanstack/react-start";
import { desc } from "drizzle-orm";
import { Photos } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { db } from "@/lib/db";

export const listPhotos = createServerFn()
  .middleware([adminMiddleware])
  .handler(async () =>
    db.select().from(Photos).orderBy(desc(Photos.createdAt)),
  );
