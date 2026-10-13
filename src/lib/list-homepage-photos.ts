import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { HomepagePhotos, Photos } from "@/db/schema";
import { db } from "@/lib/db";

export const listHomepagePhotos = createServerFn().handler(async () => {
  const rows = await db
    .select({ photo: Photos })
    .from(HomepagePhotos)
    .innerJoin(Photos, eq(HomepagePhotos.photoId, Photos.id))
    .orderBy(asc(HomepagePhotos.position));

  return rows.map((row) => row.photo);
});
