import { createServerFn } from "@tanstack/react-start";
import { asc } from "drizzle-orm";
import { PricingPackages } from "@/db/schema";
import { db } from "@/lib/db";

export const listPricingPackages = createServerFn().handler(async () =>
  db
    .select({
      id: PricingPackages.id,
      name: PricingPackages.name,
      price: PricingPackages.price,
      description: PricingPackages.description,
      features: PricingPackages.features,
      isHighlighted: PricingPackages.isHighlighted,
    })
    .from(PricingPackages)
    .orderBy(asc(PricingPackages.position)),
);
