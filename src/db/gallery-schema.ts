import {
  customType,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { LAYOUTS, SPANS } from "@/lib/gallery-layout";

// Fractional-index keys compare by byte; the default locale collation puts them in the wrong order.
const position = customType<{ data: string }>({
  dataType: () => 'text COLLATE "C"',
});

export const layoutEnum = pgEnum("layout", LAYOUTS);
export const spanEnum = pgEnum("span", SPANS);

export const Photos = pgTable("photos", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique(),
  // Pixels of the original upload.
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  // Small data URL that shows until the photo loads.
  placeholder: text("placeholder").notNull(),
  alt: text("alt").notNull().default(""),
  caption: text("caption"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const Galleries = pgTable("galleries", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  coverPhotoId: uuid("cover_photo_id").references(() => Photos.id, {
    onDelete: "set null",
  }),
  layout: layoutEnum().notNull().default("grid"),
  position: position("position").notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const GalleryPhotos = pgTable(
  "gallery_photos",
  {
    galleryId: uuid("gallery_id")
      .notNull()
      .references(() => Galleries.id, { onDelete: "cascade" }),
    photoId: uuid("photo_id")
      .notNull()
      .references(() => Photos.id, { onDelete: "cascade" }),
    position: position("position").notNull(),
    span: spanEnum().notNull().default("normal"),
  },
  (t) => [
    primaryKey({ columns: [t.galleryId, t.photoId] }),
    index("gallery_photos_photo_id_idx").on(t.photoId),
  ],
);
