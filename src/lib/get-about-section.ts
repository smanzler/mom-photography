import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";

/** Returns `null` until the About section is saved for the first time. */
export const getAboutSection = createServerFn().handler(async () => {
  const about = await db.query.AboutSection.findFirst({
    with: { photo: true },
  });
  if (!about) return null;

  const { heading, body, photo } = about;
  return { heading, body, photo: photo ?? null };
});
