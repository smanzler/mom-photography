import { z } from "zod";
import { layoutSchema } from "@/lib/gallery-layout";

export const createGalleryInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
});
export type CreateGalleryInput = z.infer<typeof createGalleryInputSchema>;

export const updateGalleryInputSchema = z.object({
  id: z.uuid(),
  title: z.string().trim().min(1).max(200),
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Use lowercase letters, digits and dashes",
    ),
  description: z.string().max(2000).nullable(),
  layout: layoutSchema,
  isPublished: z.boolean(),
});
export type UpdateGalleryInput = z.infer<typeof updateGalleryInputSchema>;

export const galleryIdInputSchema = z.object({ id: z.uuid() });
