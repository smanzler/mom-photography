import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { PricingPackages } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { updatePricingPackageInputSchema } from "@/features/admin/pricing/lib/pricing-package-schema";
import { db } from "@/lib/db";

export const updatePricingPackage = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(updatePricingPackageInputSchema)
  .handler(async ({ data }) => {
    const { id, ...fields } = data;
    await db
      .update(PricingPackages)
      .set(fields)
      .where(eq(PricingPackages.id, id));
  });
