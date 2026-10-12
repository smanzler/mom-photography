import { z } from "zod";
import { uploadKeySchema } from "@/features/admin/uploads/lib/upload-schema";

export const createPhotoInputSchema = z.object({
  key: uploadKeySchema,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  placeholder: z.string().startsWith("data:image/").max(4096),
  alt: z.string().max(500),
});
export type CreatePhotoInput = z.infer<typeof createPhotoInputSchema>;

export const updatePhotoInputSchema = z.object({
  id: z.uuid(),
  alt: z.string().max(500),
  caption: z.string().max(2000).nullable(),
});
export type UpdatePhotoInput = z.infer<typeof updatePhotoInputSchema>;

export const photoIdInputSchema = z.object({ id: z.uuid() });
