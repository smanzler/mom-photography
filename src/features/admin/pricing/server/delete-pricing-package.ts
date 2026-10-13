import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { PricingPackages } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { pricingPackageIdInputSchema } from "@/features/admin/pricing/lib/pricing-package-schema";
import { db } from "@/lib/db";

export const deletePricingPackage = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(pricingPackageIdInputSchema)
  .handler(async ({ data }) => {
    await db.delete(PricingPackages).where(eq(PricingPackages.id, data.id));
  });
