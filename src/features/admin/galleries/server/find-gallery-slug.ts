import { and, like, ne } from "drizzle-orm";
import { Galleries } from "@/db/schema";
import {
  findFreeSlug,
  toSlug,
} from "@/features/admin/galleries/lib/build-slug";
import { RESERVED_SLUGS } from "@/features/admin/galleries/lib/gallery-schema";
import { db } from "@/lib/db";

/** Makes the slug from `title`. Set `exceptId` to the gallery being renamed, so it can keep its own slug. */
export const findGallerySlug = async ({
  title,
  exceptId,
}: {
  title: string;
  exceptId?: string;
}) => {
  const base = toSlug(title) || "gallery";
  const taken = await db
    .select({ slug: Galleries.slug })
    .from(Galleries)
    .where(
      and(
        like(Galleries.slug, `${base}%`),
        exceptId ? ne(Galleries.id, exceptId) : undefined,
      ),
    );

  return findFreeSlug(base, [
    ...RESERVED_SLUGS,
    ...taken.map((row) => row.slug),
  ]);
};
