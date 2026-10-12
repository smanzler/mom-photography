import { createServerFn } from "@tanstack/react-start";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { createUploadUrl } from "@/features/admin/uploads/lib/r2";
import {
  UPLOAD_KEY_PREFIX,
  createUploadInputSchema,
} from "@/features/admin/uploads/lib/upload-schema";

/**
 * Step 1 of an upload: PUT the file to `uploadUrl` with the same `Content-Type`,
 * then save `key` on the row that owns the file after a check with `hasObject`.
 */
export const createUpload = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(createUploadInputSchema)
  .handler(async ({ data }) => {
    const key = `${UPLOAD_KEY_PREFIX}${crypto.randomUUID()}`;
    const uploadUrl = await createUploadUrl({
      key,
      contentType: data.contentType,
    });

    return { key, uploadUrl };
  });
