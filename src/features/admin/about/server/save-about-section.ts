import { createServerFn } from "@tanstack/react-start";
import { AboutSection } from "@/db/schema";
import { saveAboutSectionInputSchema } from "@/features/admin/about/lib/about-schema";
import { adminMiddleware } from "@/features/admin/auth/server/admin-middleware";
import { db } from "@/lib/db";

export const saveAboutSection = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(saveAboutSectionInputSchema)
  .handler(async ({ data }) => {
    await db
      .insert(AboutSection)
      .values(data)
      .onConflictDoUpdate({ target: AboutSection.id, set: data });
  });
