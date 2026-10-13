import { z } from "zod";

export const addHomepagePhotosInputSchema = z.object({
  photoIds: z.array(z.uuid()).min(1),
});

export const removeHomepagePhotoInputSchema = z.object({
  photoId: z.uuid(),
});
