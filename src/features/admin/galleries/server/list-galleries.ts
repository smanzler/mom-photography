import { createServerFn } from "@tanstack/react-start";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { db } from "@/lib/db";

export const listGalleries = createServerFn()
  .middleware([adminMiddleware])
  .handler(async () =>
    db.query.Galleries.findMany({
      orderBy: { position: "asc" },
      with: { coverPhoto: true },
    }),
  );
