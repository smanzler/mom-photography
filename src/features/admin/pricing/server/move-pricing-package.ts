import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { PricingPackages } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { buildPositionAfter } from "@/features/admin/lib/build-position";
import { moveInputSchema } from "@/features/admin/lib/move-schema";
import { db } from "@/lib/db";

export const movePricingPackage = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(moveInputSchema)
  .handler(async ({ data }) => {
    const items = await db
      .select({ id: PricingPackages.id, position: PricingPackages.position })
      .from(PricingPackages)
      .orderBy(PricingPackages.position);

    const position = buildPositionAfter({ items, ...data });
    await db
      .update(PricingPackages)
      .set({ position })
      .where(eq(PricingPackages.id, data.id));
  });
