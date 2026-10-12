import { z } from "zod";

/** Put item `id` directly after `afterId`; `afterId: null` puts it first. */
export const moveInputSchema = z.object({
  id: z.uuid(),
  afterId: z.uuid().nullable(),
});
export type MoveInput = z.infer<typeof moveInputSchema>;
