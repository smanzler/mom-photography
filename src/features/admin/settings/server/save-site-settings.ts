import { createServerFn } from "@tanstack/react-start";
import { SiteSettings } from "@/db/schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { db } from "@/lib/db";
import { siteSettingsSchema } from "@/lib/site-settings";

export const saveSiteSettings = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(siteSettingsSchema)
  .handler(async ({ data }) => {
    await db
      .insert(SiteSettings)
      .values(data)
      .onConflictDoUpdate({ target: SiteSettings.id, set: data });
  });
