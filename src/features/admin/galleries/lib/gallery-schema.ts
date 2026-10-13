import { z } from "zod";
import { layoutSchema } from "@/lib/gallery-layout";

/** Top-level routes that a gallery URL would hide behind. */
export const RESERVED_SLUGS = ["admin", "api"];

export const createGalleryInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
});
export type CreateGalleryInput = z.infer<typeof createGalleryInputSchema>;

export const updateGalleryInputSchema = z.object({
  id: z.uuid(),
  title: z.string().trim().min(1).max(200),
  description: z.string().max(2000).nullable(),
  layout: layoutSchema,
  isPublished: z.boolean(),
});
export type UpdateGalleryInput = z.infer<typeof updateGalleryInputSchema>;

export const galleryIdInputSchema = z.object({ id: z.uuid() });
