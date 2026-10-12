import { z } from "zod";
import { moveInputSchema } from "@/features/admin/lib/move-schema";
import { spanSchema } from "@/lib/gallery-layout";

export const addGalleryPhotosInputSchema = z.object({
  galleryId: z.uuid(),
  photoIds: z.array(z.uuid()).min(1),
});

export const galleryPhotoInputSchema = z.object({
  galleryId: z.uuid(),
  photoId: z.uuid(),
});

export const updateGalleryPhotoInputSchema = galleryPhotoInputSchema.extend({
  span: spanSchema,
});

export const moveGalleryPhotoInputSchema = moveInputSchema.extend({
  galleryId: z.uuid(),
});

export const setGalleryCoverInputSchema = z.object({
  galleryId: z.uuid(),
  photoId: z.uuid().nullable(),
});
