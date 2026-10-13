import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "@/lib/db";

export const siteSettingsSchema = z.object({
  name: z.string().trim().min(1).max(100),
  tagline: z.string().trim().max(200),
  description: z.string().trim().max(500),
  email: z.email().nullable(),
});
export type SiteSettings = z.infer<typeof siteSettingsSchema>;

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  name: "Photography",
  tagline: "",
  description: "",
  email: null,
};

/** Server only. Returns the defaults until the settings are saved in admin. */
export const findSiteSettings = async (): Promise<SiteSettings> => {
  const settings = await db.query.SiteSettings.findFirst();
  if (!settings) return DEFAULT_SITE_SETTINGS;

  const { name, tagline, description, email } = settings;
  return { name, tagline, description, email };
};

export const getSiteSettings = createServerFn().handler(findSiteSettings);
