import { createServerFn } from "@tanstack/react-start";
import { PricingPackages } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { buildPositionAtEnd } from "@/features/admin/lib/build-position";
import { pricingPackageFieldsSchema } from "@/features/admin/pricing/lib/pricing-package-schema";
import { db } from "@/lib/db";

/** Adds the package at the end of the list. */
export const createPricingPackage = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(pricingPackageFieldsSchema)
  .handler(async ({ data }) => {
    const ordered = await db
      .select({ id: PricingPackages.id, position: PricingPackages.position })
      .from(PricingPackages)
      .orderBy(PricingPackages.position);

    await db
      .insert(PricingPackages)
      .values({ ...data, position: buildPositionAtEnd(ordered) });
  });
