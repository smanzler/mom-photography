import { z } from "zod";

export const saveAboutSectionInputSchema = z.object({
  heading: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(5000),
  photoId: z.uuid().nullable(),
});
export type SaveAboutSectionInput = z.infer<typeof saveAboutSectionInputSchema>;
