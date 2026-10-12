import { z } from "zod";

export const UPLOAD_KEY_PREFIX = "photos/";

export const imageContentTypeSchema = z.enum([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);
export type ImageContentType = z.infer<typeof imageContentTypeSchema>;

export const createUploadInputSchema = z.object({
  contentType: imageContentTypeSchema,
});
export type CreateUploadInput = z.infer<typeof createUploadInputSchema>;

export const uploadKeySchema = z.string().startsWith(UPLOAD_KEY_PREFIX);
