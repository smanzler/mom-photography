import { z } from "zod";

export const pricingPackageFieldsSchema = z.object({
  name: z.string().trim().min(1).max(100),
  price: z.string().trim().min(1).max(50),
  description: z.string().trim().max(500).nullable(),
  features: z.array(z.string().trim().min(1).max(200)).max(20),
  isHighlighted: z.boolean(),
});
export type PricingPackageFields = z.infer<typeof pricingPackageFieldsSchema>;

export const updatePricingPackageInputSchema =
  pricingPackageFieldsSchema.extend({ id: z.uuid() });

export const pricingPackageIdInputSchema = z.object({ id: z.uuid() });
