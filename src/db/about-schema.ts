import { sql } from "drizzle-orm";
import { check, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { Photos } from "@/db/gallery-schema";

// One row only: the site has one About section.
export const AboutSection = pgTable(
  "about_section",
  {
    id: integer("id").primaryKey().default(1),
    heading: text("heading").notNull(),
    // Paragraphs are separated by a blank line.
    body: text("body").notNull(),
    photoId: uuid("photo_id").references(() => Photos.id, {
      onDelete: "set null",
    }),
  },
  (t) => [check("about_section_single_row", sql`${t.id} = 1`)],
);
